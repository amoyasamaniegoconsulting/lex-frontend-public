'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetDebtorConcepts() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.debtorConcept.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 