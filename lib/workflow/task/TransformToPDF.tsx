import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  BookTextIcon, FileCodeIcon, FileTextIcon, LucideProps, ScrollTextIcon } from "lucide-react";

export const TransformToPDFTask = {
  type: TaskType.TRANSFORM_TO_PDF,
  label: "Transform to PDF",
  isEntryPoint: false,
  icon: (props: LucideProps) => (
    <BookTextIcon className="stroke-yellow-500" {...props} />
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
