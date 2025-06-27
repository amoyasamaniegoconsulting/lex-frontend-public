'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetMunicipalCodes() {

    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    return prisma.municipalCode.findMany({
        orderBy: {
            name: 'asc'
        }
    })
} 
