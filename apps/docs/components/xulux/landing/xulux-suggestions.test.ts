import {
  findXuluxSuggestion,
  XULUX_SUGGESTION_GROUPS,
} from "./xulux-suggestions";

describe("Xulux Learn suggestion", () => {
  it("routes the guided course suggestion to one auto-start entry", () => {
    const suggestion = findXuluxSuggestion("learn-guided-course");
    expect(suggestion).toMatchObject({
      prompt: "Start the course.",
      href: "/learn?start=1",
    });

    const matches = XULUX_SUGGESTION_GROUPS.flatMap((group) =>
      group.options.filter((option) => option.href === "/learn?start=1"),
    );
    expect(matches).toHaveLength(1);
  });
});
