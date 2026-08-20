import { DEMO_DOWNLOAD_MANIFESTS } from "@/lib/xulux/demo-downloads/manifest";
import { TEMPLATE_LIST_META } from "@/lib/xulux/template-knowledge";

export const AGENT_TEMPLATE_ORDER = [
  ...Object.keys(DEMO_DOWNLOAD_MANIFESTS),
  "expo-react-native",
  ...Object.keys(TEMPLATE_LIST_META),
];

export function compareAgentTemplateIds(a: string, b: string): number {
  return AGENT_TEMPLATE_ORDER.indexOf(a) - AGENT_TEMPLATE_ORDER.indexOf(b);
}
