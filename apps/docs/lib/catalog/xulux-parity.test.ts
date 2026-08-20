import { describe, expect, it } from "vitest";
import { getCatalog } from "./index";
import { projectXuluxCatalog } from "./xulux";
import { getXuluxHostedTemplatesCatalog } from "@/lib/xulux/templates-catalog";

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
});
