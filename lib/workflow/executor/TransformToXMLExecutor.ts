import { ExecutionEnvironment } from "@/types/executor";
import { TransformToXMLTask } from "../task/TransformToXML";
import { TransformFileToXMLFromPython } from "@/actions/python/transformFileToXMLFromPython";
import { UploadAnyToS3 } from "@/actions/aws/s3/uploadAnyToS3";

export async function TransformToXMLExecutor(
    environment: ExecutionEnvironment<typeof TransformToXMLTask>)
    : Promise<boolean> {

    try {
        const dataClean = environment.getInput('Data Clean');
        console.log("@DATA CLEAN", dataClean);


        if (!dataClean) {
            environment.log.error('Data is not provided')
            return false
        }
        environment.log.info('Iniciando transformación a XML')

        const transformToXML = await TransformFileToXMLFromPython(dataClean)
        if (!transformToXML.success) {
            environment.log.error(transformToXML.message!)
            return false;

        }

        // 1. Crear un blob con tipo MIME XML
        const xmlBlob = new Blob([transformToXML.dataXML!], { type: 'application/xml' });

        // 2. Crear un archivo con nombre
        const xmlFile = new File([xmlBlob], 'archivo.xml', { type: 'application/xml' });

        // 3. Preparar FormData
        const formData = new FormData();
        formData.append('file', xmlFile);

        environment.log.info('Fin de la transformación a XML')
        environment.log.info('Iniciando subida del archvivo a S3')
        const uploadToS3 = await UploadAnyToS3(formData, 'xml')

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