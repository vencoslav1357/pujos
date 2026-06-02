"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "premium-detailing",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
      setFormSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "premium-detailing",
      message: "",
    });
    setFormSubmitted(false);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-950/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-sans mb-3 block">
                Kontakt
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 tracking-tight leading-tight mb-8">
                Napište nám a <br />
                <span className="text-gold-gradient italic font-medium">rezervujte si termín</span>
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed mb-12 max-w-md">
                Máte zájem o detailing vašeho vozu nebo potřebujete zajistit bezchybný úklid nemovitosti? Vyplňte formulář a my se vám ozveme zpět s nezávaznou nabídkou do 24 hodin.
              </p>

              {/* Info Items */}
              <div className="flex flex-col gap-8">
                
                {/* Phone */}
                <a
                  href="tel:+420777777777"
                  className="flex gap-4 items-center group w-fit"
                >
                  <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-950/10 transition-all duration-300">
                    <Phone className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider block font-sans">
                      Telefon
                    </span>
                    <span className="text-zinc-200 group-hover:text-gold-300 transition-colors font-medium">
                      +420 777 777 777
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@josefpufr.cz"
                  className="flex gap-4 items-center group w-fit"
                >
                  <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-950/10 transition-all duration-300">
                    <Mail className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider block font-sans">
                      E-mail
                    </span>
                    <span className="text-zinc-200 group-hover:text-gold-300 transition-colors font-medium">
                      info@josefpufr.cz
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider block font-sans">
                      Ateliér Detailing
                    </span>
                    <span className="text-zinc-200 font-medium">
                      Průmyslová 1234, 102 00 Praha 10
                    </span>
                  </div>
                </div>

                {/* Clock */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider block font-sans">
                      Provozní doba
                    </span>
                    <span className="text-zinc-200 font-medium">
                      Po - So: 8:00 - 18:00 (dle objednávek)
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Form wrapper */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 bg-zinc-900/30 border border-zinc-900 rounded-sm shadow-xl relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                  >
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-sans">
                        Jméno a Příjmení
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-3 bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-gold-500 focus:outline-none rounded-sm transition-colors text-sm text-zinc-100 font-sans"
                        placeholder="Napište své jméno..."
                      />
                    </div>

                    {/* Contact details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-sans">
                          Telefonní číslo
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="px-4 py-3 bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-gold-500 focus:outline-none rounded-sm transition-colors text-sm text-zinc-100 font-sans"
                          placeholder="+420 777 777 777"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-400 font-sans">
                          E-mailová adresa
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-4 py-3 bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-gold-500 focus:outline-none rounded-sm transition-colors text-sm text-zinc-100 font-sans"
                          placeholder="jmeno@priklad.cz"
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-sans">
                        Poptávaná služba
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="px-4 py-3 bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-gold-500 focus:outline-none rounded-sm transition-colors text-sm text-zinc-300 font-sans cursor-pointer"
                      >
                        <option value="executive-care">Executive Care (Čištění aut)</option>
                        <option value="premium-detailing">Premium Detailing (Čištění aut)</option>
                        <option value="royal-ceramic">Royal Ceramic (Keramika & Detailing)</option>
                        <option value="residence-cleaning">Prémiový úklid rezidence</option>
                        <option value="office-cleaning">Úklid komerčních prostor</option>
                        <option value="other">Individuální specifikace</option>
                      </select>
                    </div>

                    {/* Message / Car type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-sans">
                        Váš vůz / Poznámka k poptávce
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="px-4 py-3 bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-gold-500 focus:outline-none rounded-sm transition-colors text-sm text-zinc-100 font-sans resize-none"
                        placeholder="Napište nám značku a model vozu, případně bližší specifikace nemovitosti a vaše přání..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-gold-gradient text-zinc-950 font-semibold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 shadow-lg shadow-gold-500/10 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Odeslat poptávku</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold-950/20 border border-gold-500/30 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-gold-400" />
                    </div>
                    <h3 className="font-serif text-2xl text-zinc-100 mb-3">
                      Poptávka byla úspěšně odeslána
                    </h3>
                    <p className="text-sm text-zinc-400 font-light max-w-sm mb-8 leading-relaxed">
                      Děkujeme za vaši důvěru. Josef Pufr vás bude kontaktovat telefonicky nebo e-mailem během několika hodin pro upřesnění detailů.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-gold-300 hover:border-gold-500/40 rounded-sm text-xs uppercase tracking-widest font-medium transition-colors"
                    >
                      Odeslat novou poptávku
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
