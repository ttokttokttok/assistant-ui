import type {
  XuluxTemplate,
  XuluxTemplateCatalog,
} from "@/components/xulux/templates/types";

export type XuluxCatalogDeepLink = {
  catalogId: string | null;
  templateId: string | null;
  versionId: string | null;
};

export function readXuluxCatalogDeepLink(
  searchParams: URLSearchParams,
): XuluxCatalogDeepLink | null {
  const catalogId = searchParams.get("catalogId");
  const templateId = searchParams.get("templateId");
  const versionId = searchParams.get("versionId");
  if (!catalogId && !templateId && !versionId) return null;
  return { catalogId, templateId, versionId };
}

export function resolveXuluxCatalogDeepLink(
  catalog: XuluxTemplateCatalog,
  link: XuluxCatalogDeepLink,
): XuluxTemplate | null {
  if (!link.catalogId || !link.templateId) return null;
  const item = catalog.templates.find(
    (candidate) => candidate.id === link.catalogId,
  );
  if (!item || !item.canStart) return null;
  if ((item.templateId ?? item.id) !== link.templateId) return null;
  if ((item.versionId ?? null) !== link.versionId) {
    // The legacy Base hosted projection intentionally omits its default
    // version. Its catalog id still selects exactly one item.
    const isOmittedDefaultVersion =
      item.id === "base-assistant-ui" &&
      item.id === link.catalogId &&
      item.versionId === undefined &&
      link.versionId === "default";
    if (!isOmittedDefaultVersion) return null;
  }
  return item;
}
