import {
  createInitialLearnProgress,
  deserializeLearnProgress,
  learnProgressStorageKey,
  readLearnProgress,
  serializeLearnProgress,
  writeLearnProgress,
  type LearnProgressStorage,
} from "./progress";
import type { LearnProgress } from "./types";

const COURSE_ID = "learn-ui-prototype";

function createStorage(): LearnProgressStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

describe("Learn progress", () => {
  it("serializes and reloads progress", () => {
    const progress: LearnProgress = {
      ...createInitialLearnProgress(COURSE_ID, 100),
      threadId: "thread_123",
      status: "in_progress",
      currentStepId: "welcome",
      selectedStepId: "welcome",
      completedStepIds: ["welcome"],
      startedAt: 100,
      updatedAt: 200,
    };

    expect(
      deserializeLearnProgress(serializeLearnProgress(progress), COURSE_ID),
    ).toEqual(progress);
  });

  it("writes and reads from the course-scoped storage key", () => {
    const storage = createStorage();
    const progress = createInitialLearnProgress(COURSE_ID, 100);

    expect(writeLearnProgress(storage, progress)).toBe(true);
    expect(storage.getItem(learnProgressStorageKey(COURSE_ID))).not.toBeNull();
    expect(readLearnProgress(storage, COURSE_ID, 200)).toEqual(progress);
  });

  it.each([
    ["invalid JSON", "{"],
    ["invalid shape", JSON.stringify({ courseId: COURSE_ID })],
    [
      "another course",
      serializeLearnProgress(createInitialLearnProgress("another-course", 1)),
    ],
  ])("recovers from %s", (_, raw) => {
    expect(deserializeLearnProgress(raw, COURSE_ID, 500)).toEqual(
      createInitialLearnProgress(COURSE_ID, 500),
    );
  });

  it("recovers from storage failures", () => {
    const storage: LearnProgressStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(readLearnProgress(storage, COURSE_ID, 500)).toEqual(
      createInitialLearnProgress(COURSE_ID, 500),
    );
    expect(
      writeLearnProgress(storage, createInitialLearnProgress(COURSE_ID, 500)),
    ).toBe(false);
  });
});
