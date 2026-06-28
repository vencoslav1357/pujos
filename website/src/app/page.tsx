import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Philosophy from "@/components/Philosophy";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Premium smooth scroll & custom cursor */}
      <SmoothScroll />
      <CustomCursor />

      {/* Floating Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Immersive Parallax Hero Section */}
        <Hero />

        {/* Services Split Section */}
        <Services />

        {/* Philosophy Core Values Section */}
        <Philosophy />

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
