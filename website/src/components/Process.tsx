"use client";

import { motion } from "framer-motion";
import { Calendar, ClipboardList, Sparkles, ShieldCheck } from "lucide-react";

export default function Process() {
  const steps = [
    {
      num: "01",
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Nezávazná Konzultace",
      desc: "Kontaktujete nás přes formulář nebo telefonicky. Prodiskutujeme vaše přání, typ vozu či rozsah prostor a domluvíme termín.",
    },
    {
      num: "02",
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      title: "Analýza & Plánování",
      desc: "Před zahájením prací zhodnotíme stav povrchů. Navrhneme ideální technologický postup a odsouhlasíme si finální rozsah péče.",
    },
    {
      num: "03",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: "Precizní Realizace",
      desc: "Využíváme nejšetrnější techniky, špičkové vybavení a prémiové produkty.",
    },
    {
      num: "04",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Předání & Perfekcionismus",
      desc: "Výsledek zkontrolujeme. Předáme Vám čisté dílo.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const;

  const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="prubeh" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 font-semibold">
            Náš Postup
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight max-w-2xl">
            Cesta k dosažení <br />
            <span className="text-blue-gradient italic font-bold">dokonalého výsledku</span>
          </h2>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-6" />
        </div>

        {/* Timeline Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[50px] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-slate-100 via-blue-500/20 to-slate-100 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="relative flex flex-col items-start z-10 group"
            >
              {/* Connector marker */}
              <div className="flex items-center justify-between w-full mb-6">
                <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-150 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50/50 transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                <span className="font-serif text-4xl font-extrabold text-blue-900/10 group-hover:text-blue-500/20 transition-colors">
                  {step.num}
                </span>
              </div>

              {/* Card content */}
              <h3 className="text-lg font-serif text-slate-800 tracking-wide mb-3 group-hover:text-blue-600 transition-colors font-medium">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                {step.desc}
              </p>

              {/* Decorative side indicator */}
              <div className="w-1 h-0 bg-blue-500 group-hover:h-8 transition-all duration-300 absolute left-[-16px] top-[10px]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
