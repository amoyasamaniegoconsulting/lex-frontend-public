import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  BookTextIcon, FileCodeIcon, FileTextIcon, LucideProps } from "lucide-react";

export const TransformToCSVTask = {
  type: TaskType.TRANSFORM_TO_CSV,
  label: "Transform to CSV",
  isEntryPoint: false,
  icon: (props: LucideProps) => (
    <FileTextIcon className="stroke-yellow-500" {...props} />
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
