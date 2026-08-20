import { describe, expect, it } from "vitest";
import { INTERNAL_EXAMPLES } from "./__fixtures__/legacy-examples";
import {
  getExamplePreview,
  getExamplesPageItems,
  matchesExamplesQuery,
} from "./examples";

describe("Examples catalog projection", () => {
  it("preserves the complete existing Examples card list", () => {
    const items = getExamplesPageItems();
    const existing = INTERNAL_EXAMPLES.filter((item) => !item.external);
    expect(items).toHaveLength(25);
    expect(items.slice(0, existing.length)).toMatchObject(
      existing.map((item) => ({
        title: item.title,
        ...(item.description ? { description: item.description } : {}),
        image: item.image,
        link: item.link,
      })),
    );
    expect(items.slice(existing.length).every((item) => item.image || item.gradient))
      .toBe(true);
  });

  it("searches title, description, category, and tags", () => {
    const items = getExamplesPageItems();
    expect(items.filter((item) => matchesExamplesQuery(item, "webhooks")))
      .toHaveLength(1);
    expect(items.filter((item) => matchesExamplesQuery(item, "CHATGPT")))
      .toContainEqual(expect.objectContaining({ id: "chatgpt" }));
    expect(items.every((item) => matchesExamplesQuery(item, "   "))).toBe(true);
    expect(items.some((item) => matchesExamplesQuery(item, "not-in-catalog")))
      .toBe(false);
  });

  it("resolves component and screenshot preview records", () => {
    expect(getExamplePreview("chatgpt")).toMatchObject({
      slug: "chatgpt",
      title: "ChatGPT Clone",
      screenshotUrl: "/screenshot/examples/chatgpt.png",
    });
    expect(getExamplePreview("stockbroker")).toMatchObject({
      slug: "stockbroker",
      screenshotUrl: "/screenshot/stockbroker.png",
    });
    expect(getExamplePreview("missing-example")).toBeNull();
  });
});
