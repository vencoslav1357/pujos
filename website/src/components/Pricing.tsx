"use client";

import { motion } from "framer-motion";
import { Check, Truck, Info, Home, Building } from "lucide-react";

export default function Pricing() {
  const pricingCards = [
    {
      icon: <Building className="w-8 h-8 text-blue-600" />,
      name: "Komerční úklid",
      price: "Individuální",
      desc: "Špičkový úklid firemních prostor, kanceláří a administrativních budov.",
      popular: false,
      features: [
        "Pravidelný i generální úklid kanceláří",
        "Úklid společných prostor bytových domů",
        "Jednorázové úklidy po stavbě a rekonstrukci",
        "Flexibilní harmonogram (mimo pracovní dobu)",
        "Dlouhodobá spolupráce s garancí kvality",
        "Zpracování cenové nabídky zdarma do 24h",
      ],
      ctaText: "Vyžádat firemní nabídku",
    },
    {
      icon: <Home className="w-8 h-8 text-blue-600" />,
      name: "Rezidenční úklid",
      price: "Dle velikosti",
      desc: "Kompletní péče o domácnosti, rodinné domy a bytové prostory.",
      popular: false,
      features: [
        "Jednorázové i pravidelné generální úklidy",
        "Mytí oken a ostatních prosklených ploch",
        "Hloubkové mokré čištění (tepování) koberců a čalounění",
        "Individuální úklidové plány na míru",
        "Profesionální čisticí prostředky v ceně",
        "Bezplatná osobní prohlídka a nacenění",
      ],
      ctaText: "Poptat úklid domu",
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      name: "Doprava",
      price: "7,-",
      unit: "Kč / km",
      desc: "Dopravné pro realizaci služeb kdekoli v Praze a okolí.",
      popular: false,
      features: [
        "Sazba počítána z Chýnova k vám a zpět",
        "Přesný příjezd v dohodnutý čas",
        "Dovoz veškeré techniky a vybavení v ceně",
        "Transparentní kalkulace předem",
        "Možnost realizace po celé ČR",
        "Doprava v rámci vybraných balíčků zdarma",
      ],
      ctaText: "Spočítat dopravu",
    },
  ];

  return (
    <section id="cenik" className="py-24 md:py-32 bg-gradient-to-b from-white via-blue-50/60 to-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 font-semibold">
            Ceník a Podmínky
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight max-w-2xl">
            Jasné podmínky, <br />
            <span className="text-blue-gradient italic font-bold">které se odvíjí od vašich potřeb</span>
          </h2>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-6" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {pricingCards.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative p-8 rounded-sm flex flex-col justify-between transition-all duration-500 border ${
                pkg.popular
                  ? "bg-white border-blue-500 shadow-lg lg:-translate-y-4"
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
              }`}
            >
              {/* Highlight Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-royal rounded-full shadow-md">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white">
                    Nejžádanější
                  </span>
                </div>
              )}

              <div>
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-slate-900 font-medium">{pkg.name}</h3>
                  </div>
                </div>
                
                <p className="text-xs text-slate-750 font-normal mb-6 min-h-[32px]">{pkg.desc}</p>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8 border-b border-slate-100 pb-6">
                  {pkg.unit ? (
                    <>
                      <span className="text-4xl font-bold font-sans tracking-tight text-blue-600">
                        {pkg.price}
                      </span>
                      <span className="text-lg text-slate-600 font-medium ml-1">{pkg.unit}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold font-sans tracking-tight text-slate-800">
                      {pkg.price}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-4 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-800 font-normal leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const service = pkg.name.includes("Rezidenční") ? "residence-cleaning" : "commercial-cleaning";
                  window.dispatchEvent(new CustomEvent("select-service-type", { detail: service }));
                }}
                className={`w-full py-4 rounded-sm text-center text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                  pkg.popular
                    ? "bg-blue-royal text-white hover:bg-blue-700 shadow-md shadow-blue-500/10"
                    : "bg-slate-50 text-slate-700 border border-slate-100 hover:border-blue-500/30 hover:text-blue-600"
                }`}
              >
                {pkg.ctaText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Informative Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 bg-white border border-slate-150 rounded-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6 hover:border-blue-500/20 transition-colors shadow-sm"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-800 mb-2 font-medium">
                Doplňující informace k ceníku
              </h3>
              <p className="text-sm text-slate-750 font-normal leading-relaxed max-w-2xl">
                Cena každé zakázky se odvíjí především od velikosti objektu, celkové plochy v m² a specifického znečištění. Konečnou cenu stanovujeme vždy po dohodě s vámi před zahájením prací. Doprava je účtována transparentně ve výši <strong>7,- Kč / km</strong>.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <a
              href="#kontakt"
              className="block w-full md:w-auto px-6 py-4 bg-transparent border border-blue-600/30 hover:border-blue-600 rounded-sm text-center text-xs uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all font-bold"
            >
              Kalkulace zdarma
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
