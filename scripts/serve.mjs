import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist',import.meta.url));
const port=Number(process.env.PORT||4174);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.geojson':'application/geo+json','.png':'image/png','.pdf':'application/pdf','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain'};
const server=http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);});}catch{res.writeHead(400).end();}});
server.on('error',error=>{
  if(error.code==='EADDRINUSE'){
    console.error(`Port ${port} is already in use. Stop the existing server or choose another port, for example:\n  PORT=${port===4180?4181:4180} npm run dev`);
  }else{
    console.error(`Could not start the atlas: ${error.message}`);
  }
  process.exitCode=1;
});
server.listen(port,'127.0.0.1',()=>console.log(`Atlas: http://127.0.0.1:${port}`));
