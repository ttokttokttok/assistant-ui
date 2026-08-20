import { describe, expect, it } from "vitest";
import { INTERNAL_EXAMPLES } from "./__fixtures__/legacy-examples";
import { getExamplePreview, getExamplesPageItems } from "./examples";

describe("Examples catalog projection", () => {
  it("preserves the complete existing Examples card list", () => {
    expect(getExamplesPageItems()).toEqual(
      INTERNAL_EXAMPLES.filter((item) => !item.external).map((item) => ({
        title: item.title,
        ...(item.description ? { description: item.description } : {}),
        image: item.image,
        link: item.link,
      })),
    );
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
