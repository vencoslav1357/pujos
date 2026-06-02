"use client";

import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";

export default function Pricing() {
  const carPackages = [
    {
      name: "Executive Care",
      price: "2 490",
      period: "od",
      desc: "Základní prémiová péče o exteriér i interiér s hydrofobní ochranou.",
      popular: false,
      features: [
        "Šetrné ruční mytí s pH neutrálním šamponem",
        "Chemická dekontaminace laku (odstranění asfaltu a polétavé rzi)",
        "Sušení vzduchem a mikrovlákny s vysokou gramáží",
        "Aplikace tekutého křemičitého vosku (ochrana 3 měsíce)",
        "Kompletní vysávání a čištění interiéru včetně zavazadlového prostoru",
        "Ošetření a oživení vnitřních plastů a palubní desky",
        "Mytí oken z obou stran",
      ],
    },
    {
      name: "Premium Detailing",
      price: "6 990",
      period: "od",
      desc: "Kompletní omlazení vozu s jednokrokovým leštěním laku a hloubkovým čištěním interiéru.",
      popular: true,
      features: [
        "Vše z balíčku Executive Care",
        "Jednokrokové strojní leštění laku (odstranění jemných škrábanců a hologramů)",
        "Hloubkové mokré čištění (tepování) sedadel a koberců",
        "Detailní čištění kožených sedadel s parní dezinfekcí",
        "Impregnace a výživa kůže prémiovými balzámy",
        "Aplikace prémiového sealantu na lak (ochrana 6-12 měsíců)",
        "Čištění mezidveřních prostor a zádveří",
      ],
    },
    {
      name: "Royal Ceramic",
      price: "14 990",
      period: "od",
      desc: "Maximální možná péče s vícekrokovou korekcí laku a dlouhodobou keramickou ochranou.",
      popular: false,
      features: [
        "Vše z balíčku Premium Detailing",
        "Vícekrokové leštění laku (korekce až 90% škrábanců)",
        "Aplikace certifikované 9H keramické ochrany laku (životnost až 3 roky)",
        "Keramická ochrana čelního skla a vnějších zrcátek",
        "Aplikace keramické ochrany na disky kol a třmeny",
        "Kompletní a bezpečné čištění motorového prostoru",
        "Dezinfekce interiéru generátorem ozónu",
      ],
    },
  ];

  return (
    <section id="cenik" className="py-24 md:py-32 bg-zinc-900/20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-sans mb-3">
            Transparentní Ceník
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 tracking-tight leading-tight max-w-2xl">
            Investujte do kvality, která <br />
            <span className="text-gold-gradient italic font-medium">je vidět na první pohled</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-6" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {carPackages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative p-8 rounded-sm flex flex-col justify-between transition-all duration-500 border ${
                pkg.popular
                  ? "bg-zinc-900/80 border-gold-500 shadow-xl shadow-gold-950/10 lg:-translate-y-4"
                  : "bg-zinc-950/40 border-zinc-850 hover:border-zinc-700"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gold-gradient rounded-full">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-950">
                    Nejoblíbenější
                  </span>
                </div>
              )}

              <div>
                {/* Header */}
                <h3 className="font-serif text-2xl text-zinc-100 mb-2">{pkg.name}</h3>
                <p className="text-xs text-zinc-400 font-light mb-6 min-h-[32px]">{pkg.desc}</p>
                
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8 border-b border-zinc-850 pb-6">
                  <span className="text-sm text-zinc-500 font-light">{pkg.period}</span>
                  <span className={`text-4xl font-semibold font-sans tracking-tight ${pkg.popular ? 'text-gold-400' : 'text-zinc-100'}`}>
                    {pkg.price}
                  </span>
                  <span className="text-lg text-zinc-400 font-light">Kč</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-4 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300 font-light leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <a
                href="#kontakt"
                className={`w-full py-4 rounded-sm text-center text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                  pkg.popular
                    ? "bg-gold-gradient text-zinc-950 hover:brightness-110 shadow-md shadow-gold-500/10"
                    : "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-gold-500/40 hover:text-gold-300"
                }`}
              >
                Poptat balíček
              </a>
            </motion.div>
          ))}
        </div>

        {/* Home/Office Cleaning Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 bg-zinc-950/60 border border-zinc-850 rounded-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6 hover:border-gold-500/20 transition-colors"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-sm bg-gold-950/20 border border-gold-500/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-zinc-200 mb-2">
                Individuální úklid rezidencí a komerčních prostor
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-2xl">
                Cenu generálních a pravidelných úklidů rodinných domů, bytů či kanceláří stanovujeme individuálně na základě rozlohy (m²), stavu znečištění a specifických požadavků klienta. Nabízíme bezplatnou osobní prohlídku a kalkulaci na míru.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <a
              href="#kontakt"
              className="block w-full md:w-auto px-6 py-4 bg-transparent border border-gold-400/40 hover:border-gold-400 rounded-sm text-center text-xs uppercase tracking-widest text-gold-400 hover:bg-gold-950/20 transition-all font-semibold"
            >
              Kalkulace na míru
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
