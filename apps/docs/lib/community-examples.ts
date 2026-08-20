import type { ExampleCardItem } from "@/lib/catalog/examples";

export const COMMUNITY_EXAMPLES: ExampleCardItem[] = [
  {
    id: "community-mastra-ui-dojo",
    title: "Mastra UI Dojo",
    image: "/screenshot/examples/mastra-ui-dojo.png",
    description:
      "Mastra integrated with AI SDK, Assistant UI, and CopilotKit — compare side-by-side.",
    link: "https://github.com/mastra-ai/ui-dojo",
    external: true,
  },
  {
    id: "community-open-canvas",
    title: "Open Canvas",
    image: "/screenshot/open-canvas.png",
    description: "OSS implementation of ChatGPT's Canvas.",
    link: "https://github.com/langchain-ai/open-canvas",
    external: true,
  },
  {
    id: "community-fastapi-langgraph",
    title: "FastAPI + LangGraph",
    image: "/screenshot/examples/fastapi-langgraph.png",
    description:
      "Integration of a FastAPI + LangGraph server with assistant-ui.",
    link: "https://github.com/Yonom/assistant-ui-langgraph-fastapi",
    external: true,
  },
];

export const OFFICIAL_EXTERNAL_EXAMPLES: ExampleCardItem[] = [
  {
    id: "external-interactables",
    title: "Interactables",
    image: "/screenshot/examples/interactables.png",
    description:
      "Task board and sticky notes with AI-driven state updates and localStorage persistence.",
    link: "https://github.com/assistant-ui/assistant-ui/tree/main/examples/with-interactables",
    external: true,
    searchText:
      "interactables task board sticky notes ai state localstorage persistence",
  },
];
