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

export async function UploadAnyToS3(form: FormData, key: string) {
    const file = form.get('file') as File
    if (!file) {
        throw new Error('Archivo no especificado')
    }

    const { userId } = auth()
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extension = path.extname(file.name) || ''
    const uuidFileName = `${randomUUID()}${extension}`
    const fileKey = `generates/${userId}/${key}/${uuidFileName}`

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
    })

    try {
        await s3Client.send(command)

        return {
            success: true,
            message: 'Archivo subido a S3',
            fileKey
        }

    } catch (error) {
        console.error('Error subiendo a S3:', error)
        return { success: false, message: 'Error al subir a S3' }
    }
}
