export const downloadFile = (presignedUrl: string, fileKey: string) => {
    try {
        // Crear un enlace para descargar el archivo
        const a = document.createElement("a");
        a.href = presignedUrl;

        // Extraer el nombre del archivo desde la URL o usar el fileKey
        const fileName = fileKey;  // Nombre del archivo
        a.download = fileName;

        // Simular clic para iniciar la descarga
        document.body.appendChild(a);
        a.click();

        // Limpiar recursos
        document.body.removeChild(a);
    } catch (e) {
        console.error('Error al descargar el archivo', e);
    }
}




export const createBlobUrl = (blob: Blob): string => {
    return URL.createObjectURL(blob);
};


export const downloadBlob = (blob: Blob, filename: string) => {
    const url = createBlobUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
