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
    service: "commercial-cleaning",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setFormSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "commercial-cleaning",
      message: "",
    });
    setFormSubmitted(false);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 block font-semibold">
                Kontakt
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight mb-8">
                Napište nám a <br />
                <span className="text-blue-gradient italic font-bold">získejte cenovou nabídku</span>
              </h2>
              <p className="text-slate-500 font-light leading-relaxed mb-12 max-w-md">
                Máte zájem o pravidelný či generální úklid vašich komerčních prostor, nebo potřebujete zajistit precizní péči o domácnost? Vyplňte formulář a my se vám ozveme zpět s nezávaznou nabídkou do 24 hodin.
              </p>

              {/* Info Items */}
              <div className="flex flex-col gap-6">
                
                {/* Phone */}
                <a
                  href="tel:+420777777777"
                  className="flex gap-4 items-center group w-fit"
                >
                  <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50/50 transition-all duration-300 shadow-sm">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-sans font-semibold">
                      Telefon
                    </span>
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-semibold">
                      +420 777 777 777
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@jpufr.cz"
                  className="flex gap-4 items-center group w-fit"
                >
                  <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50/50 transition-all duration-300 shadow-sm">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-sans font-semibold">
                      E-mail
                    </span>
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-semibold">
                      info@jpufr.cz
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-sans font-semibold">
                      Sídlo firmy
                    </span>
                    <span className="text-slate-700 font-semibold">
                      Průmyslová 1234, 102 00 Praha 10
                    </span>
                  </div>
                </div>

                {/* Clock */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-sans font-semibold">
                      Provozní doba
                    </span>
                    <span className="text-slate-700 font-semibold">
                      Po - So: 8:00 - 18:00 (dle objednávek)
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Form wrapper */}
          <div className="lg:col-span-7 w-full">
            <div className="p-8 md:p-12 bg-slate-50/50 border border-slate-100 rounded-sm shadow-sm relative overflow-hidden">
              
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
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Jméno a Příjmení / Název firmy
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                        placeholder="Napište své jméno nebo název firmy..."
                      />
                    </div>

                    {/* Contact details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                          Telefonní číslo
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                          placeholder="+420 777 777 777"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                          E-mailová adresa
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                          placeholder="jmeno@priklad.cz"
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Poptávaná služba
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-750 font-sans cursor-pointer shadow-sm"
                      >
                        <option value="commercial-cleaning">Špičkový úklid firemních prostor</option>
                        <option value="office-cleaning">Pravidelný úklid kanceláří</option>
                        <option value="residence-cleaning">Generální úklid rezidence / domu</option>
                        <option value="window-washing">Mytí oken a prosklených ploch</option>
                        <option value="construction-cleaning">Úklid po stavebních úpravách</option>
                        <option value="other">Jiné / individuální specifikace</option>
                      </select>
                    </div>

                    {/* Message / Details */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Poznámka k poptávce (specifikace nemovitosti)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans resize-none shadow-sm"
                        placeholder="Napište nám přibližnou rozlohu v m², přibližnou frekvenci úklidu (pravidelný/jednorázový) a vaše specifická přání..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-royal text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 mt-2"
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
                    <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-serif text-2xl text-slate-900 mb-3 font-semibold">
                      Poptávka byla odeslána
                    </h3>
                    <p className="text-sm text-slate-500 font-light max-w-sm mb-8 leading-relaxed">
                      Děkujeme za vaši poptávku. J. Pufr vás bude kontaktovat e-mailem nebo telefonicky pro upřesnění detailů a vypracování cenové nabídky.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-slate-50 border border-slate-100 text-slate-700 hover:text-blue-600 hover:border-blue-500/30 rounded-sm text-xs uppercase tracking-widest font-medium transition-colors"
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
