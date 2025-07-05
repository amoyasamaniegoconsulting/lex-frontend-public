import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/aws/s3";
import { GetSourceByPath } from "@/actions/sources/getSourceByPath";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "El path es requerido." }, { status: 400 });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_AWS_BUCKET_NAME!,
      Prefix: `${path}/`,
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      return NextResponse.json({ error: "No hay archivos en la carpeta." }, { status: 404 });
    }

    const filteredFiles = response.Contents.filter(file => file.Key !== `${path}/`);

    const sortedFiles = filteredFiles.sort((a, b) =>
      b.LastModified!.getTime() - a.LastModified!.getTime()
    );

    const fileList = sortedFiles.map((file) => ({
      fileName: file.Key!.replace(`${path}/`, ""),
      lastModified: file.LastModified!,
      url: `https://${process.env.NEXT_AWS_BUCKET_NAME}.s3.${process.env.NEXT_AWS_REGION}.amazonaws.com/${file.Key}`,
    }));

    const source = await GetSourceByPath(path);

    if (!source) {
      return NextResponse.json({ error: "La fuente de datos no existe" }, { status: 404 });
    }

    if (!source.active) {
      return NextResponse.json({ error: "Las fuentes de datos ya no aceptan más archivos" }, { status: 400 });
    }

    // Agregar o actualizar archivos
    for (const file of fileList) {
      const existingFile = await prisma.origin.findFirst({
        where: {
          originName: file.fileName,
          source: {
            typeSource: {
              id: 1
            }
          }
        },
      });

      if (!existingFile) {
        await prisma.origin.create({
          data: {
            source: {
              connect: {
                id: source.id,
                typeSource: {
                  id: 1
                }
              }
            },
            originName: file.fileName,
            extension: file.fileName.split('.').pop() || '',
            lastModified: file.lastModified,
            url: file.url,
          },
        });
      } else {
        await prisma.origin.update({
          where: {
            id: existingFile.id,
            source: {
              typeSource: {
                id: 1
              }
            }
          },
          data: {
            lastModified: file.lastModified,
          },
        });
      }
    }

    // Eliminar archivos en DB que ya no están en S3
    const filesInDb = await prisma.origin.findMany({
      where: {
        source: {
          id: source.id,
          typeSource: {
            id: 1
          }
        },
      },
    });

    const fileNamesInS3 = new Set(fileList.map(f => f.fileName));

    for (const fileDb of filesInDb) {
      if (!fileNamesInS3.has(fileDb.originName)) {
        await prisma.origin.delete({
          where: {
            id: fileDb.id,
            source: {
              typeSource: {
                id: 1
              }
            }
          }
        });
      }
    }

    return NextResponse.json({ success: true, totalSynced: fileList.length });
  } catch (error: any) {
    console.error("Error al sincronizar S3:", error);
    return NextResponse.json({ error: "Error al obtener las fuentes de datos S3" }, { status: 500 });
  }
}
