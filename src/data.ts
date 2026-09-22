import { Project, SkillCategory, EducationEntry, ExperienceEntry, TargetCompany } from './types';

export const CV_PROFILE = {
  name: "Isabella McInnes",
  title: "BSc (Hons) Geography (First Class)",
  subtitle: "Graduate Environmental & GIS Consultant",
  email: "bellsmcinnes3191@gmail.com",
  phone: "07711864843",
  location: "Oxford / Reading (Willing to relocate)",
  linkedIn: "linkedin.com/in/isabella-mcinnes",
  summary: "I'm a Geography Graduate & GIS Specialist passionate about environmental mapping and spatial data analysis, with proven commercial experience delivering Residential Agricultural Land Reports (RALR) within a consultancy environment, identifying environmental liabilities and flood zone designations. Highly skilled in processing Unmanned Aerial Vehicle-Structure from Motion (UAV-SfM) photogrammetry, building Digital Elevation Models (DEMs), and applying statistical modelling to understand climate resilience and geomorphic risk. Actively seeking a graduate role in environmental consultancy or geospatial surveying."
};

export const PROJECTS: Project[] = [
  {
    id: "commercial-app",
    title: "Project 1: The Commercial Application",
    subtitle: "Flood Risk & Due Diligence Map",
    focus: "Environmental Due Diligence & Flood Risk (Landmark Information Group placement)",
    objective: "To identify environmental liabilities and flood zone designations for a proposed residential transaction.",
    tools: ["QGIS", "Ordnance Survey MasterMap", "Spatial Join", "Buffer Analysis"],
    process: "Integrated multi-source spatial data to evaluate site viability, overlaying parcel boundaries with environmental constraints and supporting early-stage land acquisition strategies.",
    impact: "Delivered a corporate-standard Residential Agricultural Land Report (RALR) assessing environmental and flood risk under UK planning frameworks, successfully flagging key development liabilities for legal and commercial stakeholders.",
    visualDescription: "A professional, interactive map demonstrating real-world due diligence. Features custom layer overlays for historic landfills, SSSIs, and UK flood zones, incorporating full 'TALDOGS' cartographic elements."
  },
  {
    id: "technical-app",
    title: "Project 2: The Technical & Analytical Application",
    subtitle: "Coastal Change & Geomorphic Risk",
    focus: "3D Modelling, Remote Sensing & Geomorphic Risk (Sussex Dissertation)",
    objective: "To quantify winter storm damage and volumetric cliff erosion at Telscombe Cliffs.",
    tools: ["ArcGIS Pro", "UAV-SfM Photogrammetry", "Python", "DoD Analysis", "Error Propagation"],
    process: "Processed multi-temporal UAV imagery into 3D point clouds to generate Digital Surface Models (DSMs). Conducted DEM of Difference (DoD) analysis and applied a strict ±Level of Detection (LoD) threshold to filter sensor and terrain noise.",
    impact: "Proved via statistical lagged linear regression that 67% (R² = 0.67) of cliff erosion variability is linked directly to antecedent winter storm conditions (1-month lag), providing actionable datasets for coastal Shoreline Management Plans (SMPs).",
    visualDescription: "An interactive, side-by-side elevation model comparer alongside a simulated Level of Detection noise-filtering dashboard and regression chart."
  },
  {
    id: "wave-energy-app",
    title: "Project 3: Wave Energy & Lagged Regression Automation",
    subtitle: "Wave Energy Proxy & Lagged Regression Automation Engine",
    focus: "Data Science, Remote Sensing Error Propagation & Automated Hydrodynamic Proxies",
    objective: "To automate the calculation of cumulative excess wave energy (Ωe) above the critical geomorphic threshold (3.2m ODN) and run the lagged regression models.",
    tools: ["Python (pandas, numpy, scipy, matplotlib)", "ArcPy / QGIS Python API", "Linear Regression Engine"],
    process: "Developed an AI Python script that imports raw 15-minute wave buoy heights (Hs) and 30-minute tide gauge elevations (Sl), aligns their timestamps, filters periods exceeding the critical 3.2m ODN geomorphic threshold, integrates the excess wave energy over monthly survey intervals, and computes the 1-period temporal lag correlation.",
    impact: "Eliminated manual spreadsheet aligning of over 17,000 data rows, reduced calculation error, and verified the delayed geomorphic response theory.",
    visualDescription: "An interactive, syntax-highlighted Python environment executing the wave energy regressor with live-generated Spearman's Rank and R² results."
  },
  {
    id: "energy-analytics",
    title: "Project 4: Erosion Prediction & Multivariate Lag Analytics",
    subtitle: "Climate & Wave Energy Predictive Modeling in Excel",
    focus: "Predictive Analytics & Multivariate Linear Modeling (Sussex Dissertation Extension)",
    objective: "To model same-period and multi-period lagged regression vectors of Cliff Toe Energy and Rainfall against cliff erosion to build a predictive geomorphic tool.",
    tools: ["Python (scipy.stats, statsmodels)", "Excel Solver / Regression Toolset", "Multivariate Linear Modeling", "Predictive Analytics"],
    process: "Correlated cumulative wave energies and monthly rainfall against 3D volumetric erosion rates. Developed a multivariate model combining delayed-action marine energy and rainfall with a 1-period temporal lag to account for structural weakening of chalk matrices.",
    impact: "Discovered that while monthly rainfall alone yields negligible direct correlation (R² = 0.06%), a combined multivariate 1-period lagged model improves erosion prediction accuracy to R² = 73.45% (+6.76% improvement). Designed a linear prediction equation with a Mean Absolute Error of 5.90 m³.",
    visualDescription: "An interactive climate prediction dashboard with real-time wave energy/rainfall input sliders, lag comparisons, and live-updated regression charts."
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "GIS & Spatial Analysis",
    icon: "Map",
    skills: ["QGIS", "ArcGIS Pro", "MapInfo", "Ordnance Survey Data Integration", "DEM of Difference (DoD) Analysis", "Spatial Masking", "Network Analysis", "Buffer & Proximity Analysis"]
  },
  {
    title: "Remote Sensing & Photogrammetry",
    icon: "Camera",
    skills: ["Structure-from-Motion (SfM) processing", "3D Point Cloud analysis", "Digital Surface Model (DSM) generation", "UAV drone imagery processing", "Terrain extraction"]
  },
  {
    title: "Data Science & Modelling",
    icon: "Binary",
    skills: ["Python (Pandas, NumPy, SciPy)", "Statistical Regression Modelling", "Error Propagation & LoD Thresholding", "Hydrodynamic wave energy proxies", "Matplotlib / Seaborn plotting"]
  },
  {
    title: "Industry & Domain Knowledge",
    icon: "Briefcase",
    skills: ["Environmental Due Diligence", "UK Planning Frameworks (NPPF)", "Coastal Geomorphology", "Flood Risk Assessment", "Residential Agricultural Land Reports (RALR)", "Biodiversity Net Gain (BNG) concept support"]
  }
];

export const EDUCATION: EducationEntry = {
  institution: "University of Sussex",
  period: "Sept 2023 – May 2026",
  degree: "BSc (Hons) Geography",
  grade: "First Class Honours",
  modules: [
    "GIS (Geographic Information Systems)",
    "Environmental Impact & Risk Assessment",
    "Research Methods in Geography",
    "Climate Change & Environmental Monitoring",
    "Physical Geography Processes"
  ],
  dissertation: {
    title: "An Assessment of Winter Storm Damage at Telscombe Cliffs Using UAV-SfM Photogrammetry",
    points: [
      {
        category: "Spatial Analysis",
        description: "Conducted DEM of Difference (DoD) analysis in ArcGIS/QGIS to quantify volumetric cliff erosion, applying a strict ±LoD Level of Detection (LoD) threshold to isolate true geomorphic change from sensor noise."
      },
      {
        category: "Environmental Modelling",
        description: "Integrated hydrodynamic wave buoy and tidal gauge data to calculate cumulative excess wave energy proxies (∑E)."
      },
      {
        category: "Statistical Insights",
        description: "Utilized lagged linear regression to prove that 67% (R² = 0.67) of cliff erosion variability is caused by antecedent storm conditions (1-month lag), providing actionable insights for coastal Shoreline Management Plans (SMPs)."
      }
    ]
  }
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "Landmark Information Group (Argyll Branch)",
    branch: "Argyll Branch",
    period: "June 2025 – July 2025",
    role: "Environmental & Planning Risk Consultant (Placement)",
    isPlacement: true,
    points: [
      "Produced technical Residential Agricultural Land Reports (RALR) using QGIS, identifying environmental liabilities and flood zone designations for legal stakeholders.",
      "Evaluated site variability for land and property transactions using professional geospatial tools (Ordnance Survey MasterMap).",
      "Supported the early stages of land acquisition by presenting data-driven planning strategies to residents and legal firms.",
      "Developed a robust understanding of UK planning regulations and environmental due diligence."
    ]
  },
  {
    company: "Dobbies Garden Centre",
    period: "July 2024 – August 2025",
    role: "Customer Advisor (Part-Time)",
    points: [
      "Balanced part-time employment with full-time degree studies, managing complex inventory data and training new staff on POS systems during a major expansion phase."
    ]
  },
  {
    company: "Hilton DoubleTree",
    period: "August 2022 – May 2023",
    role: "Hotel Receptionist",
    points: [
      "Managed front-desk operations using the ONQ booking system, reconciling funds, resolving high-pressure customer conflicts, and executing emergency/fire safety protocols."
    ]
  }
];

export const TARGET_COMPANIES: TargetCompany[] = [
  {
    name: "Ecology by Design",
    type: "Environmental",
    location: "Chalgrove, Oxford",
    description: "A well-regarded ecological consultancy specializing in biodiversity net gain (BNG) and habitat mapping.",
    alignment: "Perfect fit for spatial mapping support in biodiversity net gain (BNG) assessments and habitat modeling using QGIS, aligning with Isabella's Landmark experience."
  },
  {
    name: "Zephyr Environmental Ltd",
    type: "Environmental",
    location: "Summertown, Oxford",
    description: "An environmental consultancy focused on environmental impact assessments and spatial data analysis.",
    alignment: "Leverages Isabella's strong understanding of environmental due diligence, flood risk modeling, and advanced spatial statistics to compile high-quality environmental statements."
  },
  {
    name: "Windrush Ecology",
    type: "Environmental",
    location: "Wallingford, near Reading/Oxford",
    description: "A leading ecology-focused firm that utilizes environmental mapping as a core tool to assess constraints.",
    alignment: "Directly matches Isabella's ability to map environmental constraints and due diligence indicators, using Ordnance Survey integration to outline ecological habitats and barriers."
  },
  {
    name: "ET Planning",
    type: "Planning",
    location: "Oxford",
    description: "Town planning consultants who frequently require visual constraint mapping (flood risk, heritage sites, etc.) for planning applications.",
    alignment: "Matches Isabella's experience in mapping flood zones and historic landmarks to support planning consent and overcome objections with visual geographical evidence."
  },
  {
    name: "John Phillips Planning Consultancy (JPPC)",
    type: "Planning",
    location: "Oxford",
    description: "A prominent planning firm where geospatial data presentation is key to overcoming planning objections and detailing site suitability.",
    alignment: "Perfect for Isabella's QGIS capabilities, helping developers visualize land restrictions and property transaction viability with detailed maps."
  },
  {
    name: "Mark Doodes Planning",
    type: "Planning",
    location: "Faringdon, near Oxford/Reading",
    description: "Focuses on rural and urban town planning, relying heavily on environmental constraints analysis.",
    alignment: "Isabella's direct experience creating Residential Agricultural Land Reports (RALRs) and assessing UK planning frameworks is highly applicable here for rural land subdivisions."
  },
  {
    name: "Fuller Long Planning Consultants",
    type: "Planning",
    location: "Oxford",
    description: "A multi-disciplinary planning and heritage consultancy requiring mapping to demonstrate development impacts on the surrounding environment.",
    alignment: "Enables Isabella to apply her remote sensing, terrain modeling, and spatial mask analysis to demonstrate physical and historical constraints visually to councils and clients."
  }
];

export const AFFILIATIONS = [
  {
    title: "Student Member",
    organization: "Royal Geographical Society (RGS)",
    detail: "Actively involved in regional geographical lectures and networking within the environmental sector."
  },
  {
    title: "ArcGIS for Personal Use Licence",
    organization: "Esri UK",
    detail: "Includes access to ArcGIS Pro Advanced, Spatial Analyst, 3D Analyst, and the full Esri Training e-Learning catalogue for constant self-improvement."
  },
  {
    title: "Key Qualifications",
    organization: "Professional Credentials",
    detail: "Full Clean UK Driving License (2 years); "
  }
];
