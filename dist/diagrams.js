// Original vector illustrations. Geometry is explanatory, not a mass or area estimate.
const icons={
 ev:'M3 16V11L7 9 11 4H22L28 10 32 12V18H29M8 18H24M11 5 9 10H26M9 17a3 3 0 1 0 0 .1M27 17a3 3 0 1 0 0 .1',
 wind:'M18 11V24M17 9 14 1 17 0 19 9M18 10 29 12 29 15 18 12M17 11 10 20 7 19 15 10M19 10a2 2 0 1 0 0 .1',
 optics:'M3 2H31V20H3ZM14 20V24M20 20V24M10 24H24M7 6H27V16H7Z',
 fiber:'M2 12H10M25 12H33M10 5H25V19H10ZM13 12c0-9 9-9 9 0s-9 9-9 0',
 laser:'M2 7H21V18H2ZM21 10H25V15H21M25 12H34M9 7V18M5 3V7M16 3V7',
 alloys:'M3 8 22 2 32 9 13 15ZM3 8V14L13 21 32 15V9M13 15V21M3 18 13 25 32 19',
 special:'M7 3V14a10 10 0 0 0 20 0V3H21V14a4 4 0 0 1-8 0V3ZM7 8H13M21 8H27',
 solar:'M6 2H28L33 20H1ZM10 2 8 20M17 2V20M24 2 26 20M4 8H30M3 14H31M17 20V25M10 25H24',
};
export const applicationIcon=id=>`<svg viewBox="0 0 36 28" aria-hidden="true"><path d="${icons[id]}"/></svg>`;
const wheel=(x,y)=>`<circle class="rubber" cx="${x}" cy="${y}" r="34"/><circle class="metal" cx="${x}" cy="${y}" r="22"/><circle class="ink" cx="${x}" cy="${y}" r="6"/>${Array.from({length:8},(_,i)=>`<path class="fine" d="M${x} ${y-8}V${y-19}" transform="rotate(${i*45} ${x} ${y})"/>`).join('')}`;
const motor=(x,y)=>`<g transform="translate(${x} ${y})"><path class="metal" d="M-42-31H29L53-15V28L28 43H-42Z"/><path class="shade" d="M29-31V12L53 28V-15Z"/><ellipse class="metal" cx="-42" cy="6" rx="22" ry="37"/><ellipse class="accent-fill" cx="-42" cy="6" rx="13" ry="25"/><ellipse class="paper" cx="-42" cy="6" rx="6" ry="12"/><path class="fine" d="M-24-22H25M-22-12H25M-21-2H25M-21 8H25M-22 18H25M-25 28H25"/><path class="shaft" d="M-78 6H-48M53 6H73"/></g>`;
export function diagram(type,selected,parts){
 const g=(i,body)=>`<g class="object-part ${selected===i?'chosen':''}" data-part="${i}" role="button" tabindex="0" aria-label="${parts[i].name}" aria-pressed="${selected===i}">${body}</g>`;
 const pin=(i,x,y)=>`<g class="part-pin" transform="translate(${x} ${y})"><circle r="13"/><text text-anchor="middle" y="4">${i+1}</text></g>`;
 let body='';
 if(type==='ev')body=`<ellipse class="ground" cx="295" cy="257" rx="244" ry="13"/>`+
  g(0,`<path class="metal" d="M62 173 94 144 150 129 207 80H355L418 130 489 151 519 181 515 215H476a42 42 0 0 0-83 0H173a42 42 0 0 0-83 0H57Z"/><path class="glass" d="M174 129 218 89H351L402 129Z"/><path class="fine" d="M281 89V132M287 138V197M178 140 177 197M390 139V165M57 182H88M470 165H502M62 201H90M183 200H386"/><path class="white-line" d="M97 151 153 142H414M312 145H328M214 145H230"/>${wheel(132,219)}${wheel(435,219)}${pin(0,210,164)}`)+
  g(1,`<path class="metal" d="M195 243 317 233 375 257 248 273Z"/><path class="shade" d="M195 243V263L248 294 375 277V257L248 273Z"/><path class="fine" d="M218 243 269 269M240 240 292 266M264 239 316 264M287 237 340 261M309 236 363 258"/>${pin(1,279,292)}`)+
  `<path class="guide" d="M433 190 474 257M254 213V234M144 141 119 99"/>`+
  g(3,`<path class="metal" d="M78 55 130 50 154 69 102 76Z"/><path class="shade" d="M78 55V76L102 92 154 85V69L102 76Z"/><path class="fine" d="M100 59 123 57 135 67 112 70Z"/>${pin(3,78,42)}`)+
  g(2,`${motor(500,288)}${pin(2,561,273)}`);
 if(type==='wind')body=`<path class="ground-line" d="M80 323H548"/>`+
  g(2,`<path class="metal" d="M242 128 229 321H268L255 128Z"/><path class="fine" d="M244 164 239 311M235 274H263"/>${pin(2,266,256)}`)+
  g(3,`<path class="cable" d="M252 137V314Q252 331 282 331H432"/><path class="metal" d="M431 308H474V336H431Z"/>${pin(3,471,308)}`)+
  g(1,`<path class="metal" d="M249 113 304 97 348 109V142L280 148 249 135Z"/><path class="shade" d="M304 97V126L348 142V109Z"/><path class="guide" d="M334 120 410 144"/>${motor(474,158)}${pin(1,532,123)}`)+
  g(0,`<path class="metal" d="M244 119 236 25 247 6 253 15 261 110 255 125 178 183 134 206 128 200 214 131 243 122 306 195 314 225 307 230 244 151Z"/><circle class="accent-fill" cx="249" cy="127" r="15"/><circle class="paper" cx="249" cy="127" r="6"/>${pin(0,203,71)}`);
 if(type==='optics')body=
  g(0,`<path class="metal" d="M80 59H372V240H80Z"/><path class="glass" d="M91 70H361V228H91Z"/><path class="shade" d="M201 240V263H251V240M166 274 200 263H252L285 274Z"/>${Array.from({length:9},(_,i)=>`<path class="light-pixel" d="M${112+i*27} 91V203"/>`).join('')}<path class="white-line" d="M106 211 216 103 278 164 347 95"/>${pin(0,79,57)}`)+
  g(1,`<ellipse class="glass" cx="471" cy="159" rx="57" ry="81"/><path class="fine" d="M471 78Q414 159 471 240M471 78Q528 159 471 240"/><path class="light-ray" d="M389 129H433L508 159H573M389 189H433L508 159"/>${pin(1,527,95)}`)+
  g(2,`<ellipse class="metal" cx="476" cy="280" rx="62" ry="16"/><path class="shade" d="M414 280V291Q476 324 538 291V280"/><path class="fine" d="M440 257 451 247M468 251 478 241M496 254 506 244"/>${pin(2,546,288)}`);
 if(type==='fiber')body=`<path class="light-ray" d="M32 170H600"/><text class="diagram-label" x="40" y="141">SINAL ÓPTICO</text><text class="diagram-label" x="472" y="141">AMPLIFICADO</text>`+
  g(0,`<path class="metal" d="M176 96 368 70 438 120V236L246 267 176 216Z"/><path class="shade" d="M176 96 246 143V267L176 216Z"/><path class="glass" d="M246 143 438 120V236L246 267Z"/><path class="coil" d="M151 170H263C365 42 403 270 305 228S294 106 365 152 363 270 302 210 362 139 393 173H486"/><path class="light-ray" d="M486 173H600"/>${pin(0,421,104)}`);
 if(type==='laser')body=
  g(0,`<path class="metal" d="M71 113 289 88 351 130V228L133 261 71 213Z"/><path class="shade" d="M71 113 133 156V261L71 213Z"/><path class="glass" d="M133 156 351 130V228L133 261Z"/><path class="coil" d="M140 198c30-90 150-90 175-22s-137 104-145 17 142-34 139 21"/><path class="metal" d="M351 163 389 159V194L351 200Z"/><path class="light-ray" d="M389 177H583"/><path class="fine" d="M111 267V287M321 245V265"/>${pin(0,112,125)}`)+
  g(1,`<path class="metal" d="M445 69 493 57 517 75V104L469 117 445 100Z"/><path class="accent-fill" d="M460 75 492 68 503 78 471 87Z"/><path class="fine" d="M469 117V145"/>${pin(1,526,63)}`);
 if(type==='alloys')body=
  g(0,`<path class="metal" d="M92 140 348 81 514 178 252 247Z"/><path class="shade" d="M92 140V169L252 279 514 208V178L252 247Z"/><path class="fine" d="M118 150 251 239M143 144 277 232M169 137 303 225M196 132 329 218M221 126 355 211M247 120 381 204M274 114 408 197M301 108 434 190M328 103 461 183"/>${pin(0,147,108)}`)+
  g(1,`<path class="metal" d="M127 228V247L263 331 536 253V234L263 310Z"/><path class="fine" d="M147 264 263 334 516 261"/>${pin(1,525,279)}`);
 if(type==='special')body=
  g(0,`<path class="metal" d="M92 83V203a76 76 0 0 0 152 0V83H198V203a30 30 0 0 1-60 0V83Z"/><path class="accent-fill" d="M92 83H138V136H92ZM198 83H244V136H198Z"/><path class="fine" d="M103 148V202a65 65 0 0 0 130 0V148"/>${pin(0,93,62)}`)+
  g(1,`<path class="metal" d="M348 84H419V147H348Z"/><path class="coil" d="M336 95H431M336 106H431M336 117H431M336 128H431M336 139H431"/><path class="fine" d="M365 84V63M402 147V170"/>${pin(1,443,88)}`)+
  g(2,`<path class="glass" d="M365 238 434 213 493 245V294L424 321 365 289Z"/><path class="fine" d="M365 238 424 271 493 245M424 271V321"/><path class="light-ray" d="M349 219 417 267M445 266 526 222M445 281 544 272"/>${pin(2,505,307)}`);
 if(type==='solar')body=parts.map((p,i)=>g(i,`<path class="${i===1?'glass':'metal'}" d="M${109+i*10} ${40+i*56} ${378+i*10} ${16+i*56} ${505+i*10} ${85+i*56} ${236+i*10} ${113+i*56}Z"/>${i===1?Array.from({length:6},(_,j)=>`<path class="white-line" d="M${148+j*42} ${93-j*3.7} ${262+j*42} ${162-j*4.3}"/>`).join('')+'<path class="white-line" d="M175 123 437 98M207 141 469 115"/>':''}${i===2?'<path class="coil" d="M164 165 276 226 490 204 379 143M220 160 331 220M275 155 386 215M330 150 441 210"/>':''}${pin(i,82+i*10,74+i*56)}`)).join('');
 if(type==='none')body='<g class="unmapped-element"><circle cx="320" cy="175" r="113"/><text x="320" y="190" text-anchor="middle">Pm</text><text class="diagram-label" x="320" y="228" text-anchor="middle">PROMÉCIO · 61</text></g>';
 return `<svg viewBox="0 0 640 355" class="application-diagram" role="group" aria-label="${type==='none'?'Promécio, sem cadeia mineral comum':'Ilustração com componentes selecionáveis'}">${body}</svg>`;
}
