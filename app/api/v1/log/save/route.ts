import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { s3Client } from "@/lib/aws/s3";

export async function POST(req: NextRequest) {
  try {
    // Leer el historial de ejecución del cuerpo de la solicitud
    const { executionHistory }: { executionHistory: string[] } = await req.json();

    // Validación: Si no se recibe el historial, se devuelve un error
    if (!executionHistory || executionHistory.length === 0) {
      return NextResponse.json({ error: "Historial vacío o no proporcionado" }, { status: 400 });
    }

    // Obtener la fecha y hora actual y formatearla
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const timestamp = `[${formattedDate} ${formattedTime}]`;

    // Convertir el historial en un string que será el contenido del archivo
    const historyString = executionHistory.join("\n");

    // Crear la separación con la marca de tiempo
    const separator = `\n====== ${timestamp} ========\n`;

    // Agregar la separación antes de los logs
    const finalString = separator + historyString;

    // Guardar el archivo en la carpeta public/logs
    const logsDir = path.join(process.cwd(), 'public', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const filePath = path.join(logsDir, `${formattedDate}_data.log`);
    
    // Si el archivo ya existe, agregar al archivo existente. Si no, crear uno nuevo.
    fs.appendFileSync(filePath, finalString, 'utf-8');
    console.log(`Historial guardado localmente en: ${filePath}`);

    // Subir el archivo a S3
    const fileName = `logs/${formattedDate}_data.log`;
    const uploadParams = {
      Bucket: process.env.NEXT_AWS_BUCKET_NAME!,
      Key: fileName,
      Body: finalString, // Cuerpo del archivo con el historial
      ContentType: "text/plain", // Tipo de archivo
    };

    // Subir el archivo a S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Historial guardado en S3: ${fileName}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error al guardar los logs" }, { status: 500 });
  }
}
