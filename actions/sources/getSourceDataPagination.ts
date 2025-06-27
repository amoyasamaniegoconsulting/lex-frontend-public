'use server';

import prisma from '@/lib/prisma';
import { SourceData } from '@/types/source';

interface PaginationOptions {
    path: string;
    page?: number;
    take?: number;
}

export const GetSourceDataPagination = async ({
    path,
    page = 1,
    take = 10,
}: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    try {


        //1. Obtener las fuentes
        let source: SourceData[] = [];
        let totalCount: number = 0;


        switch (path) {
            case 'ConceptoDeudores':

                source = await prisma.debtorConcept.findMany({
                    take: take,
                    skip: (page - 1) * take
                });

                totalCount = await prisma.debtorConcept.count({})

                break;

            case 'LineaNegocio':

                source = await prisma.businessLine.findMany({
                    take: take,
                    skip: (page - 1) * take
                });
                totalCount = await prisma.businessLine.count({})

                break;

            case 'TipoDeuda':

                source = await prisma.debtType.findMany({
                    take: take,
                    skip: (page - 1) * take
                });
                totalCount = await prisma.debtType.count({})

                break;

            case 'TipoIdentificacion':

                const sourceDataTipoIdentificacion = await prisma.identificationType.findMany({
                    take: take,
                    skip: (page - 1) * take
                });

                totalCount = await prisma.identificationType.count({})


                source = sourceDataTipoIdentificacion.map((data, index) => ({
                    id: index + 1,
                    name: `${data.description} - ${data.id}`
                }))

                break;

            case 'ConceptoPrestadores':

                source = await prisma.providerConcept.findMany({
                    take: take,
                    skip: (page - 1) * take
                });
                totalCount = await prisma.providerConcept.count({})

                break;

            case 'ConceptoDeterioro':

                const sourceDataConceptoDeterioro = await prisma.impairmentConcept.findMany({
                    take: take,
                    skip: (page - 1) * take
                });

                totalCount = await prisma.impairmentConcept.count({})

                source = sourceDataConceptoDeterioro.map((data, index) => ({
                    id: data.id,
                    name: data.description
                }))
                break;

            case 'MedicionPosterior':

                source = await prisma.subsequentMeasurement.findMany({
                    take: take,
                    skip: (page - 1) * take
                });
                totalCount = await prisma.subsequentMeasurement.count({})

                break;

            default:
                break;
        }



        //2. Obtener el total de fuentes
        //todo:
        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages: totalPages,
            source: source.map(sourceData => ({
                ...sourceData,
            }))
        }

    } catch (error) {
                throw new Error('Error al cargar las tablas')
    }

}

