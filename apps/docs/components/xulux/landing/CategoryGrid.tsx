"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { XuluxTemplate } from "../templates/types";
import { useXuluxTemplateCatalog } from "../templates/useXuluxTemplateCatalog";
import { TemplateCard } from "./TemplateCard";
import { TemplateDetailModal } from "./TemplateDetailModal";

export function CategoryGrid({
  onBrowseAll,
  onSelectTemplate,
}: {
  onBrowseAll: () => void;
  onSelectTemplate: (template: XuluxTemplate) => void;
}) {
  const { templates, error } = useXuluxTemplateCatalog();
  const [selected, setSelected] = useState<XuluxTemplate | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el)
      el.scrollBy({ left: dir * (el.clientWidth / 4), behavior: "smooth" });
  };

  if (error) {
    return (
      <section className="w-full rounded-lg border border-border bg-card/40 px-4 py-3">
        <div className="font-medium text-sm">Catalog unavailable</div>
        <div className="mt-1 text-muted-foreground text-sm">{error}</div>
      </section>
    );
  }

  if (templates.length === 0) return null;

  const arrowCn =
    "absolute top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition-opacity duration-150";

  return (
    <>
      <section className="w-full">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-semibold text-lg tracking-tight">Templates</h2>
          <button
            type="button"
            onClick={onBrowseAll}
            className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Browse All
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className={cn(
              arrowCn,
              "-left-4",
              canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={setSelected}
                className="flex min-w-[190px] flex-col gap-2 rounded-xl border border-border bg-card/40 p-2 text-left transition-colors hover:border-border/80 hover:bg-card/60"
                style={{
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  width: "calc(25% - 12px)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className={cn(
              arrowCn,
              "-right-4",
              canScrollRight ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <TemplateDetailModal
        template={selected}
        allTemplates={templates}
        onClose={() => setSelected(null)}
        onSelect={(t) => {
          setSelected(null);
          onSelectTemplate(t);
        }}
      />
    </>
  );
}
