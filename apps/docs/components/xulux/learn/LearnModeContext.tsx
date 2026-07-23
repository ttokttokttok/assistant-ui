"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  LearnCourseDefinition,
  LearnProgress,
} from "@/lib/xulux/learn/types";

type LearnCanvasTab = "curriculum" | "preview" | "files" | "diff";

type LearnModeContextValue = {
  course: LearnCourseDefinition;
  progress: LearnProgress;
  updateProgress: (progress: LearnProgress) => void;
  activeTab: LearnCanvasTab;
  selectedFile: string | null;
  selectStep: (stepId: string) => void;
  openTab: (tab: LearnCanvasTab, file?: string) => void;
};

const LearnModeContext = createContext<LearnModeContextValue | null>(null);

export function LearnModeProvider({
  course,
  progress,
  updateProgress,
  children,
}: {
  course: LearnCourseDefinition;
  progress: LearnProgress;
  updateProgress: (progress: LearnProgress) => void;
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<LearnCanvasTab>("curriculum");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const value = useMemo<LearnModeContextValue>(
    () => ({
      course,
      progress,
      updateProgress,
      activeTab,
      selectedFile,
      selectStep: (stepId) => {
        updateProgress({
          ...progress,
          selectedStepId: stepId,
          updatedAt: Date.now(),
        });
        setActiveTab("preview");
      },
      openTab: (tab, file) => {
        setActiveTab(tab);
        if (file) setSelectedFile(file);
      },
    }),
    [activeTab, course, progress, selectedFile, updateProgress],
  );

  return (
    <LearnModeContext.Provider value={value}>
      {children}
    </LearnModeContext.Provider>
  );
}

export function useLearnMode() {
  const value = useContext(LearnModeContext);
  if (!value) throw new Error("useLearnMode requires LearnModeProvider");
  return value;
}
