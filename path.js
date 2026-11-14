/* Najma learning path (kids-app-design pattern library)
   A winding road through UAE worlds (desert, sea, city). Each stop is a group of a subject:
   done = green tick, current = bounces with "Go!", locked = grey with a lock, a reward at the end of each world.
   Also NajmaLevelUp(): the badge moment when a group is finished. */
(function(){
  const css=document.createElement("style");css.textContent=`
  .np{position:relative;margin:6px auto 18px;max-width:760px;font-family:inherit}
  .np-hd{display:flex;align-items:center;gap:12px;background:rgba(255,253,245,.94);border:4px solid #fff;border-radius:999px;padding:6px 16px 6px 6px;box-shadow:0 10px 20px rgba(120,80,20,.18)}
  .np-hd img{width:58px;height:58px;border-radius:50%;background:#fff6d8;object-fit:cover}
  .np-hd b{flex:1;font-size:26px;color:#16204a}
  .np-hd span{display:flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:4px 14px 4px 6px;font-weight:800;font-size:22px;color:#16204a}
  .np-hd span img{width:34px;height:34px;background:none}
  .np-tabs{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:10px;margin:14px 0 0}
  .np-tabs button{display:flex;align-items:center;gap:8px;min-height:72px;border:4px solid rgba(255,255,255,.7);border-radius:22px 22px 10px 10px;background:rgba(255,253,245,.85);
    padding:4px 10px;font-family:inherit;color:#16204a;box-shadow:0 6px 0 rgba(120,80,20,.18);cursor:pointer;text-align:start}
  .np-tabs button.on{background:linear-gradient(#fff6c4,#ffd84a);border-color:#fff}
  .np-tabs button.lock{opacity:.55}.np-tabs button.lock img{filter:grayscale(1)}
  .np-tabs img{width:46px;height:46px;border-radius:12px;object-fit:cover;flex:none}
  .np-tabs b{display:block;font-size:22px;line-height:1.1}.np-tabs small{display:block;font-size:18px;font-weight:700;line-height:1.1}
  .np-road{position:relative;margin-top:8px}
  .np-road svg{position:absolute;inset:0;pointer-events:none}
  .np-stop{position:absolute;width:150px;height:150px;border:5px solid #fff;border-radius:34px;color:#fff;font-family:inherit;cursor:pointer;
    display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;box-shadow:0 10px 0 rgba(0,0,0,.18);transform:translate(-50%,-50%)}
  .np-stop b{font-size:52px}.np-stop small{font-size:19px;font-weight:700;opacity:.95;max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .np-stop.lock{background:#b9b3c4!important}
  .np-stop.cur{width:170px;height:170px;box-shadow:0 0 0 8px #ffe066,0 0 30px 10px rgba(255,214,74,.9),0 10px 0 rgba(0,0,0,.18);animation:npBob 1.6s ease-in-out infinite}
  .np-stop.sel:not(.cur){box-shadow:0 0 0 6px #16204a,0 10px 0 rgba(0,0,0,.18)}
  @keyframes npBob{50%{transform:translate(-50%,calc(-50% - 8px))}}
  .np-stop .bd{position:absolute;top:-14px;inset-inline-end:-14px;width:48px;height:48px;border-radius:50%;border:4px solid #fff;display:flex;align-items:center;justify-content:center}
  .np-stop .tag{position:absolute;top:-56px;left:50%;transform:translateX(-50%);background:#16204a;color:#fff;font-weight:800;font-size:24px;padding:4px 18px;border-radius:999px;white-space:nowrap;box-shadow:0 5px 0 rgba(0,0,0,.18)}
  .np-stop.no{animation:npNo .35s}
  @keyframes npNo{25%{transform:translate(calc(-50% - 6px),-50%)}75%{transform:translate(calc(-50% + 6px),-50%)}}
  .np-deco{position:absolute;width:112px;height:112px;border-radius:24px;border:5px solid #fff;box-shadow:0 8px 16px rgba(120,80,20,.25);object-fit:cover;transform:translate(-50%,-50%) rotate(var(--r));pointer-events:none}
  .np-prize{position:absolute;width:140px;text-align:center;transform:translate(-50%,-50%);font-weight:800;font-size:20px;color:#16204a}
  .np-prize img{width:130px;height:130px;object-fit:contain;display:block;margin:0 auto -4px}
  .np-prize.lock img{filter:grayscale(.7);opacity:.75}
  .np-card{display:flex;align-items:center;gap:14px;margin-top:6px;background:rgba(255,253,245,.94);border:4px solid #fff;border-radius:30px;padding:12px 18px;box-shadow:0 12px 24px rgba(120,80,20,.22)}
  .np-card>img{width:110px;height:110px;object-fit:contain;flex:none}
  .np-card .tx{flex:1;min-width:0}.np-card .tx b{display:block;font-size:28px;color:#16204a}
  .np-card .ws{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.np-card .ws span{color:#fff;border-radius:12px;padding:2px 12px;font-size:22px;font-weight:700}
  .np-go{flex:none;display:flex;align-items:center;gap:8px;height:88px;padding:0 26px;border:4px solid rgba(255,255,255,.85);border-radius:999px;background:linear-gradient(160deg,#fff6c4,#ffd84a);
    font-family:inherit;font-weight:800;font-size:32px;color:#16204a;box-shadow:0 8px 0 rgba(120,80,20,.25);cursor:pointer}
  .np-go img{width:52px;height:52px}[dir=rtl] .np-go img{transform:scaleX(-1)}
  .nl{position:fixed;inset:0;z-index:9999;background:rgba(22,32,74,.55);display:flex;align-items:center;justify-content:center;padding:20px}
  .nl-c{width:min(680px,100%);background:linear-gradient(#fffdf6,#fff4d6);border:5px solid #fff;border-radius:40px;padding:30px 24px;text-align:center;color:#16204a;box-shadow:0 20px 40px rgba(0,0,0,.3);animation:nlIn .45s cubic-bezier(.34,1.56,.64,1)}
  @keyframes nlIn{from{transform:scale(.6);opacity:0}}
  .nl-c h3{margin:0;font-size:44px;line-height:1.1}.nl-c p{margin:8px 0 0;font-size:26px;font-weight:700;color:#5b5670}
  .nl-b{display:flex;align-items:center;justify-content:center;gap:18px;margin:22px 0}
  .nl-hex{clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);background:#fff;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 8px 12px rgba(0,0,0,.2))}
  .nl-hex>div{clip-path:inherit;width:calc(100% - 14px);height:calc(100% - 14px);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;text-shadow:0 3px 0 rgba(0,0,0,.2)}
  .nl-col{display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:800;font-size:20px}
  .nl-bar{height:26px;border-radius:999px;background:#efe9d8;overflow:hidden;margin:6px auto 0;max-width:460px}.nl-bar div{height:100%;width:0;background:linear-gradient(#ffe27a,#ffb703);transition:width 1.2s ease-out}
  .nl-ft{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px}.nl-ft img{width:120px;height:120px;object-fit:contain}
  @media (max-width:600px){.np-stop{width:120px;height:120px}.np-stop.cur{width:136px;height:136px}.np-stop b{font-size:40px}.np-deco{width:84px;height:84px}.np-card{flex-wrap:wrap}.np-go{width:100%;justify-content:center}}
  @media (prefers-reduced-motion:reduce){.np-stop.cur{animation:none}}`;
  document.head.appendChild(css);
  const COL=["#2f74d6","#1f9163","#d0611a","#7a55c7","#c13a30","#a26c14"];
  const WORLDS=[{en:"Desert",ar:"الصحراء",img:"img/uae/sym_camel.webp",deco:["img/uae/sym_camel.webp","img/uae/sym_palm.webp","img/uae/sym_ghaf.webp"]},
                {en:"Sea",ar:"البحر",img:"img/uae/em_fu.webp",deco:["img/uae/em_fu.webp","img/uae/em_rk.webp","img/uae/em_uq.webp"]},
                {en:"City",ar:"المدينة",img:"img/uae/em_du.webp",deco:["img/uae/em_du.webp","img/uae/em_ad.webp","img/uae/em_aj.webp"]}];
  const TICK='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const LOCK='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  /* o: {mount, ar, stops:[{label,sub,words:[]}], isDone(i), selected, onSelect(i), onStart(i), prize, perWorld} */
  window.NajmaPath=function(o){
    const ar=!!o.ar,t=(e,a)=>ar?a:e,ad=x=>String(x).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]),per=o.perWorld||3,me=(window.NAJMA&&NAJMA.me)||{};
    const root=document.createElement("div");root.className="np";o.mount.before(root);
    let sel=0,world=0;
    const cur=()=>{for(let i=0;i<o.stops.length;i++)if(!o.isDone(i))return i;return o.stops.length};
    function draw(){const c=cur(),nW=Math.ceil(o.stops.length/per);if(sel>Math.min(c,o.stops.length-1))sel=Math.min(c,o.stops.length-1);world=Math.floor(sel/per);
      const doneN=o.stops.filter((_,i)=>o.isDone(i)).length;
      root.innerHTML=`<div class="np-hd">${o.plain?"":`<img src="img/uae/saqoor_wave.webp" alt="">`}<b>${me.name?t("Hi, "+me.name+"!","هلا "+me.name+"!"):t("Hi!","هلا!")}</b>
        <span><img src="img/home2/nav_star.webp" alt="">${doneN} / ${o.stops.length}</span></div>`+
        (nW>1?`<div class="np-tabs" style="--n:${nW}">${Array.from({length:nW},(_,w)=>{const W=WORLDS[w%3],a=w*per,b=Math.min(o.stops.length,a+per)-1,lk=false;
          return `<button data-w="${w}" class="${w===world?"on":""}${lk?" lock":""}">${o.plain?"":`<img src="${W.img}" alt="">`}<span><b>${t(W.en,W.ar)}</b><small>${t(b>a?`Groups ${a+1}–${b+1}`:`Group ${a+1}`,b>a?`المجموعات ${ad(a+1)}–${ad(b+1)}`:`المجموعة ${ad(a+1)}`)}</small></span></button>`}).join("")}</div>`:"")+
        `<div class="np-road"></div><div class="np-card"></div>`;
      root.querySelectorAll(".np-tabs button").forEach(b=>b.onclick=()=>{const w=+b.dataset.w;if(w*per>c){b.classList.add("no");say(t("Finish this world first!","خلّص هذا العالم أولًا!"));return}sel=Math.min(c,w*per+per-1,o.stops.length-1);if(sel<w*per)sel=w*per;o.onSelect&&o.onSelect(sel);draw()});
      drawRoad(c);drawCard()}
    function drawRoad(c){const road=root.querySelector(".np-road"),W=road.clientWidth||700,a=world*per,b=Math.min(o.stops.length,a+per),n=b-a,
        last=b===o.stops.length||true,STEP=150,H=(n+1)*STEP+20;road.style.height=H+"px";
      const xs=i=>{const p=[.68,.28,.7,.32][i%4];return (ar?1-p:p)*W},ys=i=>95+i*STEP;
      const pts=[];for(let i=0;i<=n;i++)pts.push([xs(i),ys(i)]);
      let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],m=(y0+y1)/2;d+=` C${x0},${m+30} ${x1},${m-30} ${x1},${y1}`}
      let h=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${d}" fill="none" stroke="#d9a95e" stroke-width="62" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#f6dfae" stroke-width="50" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="16 16" stroke-linecap="round" opacity=".9"/></svg>`;
      const WD=WORLDS[world%3];
      for(let i=0;i<n;i++){const k=a+i,x=xs(i),y=ys(i),dn=o.isDone(k),isC=k===c,lk=false;
        if(!o.plain)h+=`<img class="np-deco" src="${WD.deco[i%3]}" alt="" style="left:${W-x+(x>W/2?40:-40)}px;top:${y+20}px;--r:${[-6,5,-4][i%3]}deg">`;
        h+=`<button class="np-stop${isC?" cur":""}${lk?" lock":""}${k===sel?" sel":""}" data-k="${k}" style="left:${x}px;top:${y}px;background:${COL[k%6]}">
          ${dn?`<span class="bd" style="background:#2fbf71">${TICK}</span>`:lk?`<span class="bd" style="background:#8a8299">${LOCK}</span>`:""}
          ${isC?`<span class="tag">${t("Go!","يلا!")}</span>`:""}<b>${o.stops[k].big||k+1}</b><small>${o.stops[k].label}</small></button>`}
      const px=xs(n),py=ys(n),wDone=o.stops.slice(a,b).every((_,i)=>o.isDone(a+i));
      h+=`<div class="np-prize${wDone?"":" lock"}" style="left:${px}px;top:${py}px">${o.plain?"":`<img src="${o.prize||"img/home2/nav_star.webp"}" alt="">`}${wDone?t("World done!","أحسنت!"):t("Reward","الجائزة")}</div>`;
      road.innerHTML=h;
      road.querySelectorAll(".np-stop").forEach(b=>b.onclick=()=>{const k=+b.dataset.k;
        if(k>c){b.classList.remove("no");void b.offsetWidth;b.classList.add("no");say(t(`Finish ${o.stops[c].label} first!`,`خلّص ${o.stops[c].label} أولًا!`));return}
        sel=k;o.onSelect&&o.onSelect(k);drawRoad(c);drawCard()})}
    function drawCard(){const s=o.stops[sel],card=root.querySelector(".np-card");
      card.innerHTML=`<img src="img/uae/saqoor_point.webp" alt=""><div class="tx"><b>${s.label}${s.sub?" · "+s.sub:""}</b><div class="ws">${(s.words||[]).slice(0,5).map((w,i)=>`<span style="background:${COL[(i+sel)%6]}">${w}</span>`).join("")}</div></div>
        <button class="np-go" type="button"><img src="img/btn/next.webp" alt="">${o.isDone(sel)?t("Again","مرة ثانية"):t("Start","ابدأ")}</button>`;
      card.querySelector(".np-go").onclick=()=>o.onStart(sel)}
    function say(x){try{(window.talk||(()=>{}))(x)}catch(e){}}
    let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(draw,150)});
    sel=o.selected!=null?o.selected:Math.min(cur(),o.stops.length-1);draw();
    return{refresh(){draw()},select(i){sel=i;draw()},get selected(){return sel}}};

  window.NajmaLevelUp=function(o){/* {ar,title,line,prev,cur,next,onContinue} */
    const ar=!!o.ar,hex=(txt,st,s)=>`<div class="nl-hex" style="width:${s}px;height:${s}px"><div style="font-size:${s*.36}px;background:${{done:"linear-gradient(160deg,#ffe27a,#ffb703)",now:"linear-gradient(160deg,#c9a2ff,#7c4dff)",lock:"linear-gradient(160deg,#ddd8e6,#b9b3c4)"}[st]}">${st==="lock"?LOCK.replace(/24/g,String(Math.round(s*.32))):txt}</div></div>`;
    const el=document.createElement("div");el.className="nl";el.dir=ar?"rtl":"ltr";
    el.innerHTML=`<div class="nl-c"><h3>${o.title}</h3><p>${o.line}</p>
      <div class="nl-b">${o.prev?`<div class="nl-col">${hex(o.prev.big,"done",120)}${o.prev.label}</div>`:""}<div class="nl-col">${hex(o.cur.big,"now",200)}${o.cur.label}</div>${o.next?`<div class="nl-col" style="opacity:.8">${hex("","lock",120)}${o.next.label}</div>`:""}</div>
      <div class="nl-bar"><div></div></div>
      <div class="nl-ft"><img src="img/uae/saqoor_cheer.webp" alt=""><button class="np-go" type="button"><img src="img/btn/next.webp" alt="">${ar?"يلا نكمل":"Continue"}</button></div></div>`;
    document.body.appendChild(el);setTimeout(()=>el.querySelector(".nl-bar div").style.width="100%",120);
    el.querySelector(".np-go").onclick=()=>{el.remove();o.onContinue&&o.onContinue()}};
})();
