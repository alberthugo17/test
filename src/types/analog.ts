export type TargetBody = 'moon' | 'mars';

export type GeologyCategory =
  | 'impact'
  | 'volcanic'
  | 'polar-ice'
  | 'lacustrine'
  | 'hyperarid';

export interface OxideReading {
  oxide: string;
  formula: string;
  earthWtPercent: number;
  targetWtPercent: number;
}

export interface SimilarityAxes {
  mineralogy: number;
  geomorphology: number;
  regolithMechanics: number;
  thermalAndIce: number;
  isruPotential: number;
  fieldAccessibility: number;
}

export interface ReferenceEvidence {
  id: string;
  title: string;
  institution: string;
  year: number;
  documentCode: string;
  findingSummary: string;
  url: string;
}

export interface EnvironmentalMetric {
  parameter: string;
  earthValue: string;
  targetValue: string;
  analogRelevance: string;
}

export interface AnalogSite {
  id: string;
  targetBody: TargetBody;
  earthName: string;
  country: string;
  regionLabel: string;
  coordinates: [number, number]; // [lat, lng]
  polygon: [number, number][]; // Geological zone polygon around the analog area
  radiusKm: number;
  category: GeologyCategory;
  categoryLabel: string;
  targetSiteName: string;
  targetRegion: string;
  targetCoordinates: string;
  missionContext: string;
  earthGeologySummary: string;
  targetGeologySummary: string;
  keyMinerals: string[];
  isruApplications: string[];
  tooltipHighlight: string;
  similarityAxes: SimilarityAxes;
  oxideComparison: OxideReading[];
  environmentalMetrics: EnvironmentalMetric[];
  references: ReferenceEvidence[];
}
