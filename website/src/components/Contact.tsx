"use client";

import { useState, useEffect } from "react";
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
  Map, 
  ArrowLeft, 
  Loader2,
  AlertCircle
} from "lucide-react";

export default function Contact() {
  // Navigation / Step state
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Configuration State (Step 1)
  const [serviceType, setServiceType] = useState<"residence" | "commercial">("commercial");
  const [area, setArea] = useState(100);
  const [frequency, setFrequency] = useState("Pravidelně (1-2x týdně)");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  
  // Selected extras
  const [extras, setExtras] = useState({
    windows: false,
    carpet: false,
    upholstery: false,
    construction: false,
  });

  // Contact details (Step 2)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

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
      // Scroll to form smoothly
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

  // Geocode and calculate driving distance from base (Průmyslová, Praha 10: 50.0617, 14.5312)
  const handleCalculateDistance = async (addressStr: string) => {
    if (!addressStr || addressStr.trim().length < 5) {
      setDistanceError("Zadejte prosím úplnou adresu (např. ulice, město).");
      return;
    }
    
    setIsCalculatingDistance(true);
    setDistanceError(null);
    
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
        // Fallback: Haversine distance * 1.3
        const straightLineDist = calculateHaversineDistance(baseLat, baseLon, destLat, destLon);
        const estimatedRoadDistKm = Math.round(straightLineDist * 1.3 * 10) / 10;
        setDistance(estimatedRoadDistKm);
      }
    } catch (err: any) {
      console.error(err);
      setDistanceError("Nepodařilo se automaticky spočítat trasu. Zkuste upřesnit adresu nebo pokračujte.");
      setDistance(undefined);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Pricing calculations
  const calculateEstimatedPrice = () => {
    let basePricePerSqm = serviceType === "residence" ? 24 : 19;
    
    // Frequency multipliers
    let multiplier = 1.0;
    if (serviceType === "residence") {
      if (frequency === "Jednorázově") multiplier = 1.3;
      if (frequency === "Pravidelně (1x týdně)") multiplier = 0.85; // 15% discount
      if (frequency === "Pravidelně (1x za 14 dní)") multiplier = 0.95; // 5% discount
    } else {
      if (frequency === "Jednorázově") multiplier = 1.25;
      if (frequency === "Pravidelně (1-2x týdně)") multiplier = 0.9;
      if (frequency === "Pravidelně (3-5x týdně)") multiplier = 0.8; // 20% discount
    }

    let estimatedPrice = area * basePricePerSqm * multiplier;

    // Transport calculation (7 CZK/km both directions, i.e. 14 CZK per distance km)
    const transportCost = distance ? Math.round(distance * 7 * 2) : 0;

    // Extras pricing
    let extrasCost = 0;
    if (extras.windows) {
      // 1200 / 1800 flat base + 5 / 4 CZK per sqm
      extrasCost += serviceType === "residence" ? 1200 + area * 5 : 1800 + area * 4;
    }
    if (extras.carpet) {
      // 15 CZK per sqm
      extrasCost += area * 15;
    }
    if (extras.upholstery) {
      extrasCost += 1500;
    }
    if (extras.construction) {
      // 25 CZK per sqm
      extrasCost += area * 25;
    }

    const minPrice = Math.round(estimatedPrice + extrasCost + transportCost);
    // Add 25% margin for maximum estimated range
    const maxPrice = Math.round(minPrice * 1.25);

    return {
      min: minPrice,
      max: maxPrice,
      transport: transportCost,
    };
  };

  const { min: estMin, max: estMax, transport: estTransport } = calculateEstimatedPrice();

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    // Prepare active extras list
    const activeExtrasList: string[] = [];
    if (extras.windows) activeExtrasList.push("Mytí oken a prosklených ploch");
    if (extras.carpet) activeExtrasList.push("Hloubkové tepování koberců");
    if (extras.upholstery) activeExtrasList.push("Čištění čalounění a matrací");
    if (extras.construction) activeExtrasList.push("Úklid po stavbě / malování");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      serviceType,
      area,
      frequency,
      address,
      distance,
      transportPrice: estTransport,
      estimatedPriceMin: estMin,
      estimatedPriceMax: estMax,
      extras: activeExtrasList,
      message: formData.message,
    };

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
    setExtras({
      windows: false,
      carpet: false,
      upholstery: false,
      construction: false,
    });
    setArea(100);
    setAddress("");
    setDistance(undefined);
    setStep(1);
    setFormSubmitted(false);
    setApiError(null);
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
                Nezávazná poptávka
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight mb-8">
                Napište nám a <br />
                <span className="text-blue-gradient italic font-bold">získejte cenovou nabídku</span>
              </h2>
              <p className="text-slate-700 font-normal leading-relaxed mb-12 max-w-md">
                Vyzkoušejte náš interaktivní konfigurátor poptávky. Spočítá vám orientační cenu úklidu i dopravy a pošle nám kompletní zadání, abychom pro vás mohli obratem připravit nabídku na míru.
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

          {/* Right Column: Interactive Configurator */}
          <div className="lg:col-span-7 w-full">
            <div className="p-6 md:p-10 bg-slate-50/50 border border-slate-150 rounded-sm shadow-sm relative overflow-hidden">
              
              {/* Stepper indicator */}
              {!formSubmitted && (
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}>
                      1
                    </span>
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Konfigurace úklidu</span>
                  </div>
                  <div className="w-12 h-[1px] bg-slate-200 flex-grow mx-4" />
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                      2
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontaktní údaje</span>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  // Step Success
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-serif text-2xl text-slate-900 mb-3 font-semibold">
                      Poptávka byla odeslána
                    </h3>
                    <p className="text-sm text-slate-700 font-normal max-w-sm mb-8 leading-relaxed">
                      Děkujeme za vaši poptávku. J. Pufr vás bude kontaktovat na zadaný e-mail nebo telefon pro upřesnění detailů a vypracování závazné nabídky.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-slate-50 border border-slate-100 text-slate-700 hover:text-blue-600 hover:border-blue-500/30 rounded-sm text-xs uppercase tracking-widest font-medium transition-colors"
                    >
                      Odeslat novou poptávku
                    </button>
                  </motion.div>
                ) : step === 1 ? (
                  // Step 1: Configuration Form
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Services Selector Tabs */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Typ prostor
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-sm border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setServiceType("commercial")}
                          className={`py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center justify-center gap-2 ${
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
                          className={`py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center justify-center gap-2 ${
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
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                          Plocha objektu
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={serviceType === "residence" ? 30 : 50}
                            max={serviceType === "residence" ? 400 : 2500}
                            value={area}
                            onChange={(e) => setArea(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-16 px-1.5 py-0.5 text-right font-sans font-bold text-slate-800 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-sm text-sm"
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
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Frequency selector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Frekvence úklidu
                      </label>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-750 font-sans cursor-pointer shadow-sm"
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

                    {/* Address Geocoding with automatic Distance */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Adresa realizace (Pro výpočet dopravy)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onBlur={() => handleCalculateDistance(address)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:outline-none rounded-sm transition-colors text-sm text-slate-800 font-sans shadow-sm"
                            placeholder="Ulice č.p., Město"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isCalculatingDistance || address.trim().length < 5}
                          onClick={() => handleCalculateDistance(address)}
                          className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 disabled:opacity-50 disabled:bg-slate-100 rounded-sm font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          {isCalculatingDistance ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Map className="w-3.5 h-3.5" />
                          )}
                          <span>Spočítat</span>
                        </button>
                      </div>

                      {/* Distance Feedback */}
                      {distance !== undefined && (
                        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-sm flex justify-between items-center mt-1">
                          <span>Vzdálenost z Prahy 10: <strong>{distance} km</strong></span>
                          <span>Doprava: <strong>{estTransport} Kč</strong> (7,- Kč/km)</span>
                        </div>
                      )}
                      {distanceError && (
                        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-sm flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{distanceError}</span>
                        </div>
                      )}
                    </div>

                    {/* Extras Checkboxes */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Doplňkové služby
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Windows */}
                        <div 
                          onClick={() => setExtras({ ...extras, windows: !extras.windows })}
                          className={`p-3 border rounded-sm flex items-center gap-2.5 cursor-pointer transition-all ${
                            extras.windows 
                              ? "bg-blue-50/50 border-blue-500" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${extras.windows ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                            {extras.windows && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Droplet className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold text-slate-750">Mytí oken</span>
                          </div>
                        </div>

                        {/* Carpet */}
                        <div 
                          onClick={() => setExtras({ ...extras, carpet: !extras.carpet })}
                          className={`p-3 border rounded-sm flex items-center gap-2.5 cursor-pointer transition-all ${
                            extras.carpet 
                              ? "bg-blue-50/50 border-blue-500" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${extras.carpet ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                            {extras.carpet && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold text-slate-750">Tepování koberců</span>
                          </div>
                        </div>

                        {/* Upholstery */}
                        <div 
                          onClick={() => setExtras({ ...extras, upholstery: !extras.upholstery })}
                          className={`p-3 border rounded-sm flex items-center gap-2.5 cursor-pointer transition-all ${
                            extras.upholstery 
                              ? "bg-blue-50/50 border-blue-500" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${extras.upholstery ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                            {extras.upholstery && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold text-slate-750">Čištění čalounění</span>
                          </div>
                        </div>

                        {/* Construction Cleanup */}
                        <div 
                          onClick={() => setExtras({ ...extras, construction: !extras.construction })}
                          className={`p-3 border rounded-sm flex items-center gap-2.5 cursor-pointer transition-all ${
                            extras.construction 
                              ? "bg-blue-50/50 border-blue-500" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${extras.construction ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"}`}>
                            {extras.construction && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold text-slate-750">Úklid po stavbě</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Indicator Panel */}
                    <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-sm mt-2 flex flex-col md:flex-row justify-between items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">
                          Orientační kalkulace ceny
                        </span>
                        <span className="text-2xl font-bold font-sans tracking-tight text-slate-800">
                          {estMin.toLocaleString("cs-CZ")} – {estMax.toLocaleString("cs-CZ")} Kč
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full md:w-auto px-6 py-3 bg-blue-royal text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Pokračovat</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // Step 2: Contact Form Details
                  <motion.form
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                  >
                    {/* Summary badge */}
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-sm text-xs text-slate-800 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Vybrané služby:</span>
                        <span className="font-semibold text-blue-700">
                          {serviceType === "residence" ? "Rezidenční úklid" : "Komerční úklid"} ({area} m²)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Frekvence:</span>
                        <span className="font-semibold text-slate-700">{frequency}</span>
                      </div>
                      {distance !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Doprava ({distance} km):</span>
                          <span className="font-semibold text-slate-750">{estTransport} Kč</span>
                        </div>
                      )}
                      <div className="h-[1px] bg-slate-200/80 my-1" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Orientační rozsah ceny:</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {estMin.toLocaleString("cs-CZ")} – {estMax.toLocaleString("cs-CZ")} Kč
                        </span>
                      </div>
                    </div>

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

                    {/* Contact Details Grid */}
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

                    {/* Message / Details */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
                        Poznámka k poptávce (specifikace nemovitosti, přání)
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

                    {/* Action buttons footer */}
                    <div className="flex gap-4 items-center mt-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-sm font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Zpět</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-grow py-3.5 bg-blue-royal text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Odesílám...</span>
                          </>
                        ) : (
                          <>
                            <span>Odeslat poptávku</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
