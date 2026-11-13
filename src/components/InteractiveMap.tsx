import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair, Globe, Layers } from 'lucide-react';
import type { AnalogSite, TargetBody } from '../types/analog';
import { computeSimilarityScore, formatCoordinates } from '../utils/geology';

type BasemapMode = 'osm-dark' | 'osm-standard' | 'opentopo';

interface InteractiveMapProps {
  sites: AnalogSite[];
  selectedSite: AnalogSite;
  targetBody: TargetBody;
  focusRequestTick: number;
  onSelectSite: (site: AnalogSite) => void;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildTooltipHtml(site: AnalogSite, isMoon: boolean): string {
  const score = computeSimilarityScore(site.similarityAxes);
  const accentText = isMoon ? '#7dd3fc' : '#fcd34d';
  const targetLabel = isMoon ? 'Target Basis Bulan' : 'Target Lokasi Mars';
  const minerals = site.keyMinerals.slice(0, 3).map(escapeHtml).join(' · ');

  return `
    <div style="padding: 10px 12px; min-width: 220px; max-width: 290px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
        <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">${escapeHtml(site.country)}</span>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: ${accentText};">
          ${score.toFixed(1)}% analog
        </span>
      </div>
      <div style="font-size: 13px; font-weight: 600; color: #f8fafc; line-height: 1.3; margin-bottom: 4px;">
        ${escapeHtml(site.earthName)}
      </div>
      <div style="font-size: 11.5px; color: #cbd5e1; margin-bottom: 6px; line-height: 1.35;">
        ${escapeHtml(site.tooltipHighlight)}
      </div>
      <div style="border-top: 1px solid rgba(148,163,184,0.18); padding-top: 6px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
        <div><strong style="color: #e2e8f0;">${targetLabel}:</strong> ${escapeHtml(site.targetSiteName)}</div>
        <div style="margin-top: 2px;"><strong style="color: #e2e8f0;">Mineral:</strong> ${minerals}</div>
      </div>
    </div>
  `;
}

export function InteractiveMap({
  sites,
  selectedSite,
  targetBody,
  focusRequestTick,
  onSelectSite,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlaysGroupRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectSite);
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('osm-dark');

  onSelectRef.current = onSelectSite;

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [16, 0],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 14,
      zoomSnap: 0.25,
      worldCopyJump: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    overlaysGroupRef.current = group;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      overlaysGroupRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update keyless tile layer (OpenStreetMap / OpenTopoMap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const tileUrl =
      basemapMode === 'opentopo'
        ? 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution =
      basemapMode === 'opentopo'
        ? 'Data peta © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> · Kontur <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a>'
        : 'Data peta © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> kontributor (Gratis tanpa API)';

    const layer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: basemapMode === 'opentopo' ? 17 : 19,
    });

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [basemapMode]);

  // Render geological polygons, halos, and interactive tooltips
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = overlaysGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const isMoon = targetBody === 'moon';
    const primaryColor = isMoon ? '#38BDF8' : '#F59E0B';
    const selectedBorder = isMoon ? '#BAE6FD' : '#FDE68A';

    sites.forEach((site) => {
      const isSelected = site.id === selectedSite.id;
      const tooltipHtml = buildTooltipHtml(site, isMoon);
      const tooltipOptions: L.TooltipOptions = {
        className: 'geology-hover-tooltip',
        sticky: true,
        direction: site.coordinates[0] > 50 ? 'bottom' : 'top',
        offset: site.coordinates[0] > 50 ? [0, 14] : [0, -10],
        opacity: 1,
      };

      // True geological formation polygon
      const polygon = L.polygon(site.polygon, {
        color: isSelected ? selectedBorder : primaryColor,
        weight: isSelected ? 3 : 2,
        opacity: isSelected ? 1 : 0.85,
        fillColor: primaryColor,
        fillOpacity: isSelected ? 0.36 : 0.2,
      });

      // Regional visibility halo so small craters (e.g. Lonar) remain easily hoverable at global zoom
      const halo = L.circle(site.coordinates, {
        radius: 170000,
        color: isSelected ? selectedBorder : primaryColor,
        weight: isSelected ? 2 : 1,
        dashArray: isSelected ? undefined : '4 4',
        opacity: isSelected ? 0.9 : 0.5,
        fillColor: primaryColor,
        fillOpacity: isSelected ? 0.16 : 0.07,
      });

      // Center precision marker
      const marker = L.circleMarker(site.coordinates, {
        radius: isSelected ? 8 : 6,
        color: '#07090E',
        weight: 2,
        fillColor: isSelected ? selectedBorder : primaryColor,
        fillOpacity: 1,
      });

      const attachInteractions = (layer: L.Path) => {
        layer.bindTooltip(tooltipHtml, tooltipOptions);
        layer.on('mouseover', () => {
          polygon.setStyle({ weight: 3, fillOpacity: 0.42 });
          halo.setStyle({ weight: 2.5, fillOpacity: 0.24 });
        });
        layer.on('mouseout', () => {
          polygon.setStyle({
            weight: isSelected ? 3 : 2,
            fillOpacity: isSelected ? 0.36 : 0.2,
          });
          halo.setStyle({
            weight: isSelected ? 2 : 1,
            fillOpacity: isSelected ? 0.16 : 0.07,
          });
        });
        layer.on('click', () => {
          onSelectRef.current(site);
        });
      };

      attachInteractions(polygon);
      attachInteractions(halo);
      attachInteractions(marker);

      halo.addTo(group);
      polygon.addTo(group);
      marker.addTo(group);
    });
  }, [sites, selectedSite.id, targetBody]);

  // Fit all active analog sites cleanly within HUD-safe padding when targetBody switches or on mount
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || sites.length === 0) return;
    const bounds = L.latLngBounds(sites.map((s) => s.coordinates));
    map.fitBounds(bounds, {
      paddingTopLeft: [40, 76],
      paddingBottomRight: [40, 130],
      maxZoom: 2.5,
      animate: false,
    });
  }, [targetBody]);

  // Smooth flyTo when user requests focus on the selected site
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || focusRequestTick === 0) return;
    map.flyTo(selectedSite.coordinates, 6, { duration: 0.85 });
  }, [focusRequestTick, selectedSite.coordinates]);

  const handleFocusSelected = () => {
    mapInstanceRef.current?.flyTo(selectedSite.coordinates, 7, { duration: 0.85 });
  };

  const handleResetWorld = () => {
    const map = mapInstanceRef.current;
    if (!map || sites.length === 0) return;
    const bounds = L.latLngBounds(sites.map((s) => s.coordinates));
    map.fitBounds(bounds, {
      paddingTopLeft: [40, 76],
      paddingBottomRight: [40, 130],
      maxZoom: 2.5,
      animate: true,
    });
  };

  const isMoon = targetBody === 'moon';

  return (
    <div
      data-testid="leaflet-geology-map"
      className={`relative h-[380px] sm:h-[460px] lg:h-[580px] w-full overflow-hidden rounded-xl border border-slate-800/90 bg-[#0A0F18] ${
        basemapMode === 'osm-dark' ? 'osm-dark-filter' : ''
      }`}
    >
      {/* Leaflet Canvas (no z-0 stacking trap so leaflet-tooltip-pane z-650 floats above HUD) */}
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        aria-label="Peta interaktif OpenStreetMap lokasi analog geologi Bumi"
      />

      {/* Top-left Basemap Layer Switcher (Frosted glass) */}
      <div className="pointer-events-auto absolute top-3 left-3 z-[450] flex flex-wrap items-center gap-1 rounded-lg border border-slate-700/70 bg-[#0A0F1A]/80 p-1 backdrop-blur-md">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 text-[11px] font-medium text-slate-300">
          <Layers className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span>Peta:</span>
        </span>
        {(
          [
            { id: 'osm-dark', label: 'OSM Gelap' },
            { id: 'osm-standard', label: 'OSM Standar' },
            { id: 'opentopo', label: 'Topografi' },
          ] as { id: BasemapMode; label: string }[]
        ).map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setBasemapMode(mode.id)}
            className={`min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              basemapMode === mode.id
                ? 'bg-slate-700/90 text-white'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Bottom-left Active Focus HUD + Zoom Actions (Frosted glass) */}
      <div className="pointer-events-auto absolute bottom-7 left-3 right-3 sm:right-auto z-[450] flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-[#0A0F1A]/80 p-3 backdrop-blur-md sm:max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-400">
              Area Geologi Terpilih · Arahkan kursor pada area peta untuk tooltip
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-100">
              {selectedSite.earthName}
            </p>
            <p className="mt-0.5 font-mono text-[11px] tabular-nums text-slate-300">
              {formatCoordinates(selectedSite.coordinates)} · Analog{' '}
              <span className={isMoon ? 'text-sky-300' : 'text-amber-300'}>
                {selectedSite.targetSiteName}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleFocusSelected}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-100 whitespace-nowrap transition-colors hover:bg-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Zoom ke Lokasi</span>
          </button>
          <button
            type="button"
            onClick={handleResetWorld}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 whitespace-nowrap transition-colors hover:bg-slate-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Lihat Global</span>
          </button>
        </div>
      </div>
    </div>
  );
}
