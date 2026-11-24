(() => {
const section=document.querySelector('#cinematheque'), launch=document.querySelector('#enter-gallery'), stage=document.querySelector('#cinema-stage'), status=document.querySelector('#cinema-status'), list=document.querySelector('#cinema-list');
const films=window.projects||[]; if(!films.length)return;
let index=0, scene, camera, renderer, group, frame=0, observer, meshes=[], visible=true, active=false, generation=0, THREE;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const title=document.querySelector('#cinema-title');
function select(i){index=(i+films.length)%films.length;title.textContent=films[index].title;list.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',j===index));if(!renderer)stage.style.backgroundImage='linear-gradient(0deg,#1118,transparent),url("assets/'+films[index].slug+'-'+films[index].cover+'.webp")';}
films.forEach((p,i)=>{const b=document.createElement('button');b.textContent=p.title;b.onclick=()=>select(i);list.append(b)});
document.querySelector('#cinema-prev').onclick=()=>select(index-1);
document.querySelector('#cinema-next').onclick=()=>select(index+1);
document.querySelector('#cinema-open').onclick=()=>{location.hash='project/'+films[index].slug};
select(0);
function stop(){generation++;active=false;cancelAnimationFrame(frame);observer?.disconnect();observer=null;if(renderer){scene.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose()}});renderer.dispose();renderer.domElement.remove();renderer=null;}meshes=[];launch.textContent='Enter 3D gallery';select(index);status.textContent='Film preview';}
async function start(){
if(active){stop();return}active=true;const token=++generation;launch.textContent='Exit 3D gallery';status.textContent='Preparing the screening room…';
try{
THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');if(token!==generation)return;
scene=new THREE.Scene();scene.background=new THREE.Color(0x111210);scene.fog=new THREE.FogExp2(0x111210,.045);
camera=new THREE.PerspectiveCamera(47,1,.1,100);camera.position.set(0,1.5,9);
renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
group=new THREE.Group();scene.add(group);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(180,40),new THREE.MeshStandardMaterial({color:0x252622,roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.set(0,-1.7,0);scene.add(floor);
scene.add(new THREE.HemisphereLight(0xffe5b5,0x292b31,2));
const loader=new THREE.TextureLoader();
films.forEach((p,i)=>{const panel=new THREE.Group();panel.position.x=i*6.5;const mat=new THREE.MeshBasicMaterial({color:0xffffff});const screen=new THREE.Mesh(new THREE.PlaneGeometry(5.6,3.15),mat);panel.add(screen);const backing=new THREE.Mesh(new THREE.BoxGeometry(5.72,3.27,.12),new THREE.MeshStandardMaterial({color:0x615b4e,metalness:.65,roughness:.4}));backing.position.z=-.08;panel.add(backing);group.add(panel);meshes.push(panel);loader.load('assets/'+p.slug+'-'+p.cover+'.webp',t=>{if(token!==generation){t.dispose();return}t.colorSpace=THREE.SRGBColorSpace;mat.map=t;mat.needsUpdate=true},undefined,()=>{mat.color.set(0x44443c)})});
const positions=[];for(let i=0;i<220;i++)positions.push((Math.random()-.5)*75,(Math.random()-.5)*10,Math.random()*14-5);
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xe9ddc0,size:.025,transparent:true,opacity:.45})));
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();camera.position.z=camera.aspect<1.2?13:9}
observer=new ResizeObserver(resize);observer.observe(stage);resize();
let x=index*6.5;function tick(){if(!active||token!==generation)return;frame=requestAnimationFrame(tick);if(document.hidden||!visible)return;x+=(index*6.5-x)*(reduced.matches?1:.075);camera.position.x=x;camera.lookAt(x,0,0);meshes.forEach((m,i)=>{m.rotation.y=Math.max(-.35,Math.min(.35,(x-i*6.5)*.045))});renderer.render(scene,camera)}
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();status.textContent='3D unavailable. Film previews remain accessible.'},{once:true});status.textContent='Interactive 3D screening room';tick();
}catch(e){if(token!==generation)return;stop();status.textContent='3D unavailable. Explore the film previews below.'}
}
launch.onclick=start;
if('IntersectionObserver'in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting}).observe(section);
stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1))}});
})();