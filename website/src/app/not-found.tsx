import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  description:
    "Tato adresa na webu úklidových služeb Josefa Pufra neexistuje. Pokračujte na úvodní stránku.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-36 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-4 font-semibold">
            404
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif text-slate-900 tracking-tight leading-tight">
            Stránka nenalezena
          </h1>
          <p className="mt-6 text-base text-slate-700 leading-relaxed">
            Tahle adresa na webu úklidových služeb Josefa Pufra neexistuje. Úklid kanceláří a domácností najdete na úvodní stránce.
          </p>
          <Link
            href="/"
            className="inline-flex mt-10 px-8 py-4 bg-blue-royal rounded-sm text-sm uppercase tracking-widest font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Zpět na úvod
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
