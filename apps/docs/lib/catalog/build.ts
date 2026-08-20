import type { CatalogItem } from "./schema";

export type CatalogPage = {
  url: string;
  data: {
    title?: string | undefined;
    description?: string | undefined;
    catalog?: CatalogItem | undefined;
  };
};

export type Catalog = {
  categories: Array<{
    id: string;
    name: string;
    description?: string | undefined;
  }>;
  items: Array<
    CatalogItem & { title: string; description: string; url: string }
  >;
};

export function buildCatalog(pages: readonly CatalogPage[]): Catalog {
  const ids = new Set<string>();
  const categories = new Map<
    string,
    { id: string; name: string; description?: string | undefined }
  >();
  const items = pages.flatMap((page) => {
    const item = page.data.catalog;
    if (!item) return [];
    if (!page.data.title || !page.data.description) {
      throw new Error(
        `Catalog item ${item.id} requires its MDX title and description`,
      );
    }
    if (ids.has(item.id)) {
      throw new Error(`Duplicate catalog item id: ${item.id}`);
    }
    ids.add(item.id);
    const existing = categories.get(item.category.id);
    if (existing && existing.name !== item.category.name) {
      throw new Error(`Category ${item.category.id} has conflicting names`);
    }
    categories.set(item.category.id, item.category);
    return [
      {
        ...item,
        title: page.data.title,
        description: page.data.description,
        url: item.docsUrl ?? page.url,
      },
    ];
  });
  return { categories: [...categories.values()], items };
}
