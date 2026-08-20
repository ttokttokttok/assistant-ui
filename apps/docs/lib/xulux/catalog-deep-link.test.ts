import { describe, expect, it } from "vitest";
import { getXuluxCatalog } from "@/lib/catalog/xulux";
import {
  readXuluxCatalogDeepLink,
  resolveXuluxCatalogDeepLink,
} from "./catalog-deep-link";

describe("Xulux catalog deep links", () => {
  const catalog = getXuluxCatalog();

  it("resolves an exact hosted template version", () => {
    const link = readXuluxCatalogDeepLink(new URLSearchParams(
      "catalogId=webpage-assistant-product-docs&templateId=webpage-assistant&versionId=product-docs",
    ));
    expect(link && resolveXuluxCatalogDeepLink(catalog, link)).toMatchObject({
      id: "webpage-assistant-product-docs",
      templateId: "webpage-assistant",
      versionId: "product-docs",
    });
  });

  it("resolves an exact fixed Example", () => {
    const link = readXuluxCatalogDeepLink(
      new URLSearchParams("catalogId=chatgpt&templateId=chatgpt"),
    );
    expect(link && resolveXuluxCatalogDeepLink(catalog, link)).toMatchObject({
      id: "chatgpt",
    });
  });

  it.each([
    "catalogId=missing&templateId=missing",
    "catalogId=chatgpt&templateId=claude",
    "catalogId=webpage-assistant-product-docs&templateId=webpage-assistant&versionId=developer-api",
    "templateId=chatgpt",
  ])("rejects invalid or incomplete selection: %s", (query) => {
    const link = readXuluxCatalogDeepLink(new URLSearchParams(query));
    expect(link && resolveXuluxCatalogDeepLink(catalog, link)).toBeNull();
  });
});
