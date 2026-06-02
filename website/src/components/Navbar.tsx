"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Úvod", href: "#" },
    { name: "Služby", href: "#sluzby" },
    { name: "Naše filozofie", href: "#filozofie" },
    { name: "Průběh", href: "#prubeh" },
    { name: "Ceník", href: "#cenik" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? "py-4 bg-zinc-950/80 backdrop-blur-md border-gold-500/10 shadow-lg shadow-black/40"
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors">
              JOSEF PUFR
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 group-hover:bg-gold-300 transition-colors self-end mb-2"></span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm tracking-widest uppercase text-zinc-400 hover:text-gold-200 transition-colors duration-300 py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA & Contact Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+420777777777"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>+420 777 777 777</span>
            </a>
            <a
              href="#kontakt"
              className="relative overflow-hidden px-6 py-2.5 bg-transparent border border-gold-400/40 rounded-sm text-sm uppercase tracking-widest text-gold-400 hover:text-zinc-950 transition-colors duration-500 group"
            >
              <span className="absolute inset-0 w-full h-full bg-gold-gradient scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-10" />
              Nezávazná poptávka
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <a
              href="#kontakt"
              className="px-4 py-2 border border-gold-400/40 rounded-sm text-xs uppercase tracking-wider text-gold-400 hover:bg-gold-400/10 transition-colors"
            >
              Poptávka
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-gold-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-zinc-950 pt-28 px-8 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-6 border-b border-zinc-850 pb-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif tracking-widest text-zinc-300 hover:text-gold-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <a
                href="tel:+420777777777"
                className="flex items-center gap-3 text-zinc-400 hover:text-gold-400 transition-colors text-lg"
              >
                <Phone className="w-5 h-5 text-gold-400" />
                <span>+420 777 777 777</span>
              </a>
              <a
                href="#kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-4 bg-gold-gradient rounded-sm text-sm uppercase tracking-widest font-semibold text-zinc-950 hover:brightness-110 transition-all shadow-md shadow-gold-500/10"
              >
                Nezávazná poptávka
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
