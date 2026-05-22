"use client";

import { useState } from "react";
import type { XuluxTemplate } from "../templates/types";
import { XuluxPoweredBy } from "../XuluxPoweredBy";
import { CategoryGrid } from "./CategoryGrid";
import { PromptInput } from "./PromptInput";

type Props = {
  headline?: string | undefined;
  placeholder?: string | undefined;
  onStartChat: (prompt: string) => void;
  onSelectTemplate: (template: XuluxTemplate) => void;
  onBrowseAll: () => void;
};

export function XuluxLandingPage({
  headline = "What do you want to build?",
  placeholder = "Describe what you want to build with assistant-ui...",
  onStartChat,
  onSelectTemplate,
  onBrowseAll,
}: Props) {
  const [prompt, setPrompt] = useState("");

  return (
    <main className="scrollbar-thin flex flex-1 flex-col items-center overflow-y-auto px-6 pb-24">
      <div className="flex w-full max-w-3xl flex-col items-center pt-[16vh]">
        <h1 className="mb-6 text-center font-semibold text-3xl tracking-tight sm:text-4xl">
          {headline}
        </h1>
        <PromptInput
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={onStartChat}
          placeholder={placeholder}
        />
      </div>

      <div className="mt-16 flex w-full max-w-5xl flex-col gap-12">
        <CategoryGrid
          onBrowseAll={onBrowseAll}
          onSelectTemplate={onSelectTemplate}
        />
        <XuluxPoweredBy className="-mt-6 pb-4" />
      </div>
    </main>
  );
}
