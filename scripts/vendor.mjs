import fs from 'node:fs';
fs.mkdirSync(new URL('../dist/vendor',import.meta.url),{recursive:true});
fs.copyFileSync(new URL('../node_modules/d3/dist/d3.min.js',import.meta.url),new URL('../dist/vendor/d3.min.js',import.meta.url));
fs.copyFileSync(new URL('../node_modules/d3/LICENSE',import.meta.url),new URL('../dist/vendor/D3-LICENSE',import.meta.url));
console.log('D3 bundle and license copied.');
