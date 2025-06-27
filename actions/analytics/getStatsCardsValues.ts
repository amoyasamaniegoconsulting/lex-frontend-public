'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { PeriodToDateRange } from '@/lib/helper/dates';
import { Period } from '@/types/analytics';
import { WorkflowExecutionStatus } from '@/types/workflow';

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function GetStatsCardsValues(period: Period) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthenticated');
  }

  const dateRange = PeriodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: { in: [COMPLETED, FAILED] },
    },
    select: {
      phases: true,
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    phaseExecutions: 0,
  };

  stats.phaseExecutions = executions.reduce((sum, execution) => sum + execution.phases.length, 0);

  return stats;
}
