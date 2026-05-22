"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Code2,
  ExternalLink,
  KeyRound,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { XuluxTemplate } from "../templates/types";
import { TemplateCard } from "./TemplateCard";
import { Thumbnail } from "./Thumbnail";

type Props = {
  template: XuluxTemplate | null;
  allTemplates: XuluxTemplate[];
  onClose: () => void;
  onSelect: (template: XuluxTemplate) => void;
};

export function TemplateDetailModal({
  template,
  allTemplates,
  onClose,
  onSelect,
}: Props) {
  const [current, setCurrent] = useState<XuluxTemplate | null>(template);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(template);
    setIframeLoaded(false);
  }, [template]);

  const others = allTemplates.filter((c) => c.id !== current?.id).slice(0, 4);
  const handleOther = (next: XuluxTemplate) => {
    setCurrent(next);
    setIframeLoaded(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!current) return null;

  const hasPreview = Boolean(current.previewUrl);
  const requiredEnv = current.env.filter((e) => e.required);
  const previewLabel =
    current.previewStatus === "live"
      ? "Hosted preview"
      : current.previewStatus === "stale"
        ? "Stale preview"
        : current.screenshotUrl
          ? "Screenshot only"
          : "No preview";

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{current.title}</DialogTitle>
        </DialogHeader>
        <div className="flex shrink-0 flex-col sm:flex-row">
          <div className="relative min-h-[320px] overflow-hidden bg-black sm:min-h-[460px] sm:w-[65%]">
            {hasPreview ? (
              <>
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3">
                    <Thumbnail
                      gradient={current.gradient}
                      src={current.screenshotUrl}
                      className="absolute inset-0 h-full w-full rounded-none"
                    />
                    <div className="relative flex flex-col items-center gap-2 rounded-md bg-black/40 px-4 py-2 text-white/90 backdrop-blur-sm">
                      <Loader2 className="size-6 animate-spin" />
                      <span className="text-xs uppercase tracking-wider">
                        Loading preview...
                      </span>
                    </div>
                  </div>
                )}
                <iframe
                  key={current.id}
                  src={current.previewUrl}
                  className="absolute inset-0 z-10 h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  title={`${current.title} preview`}
                  onLoad={() => setIframeLoaded(true)}
                  style={{
                    opacity: iframeLoaded ? 1 : 0,
                    transition: "opacity 200ms",
                  }}
                />
                <a
                  href={current.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-white/80 text-xs backdrop-blur-sm transition-colors hover:text-white"
                >
                  <ExternalLink className="size-3" />
                  Open in new tab
                </a>
              </>
            ) : (
              <Thumbnail
                gradient={current.gradient}
                src={current.screenshotUrl}
                label={current.title}
                className="absolute inset-0 h-full w-full rounded-none"
              />
            )}
          </div>

          <div className="flex flex-col justify-between border-border border-l p-7 sm:w-[35%]">
            <div>
              <h2 className="font-semibold text-lg tracking-tight">
                {current.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                {current.description}
              </p>

              {current.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2.5 py-0.5 text-muted-foreground text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-3 rounded-md border border-border bg-muted/25 p-3">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    current.kind === "template"
                      ? "Editable template"
                      : "Reference example",
                    previewLabel,
                    current.tech.framework,
                  ].map((text) => (
                    <span
                      key={text}
                      className="rounded-md bg-background px-2.5 py-1 font-medium text-[11px] text-muted-foreground"
                    >
                      {text}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-muted-foreground text-xs">
                  <Code2 className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Runtime: {current.tech.runtime}; pattern:{" "}
                    {current.tech.frontendPattern}
                  </span>
                </div>
                {requiredEnv.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium text-foreground text-xs">
                      <KeyRound className="size-3.5" />
                      Required environment
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {requiredEnv.map((item) => (
                        <span
                          key={item.name}
                          className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground"
                          title={item.description}
                        >
                          {item.name}
                          {item.secret ? " (secret)" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!current.canStart && (
                  <div className="flex items-start gap-2 text-amber-600 text-xs dark:text-amber-400">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      This item does not have a scaffold source in the catalog
                      yet.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => current.canStart && onSelect(current)}
              disabled={!current.canStart}
              className="mt-6 w-full rounded-lg bg-foreground px-5 py-2.5 font-medium text-background text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {current.kind === "template"
                ? "Start building"
                : "Use this example"}
            </button>
          </div>
        </div>

        {others.length > 0 && (
          <div
            ref={scrollRef}
            className="scrollbar-thin overflow-y-auto border-t px-6 py-5"
          >
            <h3 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              More templates
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {others.map((other) => (
                <TemplateCard
                  key={other.id}
                  template={other}
                  onClick={handleOther}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
