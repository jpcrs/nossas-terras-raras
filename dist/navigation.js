export function initNavigation(){
 const header=document.querySelector('.masthead');
 const toggle=header?.querySelector('.nav-toggle');
 const nav=header?.querySelector('#primary-navigation');
 if(!toggle||!nav)return;
 const mobile=matchMedia('(max-width: 800px)');
 function setOpen(open){
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  header.classList.toggle('nav-open',open);
 }
 toggle.hidden=false;
 header.classList.add('nav-ready');
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 header.querySelector('.brand')?.addEventListener('click',()=>setOpen(false));
 nav.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link||!mobile.matches)return;
  setOpen(false);
  const destination=document.querySelector(link.getAttribute('href'));
  if(destination){
   if(!destination.hasAttribute('tabindex')){
    destination.setAttribute('tabindex','-1');
    destination.addEventListener('blur',()=>destination.removeAttribute('tabindex'),{once:true});
   }
   destination.focus({preventScroll:true});
  }
 });
 header.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){
   event.preventDefault();setOpen(false);toggle.focus();
  }
 });
 document.addEventListener('click',event=>{if(!header.contains(event.target))setOpen(false);});
 header.addEventListener('focusout',event=>{if(!header.contains(event.relatedTarget))setOpen(false);});
 mobile.addEventListener?.('change',()=>{
  const focusWouldHide=mobile.matches&&nav.contains(document.activeElement);
  setOpen(false);
  if(focusWouldHide)toggle.focus();
 });
}
