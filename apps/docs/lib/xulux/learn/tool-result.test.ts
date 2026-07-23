import { parseLearnCourseStepResult } from "./tool-result";

describe("Learn course tool result", () => {
  it("validates in-progress and completion results", () => {
    expect(
      parseLearnCourseStepResult({
        course: { id: "learn-ui-prototype", status: "in_progress" },
        step: {
          id: "welcome",
          title: "Welcome",
          index: 1,
          total: 2,
          content: "Lesson",
        },
        stage: {
          id: "P0",
          previewPath: "/learn/preview/P0",
          downloadUrl: "/download",
          focusFiles: ["app/page.tsx"],
        },
        changes: { files: [], additions: 0, deletions: 0 },
      }),
    ).not.toBeNull();
    expect(
      parseLearnCourseStepResult({
        course: { id: "learn-ui-prototype", status: "completed" },
        finalStage: {
          id: "P1",
          previewPath: "/learn/preview/P1",
          downloadUrl: "/download",
        },
      }),
    ).not.toBeNull();
  });

  it("rejects malformed results", () => {
    expect(
      parseLearnCourseStepResult({ course: { status: "completed" } }),
    ).toBeNull();
  });
});
