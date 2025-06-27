'use server'

export const TransformFileToXMLFromPython = async (dataClean: string) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/generate/xml`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataClean, // Enviar como FormData
        });

        if (!response.ok) {
            throw new Error("Error al subir el archivo");
        }

        const data = await response.text(); // ✅ Esto lee el XML como string

        return {
            success: true,
            dataXML: data
        };
    } catch (error) {
        console.error('Error leyendo archivo:', error)
        return { success: false, message: 'Error al transformar en XLM' }

    }
};
