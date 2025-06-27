"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { TaskParam, TaskParamType } from "@/types/task";

import BusinessLineParam from "./param/BusinessLineParam";
import { AppNode } from "@/types/appNode";
import StringParam from "./param/StringParam";
import DebtorConceptParam from "./param/DebtorConceptParam";
import SubsequentMeasurementParam from "./param/SubsequentMeasurementParam";
import MunicipalCodeParam from "./param/MunicipalCodeParam";
import StringTagParam from "./param/StringTagParam";
import PythonInstanceParam from "./param/PythonInstanceParam";
import DataCleanParam from "./param/DataCleanParam";
import FileFTParam from "./param/FileFTParam";
import CatalogScriptParam from "./param/CatalogScriptParam";

export default function NodeParamField({
  param,
  nodeId,
  disabled,
  nodeFT,
  valueDialog,
  onChange,

}: {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
  nodeFT?: AppNode;
  valueDialog?: string
  onChange?: (newValue: string) => void;
}) {
  const { updateNodeData, getNode } = useReactFlow();
  let node = getNode(nodeId) as AppNode;
  if (!node && nodeFT) {
    node = nodeFT;
  }

  // Si no se pasa onChange, usar el updateNodeData por defecto
  let value = node?.data.inputs?.[param.name];
  if (valueDialog) {
    value = valueDialog
  }
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      } else {
        updateNodeData(nodeId, {
          inputs: {
            ...node?.data.inputs,
            [param.name]: newValue,
          },
        });
      }
    },
    [onChange, nodeId, updateNodeData, param.name, node?.data.inputs]
  );

  // Usamos el value que viene en props, si no, buscamos en node
  const currentValue = value ?? node?.data.inputs?.[param.name] ?? "";

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.STRING_TAG:
      return (
        <StringTagParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.BUSINESS_LINE:
      return (
        <BusinessLineParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.DEBTOR_CONCEPT:
      return (
        <DebtorConceptParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.SUBSEQUENT_MEASUREMENT:
      return (
        <SubsequentMeasurementParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.MUNICIPAL_CODE:
      return (
        <MunicipalCodeParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.FILE_FT:
      return (
        <FileFTParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.PYTHON_INSTANCE:
      return (
        <PythonInstanceParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );

    case TaskParamType.DATA_CLEAN:
      return (
        <DataCleanParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );


    case TaskParamType.CATALOG_SCRIPT:
      return (
        <CatalogScriptParam
          param={param}
          value={currentValue}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
}
