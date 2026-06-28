"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Droplet,
  Construction,
  Layers,
  Armchair,
  ArrowUpRight
} from "lucide-react";

export default function Services() {
  const handleSelectService = (type: "residence-cleaning" | "commercial-cleaning") => {
    window.dispatchEvent(new CustomEvent("select-service-type", { detail: type }));
  };

  const residentialServices = [
    {
      icon: <Droplet className="w-5 h-5 text-blue-600" />,
      title: "Mytí oken a ostatních prosklených ploch.",
      desc: "Precizní mytí oken, zimních zahrad, skleněných zábradlí a dalších prosklených prvků.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      title: "Hloubkové čištění koberců",
      desc: "Tepování koberců, matrací a čištění sedacích souprav či čalounění.",
    },
    {
      icon: <Armchair className="w-5 h-5 text-blue-600" />,
      title: "Čištění čalounění, sedaček a matrací",
      desc: "Hloubkové tepování sedacích souprav, čalouněných židlí a matrací pro svěží a hygienicky čistý domov.",
    },
    {
      icon: <Construction className="w-5 h-5 text-blue-600" />,
      title: "Úklid po rekonstrukci a malování",
      desc: "Důkladné odstranění stavebního prachu a nečistot po malování či rekonstrukci bytu nebo domu.",
    },
  ];

  const commercialServices = [
    {
      icon: <Droplet className="w-5 h-5 text-blue-600" />,
      title: "Mytí oken a prosklených ploch",
      desc: "Mytí oken, výloh, prosklených fasád a dělicích příček ve firemních a obchodních prostorech.",
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      title: "Hloubkové čištění koberců",
      desc: "Tepování koberců, kobercových čtverců a podlahových krytin v kancelářích a provozech.",
    },
    {
      icon: <Armchair className="w-5 h-5 text-blue-600" />,
      title: "Čištění čalounění a sedaček",
      desc: "Hloubkové čištění čalouněného nábytku, kancelářských židlí a sedaček v čekárnách a zasedačkách.",
    },
    {
      icon: <Construction className="w-5 h-5 text-blue-600" />,
      title: "Úklid po stavbě a rekonstrukci",
      desc: "Jednorázové generální čištění a zbavení prachu po stavebních úpravách a malování.",
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
    <section id="sluzby" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background radial highlight for subtle premium depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 font-semibold">
            Naše Specializace
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight max-w-2xl">
            Profesionální úklidové služby <br />
            <span className="text-blue-gradient italic font-bold">podle nejvyšších standardů</span>
          </h2>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-6" />
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Column 1: Residential Cleaning */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="flex flex-col"
          >
            {/* Banner Card */}
            <div 
              onClick={() => handleSelectService("residence-cleaning")}
              className="relative group overflow-hidden rounded-sm h-[300px] mb-8 border border-slate-200 hover:border-blue-500/30 hover:shadow-md transition-all duration-500 shadow-sm cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: "url('/home_clean_card.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              
              {/* Floating label */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/90 border border-blue-100 rounded-sm shadow-sm">
                <span className="text-[10px] tracking-widest text-blue-600 uppercase font-sans font-bold">
                  Rezidence & Domy
                </span>
              </div>

              {/* Title & Overlay Trigger */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-blue-200 transition-colors">
                    Rezidenční úklid
                  </h3>
                  <p className="text-xs text-slate-200 font-sans max-w-sm font-light">
                    Dokonalá čistota a svěžest u vás doma s maximální péčí o citlivé povrchy.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 group-hover:border-blue-500 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-all duration-300 shadow-sm">
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
              {residentialServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="flex gap-4 p-5 bg-white border border-slate-100 rounded-sm hover:border-blue-500/10 hover:bg-slate-50/50 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-slate-800 uppercase mb-1 font-sans group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-slate-700 font-normal leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Commercial Cleaning */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="flex flex-col"
          >
            {/* Banner Card */}
            <div 
              onClick={() => handleSelectService("commercial-cleaning")}
              className="relative group overflow-hidden rounded-sm h-[300px] mb-8 border border-slate-200 hover:border-blue-500/30 hover:shadow-md transition-all duration-500 shadow-sm cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: "url('/office_clean_card.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              
              {/* Floating label */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/90 border border-blue-100 rounded-sm shadow-sm">
                <span className="text-[10px] tracking-widest text-blue-600 uppercase font-sans font-bold">
                  Firmy & Kanceláře
                </span>
              </div>

              {/* Title & Overlay Trigger */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-white mb-1 group-hover:text-blue-200 transition-colors">
                    Komerční úklid
                  </h3>
                  <p className="text-xs text-slate-200 font-sans max-w-sm font-light">
                    Reprezentativní a hygienicky čisté prostředí pro bezproblémový chod vaší firmy.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 group-hover:border-blue-500 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-all duration-300 shadow-sm">
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
              {commercialServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="flex gap-4 p-5 bg-white border border-slate-100 rounded-sm hover:border-blue-500/10 hover:bg-slate-50/50 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-slate-800 uppercase mb-1 font-sans group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-slate-700 font-normal leading-relaxed">
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
