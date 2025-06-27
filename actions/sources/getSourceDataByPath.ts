'use server'
import prisma from '@/lib/prisma';

export const GetSourceDataByPath = async(path: string) =>{

    try {

        const sourcePath = await prisma.source.findFirst({
            where:{
                name: path
            },
        })

        return sourcePath

    } catch (error) {
        console.log(error);
        throw new Error('Error en cargar los estados')
        
    }

}