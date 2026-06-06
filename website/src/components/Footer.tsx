"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-150 py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <a href="#" className="flex items-center gap-2 group mb-6">
              <span className="font-serif text-2xl font-bold tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">
                J. PUFR
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans self-end mb-1.5">
                úklidové služby
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 group-hover:bg-blue-500 transition-colors self-end mb-2"></span>
            </a>
            <p className="text-slate-700 font-normal text-sm leading-relaxed mb-6 max-w-sm">
              Špičkový úklid komerčních a rezidenčních prostor. Zajišťujeme precizní pravidelnou i generální údržbu kanceláří, domů a mytí oken s důrazem na spolehlivost a preciznost.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-sm bg-white border border-slate-200 hover:border-blue-500/40 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-sm bg-white border border-slate-200 hover:border-blue-500/40 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-6">
              Odkazy
            </h4>
            <div className="flex flex-col gap-4">
              {["Úvod", "Služby", "Naše filozofie", "Průběh", "Ceník", "Kontakt"].map((link) => (
                <a
                  key={link}
                  href={`#${link === "Úvod" ? "" : link.toLowerCase().replace("naše ", "").replace("ú", "u").replace("ě", "e").replace("í", "i")}`}
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors w-fit font-normal"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-6">
              Naše Služby
            </h4>
            <div className="flex flex-col gap-4 text-sm text-slate-600 font-normal">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Pravidelný úklid kanceláří</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Generální úklid rezidencí</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Mytí oken a prosklených ploch</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Hloubkové čištění koberců</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Jednorázové úklidy po stavbě</span>
            </div>
          </div>

          {/* Col 4: Contact details */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-6">
              Kontakt
            </h4>
            <a
              href="tel:+420777777777"
              className="flex items-start gap-3 group text-sm text-slate-600 hover:text-blue-600 transition-colors font-normal"
            >
              <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
              <span>+420 777 777 777</span>
            </a>
            <a
              href="mailto:info@jpufr.cz"
              className="flex items-start gap-3 group text-sm text-slate-600 hover:text-blue-600 transition-colors font-normal"
            >
              <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
              <span>info@jpufr.cz</span>
            </a>
            <div className="flex items-start gap-3 text-sm text-slate-600 font-normal">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
              <span>Průmyslová 1234, Praha 10</span>
            </div>
          </div>

        </div>

        {/* Lower Copyright & Legal Row */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-light font-sans text-center sm:text-left">
            &copy; {currentYear} J. Pufr úklidové služby. Všechna práva vyhrazena.
          </p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-xs text-slate-400 font-light font-sans flex items-center gap-1">
              <span>Navrhnuto s důrazem na</span>
              <span className="text-blue-600 font-semibold">spolehlivost</span>
            </p>
            <p className="text-[11px] text-slate-400 font-light font-sans flex items-center gap-1">
              <span>Made with</span>
              <span className="text-rose-500">♥</span>
              <span>by Jan Veselý</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
