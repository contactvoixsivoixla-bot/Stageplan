"use client";

import { create } from "zustand";
import { ELEMENT_LABELS, type ElementType, type ProjectMeta, type SceneElement } from "@/lib/types";

type Snapshot = { elements: SceneElement[]; meta: ProjectMeta };

type PlanState = {
  elements: SceneElement[];
  selectedId: string | null;
  meta: ProjectMeta;
  zoom: number;
  snapToGrid: boolean;
  undoStack: Snapshot[];
  redoStack: Snapshot[];
  addElement: (type: ElementType) => void;
  duplicateSelected: () => void;
  select: (id: string | null) => void;
  move: (id: string, x: number, y: number) => void;
  rename: (id: string, label: string) => void;
  rotate: (id: string, rotation: number) => void;
  remove: (id: string) => void;
  updateMeta: (patch: Partial<ProjectMeta>) => void;
  setZoom: (zoom: number) => void;
  recenter: () => void;
  toggleSnap: () => void;
  undo: () => void;
  redo: () => void;
};

const initialMeta: ProjectMeta = { titre: "Nouveau plan", artiste: "", notesGenerales: "", remarquesTechniques: "" };
const GRID_SIZE = 20;
const STORAGE_KEY = "plan-de-scene-facile-v1";

const clone = (obj: Snapshot): Snapshot => ({ elements: obj.elements.map((e) => ({ ...e })), meta: { ...obj.meta } });
const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const usePlanStore = create<PlanState>((set, get) => {
  const persist = (snapshot: Snapshot) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    }
  };

  const pushHistory = () => {
    const state = get();
    const nextUndo = [...state.undoStack, clone({ elements: state.elements, meta: state.meta })].slice(-60);
    set({ undoStack: nextUndo, redoStack: [] });
  };

  return {
    elements: [],
    selectedId: null,
    meta: initialMeta,
    zoom: 1,
    snapToGrid: false,
    undoStack: [],
    redoStack: [],
    addElement: (type) => {
      pushHistory();
      set((state) => {
        const elements = [...state.elements, { id: crypto.randomUUID(), type, label: ELEMENT_LABELS[type], x: 120 + state.elements.length * 12, y: 120 + state.elements.length * 12, rotation: 0 }];
        persist({ elements, meta: state.meta });
        return { elements };
      });
    },
    duplicateSelected: () => {
      const state = get();
      const selected = state.elements.find((el) => el.id === state.selectedId);
      if (!selected) return;
      pushHistory();
      set((s) => {
        const copy = { ...selected, id: crypto.randomUUID(), x: selected.x + 24, y: selected.y + 24, label: `${selected.label} (copie)` };
        const elements = [...s.elements, copy];
        persist({ elements, meta: s.meta });
        return { elements, selectedId: copy.id };
      });
    },
    select: (id) => set({ selectedId: id }),
    move: (id, x, y) =>
      set((state) => {
        const nx = state.snapToGrid ? snap(x) : x;
        const ny = state.snapToGrid ? snap(y) : y;
        const elements = state.elements.map((el) => (el.id === id ? { ...el, x: nx, y: ny } : el));
        persist({ elements, meta: state.meta });
        return { elements };
      }),
    rename: (id, label) => {
      pushHistory();
      set((state) => {
        const elements = state.elements.map((el) => (el.id === id ? { ...el, label } : el));
        persist({ elements, meta: state.meta });
        return { elements };
      });
    },
    rotate: (id, rotation) => {
      set((state) => {
        const elements = state.elements.map((el) => (el.id === id ? { ...el, rotation } : el));
        persist({ elements, meta: state.meta });
        return { elements };
      });
    },
    remove: (id) => {
      pushHistory();
      set((state) => {
        const elements = state.elements.filter((el) => el.id !== id);
        persist({ elements, meta: state.meta });
        return { elements, selectedId: null };
      });
    },
    updateMeta: (patch) => {
      pushHistory();
      set((state) => {
        const meta = { ...state.meta, ...patch };
        persist({ elements: state.elements, meta });
        return { meta };
      });
    },
    setZoom: (zoom) => set({ zoom: Math.min(1.8, Math.max(0.6, zoom)) }),
    recenter: () => set({ zoom: 1 }),
    toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
    undo: () => {
      const state = get();
      const prev = state.undoStack[state.undoStack.length - 1];
      if (!prev) return;
      const current = clone({ elements: state.elements, meta: state.meta });
      const undoStack = state.undoStack.slice(0, -1);
      const redoStack = [...state.redoStack, current].slice(-60);
      persist(prev);
      set({ elements: prev.elements, meta: prev.meta, undoStack, redoStack, selectedId: null });
    },
    redo: () => {
      const state = get();
      const next = state.redoStack[state.redoStack.length - 1];
      if (!next) return;
      const current = clone({ elements: state.elements, meta: state.meta });
      const redoStack = state.redoStack.slice(0, -1);
      const undoStack = [...state.undoStack, current].slice(-60);
      persist(next);
      set({ elements: next.elements, meta: next.meta, undoStack, redoStack, selectedId: null });
    }
  };
});

if (typeof window !== "undefined") {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Snapshot;
      usePlanStore.setState({ elements: parsed.elements ?? [], meta: parsed.meta ?? initialMeta });
    } catch {
      // ignore invalid local storage
    }
  }
}
