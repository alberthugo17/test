import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildComparisonExportPayload,
  computeOxideMatchPercentage,
  computeSimilarityScore,
  filterAnalogSites,
  formatCoordinates,
} from './geology';
import { ANALOG_SITES } from '../data/analogSites';

test('computeSimilarityScore returns weighted score within 0-100 range', () => {
  const score = computeSimilarityScore({
    mineralogy: 92,
    geomorphology: 88,
    regolithMechanics: 85,
    thermalAndIce: 90,
    isruPotential: 94,
    fieldAccessibility: 70,
  });
  assert.equal(score, 88.2);
});

test('computeOxideMatchPercentage returns 100 for identical oxide compositions', () => {
  const score = computeOxideMatchPercentage([
    { oxide: 'Silika', formula: 'SiO2', earthWtPercent: 48.2, targetWtPercent: 48.2 },
    { oxide: 'Alumina', formula: 'Al2O3', earthWtPercent: 16.5, targetWtPercent: 16.5 },
  ]);
  assert.equal(score, 100);
});

test('computeOxideMatchPercentage decreases as compositional divergence grows', () => {
  const close = computeOxideMatchPercentage([
    { oxide: 'Silika', formula: 'SiO2', earthWtPercent: 48.0, targetWtPercent: 49.0 },
  ]);
  const distant = computeOxideMatchPercentage([
    { oxide: 'Silika', formula: 'SiO2', earthWtPercent: 40.0, targetWtPercent: 52.0 },
  ]);
  assert.ok(close > distant);
});

test('filterAnalogSites separates moon and mars analogs cleanly', () => {
  const moonSites = filterAnalogSites(ANALOG_SITES, {
    targetBody: 'moon',
    category: 'all',
    query: '',
  });
  const marsSites = filterAnalogSites(ANALOG_SITES, {
    targetBody: 'mars',
    category: 'all',
    query: '',
  });
  assert.equal(moonSites.length, 6);
  assert.equal(marsSites.length, 6);
  assert.ok(moonSites.every((s) => s.targetBody === 'moon'));
  assert.ok(marsSites.every((s) => s.targetBody === 'mars'));
});

test('filterAnalogSites filters by category and search query', () => {
  const results = filterAnalogSites(ANALOG_SITES, {
    targetBody: 'mars',
    category: 'lacustrine',
    query: 'Jezero',
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'lake-salda-jezero');
});

test('formatCoordinates formats northern/southern and eastern/western hemispheres', () => {
  assert.equal(formatCoordinates([46.6, -81.15]), '46.600° LU, 81.150° BB');
  assert.equal(formatCoordinates([-24.08, 162.52]), '24.080° LS, 162.520° BT');
});

test('every analog site has valid polygon coordinates and clickable HTTPS references', () => {
  for (const site of ANALOG_SITES) {
    assert.ok(site.polygon.length >= 4, `${site.id} should have a closed-form polygon`);
    assert.ok(site.references.length >= 2, `${site.id} should have at least 2 references`);
    for (const ref of site.references) {
      assert.ok(ref.url.startsWith('https://'), `${ref.id} URL must use HTTPS`);
    }
    const payload = buildComparisonExportPayload(site);
    assert.ok(payload.quantitativeMetrics.overallSimilarityIndex > 60);
  }
});
