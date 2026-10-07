(() => {
 const projects=window.projects;
 const $=s=>document.querySelector(s);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const image=(p,i)=>`assets/${p.slug}-${i}.webp`;
 const dialog=$('#project-dialog');
 let selected=0,lastFocus=null;
 const intro=$('#intro');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let introFinished=false,introTimer;
 function dismiss(){
  if(introFinished)return;introFinished=true;intro.inert=true;
  intro.classList.add('dismissed');
  try{sessionStorage.setItem('jemina-intro-v7','seen')}catch{}
 }
 $('#skip-intro').onclick=()=>dismiss();
 try{if(reducedMotion||sessionStorage.getItem('jemina-intro-v7'))dismiss();else introTimer=setTimeout(()=>dismiss(),4600)}catch{introTimer=setTimeout(()=>dismiss(),reducedMotion?0:4600)}
 // Small, short-lived stars; no touch trail and no blocked clicks.
 const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
 if(matchMedia('(hover: hover) and (pointer: fine)').matches){
  let lastSpark=0;const sparks=new Set();
  addEventListener('pointermove',event=>{
   if(event.pointerType==='touch'||motionPreference.matches||document.hidden)return;
   const now=performance.now();if(now-lastSpark<45||sparks.size>=24)return;lastSpark=now;
   const spark=document.createElement('span');spark.className='cursor-sparkle';spark.setAttribute('aria-hidden','true');
   spark.style.left=event.clientX+'px';spark.style.top=event.clientY+'px';
   spark.style.setProperty('--drift-x',(Math.random()*20-10)+'px');spark.style.setProperty('--drift-y',(10+Math.random()*18)+'px');
   spark.style.setProperty('--spark-size',(3+Math.random()*4)+'px');
   document.body.append(spark);sparks.add(spark);
   setTimeout(()=>{spark.remove();sparks.delete(spark)},700);
  },{passive:true});
  motionPreference.addEventListener('change',()=>{if(motionPreference.matches){sparks.forEach(s=>s.remove());sparks.clear()}});
 }
 const featured=projects.slice(0,5);
 featured.forEach((p,i)=>{
  const button=document.createElement('button');button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label',`Feature ${p.title}`);button.setAttribute('aria-pressed',i===0);
  button.onclick=()=>feature(i);$('.hero-controls').append(button);
 });
 function feature(i){selected=i;const p=featured[i];$('#hero-image').src=image(p,p.cover);$('#hero-image').alt=`Film still from ${p.title}`;$('#hero-number').textContent=`${String(i+1).padStart(2,'0')} / 05`;$('#hero-project').innerHTML=`${esc(p.title)} <span>Explore the film</span>`;$('.hero-controls').querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i))}
 $('#hero-project').onclick=()=>openProject(featured[selected].slug,$('#hero-image'));
 const roles=['All','Producing','Directing','Cinematography','Editing','Virtual Production'];
 roles.forEach(role=>{const b=document.createElement('button');b.textContent=role;b.setAttribute('aria-pressed',role==='All');b.onclick=()=>filter(role);$('.filters').append(b)});
 function filter(role){$('.filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.textContent===role));let count=0;$('#gallery').querySelectorAll('.project-card').forEach((b,i)=>{b.hidden=role!=='All'&&!projects[i].roles.includes(role);if(!b.hidden)count++});$('#results').textContent=`${count} projects shown for ${role}`}
 projects.forEach((p,i)=>{
  const b=document.createElement('article');b.className='project-card';
  const alternate=p.images.find(n=>n!==p.cover);
  b.innerHTML=`<button class="project-open" aria-label="Explore ${esc(p.title)}, ${esc(p.credit)}"><div class="image-wrap"><img src="${image(p,p.cover)}" alt="Film still from ${esc(p.title)}" loading="lazy">${alternate!==undefined?`<img class="preview-still" src="${image(p,alternate)}" alt="" loading="lazy" aria-hidden="true">`:''}<span>Explore project</span></div><div class="metadata"><div><h3>${esc(p.title)}</h3><span class="credit">${esc(p.credit)}</span></div><span class="number">${String(i+1).padStart(2,'0')}</span></div></button><div class="card-watch">${p.request?`<a href="mailto:jemina.b.garcia@gmail.com?subject=${encodeURIComponent("Screening request: "+p.title)}">Request Screening →</a>`:'<button class="card-play">Watch Film →</button>'}</div>`;
  b.querySelector('.project-open').onclick=()=>openProject(p.slug,b.querySelector('img'));
  if(b.querySelector('.card-play'))b.querySelector('.card-play').onclick=()=>{openProject(p.slug,b.querySelector('img'));$('#play-film')?.click()};
  $('#gallery').append(b);
  const frame=document.createElement('button');frame.innerHTML=`<img src="${image(p,p.cover)}" alt="" loading="lazy"><span>${esc(p.title)}</span>`;frame.onclick=()=>openProject(p.slug,frame.querySelector('img'));$('#filmstrip').append(frame);
 });
 function render(p){
  $('#project-content').innerHTML=`<article class="project-detail"><span class="eyebrow">${esc(p.format)}</span><h2 id="project-title">${esc(p.title)}</h2><span class="credit">${esc(p.credit)}</span><p class="logline">${esc(p.logline)}</p><div class="watch-actions">${p.request?`<a href="mailto:jemina.b.garcia@gmail.com?subject=${encodeURIComponent("Screening request: "+p.title)}">Request screening</a>`:`<button id="play-film">Watch film</button>`}${p.link?`<a href="${p.link}" target="_blank" rel="noopener">Open film in new tab</a>`:''}</div><img class="detail-cover" src="${image(p,p.cover)}" alt="Film still from ${esc(p.title)}"><div class="player" id="player"></div><div class="detail-sections"><article><h3>THE IDEA</h3><p>${esc(p.idea)}</p></article><article><h3>THE APPROACH</h3><p>${esc(p.approach)}</p></article><article><h3>MY ROLE</h3><p>${esc(p.role)}</p></article></div><div class="detail-stills">${p.images.filter(i=>i!==p.cover).map(i=>`<img src="${image(p,i)}" alt="Additional still from ${esc(p.title)}" loading="lazy">`).join('')}</div><div class="detail-next"><button id="previous-project">Previous project</button><button id="next-project">Next project</button></div></article>`;
  if($('#play-film')) $('#play-film').onclick=()=>{const player=$('#player');player.innerHTML=p.local?`<video controls playsinline preload="metadata" poster="${image(p,p.cover)}" aria-label="${esc(p.title)} film"><source src="${p.local}" type="video/mp4">Your browser cannot play this video. <a href="${p.local}">Download the film</a>.</video>`:`<iframe src="${p.embed}" title="Watch ${esc(p.title)}" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe><p>If playback is unavailable or requires access, use “Open film in new tab” above.</p>`;$('#play-film').disabled=true;$('#play-film').textContent='Film player opened';player.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'})};
  const index=projects.indexOf(p);$('#previous-project').onclick=()=>openProject(projects[(index-1+projects.length)%projects.length].slug);$('#next-project').onclick=()=>openProject(projects[(index+1)%projects.length].slug);dialog.scrollTop=0;
 }
 function openProject(slug,source){
  const p=projects.find(p=>p.slug===slug);if(!p)return;
  const origin=source?.getBoundingClientRect();
  if(!dialog.open){lastFocus=document.activeElement;dialog.showModal();document.body.style.overflow='hidden'}
  render(p);history.replaceState(null,'',`#project/${slug}`);$('#close-dialog').focus();
  if(origin&&!motionPreference.matches){
   const target=$('.detail-cover'),dest=target.getBoundingClientRect();
   if(dest.top<innerHeight){
    const clone=source.cloneNode();clone.removeAttribute('loading');clone.alt='';clone.setAttribute('aria-hidden','true');
    clone.className='project-transition';Object.assign(clone.style,{left:origin.left+'px',top:origin.top+'px',width:origin.width+'px',height:origin.height+'px'});
    dialog.append(clone);target.style.opacity='0';
    const animation=clone.animate([{left:origin.left+'px',top:origin.top+'px',width:origin.width+'px',height:origin.height+'px'},{left:dest.left+'px',top:dest.top+'px',width:dest.width+'px',height:dest.height+'px'}],{duration:420,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
    const cleanup=()=>{clone.remove();target.style.opacity=''};animation.finished.then(cleanup,cleanup);
   }
  }
 }
 function close(){dialog.close();document.body.style.overflow='';$('#project-content').innerHTML='';history.replaceState(null,'','#work');lastFocus?.focus()}
 $('#close-dialog').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}});
 $('#vp-open').onclick=()=>openProject('flash-forward');$('.vp-image').onclick=()=>openProject('flash-forward');
 function fromHash(){if(location.hash.startsWith('#project/')){dismiss();openProject(location.hash.slice(9))}}fromHash();addEventListener('hashchange',fromHash);

 // Reveal once, then stop observing: previously seen content stays visible.
 if(!motionPreference.matches && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}
   });
  },{threshold:0,rootMargin:'0px 0px -35px 0px'});
  const targets=document.querySelectorAll('.section-heading,.project-card,.filmstrip-head,.filmstrip,.current-grid article,.portrait,.about-copy,.approach>.eyebrow,.approach-item,.vp>div,.vp-image,footer');
  targets.forEach(element=>{
   if(element.getBoundingClientRect().top<innerHeight-35)return;
   element.classList.add('scroll-reveal');observer.observe(element);
  });
  motionPreference.addEventListener('change',()=>{
   if(motionPreference.matches){observer.disconnect();targets.forEach(element=>element.classList.add('is-revealed'))}
  });
 }

 $('#replay-intro').onclick=()=>{
  if(dialog.open)close();clearTimeout(introTimer);introFinished=false;
  intro.inert=false;intro.classList.remove('dismissed');
  // Restart title animations without changing the visitor's scroll position.
  intro.querySelectorAll('span,i').forEach(element=>{element.style.animation='none';void element.offsetWidth;element.style.animation=''});
  $('#skip-intro').focus();introTimer=setTimeout(()=>{dismiss();$('#replay-intro').focus()},4600);
 };
 const navLinks=[...document.querySelectorAll('nav a')];
 function updateNavigation(){
  let active='#home';const offset=document.querySelector('header').offsetHeight+80;
  for(const id of ['home','work','about','contact']){if(document.getElementById(id).getBoundingClientRect().top<=offset)active='#'+id}
  navLinks.forEach(link=>{if(link.getAttribute('href')===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 }
 let navigationFrame=false;
 addEventListener('scroll',()=>{if(!navigationFrame){navigationFrame=true;requestAnimationFrame(()=>{updateNavigation();navigationFrame=false})}},{passive:true});
 updateNavigation();
})();
