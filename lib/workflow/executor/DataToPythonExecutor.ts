import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LaunchDataFTTask } from "../task/LaunchDataFT";
import { DataToPythonTask } from "../task/DataToPython";
import { ProcessFileDataFromPython } from "@/actions/python/processFileDataFromPython";

export async function DataToPythonExecutor(
    environment: ExecutionEnvironment<typeof DataToPythonTask>)
    : Promise<boolean> {

    try {
        const dataPython = JSON.stringify(environment.getDataPython()!);

        environment.log.info(`Inicio de proceso FT`)

        const { dataClean, success } = await ProcessFileDataFromPython(dataPython)

        environment.log.info(`Fin de proceso FT`)

        environment.setOutput('Data Clean', JSON.stringify(dataClean))

        return success

    } catch (error: any) {
        environment.log.error(error.message)
        return false

    }

}