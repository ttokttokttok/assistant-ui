import { frontendTools, type FrontendTools } from "@assistant-ui/react-ai-sdk";
import { createDocsTools } from "./tools/docs-tools";
import { createSourceMapTools } from "./tools/source-map-tools";
import { createTemplateTools } from "./tools/template-tools";
import { createLearnTools } from "./tools/learn-tools";
import type { LearnContext } from "@/lib/xulux/learn/types";

export function createXuluxChatTools({
  clientTools,
  routeUrl,
  learnContext,
}: {
  clientTools: FrontendTools;
  routeUrl: string;
  learnContext: LearnContext | null;
}) {
  return {
    ...frontendTools(clientTools),
    ...createSourceMapTools(),
    ...createDocsTools({ routeUrl }),
    ...createTemplateTools(),
    ...createLearnTools(learnContext),
  };
}
