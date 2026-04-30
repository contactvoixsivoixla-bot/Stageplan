"use client";

import dynamic from "next/dynamic";
import { ElementLibrary } from "@/components/ElementLibrary";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { usePlanStore } from "@/store/planStore";

const SceneCanvas = dynamic(() => import("@/components/SceneCanvas").then((m) => m.SceneCanvas), { ssr: false });

export default function EditeurPage() {
  const { zoom, setZoom, recenter, snapToGrid, toggleSnap, duplicateSelected, undo, redo } = usePlanStore();

  return (
    <main className="min-h-screen p-4 lg:p-6">
      <header className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Éditeur de plan de scène</h1>
          <ExportPdfButton />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="rounded border px-3 py-1" onClick={() => setZoom(zoom + 0.1)}>Zoom +</button>
          <button className="rounded border px-3 py-1" onClick={() => setZoom(zoom - 0.1)}>Zoom -</button>
          <button className="rounded border px-3 py-1" onClick={recenter}>Recentrer</button>
          <button className={`rounded border px-3 py-1 ${snapToGrid ? "bg-slate-900 text-white" : ""}`} onClick={toggleSnap}>Alignement grille</button>
          <button className="rounded border px-3 py-1" onClick={duplicateSelected}>Dupliquer sélection</button>
          <button className="rounded border px-3 py-1" onClick={undo}>Annuler</button>
          <button className="rounded border px-3 py-1" onClick={redo}>Rétablir</button>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">
        <ElementLibrary />
        <SceneCanvas />
        <PropertiesPanel />
      </div>
    </main>
  );
}
