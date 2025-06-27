'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetImpairmentConcepts() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.impairmentConcept.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 
