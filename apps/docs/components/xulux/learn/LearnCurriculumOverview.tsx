"use client";

import { BookOpen, Check, Circle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  LearnCourseDefinition,
  LearnProgress,
} from "@/lib/xulux/learn/types";

export function LearnCurriculumOverview({
  course,
  progress,
  onStartCourse,
  startDisabled = false,
}: {
  course: LearnCourseDefinition;
  progress: LearnProgress;
  onStartCourse: () => void;
  startDisabled?: boolean;
}) {
  const started = progress.status !== "not_started";
  const completedCount = progress.completedStepIds.length;

  return (
    <section
      className="bg-muted/20 flex h-full min-h-0 flex-col overflow-y-auto p-5 sm:p-8"
      aria-label="Course curriculum"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        <div className="text-primary bg-background mb-4 flex size-10 items-center justify-center rounded-xl border shadow-sm">
          <BookOpen className="size-5" />
        </div>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Learn assistant-ui
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {course.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6 sm:text-base">
          {course.outcome}
        </p>

        <div className="mt-7 flex items-center justify-between text-sm">
          <span className="font-medium">Curriculum</span>
          <span className="text-muted-foreground">
            {completedCount} of {course.steps.length} complete
          </span>
        </div>
        <div className="bg-border mt-2 h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width]"
            style={{
              width: `${(completedCount / course.steps.length) * 100}%`,
            }}
          />
        </div>

        <ol className="bg-background mt-4 overflow-hidden rounded-xl border">
          {course.steps.map((step, index) => {
            const complete = progress.completedStepIds.includes(step.id);
            const current = progress.currentStepId === step.id;
            return (
              <li
                key={step.id}
                className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
              >
                {complete ? (
                  <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="size-3.5" />
                  </span>
                ) : (
                  <span className="text-muted-foreground flex size-6 shrink-0 items-center justify-center">
                    <Circle
                      className="size-5"
                      fill={current ? "currentColor" : "none"}
                    />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-xs">
                    Step {index + 1}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {step.title}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        {!started ? (
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full gap-2 sm:w-fit"
            onClick={onStartCourse}
            disabled={startDisabled}
          >
            <Play className="size-4" fill="currentColor" />
            Start course
          </Button>
        ) : (
          <p className="text-muted-foreground mt-5 text-sm">
            Your course thread is active. Continue the conversation in the Learn
            chat.
          </p>
        )}
      </div>
    </section>
  );
}
