"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/appNode";
import {
  Dispatch,
  SetStateAction,
  useId,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import {
  createFileFTSchema,
  createFileFTSchemaType,
  searchFileFTSchema,
  searchFileFTSchemaType,
} from "@/schema/fileft";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArchiveXIcon,
  CalendarIcon,
  CloudUploadIcon,
  Loader2,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UploadToS3 } from "@/actions/aws/s3/uploadToS3";
import { toast } from "sonner";
import { GetOriginsByFrequencyAndVersion } from "@/actions/origins/getOriginsByFrequencyAndVersion";
import { Origin, Prisma } from "@prisma/client";
import { DownloadFromS3 } from "@/actions/aws/s3/downloadFromS3";
import { downloadFile } from "@/lib/helper/download";
import { ReadFileFromPython } from "@/actions/python/readFileFromPython";

type OriginWithRelations = Prisma.OriginGetPayload<{
  include: { frequency: true };
}>;

export default function FileFTParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"subir" | "cargar">("subir");
  const [filesIds, setFileIds] = useState<string[]>([]);
  const [openAlertDelete, setOpenAlertDelete] = useState(false);

  useEffect(() => {
    if (typeof value === "string" && value.trim() !== "") {
      setFileIds(value.split(","));
    } else {
      setFileIds([]);
    }
  }, [value]);

  const handleDeleteFiles = () => {
    setFileIds([]);
    updateNodeParamValue("");
    setOpenAlertDelete(false);
  };

  const id = useId();

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={disabled}>Abrir Selector de Archivo</Button>
        </DialogTrigger>

        <DialogContent
          className={cn("w-full", tab === "cargar" ? "max-w-5xl" : "max-w-xl")}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{param.name}</DialogTitle>
          </DialogHeader>

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "subir" | "cargar")}
            className="w-full mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subir">Subir Archivo</TabsTrigger>
              <TabsTrigger value="cargar">Cargar Archivo</TabsTrigger>
            </TabsList>

            <TabsContent value="cargar" className="mt-4">
              <FileFTLoad
                value={value}
                updateNodeParamValue={updateNodeParamValue}
                filesIds={filesIds}
                setFileIds={setFileIds}
              />
            </TabsContent>

            <TabsContent value="subir" className="mt-4">
              <FileFTForm
                value={value}
                updateNodeParamValue={updateNodeParamValue}
                filesIds={filesIds}
                setFileIds={setFileIds}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            {filesIds.length === 0 ? (
              <Button variant="destructive" className="mt-2" disabled>
                <ArchiveXIcon className="mr-2" />
                No se han cargado archivos
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setOpenAlertDelete(true);
                  }}
                  variant="destructive"
                  className="mt-2"
                >
                  <Trash2Icon className="mr-2" />
                  Limpiar Archivos
                </Button>
                <Button variant="secondary" className="mt-2">
                  <UploadIcon className="mr-2" />
                  Archivos cargados ({filesIds.length})
                </Button>
                <Button variant="secondary" className="mt-2" onClick={() => setOpen(false)}>
                  Cerrar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Label className="mt-3">
        Se han cargado ({filesIds.length}) archivo/s
      </Label>
      <AlertDialogDeleteFile
        openAlertDelete={openAlertDelete}
        setOpenAlertDelete={setOpenAlertDelete}
        action={handleDeleteFiles}
      />
    </div>
  );
}

function FileFTForm({
  value,
  updateNodeParamValue,
  filesIds,
  setFileIds,
}: {
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  filesIds: string[];
  setFileIds: Dispatch<SetStateAction<string[]>>;
}) {
  const form = useForm<createFileFTSchemaType>({
    resolver: zodResolver(createFileFTSchema),
    defaultValues: {
      version: 1,
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: UploadToS3,
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        toast.success("File uploaded successfully", { id: "upload-to-s3" });
        console.log("Uploaded to S3 at:", data.id);
        addFileId(data.id!);

        form.reset();
      } else {
        toast.error(data.message || "Something went wrong", {
          id: "upload-to-s3",
        });
      }
    },
    onError: () => {
      toast.error("Failed to upload file", { id: "upload-to-s3" });
    },
  });

  const onSubmit = useCallback(
    (values: createFileFTSchemaType) => {
      toast.loading("Uploading file...", { id: "upload-to-s3" });

      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("cutOffDate", values.cutOffDate.toISOString());
      formData.append("frequency", values.frequency);
      if (values.version) {
        formData.append("version", values.version.toString());
      }

      mutate(formData);
    },
    [mutate]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.info("Solo se permiten archivos .xls o .xlsx");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setPendingFile(file);
    setFileModalOpen(true); // Abre el modal de confirmar archivo
  };

  const handleAccept = () => {
    if (pendingFile) {
      form.setValue("file", pendingFile); // Guarda el archivo en el form para validación
      form.clearErrors("file"); // Limpia errores si hubo
    }
    setFileModalOpen(false);
    setPendingFile(null);
  };

  const handleReject = () => {
    // Establecemos un "archivo vacío" para limpiar el valor sin usar `null`
    form.resetField("file"); // Esto limpia el campo correctamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPendingFile(null);
    setFileModalOpen(false);
  };

  const addFileId = (fileId: string) => {
    if (fileId.trim() !== "" && !filesIds.includes(fileId)) {
      const newFileIds = [...filesIds, fileId];
      setFileIds(newFileIds);
      updateNodeParamValue(newFileIds.join(","));
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md mx-auto"
        >
          {/* FileId: archivo */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecciona un archivo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                  />
                </FormControl>
                {field.value && (
                  <p className="text-xs text-muted-foreground">
                    Archivo seleccionado: {field.value.name}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* cutOffDate: calendario */}
          <FormField
            control={form.control}
            name="cutOffDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de corte</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Selecciona una fecha"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => {
                        field.onChange(e);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* frequency: select */}
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frecuencia</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Diaria</SelectItem>
                      <SelectItem value="2">Semanal</SelectItem>
                      <SelectItem value="3">Mensual</SelectItem>
                      <SelectItem value="4">Bimestral</SelectItem>
                      <SelectItem value="5">Trimestral</SelectItem>
                      <SelectItem value="6">Semestral</SelectItem>
                      <SelectItem value="7">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* version: número */}
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versión</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {" "}
                  <CloudUploadIcon /> Cargar
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <FileFTPreview
        pendingFile={pendingFile}
        fileModalOpen={fileModalOpen}
        setFileModalOpen={setFileModalOpen}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    </>
  );
}

function FileFTLoad({
  value,
  updateNodeParamValue,
  filesIds,
  setFileIds,
}: {
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  filesIds: string[];
  setFileIds: Dispatch<SetStateAction<string[]>>;
}) {
  const form = useForm<searchFileFTSchemaType>({
    resolver: zodResolver(searchFileFTSchema),
    defaultValues: {
      version: 1,
    },
  });

  const [results, setResults] = useState<OriginWithRelations[]>();

  const onSubmit = async (data: searchFileFTSchemaType) => {
    console.log("Buscando con:", data);
    const query = await GetOriginsByFrequencyAndVersion(
      parseInt(data.frequency!),
      data.version!
    );

    setResults(query!);
  };

  const handleCheckboxChange = (fileId: string) => {
    setFileIds((prev) => {
      const isSelected = prev.includes(fileId);
      const newFileIds = isSelected
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId];

      updateNodeParamValue(newFileIds.join(","));
      return newFileIds;
    });
  };

  const handleDownload = async (fileKey: string) => {
    const presignedUrl = await DownloadFromS3(fileKey);
    console.log("@presignedUrl", presignedUrl);
    await downloadFile(presignedUrl, fileKey);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto">
      {/* Formulario */}
      <div className="w-full md:w-1/2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {/* frequency: select */}
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Diaria</SelectItem>
                        <SelectItem value="2">Semanal</SelectItem>
                        <SelectItem value="3">Mensual</SelectItem>
                        <SelectItem value="4">Bimestral</SelectItem>
                        <SelectItem value="5">Trimestral</SelectItem>
                        <SelectItem value="6">Semestral</SelectItem>
                        <SelectItem value="7">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* version: número */}
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Versión</FormLabel>
                  <FormControl>
                    <Input type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit">
                <SearchIcon /> Buscar
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Resultados */}
      <div className="w-full flex flex-col">
        <h3 className="font-semibold mb-4 text-lg">Resultados</h3>

        <div className="w-full border rounded-lg p-4 shadow-sm h-[500px] overflow-y-auto bg-background">
          {results && results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((file, idx) => (
                <li
                  key={file.id}
                  className="flex flex-col gap-2 border border-muted rounded-2xl p-4 bg-muted/40 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`file-${idx}`}
                        checked={filesIds.includes(file.id)}
                        onCheckedChange={() => handleCheckboxChange(file.id)}
                      />
                      <div>
                        <label
                          htmlFor={`file-${idx}`}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {file.originName}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {file.extension.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {file.cutOffDate && (
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Corte: {new Date(file.cutOffDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                    <span>Versión: {file.version}</span>
                    <span>Frecuencia: {file.frequency?.name}</span>
                    {file.url && (
                      <Button
                        variant={"ghost"}
                        onClick={() => handleDownload(file.url)}
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Ver archivo
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FileFTPreview({
  pendingFile,
  fileModalOpen,
  setFileModalOpen,
  handleAccept,
  handleReject,
}: {
  pendingFile: File | null;
  fileModalOpen: boolean;
  setFileModalOpen: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => void;
  handleReject: () => void;
}) {
  const { isPending, data } = useQuery({
    queryKey: ["readFileFromPython", pendingFile?.name],
    queryFn: async () => {
      if (!pendingFile) return null;
      const formData = new FormData();
      formData.append("file", pendingFile);
      return await ReadFileFromPython(formData, 100);
    },
    refetchInterval: 10000,
  });

  return (
    <Dialog open={fileModalOpen} onOpenChange={setFileModalOpen}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Visor de Archivo</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto p-4 bg-background rounded-md border border-border">
          {isPending ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
            </div>
          ) : data?.dataFile?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.dataFile.map((col, i) => (
                      <TableHead key={i} className="text-foreground">
                        {col.column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.dataFile[0]?.values.map((_, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {data.dataFile.map((col, colIndex) => (
                        <TableCell key={colIndex} className="text-foreground">
                          {col.values[rowIndex]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No hay datos disponibles para mostrar.
            </p>
          )}
        </div>

        <div className="py-4 text-sm text-muted-foreground">
          ¿Deseas conservar el archivo cargado?
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
          <Button onClick={handleAccept}>Aceptar</Button>
          <Button variant="destructive" onClick={handleReject}>
            Rechazar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogDeleteFile({
  openAlertDelete,
  setOpenAlertDelete,
  action,
}: {
  openAlertDelete: boolean;
  setOpenAlertDelete: Dispatch<SetStateAction<boolean>>;
  action: () => void;
}) {
  return (
    <AlertDialog open={openAlertDelete}>
      <AlertDialogTrigger asChild>Delete Files</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpenAlertDelete(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white"
            onClick={action}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
