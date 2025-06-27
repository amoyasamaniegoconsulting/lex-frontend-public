'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetProviderConcepts() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.providerConcept.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 
