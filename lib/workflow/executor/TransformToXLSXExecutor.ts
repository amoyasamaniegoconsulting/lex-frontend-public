import { ExecutionEnvironment } from "@/types/executor";

import { TransformToXLSXTask } from "../task/TransformToXLSX";
import { TransformFileToXLSXFromPython } from "@/actions/python/transformFileToXLSXFromPython";
import { UploadAnyToS3 } from "@/actions/aws/s3/uploadAnyToS3";

export async function TransformToXLSXExecutor(
    environment: ExecutionEnvironment<typeof TransformToXLSXTask>)
    : Promise<boolean> {

    try {
        const dataClean = environment.getInput('Data Clean');
        console.log("@DATA CLEAN", dataClean);


        if (!dataClean) {
            environment.log.error('Data is not provided')
            return false
        }
        environment.log.info('Iniciando transformación a XLSX')

        const transformToXLSX = await TransformFileToXLSXFromPython(dataClean)
        if (!transformToXLSX.success) {
            environment.log.error(transformToXLSX.message!)
            return false;

        }

        // Crear blob con tipo MIME XLSX
        const xlsxBlob = new Blob([transformToXLSX.dataXLSX!], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Crear archivo con extensión .xlsx
        const xlsxFile = new File([xlsxBlob], 'archivo.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // 3. Preparar FormData
        const formData = new FormData();
        formData.append('file', xlsxFile);

        environment.log.info('Fin de la transformación a XLSX')
        environment.log.info('Iniciando subida del archvivo a S3')
        const uploadToS3 = await UploadAnyToS3(formData, 'xlsx')

        if (!uploadToS3.success) {
            environment.log.error(uploadToS3.message!)
            return false;
        }
        environment.log.info('Finalizando subida del archvivo a S3')
        environment.log.info('Generando Link de descarga')
        environment.setOutput('Url', uploadToS3.fileKey!)
        environment.log.info('Listo para descargar')

        return true

    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }

}