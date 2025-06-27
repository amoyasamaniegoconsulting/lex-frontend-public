import prisma from "@/lib/prisma";
import { TableDataFile } from "@/types/python";
import { auth } from "@clerk/nextjs/server";
import { Origin } from "@prisma/client";
import { ReadFileFromPython } from "../python/readFileFromPython";
import { v4 as uuidv4 } from "uuid";

export async function CreateBalancesByFrequency(form: FormData, origin: Origin) {
    const { userId } = auth();
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const { success, dataFile } = await ReadFileFromPython(form)
    if (!success) {
        throw new Error('Los datos no se limpiaron correctamente')
    }
    const formattedData = [];

    const numRows = dataFile![0]?.values.length || 0; // Obtener el número de filas
    for (let i = 0; i < numRows; i++) {
        const row: Record<string, any> = {}; // Crear un objeto para cada fila
        dataFile!.forEach((col) => {
            // Transformar el nombre de la columna
            const columnName = col.column;
            row[columnName] = col.values[i]; // Asignar el valor a la columna transformada
        });
        formattedData.push(row);
    }

    const dataMapped = formattedData.map((data) => ({
        id: uuidv4(),
        ...data,
        originId: origin.id,
        frequencyId: origin.frequencyId,
        cutOffDate: origin.cutOffDate,
        userId
    }))

    switch (origin.frequencyId) {

        case 1:
            await prisma.dailyBalance.createMany({
                data: dataMapped
            })
            break;

        case 2:
            await prisma.weeklyBalance.createMany({
                data: dataMapped
            })
            break;

        case 3:
            await prisma.monthlyBalance.createMany({
                data: dataMapped
            })
            break;

        case 4:
            await prisma.bimonthlyBalance.createMany({
                data: dataMapped
            })
            break;

        case 5:
            await prisma.quarterlyBalance.createMany({
                data: dataMapped
            })
            break;

        case 6:
            await prisma.semiannualBalance.createMany({
                data: dataMapped
            })
            break;

        case 7:
            await prisma.annualBalance.createMany({
                data: dataMapped
            })
            break;

        default:
            return {
                success: false,
                message: 'La frecuencia no corresponda a una conocida'
            };
    }

    return {
        success: true,
        message: 'Los datos se cargaron correctamente'
    };
} 