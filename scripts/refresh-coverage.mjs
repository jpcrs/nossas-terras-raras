// Explicit maintenance command, never run by visitors. Preserve source geometry and metadata.
import fs from 'node:fs';
const file=new URL('../dist/assets/geological-coverage.geojson',import.meta.url);
const current=JSON.parse(fs.readFileSync(file));
const {source,query}=current.metadata;
const response=await fetch(source+'/query?'+new URLSearchParams(query),{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw Error(`SGB HTTP ${response.status}`);
const result=await response.json();
if(result.error||!result.features?.length||result.exceededTransferLimit)throw Error('Incomplete or invalid SGB response; existing snapshot kept.');
for(const f of result.features){if(f.properties.SITUACAO!=='Publicado'||Number(f.properties.ANO_MAPA)>2025)throw Error('Unexpected record; review before updating.');}
result.metadata={...current.metadata,retrieved:new Date().toISOString().slice(0,10)};
fs.writeFileSync(new URL('../dist/assets/geological-coverage.geojson.next',import.meta.url),JSON.stringify(result));
console.log(`Downloaded ${result.features.length} features to geological-coverage.geojson.next. Compare with the published snapshot and update edition dates before replacing it.`);
