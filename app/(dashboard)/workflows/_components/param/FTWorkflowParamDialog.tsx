"use client";

import { Workflow } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import {
  NodeInput,
  NodeInputs,
} from "@/app/workflow/_components/nodes/NodeInputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskParam, TaskParamType } from "@/types/task";
import SaveNodeBtn from "@/app/workflow/_components/topbar/SaveNodeBtn";
import { CircleXIcon } from "lucide-react";
import PublishNodeBtn from "@/app/workflow/_components/topbar/PublishNodeBtn";

const FTWorkflowParamDialog = memo(function FTWorkflowParamDialog({
  open,
  setOpen,
  workflow,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workflow: Workflow;
}) {
  const { setViewport, setNodes, setEdges } = useReactFlow();

  const [nodesFT, setNodesFT] = useState<AppNode[]>([]);
  const [taskFT, setTaskFT] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (!open) return;

    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (flow.viewport) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setViewport({ x, y, zoom });
      }

      const selectedNodes: AppNode[] = (flow.nodes || []).slice(0, 2);
      setNodesFT(selectedNodes);

      const taskList: any[] = selectedNodes.map(
        (n) => TaskRegistry[n.data?.type]
      );
      setTaskFT(taskList);

      // Inicializar valores por nodo
      const values = selectedNodes.map((n) => n.data?.inputs || {});
      setInputValues(values);
    } catch (err) {
      console.error("Error cargando el workflow:", err);
    }
  }, [open, workflow.definition, setNodes, setEdges, setViewport]);

  // Actualiza los inputs de un nodo específico
  function handleInputChange(nodeIndex: number, name: string, value: any) {
    setInputValues((prev) => {
      const updated = [...prev];
      updated[nodeIndex] = {
        ...updated[nodeIndex],
        [name]: value,
      };
      return updated;
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Definir parámetros del nodo</DialogTitle>
        </DialogHeader>

        {taskFT.length && nodesFT.length ? (
          taskFT.map((tk, index) => (
            <NodeInputs key={nodesFT[index].id}>
              {tk.inputs.map((input: TaskParam) => {
                if (input.type !== TaskParamType.PYTHON_INSTANCE) {
                  return (
                    <NodeInput
                      key={input.name}
                      input={input}
                      nodeId={nodesFT[index].id}
                      nodeFT={nodesFT[index]}
                      disabled={false}
                      value={inputValues[index]?.[input.name] || ""}
                      onChange={(val: any) =>
                        handleInputChange(index, input.name, val)
                      }
                    />
                  );
                }
              })}
            </NodeInputs>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No se encontraron nodos válidos o tareas correspondientes.
          </p>
        )}

        <DialogFooter className="mt-4">
          <PublishNodeBtn
            setOpen={setOpen}
            workflowId={workflow.id}
            definitionNode={inputValues}
          />
          <SaveNodeBtn
            setOpen={setOpen}
            workflowId={workflow.id}
            definitionNode={inputValues}
          />
          <Button
            className="mb-2"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            <CircleXIcon /> Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

FTWorkflowParamDialog.displayName = "FTWorkflowParamDialog";
export default FTWorkflowParamDialog;
