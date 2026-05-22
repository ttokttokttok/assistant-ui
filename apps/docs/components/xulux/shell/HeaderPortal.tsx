"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function HeaderPortal({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(
      document.querySelector<HTMLElement>("[data-sub-project-header-portal]"),
    );
  }, []);

  if (!container) return null;
  return createPortal(children, container);
}
