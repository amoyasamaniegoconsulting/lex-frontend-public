import { ExecutionEnvironment } from "@/types/executor";

import { TransformToPDFTask } from "../task/TransformToPDF";
import { UploadAnyToS3 } from "@/actions/aws/s3/uploadAnyToS3";
import { TransformFileToPDFFromPython } from "@/actions/python/transformFileToPDFFromPython";

export async function TransformToPDFExecutor(
  environment: ExecutionEnvironment<typeof TransformToPDFTask>
): Promise<boolean> {
  try {
    const dataClean = environment.getInput("Data Clean");
    console.log("@DATA CLEAN", dataClean);

    if (!dataClean) {
      environment.log.error("Data is not provided");
      return false;
    }

    environment.log.info("Iniciando transformación a PDF");

    const transformToPDF = await TransformFileToPDFFromPython(dataClean);
    if (!transformToPDF.success) {
      environment.log.error(transformToPDF.message!);
      return false;
    }

    // Crear blob con tipo MIME PDF
    const pdfBlob = new Blob([transformToPDF.dataPDF!], {
      type: "application/pdf",
    });

    // Crear archivo con extensión .pdf
    const pdfFile = new File([pdfBlob], "archivo.pdf", {
      type: "application/pdf",
    });

    // Preparar FormData
    const formData = new FormData();
    formData.append("file", pdfFile);

    environment.log.info("Fin de la transformación a PDF");
    environment.log.info("Iniciando subida del archivo a S3");

    const uploadToS3 = await UploadAnyToS3(formData, "pdf");

    if (!uploadToS3.success) {
      environment.log.error(uploadToS3.message!);
      return false;
    }

    environment.log.info("Finalizando subida del archivo a S3");
    environment.log.info("Generando Link de descarga");

    environment.setOutput("Url", uploadToS3.fileKey!);
    environment.log.info("Listo para descargar");

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
