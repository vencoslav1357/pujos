import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Josef Pufr | Prémiové Čištění Aut & Detailing",
  description: "Exkluzivní péče o vaše vozy a profesionální úklidové služby. Preciznost, špičkové technologie a smysl pro detail v každém kroku.",
  keywords: ["čištění aut", "detailing", "ruční mytí", "profesionální úklid", "čištění interiérů", "čištění exteriérů", "čištění koberců", "Josef Pufr"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}

