'use server'
import prisma from '@/lib/prisma';

export const getSourcesByName = async (name: string) => {

  try {

    const sources = await prisma.source.findMany({
      where: {
        name: {
          contains: name, // Equivalente a LIKE '%name%'
          mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
        },
        typeSource: {
          id: 1
        }
      },
      orderBy: [
        {
          active: 'desc',

        },
        {
          name: 'asc',
        },
      ]
    });

    return sources

  } catch (error) {
    console.log(error);
    throw new Error('Error en cargar los estados')

  }

}