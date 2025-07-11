import 'server-only';
import { revalidatePath } from 'next/cache';
import { ExecutionPhase } from '@prisma/client';
import { Browser, Page } from 'puppeteer';
import { Edge } from '@xyflow/react';

import prisma from '@/lib/prisma';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { ExecutorRegistry } from '@/lib/workflow/executor/registry';
import { createLogCollector } from '@/lib/log';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { TaskParamType } from '@/types/task';
import { LogCollector } from '@/types/log';
import { AppNode } from '@/types/appNode';
import { InputDataFT } from '@/types/inputs';

export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
    const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: { workflow: true, phases: true },
    });

    if (!execution) {
        throw new Error('execution not found');
    }

    const edges = JSON.parse(execution.definition).edges as Edge[];

    const environment: Environment = { phases: {} };

    await initializeWorkflowExecution(execution.id, execution.workflowId, nextRunAt);
    await initializePhaseStatuses(execution);

    let executionFailed = false;
    for (const phase of execution.phases) {
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);

        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed);
    await cleanupEnvironment(environment);

    revalidatePath('/workflow/runs');
}

async function initializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        },
    });

    await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
            ...(nextRunAt && { nextRunAt }),
        },
    });
}

async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id),
            },
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        },
    });
}

async function finalizeWorkflowExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
) {
    const finalStatus = executionFailed ? ExecutionPhaseStatus.FAILED : ExecutionPhaseStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
        },
    });

    await prisma.workflow
        .update({
            where: {
                id: workflowId,
                lastRunId: executionId,
            },
            data: {
                lastRunStatus: finalStatus,
            },
        })
        .catch((err) => {
            // ignore
            // this means that we have triggered other runs for this workflow
            // while an execution was running
        });
}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) {
    const logCollector = createLogCollector();
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;

    setupEnvironmentForPhase(node, environment, edges);

    // Update phase status
    await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs),
        },
    });



    const success = await executePhase(phase, node, environment, logCollector);

    const outputs = environment.phases[node.id].outputs;
    await finalizePhase(phase.id, success, outputs, logCollector);

    return { success };
}

async function finalizePhase(
    phaseId: string,
    success: boolean,
    outputs: any,
    logCollector: LogCollector,
) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: { id: phaseId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            logs: {
                createMany: {
                    data: logCollector.getAll().map((log) => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level,
                    })),
                },
            },
        },
    });
}

async function executePhase(
    phase: ExecutionPhase,
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        logCollector.error(`Not found executor for ${node.data.type}`);
        return false;
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

    return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
    environment.phases[node.id] = { inputs: {}, outputs: {} };

    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        if (input.type === TaskParamType.PYTHON_INSTANCE) continue;

        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // Get input value from outputs in the environment
        const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);

        if (!connectedEdge) {
            console.error('Missing edge for input', input.name, 'node id:', node.id);
            continue;
        }

        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];

        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}

function createExecutionEnvironment(
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => {
            environment.phases[node.id].outputs[name] = value;
        },
        getDataPython: () => environment.dataPython,
        setDataPython: (dataPython: InputDataFT) => (environment.dataPython = dataPython),

        log: logCollector

    };
}

async function cleanupEnvironment(environment: Environment) {
    if (environment.dataPython) {

    }
}

