import { examples } from "@/lib/source";
import { buildCatalog, type Catalog } from "./build";

export { buildCatalog } from "./build";
export type { Catalog, CatalogPage } from "./build";

/** Metadata-only runtime catalog; MDX bodies are intentionally not exposed. */
export function getCatalog(): Catalog {
  return buildCatalog(examples.getPages());
}
