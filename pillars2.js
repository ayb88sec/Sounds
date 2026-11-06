/* Upgrade for أركان الإسلام and أركان الإيمان: real pictures, "I" sentences, and 5 games.
   Loaded at the end of islam.html / iman.html. Uses that page's ITEMS, COLORS, NUMS, done, talk. */
(function(){
const ISL=/islam\.html/.test(location.pathname),K=ISL?"is":"im";
const BOY=((window.NAJMA&&NAJMA.me)||{}).gender==="m";
const IMG=i=>`img/deen/${K}${i+1}.webp`;
const ME=ISL?[
 ["أَعْتَقِدُ بِقَلْبِي وَأَقُولُ بِلِسَانِي: لَا إِلَهَ إِلَّا اللَّهُ، مُحَمَّدٌ رَسُولُ اللَّهِ.","أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ"],
 ["أُصَلِّي خَمْسَ مَرَّاتٍ فِي اليَوْمِ وَاللَّيْلَةِ، فَهِيَ صِلَةٌ بَيْنِي وَبَيْنَ رَبِّي.","أُقِيمُ الصَّلَاةَ فِي أَوْقَاتِهَا"],
 ["أُخْرِجُ جُزْءًا مِنْ مَالِي لِلْمُحْتَاجِينَ، وَأُسَاعِدُهُمْ.","أُخْرِجُ الزَّكَاةَ مِنْ مَالِي"],
 ["أَمْتَنِعُ عَنِ الطَّعَامِ وَالشَّرَابِ مِنَ الفَجْرِ إِلَى المَغْرِبِ فِي شَهْرِ رَمَضَانَ.","أَصُومُ شَهْرَ رَمَضَانَ"],
 ["أَزُورُ بَيْتَ اللَّهِ الحَرَامَ فِي مَكَّةَ المُكَرَّمَةِ مَرَّةً فِي العُمُرِ لِمَنِ اسْتَطَاعَ.","أَحُجُّ بَيْتَ اللَّهِ الحَرَامَ"]]:[
 ["نُؤْمِنُ بِأَنَّ اللَّهَ هُوَ خَالِقُنَا وَرَبُّنَا، وَنَعْبُدُهُ وَحْدَهُ.","أُؤْمِنُ بِاللَّهِ"],
 ["نُؤْمِنُ بِأَنَّ المَلَائِكَةَ خُلِقُوا مِنْ نُورٍ، لَا يَعْصُونَ اللَّهَ.","أُؤْمِنُ بِالمَلَائِكَةِ"],
 ["نُؤْمِنُ بِأَنَّ اللَّهَ أَنْزَلَ كُتُبَهُ عَلَى رُسُلِهِ لِيَهْدِيَنَا إِلَى الطَّرِيقِ المُسْتَقِيمِ.","أُؤْمِنُ بِالكُتُبِ"],
 ["نُؤْمِنُ بِأَنَّ اللَّهَ أَرْسَلَ رُسُلَهُ لِيُبَلِّغُونَا رِسَالَتَهُ.","أُؤْمِنُ بِالرُّسُلِ"],
 ["نُؤْمِنُ بِالبَعْثِ وَالحِسَابِ وَالجَنَّةِ وَالنَّارِ.","أُؤْمِنُ بِاليَوْمِ الآخِرِ"],
 ["نُؤْمِنُ بِأَنَّ اللَّهَ قَدَّرَ كُلَّ شَيْءٍ بِمَا فِيهِ مِنْ خَيْرٍ وَشَرٍّ.","أُؤْمِنُ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ"]];
const TF=ISL?[["أَرْكَانُ الإِسْلَامِ خَمْسَةٌ.",1],["صَوْمُ رَمَضَانَ مِنْ أَرْكَانِ الإِسْلَامِ.",1],["حَجُّ بَيْتِ اللَّهِ الحَرَامِ يَكُونُ كُلَّ يَوْمٍ.",0],["إِقَامَةُ الصَّلَاةِ مِنْ أَرْكَانِ الإِسْلَامِ.",1],["نُصَلِّي ثَلَاثَ مَرَّاتٍ فِي اليَوْمِ.",0],["الزَّكَاةُ أَنْ نُعْطِيَ المُحْتَاجِينَ مِنْ مَالِنَا.",1]]
 :[["أَرْكَانُ الإِيمَانِ سِتَّةٌ.",1],["المَلَائِكَةُ خُلِقُوا مِنْ نُورٍ.",1],["الإِيمَانُ بِالرُّسُلِ هُوَ الرُّكْنُ الأَوَّلُ.",0],["القُرْآنُ مِنْ كُتُبِ اللَّهِ.",1],["المَلَائِكَةُ يَعْصُونَ اللَّهَ.",0],["نُؤْمِنُ بِالجَنَّةِ وَالنَّارِ.",1]];
const MC=ISL?[["عَدَدُ أَرْكَانِ الإِسْلَامِ",["خَمْسَةٌ","ثَلَاثَةٌ","سَبْعَةٌ"]],["الرُّكْنُ الَّذِي يَكُونُ فِي شَهْرِ رَمَضَانَ هُوَ",["الصَّوْمُ","الحَجُّ","الزَّكَاةُ"]],["الرُّكْنُ الَّذِي فِيهِ زِيَارَةُ الكَعْبَةِ هُوَ",["الحَجُّ","الصَّلَاةُ","الشَّهَادَةُ"]],["إِعْطَاءُ المَالِ لِلْمُحْتَاجِينَ هُوَ",["الزَّكَاةُ","الصَّوْمُ","الشَّهَادَةُ"]],["الرُّكْنُ الأَوَّلُ هُوَ",["الشَّهَادَتَانِ","الحَجُّ","الصَّوْمُ"]]]
 :[["عَدَدُ أَرْكَانِ الإِيمَانِ",["سِتَّةٌ","خَمْسَةٌ","ثَلَاثَةٌ"]],["المَلَائِكَةُ خُلِقُوا مِنْ",["نُورٍ","طِينٍ","مَاءٍ"]],["الرُّكْنُ الرَّابِعُ هُوَ الإِيمَانُ بِـ",["الرُّسُلِ","الكُتُبِ","المَلَائِكَةِ"]],["كِتَابُنَا هُوَ",["القُرْآنُ","الدَّفْتَرُ","القِصَّةُ"]],["الرُّكْنُ الأَوَّلُ هُوَ الإِيمَانُ بِـ",["اللَّهِ","اليَوْمِ الآخِرِ","القَدَرِ"]]];
const AQ=[["aq1","مَنْ رَبُّكَ؟","رَبِّيَ اللَّهُ"],["aq2","مَا دِينُكَ؟","دِينِيَ الإِسْلَامُ"],["aq3","مَنْ نَبِيُّكَ؟","نَبِيِّي مُحَمَّدٌ ﷺ"],["aq4","مَا كِتَابُكَ؟","كِتَابِيَ القُرْآنُ"]];
const sayA=t=>{try{NAJMA.aiSay(t,"ar",.85)}catch(e){}};
let ac;const tone=(f,d=.12,w=0)=>{try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.setValueAtTime(.13,ac.currentTime+w);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+w+d);o.connect(g).connect(ac.destination);o.start(ac.currentTime+w);o.stop(ac.currentTime+w+d+.02)}catch(e){}};
const yay=()=>{tone(660);tone(990,.15,.08)},buzz=()=>tone(170,.22);
const shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const boom=el=>{try{window.burstAt&&burstAt(el)}catch(e){}};
const st=document.createElement("style");st.textContent=`
.col .e img{width:clamp(40px,11vw,64px);height:clamp(40px,11vw,64px);border-radius:14px;border:3px solid rgba(255,255,255,.8);object-fit:cover;display:block}
.cemo img{width:min(64vw,260px);height:min(64vw,260px);border-radius:28px;border:5px solid #fff;box-shadow:0 10px 20px rgba(0,0,0,.18);object-fit:cover}
.cemo{animation:none!important}
.mesay{background:linear-gradient(160deg,#fff6c4,#ffe27a);border:3px solid #fff;border-radius:20px;padding:8px 12px;margin:8px 0;font-weight:800;font-size:clamp(17px,4.2vw,21px);line-height:1.7;cursor:pointer}
.mesay b{display:block;color:#a35f24;font-size:.85em}
.gm{position:fixed;inset:0;z-index:70;background:rgba(70,45,10,.45);display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:calc(20px + env(safe-area-inset-top)) 10px 120px}
.gm.show{display:flex}.gm .card{max-width:620px;width:100%;position:relative}
.gt{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px}
.gt button{border:4px solid #fff;border-radius:26px;padding:14px 8px;font-family:inherit;font-size:clamp(17px,4.2vw,21px);font-weight:800;cursor:pointer;color:#16204a;box-shadow:0 8px 16px rgba(120,80,20,.2)}
.gt button span{display:block;font-size:44px}
.mrow{display:flex;justify-content:space-between;gap:10px;position:relative}.mrow .c{display:flex;flex-direction:column;gap:10px;z-index:2;flex:1}
.mrow button{border:3px solid #ddd;border-radius:18px;background:#fff;font-family:inherit;font-weight:800;font-size:clamp(15px,3.8vw,19px);cursor:pointer;min-height:64px;padding:4px}
.mrow button img{width:58px;height:58px;border-radius:12px;object-fit:cover;display:block;margin:auto}
.mrow button.sel{border-color:#ffb703;background:#fff8d6;transform:scale(1.05)}.mrow button.ok{border-color:#3fc35a;background:#eaffef}
.mrow svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible}.mrow path{fill:none;stroke-width:6;stroke-linecap:round}
.tf{display:flex;align-items:center;gap:10px;background:#fff;border-radius:20px;padding:10px;margin-bottom:8px;text-align:start;font-weight:800;font-size:clamp(16px,4vw,20px)}
.tf span{flex:1}.tf button{width:54px;height:54px;border-radius:16px;border:3px solid #ddd;background:#fff;font-size:26px;cursor:pointer}
.tf button.ok{background:#c9f2d6;border-color:#3fc35a}.tf button.no{animation:sh .35s}@keyframes sh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.mcq{background:#fff;border-radius:20px;padding:10px;margin-bottom:10px}.mcq b{display:block;font-size:clamp(17px,4.2vw,21px);margin-bottom:6px}
.mcq .o{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}.mcq .o button{border:3px solid #ddd;border-radius:999px;background:#fff;padding:6px 14px;font-family:inherit;font-weight:800;font-size:clamp(16px,4vw,20px);cursor:pointer}
.mcq .o button.ok{background:#c9f2d6;border-color:#3fc35a}.mcq .o button.no{animation:sh .35s;opacity:.5}
.stars5{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px 0}
.stars5 button{width:clamp(64px,15vw,90px);height:clamp(64px,15vw,90px);border:0;background:none;cursor:pointer;position:relative;padding:0}
.stars5 button svg{width:100%;height:100%}.stars5 button i{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:800;font-size:22px;padding-top:6px}
.aqc{perspective:900px;cursor:pointer;margin-bottom:12px}.aqc .in{position:relative;height:150px;transition:transform .6s;transform-style:preserve-3d}.aqc.on .in{transform:rotateY(180deg)}
.aqc .f,.aqc .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:24px;display:flex;align-items:center;gap:12px;padding:10px;border:4px solid #fff;box-shadow:0 8px 14px rgba(120,80,20,.18);font-weight:800;font-size:clamp(24px,6vw,32px)}
.aqc .b{transform:rotateY(180deg);background:#c9f2d6;justify-content:center}.aqc img{width:120px;height:120px;border-radius:18px;object-fit:cover}
`;document.head.appendChild(st);
/* 1. pictures on the columns and the card */
document.querySelectorAll(".col").forEach(c=>{const i=+c.dataset.i,e=c.querySelector(".e");if(e)e.innerHTML=`<img src="${IMG(i)}" alt="">`});
const _open=window.openCard;
window.openCard=function(i,el){_open(i,el);const ce=document.getElementById("cEmo");ce.innerHTML=`<img src="${IMG(i)}" alt="">`;
  let m=document.getElementById("mesay");if(!m){m=document.createElement("div");m.id="mesay";m.className="mesay";document.getElementById("cPhrase").after(m)}
  m.innerHTML=`<b>✋ ${ME[i][1]}</b>${ME[i][0]}`;m.onclick=()=>sayA(ME[i][1]+". "+ME[i][0])};
/* 2. games */
const gm=document.createElement("div");gm.className="gm";gm.innerHTML=`<div class="card"><button class="x" id="gmx">✕</button><div id="gmb"></div></div>`;document.body.appendChild(gm);
document.getElementById("gmx").onclick=()=>gm.classList.remove("show");
const N=ITEMS.length,names=ITEMS.map(x=>x[0]);
function menu(){const L=[["🔗","صِلِ الرُّكْنَ بِالصُّورَةِ",match,"#dff1ff"],["✅","صَحٌّ أَمْ خَطَأٌ؟",tf,"#dcf8e8"],["🤔","اخْتَرِ الإِجَابَةَ الصَّحِيحَةَ",mc,"#fff6c4"],["⭐","لَوِّنِ النُّجُومَ",stars,"#efe6ff"]];
  if(!ISL)L.push(["💚","عَقِيدَتِي الجَمِيلَةُ",aqida,"#ffe6d6"]);
  document.getElementById("gmb").innerHTML=`<div class="q">🎮 ${BOY?"اختر":"اختاري"} لعبة</div><div class="gt">${L.map((g,i)=>`<button data-i="${i}" style="background:${g[3]}"><span>${g[0]}</span>${g[1]}</button>`).join("")}</div>`;
  document.querySelectorAll("#gmb .gt button").forEach(b=>b.onclick=()=>L[+b.dataset.i][2]());gm.classList.add("show");gm.scrollTop=0}
const back=`<button class="btn ghost" id="gback" style="margin-top:12px">⬅️ الألعاب</button>`;
const wire=()=>{const b=document.getElementById("gback");if(b)b.onclick=menu};
const fin=t=>{yay();try{window.fanfare&&fanfare();window.rain&&rain()}catch(e){}sayA(t||(BOY?"أَحْسَنْتَ يَا بَطَلُ!":"أَحْسَنْتِ يَا بَطَلَةُ!"))};
function match(){const R=shuf([...Array(N).keys()]);let sel=null,left=N;
  document.getElementById("gmb").innerHTML=`<div class="q">🔗 صِلِ الرُّكْنَ بِالصُّورَةِ</div><div class="mrow" id="mr"><svg id="ml"></svg><div class="c">${names.map((n,i)=>`<button data-l="${i}" style="border-color:${COLORS[i%6]}">${NUMS[i]} ${n}</button>`).join("")}</div><div class="c">${R.map(i=>`<button data-r="${i}"><img src="${IMG(i)}" alt=""></button>`).join("")}</div></div>${back}`;wire();
  const mr=document.getElementById("mr"),svg=document.getElementById("ml");
  mr.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.classList.contains("ok"))return;mr.querySelectorAll("[data-l]").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=b;sayA(names[+b.dataset.l])});
  mr.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{if(!sel||b.classList.contains("ok"))return;if(b.dataset.r===sel.dataset.l){const m=mr.getBoundingClientRect(),p=sel.getBoundingClientRect(),q=b.getBoundingClientRect(),c=COLORS[+b.dataset.r%6];
     svg.insertAdjacentHTML("beforeend",`<path stroke="${c}" d="M${p.left-m.left},${p.top+p.height/2-m.top} C${(p.left+q.right)/2-m.left},${p.top+p.height/2-m.top} ${(p.left+q.right)/2-m.left},${q.top+q.height/2-m.top} ${q.right-m.left},${q.top+q.height/2-m.top}"/>`);
     sel.classList.add("ok");b.classList.add("ok");sel.classList.remove("sel");sel=null;yay();boom(b);if(--left===0)fin()}else{buzz();b.classList.add("no");setTimeout(()=>b.classList.remove("no"),400)}})}
function tf(){let left=TF.length;document.getElementById("gmb").innerHTML=`<div class="q">✅ صَحٌّ أَمْ خَطَأٌ؟</div>${shuf(TF).map(([t,a])=>`<div class="tf" data-a="${a}"><span>${t}</span><button data-v="1">✔️</button><button data-v="0">❌</button></div>`).join("")}${back}`;wire();
  document.querySelectorAll(".tf").forEach(r=>{r.querySelector("span").onclick=()=>sayA(r.querySelector("span").textContent);r.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(r.dataset.w)return;if(b.dataset.v===r.dataset.a){r.dataset.w=1;b.classList.add("ok");yay();boom(b);if(--left===0)fin()}else{b.classList.add("no");buzz();setTimeout(()=>b.classList.remove("no"),400)}})})}
function mc(){let left=MC.length;document.getElementById("gmb").innerHTML=`<div class="q">🤔 اخْتَرِ الإِجَابَةَ الصَّحِيحَةَ</div>${MC.map(([q,o],k)=>`<div class="mcq" data-k="${k}"><b>${q} …</b><div class="o">${shuf(o.map((x,j)=>[x,j])).map(([x,j])=>`<button data-j="${j}">${x}</button>`).join("")}</div></div>`).join("")}${back}`;wire();
  document.querySelectorAll(".mcq").forEach(r=>{r.querySelector("b").onclick=()=>sayA(r.querySelector("b").textContent);r.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(r.dataset.w)return;if(b.dataset.j==="0"){r.dataset.w=1;b.classList.add("ok");yay();boom(b);sayA(b.textContent);if(--left===0)fin()}else{b.classList.add("no");buzz()}})})}
const starSvg=c=>`<svg viewBox="0 0 60 60"><path d="M30 4l7.6 16.5 18 2-13.4 12.3 3.7 17.8L30 43.5 14.1 52.6l3.7-17.8L4.4 22.5l18-2z" fill="${c}" stroke="#a35f24" stroke-width="3" stroke-linejoin="round"/></svg>`;
function stars(){let k=0;document.getElementById("gmb").innerHTML=`<div class="q">⭐ ${BOY?"لوّن":"لوّني"} نجمة كل ركن بالترتيب، و${BOY?"قله":"قوليه"}!</div><div class="stars5">${names.map((n,i)=>`<button data-i="${i}">${starSvg("#fff")}<i>${NUMS[i]}</i></button>`).join("")}</div><div class="q" id="snm" style="min-height:40px"></div>${back}`;wire();
  document.querySelectorAll(".stars5 button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i!==k){buzz();b.animate([{transform:"rotate(-10deg)"},{transform:"rotate(10deg)"},{transform:"none"}],300);return}
    b.innerHTML=starSvg(COLORS[i%6])+`<i style="color:#fff">${NUMS[i]}</i>`;b.animate([{transform:"scale(.5)"},{transform:"scale(1.25)"},{transform:"scale(1)"}],450);document.getElementById("snm").textContent=names[i];sayA(names[i]);yay();boom(b);if(++k===N)setTimeout(()=>fin(),900)})}
function aqida(){let seen=0;document.getElementById("gmb").innerHTML=`<div class="q">💚 عَقِيدَتِي الجَمِيلَةُ: ${BOY?"اقلب":"اقلبي"} البطاقة</div>${AQ.map(([im,q,a],i)=>`<div class="aqc" data-i="${i}"><div class="in"><div class="f" style="background:${["#dff1ff","#dcf8e8","#fff6c4","#ffe6d6"][i]}"><img src="img/deen/${im}.webp" alt=""><span>${q}</span></div><div class="b">${a}</div></div></div>`).join("")}<div class="q">${BOY?"أَنَا مُسْلِمٌ صَغِيرٌ.. أَعْرِفُ دِينِي!":"أَنَا مُسْلِمَةٌ صَغِيرَةٌ.. أَعْرِفُ دِينِي!"}</div>${back}`;wire();
  document.querySelectorAll(".aqc").forEach(c=>c.onclick=()=>{const [,q,a]=AQ[+c.dataset.i];c.classList.toggle("on");if(c.classList.contains("on")){sayA(q+" "+a);if(!c.dataset.s){c.dataset.s=1;yay();if(++seen===AQ.length)setTimeout(()=>fin(),800)}}else sayA(q)})}
/* the games button next to the existing one */
const bar=document.getElementById("game")&&document.getElementById("game").parentNode;
if(bar){const b=document.createElement("button");b.className="btn";b.textContent="🎮 ألعاب أكثر";b.style.cssText="background:linear-gradient(160deg,#fff6c4,#ffd84a);color:#16204a";b.onclick=menu;bar.appendChild(b)}
})();
