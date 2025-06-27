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
import { GetSubsequentMeasurements } from "@/actions/subsequentMeasurements/getSubsequentMeasurements";

export default function SubsequentMeasurementParam({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["subsequentMeasurementData"],
    queryFn: () => GetSubsequentMeasurements(),
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
            <SelectLabel>Subsequent Measurement</SelectLabel>
            {query.data?.map((sbm) => (
              <SelectItem key={sbm.id} value={sbm.id.toString()}>
                {sbm.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
