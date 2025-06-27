import { GetOriginById } from "../origins/getOriginById";

export const CleanFileDataByOriginsFromPython = async (originIds: string[]) => {
  try {
    // Convertimos el array en parámetros tipo originId=abc&originId=def
    const queryString = originIds.map(id => `originId=${encodeURIComponent(id)}`).join('&');
    if (originIds.length <= 0) {
      return {
        success: false,
        message: 'No se mando ningún id'
      }
    }

    const origin = await GetOriginById(originIds[0])
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PYTHON}/flow/data/clean?${queryString}&frequencyId=${origin?.frequencyId}`, {
      method: "GET",
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