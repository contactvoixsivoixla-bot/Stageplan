"use client";

import { useMemo } from "react";
import { ELEMENT_LABELS } from "@/lib/types";
import { usePlanStore } from "@/store/planStore";

export function PropertiesPanel() {
  const { elements, selectedId, rename, rotate, remove, meta, updateMeta } = usePlanStore();
  const selected = elements.find((e) => e.id === selectedId);

  const synthese = useMemo(() => {
    const count = (type: string) => elements.filter((e) => e.type === type).length;
    const instruments = Array.from(new Set(elements.filter((e) => ["batterie", "clavier", "guitare", "basse", "ampli"].includes(e.type)).map((e) => e.type)));
    const legende = Object.entries(
      elements.reduce<Record<string, number>>((acc, el) => {
        acc[el.type] = (acc[el.type] ?? 0) + 1;
        return acc;
      }, {})
    );
    return { micros: count("micro"), retours: count("retour"), di: count("di"), prises: count("prise"), instruments, legende };
  }, [elements]);

  return (
    <aside className="space-y-3 rounded-lg border bg-white p-3 text-sm">
      <h2 className="font-semibold">Propriétés</h2>
      <input className="w-full rounded border p-2" value={meta.titre} onChange={(e) => updateMeta({ titre: e.target.value })} placeholder="Titre du projet" />
      <input className="w-full rounded border p-2" value={meta.artiste} onChange={(e) => updateMeta({ artiste: e.target.value })} placeholder="Artiste / Compagnie" />
      {selected ? (
        <>
          <input className="w-full rounded border p-2" value={selected.label} onChange={(e) => rename(selected.id, e.target.value)} />
          <label className="block">Rotation: {selected.rotation}°</label>
          <input type="range" min={0} max={360} value={selected.rotation} onChange={(e) => rotate(selected.id, Number(e.target.value))} className="w-full" />
          <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => remove(selected.id)}>Supprimer</button>
        </>
      ) : (
        <p>Sélectionnez un élément.</p>
      )}
      <div className="rounded border p-2">
        <h3 className="font-semibold">Légende automatique</h3>
        <ul className="mt-1 space-y-1">
          {synthese.legende.length === 0 ? <li>Aucun élément</li> : synthese.legende.map(([type, qty]) => <li key={type}>{ELEMENT_LABELS[type as keyof typeof ELEMENT_LABELS]}: {qty}</li>)}
        </ul>
      </div>
      <div className="rounded border p-2">
        <h3 className="font-semibold">Synthèse technique</h3>
        <ul className="mt-1 space-y-1">
          <li>Micros: {synthese.micros}</li>
          <li>Retours: {synthese.retours}</li>
          <li>DI: {synthese.di}</li>
          <li>Prises: {synthese.prises}</li>
          <li>Instruments: {synthese.instruments.join(", ") || "Aucun"}</li>
        </ul>
        <textarea className="mt-2 w-full rounded border p-2" value={meta.remarquesTechniques} onChange={(e) => updateMeta({ remarquesTechniques: e.target.value })} placeholder="Remarques techniques" />
        <textarea className="mt-2 w-full rounded border p-2" value={meta.notesGenerales} onChange={(e) => updateMeta({ notesGenerales: e.target.value })} placeholder="Notes générales" />
      </div>
    </aside>
  );
}
