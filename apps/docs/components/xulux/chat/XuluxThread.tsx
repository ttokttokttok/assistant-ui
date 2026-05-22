"use client";

import { ModelSelector } from "@/components/assistant-ui/model-selector";
import { AssistantComposer } from "@/components/docs/assistant/composer";
import { AssistantFooter } from "@/components/docs/assistant/footer";
import { AssistantMessage } from "@/components/docs/assistant/messages";
import { AssistantThread } from "@/components/docs/assistant/thread";
import { useAui } from "@assistant-ui/react";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { XuluxPoweredBy } from "../XuluxPoweredBy";
import { XuluxToolCall } from "./XuluxToolCall";

const XULUX_MODELS = [
  {
    id: "gpt-5.4-low",
    name: "GPT-5.4 Low",
    description: "Low reasoning",
    modelName: "gpt-5.4",
    reasoningEffort: "low",
  },
] as const;

type XuluxModelId = (typeof XULUX_MODELS)[number]["id"];

export function XuluxThread({
  onNewThread,
}: {
  onNewThread: () => void;
}): ReactNode {
  return (
    <AssistantThread
      welcome={
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Pick a template preview or describe what to build.
          </p>
        </div>
      }
      composer={
        <AssistantComposer
          placeholder="Ask Xulux to build or refine the UI..."
          modelSelector={<XuluxModelSelector />}
        />
      }
      footer={
        <AssistantFooter
          onNewThread={onNewThread}
          contextWindow={400_000}
          centerContent={<XuluxPoweredBy className="min-w-0 truncate px-1" />}
        />
      }
      AssistantMessageComponent={() => (
        <AssistantMessage ToolCallComponent={XuluxToolCall} />
      )}
    />
  );
}

function XuluxModelSelector(): ReactNode {
  const aui = useAui();
  const [modelValue, setModelValue] = useState<XuluxModelId>("gpt-5.4-low");
  const selectedModel =
    XULUX_MODELS.find((m) => m.id === modelValue) ?? XULUX_MODELS[0];

  const modelOptions = useMemo(
    () =>
      XULUX_MODELS.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        icon: (
          <Image
            src="/icons/openai.svg"
            alt={m.name}
            width={16}
            height={16}
            className="size-4"
          />
        ),
      })),
    [],
  );

  useEffect(() => {
    return aui.modelContext().register({
      getModelContext: () => ({
        config: {
          modelName: selectedModel.modelName,
          reasoningEffort: selectedModel.reasoningEffort,
        },
      }),
    });
  }, [aui, selectedModel]);

  return (
    <ModelSelector.Root
      models={modelOptions}
      value={modelValue}
      onValueChange={(v) => {
        if (XULUX_MODELS.some((m) => m.id === v))
          setModelValue(v as XuluxModelId);
      }}
    >
      <ModelSelector.Trigger variant="ghost" size="sm" />
      <ModelSelector.Content />
    </ModelSelector.Root>
  );
}
