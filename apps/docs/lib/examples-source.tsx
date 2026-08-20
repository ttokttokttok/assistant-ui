import type { InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { examples as examplePages } from "fumadocs-mdx:collections/server";

// Keep the examples collection independent from the main docs source. Importing
// lib/source also initializes every docs, blog, TAP, standalone, and careers MDX
// module, which is unnecessary for an example detail request.
export const examples = loader({
  baseUrl: "/examples",
  source: toFumadocsSource(examplePages, []),
});

export type ExamplePage = InferPageType<typeof examples>;
