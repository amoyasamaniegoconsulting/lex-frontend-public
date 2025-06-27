import { PublishNodeWorkflow } from "@/actions/workflows/publishNodeWorkflow";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { UpdateNodeWorkflow } from "@/actions/workflows/updateNodeWorflow";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function SaveNodeBtn({
  workflowId,
  definitionNode,
  setOpen
}: {
  workflowId: string;
  definitionNode: Record<string, string>[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const saveMutation = useMutation({
    mutationFn: UpdateNodeWorkflow,
    onSuccess: () => {
      toast.success("Datos guardados exitosamente", { id: workflowId });
      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2 mb-2 "
      onClick={() => {
        toast.loading("Guardando datos...", { id: workflowId });
        saveMutation.mutate({
          id: workflowId,
          definitionNode: definitionNode,
        });

      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}
