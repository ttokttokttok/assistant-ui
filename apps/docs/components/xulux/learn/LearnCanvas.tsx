"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Code2, Eye, GitCompare, Loader2 } from "lucide-react";
import { DiffViewer } from "@/components/assistant-ui/diff-viewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compareStageFiles } from "@/lib/xulux/learn/stage-diff";
import type { LearnStageFiles } from "@/lib/xulux/learn/stage-source";
import { createVirtualArchiveFromTextFiles } from "@/lib/xulux/virtual-archive";
import { XuluxFileBrowser } from "../canvas/XuluxFileBrowser";
import { LearnCurriculumOverview } from "./LearnCurriculumOverview";
import { useLearnMode } from "./LearnModeContext";

type SourceState =
  | { status: "idle" | "loading" }
  | {
      status: "ready";
      files: LearnStageFiles;
      previousFiles: LearnStageFiles;
    }
  | { status: "error"; error: string };

const tabs = [
  { id: "curriculum" as const, label: "Curriculum", icon: BookOpen },
  { id: "preview" as const, label: "Preview", icon: Eye },
  { id: "files" as const, label: "Files", icon: Code2 },
  { id: "diff" as const, label: "Diff", icon: GitCompare },
];

export function LearnCanvas({ onStartCourse }: { onStartCourse: () => void }) {
  const { course, progress, activeTab, selectedFile, selectStep, openTab } =
    useLearnMode();
  const selectedStep =
    course.steps.find(({ id }) => id === progress.selectedStepId) ?? null;
  const selectedIndex = selectedStep
    ? course.steps.findIndex(({ id }) => id === selectedStep.id)
    : -1;
  const [source, setSource] = useState<SourceState>({ status: "idle" });
  const [sourceVersion, setSourceVersion] = useState(0);
  const [diffViewMode, setDiffViewMode] = useState<"unified" | "split">(
    "unified",
  );

  useEffect(() => {
    if (!selectedStep) {
      setSource({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setSource({ status: "loading" });
    const previous = course.steps[selectedIndex - 1];
    const load = async (stageId: string) => {
      const params = new URLSearchParams({ courseId: course.id, stageId });
      const response = await fetch(`/api/xulux/learn/source?${params}`, {
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(`Source request failed (${response.status})`);
      const payload = (await response.json()) as { files?: unknown };
      if (!payload.files || typeof payload.files !== "object") {
        throw new Error("Source response was invalid.");
      }
      return payload.files as LearnStageFiles;
    };
    void Promise.all([
      load(selectedStep.stageId),
      previous ? load(previous.stageId) : Promise.resolve({}),
    ])
      .then(([files, previousFiles]) =>
        setSource({ status: "ready", files, previousFiles }),
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSource({
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    return () => controller.abort();
  }, [course.id, course.steps, selectedIndex, selectedStep, sourceVersion]);

  const archive = useMemo(
    () =>
      source.status === "ready"
        ? createVirtualArchiveFromTextFiles(source.files)
        : null,
    [source],
  );
  const patch = useMemo(() => {
    if (source.status !== "ready" || !selectedFile) return null;
    return createFilePatch(
      selectedFile,
      source.previousFiles[selectedFile],
      source.files[selectedFile],
    );
  }, [selectedFile, source]);
  const changes =
    source.status === "ready"
      ? compareStageFiles(source.previousFiles, source.files)
      : null;

  return (
    <section
      className="bg-background flex h-full min-h-0 flex-col"
      aria-label="Course workspace"
    >
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b p-1.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={activeTab === id ? "secondary" : "ghost"}
            className="h-8 gap-1.5"
            disabled={id !== "curriculum" && !selectedStep}
            onClick={() =>
              openTab(
                id,
                id === "files" || id === "diff"
                  ? (selectedFile ?? selectedStep?.focusFiles[0])
                  : undefined,
              )
            }
          >
            <Icon className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>
      <div className="relative min-h-0 flex-1">
        {activeTab === "curriculum" && (
          <LearnCurriculumOverview
            course={course}
            progress={progress}
            onStartCourse={onStartCourse}
            onSelectStep={selectStep}
          />
        )}
        {selectedStep && (
          <div
            aria-hidden={activeTab !== "preview"}
            className={cn(
              "absolute inset-0",
              activeTab === "preview"
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0",
            )}
          >
            <iframe
              className="h-full w-full border-0 bg-white"
              title={`${selectedStep.title} preview`}
              src={course.stages[selectedStep.stageId]!.previewPath}
            />
          </div>
        )}
        {(activeTab === "files" || activeTab === "diff") &&
          source.status === "loading" && <LoadingSource />}
        {(activeTab === "files" || activeTab === "diff") &&
          source.status === "error" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-sm">
              <p className="text-destructive">{source.error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSourceVersion((version) => version + 1)}
              >
                Retry source
              </Button>
            </div>
          )}
        {activeTab === "files" && archive && (
          <XuluxFileBrowser
            archive={archive}
            selectedPath={selectedFile}
            onSelectedPathChange={(path) => openTab("files", path)}
          />
        )}
        {activeTab === "diff" && source.status === "ready" && (
          <div className="flex h-full min-h-0">
            <div className="w-52 shrink-0 overflow-y-auto border-r p-2">
              <p className="text-muted-foreground px-2 py-1 text-xs">
                {changes?.files.length ?? 0} changed files
              </p>
              {changes?.files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => openTab("diff", file.path)}
                  className={cn(
                    "hover:bg-muted mt-0.5 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left font-mono text-xs",
                    selectedFile === file.path && "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      file.status === "added" && "bg-green-500",
                      file.status === "modified" && "bg-amber-500",
                      file.status === "deleted" && "bg-red-500",
                    )}
                  />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 justify-end gap-1 border-b p-2">
                {(["unified", "split"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={diffViewMode === mode ? "secondary" : "ghost"}
                    className="h-7 capitalize"
                    onClick={() => setDiffViewMode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-3">
                {patch ? (
                  <DiffViewer patch={patch} viewMode={diffViewMode} />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Select a changed file to compare it.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingSource() {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
      <Loader2 className="size-4 animate-spin" />
      Loading source…
    </div>
  );
}

function createFilePatch(
  path: string,
  oldFile: string | undefined,
  newFile: string | undefined,
) {
  const oldLines = oldFile ? oldFile.replace(/\n$/, "").split("\n") : [];
  const newLines = newFile ? newFile.replace(/\n$/, "").split("\n") : [];
  return [
    `--- ${oldFile === undefined ? "/dev/null" : `a/${path}`}`,
    `+++ ${newFile === undefined ? "/dev/null" : `b/${path}`}`,
    `@@ -${oldLines.length ? 1 : 0},${oldLines.length} +${newLines.length ? 1 : 0},${newLines.length} @@`,
    ...oldLines.map((line) => `-${line}`),
    ...newLines.map((line) => `+${line}`),
  ].join("\n");
}
