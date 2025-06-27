"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layers2Icon, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  createCatalogWorkflowSchema,
  createCatalogWorkflowSchemaType,
} from "@/schema/workflow";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { CreateWorkflowByCatalog } from "@/actions/workflows/createWorkflowByCatalog";
import { GetCatalogWorkflows } from "@/actions/catalogs/getCatalogWorkflows";

export default function CreateWorkflowCatalogDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<createCatalogWorkflowSchemaType>({
    resolver: zodResolver(createCatalogWorkflowSchema),
    defaultValues: {},
  });

  const query = useQuery({
    queryKey: ["createWorkflowCatalogDialog"],
    queryFn: () => GetCatalogWorkflows(),
    refetchInterval: 10000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkflowByCatalog,
    onSuccess: () => {
      toast.success("Workflow created successfully", { id: "create-workflow" });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: "create-workflow" });
      setOpen(false);
    },
  });

  const onSubmit = useCallback(
    (values: createCatalogWorkflowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create template"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Choose workflow"
          subtitle="Start building your workflow from template"
        />
        <div className="px-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="catalogId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Plantilla
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={query.isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          {query.data?.map((catalog) => (
                            <SelectItem key={catalog.id} value={catalog.id}>
                              {catalog.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Escoja una plantilla
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
