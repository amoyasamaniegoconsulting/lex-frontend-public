'use server'
import prisma from '@/lib/prisma';
import { createOriginSchema, createOriginSchemaType } from '@/schema/origin';
import { auth } from '@clerk/nextjs/server';
import { Origin } from '@prisma/client';

export const GetOriginsByFrequencyAndVersion = async (frequency: number, version: number) => {

    try {

        const { userId } = auth()
        if (!userId) {
            throw new Error('Unauthenticated');
        }
        
        if (!frequency || !version) {
            throw new Error('Invalid Params');
        }
        const results = await prisma.origin.findMany({
            where:{
                userId,
                frequencyId: frequency,
                version: version
            },
            include:{
                frequency: true
            },
            orderBy:{
                cutOffDate: 'desc'
            }
        })

        return results;

    } catch (error) {
        console.log(error);
        throw new Error('Error en cargar los origenes')

    }

}