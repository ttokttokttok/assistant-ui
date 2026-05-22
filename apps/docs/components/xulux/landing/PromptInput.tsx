"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string | undefined;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    const t = value.trim();
    if (t) onSubmit(t);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card/40 p-3 backdrop-blur transition-colors focus-within:border-border/80">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-2 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="flex items-center justify-end pt-2">
        <Button
          type="button"
          size="icon-sm"
          className="rounded-lg"
          onClick={submit}
          disabled={!value.trim()}
          aria-label="Send prompt"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
