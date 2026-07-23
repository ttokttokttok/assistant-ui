"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAuiState, type ToolCallMessagePart } from "@assistant-ui/react";
import { parseLearnCourseStepResult } from "@/lib/xulux/learn/tool-result";
import { applyLearnCourseStepResult } from "@/lib/xulux/learn/progress";
import { analytics } from "@/lib/analytics";
import {
  useXuluxAnalytics,
  withXuluxContext,
} from "@/lib/xulux/analytics-context";
import { useLearnMode } from "./LearnModeContext";

export function LearnCourseObserver() {
  const { progress, updateProgress, openTab } = useLearnMode();
  const analyticsCtx = useXuluxAnalytics();
  const handledRef = useRef(new Set<string>());
  const latestCall = useAuiState((state) =>
    (state.thread.messages ?? [])
      .flatMap((message) => message.content)
      .filter(
        (part): part is ToolCallMessagePart =>
          part.type === "tool-call" && part.toolName === "getNextCourseStep",
      )
      .at(-1),
  );
  const parsed = useMemo(() => {
    if (!latestCall) return null;
    const result = (
      latestCall as ToolCallMessagePart & {
        result?: unknown;
        toolCallId?: string;
      }
    ).result;
    const payload = parseLearnCourseStepResult(result);
    if (!payload) return null;
    return {
      id:
        (latestCall as ToolCallMessagePart & { toolCallId?: string })
          .toolCallId ?? JSON.stringify(payload),
      payload,
    };
  }, [latestCall]);

  useEffect(() => {
    if (!parsed || handledRef.current.has(parsed.id)) return;
    handledRef.current.add(parsed.id);
    const next = applyLearnCourseStepResult(progress, parsed.payload);
    updateProgress(next);
    openTab("preview");

    if (parsed.payload.course.status === "completed") {
      analytics.xulux.learnCourseCompleted(
        withXuluxContext(analyticsCtx, {
          course_id: progress.courseId,
        }),
      );
    } else {
      analytics.xulux.learnStepAdvanced(
        withXuluxContext(analyticsCtx, {
          course_id: progress.courseId,
          step_id: parsed.payload.step.id,
          step_index: parsed.payload.step.index,
        }),
      );
    }
  }, [analyticsCtx, openTab, parsed, progress, updateProgress]);

  return null;
}
