'use server'
import prisma from '@/lib/prisma';
import { SourceData } from '@/types/source';

export const GetSourceDataByPathAndName = async(path: string, name: string) =>{

    try {

        //1. Obtener las fuentes
        let source: SourceData[] = [];

        switch (path) {
            case 'ConceptoDeudores':

                source = await prisma.debtorConcept.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });

                break;

            case 'LineaNegocio':

                source = await prisma.businessLine.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });

                break;

            case 'TipoDeuda':

                source = await prisma.debtType.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });

                break;

            case 'TipoIdentificacion':

                const sourceDataTipoIdentificacion = await prisma.identificationType.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });


                source = sourceDataTipoIdentificacion.map((data, index) => ({
                    id: index + 1,
                    name: `${data.description} - ${data.id}`
                }))

                break;

            case 'ConceptoPrestador':

                source = await prisma.providerConcept.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });

                break;

            case 'ConceptoDeterioro':

                const sourceDataConceptoDeterioro = await prisma.impairmentConcept.findMany({
                    where:{
                        description: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });


                source = sourceDataConceptoDeterioro.map((data, index) => ({
                    id: data.id,
                    name: data.description
                }))
                break;

            case 'MedicionPosterior':

                source = await prisma.subsequentMeasurement.findMany({
                    where:{
                        name: {
                            contains: name, // Equivalente a LIKE '%name%'
                            mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
                          },
                    }
                });

                break;

            default:
                break;
        }

        return source

    } catch (error) {
        throw new Error('Error en cargar los estados')
        
    }

}