import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BookTextIcon, CpuIcon, LucideProps, SheetIcon, TextIcon } from "lucide-react";

export const TransformToXLSXTask = {
  type: TaskType.TRANSFORM_TO_XLSX,
  label: "Transform to XLSX",
  isEntryPoint: false,
  icon: (props: LucideProps) => (
    <SheetIcon className="stroke-yellow-500" {...props} />
  ),
  inputs: [
    {
      name: "Data Clean",
      type: TaskParamType.DATA_CLEAN,
      required: true
    }
  ]as const,
  outputs: [
    {
      name: "Url",
      type: TaskParamType.STRING,
    }
  ]as const,
}satisfies WorkflowTask;
