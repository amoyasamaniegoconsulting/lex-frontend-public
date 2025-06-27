'use server'

export const TransformFileToXLSXFromPython = async (dataClean: string) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/generate/xlsx`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataClean, // Enviar como FormData
        });

        if (!response.ok) {
            throw new Error("Error al subir el archivo");
        }

        // Recibimos el archivo directamente como buffer binario
        const data = await response.arrayBuffer();
        return {
            success: true,
            dataXLSX: data
        };
    } catch (error) {
        console.error('Error leyendo archivo:', error)
        return { success: false, message: 'Error al transformar en XLSX' }
    }
};
