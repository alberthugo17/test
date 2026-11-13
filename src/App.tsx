import { useMemo, useState } from 'react';
import { ANALOG_SITES } from './data/analogSites';
import type { AnalogSite, GeologyCategory, TargetBody } from './types/analog';
import { buildComparisonExportPayload, filterAnalogSites } from './utils/geology';
import { Header } from './components/Header';
import { HeroOverview } from './components/HeroOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { SiteSelectorList } from './components/SiteSelectorList';
import { ComparisonPanel } from './components/ComparisonPanel';
import { MethodologySection } from './components/MethodologySection';
import { ReferencesSection } from './components/ReferencesSection';

export default function App() {
  const [targetBody, setTargetBody] = useState<TargetBody>('moon');
  const [activeCategory, setActiveCategory] = useState<GeologyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('haughton-psr-south-pole');
  const [focusRequestTick, setFocusRequestTick] = useState(0);

  const sitesForBody = useMemo(
    () => ANALOG_SITES.filter((site) => site.targetBody === targetBody),
    [targetBody]
  );

  const availableCategories = useMemo<(GeologyCategory | 'all')[]>(() => {
    const unique = new Set<GeologyCategory>();
    sitesForBody.forEach((s) => unique.add(s.category));
    return ['all', ...Array.from(unique)];
  }, [sitesForBody]);

  const filteredSites = useMemo(
    () =>
      filterAnalogSites(ANALOG_SITES, {
        targetBody,
        category: activeCategory,
        query: searchQuery,
      }),
    [targetBody, activeCategory, searchQuery]
  );

  const selectedSite = useMemo(() => {
    return (
      filteredSites.find((s) => s.id === selectedSiteId) ??
      sitesForBody.find((s) => s.id === selectedSiteId) ??
      sitesForBody[0]
    );
  }, [filteredSites, sitesForBody, selectedSiteId]);

  const handleSelectTargetBody = (nextBody: TargetBody) => {
    setTargetBody(nextBody);
    setActiveCategory('all');
    setSearchQuery('');
    const firstForBody = ANALOG_SITES.find((s) => s.targetBody === nextBody);
    if (firstForBody) {
      setSelectedSiteId(firstForBody.id);
    }
  };

  const handleSelectSite = (site: AnalogSite) => {
    setTargetBody(site.targetBody);
    setSelectedSiteId(site.id);
    setFocusRequestTick((t) => t + 1);
  };

  const handleJumpToSiteFromReference = (site: AnalogSite) => {
    setTargetBody(site.targetBody);
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedSiteId(site.id);
    setFocusRequestTick((t) => t + 1);
    document.getElementById('peta-geologi')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusMap = () => {
    setFocusRequestTick((t) => t + 1);
    document.getElementById('peta-geologi')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExportActive = () => {
    const payload = buildComparisonExportPayload(selectedSite);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedSite.id}-analog-report.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const totalMoonSites = ANALOG_SITES.filter((s) => s.targetBody === 'moon').length;
  const totalMarsSites = ANALOG_SITES.filter((s) => s.targetBody === 'mars').length;
  const totalReferences = ANALOG_SITES.reduce((acc, s) => acc + s.references.length, 0);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100">
      <Header
        onExportActive={handleExportActive}
        activeSiteName={selectedSite.earthName}
      />

      <main>
        <HeroOverview
          targetBody={targetBody}
          onSelectTargetBody={handleSelectTargetBody}
          totalMoonSites={totalMoonSites}
          totalMarsSites={totalMarsSites}
          totalReferences={totalReferences}
        />

        {/* Main Interactive Map & Site Selection Workspace */}
        <section
          id="peta-geologi"
          role="tabpanel"
          aria-labelledby={targetBody === 'moon' ? 'tab-moon' : 'tab-mars'}
          className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-7 pb-2"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-8">
              <InteractiveMap
                sites={filteredSites.length > 0 ? filteredSites : sitesForBody}
                selectedSite={selectedSite}
                targetBody={targetBody}
                focusRequestTick={focusRequestTick}
                onSelectSite={handleSelectSite}
              />
            </div>

            <div className="lg:col-span-4">
              <SiteSelectorList
                sites={filteredSites}
                selectedSiteId={selectedSite.id}
                targetBody={targetBody}
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                availableCategories={availableCategories}
                onSelectCategory={setActiveCategory}
                onSearchChange={setSearchQuery}
                onSelectSite={handleSelectSite}
              />
            </div>
          </div>
        </section>

        <ComparisonPanel site={selectedSite} onFocusMap={handleFocusMap} />
        <MethodologySection />
        <ReferencesSection
          sites={ANALOG_SITES}
          onJumpToSite={handleJumpToSiteFromReference}
        />
      </main>

      <footer className="border-t border-slate-800/80 bg-[#05070B] py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars · NASA
            Space Apps Challenge
          </p>
          <p>
            Peta dasar oleh{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 underline underline-offset-4 hover:text-white"
            >
              OpenStreetMap
            </a>{' '}
            melalui Leaflet.js (Gratis Tanpa API Key)
          </p>
        </div>
      </footer>
    </div>
  );
}
