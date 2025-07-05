'use server';
import { s3Client } from "@/lib/aws/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const DownloadFromS3 = async (fileKey: string) => {
    try {

        // Generar el presigned URL
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_AWS_BUCKET_NAME!,
            Key: fileKey, // Se usa el key correcto
            ResponseContentDisposition: `attachment; filename="${fileKey.split('/').pop()}"`, // <-- Aquí el cambio
        });

        // Generar el presigned URL con expiración de 60 segundos
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60,

        });

        return presignedUrl;
    } catch (error) {
        throw new Error(`Error al descargar el archivo: ${error}`);
    }
};
