'use server';

import prisma from '@/lib/prisma';

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const GetSourcesPagination = async ({
    page = 1,
    take = 5
}: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    try {

        //1. Obtener las fuentes
        const sources = await prisma.source.findMany({
            take: take,
            skip: (page - 1) * take,
            where: {
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

        //2. Obtener el total de fuentes
        //todo:
        const totalCount = await prisma.source.count({
            where: {
                typeSource: {
                    id: 1
                }
            }
        })

        const totalPages = Math.ceil(totalCount / take);


        return {
            currentPage: page,
            totalPages: totalPages,
            sources: sources.map(source => ({
                ...source,
            }))
        }

    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener las fuentes de datos')

    }

}

