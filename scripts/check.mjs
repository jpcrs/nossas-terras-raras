import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sources,metrics,minerals,projects,rareEarths} from '../dist/data.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
assert.equal(minerals.length,15);assert.equal(rareEarths.length,17);assert.equal(projects.length,7);
for(const m of metrics){assert.equal(m.values.length,3);for(const n of m.values)assert(n===null||Number.isFinite(n)&&n>=0);assert(m.source||sources[m.sourceKey]);}
for(const p of projects){assert(sources[p.source]);assert(p.date&&p.status&&p.resource);assert(!p.coord,'Maps must use official municipal references');}
for(const s of Object.values(sources))assert.equal(new URL(s.url).protocol,'https:');
assert.equal(metrics.find(m=>m.id==='ree-r').values[0],11);
assert.equal(metrics.find(m=>m.id==='li-p').values[2],null);
assert.equal(metrics.find(m=>m.id==='nb-p').values[2],0);
assert.equal(JSON.parse(read('dist/assets/brazil-states.geojson')).features.length,27);
assert.equal(JSON.parse(read('dist/assets/project-municipalities.geojson')).features.length,5);
const snapshot=JSON.parse(read('dist/data-snapshot.json'));assert.deepEqual(snapshot.metrics,metrics);assert.equal(snapshot.mapping.scale100000,28);
for(const name of ['index.html','style.css','app.js','chapters.js','diagrams.js','maps.js','assets/sgb-coverage-2025.png'])assert(fs.existsSync(new URL('../dist/'+name,import.meta.url)));
console.log('Passed: dataset shape, 15 mineral profiles, 17 rare-earth elements, 7 projects, null/zero semantics, USGS revision, dated mapping coverage, IBGE geometry, snapshot consistency and static assets.');
