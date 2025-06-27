"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { DatesToDurationString } from "@/lib/helper/dates";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import PhaseStatusBadge from "./PhaseStatusBadge";
import { useEffect } from "react";
import Link from "next/link";
import { DownloadFromS3 } from "@/actions/aws/s3/downloadFromS3";
import { downloadFile } from "@/lib/helper/download";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase, query.data?.status],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;
  useEffect(() => {
    //While running we auto-select the current running phase in the sidebar
    const phases = query.data?.phases || [];
    if (isRunning) {
      //Select the last executed phase
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1
      )[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1
    )[0];
    setSelectedPhase(phaseToSelect.id);
  }, [query.data?.phases, isRunning, setSelectedPhase]);

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );
  return (
    <div className="flex w-full h-full">
      <aside
        className="w-[440px] min-w-[440px] max-w-[440px] 
      border-r-2 border-separate flex flex-grow flex-col overflow-hidden"
      >
        <div className="py-4 px-2">
          {/* {Status Labe} */}

          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center">
                <PhaseStatusBadge
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span>{query.data?.status}</span>
              </div>
            }
          />

          {/* {Started at Labe} */}
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />

          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
        </div>

        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>

        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParameterViewer
              title="Inputs"
              subtitle="Inputs used for this phase"
              paramsJson={phaseDetails.data.inputs}
            />

            <ParameterViewer
              title="Outputs"
              subtitle="Outputs used for this phase"
              paramsJson={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

function ParameterViewer({
  title,
  subtitle,
  paramsJson,
}: {
  title: string;
  subtitle: string;
  paramsJson: string | null;
}) {
  const [open, setOpen] = useState(false);

  const params = paramsJson ? JSON.parse(paramsJson) : undefined;
  const [dataCleanParsed, setDataCleanParsed] = useState<any[]>([]);

  const handleDownload = async (fileKey: string) => {
    const presignedUrl = await DownloadFromS3(fileKey);
    console.log("@presignedUrl", presignedUrl);
    await downloadFile(presignedUrl, fileKey);
  };

  const handleOpenDataClean = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setDataCleanParsed(parsed);
      setOpen(true);
    } catch (error) {
      console.error("Error parsing data clean JSON:", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col gap-2">
            {(!params || Object.keys(params).length === 0) && (
              <p className="text-sm">No parameters generated by this phase</p>
            )}
            {params &&
              Object.entries(params).map(([key, value]) => {
                const isUrl = key.toLowerCase() === "url";
                const isDataClean = key.toLowerCase() === "data clean";
                console.log(key.toLowerCase())
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center space-y-1"
                  >
                    <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                      {key}
                    </p>
                    {isUrl ? (
                      <Button
                        onClick={() => handleDownload(value as string)}
                        variant={"ghost"}
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Descargar Archivo
                      </Button>
                    ) : isDataClean ? (
                      <Button
                        onClick={() => handleOpenDataClean(value as string)}
                        variant={"ghost"}
                        className="text-primary hover:underline font-medium"
                      >
                        Visualizar Datos
                      </Button>
                    ) : (
                      <Input
                        readOnly
                        className="flex-1 basis-2/3"
                        value={value as string}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <ParamsTableViewer
        open={open}
        setOpen={setOpen}
        dataCleanParsed={dataCleanParsed}
      />
    </>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || logs.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-xs text-muted-foreground p-[2px] pl-4"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-4",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ParamsTableViewer({
  open,
  setOpen,
  dataCleanParsed,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCleanParsed: any[];
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Vista previa de Datos</DialogTitle>
        </DialogHeader>

        {dataCleanParsed.length > 0 ? (
          <div className="overflow-x-auto rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(dataCleanParsed[0]).map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataCleanParsed.map((row, idx) => (
                  <TableRow key={idx}>
                    {Object.values(row).map((val, i) => (
                      <TableCell key={i}>{String(val)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No hay datos válidos.</p>
        )}

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}