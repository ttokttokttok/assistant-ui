import { getXuluxCatalog } from "./xulux";
import type { CatalogItem } from "./schema";

export type CatalogDetailActions = {
  openInChatUrl?: string;
  downloadUrl?: string;
};

export function getCatalogDetailActions(
  item: CatalogItem,
): CatalogDetailActions {
  const projected = getXuluxCatalog().templates.find(
    (candidate) => candidate.id === item.id,
  );
  if (!projected) return {};

  const result: CatalogDetailActions = {};
  if (item.capabilities.openInChat && projected.canStart) {
    const params = new URLSearchParams({
      catalogId: item.id,
      templateId: item.templateId ?? item.id,
    });
    if (item.versionId) params.set("versionId", item.versionId);
    result.openInChatUrl = `/playground?${params}`;
  }

  if (projected.downloadUrl) {
    if (/^https?:\/\//i.test(projected.downloadUrl)) {
      const params = new URLSearchParams({
        templateId: item.templateId ?? item.id,
      });
      if (item.versionId) params.set("versionId", item.versionId);
      result.downloadUrl = `/api/xulux/download-proxy?${params}`;
    } else {
      result.downloadUrl = projected.downloadUrl;
    }
  }

  return result;
}
