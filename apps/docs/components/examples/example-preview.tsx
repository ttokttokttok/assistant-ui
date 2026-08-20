"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";
import { DemoIframe } from "@/components/docs/demo-iframe";

function dynamicThreadPreview(
  loadPreview: () => Promise<ComponentType>,
): ComponentType {
  return dynamic(async () => {
    const [{ DocsRuntimeProvider }, Preview] = await Promise.all([
      import("@/contexts/DocsRuntimeProvider"),
      loadPreview(),
    ]);

    return function ThreadPreview() {
      return (
        <DocsRuntimeProvider>
          <Preview />
        </DocsRuntimeProvider>
      );
    };
  });
}

const ModalPreview = dynamicThreadPreview(() =>
  import("@/components/examples/modal").then((module) => module.ModalChat),
);
const ChatGPTPreview = dynamicThreadPreview(() =>
  import("@/components/examples/chatgpt").then((module) => module.ChatGPT),
);
const ClaudePreview = dynamicThreadPreview(() =>
  import("@/components/examples/claude").then((module) => module.Claude),
);
const GeminiPreview = dynamicThreadPreview(() =>
  import("@/components/examples/gemini").then((module) => module.Gemini),
);
const GrokPreview = dynamicThreadPreview(() =>
  import("@/components/examples/grok").then((module) => module.Grok),
);
const PerplexityPreview = dynamicThreadPreview(() =>
  import("@/components/examples/perplexity").then(
    (module) => module.Perplexity,
  ),
);
const BasePreview = dynamicThreadPreview(() =>
  import("@/components/examples/base").then((module) => module.Base),
);
const ArtifactsPreview = dynamic(async () => {
  const [{ ArtifactsRuntimeProvider }, { Artifacts }] = await Promise.all([
    import("@/contexts/ArtifactsRuntimeProvider"),
    import("@/components/examples/artifacts"),
  ]);

  return function ArtifactsWithRuntime() {
    return (
      <ArtifactsRuntimeProvider>
        <Artifacts />
      </ArtifactsRuntimeProvider>
    );
  };
});
const GenerativeUIPreview = dynamic(() =>
  import("@/components/examples/genui").then((module) => module.GenUI),
);

export function hasExamplePreview(slug: string): boolean {
  switch (slug) {
    case "modal":
    case "form-demo":
    case "chatgpt":
    case "claude":
    case "gemini":
    case "grok":
    case "perplexity":
    case "ai-sdk":
    case "mem0":
    case "stockbroker":
    case "artifacts":
    case "generative-ui":
      return true;
    default:
      return false;
  }
}

export function ExamplePreview({ slug }: { slug: string }): ReactNode {
  switch (slug) {
    case "modal":
      return <ModalPreview />;
    case "form-demo":
      return (
        <DemoIframe
          title="Form Filling Co-Pilot demo"
          className="h-full w-full border-none"
          src="https://assistant-ui-form-demo.vercel.app/"
        />
      );
    case "chatgpt":
      return <ChatGPTPreview />;
    case "claude":
      return <ClaudePreview />;
    case "gemini":
      return <GeminiPreview />;
    case "grok":
      return <GrokPreview />;
    case "perplexity":
      return <PerplexityPreview />;
    case "ai-sdk":
      return <BasePreview />;
    case "mem0":
      return (
        <DemoIframe
          title="Mem0 - ChatGPT with memory demo"
          className="h-full w-full border-none"
          src="https://mem0-4vmi.vercel.app/"
        />
      );
    case "stockbroker":
      return (
        <DemoIframe
          title="Stockbroker example"
          className="h-full w-full border-none"
          src="https://assistant-ui-stockbroker.vercel.app/"
        />
      );
    case "artifacts":
      return <ArtifactsPreview />;
    case "generative-ui":
      return <GenerativeUIPreview />;
    default:
      return null;
  }
}
