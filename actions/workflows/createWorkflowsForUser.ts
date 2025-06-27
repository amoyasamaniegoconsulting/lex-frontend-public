import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function CreateWorkflowsForUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflows = await prisma.workflow.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (workflows.length > 0) {
    return;
  }

  const catalogWorkflows = await prisma.catalogWorkflow.findMany();
  if (!catalogWorkflows || catalogWorkflows.length === 0) {
    throw new Error("Catálogo no encontrado");
  }

  // Opcional: puedes usar Promise.all si no necesitas que sea secuencial
  await Promise.all(
    catalogWorkflows.map((catalog) =>
      prisma.workflow.create({
        data: {
          userId,
          status: WorkflowStatus.DRAFT,
          definition: catalog.template,
          name: catalog.name,
          description: catalog.description,
        },
      })
    )
  );
}
