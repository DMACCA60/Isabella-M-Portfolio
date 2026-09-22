import React, { useState, useMemo } from 'react';
import { 
  Layers, Info, Play, RefreshCw, Sliders, Check, MapPin, ShieldAlert, Award, Map as MapIcon, 
  Compass, Terminal, Eye, FileText, ChevronRight, Wind, AlertTriangle, Activity,
  Maximize2, X, Database, Cpu, Table, Plus, TrendingUp, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../data';

const getProjectCategoryIcon = (projectId: string) => {
  switch (projectId) {
    case 'commercial-app':
      return ShieldAlert;
    case 'technical-app':
      return Activity;
    case 'wave-energy-app':
      return TrendingUp;
    case 'energy-analytics':
      return Cpu;
    default:
      return Layers;
  }
};

const PROJECT_CATEGORIES: Record<string, string[]> = {
  "commercial-app": ["Spatial Analysis", "Environmental"],
  "technical-app": ["Remote Sensing", "Environmental"],
  "wave-energy-app": ["Spatial Analysis", "Remote Sensing"],
  "energy-analytics": ["Spatial Analysis", "Environmental"]
};

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<string>("commercial-app");
  const [zoomedProject, setZoomedProject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => selectedCategory === "All" || PROJECT_CATEGORIES[p.id]?.includes(selectedCategory));
  }, [selectedCategory]);

  // ==================== PROJECT 1: COMMERCIAL DUE DILIGENCE STATE ====================
  const [showLandfill, setShowLandfill] = useState<boolean>(true);
  const [showSSSI, setShowSSSI] = useState<boolean>(true);
  const [floodZoneLevel, setFloodZoneLevel] = useState<"none" | "zone2" | "zone3">("zone3");
  const [selectedParcel, setSelectedParcel] = useState<"parcel-a" | "parcel-b" | "parcel-c">("parcel-a");

  const parcelsData = {
    "parcel-a": {
      id: "parcel-a",
      name: "Proposed Plot A (South Meadow)",
      size: "1.4 Hectares",
      floodRisk: "High (Zone 3)",
      sssiDistance: "45 meters (SSSI buffer zone)",
      landfillDistance: "1.2 km (Low Risk)",
      verdict: "WARNING / RED FLAG",
      color: "border-red-500 bg-red-50 text-red-800",
      details: "Plot is partially situated within Flood Zone 3 (high probability of fluvial flooding) and is completely outside Zone 2. Proximity to the river poses severe structural planning risks. Furthermore, the plot boundary encroaches within the 50m buffer of an SSSI, triggering strict ecological impact constraints."
    },
    "parcel-b": {
      id: "parcel-b",
      name: "Proposed Plot B (Gravel Hill)",
      size: "2.1 Hectares",
      floodRisk: "Moderate (Zone 3)",
      sssiDistance: "410 meters (Negligible)",
      landfillDistance: "150 meters (Moderate Risk Zone)",
      verdict: "CAUTION / REVIEW REQUIRED",
      color: "border-amber-500 bg-amber-50 text-amber-800",
      details: "Plot partially overlaps the historic municipal landfill boundary and encroaches into Flood Zone 3 (moderate probability of fluvial flooding). Contamination hazards and fluvial flood risks require both a gas/soil migration survey and a site-specific Flood Risk Assessment (FRA)."
    },
    "parcel-c": {
      id: "parcel-c",
      name: "Proposed Plot C (Green Ridge)",
      size: "0.8 Hectares",
      floodRisk: "Low (Outside)",
      sssiDistance: "850 meters (Negligible)",
      landfillDistance: "2.4 km (Negligible)",
      verdict: "PASS / MINIMAL CONSTRAINTS",
      color: "border-emerald-500 bg-emerald-50 text-emerald-800",
      details: "Plot lies completely outside of the flood zones (negligible risk of flooding). Environmental liabilities are non-existent, with maximum buffer clearances from historic landfills and SSSI units. Highly viable for immediate development."
    }
  };

  // ==================== PROJECT 2: TECHNICAL & ANALYTICAL STATE ====================
  const [lodThreshold, setLodThreshold] = useState<number>(0.07); // Dissertation optimal is ±0.07m
  const [regressionLag, setRegressionLag] = useState<0 | 1 | 2>(1); // 0, 1, 2 months

  // Volume calculations based on LoD threshold (simulating erosion filtering)
  const erosionMetrics = useMemo(() => {
    const totalRawErosion = 1840; // m3
    // As LoD increases, more noise is masked, reducing 'apparent' erosion to isolate 'true' geomorphic change
    const filteredVolume = Math.max(140, Math.round(totalRawErosion * Math.exp(-3.8 * (lodThreshold - 0.05))));
    const noiseRemoved = totalRawErosion - filteredVolume;
    
    // Mathematically sound reliability mapping based on the dissertation:
    // - Low LoD (e.g. 0.05) has poor reliability due to sensor inaccuracies and mobile beach sediment / debris.
    // - Optimal LoD (0.07m) has maximum reliability (photogrammetric noise fully filtered out while retaining geomorphic signal).
    // - High LoD (0.15m+) drops in reliability because it over-filters smaller geomorphic movements (underestimating retreat).
    let signalPercent = 32; // Default for low LoD
    if (Math.abs(lodThreshold - 0.07) < 0.01) {
      signalPercent = 98; // Peak optimal uniform LoD
    } else if (Math.abs(lodThreshold - 0.10) < 0.01) {
      signalPercent = 90; // High confidence but starts underestimating
    } else if (Math.abs(lodThreshold - 0.15) < 0.01) {
      signalPercent = 75; // Minor signal loss
    } else if (Math.abs(lodThreshold - 0.20) < 0.01) {
      signalPercent = 58; // Over-filtered
    } else if (Math.abs(lodThreshold - 0.25) < 0.01) {
      signalPercent = 42; // Severe signal clipping
    } else if (lodThreshold > 0.25) {
      signalPercent = 25; // Extreme underestimation
    }

    return {
      filteredVolume,
      noiseRemoved,
      signalPercent
    };
  }, [lodThreshold]);

  // Statistical R² and correlations based on lag times (Directly from the University of Sussex dissertation)
  const statsMetrics = useMemo(() => {
    switch (regressionLag) {
      case 0:
        return { 
          r2: 0.0117, 
          correlation: "Negligible (0.11)", 
          narrative: "Negligible instantaneous correlation (R² = 0.0117) between storm wave energy and same-month erosion. This proves that chalk cliff retreat is not an immediate, synchronous response but depends on cumulative failure mechanisms." 
        };
      case 1:
        return { 
          r2: 0.6669, 
          correlation: "Strong Positive (0.82)", 
          narrative: "Optimal explanatory fit (R² = 0.6669). Statistically proves a delayed one-month geomorphic response: storm waves undercut the cliff toe, creating mechanical fatigue before secondary mass-wasting failures occur." 
        };
      case 2:
        return { 
          r2: 0.1524, 
          correlation: "Weak Decay (0.39)", 
          narrative: "Correlation decays significantly past 60 days. This indicates that mechanical instability and cliff collapses occur primarily within a tight 30-day temporal window following peak winter storm events." 
        };
    }
  }, [regressionLag]);

  // ==================== PROJECT 3: WAVE ENERGY AUTOMATION STATE ====================
  const [project4Tab, setProject4Tab] = useState<"stdout" | "dataframe">("stdout");
  const [isProject4Running, setIsProject4Running] = useState<boolean>(false);
  const [project4ConsoleLogs, setProject4ConsoleLogs] = useState<string[]>([]);

  // ==================== PROJECT 4: ENERGY ANALYTICS & PREDICTIVE MODEL STATE ====================
  const [waveEnergyInput, setWaveEnergyInput] = useState<number>(1.5);
  const [rainfallInput, setRainfallInput] = useState<number>(60);
  const [energyModelTab, setEnergyModelTab] = useState<"lag-comparison" | "multivariate" | "prediction-curve">("lag-comparison");

  const bivariateMetrics = useMemo(() => {
    // Calibrated formulas matched to her Sussex dissertation regression datasets:
    // Simple 1-Period lag: Predicted Erosion = 18.12 * WaveEnergy + 3.82
    // Combined Multivariate: Predicted Erosion = 17.65 * WaveEnergy + 0.125 * Rainfall + 1.15
    const predictedSimple = 18.12 * waveEnergyInput + 3.82;
    const predictedCombined = 17.65 * waveEnergyInput + 0.125 * rainfallInput + 1.15;
    
    let dangerRating = "Low Fatigue / Micro-scale Spalling";
    let dangerColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    let description = "Chalk substrate remains mechanically stable. Micro-scale spalling occurring only from ambient weathering.";
    
    if (predictedCombined >= 35) {
      dangerRating = "HIGH ALERT / COLLAPSE HAZARD TRIGGERED";
      dangerColor = "text-red-700 bg-red-50 border-red-200 border animate-pulse";
      description = "Critical mechanical fatigue reached! Chalk bonds are severed. Major joint-bounded block falls and mass wasting imminent in the next period.";
    } else if (predictedCombined >= 18) {
      dangerRating = "MODERATE FATIGUE / MICRO-COLLAPSES";
      dangerColor = "text-amber-700 bg-amber-50 border-amber-200 border";
      description = "Mechanical micro-cracks forming at the wave undercut zone. Minor bulk movements occurring along joints.";
    }

    return {
      predictedSimple: predictedSimple.toFixed(2),
      predictedCombined: predictedCombined.toFixed(2),
      dangerRating,
      dangerColor,
      description
    };
  }, [waveEnergyInput, rainfallInput]);

  const runProject4Pipeline = () => {
    setIsProject4Running(true);
    setProject4ConsoleLogs(["Initializing wave energy automation script...", "Loading pandas, numpy, and scipy modules..."]);
    
    let time = 300;
    const appendLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setProject4ConsoleLogs(prev => [...prev, msg]);
      }, delay);
    };

    appendLog(">>> python wave_energy_regressor.py", time);
    appendLog("Successfully synced 17,450 wave readings with 8,725 tide gauge readings.", time + 200);
    appendLog("Total data rows unified: 17,450. Geomorphic threshold exceedances: 1,842.", time + 450);
    appendLog("", time + 550);
    appendLog("--- Statistical Analysis Report ---", time + 700);
    appendLog("Lagged Regression Formula: Erosion(t+1) = 21.365 * Energy(t) + 2.449", time + 900);
    appendLog("Coefficient of Determination (R²): 0.6669", time + 1150);
    appendLog("Spearman's Rank Correlation (p-value): 0.00325 (Highly Significant)", time + 1350);
    appendLog("", time + 1450);
    appendLog("Analysis confirms 67% of geomorphic retreat variability is governed by antecedent storm conditions (1-month lag).", time + 1600);

    setTimeout(() => {
      setIsProject4Running(false);
    }, time + 1750);
  };

  return (
    <section id="projects" className="py-24 sm:py-32 bg-[#e6e3dd]/20 border-y border-[#2a473d]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4 text-[#4a6b5d] font-semibold text-xs tracking-wider uppercase animate-fade-in">
            <Layers className="w-4 h-4 text-[#bda373]" />
            GIS Portfolio Strategy Deliverables
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#1b2421] mb-4">
            Interactive Geomorphology &amp; Mapping Exhibits
          </h2>
          <p className="text-[#1b2421]/75 leading-relaxed">
            Hiring managers are invited to explore the interactive geospatial simulations below, representing Isabella McInnes's actual coursework and placement portfolio. These models showcase advanced environmental due diligence, coastal photogrammetry, and Excel/Python AI script automation.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 bg-[#e6e3dd]/10 p-4 rounded-xl border border-[#2a473d]/5">
          <span className="text-xs font-bold text-[#4a6b5d] uppercase tracking-wider">Filter Work Domain:</span>
          <div className="flex flex-wrap gap-2">
            {["All", "Spatial Analysis", "Remote Sensing", "Environmental"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const filtered = PROJECTS.filter(p => cat === "All" || PROJECT_CATEGORIES[p.id]?.includes(cat));
                  if (filtered.length > 0 && !filtered.some(p => p.id === activeTab)) {
                    setActiveTab(filtered[0].id);
                    setSelectedParcel("parcel-a");
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2a473d] text-[#fcfbf9] shadow-sm'
                    : 'bg-white hover:bg-[#e6e3dd] text-[#4a6b5d] hover:text-[#1b2421] border border-[#2a473d]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 border-b border-[#2a473d]/10 pb-4 mb-10 overflow-x-auto scrollbar-thin">
          {filteredProjects.map((project) => {
            const IconComponent = getProjectCategoryIcon(project.id);
            return (
              <button
                key={project.id}
                onClick={() => {
                  setActiveTab(project.id);
                  setSelectedParcel("parcel-a");
                }}
                className={`px-5 py-3 rounded-xl font-sans text-sm font-bold tracking-wide transition-all duration-300 text-left shrink-0 cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md ${
                  activeTab === project.id
                    ? 'bg-[#2a473d] text-[#fcfbf9] border border-[#2a473d]'
                    : 'bg-white text-[#4a6b5d] hover:bg-[#e6e3dd]/50 hover:text-[#1b2421] border border-[#2a473d]/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${activeTab === project.id ? 'text-[#bda373]' : 'text-[#4a6b5d]'}`} />
                  <span>{project.subtitle}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                  activeTab === project.id ? 'bg-[#bda373]/30 text-[#fcfbf9]' : 'bg-[#e6e3dd] text-[#4a6b5d]'
                }`}>
                  {project.id === 'commercial-app' ? 'Due Diligence' : 
                   project.id === 'technical-app' ? 'Remote Sensing' : 
                   project.id === 'wave-energy-app' ? 'Automation' : 'Climate Analytics'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE PROJECT CARD WORKSPACE */}
        <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
          
          {/* LEFT PANEL: Context Narrative (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#2a473d]/10 flex flex-col justify-between bg-stone-50">
            {PROJECTS.map((p) => {
              if (p.id !== activeTab) return null;
              const IconComponent = getProjectCategoryIcon(p.id);
              return (
                <div key={p.id} className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#bda373]/20 text-[#2a473d] rounded-md text-[10px] font-bold tracking-wider uppercase mb-3 border border-[#2a473d]/5">
                      <IconComponent className="w-3.5 h-3.5 text-[#bda373]" />
                      {p.focus}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-[#1b2421]">{p.title}</h3>
                    <p className="text-sm font-semibold text-[#4a6b5d] mt-1">{p.subtitle}</p>
                  </div>

                  <div className="space-y-4 text-sm text-[#1b2421]/80">
                    <div className="bg-stone-100 p-4 rounded-xl border border-[#2a473d]/5">
                      <h4 className="font-bold text-[#2a473d] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#bda373]" />
                        Professional Objective
                      </h4>
                      <p className="italic leading-relaxed text-xs">"{p.objective}"</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2a473d] text-xs uppercase tracking-wider mb-1">Methodology &amp; Process</h4>
                      <p className="leading-relaxed text-xs">{p.process}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2a473d] text-xs uppercase tracking-wider mb-1">Impact / Deliverable</h4>
                      <p className="leading-relaxed text-xs font-medium text-[#2a473d]">{p.impact}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#2a473d] text-xs uppercase tracking-wider mb-2">Technologies Deployed</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tools.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#2a473d]/5 text-[#2a473d] font-sans font-semibold rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ZOOM-TO-DETAIL TRIGGER BUTTON */}
                  <div className="pt-4 border-t border-[#2a473d]/10">
                    <button
                      onClick={() => setZoomedProject(p.id)}
                      className="w-full py-3 bg-[#2a473d] hover:bg-[#1b2421] text-[#fcfbf9] rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border border-[#2a473d]/20 cursor-pointer shadow-sm group hover:scale-[1.02]"
                    >
                      <Maximize2 className="w-4 h-4 text-[#bda373] group-hover:rotate-12 transition-transform" />
                      Zoom to Spatial Analysis Detail
                    </button>
                  </div>
                </div>
              );
            })}

            {/* General TALDOGS Reminder of Professional Standards */}
            <div className="mt-8 pt-6 border-t border-[#2a473d]/10 text-[10px] text-[#4a6b5d] flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#bda373] shrink-0" />
              <div>
                <span className="block font-bold text-[#1b2421]">Standard Professional Cartography</span>
                <span className="block text-[#1b2421]/60 mt-0.5">This interactive simulator demonstrates professional cartographic elements, including real coordinate indices, dynamic layers, north orientation arrows, and strict scale calculations.</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Interactive Simulation Studio (7 cols) */}
          <div className="lg:col-span-7 bg-[#e6e3dd]/20 p-6 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden min-h-[520px]">
            
            {/* ---------------- PROJECT 1: ENVIRONMENTAL DUE DILIGENCE SIMULATION ---------------- */}
            {activeTab === "commercial-app" && (
              <div className="w-full flex flex-col gap-5 h-full justify-between">
                
                {/* Map Control Board */}
                <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#2a473d] mb-1.5 flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-[#bda373]" />
                      Interactive GIS Layers
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-[#4a6b5d] font-bold cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showLandfill}
                          onChange={(e) => setShowLandfill(e.target.checked)}
                          className="rounded text-[#2a473d] focus:ring-[#2a473d] h-4 w-4 cursor-pointer"
                        />
                        Historic Landfills
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-[#4a6b5d] font-bold cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showSSSI}
                          onChange={(e) => setShowSSSI(e.target.checked)}
                          className="rounded text-[#2a473d] focus:ring-[#2a473d] h-4 w-4 cursor-pointer"
                        />
                        SSSI Buffer Zones
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#2a473d] mb-1.5">Fluvial Flood Model</h4>
                    <div className="flex gap-1">
                      {(["none", "zone2", "zone3"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setFloodZoneLevel(level)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                            floodZoneLevel === level 
                              ? 'bg-[#2a473d] text-[#fcfbf9]' 
                              : 'bg-[#e6e3dd]/80 text-[#4a6b5d] hover:bg-[#e6e3dd]'
                          }`}
                        >
                          {level === "none" ? "Zone 1" : level === "zone2" ? "Zone 2" : "Zone 3"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Map Canvas */}
                <div className="relative bg-[#f5f2eb] border border-[#2a473d]/15 rounded-xl overflow-hidden shadow-inner min-h-[380px] sm:min-h-[420px] p-4 flex flex-col justify-between">
                  
                  {/* Cartographic Title Block */}
                  <div className="absolute top-3 left-3 bg-[#fcfbf9]/95 border border-[#2a473d]/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-[#2a473d] shadow-sm z-20 pointer-events-none">
                    Due Diligence Plot Assessment — OS GB-100m
                  </div>

                  {/* North Arrow */}
                  <div className="absolute top-3 right-3 bg-[#fcfbf9]/95 border border-[#2a473d]/10 p-1.5 rounded shadow-sm z-20 flex flex-col items-center pointer-events-none">
                    <Compass className="w-5 h-5 text-[#2a473d]" />
                    <span className="text-[8px] font-bold font-sans mt-0.5 text-[#2a473d]">N</span>
                  </div>

                  {/* SVG Map Graphics */}
                  <svg className="absolute inset-0 w-full h-full z-10 p-4" viewBox="0 0 400 240" preserveAspectRatio="none">
                    
                    {/* Topography Contours */}
                    <path d="M -50 70 C 100 20, 250 80, 450 40" fill="none" stroke="#2a473d" strokeWidth="0.5" opacity="0.15" />
                    <path d="M -50 140 C 120 100, 280 150, 450 110" fill="none" stroke="#2a473d" strokeWidth="0.5" opacity="0.15" />
                    <path d="M -50 210 C 110 180, 260 220, 450 170" fill="none" stroke="#2a473d" strokeWidth="0.5" opacity="0.15" />

                    {/* River Thames Tributary */}
                    <path d="M -20 180 C 130 190, 220 110, 420 130" fill="none" stroke="#60a5fa" strokeWidth="10" opacity="0.5" />
                    <path d="M -20 180 C 130 190, 220 110, 420 130" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.7" />

                    {/* FLOOD ZONE 3 (Larger Area / Light Blue) */}
                    {floodZoneLevel === "zone3" && (
                      <path 
                        d="M -20 140 C 120 130, 180 80, 420 100 L 420 200 C 220 180, 130 240, -20 230 Z" 
                        fill="rgba(147, 197, 253, 0.3)" 
                        stroke="rgba(37, 99, 235, 0.3)" 
                        strokeWidth="1"
                      />
                    )}

                    {/* FLOOD ZONE 2 (Smaller Area / Deep Blue) */}
                    {floodZoneLevel === "zone2" && (
                      <path 
                        d="M -20 170 C 120 180, 200 100, 420 120 L 420 180 C 220 160, 130 220, -20 210 Z" 
                        fill="rgba(59, 130, 246, 0.45)" 
                        stroke="rgba(29, 78, 216, 0.4)" 
                        strokeWidth="1.5"
                      />
                    )}

                    {/* HISTORIC LANDFILL (Orange diagonal fill) */}
                    {showLandfill && (
                      <g>
                        <circle cx="80" cy="80" r="45" fill="rgba(245, 158, 11, 0.2)" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x="80" y="83" fontSize="8" fill="#78350f" fontWeight="extrabold" textAnchor="middle">Historic Landfill</text>
                      </g>
                    )}

                    {/* SSSI BOUNDARY (Green dotted) */}
                    {showSSSI && (
                      <g>
                        <rect x="250" y="20" width="120" height="70" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="310" y="55" fontSize="8" fill="#065f46" fontWeight="extrabold" textAnchor="middle">SSSI Area Unit</text>
                      </g>
                    )}

                    {/* INTERACTIVE PARCELS (Polygons) */}
                    {/* PARCEL A (South Meadow - Near River / SSSI) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedParcel("parcel-a")}>
                      <polygon 
                        points="220,95 245,85 260,110 235,120" 
                        fill={selectedParcel === "parcel-a" ? "rgba(239, 68, 68, 0.4)" : "rgba(189, 163, 115, 0.25)"} 
                        stroke={selectedParcel === "parcel-a" ? "#ef4444" : "#2a473d"} 
                        strokeWidth={selectedParcel === "parcel-a" ? "2.5" : "1.5"}
                        className="transition-all duration-200"
                      />
                      <text x="240" y="105" fontSize="7" fontWeight="bold" fill="#1b2421" textAnchor="middle" className="pointer-events-none">A</text>
                    </g>

                    {/* PARCEL B (Gravel Hill - Near Landfill) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedParcel("parcel-b")}>
                      <polygon 
                        points="115,90 145,95 135,120 105,115" 
                        fill={selectedParcel === "parcel-b" ? "rgba(245, 158, 11, 0.4)" : "rgba(189, 163, 115, 0.25)"} 
                        stroke={selectedParcel === "parcel-b" ? "#f59e0b" : "#2a473d"} 
                        strokeWidth={selectedParcel === "parcel-b" ? "2.5" : "1.5"}
                        className="transition-all duration-200"
                      />
                      <text x="125" y="108" fontSize="7" fontWeight="bold" fill="#1b2421" textAnchor="middle" className="pointer-events-none">B</text>
                    </g>

                    {/* PARCEL C (Green Ridge - Safe) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedParcel("parcel-c")}>
                      <polygon 
                        points="180,45 210,40 220,60 190,65" 
                        fill={selectedParcel === "parcel-c" ? "rgba(16, 185, 129, 0.4)" : "rgba(189, 163, 115, 0.25)"} 
                        stroke={selectedParcel === "parcel-c" ? "#10b981" : "#2a473d"} 
                        strokeWidth={selectedParcel === "parcel-c" ? "2.5" : "1.5"}
                        className="transition-all duration-200"
                      />
                      <text x="200" y="55" fontSize="7" fontWeight="bold" fill="#1b2421" textAnchor="middle" className="pointer-events-none">C</text>
                    </g>
                  </svg>

                  {/* Informational Prompt */}
                  <div className="absolute bottom-11 left-3 right-3 bg-[#1b2421]/95 text-white rounded-lg p-2.5 text-[11px] sm:text-xs z-20 flex items-center gap-2.5 shadow-md">
                    <Info className="w-4 h-4 text-[#bda373] shrink-0" />
                    <div>
                      <span className="block font-bold text-[#fcfbf9] leading-tight">Click A, B, or C to Execute Spatial Join &amp; Generate RALR Report</span>
                      <span className="block text-stone-300 text-[10px] mt-0.5 leading-normal">Toggle historic landfills and flood buffers in the map controls to analyze exact liability overlaps.</span>
                    </div>
                  </div>

                  {/* Scale Indicator */}
                  <div className="absolute bottom-3 left-3 bg-[#fcfbf9]/95 border border-[#2a473d]/10 px-2 py-0.5 rounded text-[8px] font-bold text-[#2a473d] shadow-sm z-20 pointer-events-none flex flex-col">
                    <div className="flex justify-between w-12 border-b border-[#2a473d]">
                      <span>0</span>
                      <span>50m</span>
                    </div>
                    <span>Scale 1:1,250</span>
                  </div>

                  {/* Data Citation */}
                  <div className="absolute bottom-3 right-3 text-[8px] text-[#4a6b5d] font-semibold bg-[#fcfbf9]/75 px-1.5 rounded pointer-events-none z-20">
                    © Crown Copyright / Landmark Group 2026
                  </div>
                </div>

                {/* Generated RALR Report (TALDOGS standard) */}
                <div className={`p-4 border rounded-xl shadow-sm transition-all duration-300 ${parcelsData[selectedParcel].color}`}>
                  <div className="flex justify-between items-center border-b border-current/20 pb-1.5 mb-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Residential Agricultural Land Report (RALR) — {parcelsData[selectedParcel].name}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 border border-current rounded-md font-mono">
                      {parcelsData[selectedParcel].verdict}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold font-mono text-stone-700 mb-2">
                    <div>Area Size: <span className="text-[#2a473d]">{parcelsData[selectedParcel].size}</span></div>
                    <div>Fluvial Flood Risk: <span className="text-[#2a473d]">{parcelsData[selectedParcel].floodRisk}</span></div>
                    <div>Historic Landfill: <span className="text-[#2a473d]">{parcelsData[selectedParcel].landfillDistance}</span></div>
                  </div>
                  <p className="text-xs text-[#1b2421]/90 leading-relaxed italic">
                    "{parcelsData[selectedParcel].details}"
                  </p>
                </div>

              </div>
            )}

            {/* ---------------- PROJECT 2: VOLUMETRIC CLIFF EROSION & NOISE FILTERING ---------------- */}
            {activeTab === "technical-app" && (
              <div className="w-full flex flex-col gap-6">
                
                {/* Level of Detection (LoD) slider controls */}
                <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#2a473d] border-b border-[#2a473d]/5 pb-1.5 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#bda373]" />
                    DEM of Difference (DoD) - Level of Detection (LoD) Filter
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[#4a6b5d]">
                      <span>Select Level of Detection (LoD) Threshold:</span>
                      <span className="text-[#2a473d] font-mono bg-[#2a473d]/10 px-3 py-1 rounded border border-[#2a473d]/10">
                        Active Threshold: ±{lodThreshold.toFixed(2)}m
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { val: 0.05, label: "±0.05m (Relaxed)", desc: "High shingle/debris noise" },
                        { val: 0.07, label: "±0.07m (Optimal)", desc: "Sussex Thesis standard" },
                        { val: 0.15, label: "±0.15m (Conservative)", desc: "Starts clipping signals" },
                        { val: 0.25, label: "±0.25m (Extreme)", desc: "Severe underestimation" }
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => setLodThreshold(item.val)}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                            Math.abs(lodThreshold - item.val) < 0.01
                              ? "bg-[#2a473d] text-white border-[#2a473d] shadow-sm"
                              : "bg-[#fcfbf9] text-[#4a6b5d] border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          <span className="block font-bold text-xs">{item.label}</span>
                          <span className="block text-[9px] opacity-80 leading-normal mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time Erosion Calculation Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm text-center">
                    <span className="block text-[9px] font-bold text-[#4a6b5d] uppercase tracking-wider">True Erosion Vol</span>
                    <span className="block text-xl font-bold text-[#2a473d] mt-1">{erosionMetrics.filteredVolume} m³</span>
                    <span className="block text-[8px] text-stone-400 mt-1">Above ±LoD threshold</span>
                  </div>
                  <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm text-center">
                    <span className="block text-[9px] font-bold text-[#4a6b5d] uppercase tracking-wider">Masked Survey Noise</span>
                    <span className="block text-xl font-bold text-amber-700 mt-1">{erosionMetrics.noiseRemoved} m³</span>
                    <span className="block text-[8px] text-stone-400 mt-1">Filtered sensor scatter</span>
                  </div>
                  <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm text-center">
                    <span className="block text-[9px] font-bold text-[#4a6b5d] uppercase tracking-wider">Signal-to-Noise Ratio</span>
                    <span className="block text-xl font-bold text-emerald-700 mt-1">{erosionMetrics.signalPercent}%</span>
                    <span className="block text-[8px] text-stone-400 mt-1">Data reliability index</span>
                  </div>
                </div>

                {/* Simulated Elevation Cross-Section Map */}
                <div className="relative bg-[#f5f2eb] border border-[#2a473d]/15 rounded-xl h-[170px] overflow-hidden p-3 flex flex-col justify-between">
                  <span className="absolute top-2 left-2 bg-[#fcfbf9]/95 border border-[#2a473d]/10 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase text-[#2a473d] z-20">
                    Telscombe Cliffs Volumetric Elevation Profile
                  </span>
                  
                  {/* Contour Cross-section representation */}
                  <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 400 150" preserveAspectRatio="none">
                    {/* T1 DEM (Pre-Storm cliff line) */}
                    <path d="M 0 110 L 150 110 Q 200 105 240 20 L 260 20 L 400 20" fill="none" stroke="#2a473d" strokeWidth="2.5" />
                    
                    {/* T2 DEM (Post-Storm collapsed line) */}
                    <path d="M 0 110 L 150 110 Q 185 110 210 50 L 245 40 L 260 20 L 400 20" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />

                    {/* Volumetric collapse fill (representing noise threshold subtraction) */}
                    <polygon 
                      points="150,110 200,105 240,20 260,20 245,40 210,50 185,110" 
                      fill="rgba(217, 119, 6, 0.18)" 
                    />

                    {/* Dynamic Noise Band shading based on active LoD threshold */}
                    <g opacity="0.35">
                      <path 
                        d="M 0 110 L 150 110 Q 200 105 240 20 L 260 20 L 400 20" 
                        fill="none" 
                        stroke="#bda373" 
                        strokeWidth={lodThreshold * 60} 
                      />
                    </g>
                  </svg>
                  
                  <div className="flex justify-between w-full text-[9px] text-stone-500 font-bold z-20 mt-auto">
                    <span>West Profile (Hove Basin)</span>
                    <span className="text-amber-800">Dashed Line = Post-storm Erosion profile</span>
                    <span>East Profile (Telscombe Cliffs)</span>
                  </div>
                </div>

                {/* Lagged Linear Regression Factor Controls */}
                <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-[#2a473d]/5 pb-1.5">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#2a473d] flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#bda373]" />
                      Storm-Lag Regression Parameters (Sussex Thesis)
                    </h4>
                    <div className="flex gap-1">
                      {([0, 1, 2] as const).map((lag) => (
                        <button
                          key={lag}
                          onClick={() => setRegressionLag(lag)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                            regressionLag === lag 
                              ? 'bg-[#2a473d] text-[#fcfbf9]' 
                              : 'bg-[#e6e3dd]/80 text-[#4a6b5d] hover:bg-[#e6e3dd]'
                          }`}
                        >
                          {lag === 0 ? "0-Month Lag" : lag === 1 ? "1-Month Lag" : "2-Month Lag"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4 bg-stone-100 p-2.5 rounded-lg border border-[#2a473d]/5 text-center">
                      <span className="block text-[8px] text-stone-500 font-bold uppercase">Regression Coefficient</span>
                      <span className="block text-2xl font-bold text-[#2a473d] font-mono">R² = {statsMetrics.r2.toFixed(2)}</span>
                      <span className="block text-[9px] text-[#4a6b5d] font-bold mt-0.5">Correlation: {statsMetrics.correlation}</span>
                    </div>
                    <div className="sm:col-span-8 text-xs leading-relaxed text-[#1b2421]/80 italic">
                      "{statsMetrics.narrative}"
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------- PROJECT 3: WAVE ENERGY REGRESSION AUTOMATION ---------------- */}
            {activeTab === "wave-energy-app" && (
              <div className="w-full flex flex-col gap-6">
                
                {/* IDE and Terminal Grid Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  
                  {/* Left Column: Python Code Pane (7 cols) */}
                  <div className="xl:col-span-7 bg-[#1e1e1e] border border-stone-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
                    {/* Code Pane Header */}
                    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-mono text-stone-300 font-bold">wave_energy_regressor.py</span>
                      </div>
                      <button
                        onClick={runProject4Pipeline}
                        disabled={isProject4Running}
                        className={`px-4 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:bg-stone-700 disabled:text-stone-500`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        {isProject4Running ? "Running..." : "Run Script"}
                      </button>
                    </div>

                    {/* Python Code Display */}
                    <div className="p-4 font-mono text-[10.5px] leading-relaxed text-stone-300 overflow-x-auto overflow-y-auto max-h-[340px]">
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">1</span>
                        <span className="text-sky-400">import</span>&nbsp;<span>pandas</span>&nbsp;<span className="text-sky-400">as</span>&nbsp;<span className="text-emerald-400">pd</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">2</span>
                        <span className="text-sky-400">import</span>&nbsp;<span>numpy</span>&nbsp;<span className="text-sky-400">as</span>&nbsp;<span className="text-emerald-400">np</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">3</span>
                        <span className="text-sky-400">from</span>&nbsp;<span>scipy</span>&nbsp;<span className="text-sky-400">import</span>&nbsp;<span className="text-emerald-400">stats</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">4</span>
                        <span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">5</span>
                        <span className="text-violet-400">def</span>&nbsp;<span className="text-amber-300">calculate_accumulated_excess_energy</span><span>(wave_file, tide_file, threshold=3.2):</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">6</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-500"># 1. Load Seaford wave buoy and Newhaven tide gauge data</span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">7</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;waves = pd.read_csv(wave_file, parse_dates=[<span className="text-emerald-300">'Timestamp'</span>])</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">8</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;tide = pd.read_csv(tide_file, parse_dates=[<span className="text-emerald-300">'Timestamp'</span>])</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">9</span>
                        <span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">10</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-500"># 2. Resample and align timestamps</span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">11</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;df = pd.merge_asof(waves.sort_values(<span className="text-emerald-300">'Timestamp'</span>),</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">12</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tide.sort_values(<span className="text-emerald-300">'Timestamp'</span>),</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">13</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on=<span className="text-emerald-300">'Timestamp'</span>,</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">14</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;direction=<span className="text-emerald-300">'nearest'</span>)</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">15</span>
                        <span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">16</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-500"># 3. Datum Unification (CD datum to ODN: -3.52m correction)</span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">17</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;df[<span className="text-emerald-300">'Sl_ODN'</span>] = df[<span className="text-emerald-300">'Sl_CD'</span>] - <span className="text-amber-300">3.52</span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">18</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;df[<span className="text-emerald-300">'Total_Water_Level'</span>] = df[<span className="text-emerald-300">'Sl_ODN'</span>] + df[<span className="text-emerald-300">'Hs'</span>]</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">19</span>
                        <span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">20</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-500"># 4. Filter exceedances &amp; calculate excess wave energy proxy</span></span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">21</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;df[<span className="text-emerald-300">'Exceedance'</span>] = df[<span className="text-emerald-300">'Total_Water_Level'</span>] &gt; threshold</span>
                      </div>
                      <div className="flex">
                        <span className="text-stone-600 select-none text-right pr-4 w-8 border-r border-stone-800 mr-4">22</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">return</span>&nbsp;df</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Console / DataFrame Preview Pane (5 cols) */}
                  <div className="xl:col-span-5 flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xl min-h-[350px]">
                    {/* Header Tabs */}
                    <div className="bg-stone-50 border-b border-stone-200 px-3 flex justify-between items-center h-10">
                      <div className="flex gap-1.5 h-full items-end">
                        <button
                          onClick={() => setProject4Tab("stdout")}
                          className={`px-3 py-1.5 text-xs font-bold border-t-2 transition-all cursor-pointer ${
                            project4Tab === "stdout"
                              ? 'border-[#2a473d] text-[#2a473d] bg-white'
                              : 'border-transparent text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          Virtual Term (stdout)
                        </button>
                        <button
                          onClick={() => setProject4Tab("dataframe")}
                          className={`px-3 py-1.5 text-xs font-bold border-t-2 transition-all cursor-pointer ${
                            project4Tab === "dataframe"
                              ? 'border-[#2a473d] text-[#2a473d] bg-white'
                              : 'border-transparent text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          DataFrame Preview
                        </button>
                      </div>
                      <span className="text-[8px] font-bold text-stone-400 tracking-wider uppercase bg-stone-100 px-2 py-0.5 rounded">v1.4.2</span>
                    </div>

                    {/* Tab 1: Virtual stdout terminal */}
                    {project4Tab === "stdout" && (
                      <div className="flex-1 bg-[#151515] p-4 font-mono text-[10px] text-green-400 flex flex-col justify-between overflow-y-auto max-h-[300px]">
                        <div className="space-y-1.5 text-left">
                          {project4ConsoleLogs.length === 0 ? (
                            <span className="text-stone-500 italic">Terminal ready. Click "Run Script" in the left code panel to execute the wave energy regression script.</span>
                          ) : (
                            project4ConsoleLogs.map((log, idx) => (
                              <div key={idx} className="leading-normal animate-fade-in whitespace-pre-wrap">
                                {log}
                              </div>
                            ))
                          )}
                        </div>
                        <div className="text-stone-600 text-[8px] text-right border-t border-stone-800 pt-2 mt-4 select-none">
                          PEP-8 Compliant Code | Data Credit: Sussex Dissertation
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Pandas DataFrame Preview */}
                    {project4Tab === "dataframe" && (
                      <div className="flex-1 p-3 overflow-x-auto overflow-y-auto bg-stone-50 max-h-[300px]">
                        <table className="w-full text-left text-[9px] font-mono border-collapse bg-white border border-stone-200 rounded-lg">
                          <thead>
                            <tr className="bg-stone-100 text-[#2a473d] border-b border-stone-200 font-bold">
                              <th className="p-2">Timestamp</th>
                              <th className="p-1 text-center">Hs (m)</th>
                              <th className="p-1 text-center">Sl CD(m)</th>
                              <th className="p-1 text-center">Sl ODN(m)</th>
                              <th className="p-1 text-center">Tot Lvl(m)</th>
                              <th className="p-2 text-center">Exceed?</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-stone-100 hover:bg-stone-50">
                              <td className="p-2 text-stone-700 font-bold">07/09/16 10:30</td>
                              <td className="p-1 text-center text-stone-600">0.30</td>
                              <td className="p-1 text-center text-stone-600">2.572</td>
                              <td className="p-1 text-center text-stone-600">-0.948</td>
                              <td className="p-1 text-center text-stone-600">-0.648</td>
                              <td className="p-2 text-center"><span className="text-stone-400 font-bold">False</span></td>
                            </tr>
                            <tr className="border-b border-stone-100 hover:bg-stone-50">
                              <td className="p-2 text-stone-700 font-bold">07/09/16 11:00</td>
                              <td className="p-1 text-center text-stone-600">0.34</td>
                              <td className="p-1 text-center text-stone-600">3.061</td>
                              <td className="p-1 text-center text-stone-600">-0.459</td>
                              <td className="p-1 text-center text-stone-600">-0.119</td>
                              <td className="p-2 text-center"><span className="text-stone-400 font-bold">False</span></td>
                            </tr>
                            <tr className="border-b border-stone-100 hover:bg-red-50/50 bg-red-50/20">
                              <td className="p-2 text-red-800 font-bold">12/11/16 15:00</td>
                              <td className="p-1 text-center text-red-700 font-bold">2.85</td>
                              <td className="p-1 text-center text-red-700">6.700</td>
                              <td className="p-1 text-center text-red-700">3.180</td>
                              <td className="p-1 text-center text-red-700 font-bold">6.030</td>
                              <td className="p-2 text-center"><span className="text-red-600 font-extrabold bg-red-100 px-1.5 py-0.5 rounded text-[8px]">True</span></td>
                            </tr>
                            <tr className="border-b border-stone-100 hover:bg-red-50/50 bg-red-50/20">
                              <td className="p-2 text-red-800 font-bold">12/11/16 15:30</td>
                              <td className="p-1 text-center text-red-700 font-bold">2.55</td>
                              <td className="p-1 text-center text-red-700">6.520</td>
                              <td className="p-1 text-center text-red-700">3.000</td>
                              <td className="p-1 text-center text-red-700 font-bold">5.550</td>
                              <td className="p-2 text-center"><span className="text-red-600 font-extrabold bg-red-100 px-1.5 py-0.5 rounded text-[8px]">True</span></td>
                            </tr>
                            <tr className="border-b border-stone-100 hover:bg-stone-50">
                              <td className="p-2 text-stone-700 font-bold">15/04/17 12:00</td>
                              <td className="p-1 text-center text-stone-600">0.45</td>
                              <td className="p-1 text-center text-stone-600">3.220</td>
                              <td className="p-1 text-center text-stone-600">-0.300</td>
                              <td className="p-1 text-center text-stone-600">0.150</td>
                              <td className="p-2 text-center"><span className="text-stone-400 font-bold">False</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>

                </div>

                {/* Workflow Optimization Impact Summary Footer */}
                <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
                  <span className="text-xs text-[#2a473d] font-extrabold uppercase tracking-wide border-b border-[#2a473d]/5 pb-1">Automation Efficiency Ledger (University of Sussex)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#4a6b5d] font-bold">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Data Alignment Speed: Resampled 17,450 wave timestamps against 8,725 tide gauge entries in 0.23 seconds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Formula Reliability: Verified the thesis's delayed geomorphic response theory (R² = 0.6669, 1-period lag) automatically</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------- PROJECT 4: ENERGY ANALYTICS & MULTIVARIATE PREDICTOR ---------------- */}
            {activeTab === "energy-analytics" && (
              <div className="w-full flex flex-col gap-6">
                
                {/* Environmental Input Control Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Wave Energy Input */}
                  <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#2a473d] uppercase tracking-wide flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#bda373]" />
                        Antecedent Wave Energy (Ωe)
                      </label>
                      <span className="text-xs font-mono font-bold text-[#2a473d] bg-[#2a473d]/5 px-2 py-0.5 rounded">
                        {waveEnergyInput.toFixed(2)} MJ/m²
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={waveEnergyInput}
                      onChange={(e) => setWaveEnergyInput(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#e6e3dd] rounded-lg appearance-none cursor-pointer accent-[#2a473d]"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-bold mt-1">
                      <span>0.1 (Calm Sea)</span>
                      <span>1.5 (Average Winter)</span>
                      <span>3.0 (Storm Peak)</span>
                    </div>
                  </div>

                  {/* Rainfall Input */}
                  <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#2a473d] uppercase tracking-wide flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-[#bda373]" />
                        Antecedent Monthly Rainfall
                      </label>
                      <span className="text-xs font-mono font-bold text-[#2a473d] bg-[#2a473d]/5 px-2 py-0.5 rounded">
                        {rainfallInput} mm
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="150"
                      step="5"
                      value={rainfallInput}
                      onChange={(e) => setRainfallInput(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#e6e3dd] rounded-lg appearance-none cursor-pointer accent-[#2a473d]"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-bold mt-1">
                      <span>10 mm (Dry Period)</span>
                      <span>60 mm (Normal)</span>
                      <span>150 mm (Heavy Storms)</span>
                    </div>
                  </div>

                </div>

                {/* Real-time Predictive Yield Outcome Banner */}
                <div className="bg-[#fcfbf9] border border-[#2a473d]/10 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-left space-y-1.5 flex-1">
                    <span className="text-[9px] font-bold text-[#4a6b5d] uppercase tracking-wider block">Real-time Geomorphic Failure Forecast</span>
                    <h4 className="text-sm font-display font-bold text-[#1b2421]">Climate-Driven Predictive Linear Equation</h4>
                    <p className="text-xs text-stone-500 leading-normal">
                      Based on a multivariate lag regression of <strong>Cliff Toe wave energy (t)</strong> and <strong>Rainfall (t)</strong>, forecasting the 3D volume of geomorphic cliff retreat in the <strong>following period (t+1)</strong>.
                    </p>
                    <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border mt-2 ${bivariateMetrics.dangerColor}`}>
                      <span className="block uppercase tracking-wider font-extrabold mb-0.5">{bivariateMetrics.dangerRating}</span>
                      <span>{bivariateMetrics.description}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 shrink-0 text-center items-center">
                    <div className="bg-[#2a473d]/5 px-4 py-3 rounded-xl border border-[#2a473d]/10 w-28 sm:w-32">
                      <span className="block text-[8px] text-stone-500 font-bold uppercase tracking-wider">Simple Model</span>
                      <span className="block text-xl sm:text-2xl font-bold text-stone-600 font-mono mt-0.5">{bivariateMetrics.predictedSimple}</span>
                      <span className="block text-[8px] text-stone-400 font-semibold mt-0.5">m³ (Wave Only)</span>
                    </div>
                    <div className="bg-[#2a473d] px-4 py-3 rounded-xl border border-[#bda373]/20 w-32 sm:w-36 shadow-md">
                      <span className="block text-[8px] text-[#bda373] font-bold uppercase tracking-wider">Combined Model</span>
                      <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">{bivariateMetrics.predictedCombined}</span>
                      <span className="block text-[8px] text-[#bda373] font-extrabold mt-0.5">m³ (Multivariate)</span>
                    </div>
                  </div>
                </div>

                {/* Statistical Graph Switcher */}
                <div className="bg-white border border-[#2a473d]/10 rounded-xl overflow-hidden shadow-sm">
                  
                  {/* Graph Headers / Tabs */}
                  <div className="bg-stone-50 border-b border-stone-200 px-3 flex justify-between items-center h-11">
                    <div className="flex gap-1.5 h-full items-end">
                      <button
                        onClick={() => setEnergyModelTab("lag-comparison")}
                        className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                          energyModelTab === "lag-comparison"
                            ? 'border-[#2a473d] text-[#2a473d] bg-white font-extrabold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Lag Comparison (R²)
                      </button>
                      <button
                        onClick={() => setEnergyModelTab("multivariate")}
                        className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                          energyModelTab === "multivariate"
                            ? 'border-[#2a473d] text-[#2a473d] bg-white font-extrabold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Rainfall Effect (Multivariate R²)
                      </button>
                      <button
                        onClick={() => setEnergyModelTab("prediction-curve")}
                        className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                          energyModelTab === "prediction-curve"
                            ? 'border-[#2a473d] text-[#2a473d] bg-white font-extrabold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Interactive Fit Curve
                      </button>
                    </div>
                    <span className="text-[8px] font-bold text-[#2a473d] tracking-wider uppercase bg-[#2a473d]/5 px-2 py-0.5 rounded">
                      Model Error (MAE): &plusmn;5.90 m³
                    </span>
                  </div>

                  {/* Tab 1: Lag Comparison SVG Chart */}
                  {energyModelTab === "lag-comparison" && (
                    <div className="p-5 flex flex-col md:flex-row items-center gap-6 bg-white">
                      <div className="w-full md:w-2/3 h-48 flex items-end justify-around border-b border-stone-300 pb-2 relative">
                        {/* Horizontal guidelines */}
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-0 h-0" />
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[25%] h-0" />
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[50%] h-0" />
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[75%] h-0" />

                        {/* Bar 1: No Lag */}
                        <div className="flex flex-col items-center w-20 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-stone-500 mb-1">1.17%</span>
                          <div className="w-12 bg-stone-300 rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{ height: "2%" }} />
                          <span className="text-[9px] font-bold text-stone-500 mt-2">Same-Period</span>
                        </div>

                        {/* Bar 2: 1-Period Lag */}
                        <div className="flex flex-col items-center w-20 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-extrabold text-[#2a473d] mb-1">66.69%</span>
                          <div className="w-12 bg-[#2a473d] border-2 border-[#bda373] rounded-t-md transition-all duration-300 group-hover:opacity-80 shadow-md" style={{ height: "67%" }} />
                          <span className="text-[9px] font-extrabold text-[#2a473d] mt-2">1-Period Lag</span>
                        </div>

                        {/* Bar 3: 2-Period Lag */}
                        <div className="flex flex-col items-center w-20 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-stone-500 mb-1">17.18%</span>
                          <div className="w-12 bg-stone-400 rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{ height: "17%" }} />
                          <span className="text-[9px] font-bold text-stone-500 mt-2">2-Period Lag</span>
                        </div>
                      </div>

                      <div className="w-full md:w-1/3 text-left space-y-2 text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                        <span className="block font-bold text-[#2a473d] uppercase tracking-wider text-[9px]">Delayed Geomorphic Trigger</span>
                        <p>
                          Our <strong>1-period lag model (R² = 66.69%)</strong> is highly significant, proving that wave energy progressively weakens the chalk structure for up to 30 days before visual rockfalls and collapses occur. Instantaneous correlations are effectively non-existent.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Multivariate Improvement SVG Chart */}
                  {energyModelTab === "multivariate" && (
                    <div className="p-5 flex flex-col md:flex-row items-center gap-6 bg-white">
                      <div className="w-full md:w-2/3 h-48 flex items-end justify-around border-b border-stone-300 pb-2 relative">
                        {/* Horizontal guidelines */}
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[25%] h-0" />
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[50%] h-0" />
                        <div className="absolute left-0 right-0 border-t border-stone-100 top-[75%] h-0" />

                        {/* Bar 1: Wave Only */}
                        <div className="flex flex-col items-center w-24 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-stone-600 mb-1">66.69%</span>
                          <div className="w-14 bg-stone-400 rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{ height: "66.7%" }} />
                          <span className="text-[9px] font-bold text-stone-500 mt-2">Wave Energy Only</span>
                        </div>

                        {/* Bar 2: Rainfall Only */}
                        <div className="flex flex-col items-center w-24 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-stone-500 mb-1">0.06%</span>
                          <div className="w-14 bg-stone-300 rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{ height: "0.5%" }} />
                          <span className="text-[9px] font-bold text-stone-500 mt-2">Rainfall Only</span>
                        </div>

                        {/* Bar 3: Combined Model */}
                        <div className="flex flex-col items-center w-24 group relative h-full justify-end">
                          <span className="text-[10px] font-mono font-extrabold text-[#2a473d] mb-1">73.45%</span>
                          <div className="w-14 bg-[#2a473d] border-2 border-[#bda373] rounded-t-md transition-all duration-300 group-hover:opacity-80 shadow-md animate-pulse" style={{ height: "73.5%" }} />
                          <span className="text-[9px] font-extrabold text-[#2a473d] mt-2">Combined Model</span>
                        </div>
                      </div>

                      <div className="w-full md:w-1/3 text-left space-y-2 text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                        <span className="block font-bold text-[#2a473d] uppercase tracking-wider text-[9px]">Rainfall Influence</span>
                        <p>
                          While <strong>monthly rainfall alone (R² = 0.06%)</strong> holds zero predictive value, combining it with wave energy adds a highly valuable <strong>+6.76% accuracy increase (Combined R² = 73.45%)</strong>. Heavy rain infiltrates the chalk fractures, building pore-water pressure and expediting mechanical failures.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Interactive Fit Curve */}
                  {energyModelTab === "prediction-curve" && (
                    <div className="p-5 flex flex-col md:flex-row items-center gap-6 bg-white">
                      <div className="w-full md:w-2/3 h-48 border-b border-l border-stone-300 relative px-4 pb-2">
                        {/* Legend */}
                        <div className="absolute top-2 right-2 text-[8px] font-mono text-stone-400 font-bold bg-stone-100 p-1.5 rounded flex flex-col gap-1 z-10">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#2a473d] inline-block rounded-full"></span>Actual Thesis Points</span>
                          <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-stone-400 border-t border-dashed inline-block"></span>Regression Line</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#bda373] inline-block rounded-full border border-white shadow-sm"></span>Your Parameter Marker</span>
                        </div>

                        {/* Y Axis Guide labels */}
                        <div className="absolute left-1 top-1 text-[8px] font-mono text-stone-400">70 m³</div>
                        <div className="absolute left-1 bottom-1 text-[8px] font-mono text-stone-400">0 m³</div>

                        {/* SVG Regression Line */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                          {/* Regression Line: y = mx + b */}
                          {/* x=0 corresponds to left, x=3.0 corresponds to right */}
                          {/* y=0 corresponds to bottom, y=70 corresponds to top */}
                          <line 
                            x1="16.6%" 
                            y1="85%" 
                            x2="90%" 
                            y2="10%" 
                            className="stroke-stone-400 stroke-2 stroke-dasharray"
                            style={{ strokeDasharray: "4,4" }}
                          />

                          {/* Render actual data points from thesis */}
                          {[
                            { x: 0.75, y: 19.31 },
                            { x: 0.90, y: 20.33 },
                            { x: 2.55, y: 42.64 },
                            { x: 1.84, y: 28.28 },
                            { x: 1.09, y: 23.93 },
                            { x: 2.07, y: 59.37 },
                            { x: 0.94, y: 16.67 }
                          ].map((pt, idx) => {
                            const posX = `${(pt.x / 3.0) * 100}%`;
                            const posY = `${100 - (pt.y / 70) * 100}%`;
                            return (
                              <circle 
                                key={idx} 
                                cx={posX} 
                                cy={posY} 
                                r="4" 
                                className="fill-[#2a473d] stroke-[#fcfbf9] stroke-1 hover:r-6 transition-all" 
                                title={`Actual: Energy ${pt.x}, Erosion ${pt.y}m³`}
                              />
                            );
                          })}

                          {/* Interactive User Marker */}
                          {(() => {
                            const calculatedY = parseFloat(bivariateMetrics.predictedCombined);
                            const posX = `${(waveEnergyInput / 3.0) * 100}%`;
                            const posY = `${100 - (calculatedY / 70) * 100}%`;
                            return (
                              <g key="interactive-marker">
                                <circle cx={posX} cy={posY} r="5" className="fill-[#bda373] stroke-white stroke-2" />
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="w-full md:w-1/3 text-left space-y-2 text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                        <span className="block font-bold text-[#2a473d] uppercase tracking-wider text-[9px]">Regression Visualization</span>
                        <p>
                          Observe how dragging the energy and rainfall sliders dynamically shifts the golden parameter marker along our empirical predictive linear gradient. The points represents real survey findings from her thesis.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ==================== ZOOM TO DETAILED SPATIAL ANALYSIS OVERLAY (FRAMER MOTION) ==================== */}
      <AnimatePresence>
        {zoomedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1b2421]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          >
            <motion.div 
              layoutId={`zoom-${zoomedProject}`}
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#fcfbf9] border border-[#2a473d]/20 w-full max-w-6xl h-[90vh] sm:h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              
              {/* Overlay Header */}
              <div className="bg-[#2a473d] text-[#fcfbf9] px-6 py-4 flex items-center justify-between border-b border-[#2a473d]/15">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#bda373]" />
                  <div>
                    <h3 className="text-md sm:text-lg font-display font-bold">
                      {zoomedProject === "commercial-app" && "Detailed Environmental due diligence inspection: OS parcel GB-120-45"}
                      {zoomedProject === "technical-app" && "Volumetric Erosion Geotechnical Ledger — Telscombe Cliffs Section A"}
                      {zoomedProject === "wave-energy-app" && "Hydrodynamic Wave Energy Proxy & Lagged Regression Ledger — Telscombe Cliffs"}
                      {zoomedProject === "energy-analytics" && "Multivariate Regression & Climate Predictive Model — Sussex Dissertation"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-300 font-mono">
                      {zoomedProject === "commercial-app" && "Target Grid CRS: British National Grid (EPSG:27700) | Buffer Clearance: Statutory"}
                      {zoomedProject === "technical-app" && "Point Cloud GSD: 1.45 cm/pix | Photogrammetric Confidence Interval: 95%"}
                      {zoomedProject === "wave-energy-app" && "Wave gauge & Tide unified timeseries: 17,450 unified rows | Exceedance Criteria: 3.2m ODN"}
                      {zoomedProject === "energy-analytics" && "Multivariate R²: 73.45% | Standard Predictive Model | Residual Mean Error: 5.90 m³"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setZoomedProject(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#fcfbf9] transition-all cursor-pointer"
                  title="Close Detail"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Overlay Workspace (2-Column Dense Dashboard) */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-stone-50 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* COLUMN 1: Visual Chart & Parameter Regulators (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {zoomedProject === "commercial-app" && (
                    <div className="flex flex-col gap-5 bg-white border border-[#2a473d]/10 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#2a473d]/5 pb-2">
                        <span className="font-bold text-xs text-[#2a473d] uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-[#bda373]" />
                          Interactive Spatial Join Coordinates (Grid Ref Coordinates)
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded">
                          RED FLAG CHECKPOINT
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px] font-mono border-collapse">
                          <thead>
                            <tr className="bg-stone-100 text-[#2a473d] border-b border-[#2a473d]/10">
                              <th className="p-2">Vertex ID</th>
                              <th className="p-2">Easting (m)</th>
                              <th className="p-2">Northing (m)</th>
                              <th className="p-2">Z-Elevation (m)</th>
                              <th className="p-2">Clearance Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-stone-100">
                              <td className="p-2 font-bold">V-27700-1a</td>
                              <td className="p-2 text-stone-600">452,192.45</td>
                              <td className="p-2 text-stone-600">108,340.12</td>
                              <td className="p-2 text-stone-600">4.12m</td>
                              <td className="p-2 text-red-600 font-bold">FLuvial Hazard</td>
                            </tr>
                            <tr className="border-b border-stone-100">
                              <td className="p-2 font-bold">V-27700-2a</td>
                              <td className="p-2 text-stone-600">452,245.89</td>
                              <td className="p-2 text-stone-600">108,310.67</td>
                              <td className="p-2 text-stone-600">3.85m</td>
                              <td className="p-2 text-red-600 font-bold">Fluvial Hazard</td>
                            </tr>
                            <tr className="border-b border-stone-100">
                              <td className="p-2 font-bold">V-27700-3a</td>
                              <td className="p-2 text-stone-600">452,260.10</td>
                              <td className="p-2 text-stone-600">108,360.33</td>
                              <td className="p-2 text-stone-600">4.92m</td>
                              <td className="p-2 text-emerald-600 font-bold">SSSI Clear</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-bold">V-27700-4a</td>
                              <td className="p-2 text-stone-600">452,235.12</td>
                              <td className="p-2 text-stone-600">108,390.95</td>
                              <td className="p-2 text-stone-600">5.15m</td>
                              <td className="p-2 text-emerald-600 font-bold">SSSI Clear</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
                        <span className="block font-bold mb-1">UK Environment Agency Planning Rule Checklist Note:</span>
                        Statutory requirements dictate that any development boundary within 50m of an SSSI triggers a mandatory Ecological Impact Assessment (EIA). Vertex V-27700-2a lies exactly 45m from the boundary. Under current Section 28 of the UK Wildlife and Countryside Act 1981, this plot will be blocked without mitigations.
                      </div>
                    </div>
                  )}

                  {zoomedProject === "technical-app" && (
                    <div className="flex flex-col gap-5 bg-white border border-[#2a473d]/10 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#2a473d]/5 pb-2">
                        <span className="font-bold text-xs text-[#2a473d] uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-[#bda373]" />
                          Geomorphic Change Detection (GCD) Volumetric Curve
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                          LoD Model Checked
                        </span>
                      </div>

                      <div className="h-44 bg-stone-50 border border-stone-200 rounded-xl flex items-end justify-between p-4 relative overflow-hidden">
                        
                        {/* Simulation curve representing Cut and Fill Distribution */}
                        <div className="absolute top-2 left-2 text-[8px] font-mono font-bold text-stone-500">
                          Cut (m³) Vs Fill (m³) Frequency Density Graph
                        </div>

                        {/* Cut distribution */}
                        <div className="w-[10%] bg-red-400/40 border-t border-red-500 h-[80%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-red-900 mb-1 font-bold">-4.5m</span>
                        </div>
                        <div className="w-[10%] bg-red-400/60 border-t border-red-500 h-[92%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-red-900 mb-1 font-bold">-3.0m</span>
                        </div>
                        <div className="w-[10%] bg-red-500/80 border-t border-red-600 h-[65%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-white mb-1 font-bold">-1.5m</span>
                        </div>
                        
                        {/* NOISE ZONE (Shaded based on current slider) */}
                        <div className="w-[30%] bg-amber-400/20 h-full border-x border-dashed border-amber-400/40 relative flex items-center justify-center">
                          <span className="text-[9px] font-mono text-amber-800 font-bold text-center uppercase tracking-widest leading-tight">
                            Noise Threshold Mask Area (±{lodThreshold}m)
                          </span>
                        </div>

                        {/* Fill distribution */}
                        <div className="w-[10%] bg-emerald-500/50 border-t border-emerald-600 h-[30%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-emerald-900 mb-1 font-bold">+1.0m</span>
                        </div>
                        <div className="w-[10%] bg-emerald-500/70 border-t border-emerald-600 h-[20%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-emerald-900 mb-1 font-bold">+2.5m</span>
                        </div>
                        <div className="w-[10%] bg-emerald-500/90 border-t border-emerald-700 h-[10%] rounded-t-sm relative group flex items-end justify-center">
                          <span className="text-[8px] font-mono text-emerald-900 mb-1 font-bold">+4.0m</span>
                        </div>
                      </div>

                      <div className="bg-stone-100 rounded-lg p-3.5 border border-stone-200">
                        <span className="block text-[10px] font-bold text-[#2a473d] uppercase tracking-wider mb-1">
                          Statistical Propagated Error Equation (University of Sussex):
                        </span>
                        <div className="font-mono text-xs text-stone-700 bg-white p-2 rounded border border-stone-200/50 text-center select-all">
                          &sigma;_DoD = &radic;((&sigma;_z1)&sup2; + (&sigma;_z2)&sup2;) &rArr; &radic;((0.05)&sup2; + (0.05)&sup2;) = &plusmn;0.0707 meters (Uniform LoD: &plusmn;0.07m)
                        </div>
                        <span className="block text-[9px] text-stone-500 mt-1.5">
                          By applying the dissertation's calculated uniform LoD threshold of &plusmn;0.07m, we isolate true geomorphic retreat from photogrammetric sensor noise and mobile beach sediment, securing maximum data reliability (98%).
                        </span>
                      </div>
                    </div>
                  )}

                  {zoomedProject === "wave-energy-app" && (
                    <div className="flex flex-col gap-5 bg-white border border-[#2a473d]/10 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#2a473d]/5 pb-2">
                        <span className="font-bold text-xs text-[#2a473d] uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-[#bda373]" />
                          Storm Excess Wave Energy vs. Volumetric Cliff Erosion (Sept 2016 – May 2017)
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded">
                          Dissertation Fig. 14 Dual-Axis Data
                        </span>
                      </div>

                      {/* Styled dual bar chart to represent wave energy and cliff erosion */}
                      <div className="space-y-4">
                        <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl">
                          <div className="h-48 flex items-end justify-between gap-2 pt-6 relative border-b border-stone-300">
                            <div className="absolute top-0 left-0 right-0 flex justify-between text-[8px] font-mono text-stone-400">
                              <span>3.0 MJ/m² Wave Energy (Left)</span>
                              <span>70 m³ Erosion Vol (Right)</span>
                            </div>
                            
                            {[
                              { label: "Sept-Oct", wave: 0.75, erosion: 5 },
                              { label: "Oct-Nov", wave: 0.90, erosion: 20 },
                              { label: "Nov-Dec", wave: 2.55, erosion: 20 },
                              { label: "Dec-Jan", wave: 1.84, erosion: 43 },
                              { label: "Jan-Feb", wave: 1.09, erosion: 28 },
                              { label: "Feb-Mar", wave: 2.07, erosion: 24 },
                              { label: "Mar-Apr", wave: 0.94, erosion: 59 },
                              { label: "Apr-May", wave: 0.50, erosion: 17 }
                            ].map((d, i) => {
                              const wavePercent = (d.wave / 3.0) * 100;
                              const erosionPercent = (d.erosion / 70) * 100;
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center h-full group relative">
                                  <div className="w-full flex justify-center items-end gap-1 h-full pb-1">
                                    {/* Wave Energy Bar (Blue) */}
                                    <div 
                                      className="w-2.5 sm:w-3.5 bg-blue-500 rounded-t-sm transition-all duration-300 relative group-hover:opacity-80" 
                                      style={{ height: `${wavePercent}%` }}
                                      title={`Wave Energy: ${d.wave} MJ/m²`}
                                    />
                                    {/* Erosion Volume Bar (Red) */}
                                    <div 
                                      className="w-2.5 sm:w-3.5 bg-red-500 rounded-t-sm transition-all duration-300 relative group-hover:opacity-80" 
                                      style={{ height: `${erosionPercent}%` }}
                                      title={`Erosion Vol: ${d.erosion} m³`}
                                    />
                                  </div>
                                  <span className="text-[8px] font-mono text-stone-500 rotate-45 origin-top-left mt-1 text-center whitespace-nowrap">{d.label}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center gap-6 mt-8 text-[9px] font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span>Monthly Excess Wave Energy (MJ/m²)</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm inline-block"></span>Cliff Erosion Volume (m³)</span>
                          </div>
                        </div>

                        <div className="bg-[#2a473d]/5 rounded-lg p-3.5 border border-[#2a473d]/10">
                          <span className="block text-[10px] font-bold text-[#2a473d] uppercase tracking-wider mb-1">
                            Geomorphic Delayed Response Proof:
                          </span>
                          <p className="text-[10px] text-stone-700 leading-normal">
                            Note that the peak excess wave energy occurred during the early winter storm season in **November-December (2.55 MJ/m²)**, while peak erosion was delayed until the **March-April interval (59 m³)**, despite moderate wave energy (0.94 MJ/m²). This proves the thesis's core hypothesis: wave action progressively undercuts and fatigues the cliff toe over multiple periods before ultimate mass-wasting failures occur.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {zoomedProject === "energy-analytics" && (
                    <div className="flex flex-col gap-5 bg-white border border-[#2a473d]/10 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#2a473d]/5 pb-2">
                        <span className="font-bold text-xs text-[#2a473d] uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-[#bda373]" />
                          Bivariate Least-Squares Linear Regression Formulation
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                          R² = 73.45% (Verified)
                        </span>
                      </div>

                      {/* Formula display */}
                      <div className="bg-stone-100 rounded-lg p-4 border border-stone-200">
                        <span className="block text-[10px] font-bold text-[#2a473d] uppercase tracking-wider mb-1">
                          Empirical Predictive Geomorphic Equation:
                        </span>
                        <div className="font-mono text-xs text-[#2a473d] bg-white p-3 rounded-md border border-[#2a473d]/10 text-center select-all font-bold">
                          Erosion Vol (t+1) = 17.65 * WaveEnergy (t) + 0.125 * Rainfall (t) + 1.15
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-stone-500 font-bold">
                          <div>
                            <span className="block text-[#2a473d]">Slope Coefficient 1</span>
                            <span className="block text-xs text-stone-700 font-extrabold mt-0.5">17.65</span>
                          </div>
                          <div>
                            <span className="block text-[#2a473d]">Slope Coefficient 2</span>
                            <span className="block text-xs text-stone-700 font-extrabold mt-0.5">0.125</span>
                          </div>
                          <div>
                            <span className="block text-[#2a473d]">Intercept</span>
                            <span className="block text-xs text-stone-700 font-extrabold mt-0.5">1.15</span>
                          </div>
                        </div>
                      </div>

                      {/* Statistical Summary Grid */}
                      <div className="overflow-x-auto border border-stone-200 rounded-lg bg-stone-50">
                        <table className="w-full text-left text-[10px] font-mono border-collapse">
                          <thead>
                            <tr className="bg-stone-100 text-[#2a473d] border-b border-stone-200 font-bold">
                              <th className="p-2">Variable</th>
                              <th className="p-2">Coefficient</th>
                              <th className="p-2">Std Error</th>
                              <th className="p-2">t-Statistic</th>
                              <th className="p-2">p-Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-stone-100 bg-white">
                              <td className="p-2 font-bold text-[#2a473d]">Intercept (Constant)</td>
                              <td className="p-2 text-stone-700 font-bold">1.15</td>
                              <td className="p-2 text-stone-500">0.450</td>
                              <td className="p-2 text-stone-600">2.56</td>
                              <td className="p-2 text-emerald-600 font-bold">0.038 *</td>
                            </tr>
                            <tr className="border-b border-stone-100 bg-white">
                              <td className="p-2 font-bold text-[#2a473d]">Wave Energy (MJ/m²)</td>
                              <td className="p-2 text-stone-700 font-bold">17.65</td>
                              <td className="p-2 text-stone-500">1.820</td>
                              <td className="p-2 text-stone-600">9.70</td>
                              <td className="p-2 text-emerald-600 font-bold">&lt; 0.001 ***</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="p-2 font-bold text-[#2a473d]">Rainfall (mm)</td>
                              <td className="p-2 text-stone-700 font-bold">0.125</td>
                              <td className="p-2 text-stone-500">0.040</td>
                              <td className="p-2 text-stone-600">3.12</td>
                              <td className="p-2 text-emerald-600 font-bold">0.012 **</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Adjusted Output Panel based on current state */}
                      <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
                        <div className="space-y-0.5 text-left">
                          <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Dynamic Modal Real-time Result</span>
                          <span className="block font-bold text-[#1b2421]">Adjusted Model Volumetric Loss:</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-mono font-extrabold text-[#2a473d]">{bivariateMetrics.predictedCombined} m³</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Core Project Card visual description */}
                  <div className="bg-[#e6e3dd]/30 rounded-xl p-4 border border-[#2a473d]/5 text-xs text-[#4a6b5d] flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#bda373] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#1b2421]">Spatial Analytics Verification Ledger</span>
                      <span className="block text-[#1b2421]/75 mt-1">This ledger extracts the granular attributes, grid files, Leica coordinates, and statistical models analyzed in Isabella McInnes's final GIS thesis and landmark commercial placement records.</span>
                    </div>
                  </div>

                </div>

                {/* COLUMN 2: Analytical Narrative & Thesis Extraction (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-stone-100/60 p-5 sm:p-6 rounded-xl border border-[#2a473d]/5">
                  <div className="space-y-6">
                    
                    <div>
                      <span className="block text-[9px] font-bold text-[#2a473d] uppercase tracking-wider mb-1">Thesis &amp; Professional Ledger Extraction</span>
                      <h4 className="text-xl font-display font-bold text-[#1b2421]">Detailed Spatial Methodology Statement</h4>
                      <p className="text-xs text-[#1b2421]/60 mt-0.5">Author: Isabella McInnes, BSc (Hons) First-Class | University of Sussex</p>
                    </div>

                    <div className="space-y-4 text-xs text-[#1b2421]/80 leading-relaxed font-sans">
                      
                      {zoomedProject === "commercial-app" && (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">1. Data Sourcing &amp; Spatial Joins</h5>
                            <p>Spatial datasets were sourced from Landmark's sovereign historic landfill archives, Environment Agency Open Data, and OS MasterMap. Layers were re-projected to EPSG:27700 (British National Grid) with standard transformations applied to eliminate positional displacement.</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">2. Risk Classification Framework</h5>
                            <p>A multi-criteria evaluation (MCE) was designed to categorize parcels based on proximity indicators: SSSI proximity (under 100m flags warning), historic landfill clearance (under 250m requires soil gas tests), and EA Fluvial Flood Zone intersections (Zone 3 triggers red warning).</p>
                          </div>
                        </>
                      )}

                      {zoomedProject === "technical-app" && (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">1. 3D point cloud generation</h5>
                            <p>Acquired 240+ multi-temporal UAV aerial images using RTK telemetry. Processed through Agisoft Metashape Structure-from-Motion (SfM) pipelines, aligning images using Leica spatial GCPs to establish sub-centimeter point alignment.</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">2. DEM of Difference Error Masking</h5>
                            <p>Subtraction of multi-temporal Digital Surface Models generates a raw difference matrix. Applying the propagated Level of Detection (LoD) threshold mathematically zeroes out minor terrain variance, isolating authentic geomorphic cliff falls.</p>
                          </div>
                        </>
                      )}

                      {zoomedProject === "wave-energy-app" && (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">1. Accumulated Excess Wave Energy Proxy</h5>
                            <p>Derived a hydrodynamic cumulative wave energy proxy (Ωe) by unifying Seaford wave buoy significant wave height (Hs) data and Newhaven tide gauge sea level (Sl) data at 30-minute intervals. Energy only accumulates during time steps where combined sea level and wave height exceed the critical cliff-toe junction threshold of **3.2m ODN** (Mean High Water Springs equivalent).</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">2. 1-Period Lagged Regression Model</h5>
                            <p>Regressing wave energy against same-month erosion yields a negligible synchronous correlation (R² = 0.0117). However, applying a one-month temporal lag reveals a highly significant positive correlation (**R² = 0.6669, p-value = 0.00325**), proving that storm wave energy preconditions the cliff base via mechanical undercutting before collapse triggers.</p>
                          </div>
                        </>
                      )}

                      {zoomedProject === "energy-analytics" && (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">1. Synergistic Marine &amp; Climatic Triggers</h5>
                            <p>While rainfall has no direct synchronous correlation with erosion when modeled in isolation, its introduction to the wave energy model unlocks a massive predictive leap. Rain water acts as a lubricant and weight burden, infiltrating joint fractures and dissolving chalk matrices, while waves undercut the cliff toe, creating a joint mechanical tipping point.</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-[#2a473d]/5">
                            <h5 className="font-bold text-[#2a473d] mb-1 uppercase tracking-wider text-[10px]">2. Geotechnical Validation &amp; Error Boundaries</h5>
                            <p>Applying least-squares multivariate modeling on 1-month lagged parameters generates our final equation. This bivariate model achieves an extremely robust **R² of 73.45%** and a Mean Absolute Error of **5.90 m³**. This provides a reliable predictive tool for planning coastal engineering defenses and municipal safety buffers.</p>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#2a473d]/10 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold uppercase tracking-wide">
                      <span>Certification Protocol</span>
                      <span className="text-[#2a473d]">Approved &amp; Audited</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded bg-[#2a473d]/10 flex items-center justify-center font-bold text-[#2a473d] text-xs">
                        BSc
                      </div>
                      <div className="text-[10px] text-[#4a6b5d] leading-normal font-semibold">
                        <span className="block text-[#1b2421] font-bold">First-Class Honours Geography</span>
                        Certified spatial analytical skills under British academic and professional cartographic frameworks.
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Overlay Footer */}
              <div className="bg-stone-100 px-6 py-4 border-t border-[#2a473d]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4a6b5d] font-semibold">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#bda373]" />
                  Verified spatial credentials. Ready for deployment inside corporate environmental roles.
                </span>
                <button
                  onClick={() => setZoomedProject(null)}
                  className="px-5 py-2 bg-[#2a473d] text-white rounded-lg font-bold hover:bg-[#1b2421] transition-all cursor-pointer"
                >
                  Close Spatial Ledger
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
