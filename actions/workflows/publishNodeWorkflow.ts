'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';
import { FlowToExecutionPlan } from '@/lib/workflow/executionPlan';

export async function PublishNodeWorkflow({ id }: { id: string; }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthenticated');
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error('workflow not found');
  }

  const flow = JSON.parse(workflow.definition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error('Flow validation not valid');
  }

  if (!result.executionPlan) {
    throw new Error('no execution plan generated');
  }


  await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition: workflow.definition,
      executionPlan: JSON.stringify(result.executionPlan),
      status: WorkflowStatus.PUBLISHED,
    },
  });

  revalidatePath(`/workflows`);
}
