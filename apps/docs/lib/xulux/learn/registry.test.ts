import {
  DEFAULT_LEARN_COURSE_ID,
  getLearnCourse,
  getLearnStage,
  getLearnStageForStep,
  LearnRegistryError,
} from "./registry";

describe("Learn course registry", () => {
  it("resolves every curriculum step to one registered stage", () => {
    const course = getLearnCourse(DEFAULT_LEARN_COURSE_ID);

    expect(
      course.steps.map((step) => getLearnStageForStep(course.id, step.id).id),
    ).toEqual(["P0", "P1"]);
  });

  it("keeps preview and source selection on the same stage", async () => {
    const stage = getLearnStage(DEFAULT_LEARN_COURSE_ID, "P1");
    const preview = await stage.loadPreview();

    expect(stage.previewPath).toBe("/learn/preview/P1");
    expect(stage.sourceRoot).toMatch(
      /learn-ui-prototype\/stages\/P1\/project$/,
    );
    expect(preview.default).toBeTypeOf("function");
  });

  it("rejects unregistered course and stage IDs", () => {
    expect(() => getLearnCourse("missing-course")).toThrow(LearnRegistryError);
    expect(() =>
      getLearnStage(DEFAULT_LEARN_COURSE_ID, "missing-stage"),
    ).toThrow(LearnRegistryError);
  });
});
