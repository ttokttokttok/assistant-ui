import { describe, expect, it } from "vitest";
import { getXuluxCatalog } from "@/lib/catalog/xulux";
import { getXuluxHostedTemplatesCatalog } from "@/lib/xulux/templates-catalog";
import { buildTemplateList } from "./template-tools";

describe("Xulux internal template tools", () => {
  it("preserves the complete legacy template-list output", () => {
    expect(buildTemplateList(getXuluxCatalog().templates)).toEqual(
      buildTemplateList(getXuluxHostedTemplatesCatalog().templates),
    );
  });
});
