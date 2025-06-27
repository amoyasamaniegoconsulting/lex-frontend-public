import { GetOriginById } from "../origins/getOriginById";

export const ProcessFileDataFromPython = async (data: string) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/data/ft`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        });

        const result = await response.json()
        if (response.status !== 200) {
            // Aquí verificamos si la respuesta tiene un detalle con el mensaje de error
            return {
                success: false,
                message: 'Ocurrió un error al limpiar los datos'
            }
        }
        return {
            success: true,
            dataClean: result,
            message: 'Datos limpiados correctamente'

        };
    } catch (error) {

        return {
            success: false,
            message: 'Ocurrió un error al limpiar los datos'

        }
    }
}