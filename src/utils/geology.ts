import type {
  AnalogSite,
  GeologyCategory,
  OxideReading,
  SimilarityAxes,
  TargetBody,
} from '../types/analog';

export function computeSimilarityScore(axes: SimilarityAxes): number {
  const weights: Record<keyof SimilarityAxes, number> = {
    mineralogy: 0.24,
    geomorphology: 0.22,
    regolithMechanics: 0.16,
    thermalAndIce: 0.16,
    isruPotential: 0.14,
    fieldAccessibility: 0.08,
  };

  const weightedSum =
    axes.mineralogy * weights.mineralogy +
    axes.geomorphology * weights.geomorphology +
    axes.regolithMechanics * weights.regolithMechanics +
    axes.thermalAndIce * weights.thermalAndIce +
    axes.isruPotential * weights.isruPotential +
    axes.fieldAccessibility * weights.fieldAccessibility;

  return Math.round(weightedSum * 10) / 10;
}

export function computeOxideMatchPercentage(oxides: OxideReading[]): number {
  if (oxides.length === 0) return 0;
  const sumSquaredDiff = oxides.reduce((acc, row) => {
    const diff = row.earthWtPercent - row.targetWtPercent;
    return acc + diff * diff;
  }, 0);
  const rmse = Math.sqrt(sumSquaredDiff / oxides.length);
  // Normalize RMSE into a 0-100 compositional similarity index (0% diff = 100%, 25% RMSE = 0%)
  const score = Math.max(0, Math.min(100, 100 - rmse * 4));
  return Math.round(score * 10) / 10;
}

export interface SiteFilterOptions {
  targetBody: TargetBody;
  category: GeologyCategory | 'all';
  query: string;
}

export function filterAnalogSites(
  sites: AnalogSite[],
  options: SiteFilterOptions
): AnalogSite[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  return sites.filter((site) => {
    if (site.targetBody !== options.targetBody) return false;
    if (options.category !== 'all' && site.category !== options.category) {
      return false;
    }
    if (!normalizedQuery) return true;

    const searchableText = [
      site.earthName,
      site.country,
      site.targetSiteName,
      site.targetRegion,
      site.categoryLabel,
      ...site.keyMinerals,
      ...site.isruApplications,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function formatCoordinates(coords: [number, number]): string {
  const [lat, lng] = coords;
  const latDir = lat >= 0 ? 'LU' : 'LS';
  const lngDir = lng >= 0 ? 'BT' : 'BB';
  return `${Math.abs(lat).toFixed(3)}° ${latDir}, ${Math.abs(lng).toFixed(3)}° ${lngDir}`;
}

export function buildComparisonExportPayload(site: AnalogSite) {
  return {
    project:
      'Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars',
    exportedAt: new Date().toISOString(),
    targetBody: site.targetBody === 'moon' ? 'Bulan (Moon)' : 'Mars',
    earthAnalog: {
      name: site.earthName,
      country: site.country,
      coordinates: site.coordinates,
      geologyCategory: site.categoryLabel,
      summary: site.earthGeologySummary,
      keyMinerals: site.keyMinerals,
    },
    extraterrestrialTarget: {
      name: site.targetSiteName,
      region: site.targetRegion,
      coordinates: site.targetCoordinates,
      missionContext: site.missionContext,
      summary: site.targetGeologySummary,
    },
    quantitativeMetrics: {
      overallSimilarityIndex: computeSimilarityScore(site.similarityAxes),
      oxideCompositionalMatch: computeOxideMatchPercentage(site.oxideComparison),
      axes: site.similarityAxes,
      oxideComparisonWtPercent: site.oxideComparison,
    },
    isruApplications: site.isruApplications,
    references: site.references,
  };
}
