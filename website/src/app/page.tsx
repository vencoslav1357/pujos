"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Philosophy from "@/components/Philosophy";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Intro Preloader */}
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Premium smooth scroll & custom cursor */}
      <SmoothScroll />
      <CustomCursor />

      {/* Floating Header */}
      <Navbar isLoading={isLoading} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Immersive Parallax Hero Section */}
        <Hero isLoading={isLoading} />

        {/* Services Split Section */}
        <Services />

        {/* Philosophy Core Values Section */}
        <Philosophy />

        {/* Step-by-Step Process Timeline Section */}
        <Process />

        {/* Tiered Price Table and Callout Section */}
        <Pricing />

        {/* Integrated Reservation and Contact Form Section */}
        <Contact />
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}

