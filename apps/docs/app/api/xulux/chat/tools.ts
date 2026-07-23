import { frontendTools, type FrontendTools } from "@assistant-ui/react-ai-sdk";
import { createDocsTools } from "./tools/docs-tools";
import { createSourceMapTools } from "./tools/source-map-tools";
import { createTemplateTools } from "./tools/template-tools";
import { createLearnTools } from "./tools/learn-tools";
import type { LearnContext } from "@/lib/xulux/learn/types";

export function createXuluxChatTools({
  clientTools,
  routeUrl,
  mode,
  learnContext,
}: {
  clientTools: FrontendTools;
  routeUrl: string;
  mode: "playground" | "learn";
  learnContext: LearnContext | null;
}) {
  if (mode === "learn") {
    return createLearnTools(learnContext);
  }

  return {
    ...frontendTools(clientTools),
    ...createSourceMapTools(),
    ...createDocsTools({ routeUrl }),
    ...createTemplateTools(),
  };
}
