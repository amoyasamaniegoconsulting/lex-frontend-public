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
import { GetIdentificationTypes } from "@/actions/identificationType/getIdentificationTypes";

export default function IdentificationTypeParam({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["identificationTypeData"],
    queryFn: () => GetIdentificationTypes(),
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
            <SelectLabel>Identification Type</SelectLabel>
            {query.data?.map((identification) => (
              <SelectItem key={identification.id} value={identification.id.toString()}>
                {identification.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
