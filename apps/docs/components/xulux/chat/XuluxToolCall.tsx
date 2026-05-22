"use client";

import { cn } from "@/lib/utils";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import {
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileCodeIcon,
  FileTextIcon,
  FolderTreeIcon,
  LoaderIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const TOOL_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    labels: [string, string];
    detail: (args: Record<string, unknown>) => string;
  }
> = {
  listDocs: {
    icon: FolderTreeIcon,
    labels: ["Listing", "Listed"],
    detail: (args) =>
      (args.path as string) ? `/${args.path}` : "documentation structure",
  },
  readDoc: {
    icon: FileTextIcon,
    labels: ["Reading", "Read"],
    detail: (args) =>
      `/docs/${((args.slugOrUrl as string) ?? "").replace(/^\/docs\/?/, "")}`,
  },
  bash: {
    icon: TerminalIcon,
    labels: ["Running", "Ran"],
    detail: (args) => {
      const cmd = (args.command as string) ?? "";
      return cmd.length > 60 ? `${cmd.slice(0, 57)}...` : cmd;
    },
  },
  readFile: {
    icon: FileCodeIcon,
    labels: ["Reading", "Read"],
    detail: (args) =>
      ((args.path as string) ?? "").split("/").slice(-2).join("/"),
  },
};

const DEFAULT_CONFIG = {
  icon: BookOpenIcon,
  labels: ["Running", "Completed"] as [string, string],
  detail: (_args: Record<string, unknown>, name: string) => name,
};

function formatPayload(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function XuluxToolCall({
  toolName,
  args,
  result,
  status,
}: ToolCallMessagePartProps): ReactNode {
  const isRunning = status?.type === "running";
  const config = TOOL_CONFIG[toolName] ?? DEFAULT_CONFIG;
  const icon = config.icon;
  const label = config.labels[isRunning ? 0 : 1];
  const detail =
    "detail" in config
      ? config.detail(args, toolName)
      : DEFAULT_CONFIG.detail(args, toolName);

  const startRef = useRef<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => {
    if (isRunning && !startRef.current) startRef.current = Date.now();
    else if (!isRunning && startRef.current) {
      setDuration(Date.now() - startRef.current);
    }
  }, [isRunning]);

  const [expanded, setExpanded] = useState(false);
  const Icon =
    status?.type === "running"
      ? LoaderIcon
      : status?.type === "complete"
        ? CheckIcon
        : icon;

  return (
    <div className="my-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 px-2.5 py-1.5 text-muted-foreground",
          isRunning && "animate-pulse",
        )}
      >
        <Icon
          className={cn(
            "size-3",
            status?.type === "running" && "animate-spin",
            status?.type === "complete" && "text-emerald-500",
          )}
        />
        <span className="flex-1 truncate text-left">
          {label} {detail}
        </span>
        {duration !== null && (
          <span className="text-muted-foreground/60">
            {duration < 1000
              ? `${duration}ms`
              : `${(duration / 1000).toFixed(1)}s`}
          </span>
        )}
        {expanded ? (
          <ChevronUpIcon className="size-3 text-muted-foreground/50" />
        ) : (
          <ChevronDownIcon className="size-3 text-muted-foreground/50" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2 border-border/60 border-t px-2.5 py-2">
          {[
            ["Input", args],
            ...(result !== undefined ? [["Output", result]] : []),
          ].map(([lbl, val]) => (
            <div key={lbl as string}>
              <p className="mb-1 font-medium text-[10px] text-muted-foreground/60 uppercase tracking-wide">
                {lbl as string}
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
                {formatPayload(val)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
