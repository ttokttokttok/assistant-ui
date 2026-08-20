import { describe, expect, it } from "vitest";
import type { SelectedTemplateContext } from "@/components/xulux/XuluxApp";
import { getXuluxThreadWelcome } from "./thread-welcome";

describe("getXuluxThreadWelcome", () => {
  it("preserves hosted template overrides", () => {
    const template: SelectedTemplateContext = {
      id: "webpage-assistant-product-docs",
      templateId: "webpage-assistant",
      versionId: "product-docs",
      title: "Product Docs Assistant",
      description:
        "Answers product documentation questions beside a SaaS docs article.",
      kind: "template",
      prompt:
        "Spin up a product docs assistant for onboarding and release notes.",
    };

    const welcome = getXuluxThreadWelcome(template);

    expect(welcome.composerPlaceholder).toContain("product name");
    expect(welcome.suggestions.map((suggestion) => suggestion.label)).toEqual([
      "rebrand product",
      "add docs page",
      "tune prompt chips",
    ]);
  });

  it("uses unified catalog metadata for newly added examples", () => {
    const template: SelectedTemplateContext = {
      id: "ai-sdk",
      title: "AI SDK Chat Persistence",
      description: "Vercel AI SDK chat with thread persistence.",
      kind: "example",
      prompt: "Open the AI SDK chat persistence example.",
    };

    const welcome = getXuluxThreadWelcome(template);

    expect(welcome.suggestions).toHaveLength(2);
    expect(welcome.suggestions[0]?.prompt).toContain("Open the AI SDK");
    expect(welcome.suggestions[1]?.prompt).toContain("Customize branding");
  });
});
