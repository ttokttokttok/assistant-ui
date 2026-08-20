"use client";

import { ExternalLinkIcon } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog/schema";
import { XuluxPreviewFrame } from "@/components/xulux/canvas/XuluxPreviewFrame";

export function CatalogPreview({ item }: { item: CatalogItem }) {
  if (item.preview.status !== "live" || !item.preview.url) return null;

  return (
    <section className="not-prose relative mb-10 h-[min(70vh,640px)] min-h-[420px] overflow-hidden rounded-xl border bg-black">
      <XuluxPreviewFrame frame={item.preview.frame}>
        <iframe
          src={item.preview.url}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={`${item.id} preview`}
        />
      </XuluxPreviewFrame>
      <a
        href={item.preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs text-white/80 backdrop-blur-sm hover:text-white"
      >
        Open preview
        <ExternalLinkIcon className="size-3" />
      </a>
    </section>
  );
}
