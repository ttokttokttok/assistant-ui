import { describe, expect, it } from "vitest";
import { getCatalog } from "./index";
import { getCatalogDetailActions } from "./detail-actions";

function item(id: string) {
  const result = getCatalog().items.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Missing fixture ${id}`);
  return result;
}

describe("catalog detail actions", () => {
  it("builds fixed Example chat and download actions", () => {
    expect(getCatalogDetailActions(item("chatgpt"))).toEqual({
      openInChatUrl: "/playground?catalogId=chatgpt&templateId=chatgpt",
      downloadUrl: "/api/xulux/demo-download?slug=chatgpt",
    });
  });

  it("uses the protected proxy for an exact hosted version", () => {
    expect(
      getCatalogDetailActions(item("webpage-assistant-product-docs")),
    ).toEqual({
      openInChatUrl:
        "/playground?catalogId=webpage-assistant-product-docs&templateId=webpage-assistant&versionId=product-docs",
      downloadUrl:
        "/api/xulux/download-proxy?templateId=webpage-assistant&versionId=product-docs",
    });
  });

  it("omits download when an Example has no download profile", () => {
    expect(getCatalogDetailActions(item("modal"))).toEqual({
      openInChatUrl: "/playground?catalogId=modal&templateId=modal",
    });
  });
});
