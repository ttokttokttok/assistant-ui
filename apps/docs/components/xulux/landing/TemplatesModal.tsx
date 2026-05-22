"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { XuluxTemplate } from "../templates/types";
import { useXuluxTemplateCatalog } from "../templates/useXuluxTemplateCatalog";
import { TemplateCard } from "./TemplateCard";
import { TemplateDetailModal } from "./TemplateDetailModal";

export function TemplatesModal({
  open,
  onOpenChange,
  initialCategoryId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategoryId?: string | null | undefined;
  onSelect: (template: XuluxTemplate) => void;
}) {
  const { categories, templates, isLoading, error } = useXuluxTemplateCatalog();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [detailTemplate, setDetailTemplate] = useState<XuluxTemplate | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setActiveCategory(initialCategoryId ?? "all");
      setQuery("");
    }
  }, [open, initialCategoryId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeCategory !== "all" && t.categoryId !== activeCategory)
        return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, query, templates]);

  const chipCn = (active: boolean) =>
    cn(
      "rounded-md border px-3 py-1 text-xs transition-colors",
      active
        ? "border-foreground/40 bg-foreground/10 text-foreground"
        : "border-border bg-transparent text-muted-foreground hover:border-border/80 hover:text-foreground",
    );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="px-6 pt-5 pb-3">
            <DialogTitle>Templates</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 px-6 pb-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={chipCn(activeCategory === "all")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={chipCn(activeCategory === c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="scrollbar-thin max-h-[60vh] overflow-y-auto px-6 pb-6">
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                Loading templates...
              </div>
            ) : error ? (
              <div className="mx-auto max-w-md py-10 text-center">
                <div className="font-medium text-foreground text-sm">
                  Catalog unavailable
                </div>
                <div className="mt-2 text-muted-foreground text-sm">
                  {error}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                {query
                  ? `No templates match "${query}".`
                  : "No templates available."}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {filtered.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    onClick={setDetailTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TemplateDetailModal
        template={detailTemplate}
        allTemplates={templates}
        onClose={() => setDetailTemplate(null)}
        onSelect={(t) => {
          setDetailTemplate(null);
          onOpenChange(false);
          onSelect(t);
        }}
      />
    </>
  );
}
