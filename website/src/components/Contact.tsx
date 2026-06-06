"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Droplet, 
  Building, 
  Home, 
  Layers, 
  Loader2,
  AlertCircle,
  Link2,
  Link2Off,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Calculator Configuration State
  const [serviceType, setServiceType] = useState<"residence" | "commercial">("commercial");
  const [area, setArea] = useState(100);
  const [frequency, setFrequency] = useState("Pravidelně (1-2x týdně)");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [isCalculatingDistance, startCalculateDistance] = useTransition();
  const [distanceError, setDistanceError] = useState<string | null>(null);
  
  // Selected extras
  const [extras, setExtras] = useState({
    windows: false,
    carpet: false,
    upholstery: false,
    construction: false,
  });

  // Contact Form Details
  const [attachData, setAttachData] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // PDF Generation loading state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Sync selected service type from click events in other components
  useEffect(() => {
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      const selected = customEvent.detail;
      if (selected === "residence-cleaning") {
        setServiceType("residence");
        setFrequency("Jednorázově");
      } else if (selected === "commercial-cleaning") {
        setServiceType("commercial");
        setFrequency("Pravidelně (1-2x týdně)");
      }
      
      const element = document.getElementById("kontakt");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("select-service-type", handleServiceSelect);
    return () => window.removeEventListener("select-service-type", handleServiceSelect);
  }, []);

  // Update default frequency when service type changes
  useEffect(() => {
    if (serviceType === "residence") {
      setFrequency("Jednorázově");
    } else {
      setFrequency("Pravidelně (1-2x týdně)");
    }
  }, [serviceType]);

  // Haversine formula fallback
  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Geocode and calculate driving distance
  const handleCalculateDistance = (addressStr: string) => {
    if (!addressStr || addressStr.trim().length < 5) {
      setDistanceError("Zadejte prosím úplnou adresu (např. ulice, město).");
      return;
    }
    
    setDistanceError(null);
    
    startCalculateDistance(async () => {
      try {
        const query = `${addressStr}, Česká republika`;
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        
        const geoResponse = await fetch(geoUrl, {
          headers: {
            "User-Agent": "JPufrCleaningApp/1.0 (info@jpufr.cz)"
          }
        });
        
        if (!geoResponse.ok) throw new Error("Geokódování selhalo.");
        const geoData = await geoResponse.json();
        
        if (!geoData || geoData.length === 0) {
          throw new Error("Adresa nebyla nalezena. Upřesněte název ulice nebo města.");
        }
        
        const destLat = parseFloat(geoData[0].lat);
        const destLon = parseFloat(geoData[0].lon);
        
        // Base location: Průmyslová, Praha 10
        const baseLat = 50.0617;
        const baseLon = 14.5312;
        
        // Try OSRM driving distance
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${baseLon},${baseLat};${destLon},${destLat}?overview=false`;
        const osrmResponse = await fetch(osrmUrl);
        
        if (!osrmResponse.ok) throw new Error("Plánovač tras je nedostupný.");
        const osrmData = await osrmResponse.json();
        
        if (osrmData && osrmData.routes && osrmData.routes.length > 0) {
          const roadDistKm = Math.round((osrmData.routes[0].distance / 1000) * 10) / 10;
          setDistance(roadDistKm);
        } else {
          // Fallback: Haversine * 1.3
          const straightLineDist = calculateHaversineDistance(baseLat, baseLon, destLat, destLon);
          const estimatedRoadDistKm = Math.round(straightLineDist * 1.3 * 10) / 10;
          setDistance(estimatedRoadDistKm);
        }
      } catch (err: any) {
        console.error(err);
        setDistanceError("Nepodařilo se automaticky spočítat trasu. Zkuste upřesnit adresu.");
        setDistance(undefined);
      }
    });
  };

  // Pricing calculations
  const basePricePerSqm = serviceType === "residence" ? 24 : 19;
  
  // Frequency multipliers
  let frequencyMultiplier = 1.0;
  let frequencyLabel = "";
  if (serviceType === "residence") {
    if (frequency === "Jednorázově") {
      frequencyMultiplier = 1.3;
      frequencyLabel = "Jednorázový úklid (+30 % náročnost)";
    } else if (frequency === "Pravidelně (1x týdně)") {
      frequencyMultiplier = 0.85;
      frequencyLabel = "Pravidelný úklid (-15 % loyalty)";
    } else if (frequency === "Pravidelně (1x za 14 dní)") {
      frequencyMultiplier = 0.95;
      frequencyLabel = "Pravidelný úklid (-5 % loyalty)";
    }
  } else {
    if (frequency === "Jednorázově") {
      frequencyMultiplier = 1.25;
      frequencyLabel = "Jednorázový úklid (+25 % náročnost)";
    } else if (frequency === "Pravidelně (1-2x týdně)") {
      frequencyMultiplier = 0.9;
      frequencyLabel = "Pravidelný úklid (-10 % loyalty)";
    } else if (frequency === "Pravidelně (3-5x týdně)") {
      frequencyMultiplier = 0.8;
      frequencyLabel = "Častý úklid (-20 % objemová sleva)";
    }
  }

  const rawBaseCleaning = area * basePricePerSqm;
  const baseCleaningAdjusted = Math.round(rawBaseCleaning * frequencyMultiplier);
  const frequencyDifference = baseCleaningAdjusted - rawBaseCleaning;

  // Transport calculation (7 CZK/km both directions, i.e. 14 CZK per distance km)
  const transportCost = distance ? Math.round(distance * 7 * 2) : 0;

  // Extras pricing
  const windowsCost = extras.windows 
    ? (serviceType === "residence" ? 1200 + area * 5 : 1800 + area * 4)
    : 0;
  const carpetCost = extras.carpet ? area * 15 : 0;
  const upholsteryCost = extras.upholstery ? 1500 : 0;
  const constructionCost = extras.construction ? area * 25 : 0;

  const totalCalculatedMin = Math.round(baseCleaningAdjusted + windowsCost + carpetCost + upholsteryCost + constructionCost + transportCost);
  const totalCalculatedMax = Math.round(totalCalculatedMin * 1.25);

  // PDF Quote Download Handler
  const handleDownloadPDF = async () => {
    const template = document.getElementById("pdf-quote-template");
    if (!template) return;

    setIsGeneratingPDF(true);

    try {
      // Unhide template momentarily for rendering
      template.style.display = "block";

      const canvas = await html2canvas(template, {
        scale: 2.2, // Ultra-sharp print quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Hide again
      template.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`cenova_nabidka_j_pufr_${serviceType}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Nepodařilo se vygenerovat PDF. Zkuste to prosím znovu.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    let payload = {};

    if (attachData) {
      // Prepare active extras list
      const activeExtrasList: string[] = [];
      if (extras.windows) activeExtrasList.push(`Mytí oken (${windowsCost} Kč)`);
      if (extras.carpet) activeExtrasList.push(`Tepování koberců (${carpetCost} Kč)`);
      if (extras.upholstery) activeExtrasList.push(`Čištění čalounění (${upholsteryCost} Kč)`);
      if (extras.construction) activeExtrasList.push(`Úklid po stavbě (${constructionCost} Kč)`);

      payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        serviceType,
        area,
        frequency: `${frequency} (${frequencyLabel})`,
        address,
        distance,
        transportPrice: transportCost,
        estimatedPriceMin: totalCalculatedMin,
        estimatedPriceMax: totalCalculatedMax,
        extras: activeExtrasList,
        message: formData.message,
      };
    } else {
      payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      };
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Při odesílání poptávky došlo k chybě.");
      }

      setFormSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Nepodařilo se navázat spojení se serverem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
    setFormSubmitted(false);
    setApiError(null);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 block font-semibold">
            Nezávazná Kalkulace & Poptávka
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight">
            Spočítejte si cenu úklidu <br />
            <span className="text-blue-gradient italic font-bold">a získejte nabídku na míru</span>
          </h2>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-6" />
        </div>

        {/* TOP ROW: Split 2-column layout (Calculator + Receipt) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* CALCULATOR PANEL (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 bg-white border border-slate-200/80 rounded-sm shadow-sm">
            <div>
              <h3 className="text-lg font-serif text-slate-900 mb-6 font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
                Chytrá kalkulačka parametrů
              </h3>

              <div className="flex flex-col gap-6">
                {/* Services Selector Tabs */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                    Typ objektu a prostor
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-sm border border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setServiceType("commercial")}
                      className={`py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        serviceType === "commercial"
                          ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Komerční úklid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType("residence")}
                      className={`py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        serviceType === "residence"
                          ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Rezidenční úklid</span>
                    </button>
                  </div>
                </div>

                {/* Area m2 slider */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                      Celková podlahová plocha
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={serviceType === "residence" ? 30 : 50}
                        max={serviceType === "residence" ? 400 : 2500}
                        value={area}
                        onChange={(e) => setArea(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-16 px-1.5 py-0.5 text-right font-sans font-bold text-slate-805 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-sm text-sm"
                      />
                      <span className="text-xs text-slate-500 font-bold">m²</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={serviceType === "residence" ? 30 : 50}
                    max={serviceType === "residence" ? 400 : 2500}
                    step={5}
                    value={area}
                    onChange={(e) => setArea(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none border border-slate-200"
                  />
                </div>

                {/* Frequency & Address row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Frequency selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                      Frekvence spolupráce
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="px-3 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-750 font-sans cursor-pointer shadow-sm"
                    >
                      {serviceType === "residence" ? (
                        <>
                          <option value="Jednorázově">Jednorázový generální úklid</option>
                          <option value="Pravidelně (1x týdně)">Pravidelně (1x týdně) -15%</option>
                          <option value="Pravidelně (1x za 14 dní)">Pravidelně (1x za 14 dní) -5%</option>
                        </>
                      ) : (
                        <>
                          <option value="Pravidelně (1-2x týdně)">Pravidelně (1-2x týdně)</option>
                          <option value="Pravidelně (3-5x týdně)">Pravidelně (3-5x týdně) -20%</option>
                          <option value="Jednorázově">Jednorázový generální úklid</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Address Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                      Město a ulice realizace
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => handleCalculateDistance(address)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                      placeholder="Např. Říčany, Husova"
                    />
                    <button
                      type="button"
                      disabled={isCalculatingDistance}
                      onClick={() => handleCalculateDistance(address)}
                      className="w-full py-2.5 bg-blue-royal text-white hover:bg-blue-700 disabled:opacity-60 disabled:bg-blue-600/70 rounded-sm font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 cursor-pointer"
                    >
                      {isCalculatingDistance ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                      <span>Spočítat dopravu</span>
                    </button>
                  </div>
                </div>

                {/* Distance alerts */}
                {distance !== undefined && (
                  <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100/50 px-3 py-2.5 rounded-sm flex justify-between items-center mt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Dojezdová vzdálenost z Prahy 10: <strong>{distance} km</strong>
                    </span>
                    <span className="font-semibold text-slate-700">Dopravné: +{transportCost} Kč</span>
                  </div>
                )}
                {distanceError && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100/50 px-3 py-2.5 rounded-sm flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{distanceError}</span>
                  </div>
                )}

                {/* Extras Checkboxes */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                    Doplňkové práce a služby
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { key: "windows", label: "Mytí oken", icon: <Droplet className="w-3.5 h-3.5" /> },
                      { key: "carpet", label: "Tepování", icon: <Layers className="w-3.5 h-3.5" /> },
                      { key: "upholstery", label: "Čalounění", icon: <Sparkles className="w-3.5 h-3.5" /> },
                      { key: "construction", label: "Po stavbě", icon: <Sparkles className="w-3.5 h-3.5" /> },
                    ].map((item) => {
                      const isActive = extras[item.key as keyof typeof extras];
                      return (
                        <div 
                          key={item.key}
                          onClick={() => setExtras({ ...extras, [item.key]: !isActive })}
                          className={`p-2.5 border rounded-sm flex flex-col gap-1.5 cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? "bg-blue-50/40 border-blue-500 shadow-sm" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-slate-500 ${isActive ? "text-blue-600" : ""}`}>
                              {item.icon}
                            </span>
                            <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm transition-colors ${isActive ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                              {isActive && <div className="w-1 h-1 bg-white rounded-full" />}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-750 font-sans tracking-wide leading-none">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECEIPT DETAILED BREAKDOWN (col-span-5) */}
          <div className="lg:col-span-5 p-6 md:p-8 bg-white border border-slate-200/80 rounded-sm shadow-sm relative overflow-hidden bg-receipt-pattern flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-serif text-slate-900 mb-6 font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
                Rozpis kalkulace a matematika ceny
              </h3>

              {/* Receipt Item List */}
              <div className="flex flex-col gap-4 font-mono text-sm text-slate-700">
                <AnimatePresence mode="popLayout">
                  {/* Base Cleaning rate */}
                  <motion.div 
                    key="base-rate"
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                  >
                    <div>
                      <span className="font-semibold block text-slate-800 font-sans">Základní sazba úklidu</span>
                      <span className="text-xs text-slate-400">{area} m² × {basePricePerSqm} Kč/m²</span>
                    </div>
                    <span className="font-bold text-slate-800">{rawBaseCleaning.toLocaleString("cs-CZ")} Kč</span>
                  </motion.div>

                  {/* Frequency modification */}
                  {frequencyMultiplier !== 1.0 && (
                    <motion.div 
                      key="frequency-adjust"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Frekvenční koeficient</span>
                        <span className="text-slate-400">{frequencyLabel}</span>
                      </div>
                      <span className={`font-bold ${frequencyDifference < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                        {frequencyDifference > 0 ? "+" : ""}{frequencyDifference.toLocaleString("cs-CZ")} Kč
                      </span>
                    </motion.div>
                  )}

                  {/* Transport */}
                  {distance !== undefined && (
                    <motion.div 
                      key="transport-cost"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Služba dopravy</span>
                        <span className="text-xs text-slate-400">Dojezd {distance} km (cesta tam i zpět × 7 Kč)</span>
                      </div>
                      <span className="font-bold text-slate-800">+{transportCost.toLocaleString("cs-CZ")} Kč</span>
                    </motion.div>
                  )}

                  {/* Extras Breakdown */}
                  {extras.windows && (
                    <motion.div 
                      key="windows-cost"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Doplněk: Mytí oken</span>
                        <span className="text-xs text-slate-400">Paušál + okna dle plochy {area} m²</span>
                      </div>
                      <span className="font-bold text-slate-800">+{windowsCost.toLocaleString("cs-CZ")} Kč</span>
                    </motion.div>
                  )}

                  {extras.carpet && (
                    <motion.div 
                      key="carpet-cost"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Doplněk: Tepování koberců</span>
                        <span className="text-xs text-slate-400">Čištění extraktorem ({area} m² × 15 Kč)</span>
                      </div>
                      <span className="font-bold text-slate-800">+{carpetCost.toLocaleString("cs-CZ")} Kč</span>
                    </motion.div>
                  )}

                  {extras.upholstery && (
                    <motion.div 
                      key="upholstery-cost"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Doplněk: Čištění čalounění</span>
                        <span className="text-xs text-slate-400">Čalounění, sedačka / matrace</span>
                      </div>
                      <span className="font-bold text-slate-800">+{upholsteryCost.toLocaleString("cs-CZ")} Kč</span>
                    </motion.div>
                  )}

                  {extras.construction && (
                    <motion.div 
                      key="construction-cost"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-start border-b border-slate-100 pb-2.5"
                    >
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Doplněk: Úklid po stavbě</span>
                        <span className="text-xs text-slate-400">Post-stavební hloubková chemie ({area} m² × 25 Kč)</span>
                      </div>
                      <span className="font-bold text-slate-800">+{constructionCost.toLocaleString("cs-CZ")} Kč</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Total indicator */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
              <div className="flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">
                    Výsledné orientační rozmezí ceny
                  </span>
                  <span className="text-3xl font-bold font-sans tracking-tight text-blue-600">
                    {totalCalculatedMin.toLocaleString("cs-CZ")} – {totalCalculatedMax.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans leading-relaxed mt-2 border-b border-slate-100 pb-3">
                  * Cena se odvíjí od reálné míry znečištění. Závazné nacenění vám potvrdíme po odeslání.
                </div>
                
                {/* Download PDF button */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="mt-3 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 border border-slate-250 rounded-sm font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                  ) : (
                    <Download className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                  )}
                  <span>Stáhnout PDF nabídku</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Centered Contact & Inquiry Form */}
        <div className="max-w-4xl mx-auto w-full mb-16">
          <div className="p-6 md:p-10 bg-white border border-slate-200/80 rounded-sm shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-serif text-slate-900 mb-6 font-bold border-b border-slate-100 pb-4">
              Nezávazná poptávka
            </h3>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-serif text-xl text-slate-900 mb-2 font-bold">
                    Poptávka odeslána
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
                    Děkujeme! Vaše poptávka byla úspěšně zpracována a odeslána na náš e-mail. J. Pufr se vám co nejdříve ozve zpět.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-500/30 rounded-sm text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                  >
                    Odeslat novou zprávu
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  {/* Toggle Calculator Data Connection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-250 rounded-sm gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div 
                        onClick={() => setAttachData(!attachData)}
                        className={`w-5 h-5 border flex items-center justify-center rounded-sm transition-colors cursor-pointer flex-shrink-0 ${
                          attachData ? "bg-blue-600 border-blue-600" : "bg-white border-slate-350"
                        }`}
                      >
                        {attachData && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800 block">Připojit data z kalkulačky k poptávce</span>
                        <span className="text-xs text-slate-400 block">Odešle nám kompletní navolené parametry pro rychlejší nacenění.</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {attachData ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-150 rounded-full text-xs text-blue-700 font-semibold">
                          <Link2 className="w-3.5 h-3.5" />
                          Propojeno ({totalCalculatedMin.toLocaleString("cs-CZ")} Kč)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-500 font-semibold">
                          <Link2Off className="w-3.5 h-3.5" />
                          Nepropojeno
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                        Celé jméno / Název firmy
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                        placeholder="Napište jméno..."
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                        Telefonní číslo
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                        placeholder="+420..."
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                        E-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                        placeholder="vytvor@priklad.cz"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                      Zpráva / upřesnění poptávky
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans resize-none shadow-sm"
                      placeholder="Napište nám jakékoliv doplňující informace nebo specifické požadavky..."
                    />
                  </div>

                  {/* Error display */}
                  {apiError && (
                    <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-royal text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Odesílám poptávku...</span>
                      </>
                    ) : (
                      <>
                        <span>Odeslat poptávku</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* QUICK CONTACT INFO ROW AT THE BOTTOM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full font-sans">
          <a href="tel:+420777777777" className="p-5 bg-white border border-slate-200/80 rounded-sm shadow-sm flex items-center gap-4 group hover:border-blue-500/35 transition-all duration-300">
            <span className="w-10 h-10 rounded-sm bg-blue-50/50 border border-blue-100/50 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-500 transition-all"><Phone className="w-4 h-4 text-blue-600" /></span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Zavolejte nám</span>
              <span className="text-sm font-semibold text-slate-750 group-hover:text-blue-600 transition-colors">+420 777 777 777</span>
            </div>
          </a>
          <a href="mailto:info@jpufr.cz" className="p-5 bg-white border border-slate-200/80 rounded-sm shadow-sm flex items-center gap-4 group hover:border-blue-500/35 transition-all duration-300">
            <span className="w-10 h-10 rounded-sm bg-blue-50/50 border border-blue-100/50 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-500 transition-all"><Mail className="w-4 h-4 text-blue-600" /></span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Napište nám</span>
              <span className="text-sm font-semibold text-slate-750 group-hover:text-blue-600 transition-colors">info@jpufr.cz</span>
            </div>
          </a>
          <div className="p-5 bg-white border border-slate-200/80 rounded-sm shadow-sm flex items-center gap-4">
            <span className="w-10 h-10 rounded-sm bg-blue-50/50 border border-blue-100/50 flex items-center justify-center"><Clock className="w-4 h-4 text-blue-600" /></span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Provozní doba</span>
              <span className="text-sm font-semibold text-slate-750">Po - So: 8:00 - 18:00</span>
            </div>
          </div>
        </div>

      </div>

      {/* HIDDEN PREMIUM PDF QUOTATION A4 TEMPLATE */}
      <div 
        id="pdf-quote-template" 
        style={{ 
          display: "none", 
          position: "absolute", 
          left: "-9999px", 
          top: "-9999px", 
          width: "794px", 
          padding: "50px 60px",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          color: "#1e293b",
          boxSizing: "border-box"
        }}
      >
        {/* PDF Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontFamily: "serif", fontWeight: "bold", color: "#0f172a", margin: "0 0 5px 0", letterSpacing: "1px" }}>J. PUFR</h1>
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#2563eb", fontWeight: "bold" }}>úklidové služby</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: "16px", color: "#2563eb", fontWeight: "bold", margin: "0 0 5px 0" }}>ORIENTAČNÍ CENOVÁ NABÍDKA</h2>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Číslo: CP-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}<br />
              Datum: {new Date().toLocaleDateString("cs-CZ")}
            </span>
          </div>
        </div>

        {/* Supplier & Client Address blocks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div style={{ backgroundColor: "#f8fafc", padding: "20px", border: "1px solid #f1f5f9", borderRadius: "2px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "bold", margin: "0 0 10px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px" }}>POSKYTOVATEL SLUŽEB</h3>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a", margin: "0 0 5px 0" }}>J. Pufr úklidové služby</p>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0 0 3px 0" }}>Průmyslová 1234, 102 00 Praha 10</p>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0" }}>E-mail: info@jpufr.cz | Tel: +420 777 777 777</p>
          </div>
          <div style={{ backgroundColor: "#f8fafc", padding: "20px", border: "1px solid #f1f5f9", borderRadius: "2px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "bold", margin: "0 0 10px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px" }}>SPECIFIKACE POPTÁVKY</h3>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0 0 5px 0" }}>
              <strong>Typ úklidu:</strong> {serviceType === "residence" ? "Rezidenční úklid (domácnost)" : "Komerční úklid (firma)"}
            </p>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0 0 5px 0" }}>
              <strong>Celková plocha:</strong> {area} m²
            </p>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0 0 5px 0" }}>
              <strong>Frekvence:</strong> {frequency}
            </p>
            <p style={{ fontSize: "12px", color: "#334155", margin: "0" }}>
              <strong>Místo realizace:</strong> {address || "Neuvedeno"}
            </p>
          </div>
        </div>

        {/* Pricing Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
              <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: "bold", color: "#475569" }}>POLOŽKA / ZADÁNÍ</th>
              <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: "bold", color: "#475569" }}>VÝPOČET / POPIS</th>
              <th style={{ textAlign: "right", padding: "12px 10px", fontWeight: "bold", color: "#475569" }}>CENA (orientační)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Základní úklid prostor</td>
              <td style={{ padding: "12px 10px", color: "#64748b" }}>{area} m² × {basePricePerSqm} Kč/m²</td>
              <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{rawBaseCleaning.toLocaleString("cs-CZ")} Kč</td>
            </tr>
            {frequencyMultiplier !== 1.0 && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Frekvenční koeficient</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>{frequencyLabel}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold", color: frequencyDifference < 0 ? "#10b981" : "#d97706" }}>
                  {frequencyDifference > 0 ? "+" : ""}{frequencyDifference.toLocaleString("cs-CZ")} Kč
                </td>
              </tr>
            )}
            {distance !== undefined && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Dopravné na místo realizace</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>Dojezd {distance} km × 2 (tam i zpět) × 7 Kč/km</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{transportCost.toLocaleString("cs-CZ")} Kč</td>
              </tr>
            )}
            {extras.windows && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Mytí oken a prosklených ploch</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>Paušál + okna dle podlahové plochy</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{windowsCost.toLocaleString("cs-CZ")} Kč</td>
              </tr>
            )}
            {extras.carpet && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Hloubkové tepování koberců</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>Plocha {area} m² × 15 Kč/m²</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{carpetCost.toLocaleString("cs-CZ")} Kč</td>
              </tr>
            )}
            {extras.upholstery && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Čištění čalounění a matrací</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>Paušální sazba za tepování čalounění</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{upholsteryCost.toLocaleString("cs-CZ")} Kč</td>
              </tr>
            )}
            {extras.construction && (
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#0f172a" }}>Úklid po stavbě a malování</td>
                <td style={{ padding: "12px 10px", color: "#64748b" }}>Čištění post-stavebního prachu ({area} m² × 25 Kč/m²)</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "bold" }}>{constructionCost.toLocaleString("cs-CZ")} Kč</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pricing Summary box */}
        <div style={{ border: "2px solid #bfdbfe", backgroundColor: "#eff6ff", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px", borderRadius: "2px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "#2563eb", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px" }}>Celková orientační cena (Rozsah)</span>
            <h4 style={{ fontSize: "24px", color: "#1e3a8a", margin: "5px 0 0 0", fontWeight: "bold" }}>
              {totalCalculatedMin.toLocaleString("cs-CZ")} – {totalCalculatedMax.toLocaleString("cs-CZ")} Kč
            </h4>
          </div>
          <div style={{ textAlign: "right", fontSize: "11px", color: "#475569", maxWidth: "250px" }}>
            * Uvedené ceny jsou pouze orientační. Konečná cena bude potvrzena po osobní prohlídce či detailní specifikaci objektu.
          </div>
        </div>

        {/* PDF Footer contacts */}
        <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "20px", fontSize: "11px", color: "#64748b", textAlign: "center", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 5px 0" }}>Děkujeme za Váš zájem a těšíme se na případnou spolupráci.</p>
          <p style={{ margin: "0", fontWeight: "bold", color: "#475569" }}>
            J. Pufr úklidové služby | +420 777 777 777 | info@jpufr.cz | www.jpufr.cz
          </p>
        </div>
      </div>
    </section>
  );
}
