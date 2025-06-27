import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";
import { GetWorkflowById } from "@/actions/workflows/getWorkflowById";

const useExecutionPlan = (
  isSingleNode: boolean = false,
  workflowId: string = ""
) => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: any) => {
      switch (error?.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;

        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements);
          break;

        default:
          toast.error("Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(async () => {
    let nodes: AppNode[] = [];
    let edges: Edge[] = [];

    if (isSingleNode) {
      const workFlowDefinition = await GetWorkflowById(workflowId);
      const parsed = JSON.parse(workFlowDefinition.definition);
      nodes = parsed.nodes;
      edges = parsed.edges;
    } else {
      const flow = toObject();
      nodes = flow.nodes as AppNode[];
      edges = flow.edges;
    }

    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();

    return executionPlan;
  }, [toObject, handleError, clearErrors, isSingleNode, workflowId]);
  return generateExecutionPlan;
};

export default useExecutionPlan;
