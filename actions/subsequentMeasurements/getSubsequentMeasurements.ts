'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetSubsequentMeasurements() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.subsequentMeasurement.findMany({
        orderBy: {
            name: 'asc'
        }
    })
} 
