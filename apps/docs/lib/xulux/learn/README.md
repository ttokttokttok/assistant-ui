# Xulux Learn Mode

Learn Mode is a fixed, two-step prototype course backed by canonical lesson and
project files. It intentionally replaces the larger `S0`–`S7` concept with the
registered `P0` and `P1` stages while the product flow is validated.

The dedicated `/api/xulux/learn/chat` endpoint uses a course-guide persona and
registers only `getNextCourseStep`; Playground template, docs, source-map, and
client tools are not part of its inventory. The request sends only `courseId`,
status, current step, and selected step. Start and Continue force exactly one
course-tool call, while normal learner questions use `toolChoice: "none"` so
they cannot advance. The tool reads lessons and stages from the generated
source snapshot and returns a validated product-owned result.

Preview, source, diff, and ZIP downloads all resolve through the course
registry. Local storage persists the one course thread, current versus selected
step, completion, celebration, and certificate dismissal.

Run verification in the Blaxel development sandbox:

```bash
packages/react/node_modules/.bin/vitest --config apps/docs/vitest.config.ts run apps/docs/lib/xulux/learn
pnpm --dir apps/docs exec tsc --noEmit
pnpm exec oxlint apps/docs/app/api/xulux/chat apps/docs/components/xulux apps/docs/lib/xulux/learn
pnpm exec oxfmt --check apps/docs/app/api/xulux/chat apps/docs/components/xulux apps/docs/lib/xulux/learn
```
