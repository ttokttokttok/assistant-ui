import { compareStageFiles } from "./stage-diff";

describe("compareStageFiles", () => {
  const previous = {
    "app/page.tsx": "one\ntwo\nthree\n",
    "deleted.ts": "first\nsecond\n",
    "unchanged.ts": "same\n",
  };
  const current = {
    "app/page.tsx": "one\nchanged\nthree\nadded\n",
    "added.ts": "alpha\nbeta\n",
    "unchanged.ts": "same\n",
  };

  it("detects added, modified, and deleted files", () => {
    expect(compareStageFiles(previous, current).files).toEqual([
      {
        path: "added.ts",
        status: "added",
        additions: 2,
        deletions: 0,
      },
      {
        path: "app/page.tsx",
        status: "modified",
        additions: 2,
        deletions: 1,
      },
      {
        path: "deleted.ts",
        status: "deleted",
        additions: 0,
        deletions: 2,
      },
    ]);
  });

  it("produces stable aggregate statistics", () => {
    const first = compareStageFiles(previous, current);
    const second = compareStageFiles(previous, current);

    expect(first).toEqual(second);
    expect(first.additions).toBe(4);
    expect(first.deletions).toBe(3);
  });

  it("returns no changes for identical stages", () => {
    expect(compareStageFiles(previous, previous)).toEqual({
      files: [],
      additions: 0,
      deletions: 0,
    });
  });
});
