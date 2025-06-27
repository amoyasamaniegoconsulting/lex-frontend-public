"use client";
import { ParamProps } from "@/types/appNode";
import React from "react";

export default function DataCleanParam({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}
