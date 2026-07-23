import { notFound } from "next/navigation";
import { DocsRuntimeProvider } from "@/contexts/DocsRuntimeProvider";
import { isAiPlaygroundEnabled } from "@/lib/feature-flags";
import {
  DEFAULT_LEARN_COURSE_ID,
  getLearnStage,
  listLearnStageIds,
} from "@/lib/xulux/learn/registry";
import type { LearnStageDefinition } from "@/lib/xulux/learn/types";

export function generateStaticParams() {
  return listLearnStageIds(DEFAULT_LEARN_COURSE_ID).map((stageId) => ({
    stageId,
  }));
}

export default async function LearnStagePreviewPage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  if (!isAiPlaygroundEnabled) notFound();

  const { stageId } = await params;
  let stage: LearnStageDefinition;
  try {
    stage = getLearnStage(DEFAULT_LEARN_COURSE_ID, stageId);
  } catch {
    notFound();
  }

  const { default: StagePage } = await stage.loadPreview();

  return (
    <div className="bg-background h-dvh overflow-hidden">
      <DocsRuntimeProvider>
        <StagePage />
      </DocsRuntimeProvider>
    </div>
  );
}
