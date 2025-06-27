'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { s3Client } from '@/lib/aws/s3'
import { createFileFTSchema } from '@/schema/fileft'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import path from 'path'
import { Origin } from '@prisma/client'
import { GetSourceByPath } from '@/actions/sources/getSourceByPath'
import { CreateOrigin } from '@/actions/origins/createOrigin'
import { createOriginSchemaType } from '@/schema/origin'
import { CreateBalancesByFrequency } from '@/actions/balances/createBalancesByFrequency'

export async function UploadToS3(form: FormData) {
    const file = form.get('file') as File
    const frequency = form.get('frequency') as string
    const cutOffDateRaw = form.get('cutOffDate') as string
    const versionRaw = form.get('version') as string | null

    const parsedForm = {
        file,
        frequency,
        cutOffDate: new Date(cutOffDateRaw),
        version: versionRaw ? parseInt(versionRaw) : undefined,
    }

    const { success, data, error } = createFileFTSchema.safeParse(parsedForm)
    if (!success) {
        console.error('❌ Zod validation error:', error.flatten())
        throw new Error('Invalid Form Data')
    }

    const { userId } = auth()
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const arrayBuffer = await data.file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extension = path.extname(data.file.name) || ''
    const uuidFileName = `${randomUUID()}${extension}`
    const fileKey = `files/${userId}/${data.frequency}/v${data.version}/${uuidFileName}`

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: data.file.type,
    })

    try {
        await s3Client.send(command)
        // const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

        let sourceName = '';

        switch (frequency) {
            case '1':
                sourceName = 'BalancesDiario'
                break;
            case '2':
                sourceName = 'BalancesSemanal'
                break;
            case '3':
                sourceName = 'BalancesMensual'
                break;
            case '4':
                sourceName = 'BalancesBimestral'
                break;
            case '5':
                sourceName = 'BalancesTrimestral'
                break;
            case '6':
                sourceName = 'BalancesSemestral'
                break;
            case '7':
                sourceName = 'BalancesAnual'
                break;
            default:
                return { success: false, message: 'Error al subir a S3, frecuencia no válida' }
        }

        const source = await GetSourceByPath(sourceName)
        const originFile: createOriginSchemaType = {
            sourceId: source?.id!,
            originName: uuidFileName,
            extension,
            url: fileKey,
            userId,
            cutOffDate: new Date(cutOffDateRaw),
            frequencyId: parseInt(frequency),
            version: parseInt(versionRaw!),
            active: false,
        }

        const originUpload = await CreateOrigin(originFile)
        const { success, message } = await CreateBalancesByFrequency(form, originUpload)
        if (!success) {
            return { success, message }

        }

        console.log(originUpload);

        return {
            success: true,
            id: originUpload.id,
        }

    } catch (error) {
        console.error('Error subiendo a S3:', error)
        return { success: false, message: 'Error al subir a S3' }
    }
}
