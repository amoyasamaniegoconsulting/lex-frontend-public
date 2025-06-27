'use server';
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowById(id: string) {
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

    return workflow;
} 