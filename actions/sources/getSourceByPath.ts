'use server';
import prisma from '@/lib/prisma';

// Esta función recibe el path para obtener el Source correspondiente
export const GetSourceByPath = async (path: string) => {

    
    // Asumiendo que el nombre del Source corresponde con parte del path
    const source = await prisma.source.findFirst({
      where: {
        name: path,
      },
    });
  
    
    return source ; // Devuelve el ID del Source, o null si no se encuentra
  };
  