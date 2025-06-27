'use server'
import prisma from '@/lib/prisma';
import { Source } from '@prisma/client';

export const GetSourceById= async(id: string): Promise<Source> =>{

    try {

        const source = await prisma.source.findFirst({
            where:{
                id: id,
            },
            include:{
                typeSource: true
            }
        })

        return source!;

    } catch (error) {
        console.log(error);
        throw new Error('Error en cargar los estados')
        
    }

}