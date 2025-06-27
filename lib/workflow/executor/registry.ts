import { TaskType } from "@/types/task";
import { DataToPythonExecutor } from "./DataToPythonExecutor";
import { LaunchDataFtExecutor } from "./LaunchDataFtExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { TransformToXLSXExecutor } from "./TransformToXLSXExecutor";
import { TransformToXMLExecutor } from "./TransformToXMLExecutor";
import { TransformToPDFExecutor } from "./TransformToPDFExecutor";
import { TransformToCSVExecutor } from "./TransformToCSVExecutor";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
}
export const ExecutorRegistry: RegistryType = {
    LAUNCH_DATA_FT: LaunchDataFtExecutor,
    DATA_TO_PYTHON: DataToPythonExecutor,
    TRANSFORM_TO_XLSX: TransformToXLSXExecutor,
    TRANSFORM_TO_XML: TransformToXMLExecutor,
    TRANSFORM_TO_PDF: TransformToPDFExecutor,
    TRANSFORM_TO_CSV: TransformToCSVExecutor,
}