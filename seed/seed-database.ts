import prisma from "../lib/prisma";
import { initialData } from "./seed";

async function main() {

    //1. Borrar registros previos
    await Promise.all([
        // prisma.debtorConcept.deleteMany(),
        // prisma.businessLine.deleteMany(),
        // prisma.debtType.deleteMany(),
        // prisma.identificationType.deleteMany(),
        // prisma.providerConcept.deleteMany(),
        // prisma.impairmentConcept.deleteMany(),
        // prisma.subsequentMeasurement.deleteMany(),
        // prisma.municipalCode.deleteMany(),
        // prisma.origin.deleteMany(),
        // prisma.historic.deleteMany(),
        // prisma.log.deleteMany(),
        // prisma.frequency.deleteMany(),
        // prisma.typeSource.deleteMany(),
        // prisma.source.deleteMany(),  
        // prisma.flow.deleteMany(),
        // prisma.typeNode.deleteMany(),
        // prisma.flowNode.deleteMany(),
        // prisma.flowEdge.deleteMany()
        // prisma.catalogScript.deleteMany()
    ]);

    const { catalog_workflows, catalog_scripts, municipal_codes, typesNode, nodes, edges, process, typeSources, frequencies, concepto_deudores, linea_negocio, tipo_deuda, tipo_identificacion, concepto_prestadores, concepto_deterioro, medicion_posterior, sources } = initialData;

    await Promise.all([
        // prisma.debtorConcept.createMany({
        //     data: concepto_deudores
        // }),
        // prisma.businessLine.createMany({
        //     data: linea_negocio
        // }),
        // prisma.debtType.createMany({
        //     data: tipo_deuda
        // }),
        // prisma.identificationType.createMany({
        //     data: tipo_identificacion
        // }),
        // prisma.providerConcept.createMany({
        //     data: concepto_prestadores
        // }),
        // prisma.impairmentConcept.createMany({
        //     data: concepto_deterioro
        // }),
        // prisma.subsequentMeasurement.createMany({
        //     data: medicion_posterior
        // }),
        // prisma.municipalCode.createMany({
        //     data: municipal_codes
        // }),
        // prisma.frequency.createMany({
        //     data: frequencies
        // }),
        // prisma.typeSource.createMany({
        //     data: typeSources
        // }),
        // prisma.flow.createMany({
        //     data: process
        // }),
        // prisma.typeNode.createMany({
        //     data: typesNode
        // }),
    ])



    // await  prisma.source.createMany({
    //     data: sources
    // }),


    // await  prisma.flowNode.createMany({
    //     data: nodes
    // }),

    //     await  prisma.flowEdge.createMany({
    //     data: edges
    // }),


        await prisma.catalogWorkflow.createMany({
        data: catalog_workflows
    }),
        console.log('Seed ejecutado correctamente');

}

(() => {

    // if (process.env.NODE_ENV === 'production') return;
    main();
})();