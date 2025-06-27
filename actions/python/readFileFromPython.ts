'use server'

import { TableDataFile } from "@/types/python";


export const ReadFileFromPython = async (formData: FormData, limit: Number = 0) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/files/read?limit=${limit}`, {
            method: "POST",
            body: formData, // Enviar como FormData
        });

        if (!response.ok) {
            throw new Error("Error al subir el archivo");
        }

        const data: TableDataFile[] = await response.json(); // Parsear la respuesta JSON

        return {
            success: true,
            dataFile: data
        };
    } catch (error) {
        console.error('Error leyendo archivo:', error)
        return { success: false, message: 'Error al cargar la previsualización' }
    }
};
