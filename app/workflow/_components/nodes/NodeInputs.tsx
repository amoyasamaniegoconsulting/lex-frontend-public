import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { AppNode } from "@/types/appNode";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
  disabled,
  nodeFT,
  value,
  onChange,
}: {
  input: TaskParam;
  nodeId: string;
  disabled: boolean;
  nodeFT?: AppNode;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30"
      )}
    >
      <NodeParamField
        param={input}
        nodeId={nodeId}
        disabled={isConnected}
        nodeFT={nodeFT}
        valueDialog={value}          // <-- PASAMOS EL VALOR
        onChange={onChange}    // <-- PASAMOS EL HANDLER
      />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
