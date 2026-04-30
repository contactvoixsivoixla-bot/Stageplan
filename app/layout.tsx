import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plan de Scène Facile",
  description: "Créer des plans de scène clairs et exportables en PDF"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
