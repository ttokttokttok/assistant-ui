import { describe, expect, it } from "vitest";
import { getCatalog } from "./index";
import { projectXuluxCatalog } from "./xulux";
import { getXuluxHostedTemplatesCatalog } from "@/lib/xulux/templates-catalog";
import { getXuluxExamplesCatalog } from "@/lib/xulux/examples-catalog";
import { INTERNAL_EXAMPLES } from "@/lib/examples";
import {
  buildXuluxMcpCatalog,
  buildXuluxMcpCatalogFromTemplateCatalog,
} from "@/lib/xulux/mcp-catalog";

const ORIGIN = "https://docs.example.com";

function withoutGeneratedAt<T extends { generatedAt: string }>(value: T) {
  const { generatedAt: _generatedAt, ...stable } = value;
  return stable;
}

describe("unified catalog hosted-template parity", () => {
  it("preserves every existing hosted catalog record", () => {
    const legacy = getXuluxHostedTemplatesCatalog();
    const unified = projectXuluxCatalog(getCatalog());

    for (const expected of legacy.templates) {
      expect.soft(
        unified.templates.find((item) => item.id === expected.id),
        expected.id,
      ).toEqual(expected);
    }
  });

  it("preserves every internal Examples card", () => {
    const catalog = getCatalog();

    for (const expected of INTERNAL_EXAMPLES.filter((item) => !item.external)) {
      const id = expected.link.replace(/^\/examples\//, "");
      const item = catalog.items.find((candidate) => candidate.id === id);
      expect.soft(item, id).toBeDefined();
      expect.soft(
        item?.examplesCard ?? {
          title: item?.title,
          description: item?.description,
          image: item?.image,
        },
        id,
      ).toEqual({
        title: expected.title,
        description: expected.description,
        image: expected.image,
      });
    }

    expect(catalog.items).toHaveLength(25);
    expect(getXuluxExamplesCatalog().templates).toHaveLength(13);
  });

  it("produces the same complete MCP/agent catalog from getCatalog", () => {
    const legacy = buildXuluxMcpCatalog(ORIGIN);
    const unified = buildXuluxMcpCatalogFromTemplateCatalog(
      ORIGIN,
      projectXuluxCatalog(getCatalog()),
    );

    expect(withoutGeneratedAt(unified)).toEqual(withoutGeneratedAt(legacy));
  });
});
