"use server";

import prisma from "@/lib/prisma";

export const UpdateSourceStatusByPath = async (path: string): Promise<boolean> => {
  try {
    // 1. Obtener el estado actual
    const statePath = await prisma.source.findFirst({
      where: { name: path },
      select: { active: true },
    });

    // 2. Si no existe, lanzamos un error
    if (!statePath) {
      throw new Error(`No se encontró el path: ${path}`);
    }

    // 3. Negamos el estado actual
    const newState = !statePath.active;

    // 4. Actualizamos en la base de datos
    await prisma.source.update({
      where: { name: path, 
        typeSource:{
          id:1
        }
      },
      data: { active: newState },
    });

    return newState; // Devolvemos el nuevo estado

  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    throw new Error("Error al actualizar el estado");
  }
};
