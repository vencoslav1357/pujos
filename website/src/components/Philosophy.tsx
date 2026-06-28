"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Eye, Sliders } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Philosophy() {
  const pillars = [
    {
      icon: <Eye className="w-8 h-8 text-blue-600" />,
      title: "Absolutní Preciznost",
      desc: "Na detailech záleží nejvíce. Vidíme a čistíme i místa, která běžný pohled mine. Dokonalost je pro nás standard.",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Prvotřídní Chemie",
      desc: "Používáme šetrné a vysoce účinné čisticí prostředky, které dokonale ošetří každý povrch.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Důvěra & Diskrétnost",
      desc: "Spolehlivost, bezpečnost a diskrétnost jsou naším slibem.",
    },
    {
      icon: <Sliders className="w-8 h-8 text-blue-600" />,
      title: "Individuální Přístup",
      desc: "Nenabízíme univerzální řešení. Vždy nejprve analyzujeme stav a navrhneme péči, která přinese ten nejlepší možný výsledek.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="filozofie" className="py-24 md:py-32 bg-white relative border-y border-slate-100">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-20">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 block font-semibold">
              Naše Filozofie
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight">
              Péče, která přesahuje <br />
              <span className="text-blue-gradient italic font-bold">běžné standardy čistoty</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <ScrollReveal
              text="Čistota je první věc, které si návštěva nebo zákazník všimne. Ať už jde o firemní prostory, nebo o váš rodinný dům, ke každé zakázce přistupujeme se stejnou pečlivostí a důrazem na detail."
              className="text-slate-750 font-normal leading-relaxed text-sm md:text-base"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-slate-50 border border-slate-100 hover:border-blue-500/20 rounded-sm transition-all duration-300 flex flex-col justify-between group h-full shadow-sm hover:shadow-md"
            >
              <div>
                {/* Icon Wrapper */}
                <div className="w-16 h-16 rounded-sm bg-white border border-slate-100 flex items-center justify-center mb-8 group-hover:border-blue-500/20 group-hover:bg-blue-50/50 transition-colors shadow-sm">
                  {pillar.icon}
                </div>
                
                {/* Pillar Title */}
                <h3 className="text-lg font-serif text-slate-800 mb-4 tracking-wide group-hover:text-blue-600 transition-colors font-medium">
                  {pillar.title}
                </h3>
                
                {/* Pillar Description */}
                <p className="text-sm text-slate-700 font-normal leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              
              {/* Subtle blue line indicator at the bottom on hover */}
              <div className="w-0 h-[1.5px] bg-blue-500 group-hover:w-full transition-all duration-300 mt-8" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
