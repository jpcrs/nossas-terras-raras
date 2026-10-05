import fs from 'node:fs';
import {sources,metrics,minerals,projects,rareEarths,technologies} from '../dist/data.js';
import {projectFacts} from '../dist/editorial.js';
import {mineralComparisons} from '../dist/mineral-comparisons.js';
import {applicationExamples} from '../dist/applications-data.js';
import {supplyChain} from '../dist/supply-chain-data.js';
const coverage=JSON.parse(fs.readFileSync(new URL('../dist/assets/geological-coverage.geojson',import.meta.url)));
fs.writeFileSync(new URL('../dist/data-snapshot.json',import.meta.url),JSON.stringify({edition:'2026-10-05',countryOrder:['Brasil','China','Estados Unidos'],mapping:{source:'panorama',through:2025,scale100000:28,scale250000:50,note:'Percentuais arredondados; não são cobertura específica da Amazônia. A contagem de folhas vetoriais não mede cobertura nacional.',polygons:{file:'assets/geological-coverage.geojson',features:coverage.features.length,...coverage.metadata}},reserveEditions:{historical:{brazilMtREO:21,source:'reeHistorical'},mayRevision:{brazilMtREO:11,source:'revision',date:'2026-05-27'}},sources,metrics,minerals,projects,projectFacts,rareEarths,technologies,applicationExamples,mineralComparisons,supplyChain},null,2));
console.log('Snapshot updated.');
