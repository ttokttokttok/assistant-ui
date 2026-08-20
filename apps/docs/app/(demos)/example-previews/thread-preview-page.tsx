import type { ComponentType } from "react";
import { DocsRuntimeProvider } from "@/contexts/DocsRuntimeProvider";

export function ThreadPreviewPage({
  component: Preview,
}: {
  component: ComponentType;
}) {
  return (
    <div className="bg-background flex h-dvh flex-col overflow-hidden">
      <style>{`html { overflow: hidden; }`}</style>
      <main className="min-h-0 flex-1">
        <DocsRuntimeProvider>
          <Preview />
        </DocsRuntimeProvider>
      </main>
    </div>
  );
}
