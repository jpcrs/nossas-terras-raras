import fs from 'node:fs';
import {sources,metrics,minerals,projects,rareEarths,technologies} from '../dist/data.js';
fs.writeFileSync(new URL('../dist/data-snapshot.json',import.meta.url),JSON.stringify({edition:'2026-10-05',countryOrder:['Brasil','China','Estados Unidos'],mapping:{source:'panorama',through:2025,scale100000:28,scale250000:50,note:'Percentuais arredondados; não são cobertura específica da Amazônia.'},sources,metrics,minerals,projects,rareEarths,technologies},null,2));
