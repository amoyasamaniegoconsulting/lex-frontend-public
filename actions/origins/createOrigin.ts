'use server'
import prisma from '@/lib/prisma';
import { createOriginSchema, createOriginSchemaType } from '@/schema/origin';
import { auth } from '@clerk/nextjs/server';
import { Origin } from '@prisma/client';

export const CreateOrigin = async (form: createOriginSchemaType) => {

    try {

        const { userId } = auth()
        if (!userId) {
            throw new Error('Unauthenticated');
        }

        console.log(form);
        
        const { success, data } = createOriginSchema.safeParse(form);
        
        console.log(data);
        

        if (!success) {
            throw new Error('Invalid Form Data');
        }
        const result = await prisma.origin.create({
            data:{
                ...data,
            }
        })

        return result;

    } catch (error) {
        console.log(error);
        throw new Error('Error en cargar los estados')

    }

}