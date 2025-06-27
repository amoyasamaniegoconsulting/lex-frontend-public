'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetCatalogWorkflows() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.catalogWorkflow.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 