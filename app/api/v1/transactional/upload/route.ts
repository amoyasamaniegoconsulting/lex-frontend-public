import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws/s3";

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();
    const file = formData.get("file") as Blob;
    const path = 'transactional'
    const url = formData.get("url") as string;

    

    if (!file || !path) {
      return NextResponse.json({ error: "Archivo o ruta faltante" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${path}/${url}`;

    console.log('Archivo Subido:' +file);

    const uploadParams = {
      Bucket: process.env.NEXT_AWS_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
