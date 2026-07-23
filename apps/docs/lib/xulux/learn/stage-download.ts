import { createZip } from "../demo-downloads/zip";
import { getLearnCourse, getLearnStage } from "./registry";
import {
  resolveStageFiles,
  resolveStageFilesFromSnapshot,
  type LearnSourceSnapshot,
} from "./stage-source";

export async function createLearnStageZip(courseId: string, stageId: string) {
  return createZip(await resolveStageFiles(courseId, stageId));
}

export function createLearnStageZipFromSnapshot(
  courseId: string,
  stageId: string,
  snapshot: LearnSourceSnapshot,
) {
  return createZip(resolveStageFilesFromSnapshot(courseId, stageId, snapshot));
}

export function getLearnStageArchiveFilename(
  courseId: string,
  stageId: string,
) {
  getLearnCourse(courseId);
  getLearnStage(courseId, stageId);
  return `xulux-${courseId}-${stageId.toLowerCase()}.zip`;
}
