'use server'

export const TransformFileToPDFFromPython = async (dataClean: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/generate/pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataClean
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.arrayBuffer();
        return {
            success: true,
            dataPDF: data
        };
    } catch (error: any) {
        console.error("Error al transformar a PDF:", error);
        return {
            success: false,
            message: error?.message || "Error desconocido al transformar a PDF"
        };
    }
};
