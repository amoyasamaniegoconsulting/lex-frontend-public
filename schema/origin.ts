import { z } from 'zod';

export const createOriginSchema = z.object({
  sourceId: z.string(),
  originName: z.string().min(1, 'El nombre del origen es obligatorio'),
  extension: z.string().min(1, 'La extensión es obligatoria'),
  url: z.string(),

  userId: z.string().default('bot'),

  cutOffDate: z.coerce.date().optional(),
  frequencyId: z.number().int().optional(),

  version: z.number().int().default(1),
  active: z.boolean().default(false),
});

export type createOriginSchemaType = z.infer<typeof createOriginSchema>;
