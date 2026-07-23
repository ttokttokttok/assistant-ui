import { parseLearnContext, toLearnContext } from "./context";
import { createInitialLearnProgress } from "./progress";

describe("Learn context", () => {
  it("accepts the compact registered context", () => {
    const progress = {
      ...createInitialLearnProgress("learn-ui-prototype", 100),
      status: "in_progress" as const,
      currentStepId: "welcome",
      selectedStepId: "welcome",
    };
    expect(parseLearnContext(toLearnContext(progress))).toEqual({
      courseId: "learn-ui-prototype",
      status: "in_progress",
      currentStepId: "welcome",
      selectedStepId: "welcome",
    });
  });

  it.each([
    undefined,
    {},
    {
      courseId: "missing",
      status: "in_progress",
      currentStepId: null,
      selectedStepId: null,
    },
    {
      courseId: "learn-ui-prototype",
      status: "in_progress",
      currentStepId: "missing",
      selectedStepId: null,
    },
  ])("rejects invalid context %#", (value) => {
    expect(parseLearnContext(value)).toBeNull();
  });
});
