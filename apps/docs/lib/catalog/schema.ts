import { z } from "zod";

const previewFrameSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("phone"),
    width: z.number().positive().optional(),
    aspectRatio: z.string().optional(),
    chrome: z.literal("ios-dark").optional(),
  }),
  z.object({
    kind: z.literal("terminal"),
    title: z.string().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  }),
]);

/**
 * Catalog metadata deliberately lives in MDX frontmatter. Implementation
 * profiles are stable references only: ZIP contents and agent behavior stay in
 * code, so catalog/API consumers never need to load an MDX body.
 */
export const catalogItemSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["example", "template"]),
  templateId: z.string().min(1).optional(),
  versionId: z.string().min(1).optional(),
  order: z.number().int().nonnegative().optional(),
  category: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1).optional(),
  }),
  tags: z.array(z.string().min(1)).default([]),
  prompt: z.string().min(1),
  gradient: z.string().min(1),
  image: z.string().min(1).optional(),
  examplesCard: z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    image: z.string().min(1),
  }).optional(),
  featured: z.boolean().optional(),
  preview: z.object({
    status: z.enum(["live", "stale", "missing"]),
    url: z.string().min(1).optional(),
    frame: previewFrameSchema.optional(),
    embed: z.boolean().default(false),
  }),
  docsUrl: z.string().min(1).optional(),
  sourcePath: z.string().min(1).optional(),
  intent: z.object({
    goodFor: z.array(z.string().min(1)),
    notFor: z.array(z.string().min(1)).optional(),
    exampleUserRequests: z.array(z.string().min(1)).optional(),
  }).optional(),
  customization: z.object({
    safeFieldsSummary: z.array(z.string().min(1)),
    supportedRenderers: z.array(z.string().min(1)),
    sourceEditFiles: z.array(z.string().min(1)),
  }).optional(),
  tech: z.object({
    framework: z.string().min(1),
    runtime: z.string().min(1),
    frontendPattern: z.string().min(1),
  }),
  env: z.array(z.object({
    name: z.string().min(1),
    required: z.boolean(),
    secret: z.boolean().optional(),
    description: z.string().min(1).optional(),
  })).default([]),
  capabilities: z.object({
    openInChat: z.boolean().default(false),
    downloadProfile: z.string().min(1).optional(),
    agentProfile: z.string().min(1).optional(),
  }).default({ openInChat: false }),
}).superRefine((item, context) => {
  if ((item.templateId === undefined) !== (item.versionId === undefined)) {
    context.addIssue({ code: "custom", message: "templateId and versionId must be declared together" });
  }
  if (item.kind === "template" && !item.templateId) {
    context.addIssue({ code: "custom", message: "templates require templateId and versionId" });
  }
});

export type CatalogItem = z.infer<typeof catalogItemSchema>;
