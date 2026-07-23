import type { FrontendTools } from "@assistant-ui/react-ai-sdk";
import { createXuluxChatTools } from "./tools";

describe("Xulux chat tool inventories", () => {
  it("registers only the course tool in Learn mode", () => {
    const tools = createXuluxChatTools({
      clientTools: {} as FrontendTools,
      routeUrl: "https://example.com/api/xulux/learn/chat",
      mode: "learn",
      learnContext: {
        courseId: "learn-ui-prototype",
        status: "in_progress",
        currentStepId: "welcome",
        selectedStepId: "welcome",
      },
    });

    expect(Object.keys(tools)).toEqual(["getNextCourseStep"]);
    expect("openTemplatePreview" in tools).toBe(false);
    expect("getTemplateList" in tools).toBe(false);
    expect("getTemplateDetails" in tools).toBe(false);
  });
});
