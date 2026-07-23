"use client";

import { ToolErrorCard, ToolStatusCard, ToolTraceCard } from "@/lib/tool-trace";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import {
  BookOpenIcon,
  ExternalLinkIcon,
  FileCodeIcon,
  FileTextIcon,
  FolderTreeIcon,
  InfoIcon,
  LayoutTemplateIcon,
  TerminalIcon,
  type LucideIcon,
  ArrowRight,
  CheckCircle2,
  Download,
  Files,
  PartyPopper,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useAui } from "@assistant-ui/react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { parseLearnCourseStepResult } from "@/lib/xulux/learn/tool-result";
import { useLearnMode } from "../learn/LearnModeContext";
import { analytics } from "@/lib/analytics";
import {
  useXuluxAnalytics,
  withXuluxContext,
} from "@/lib/xulux/analytics-context";

function getToolIcon(toolName: string): ReactNode {
  const Icon = getToolIconComponent(toolName);
  return <Icon className="size-3.5" />;
}

function getToolIconComponent(toolName: string): LucideIcon {
  switch (toolName) {
    case "listDocs":
      return FolderTreeIcon;
    case "readDoc":
      return FileTextIcon;
    case "bash":
    case "inspectSourceMap":
      return TerminalIcon;
    case "readFile":
    case "readSourceMapFile":
      return FileCodeIcon;
    case "getTemplateList":
      return LayoutTemplateIcon;
    case "getTemplateDetails":
      return InfoIcon;
    case "openTemplatePreview":
      return ExternalLinkIcon;
    default:
      return BookOpenIcon;
  }
}

function getRunningMessage(toolName: string): string {
  switch (toolName) {
    case "listDocs":
      return "Listing docs...";
    case "readDoc":
      return "Reading page...";
    case "bash":
    case "inspectSourceMap":
      return "Running command...";
    case "readFile":
    case "readSourceMapFile":
      return "Reading file...";
    case "getTemplateList":
      return "Loading templates...";
    case "getTemplateDetails":
      return "Reading template...";
    case "openTemplatePreview":
      return "Opening preview...";
    default:
      return "Running...";
  }
}

function extractToolError(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const record = result as Record<string, unknown>;
  if (record.success === false) {
    if (typeof record.error === "string") return record.error;
    return "Tool failed";
  }
  if (typeof record.error === "string") return record.error;
  return null;
}

function summarizeXuluxResult(toolName: string, result: unknown): string {
  if (result === undefined || result === null) return "Done";

  const error = extractToolError(result);
  if (error) return error;

  if (typeof result !== "object") return String(result);

  const record = result as Record<string, unknown>;

  switch (toolName) {
    case "listDocs": {
      const children = record.children;
      if (Array.isArray(children)) {
        return `${children.length} item${children.length === 1 ? "" : "s"}`;
      }
      return "Listed";
    }
    case "readDoc":
      return typeof record.title === "string" ? record.title : "Read page";
    case "bash":
    case "inspectSourceMap": {
      const stdout = record.stdout;
      if (typeof stdout === "string" && stdout.trim()) {
        const line = stdout.trim().split("\n")[0] ?? "";
        return line.length > 48 ? `${line.slice(0, 45)}...` : line;
      }
      return "Completed";
    }
    case "readFile":
    case "readSourceMapFile": {
      const path = typeof record.path === "string" ? record.path : "";
      return path ? path.split("/").slice(-2).join("/") : "Read file";
    }
    case "getTemplateList": {
      const templates = record.templates;
      if (Array.isArray(templates)) {
        return `${templates.length} template${templates.length === 1 ? "" : "s"}`;
      }
      return "Templates loaded";
    }
    case "getTemplateDetails": {
      const name =
        typeof record.name === "string"
          ? record.name
          : typeof record.id === "string"
            ? record.id
            : "Template details";
      return name;
    }
    case "openTemplatePreview": {
      if (typeof record.title === "string") return record.title;
      const templateId =
        typeof record.templateId === "string" ? record.templateId : "";
      const versionId =
        typeof record.versionId === "string" ? record.versionId : "";
      if (templateId && versionId) return `${templateId} · ${versionId}`;
      return templateId || "Preview opened";
    }
    default:
      return "Completed";
  }
}

export function XuluxToolCall({
  toolName,
  args,
  result,
  status,
}: ToolCallMessagePartProps): ReactNode {
  if (toolName === "getNextCourseStep") {
    return <LearnCourseToolCall result={result} status={status} args={args} />;
  }
  const signature = toolName;
  const icon = getToolIcon(toolName);
  const isRunning = status?.type === "running";
  const error = !isRunning ? extractToolError(result) : null;

  if (isRunning) {
    return (
      <ToolStatusCard
        icon={icon}
        signature={signature}
        message={getRunningMessage(toolName)}
        loading
      />
    );
  }

  if (error) {
    return <ToolErrorCard signature={signature} error={error} args={args} />;
  }

  return (
    <ToolTraceCard
      icon={icon}
      signature={signature}
      description={summarizeXuluxResult(toolName, result)}
      args={args}
      result={result}
    />
  );
}

function LearnCourseToolCall({
  result,
  status,
  args,
}: Pick<ToolCallMessagePartProps, "result" | "status" | "args">) {
  const parsed = parseLearnCourseStepResult(result);
  if (status?.type === "running") {
    return (
      <ToolStatusCard
        icon={<BookOpenIcon className="size-3.5" />}
        signature="Course step"
        message="Loading the next lesson…"
        loading
      />
    );
  }
  if (!parsed) {
    return (
      <ToolErrorCard
        signature="Course step"
        error="The course step could not be loaded. Please retry."
        args={args}
      />
    );
  }
  return "finalStage" in parsed ? (
    <LearnCompletionCard result={parsed} />
  ) : (
    <LearnStepCard result={parsed} />
  );
}

function LearnStepCard({
  result,
}: {
  result: Extract<
    NonNullable<ReturnType<typeof parseLearnCourseStepResult>>,
    { course: { status: "in_progress" } }
  >;
}) {
  const aui = useAui();
  const { openTab } = useLearnMode();
  const [changesOpen, setChangesOpen] = useState(false);

  return (
    <article className="bg-card my-3 overflow-hidden rounded-xl border shadow-sm">
      <div className="border-b p-4">
        <p className="text-muted-foreground text-xs font-medium">
          Step {result.step.index} of {result.step.total}
        </p>
        <h3 className="mt-1 font-semibold">{result.step.title}</h3>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none p-4">
        <ReactMarkdown>{result.step.content}</ReactMarkdown>
      </div>
      <div className="border-t p-3">
        <button
          type="button"
          className="hover:bg-muted flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm"
          aria-expanded={changesOpen}
          onClick={() => setChangesOpen((open) => !open)}
        >
          <span className="flex items-center gap-2">
            <Files className="size-4" />
            {result.changes.files.length} changed files
          </span>
          <span className="text-xs">
            <span className="text-green-600">+{result.changes.additions}</span>{" "}
            <span className="text-red-600">−{result.changes.deletions}</span>
          </span>
        </button>
        {changesOpen && (
          <ul className="mt-1 space-y-1 px-2 pb-2">
            {result.changes.files.map((file) => (
              <li key={file.path}>
                <button
                  type="button"
                  className="hover:text-foreground text-muted-foreground flex w-full items-center justify-between gap-2 py-1 text-left font-mono text-xs"
                  onClick={() => openTab("diff", file.path)}
                >
                  <span className="truncate">{file.path}</span>
                  <span className="uppercase">{file.status[0]}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openTab("preview")}
          >
            Open preview
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              aui.thread().append({
                role: "user",
                content: [
                  { type: "text", text: "Move to the next course step." },
                ],
              })
            }
          >
            Continue
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function LearnCompletionCard({
  result,
}: {
  result: Extract<
    NonNullable<ReturnType<typeof parseLearnCourseStepResult>>,
    { course: { status: "completed" } }
  >;
}) {
  const { progress, updateProgress, openTab } = useLearnMode();
  const analyticsCtx = useXuluxAnalytics();
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (progress.completionCelebrated) return;
    const timer = window.setTimeout(() => {
      setCelebrate(true);
      setCertificateOpen(!progress.certificatePromptDismissed);
      updateProgress({
        ...progress,
        completionCelebrated: true,
        updatedAt: Date.now(),
      });
      window.setTimeout(() => setCelebrate(false), 1800);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [progress, updateProgress]);

  return (
    <>
      {celebrate && <Confetti />}
      <article className="bg-card my-3 rounded-xl border p-5 shadow-sm">
        <CheckCircle2 className="size-7 text-green-600" />
        <h3 className="mt-3 text-lg font-semibold">Course complete</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          You built and inspected both canonical stages. Your final preview and
          files remain available in the workspace.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => openTab("preview")}
          >
            Final preview
          </Button>
          <a
            href={result.finalStage.downloadUrl}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium"
            onClick={() =>
              analytics.xulux.learnCourseDownloaded(
                withXuluxContext(analyticsCtx, {
                  course_id: result.course.id,
                  stage_id: result.finalStage.id,
                }),
              )
            }
          >
            <Download className="size-4" />
            Download project
          </a>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCertificateOpen(true)}
          >
            Certificate
          </Button>
        </div>
      </article>
      {certificateOpen && (
        <CertificateDialog
          courseId={result.course.id}
          onClose={(dismissed) => {
            setCertificateOpen(false);
            if (dismissed) {
              updateProgress({
                ...progress,
                certificatePromptDismissed: true,
                updatedAt: Date.now(),
              });
            }
          }}
        />
      )}
    </>
  );
}

function CertificateDialog({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: (dismissed: boolean) => void;
}) {
  const analyticsCtx = useXuluxAnalytics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [generated, setGenerated] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-title"
    >
      <div className="bg-background w-full max-w-md rounded-xl border p-5 shadow-xl">
        <PartyPopper className="size-6" />
        <h2 id="certificate-title" className="mt-3 text-lg font-semibold">
          {generated ? "Certificate generated" : "Generate your certificate"}
        </h2>
        {generated ? (
          <>
            <p className="text-muted-foreground mt-2 text-sm">
              Congratulations, {name}. You completed Build your first assistant
              UI.
            </p>
            <Button className="mt-5 w-full" onClick={() => onClose(false)}>
              Done
            </Button>
          </>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              analytics.xulux.learnCertificateSubmitted(
                withXuluxContext(analyticsCtx, {
                  course_id: courseId,
                  consent,
                }),
              );
              setGenerated(true);
            }}
          >
            <label className="block text-sm">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="flex items-start gap-2 text-xs">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5"
              />
              Email me occasional assistant-ui learning updates (optional).
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onClose(true)}
              >
                Not now
              </Button>
              <Button type="submit">Generate</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: 28 }, (_, index) => (
        <span
          key={index}
          className="absolute top-[-10px] h-3 w-2 animate-[fall_1.8s_ease-in_forwards] rounded-sm"
          style={{
            left: `${(index * 37) % 100}%`,
            background: ["#22c55e", "#3b82f6", "#eab308", "#ec4899"][index % 4],
            animationDelay: `${(index % 7) * 70}ms`,
            transform: `rotate(${index * 29}deg)`,
          }}
        />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(105vh) rotate(720deg); opacity: .2; } }`}</style>
    </div>
  );
}
