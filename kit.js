/* Shared toolkit for the phonics apps: mascot, confetti, sounds, English voice, pure letter sounds. */
(function(){
const COLORS=["#ff5d73","#ffb020","#22c7b8","#4f8bff","#a66bff","#3fc35a"];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
document.body.insertAdjacentHTML("afterbegin",`<a href="home.html" id="homeBtn" aria-label="Home" style="position:fixed;top:calc(10px + env(safe-area-inset-top));left:10px;z-index:15;width:52px;height:52px;border-radius:18px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;text-decoration:none;box-shadow:0 5px 0 rgba(0,0,0,.18)">🏠</a><div class="bubbles" id="bubbles"></div><canvas id="fx"></canvas>`);
const bb=document.getElementById("bubbles");
for(let i=0;i<14;i++){const s=document.createElement("span"),z=20+Math.random()*70;
  s.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${10+Math.random()*14}s;animation-delay:${-Math.random()*20}s`;bb.appendChild(s)}
/* sfx */
let ac;function tone(f,d,type="sine",w=0,vol=.15){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f,ac.currentTime+w);g.gain.setValueAtTime(vol,ac.currentTime+w);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+w+d);
  o.connect(g);g.connect(ac.destination);o.start(ac.currentTime+w);o.stop(ac.currentTime+w+d+.02)}catch(e){}}
const pop=()=>{tone(520,.12,"triangle");tone(880,.14,"triangle",.07)},fanfare=()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,"triangle",i*.12)),buzz=()=>tone(160,.25,"sawtooth",0,.08);
/* confetti */
const cv=document.getElementById("fx"),cx=cv.getContext("2d");let parts=[],running=false;
function size(){cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}size();addEventListener("resize",size);
function burst(x,y,n=36){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=3+Math.random()*7;
  parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,r:4+Math.random()*6,c:COLORS[i%6],rot:Math.random()*6,vr:(Math.random()-.5)*.4,life:90+Math.random()*40})}
  if(!running){running=true;requestAnimationFrame(loop)}}
function loop(){cx.clearRect(0,0,innerWidth,innerHeight);parts=parts.filter(p=>p.life-->0&&p.y<innerHeight+40);
  for(const p of parts){p.vy+=.25;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=p.c;cx.globalAlpha=Math.min(1,p.life/30);cx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);cx.restore()}
  if(parts.length)requestAnimationFrame(loop);else{running=false;cx.clearRect(0,0,innerWidth,innerHeight)}}
const burstAt=el=>{const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)};
const rain=()=>{for(let i=0;i<120;i++)setTimeout(()=>burst(Math.random()*innerWidth,-10,1),i*12)};
/* English voice */
let voice=null;function pv(){const v=speechSynthesis.getVoices();voice=v.find(x=>/en[-_]GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null}
if("speechSynthesis" in window){pv();speechSynthesis.onvoiceschanged=pv}
let curAudio=null;
function play(src){try{speechSynthesis.cancel();if(curAudio)curAudio.pause();curAudio=new Audio(src);curAudio.play()}catch(e){}}
function say(t,rate=.8){const k=String(t).trim().toLowerCase();if(WORDA[k])return play(WORDA[k]);try{if(curAudio)curAudio.pause();speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-GB";if(voice)u.voice=voice;u.rate=rate;speechSynthesis.speak(u)}catch(e){}}
/* pure letter sounds: parent's recordings (audio/phonics.enc, keys a..z) when available, otherwise a close approximation */
window.PHON={};window.WORDA={};
/* teacher-style recordings: pure sounds (/k/ not "kuh") and whole words, Kokoro "Zephyr" voice from github.com/OscarIvanEstrada/phonics-teacher (MIT) */
fetch("audio/phonics.json").then(r=>r.json()).then(j=>{Object.assign(PHON,j.sounds);Object.assign(WORDA,j.words)}).catch(()=>{});
const APPROX={a:"a",b:"buh",c:"kuh",d:"duh",e:"eh",f:"fff",g:"guh",h:"huh",i:"ih",j:"juh",k:"kuh",l:"lll",m:"mmm",n:"nnn",o:"o",p:"puh",q:"kwuh",r:"rrr",s:"sss",t:"tuh",u:"uh",v:"vvv",w:"wuh",x:"ks",y:"yuh",z:"zzz"};
function sound(ch){ch=ch.toLowerCase();if(PHON[ch])play(PHON[ch]);else say(APPROX[ch]||ch,.7)}
/* sound out a word: c... a... t... cat */
function blend(word,onStep){const L=[...word];L.forEach((c,i)=>setTimeout(()=>{sound(c);onStep&&onStep(i)},i*800));setTimeout(()=>{say(word,.75);onStep&&onStep(-1)},L.length*800+350)}
/* mascot */
let sayT,hi="";
function talk(t){const s=document.getElementById("say"),p=document.getElementById("pip");if(!s)return;s.textContent=t;s.classList.remove("pop");void s.offsetWidth;s.classList.add("pop");
  p.classList.remove("jump");void p.offsetWidth;p.classList.add("jump");clearTimeout(sayT);sayT=setTimeout(()=>s.textContent=hi,6000)}
function mascot(text){hi=text;document.querySelector("main").insertAdjacentHTML("afterbegin",`<div class="mascotWrap"><svg id="pip" viewBox="0 0 100 100">
  <path d="M50 6 L62 36 L94 38 L69 58 L77 90 L50 72 L23 90 L31 58 L6 38 L38 36 Z" fill="#ffe066" stroke="#e0a800" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="41" cy="48" r="5" fill="#2b2340"/><circle cx="59" cy="48" r="5" fill="#2b2340"/><circle cx="43" cy="46" r="1.8" fill="#fff"/><circle cx="61" cy="46" r="1.8" fill="#fff"/>
  <circle cx="34" cy="58" r="4" fill="#ff8fab" opacity=".7"/><circle cx="66" cy="58" r="4" fill="#ff8fab" opacity=".7"/>
  <path d="M42 59 Q50 67 58 59" fill="none" stroke="#2b2340" stroke-width="3.5" stroke-linecap="round"/></svg><div class="bubble" id="say">${text}</div></div>`);
  const t=document.querySelector("h1");if(t)document.querySelector("main").prepend(t);
  document.getElementById("pip").onclick=e=>{pop();talk(rnd(PRAISE));burstAt(e.currentTarget)}}
const PRAISE=["Amazing!","Well done!","Super star!","Brilliant!","You got it!","Fantastic!","High five! ✋"];
/* modals close */
document.addEventListener("click",e=>{const m=e.target.closest(".modal");if(m&&(e.target===m||e.target.hasAttribute("data-close"))){m.classList.remove("show");try{speechSynthesis.cancel()}catch(x){}}});
/* progress per child */
function store(key){let d={};try{d=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){}return{d,save(){try{localStorage.setItem(key,JSON.stringify(d))}catch(e){}}}}
window.KIT={COLORS,rnd,shuffle,tone,pop,fanfare,buzz,burst,burstAt,rain,say,sound,blend,talk,mascot,PRAISE,store};
})();
