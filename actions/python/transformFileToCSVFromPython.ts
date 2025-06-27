'use server'

export const TransformFileToCSVFromPython = async (dataClean: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/generate/csv`, {
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
            dataCSV: data
        };
    } catch (error: any) {
        console.error("Error al transformar a CSV:", error);
        return {
            success: false,
            message: error?.message || "Error desconocido al transformar a CSV"
        };
    }
};
