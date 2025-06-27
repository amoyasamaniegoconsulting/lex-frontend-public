import { ExecutionEnvironment } from "@/types/executor";

import { TransformToCSVTask } from "../task/TransformToCSV";
import { UploadAnyToS3 } from "@/actions/aws/s3/uploadAnyToS3";
import { TransformFileToCSVFromPython } from "@/actions/python/transformFileToCSVFromPython";

export async function TransformToCSVExecutor(
  environment: ExecutionEnvironment<typeof TransformToCSVTask>
): Promise<boolean> {
  try {
    const dataClean = environment.getInput("Data Clean");
    console.log("@DATA CLEAN", dataClean);

    if (!dataClean) {
      environment.log.error("Data is not provided");
      return false;
    }

    environment.log.info("Iniciando transformación a CSV");

    const transformToCSV = await TransformFileToCSVFromPython(dataClean);
    if (!transformToCSV.success) {
      environment.log.error(transformToCSV.message!);
      return false;
    }

    // Crear blob con tipo MIME CSV
    const csvBlob = new Blob([transformToCSV.dataCSV!], {
      type: "text/csv",
    });

    // Crear archivo con extensión .csv
    const csvFile = new File([csvBlob], "archivo.csv", {
      type: "text/csv",
    });

    // Preparar FormData
    const formData = new FormData();
    formData.append("file", csvFile);

    environment.log.info("Fin de la transformación a CSV");
    environment.log.info("Iniciando subida del archivo a S3");

    const uploadToS3 = await UploadAnyToS3(formData, "csv");

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
