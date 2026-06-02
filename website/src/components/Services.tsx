"use client";

import { motion } from "framer-motion";
import { 
  Car, 
  Sparkles, 
  ShieldCheck, 
  Droplet, 
  Home, 
  Building, 
  Compass, 
  Layers,
  ArrowUpRight 
} from "lucide-react";

export default function Services() {
  const detailingServices = [
    {
      icon: <Car className="w-5 h-5 text-gold-400" />,
      title: "Ruční mytí & Decontamination",
      desc: "Šetrné a hloubkové odstranění nečistot (clay bar) bez poškození laku.",
    },
    {
      icon: <Layers className="w-5 h-5 text-gold-400" />,
      title: "Korekce & Leštění laku",
      desc: "Vícekrokové rozleštění škrábanců pro obnovu zrcadlového lesku.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-400" />,
      title: "Aplikace keramické ochrany",
      desc: "Certifikovaná dlouhodobá ochrana karoserie, disků a oken s hydrofobním efektem.",
    },
    {
      icon: <Droplet className="w-5 h-5 text-gold-400" />,
      title: "Detailní čištění interiéru",
      desc: "Hloubkové tepování, čištění pórů kůže a její kompletní impregnace.",
    },
  ];

  const cleaningServices = [
    {
      icon: <Home className="w-5 h-5 text-gold-400" />,
      title: "Generální úklid rezidencí",
      desc: "Komplexní precizní úklid domů a bytů se zaměřením na skryté detaily.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold-400" />,
      title: "Hloubkové čištění čalounění",
      desc: "Tepování koberců, matrací a čištění luxusních sedacích souprav.",
    },
    {
      icon: <Building className="w-5 h-5 text-gold-400" />,
      title: "Komerční prostory & Kanceláře",
      desc: "Reprezentativní úklid pro firmy, které dbají na špičkový dojem u klientů.",
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-400" />,
      title: "Mytí oken & Prosklených ploch",
      desc: "Bezešvé mytí velkoformátových oken, zimních zahrad a prosklených fasád.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  return (
    <section id="sluzby" className="py-24 md:py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background radial highlight for subtle premium depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-950/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-sans mb-3">
            Naše Specializace
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 tracking-tight leading-tight max-w-2xl">
            Prémiové služby navržené pro <br />
            <span className="text-gold-gradient italic font-medium">maximální estetiku</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-6" />
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Column 1: Car Detailing */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="flex flex-col"
          >
            {/* Banner Card */}
            <div className="relative group overflow-hidden rounded-sm h-[300px] mb-8 border border-zinc-800 hover:border-gold-500/40 transition-all duration-500">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: "url('/car_detail_card.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              {/* Floating label */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-zinc-950/80 border border-gold-400/30 rounded-sm">
                <span className="text-[10px] tracking-widest text-gold-400 uppercase font-sans">
                  Detailing & Auta
                </span>
              </div>

              {/* Title & Overlay Trigger */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-zinc-100 mb-1 group-hover:text-gold-300 transition-colors">
                    Prémiový Detailing Vozidel
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans max-w-sm">
                    Materiály a postupy s garancí špičkového výsledku. Ochrana investice do vašeho vozu.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-850 group-hover:border-gold-500 flex items-center justify-center text-zinc-400 group-hover:text-gold-400 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Service List */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              {detailingServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="flex gap-4 p-5 bg-zinc-900/30 border border-zinc-900/50 rounded-sm hover:border-gold-500/10 hover:bg-zinc-900/50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-gold-950/20 border border-gold-500/10 flex items-center justify-center group-hover:border-gold-500/30 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase mb-1 font-sans group-hover:text-zinc-100 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Premium Cleaning */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="flex flex-col"
          >
            {/* Banner Card */}
            <div className="relative group overflow-hidden rounded-sm h-[300px] mb-8 border border-zinc-800 hover:border-gold-500/40 transition-all duration-500">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: "url('/home_clean_card.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              {/* Floating label */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-zinc-950/80 border border-gold-400/30 rounded-sm">
                <span className="text-[10px] tracking-widest text-gold-400 uppercase font-sans">
                  Luxusní Úklid
                </span>
              </div>

              {/* Title & Overlay Trigger */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-zinc-100 mb-1 group-hover:text-gold-300 transition-colors">
                    Prémiové Úklidové Služby
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans max-w-sm">
                    Dokonalá harmonie čistoty u vás doma i v kanceláři. Maximální spolehlivost a diskrétnost.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-850 group-hover:border-gold-500 flex items-center justify-center text-zinc-400 group-hover:text-gold-400 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Service List */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              {cleaningServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="flex gap-4 p-5 bg-zinc-900/30 border border-zinc-900/50 rounded-sm hover:border-gold-500/10 hover:bg-zinc-900/50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-gold-950/20 border border-gold-500/10 flex items-center justify-center group-hover:border-gold-500/30 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase mb-1 font-sans group-hover:text-zinc-100 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
