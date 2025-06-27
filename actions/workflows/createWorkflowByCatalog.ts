'use server';

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createCatalogWorkflowSchemaType, createCatalogWorkflowSchema, } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflowByCatalog(
    form: createCatalogWorkflowSchemaType
) {

    const { success, data } = createCatalogWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error('Invalid Form Data');
    }

    const { userId } = auth()
    if (!userId) {
        throw new Error('Unauthenticated');

    }

    const catalogWorkflow = await prisma.catalogWorkflow.findFirst({
        where: {
            id: data.catalogId
        }
    })

    if (!catalogWorkflow) {
        throw new Error('Catálogo no encontrado');
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: catalogWorkflow.template,
            name: catalogWorkflow.name,
            description: catalogWorkflow.description
        }
    });

    if (!result) {
        throw new Error('Failed to create workflow');
    }

    redirect(`/workflows`)

}