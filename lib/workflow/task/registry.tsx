import { TaskType } from "@/types/task";
import { DataToPythonTask } from "./DataToPython";
import { LaunchDataFTTask } from "./LaunchDataFT";
import { TransformToXLSXTask } from "./TransformToXLSX";
import { TransformToXMLTask } from "./TransformToXML";
import { WorkflowTask } from "@/types/workflow";
import { TransformToPDFTask } from "./TransformToPDF";
import { TransformToCSVTask } from "./TransformToCSV";

type Registry = {
    [K in TaskType]: WorkflowTask & {type: K}
}
export const TaskRegistry: Registry= {
    LAUNCH_DATA_FT: LaunchDataFTTask,
    DATA_TO_PYTHON: DataToPythonTask,
    TRANSFORM_TO_XLSX: TransformToXLSXTask,
    TRANSFORM_TO_XML: TransformToXMLTask,
    TRANSFORM_TO_PDF: TransformToPDFTask,
    TRANSFORM_TO_CSV: TransformToCSVTask,
}
