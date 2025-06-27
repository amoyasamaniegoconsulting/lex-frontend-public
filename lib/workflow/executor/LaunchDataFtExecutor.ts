import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LaunchDataFTTask } from "../task/LaunchDataFT";
import { InputDataFT } from "@/types/inputs";
import { CleanFileDataByOriginsFromPython } from "@/actions/python/cleanFileDataByOriginsFromPython";

export async function LaunchDataFtExecutor(
    environment: ExecutionEnvironment<typeof LaunchDataFTTask>)
    : Promise<boolean> {

    try {

        environment.log.info('DataFT started successfully')


        environment.log.info(`DataFT received successfully`)
        environment.log.info(`Inicio de proceso de limpieza de datos`)

        const accountIdRaw = environment.getInput('Account ID');
        const accountsToBeEradicatedRaw = environment.getInput('Accounts to be eradicated');
        const fileIdsRaw = environment.getInput('File FT');

        const accountId = accountIdRaw
            ? accountIdRaw.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const accountsToBeEradicated = accountsToBeEradicatedRaw
            ? accountsToBeEradicatedRaw.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const fileIds = fileIdsRaw
            ? fileIdsRaw.split(',').map(s => s.trim()).filter(Boolean)
            : [];




        const { success, dataClean, message } = await CleanFileDataByOriginsFromPython(fileIds)
        if (!success) {
            environment.log.error(message!)
            return false;
        } else {
            environment.log.info(message)
        }
        environment.log.info(`Fin de proceso de limpieza de datos`)

        const inputDataToPython: InputDataFT = {
            businessLine: environment.getInput('Business Line'),
            debtorConcept: environment.getInput('Debtor Concept'),
            municipalCode: environment.getInput('Municipal Code'),
            subsequentMeasurement: environment.getInput('Subsequent Measurement'),
            accountsIdentify: accountId,
            accountsEradicated: accountsToBeEradicated,
            dataClean
        }

        environment.setDataPython(inputDataToPython)

        return true

    } catch (error: any) {
        environment.log.error(error.message)
        return false

    }

}