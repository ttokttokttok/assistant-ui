import type {
  XuluxTemplate,
  XuluxTemplateCatalog,
} from "@/components/xulux/templates/types";
import type { Catalog } from "./build";
import { getCatalog } from "./index";

type Item = Catalog["items"][number];

function hostedOrigin(item: Item) {
  if (!item.capabilities.downloadProfile?.startsWith("hosted-") || !item.preview.url) {
    return undefined;
  }
  return new URL(item.preview.url).origin;
}

function downloadUrl(item: Item) {
  const profile = item.capabilities.downloadProfile;
  if (!profile) return undefined;
  if (profile.startsWith("demo-")) {
    return `/api/xulux/demo-download?slug=${profile.slice("demo-".length)}`;
  }
  const origin = hostedOrigin(item);
  if (!origin) return undefined;
  if (profile === "hosted-base-assistant-ui") return `${origin}/api/download`;
  if (!item.versionId) return undefined;
  return `${origin}/api/download?v=${encodeURIComponent(item.versionId)}`;
}

function docsUrl(item: Item) {
  if (item.docsUrl) return item.docsUrl;
  const profile = item.capabilities.downloadProfile;
  if (profile?.startsWith("hosted-")) return undefined;
  return profile?.startsWith("demo-")
    ? `/demos/${profile.slice("demo-".length)}`
    : item.url;
}

function versionsFor(item: Item, items: readonly Item[]) {
  if (!item.templateId) return undefined;
  const siblings = items.filter(
    (candidate) => candidate.templateId === item.templateId,
  ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (siblings.length < 2) return undefined;
  return siblings.map((candidate) => ({
    id: candidate.versionId!,
    title: candidate.title,
    description: candidate.description,
    previewUrl: candidate.preview.url!,
    downloadUrl: downloadUrl(candidate)!,
  }));
}

export function projectXuluxCatalog(catalog: Catalog): XuluxTemplateCatalog {
  return {
    categories: catalog.categories,
    templates: catalog.items.map<XuluxTemplate>((item) => ({
      id: item.id,
      ...(item.templateId ? { templateId: item.templateId } : {}),
      ...(item.versionId && item.capabilities.downloadProfile !== "hosted-base-assistant-ui"
        ? { versionId: item.versionId }
        : {}),
      title: item.title,
      description: item.description,
      categoryId: item.category.id,
      categoryName: item.category.name,
      tags: item.tags,
      prompt: item.prompt,
      gradient: item.gradient,
      kind: item.kind,
      previewStatus: item.preview.status,
      ...(item.preview.url ? { previewUrl: item.preview.url } : {}),
      ...(item.preview.frame ? { previewFrame: item.preview.frame } : {}),
      ...(downloadUrl(item) ? { downloadUrl: downloadUrl(item) } : {}),
      ...(hostedOrigin(item) ? { sandboxBaseUrl: hostedOrigin(item) } : {}),
      ...(item.image && !item.capabilities.downloadProfile?.startsWith("demo-")
        ? { screenshotUrl: item.image }
        : {}),
      ...(item.sourcePath ? { sourcePath: item.sourcePath } : {}),
      ...(docsUrl(item) ? { docsUrl: docsUrl(item) } : {}),
      ...(item.featured !== undefined ? { featured: item.featured } : {}),
      ...(versionsFor(item, catalog.items)
        ? { versions: versionsFor(item, catalog.items) }
        : {}),
      ...(item.intent ? { intent: item.intent } : {}),
      ...(item.customization ? { customization: item.customization } : {}),
      tech: item.tech,
      env: item.env,
      canStart: item.capabilities.openInChat,
    })),
  };
}

export function getXuluxCatalog(): XuluxTemplateCatalog {
  return projectXuluxCatalog(getCatalog());
}
