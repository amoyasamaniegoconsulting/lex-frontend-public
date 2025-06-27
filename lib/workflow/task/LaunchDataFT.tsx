import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchDataFTTask = {
  type: TaskType.LAUNCH_DATA_FT,
  label: "DATA FT",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Business Line",
      type: TaskParamType.BUSINESS_LINE,
      required: true,
      hideHandle: true,
    },

    {
      name: "Debtor Concept",
      type: TaskParamType.DEBTOR_CONCEPT,
      required: true,
      hideHandle: true,
    },

    {
      name: "Subsequent Measurement",
      type: TaskParamType.SUBSEQUENT_MEASUREMENT,
      required: true,
      hideHandle: true,
    },

    {
      name: "Municipal Code",
      type: TaskParamType.MUNICIPAL_CODE,
      required: true,
      hideHandle: true,
    },
    {
      name: "Accounts to be eradicated",
      type: TaskParamType.STRING_TAG,
      required: true,
      hideHandle: true,
    },
        {
      name: "Account ID",
      type: TaskParamType.STRING_TAG,
      required: true,
      hideHandle: true,
    },
    {
      name: "File FT",
      type: TaskParamType.FILE_FT,
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs:[
    {name: 'Python Scrypt', type: TaskParamType.PYTHON_INSTANCE}
  ] as const
} satisfies WorkflowTask;
