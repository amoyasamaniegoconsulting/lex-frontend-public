'use server'
import prisma from '@/lib/prisma';
import { createOriginSchema, createOriginSchemaType } from '@/schema/origin';
import { auth } from '@clerk/nextjs/server';
import { Origin } from '@prisma/client';

export const GetOriginById = async (id: string) => {

    try {

        const { userId } = auth()
        if (!userId) {
            throw new Error('Unauthenticated');
        }
        
        const results = await prisma.origin.findFirst({
            where: {
                userId,
                id
            },
            include: {
                frequency: true
            },
            orderBy: {
                cutOffDate: 'desc'
            }
        })

        return results;

    } catch (error) {
        console.log(error);
        throw new Error('Error en cargar los origenes')

    }

}