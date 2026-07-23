import type { LearnCourseDefinition } from "../../types";

const COURSE_ROOT = "apps/docs/lib/xulux/learn/courses/learn-ui-prototype";

export const learnUiPrototypeCourse = {
  id: "learn-ui-prototype",
  title: "Build your first assistant UI",
  outcome:
    "Understand how a fixed assistant-ui application changes between two canonical stages.",
  steps: [
    {
      id: "welcome",
      title: "Welcome",
      lessonPath: `${COURSE_ROOT}/lessons/01-welcome.md`,
      stageId: "P0",
      focusFiles: ["app/page.tsx"],
    },
    {
      id: "first-change",
      title: "First change",
      lessonPath: `${COURSE_ROOT}/lessons/02-first-change.md`,
      stageId: "P1",
      focusFiles: ["app/page.tsx", "components/assistant.tsx"],
    },
  ],
  stages: {
    P0: {
      id: "P0",
      previewPath: "/learn/preview/P0",
      sourceRoot: `${COURSE_ROOT}/stages/P0/project`,
      loadPreview: () => import("./stages/P0/project/app/page"),
    },
    P1: {
      id: "P1",
      previewPath: "/learn/preview/P1",
      sourceRoot: `${COURSE_ROOT}/stages/P1/project`,
      loadPreview: () => import("./stages/P1/project/app/page"),
    },
  },
} satisfies LearnCourseDefinition;
