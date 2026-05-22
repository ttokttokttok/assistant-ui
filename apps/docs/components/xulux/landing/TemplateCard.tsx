"use client";

import type { CSSProperties } from "react";
import type { XuluxTemplate } from "../templates/types";
import { Thumbnail } from "./Thumbnail";

type Props = {
  template: XuluxTemplate;
  onClick: (template: XuluxTemplate) => void;
  className?: string | undefined;
  style?: CSSProperties | undefined;
};

export function TemplateCard({ template, onClick, className, style }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(template)}
      style={style}
      className={
        className ??
        "flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-2 text-left transition-colors hover:border-border/80 hover:bg-card/60"
      }
    >
      <Thumbnail
        gradient={template.gradient}
        src={template.screenshotUrl}
        label={template.title}
        className="aspect-video w-full"
      />
      <div className="px-1 pb-1">
        <div className="min-w-0 flex-1 truncate font-medium text-sm">
          {template.title}
        </div>
        <div className="mt-0.5 line-clamp-2 text-muted-foreground text-xs">
          {template.description}
        </div>
      </div>
    </button>
  );
}
