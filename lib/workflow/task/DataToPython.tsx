import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CpuIcon, LucideProps } from "lucide-react";

export const DataToPythonTask = {
  type: TaskType.DATA_TO_PYTHON,
  label: "Data To Python",
  icon: (props: LucideProps) => (
    <CpuIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Python Catalog",
      type: TaskParamType.CATALOG_SCRIPT,
      required: true,
      hideHandle: true,
    },
    {
      name: "Python Scrypt",
      type: TaskParamType.PYTHON_INSTANCE,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Data Clean",
      type: TaskParamType.DATA_CLEAN,
    },
  ] as const,
} satisfies WorkflowTask;
