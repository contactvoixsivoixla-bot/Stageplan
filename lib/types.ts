export type ElementType =
  | "chanteur"
  | "musicien"
  | "comedien"
  | "micro"
  | "retour"
  | "ampli"
  | "batterie"
  | "clavier"
  | "guitare"
  | "basse"
  | "di"
  | "chaise"
  | "table"
  | "praticable"
  | "decor"
  | "prise"
  | "personnalise";

export type SceneElement = {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  rotation: number;
};

export type ProjectMeta = {
  titre: string;
  artiste: string;
  notesGenerales: string;
  remarquesTechniques: string;
};

export const ELEMENT_LABELS: Record<ElementType, string> = {
  chanteur: "Chanteur",
  musicien: "Musicien",
  comedien: "Comédien",
  micro: "Micro",
  retour: "Retour",
  ampli: "Ampli",
  batterie: "Batterie",
  clavier: "Clavier",
  guitare: "Guitare",
  basse: "Basse",
  di: "DI",
  chaise: "Chaise",
  table: "Table",
  praticable: "Praticable",
  decor: "Décor",
  prise: "Prise électrique",
  personnalise: "Élément personnalisé"
};
