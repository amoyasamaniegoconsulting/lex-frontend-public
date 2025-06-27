import { z } from 'zod';

export const createWorkflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string(),
});

export type duplicateWorkflowSchemaType = z.infer<typeof duplicateWorkflowSchema>;

export const createCatalogWorkflowSchema = z.object({
  catalogId: z.string({ message: "Please select a valid catalog" }),
});

export type createCatalogWorkflowSchemaType = z.infer<typeof createCatalogWorkflowSchema>;
