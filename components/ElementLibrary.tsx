"use client";

import { ELEMENT_LABELS, type ElementType } from "@/lib/types";
import { usePlanStore } from "@/store/planStore";

const order: ElementType[] = [
  "chanteur","musicien","comedien","micro","retour","ampli","batterie","clavier","guitare","basse","di","chaise","table","praticable","decor","prise","personnalise"
];

export function ElementLibrary() {
  const addElement = usePlanStore((s) => s.addElement);
  return (
    <aside className="rounded-lg border bg-white p-3">
      <h2 className="mb-3 text-sm font-semibold">Bibliothèque</h2>
      <div className="grid grid-cols-1 gap-2">
        {order.map((type) => (
          <button key={type} onClick={() => addElement(type)} className="rounded border px-2 py-1 text-left text-sm hover:bg-slate-100">
            + {ELEMENT_LABELS[type]}
          </button>
        ))}
      </div>
    </aside>
  );
}
