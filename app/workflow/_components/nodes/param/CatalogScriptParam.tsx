"use client";

import { useId } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import { GetBusinessLines } from "@/actions/businessLines/getBusinessLines";
import { GetCatalogScripts } from "@/actions/catalogs/getCatalogScripts";

export default function CatalogScriptParam({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["catalogScript"],
    queryFn: () => GetCatalogScripts(),
    refetchInterval: 10000,
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Catálogos de Scripts</SelectLabel>
            {query.data?.map((bs) => (
              <SelectItem key={bs.id} value={bs.id.toString()}>
                V{bs.version} - {bs.name} 
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
