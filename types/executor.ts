import { InputDataFT } from "./inputs";
import { LogCollector } from "./log";
import { WorkflowTask } from "./workflow"

export type Environment = {
    dataPython?: InputDataFT,
    phases: Record<
        string, {
            inputs: Record<string, string>,
            outputs: Record<string, string>,
        }
    >
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T['inputs'][number]['name']): string;
    setOutput(name: T['outputs'][number]['name'], value: string): void;
    getDataPython(): InputDataFT | undefined
    setDataPython(dataPython: InputDataFT): void;
    log: LogCollector
}