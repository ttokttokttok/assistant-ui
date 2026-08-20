import type { MDXComponents } from "mdx/types";
import defaultComponents from "fumadocs-ui/mdx";
import { Callout } from "@/components/docs/fumadocs/callout";
import { SourceLink } from "@/components/docs/source-link";

// Example pages use ordinary Markdown plus these two explicit components.
// Keeping this registry separate avoids compiling the full documentation MDX
// component graph for every example detail page.
export function getExamplesMDXComponents(): MDXComponents {
  return {
    ...(defaultComponents as MDXComponents),
    Callout,
    SourceLink,
    blockquote: (props) => <Callout>{props.children}</Callout>,
  };
}
