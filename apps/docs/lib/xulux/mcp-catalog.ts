import type {
  XuluxTemplate,
  XuluxTemplateCatalog,
} from "@/components/xulux/templates/types";
import { getXuluxCatalog } from "@/lib/catalog/xulux";
import { compareAgentTemplateIds } from "@/lib/xulux/agent-template-order";
import {
  CONFIG_ROOTS_SCHEMAS,
  RULES,
  TEMPLATE_LIST_META,
  TOOLS_META,
  fixedDemoListMeta,
  type TemplateToolsMeta,
} from "@/lib/xulux/template-knowledge";

// ---------------------------------------------------------------------------
// MCP catalog serialization
//
// This module shapes the Xulux template catalog and authoring knowledge into
// the MCP-safe payload served by GET /api/xulux/mcp-catalog. It is the single
// source of truth boundary for external MCP agents. Frontend-only fields
// (gradients, category display copy, canvas hints) are intentionally omitted.
// ---------------------------------------------------------------------------

export const XULUX_MCP_CATALOG_VERSION = 1;

export type XuluxMcpCatalogVersion = {
  id: string;
  entryId: string;
  name: string;
  description: string;
  previewUrl: string;
  downloadUrl: string;
};

export type XuluxMcpCatalogTemplate = {
  id: string;
  templateId: string;
  versionId: string | null;
  kind: "template" | "example";
  name: string;
  summary: string;
  assistantPlacement: string;
  features: string[];
  customizable: string[];
  versions: XuluxMcpCatalogVersion[];
  previewUrl?: string;
  downloadUrl?: string;
  sandboxBaseUrl?: string;
  configRoots?: Record<string, unknown>;
  rules?: {
    required: string[];
    unsupported?: string[];
  };
  tools?: TemplateToolsMeta;
};

export type XuluxMcpCatalog = {
  version: typeof XULUX_MCP_CATALOG_VERSION;
  generatedAt: string;
  docsOrigin: string;
  templates: XuluxMcpCatalogTemplate[];
};

function templateId(t: XuluxTemplate): string {
  return t.templateId ?? t.id;
}

function toAbsolute(origin: string, url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function serializeFixedDemo(
  origin: string,
  entry: XuluxTemplate,
): XuluxMcpCatalogTemplate | null {
  const meta = fixedDemoListMeta(entry);
  if (!meta) return null;

  return {
    id: entry.id,
    templateId: entry.id,
    versionId: null,
    kind: "example",
    name: meta.name,
    summary: meta.summary,
    assistantPlacement: meta.assistantPlacement,
    features: meta.features,
    customizable: [],
    versions: [],
    ...(entry.previewUrl
      ? { previewUrl: toAbsolute(origin, entry.previewUrl) }
      : {}),
    ...(entry.downloadUrl
      ? { downloadUrl: toAbsolute(origin, entry.downloadUrl) }
      : {}),
    rules: {
      required: [
        "This entry is a fixed demo and is not schema-customizable.",
        "Preview and download it as-is. Do not pass a config for this entry.",
      ],
    },
  };
}

function serializeConfigurableTemplate(
  entry: XuluxTemplate,
): XuluxMcpCatalogTemplate | null {
  const tid = templateId(entry);
  const meta = TEMPLATE_LIST_META[tid];
  const configRoots = CONFIG_ROOTS_SCHEMAS[tid];
  const toolsMeta = TOOLS_META[tid];
  if (!meta || !configRoots || !toolsMeta) return null;

  return {
    id: tid,
    templateId: tid,
    versionId: entry.versionId ?? null,
    kind: "template",
    name: meta.name,
    summary: meta.summary,
    assistantPlacement: meta.assistantPlacement,
    features: meta.features,
    customizable: meta.customizable,
    versions: (entry.versions ?? []).map((v) => ({
      id: v.id,
      entryId: `${tid}-${v.id}`,
      name: v.title,
      description: v.description,
      previewUrl: v.previewUrl,
      downloadUrl: v.downloadUrl,
    })),
    ...(entry.previewUrl ? { previewUrl: entry.previewUrl } : {}),
    ...(entry.downloadUrl ? { downloadUrl: entry.downloadUrl } : {}),
    ...(entry.sandboxBaseUrl ? { sandboxBaseUrl: entry.sandboxBaseUrl } : {}),
    configRoots,
    rules: { required: RULES[tid] ?? [] },
    tools: toolsMeta,
  };
}

function canonicalConfigurableEntry(entry: XuluxTemplate): XuluxTemplate {
  const defaultVersion = entry.versions?.[0];
  if (!defaultVersion) return entry;
  return {
    ...entry,
    versionId: defaultVersion.id,
    previewUrl: defaultVersion.previewUrl,
    downloadUrl: defaultVersion.downloadUrl,
  };
}

export function buildXuluxMcpCatalogFromTemplateCatalog(
  origin: string,
  catalog: XuluxTemplateCatalog,
): XuluxMcpCatalog {
  const normalizedOrigin = origin.replace(/\/+$/, "");
  const { templates } = catalog;
  const seen = new Set<string>();
  const serialized: XuluxMcpCatalogTemplate[] = [];

  for (const entry of templates) {
    const tid = templateId(entry);
    if (seen.has(tid)) continue;

    const result =
      entry.kind === "example"
        ? serializeFixedDemo(normalizedOrigin, entry)
        : serializeConfigurableTemplate(canonicalConfigurableEntry(entry));
    if (!result) continue;

    seen.add(tid);
    serialized.push(result);
  }

  serialized.sort((a, b) =>
    compareAgentTemplateIds(a.templateId, b.templateId),
  );

  return {
    version: XULUX_MCP_CATALOG_VERSION,
    generatedAt: new Date().toISOString(),
    docsOrigin: normalizedOrigin,
    templates: serialized,
  };
}

export function buildXuluxMcpCatalog(origin: string): XuluxMcpCatalog {
  return buildXuluxMcpCatalogFromTemplateCatalog(
    origin,
    getXuluxCatalog(),
  );
}
