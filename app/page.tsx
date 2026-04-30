import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
      <section className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Plan de Scène Facile</h1>
        <p className="mt-3 text-slate-600">Créez un plan de scène lisible et exportable en PDF.</p>
        <Link className="mt-6 inline-block rounded bg-slate-900 px-5 py-3 text-white" href="/editeur">
          Créer un plan
        </Link>
      </section>
    </main>
  );
}
