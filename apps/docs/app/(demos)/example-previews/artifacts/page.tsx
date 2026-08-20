import { Artifacts } from "@/components/examples/artifacts";
import { ArtifactsRuntimeProvider } from "@/contexts/ArtifactsRuntimeProvider";

export default function Page() {
  return (
    <div className="bg-background h-dvh overflow-hidden">
      <style>{`html { overflow: hidden; }`}</style>
      <ArtifactsRuntimeProvider>
        <Artifacts />
      </ArtifactsRuntimeProvider>
    </div>
  );
}
