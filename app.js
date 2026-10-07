(() => {
 const projects=window.projects;
 const $=s=>document.querySelector(s);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const image=(p,i)=>`assets/${p.slug}-${i}.webp`;
 const dialog=$('#project-dialog');
 let selected=0,lastFocus=null;
 const intro=$('#intro');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 projects.slice(0,8).forEach((p,i)=>{
  const still=document.createElement('img');still.src=image(p,p.cover);still.alt='';
  still.style.setProperty('--frame',i);$('.intro-collage').append(still);
 });
 function dismiss(){intro.classList.add('dismissed');intro.inert=true;try{sessionStorage.setItem('jemina-intro-v2','seen')}catch{}}
 $('#skip-intro').onclick=dismiss;
 try{if(reducedMotion||sessionStorage.getItem('jemina-intro-v2'))dismiss();else setTimeout(dismiss,4800)}catch{setTimeout(dismiss,reducedMotion?0:4800)}
 const featured=projects.slice(0,5);
 featured.forEach((p,i)=>{
  const button=document.createElement('button');button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label',`Feature ${p.title}`);button.setAttribute('aria-pressed',i===0);
  button.onclick=()=>feature(i);$('.hero-controls').append(button);
 });
 function feature(i){selected=i;const p=featured[i];$('#hero-image').src=image(p,p.cover);$('#hero-image').alt=`Film still from ${p.title}`;$('#hero-number').textContent=`${String(i+1).padStart(2,'0')} / 05`;$('#hero-project').innerHTML=`${esc(p.title)} <span>Explore the film</span>`;$('.hero-controls').querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i))}
 $('#hero-project').onclick=()=>openProject(featured[selected].slug);
 const roles=['All','Producing','Directing','Cinematography','Editing','Virtual Production'];
 roles.forEach(role=>{const b=document.createElement('button');b.textContent=role;b.setAttribute('aria-pressed',role==='All');b.onclick=()=>filter(role);$('.filters').append(b)});
 function filter(role){$('.filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.textContent===role));let count=0;$('#gallery').querySelectorAll('button').forEach((b,i)=>{b.hidden=role!=='All'&&!projects[i].roles.includes(role);if(!b.hidden)count++});$('#results').textContent=`${count} projects shown for ${role}`}
 projects.forEach((p,i)=>{
  const b=document.createElement('button');b.className='project-card';b.setAttribute('aria-label',`Explore ${p.title}, ${p.credit}`);b.innerHTML=`<div class="image-wrap"><img src="${image(p,p.cover)}" alt="Film still from ${esc(p.title)}" loading="lazy"><span>Explore project</span></div><div class="metadata"><div><h3>${esc(p.title)}</h3><span class="credit">${esc(p.credit)}</span></div><span class="number">${String(i+1).padStart(2,'0')}</span></div>`;b.onclick=()=>openProject(p.slug);$('#gallery').append(b);
  const frame=document.createElement('button');frame.innerHTML=`<img src="${image(p,p.cover)}" alt="" loading="lazy"><span>${esc(p.title)}</span>`;frame.onclick=()=>openProject(p.slug);$('#filmstrip').append(frame);
 });
 function render(p){
  $('#project-content').innerHTML=`<article class="project-detail"><span class="eyebrow">${esc(p.format)}</span><h2 id="project-title">${esc(p.title)}</h2><span class="credit">${esc(p.credit)}</span><img class="detail-cover" src="${image(p,p.cover)}" alt="Film still from ${esc(p.title)}"><p class="logline">${esc(p.logline)}</p><div class="watch-actions">${p.request?`<a href="mailto:jemina.b.garcia@gmail.com?subject=${encodeURIComponent("Screening request: "+p.title)}">Request screening</a>`:`<button id="play-film">Watch film</button>`}${p.link?`<a href="${p.link}" target="_blank" rel="noopener">Open film in new tab</a>`:''}</div><div class="player" id="player"></div><div class="detail-sections"><article><h3>THE IDEA</h3><p>${esc(p.idea)}</p></article><article><h3>THE APPROACH</h3><p>${esc(p.approach)}</p></article><article><h3>MY ROLE</h3><p>${esc(p.role)}</p></article></div><div class="detail-stills">${p.images.filter(i=>i!==p.cover).map(i=>`<img src="${image(p,i)}" alt="Additional still from ${esc(p.title)}" loading="lazy">`).join('')}</div><div class="detail-next"><button id="previous-project">Previous project</button><button id="next-project">Next project</button></div></article>`;
  if($('#play-film')) $('#play-film').onclick=()=>{const player=$('#player');player.innerHTML=p.local?`<video controls playsinline preload="metadata" poster="${image(p,p.cover)}" aria-label="${esc(p.title)} film"><source src="${p.local}" type="video/mp4">Your browser cannot play this video. <a href="${p.local}">Download the film</a>.</video>`:`<iframe src="${p.embed}" title="Watch ${esc(p.title)}" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe><p>If playback is unavailable or requires access, use “Open film in new tab” above.</p>`;$('#play-film').disabled=true;$('#play-film').textContent='Film player opened';player.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'})};
  const index=projects.indexOf(p);$('#previous-project').onclick=()=>openProject(projects[(index-1+projects.length)%projects.length].slug);$('#next-project').onclick=()=>openProject(projects[(index+1)%projects.length].slug);dialog.scrollTop=0;
 }
 function openProject(slug){const p=projects.find(p=>p.slug===slug);if(!p)return;if(!dialog.open){lastFocus=document.activeElement;dialog.showModal();document.body.style.overflow='hidden'}render(p);history.replaceState(null,'',`#project/${slug}`);$('#close-dialog').focus()}
 function close(){dialog.close();document.body.style.overflow='';$('#project-content').innerHTML='';history.replaceState(null,'','#work');lastFocus?.focus()}
 $('#close-dialog').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}});
 $('#vp-open').onclick=()=>openProject('flash-forward');$('.vp-image').onclick=()=>openProject('flash-forward');
 function fromHash(){if(location.hash.startsWith('#project/')){dismiss();openProject(location.hash.slice(9))}}fromHash();addEventListener('hashchange',fromHash);
})();
