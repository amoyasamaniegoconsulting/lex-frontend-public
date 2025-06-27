export enum TaskType {
    LAUNCH_DATA_FT = 'LAUNCH_DATA_FT',
    DATA_TO_PYTHON = 'DATA_TO_PYTHON',
    TRANSFORM_TO_XML = 'TRANSFORM_TO_XML',
    TRANSFORM_TO_XLSX = 'TRANSFORM_TO_XLSX',
    TRANSFORM_TO_PDF = 'TRANSFORM_TO_PDF',
    TRANSFORM_TO_CSV = 'TRANSFORM_TO_CSV'
}

export enum TaskParamType {
    STRING = 'STRING',
    STRING_TAG = 'STRING_TAG',
    FILE_FT = 'FILE_FT',
    BUSINESS_LINE = 'BUSINESS_LINE',
    DEBTOR_CONCEPT = 'DEBTOR_CONCEPT',
    SUBSEQUENT_MEASUREMENT = 'SUBSEQUENT_MEASUREMENT',
    MUNICIPAL_CODE = 'MUNICIPAL_CODE',
    PYTHON_INSTANCE = 'PYTHON_INSTANCE',
    DATA_CLEAN = 'DATA_CLEAN',
    CATALOG_SCRIPT = 'CATALOG_SCRIPT'
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string;
    [key: string]: any;
}