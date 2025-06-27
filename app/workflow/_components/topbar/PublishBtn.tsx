'use client';

import { UploadIcon } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';


export default function PublishBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow published', { id: workflowId });
    },
    onError: (e) => {
      toast.error(e.message, { id: workflowId });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // Client side validation
          return;
        }

        toast.loading('Publishing workflow...', { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}
