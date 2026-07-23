import { createLearnTools } from "./tools/learn-tools";

describe("Xulux chat tool inventories", () => {
  it("registers only the course tool in Learn mode", () => {
    const tools = createLearnTools({
      courseId: "learn-ui-prototype",
      status: "in_progress",
      currentStepId: "welcome",
      selectedStepId: "welcome",
    });

    expect(Object.keys(tools)).toEqual(["getNextCourseStep"]);
    expect("openTemplatePreview" in tools).toBe(false);
    expect("getTemplateList" in tools).toBe(false);
    expect("getTemplateDetails" in tools).toBe(false);
  });
});
