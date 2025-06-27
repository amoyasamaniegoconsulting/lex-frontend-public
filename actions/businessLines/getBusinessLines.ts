'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetBusinessLines() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.businessLine.findMany({
        orderBy: {
            id: 'asc'
        }
    })
} 