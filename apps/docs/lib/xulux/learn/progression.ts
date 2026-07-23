import {
  DEFAULT_LEARN_COURSE_ID,
  getLearnCourse,
  getLearnStep,
} from "./registry";
import type { LearnStepDefinition } from "./types";

export type LearnNextStep =
  | {
      status: "in_progress";
      step: LearnStepDefinition;
    }
  | {
      status: "completed";
    };

export function getNextStep(
  currentStepId: string | null,
  courseId = DEFAULT_LEARN_COURSE_ID,
): LearnNextStep {
  const course = getLearnCourse(courseId);
  if (currentStepId === null) {
    const firstStep = course.steps[0];
    if (!firstStep) return { status: "completed" };
    return { status: "in_progress", step: firstStep };
  }

  getLearnStep(courseId, currentStepId);
  const currentIndex = course.steps.findIndex(({ id }) => id === currentStepId);
  const nextStep = course.steps[currentIndex + 1];
  if (!nextStep) return { status: "completed" };
  return { status: "in_progress", step: nextStep };
}
