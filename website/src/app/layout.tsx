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
  title: "J. Pufr | Profesionální Úklidové Služby",
  description: "Špičková péče o komerční i rezidenční prostory. Zajišťujeme pravidelný i generální úklid kanceláří, domů a mytí oken s důrazem na spolehlivost a preciznost.",
  keywords: ["profesionální úklid", "úklidové služby", "čištění koberců", "J. Pufr", "úklid firem", "úklid domů", "mytí oken"],
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
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}

