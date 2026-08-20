import { catalog } from "@/.source/catalog";

export { buildCatalog } from "./build";
export type { Catalog, CatalogPage } from "./build";

/** Static metadata-only catalog; MDX bodies are never imported at runtime. */
export function getCatalog() {
  return catalog;
}
