'use server';

import prisma from "@/lib/prisma";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function UpdateNodeWorkflow({ id, definitionNode, level = 1 }: {
    id: string, definitionNode: Record<string, string>[], level?: number
}) {

    const { userId } = auth();

    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id, userId
        }
    })

    if (!workflow) {
        throw new Error('Workflow not found')
    }

    const firstNode = JSON.parse(workflow?.definition);
    console.log(firstNode);

    level = level <= 0 ? 0 : definitionNode.length - 1;

    if (!firstNode.nodes || firstNode.nodes.length <= 0) {
        throw new Error('Workflow not defined nodes')
    }

    for (let index = 0; index <= level; index++) {
        const nodeType = firstNode.nodes[index].data.type;
        console.log("@NODETYPE", nodeType);
        
        if (nodeType !== TaskType.LAUNCH_DATA_FT && nodeType !== TaskType.DATA_TO_PYTHON) {
            throw new Error('Workflow not defined type')
        }

        const nodeInputs = firstNode.nodes[index].data.inputs;
        for (const key in definitionNode[index]) {
            if (key in nodeInputs) {
                nodeInputs[key] = definitionNode[index][key];
            }
        }
        console.log(firstNode);
        
        await prisma.workflow.update({
            data: {
                definition: JSON.stringify(firstNode),
            },
            where: {
                id, userId
            }
        });
    }








    revalidatePath('/workflows')
}