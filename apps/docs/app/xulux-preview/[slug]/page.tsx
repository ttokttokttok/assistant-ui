import { notFound } from "next/navigation";
import { ExamplePreview } from "@/components/xulux/examples/ExamplePreview";
import { getExamplePreview } from "@/lib/catalog/examples";
import { isAiPlaygroundEnabled } from "@/lib/feature-flags";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isAiPlaygroundEnabled) notFound();

  const { slug } = await params;
  const preview = getExamplePreview(slug);
  if (!preview) notFound();

  return <ExamplePreview preview={preview} />;
}
