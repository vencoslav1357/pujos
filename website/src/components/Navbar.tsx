"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

interface NavbarProps {
  isLoading?: boolean;
}

export default function Navbar({ isLoading = false }: NavbarProps) {
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
        animate={isLoading ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled
            ? "py-4 bg-white/95 backdrop-blur-md border-slate-100 shadow-sm"
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">
              J. PUFR
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans self-end mb-1.5 hidden sm:inline-block">
              úklidové služby
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 group-hover:bg-blue-500 transition-colors self-end mb-2"></span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm tracking-widest uppercase text-slate-600 hover:text-blue-600 transition-colors duration-300 py-2 group font-medium"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA & Contact Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+420777777777"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300 font-semibold"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+420 777 777 777</span>
            </a>
            <a
              href="#kontakt"
              className="relative overflow-hidden px-6 py-2.5 bg-transparent border border-blue-600/30 rounded-sm text-sm uppercase tracking-widest text-blue-600 hover:text-white transition-colors duration-500 group font-semibold"
            >
              <span className="absolute inset-0 w-full h-full bg-blue-royal scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-10" />
              Nezávazná poptávka
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <a
              href="#kontakt"
              className="px-4 py-2 border border-blue-600/30 rounded-sm text-xs uppercase tracking-wider text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
            >
              Poptávka
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600 transition-colors"
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
            className="fixed inset-0 z-40 bg-white pt-28 px-8 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-6 border-b border-slate-100 pb-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif tracking-widest text-slate-800 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <a
                href="tel:+420777777777"
                className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors text-lg font-semibold"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>+420 777 777 777</span>
              </a>
              <a
                href="#kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-4 bg-blue-royal rounded-sm text-sm uppercase tracking-widest font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
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
