export interface Project {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  objective: string;
  tools: string[];
  process: string;
  impact: string;
  visualDescription: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface EducationEntry {
  institution: string;
  period: string;
  degree: string;
  grade: string;
  modules: string[];
  dissertation: {
    title: string;
    points: {
      category: string;
      description: string;
    }[];
  };
}

export interface ExperienceEntry {
  company: string;
  branch?: string;
  period: string;
  role: string;
  points: string[];
  isPlacement?: boolean;
}

export interface TargetCompany {
  name: string;
  type: 'Environmental' | 'Planning';
  location: string;
  description: string;
  alignment: string;
}
