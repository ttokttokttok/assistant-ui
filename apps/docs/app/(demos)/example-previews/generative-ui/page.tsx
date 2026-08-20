import { GenUI } from "@/components/examples/genui";

export default function Page() {
  return (
    <div className="bg-background h-dvh overflow-hidden">
      <style>{`html { overflow: hidden; }`}</style>
      <GenUI />
    </div>
  );
}
