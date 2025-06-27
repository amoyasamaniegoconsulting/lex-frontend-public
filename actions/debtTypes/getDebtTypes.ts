'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetDebtTypes() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.debtType.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 
