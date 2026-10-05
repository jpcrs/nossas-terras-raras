import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as d3 from 'd3';
import {sources,metrics,minerals,projects,rareEarths} from '../dist/data.js';
import {projectFacts,locations,gradePercent,resourceBreakdown,coverageFeatures,normalizeWinding} from '../dist/editorial.js';
import {mineralComparisons} from '../dist/mineral-comparisons.js';
import {applicationExamples} from '../dist/applications-data.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const materialSymbols=new Set([...rareEarths.map(e=>e[0]),...minerals.map(m=>m.symbol)]);
const applicationElements=new Set();
for(const app of applicationExamples){
 assert(sources[app.source]);
 const symbols=new Set();
 for(const material of app.materials){
  assert(material.use&&material.description);
  assert(materialSymbols.has(material.symbol),`Unknown application material: ${material.symbol}`);
  assert(!symbols.has(material.symbol),'Each material is shown only once per application');
  symbols.add(material.symbol);applicationElements.add(material.symbol);
 }
}
for(const [symbol]of rareEarths)assert.equal(applicationElements.has(symbol),symbol!=='Pm','Promethium must remain outside the application examples');
assert.deepEqual(JSON.parse(read('dist/data-snapshot.json')).applicationExamples,applicationExamples);
for(const mineral of minerals){
 const pair=mineralComparisons[mineral.symbol];assert(pair);
 for(const type of ['production','reserve']){const m=pair[type];assert.equal(m.type,type);assert.equal(m.values.length,3);assert(m.values.every(v=>v===null||Number.isFinite(v)&&v>=0));assert(m.source||sources[m.sourceKey]);}
}
assert.deepEqual(JSON.parse(read('dist/data-snapshot.json')).mineralComparisons,mineralComparisons);
assert.equal(minerals.length,15);assert.equal(rareEarths.length,17);assert.equal(projects.length,7);
for(const m of metrics){assert.equal(m.values.length,3);for(const n of m.values)assert(n===null||Number.isFinite(n)&&n>=0);assert(m.source||sources[m.sourceKey]);}
for(const p of projects){assert(sources[p.source]);assert(p.date&&p.status&&p.resource);assert(!p.coord,'Municipal references must not masquerade as deposit coordinates');const f=projectFacts[p.id];assert(f);assert.equal(f.elements.every(e=>p.key.includes(e)),true);}
for(const s of Object.values(sources)){if(s.url.startsWith('assets/'))assert(fs.existsSync(new URL('../dist/'+s.url,import.meta.url)));else assert.equal(new URL(s.url).protocol,'https:');}
assert.equal(metrics.find(m=>m.id==='ree-r').values[0],21);
assert.equal(metrics.find(m=>m.id==='li-p').values[2],null);
assert.equal(metrics.find(m=>m.id==='nb-p').values[2],0);
assert.equal(gradePercent(2317),.2317);assert.equal(gradePercent(null),null);
assert.deepEqual(resourceBreakdown('caldeira'),{measuredIndicated:703,inferred:928,total:1631});
assert.equal(resourceBreakdown('araxa'),null,'Contained oxide units must not be treated as material tonnage');
assert.equal(projectFacts.morro.amount,null);assert.equal(projectFacts.pitinga.amount,null);
const states=JSON.parse(read('dist/assets/brazil-states.geojson'));
const towns=JSON.parse(read('dist/assets/project-municipalities.geojson'));
assert.equal(states.features.length,27);assert.equal(towns.features.length,5);
for(const p of projects)assert(towns.features.some(f=>String(f.properties.codarea)===projectFacts[p.id].municipality));
assert.equal(locations.find(l=>l.code==='3151800').ids.length,3);
// RFC 7946 and D3 use opposite winding conventions. Incorrect winding paints the entire globe.
for(const collection of [states,towns]){const before=JSON.stringify(collection);const fixed=normalizeWinding(collection,d3);assert.equal(JSON.stringify(collection),before);for(const f of fixed.features){assert(d3.geoArea(f)<1);const [[west,south],[east,north]]=d3.geoBounds(f);assert(west>-75&&east<-30&&south>-35&&north<6);}}
const coverage=JSON.parse(read('dist/assets/geological-coverage.geojson'));
assert.equal(coverage.features.length,874);assert(!coverage.exceededTransferLimit);
assert.equal(coverage.metadata.retrieved,'2026-10-05');assert.match(coverage.metadata.source,/geoportal\.sgb\.gov\.br/);
const expected={100000:511,250000:318,1000000:45};
for(const [scale,count]of Object.entries(expected)){assert.equal(coverageFeatures(coverage,scale).length,count);assert.equal(coverageFeatures(coverage,scale,1969).length,0);assert(coverageFeatures(coverage,scale,2000).length<count);}
assert.equal(new Set(coverage.features.map(f=>f.id)).size,coverage.features.length);
for(const f of coverage.features){assert.equal(f.properties.SITUACAO,'Publicado');assert(Number(f.properties.ANO_MAPA)<=2025);assert(f.geometry.coordinates.length);}
const snapshot=JSON.parse(read('dist/data-snapshot.json'));assert.deepEqual(snapshot.metrics,metrics);assert.equal(snapshot.mapping.scale100000,28);assert.deepEqual(snapshot.projectFacts,projectFacts);assert.equal(snapshot.mapping.polygons.features,874);
for(const name of ['index.html','style.css','app.js','editorial.js','applications.js','applications.css','applications-data.js','mineral-comparisons.js','maps.js','vendor/d3.min.js','vendor/D3-LICENSE','assets/fonts/fonts.css'])assert(fs.existsSync(new URL('../dist/'+name,import.meta.url)));
console.log('Passed: source provenance, 17 indicators, null/zero semantics, grade conversion, resource classes, 27 states, 5 municipal references, D3 polygon winding, 874 published SGB sheets, time/scale filters, snapshot consistency and static assets.');
