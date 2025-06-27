import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createFileFTSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, {
      message: "Debes subir un archivo válido",
    })
    .refine(
      (file) =>
        file &&
        ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type),
      {
        message: "Solo se permiten archivos .xls o .xlsx",
      }
    )
    .refine((file) => file && file.size < 5 * 1024 * 1024, {
      message: "El archivo debe pesar menos de 5MB",
    }),

  cutOffDate: z.date(),
  frequency: z.string(),
  version: z.number().default(1).optional(),
});

export type createFileFTSchemaType = z.infer<typeof createFileFTSchema>;


export const searchFileFTSchema = createFileFTSchema.omit({
  file: true,
  cutOffDate: true,
});

export type searchFileFTSchemaType = z.infer<typeof searchFileFTSchema>;