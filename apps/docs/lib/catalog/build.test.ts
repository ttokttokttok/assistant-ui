import { describe, expect, it } from "vitest";
import { buildCatalog, type CatalogPage } from "./build";
import { catalogItemSchema } from "./schema";

const item = catalogItemSchema.parse({
  id: "test-item",
  kind: "example",
  category: { id: "chat", name: "Chat" },
  tags: ["Example"],
  prompt: "Open the example.",
  gradient: "from-blue-500",
  preview: { status: "missing" },
  tech: { framework: "React", runtime: "assistant-ui", frontendPattern: "Chat" },
});

const page = (overrides: Partial<CatalogPage> = {}): CatalogPage => ({
  url: "/examples/test-item",
  data: { title: "Test Item", description: "A test item.", catalog: item },
  ...overrides,
});

describe("buildCatalog", () => {
  it("excludes non-catalog pages and emits metadata only", () => {
    const catalog = buildCatalog([
      page(),
      { url: "/examples/docs-only", data: { title: "Docs only" } },
    ]);
    expect(catalog.items).toHaveLength(1);
    expect(catalog.items[0]).toMatchObject({ id: "test-item", url: "/examples/test-item" });
    expect(catalog.items[0]).not.toHaveProperty("body");
  });

  it("rejects duplicate item IDs", () => {
    expect(() => buildCatalog([page(), page({ url: "/examples/duplicate" })])).toThrow(
      "Duplicate catalog item id: test-item",
    );
  });

  it("rejects conflicting category names", () => {
    const conflicting = { ...item, id: "other", category: { id: "chat", name: "Chats" } };
    expect(() => buildCatalog([page(), page({ data: { title: "Other", description: "Other.", catalog: conflicting } })])).toThrow(
      "Category chat has conflicting names",
    );
  });

  it("keeps the catalog page canonical when related docs exist", () => {
    const catalog = buildCatalog([
      page({
        data: {
          title: "Test Item",
          description: "A test item.",
          catalog: { ...item, docsUrl: "/docs/test-item" },
        },
      }),
    ]);

    expect(catalog.items[0]).toMatchObject({
      url: "/examples/test-item",
      docsUrl: "/docs/test-item",
    });
  });
});
