import { auth } from '@clerk/nextjs/server';


import prisma from '@/lib/prisma';
import { waitFor } from '@/lib/helper/waitFor';
import Editor from '../../_components/Editor';

export default async function EditorPage({ params }: { params: { workflowId: string } }) {
  const { workflowId } = params;

  const { userId } = auth();

  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow}></Editor>;

}
