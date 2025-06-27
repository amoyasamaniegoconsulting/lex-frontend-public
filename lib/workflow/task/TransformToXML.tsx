import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  FileCodeIcon, LucideProps } from "lucide-react";

export const TransformToXMLTask = {
  type: TaskType.TRANSFORM_TO_XML,
  label: "Transform to XML",
  isEntryPoint: false,
  icon: (props: LucideProps) => (
    <FileCodeIcon className="stroke-yellow-500" {...props} />
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
