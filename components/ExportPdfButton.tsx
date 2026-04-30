"use client";

import { jsPDF } from "jspdf";
import { usePlanStore } from "@/store/planStore";

export function ExportPdfButton() {
  const { elements, meta } = usePlanStore();
  const onExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(meta.titre || "Plan de scène", 14, 15);
    doc.setFontSize(12);
    doc.text(`Artiste/Compagnie: ${meta.artiste || "-"}`, 14, 24);
    doc.text("Légende:", 14, 34);
    elements.slice(0, 20).forEach((el, i) => doc.text(`- ${el.label} (${el.type})`, 18, 42 + i * 6));
    const startY = 42 + Math.min(elements.length, 20) * 6 + 6;
    doc.text("Synthèse technique:", 14, startY);
    doc.text(`Micros: ${elements.filter((e) => e.type === "micro").length}`, 18, startY + 8);
    doc.text(`Retours: ${elements.filter((e) => e.type === "retour").length}`, 18, startY + 14);
    doc.text(`DI: ${elements.filter((e) => e.type === "di").length}`, 18, startY + 20);
    doc.text(`Prises: ${elements.filter((e) => e.type === "prise").length}`, 18, startY + 26);
    doc.text(`Remarques: ${meta.remarquesTechniques || "-"}`, 14, startY + 36);
    doc.text(`Notes: ${meta.notesGenerales || "-"}`, 14, startY + 44);
    doc.save("plan-de-scene.pdf");
  };

  return <button onClick={onExport} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Exporter en PDF</button>;
}
