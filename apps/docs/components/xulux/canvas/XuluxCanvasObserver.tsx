"use client";

import { useEffect, useRef } from "react";
import { useAuiState, type ToolCallMessagePart } from "@assistant-ui/react";

export function XuluxCanvasObserver({
  onCanvasReady,
  onCanvasError,
}: {
  onCanvasReady: (url: string) => void;
  onCanvasError: (error: string) => void;
}) {
  const handledKeyRef = useRef<string | null>(null);

  const latestRefresh = useAuiState((state) =>
    (state.thread.messages ?? [])
      .flatMap((m) =>
        m.content.filter(
          (p): p is ToolCallMessagePart =>
            p.type === "tool-call" &&
            (p as ToolCallMessagePart).toolName === "refreshCanvas",
        ),
      )
      .at(-1),
  );

  useEffect(() => {
    if (!latestRefresh) return;
    const result = (latestRefresh as ToolCallMessagePart & { result?: unknown })
      .result;
    if (!result || typeof result !== "object") return;
    const { url, error } = result as { url?: unknown; error?: unknown };
    const id =
      (latestRefresh as ToolCallMessagePart & { toolCallId?: string })
        .toolCallId ?? "";
    const key = `${id}:${String(url ?? error ?? "")}`;
    if (handledKeyRef.current === key) return;
    handledKeyRef.current = key;

    if (typeof url === "string" && url) onCanvasReady(url);
    else if (typeof error === "string" && error) onCanvasError(error);
  }, [onCanvasReady, onCanvasError, latestRefresh]);

  return null;
}
