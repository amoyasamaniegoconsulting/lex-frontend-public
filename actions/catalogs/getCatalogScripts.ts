'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetCatalogScripts() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.catalogScript.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 