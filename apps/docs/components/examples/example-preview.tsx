import type { ReactNode } from "react";
import { DemoIframe } from "@/components/docs/demo-iframe";

const LOCAL_PREVIEWS: Record<string, string> = {
  modal: "/example-previews/modal",
  chatgpt: "/example-previews/chatgpt",
  claude: "/example-previews/claude",
  gemini: "/example-previews/gemini",
  grok: "/example-previews/grok",
  perplexity: "/example-previews/perplexity",
  "ai-sdk": "/example-previews/base",
  artifacts: "/example-previews/artifacts",
  "generative-ui": "/example-previews/generative-ui",
};

const EXTERNAL_PREVIEWS: Record<string, string> = {
  "form-demo": "https://assistant-ui-form-demo.vercel.app/",
  mem0: "https://mem0-4vmi.vercel.app/",
  stockbroker: "https://assistant-ui-stockbroker.vercel.app/",
};

export function hasExamplePreview(slug: string): boolean {
  return slug in LOCAL_PREVIEWS || slug in EXTERNAL_PREVIEWS;
}

export function ExamplePreview({ slug }: { slug: string }): ReactNode {
  const src = LOCAL_PREVIEWS[slug] ?? EXTERNAL_PREVIEWS[slug];
  if (!src) return null;

  return (
    <DemoIframe
      title={`${slug} example preview`}
      className="h-full w-full border-none"
      src={src}
    />
  );
}
