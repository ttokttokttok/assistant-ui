import { loadSourceSnapshot } from "../demo-downloads/create-demo-zip";
import { getLearnStage } from "./registry";

export type LearnSourceSnapshot = Record<string, string>;
export type LearnStageFiles = Record<string, string>;

export async function resolveStageFiles(
  courseId: string,
  stageId: string,
): Promise<LearnStageFiles> {
  return resolveStageFilesFromSnapshot(
    courseId,
    stageId,
    await loadSourceSnapshot(),
  );
}

export function resolveStageFilesFromSnapshot(
  courseId: string,
  stageId: string,
  snapshot: LearnSourceSnapshot,
): LearnStageFiles {
  const stage = getLearnStage(courseId, stageId);
  const sourceRoot = normalizeSourceRoot(stage.sourceRoot);
  const sourcePrefix = `${sourceRoot}/`;
  const files: LearnStageFiles = {};

  for (const snapshotPath of Object.keys(snapshot).sort()) {
    if (!snapshotPath.startsWith(sourcePrefix)) continue;
    const relativePath = snapshotPath.slice(sourcePrefix.length);
    if (!relativePath || relativePath.startsWith("../")) continue;
    files[relativePath] = snapshot[snapshotPath]!;
  }

  if (Object.keys(files).length === 0) {
    throw new Error(
      `No source snapshot files found for Learn stage: ${courseId}/${stageId}`,
    );
  }

  return files;
}

function normalizeSourceRoot(sourceRoot: string) {
  const normalized = sourceRoot.replaceAll("\\", "/").replace(/\/+$/, "");
  if (
    normalized.startsWith("/") ||
    normalized.includes("../") ||
    !normalized.endsWith("/project")
  ) {
    throw new Error(`Unsafe Learn stage source root: ${sourceRoot}`);
  }
  return normalized;
}
