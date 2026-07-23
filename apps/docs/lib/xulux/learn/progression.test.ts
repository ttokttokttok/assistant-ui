import { LearnRegistryError } from "./registry";
import { getNextStep } from "./progression";

describe("getNextStep", () => {
  it("returns the first step when no step is current", () => {
    expect(getNextStep(null)).toMatchObject({
      status: "in_progress",
      step: { id: "welcome", stageId: "P0" },
    });
  });

  it("returns the next step", () => {
    expect(getNextStep("welcome")).toMatchObject({
      status: "in_progress",
      step: { id: "first-change", stageId: "P1" },
    });
  });

  it("returns completed after the final step", () => {
    expect(getNextStep("first-change")).toEqual({ status: "completed" });
  });

  it("is idempotent for the same current step", () => {
    expect(getNextStep("welcome")).toEqual(getNextStep("welcome"));
  });

  it("rejects invalid course and step IDs", () => {
    expect(() => getNextStep(null, "missing-course")).toThrow(
      LearnRegistryError,
    );
    expect(() => getNextStep("missing-step")).toThrow(LearnRegistryError);
  });
});
