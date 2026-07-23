import { listZipEntries } from "../demo-downloads/zip";
import { DEFAULT_LEARN_COURSE_ID, getLearnStage } from "./registry";
import {
  createLearnStageZipFromSnapshot,
  getLearnStageArchiveFilename,
} from "./stage-download";
import { resolveStageFilesFromSnapshot } from "./stage-source";

describe("Learn stage downloads", () => {
  it("packages the exact file map selected for the registered stage", () => {
    const stage = getLearnStage(DEFAULT_LEARN_COURSE_ID, "P1");
    const snapshot = {
      [`${stage.sourceRoot}/app/page.tsx`]: "page",
      [`${stage.sourceRoot}/components/assistant.tsx`]: "assistant",
      "apps/docs/private.ts": "unrelated",
    };
    const files = resolveStageFilesFromSnapshot(
      DEFAULT_LEARN_COURSE_ID,
      "P1",
      snapshot,
    );
    const zip = createLearnStageZipFromSnapshot(
      DEFAULT_LEARN_COURSE_ID,
      "P1",
      snapshot,
    );

    expect(listZipEntries(zip)).toEqual(Object.keys(files).sort());
    expect(getLearnStageArchiveFilename(DEFAULT_LEARN_COURSE_ID, "P1")).toBe(
      "xulux-learn-ui-prototype-p1.zip",
    );
  });

  it("rejects unregistered stage IDs", () => {
    expect(() =>
      createLearnStageZipFromSnapshot(
        DEFAULT_LEARN_COURSE_ID,
        "missing-stage",
        {},
      ),
    ).toThrow(/Unregistered Learn stage/);
  });
});
