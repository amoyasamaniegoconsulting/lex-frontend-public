import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/aws/s3";
import { getAppUrl } from "@/lib/helper/appUrl";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { path, filename } = body;

        if (!path) {
            return NextResponse.json({ error: "El path del archivo es requerido." }, { status: 400 });
        }

        if (!filename) {
            return NextResponse.json({ error: "El nombre del archivo es requerido." }, { status: 400 });
        }

        // Verificar en base de datos
        const file = await prisma.origin.findFirst({
            where: {
                originName: filename,
                source: {
                    name: path,
                },
            },
        });

        if (!file) {
            // No existe, pero se procede a sincronizar vía API
            return await SyncSources(path)
        }

        if (file.active) {
            return NextResponse.json(
                { error: "El archivo se está usando actualmente. Sincronice otro archivo antes de eliminarlo e intenté de nuevo." },
                { status: 400 }
            );
        }

        // Eliminar de S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `${path}/${filename}`,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        return await SyncSources(path)
  

    } catch (error: any) {
        console.error("Error al eliminar archivo:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}


async function SyncSources(path: string) {
    // Sincronizar luego de borrar
    const syncResponse = await fetch(getAppUrl(`aws/s3/sync/sources`), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
    });

    if (!syncResponse.ok) {
        const errorData = await syncResponse.json();
        return NextResponse.json(
            { error: `Error al sincronizar: ${errorData.error || 'desconocido'}` },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Sincronización completada exitosamente.",
    });
}