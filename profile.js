/* Najma profiles: gives each child their own progress by namespacing storage, and exposes their settings.
   Must load before any page script. */
(function(){
  /* moving home: from raw.githack.com to GitHub Pages. Only moves once the new address answers; the child's link travels with it, stars come back from the cloud */
  try{if(location.hostname==="raw.githack.com"){const m=location.pathname.match(/^\/ayb88sec\/Sounds\/[^\/]+\/(.*)$/i);
    if(m)fetch("https://ayb88sec.github.io/Sounds/moved.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(!j||!j.ok)return;
      const g=k=>Storage.prototype.getItem.call(localStorage,k),q=new URLSearchParams(location.search);
      if(g("najma:dev")&&g("najma:lock")&&!q.get("dev")){q.set("dev",g("najma:dev"));q.set("key",g("najma:key")||"");q.set("kid",g("najma:lock")||"")}
      q.set("mv","1");const qs=q.toString();location.replace("https://ayb88sec.github.io/Sounds/"+(m[1]||"home.html")+(qs?"?"+qs:"")+location.hash)}).catch(()=>{})}}catch(e){}
})();
/* which home-screen app is this: the new one (added from the new link), the old one (moved from the old address), or the browser */
(function(){try{const st=navigator.standalone||matchMedia("(display-mode: standalone)").matches;if(!sessionStorage.getItem("najma:appKind"))
  sessionStorage.setItem("najma:appKind",!st?"browser":(new URLSearchParams(location.search).get("mv")||/githack/.test(document.referrer))?"old":"new");
  window.NAJMA_APP=sessionStorage.getItem("najma:appKind")}catch(e){window.NAJMA_APP="?"}})();
(function(){
  const S=Storage.prototype,G=S.getItem,SET0=S.setItem,RM=S.removeItem;
  /* storage full: the downloaded settings copy is the only big thing that can be thrown away (it comes back on the next sync) */
  const SET=function(k,v){try{return SET0.call(this,k,v)}catch(e){if(k==="najma:sections")throw e;try{RM.call(localStorage,"najma:sections")}catch(x){}return SET0.call(this,k,v)}};
  const STANDALONE=navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
  /* the child link can arrive as #dev=…&key=…&kid=… or as ?dev=…&key=…&kid=… (the Home Screen keeps the ? form reliably) */
  const QS=new URLSearchParams(location.search),HAS_Q=QS.get("kid")&&(QS.get("dev")||QS.get("key"));
  if(location.hash.startsWith("#key=")||location.hash.startsWith("#dev=")||HAS_Q){const hp=HAS_Q?QS:new URLSearchParams(location.hash.slice(1));
    let parentPhone=false;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("sb-"))parentPhone=true}
    /* a parent opening a child's link by mistake: ask before turning this phone into the child's device */
    /* asked only once: a device already set up as a child's iPad never asks again */
    const ok=!parentPhone||!hp.get("kid")||G.call(localStorage,"najma:lock")||G.call(localStorage,"najma:dev")===hp.get("dev")||confirm("هذا الرابط يحوّل هذا الجهاز إلى جهاز الطفل فقط.\nهل هذا جهاز الطفل؟\n(اضغط «إلغاء» إذا كان هذا جوالك)");
    if(hp.get("key"))SET.call(localStorage,"najma:key",(hp.get("key")||"").trim().toUpperCase());
    if(ok&&hp.get("kid")){SET.call(localStorage,"najma:lock",hp.get("kid"));SET.call(localStorage,"najma:cur",hp.get("kid"))}
    if(ok&&hp.get("dev")){SET.call(localStorage,"najma:dev",hp.get("dev"));if(hp.get("kid"))SET.call(localStorage,"najma:lock",hp.get("kid"))}
    /* iPhone/iPad: a Home Screen app has its own storage and only keeps the address it was saved from,
       so the link stays in the address until the app is opened from the Home Screen */
    if(STANDALONE)history.replaceState(null,"",location.pathname)}
  if(!STANDALONE&&/home\.html$/.test(location.pathname)&&G.call(localStorage,"najma:lock")){
    const q=new URLSearchParams();const d=G.call(localStorage,"najma:dev");if(d)q.set("dev",d);q.set("key",G.call(localStorage,"najma:key")||"");q.set("kid",G.call(localStorage,"najma:lock"));
    history.replaceState(null,"",location.pathname+"?"+q.toString())}
  /* a child's iPad is locked to that child: no switching, no seeing siblings */
  const LOCK=G.call(localStorage,"najma:lock");if(LOCK)SET.call(localStorage,"najma:cur",LOCK);
  let profiles=[];try{profiles=JSON.parse(G.call(localStorage,"najma:profiles")||"[]")}catch(e){}
  let cur=LOCK||G.call(localStorage,"najma:cur");
  /* parent's phone: a test view with every app and section, not tied to a child (progress kept apart, never sent) */
  const PREV={id:"preview",name:"ماما",nameAr:"ماما",avatar:"👀",color:"#ffd23f",apps:{},preview:true};
  if(!LOCK&&new URLSearchParams(location.search).get("preview")){cur="preview";SET.call(localStorage,"najma:cur","preview")}
  let me=(!LOCK&&cur==="preview")?PREV:(profiles.find(p=>p.id===cur)||(!LOCK&&!G.call(localStorage,"najma:dev")?PREV:null));
  const key=k=>(typeof k==="string"&&!k.startsWith("najma:")&&!k.startsWith("sb-")&&me)?`najma:${me.id}:${k}`:k;
  S.getItem=function(k){return G.call(this,key(k))};
  S.setItem=function(k,v){return SET.call(this,key(k),v)};
  S.removeItem=function(k){return RM.call(this,key(k))};
  const IDBO=window.indexedDB?indexedDB.open.bind(indexedDB):null;
  if(window.indexedDB&&me){const open=indexedDB.open.bind(indexedDB);indexedDB.open=(n,v)=>open(`${n}__${me.id}`,v)}
  const DEF={apps:{arabic:true,numAr:true,islam:true,iman:true,sounds:true,cvc:true,sent:true,writeEn:true,numEn:true,shapes:true,name:true,quran:true,duas:true,colorsAr:true,colorsEn:true,spell:true,math:true,days:true,daysAr:true,clock:true,clockAr:true,months:true,monthsAr:true,uae:true,uaeEn:true},numMax:20,sightGroups:[0,1,2,3,4,5,6,7,8]};
  const DEFSEC=[{id:"spell1",title:"Spelling",icon:"🐝",lang:"en",words:["antiseptic","antibiotic","baby","bad","bear"]}];
  let sections;try{sections=JSON.parse(G.call(localStorage,"najma:sections")||"null")}catch(e){}
  if(!Array.isArray(sections))sections=DEFSEC;
  sections=sections.filter(x=>!x||x.type!=="feedback");
  /* shared content from other families comes first; this family's own settings and recordings win */
  const isObj=o=>o&&typeof o==="object"&&!Array.isArray(o)&&!("ct" in o);
  const deep=(a,b)=>{Object.keys(b||{}).forEach(k=>{if(isObj(a[k])&&isObj(b[k]))deep(a[k],b[k]);else a[k]=b[k]});return a};
  {const Qs=sections.filter(s=>s&&s.type==="qimg");if(Qs.length>1){const m={};Qs.sort((x,y)=>(x.mine===false?0:1)-(y.mine===false?0:1)).forEach(q=>{const c=JSON.parse(JSON.stringify(q));if(q.mine===false)delete c.hide;
      /* a family that chose "👩 صوت آمنة" for a part keeps Amna's recordings there, not its own */
      else{const V=c.voice||{},sh=a=>V[a]==="shared";if(sh("quran"))["explA","explV","secV"].forEach(k=>delete c[k]);if(sh("duas")&&c.duas)delete c.duas.rec;if(sh("colors"))delete c.colorRec;
        if(c.ov)Object.keys(c.ov).forEach(a=>{if(sh(a))delete c.ov[a]})}
      deep(m,c)});
    m.type="qimg";sections=sections.filter(s=>!s||s.type!=="qimg").concat([m])}}
  /* levels the parent can switch on per child; default: all on */
  const LEVELS={arabic:["ا – خ","د – ص","ض – ق","ك – ي","الكلمات البصرية"],sounds:["Set 1","Special friends"],wt:["1.1 · m a s d t","1.2 · i n p g o","1.3 · c k u b","1.4 · f e l h sh","1.5 · r j v y w","1.6 · th z ch qu x ng nk","1.7 · 4–5 sounds"],
    sent:["Level 1","Level 2","Level 3","Level 4"],shapes:["Level 1","Level 2","Level 3"],writeEn:["abc","ABC","123"],
    clock:["o'clock","half past","quarters","5 minutes"],
    math:["KG2 + up to 10","KG2 − up to 10","KG2 + − up to 10","G2 + − up to 20","G2 + − up to 100","G2 missing number"],
    spell:["الطويل والقصير","أ ب د س م","ل ن ف ق ر","المقاطع ١","المقاطع ٢"],
    quran:["الفاتحة","الناس – قريش","الفيل – القدر","العلق – الفجر","الغاشية – النبأ"]};
  const lv=app=>{const L=me&&me.levels&&me.levels[app];return Array.isArray(L)&&L.length?L:LEVELS[app].map((_,i)=>i)};
  window.NAJMA={LEVELS,lv,me,profiles,sections,DEFSEC,settings:Object.assign({},DEF,me||{},{apps:Object.assign({},DEF.apps,(me&&me.apps)||{})}),DEF,
    raw:{get:k=>G.call(localStorage,k),set:(k,v)=>SET.call(localStorage,k,v),remove:k=>RM.call(localStorage,k)}};
  /* name chip next to the home button on every page */
  if(me&&!/(home\d*|parent)\.html$/.test(location.pathname)){document.addEventListener("DOMContentLoaded",()=>{
    const c=document.createElement("a");c.href="home.html";
    c.style.cssText=`position:fixed;top:calc(10px + env(safe-area-inset-top));left:70px;z-index:15;height:52px;border-radius:18px;background:${me.color||"#fff"};color:#fff;
      display:flex;align-items:center;gap:6px;padding:0 14px 0 8px;font:800 20px "Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;text-decoration:none;box-shadow:0 5px 0 rgba(0,0,0,.18);text-shadow:0 2px 0 rgba(0,0,0,.15)`;
    c.innerHTML=`<span style="font-size:30px;width:40px;height:40px;display:inline-flex;overflow:hidden;border-radius:50%">${window.NAJMA_AV?NAJMA_AV(me.avatar):(me.avatar||"⭐")}</span><span dir="auto">${me.name}</span>`;document.body.appendChild(c);const st=document.createElement("style");st.textContent="main{padding-top:74px !important}";document.head.appendChild(st)})}
  /* soft "pop" when a child taps anything (not in the parent portal) */
  try{if(!/(parent|families|guide)\.html$/.test(location.pathname)){let ac=null,last=0;
    try{if(navigator.audioSession)navigator.audioSession.type="playback"}catch(e){}
    const P=[...Array(4)].map(()=>{const x=new Audio("audio/pop.wav");x.preload="auto";x.volume=.5;return x});let pi=0;
    const pop=()=>{const t=Date.now();if(t-last<60)return;last=t;try{const x=P[pi++%P.length];x.currentTime=0;const r=x.play();if(r&&r.catch)r.catch(()=>{})}catch(e){}};
    document.addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest("button,a,.z,.tile,.app,.cat,.sym,[role=button],[onclick]"))pop()},{capture:true,passive:true})}}catch(e){}
  /* the picture iPhone/iPad shows while a sound plays (Dynamic Island, lock screen) */
  try{if("mediaSession" in navigator&&window.MediaMetadata){const md=()=>{try{navigator.mediaSession.metadata=new MediaMetadata({title:"نجمة",artist:"Najma",artwork:[{src:new URL("icon-n.png",location.href).href,sizes:"512x512",type:"image/png"},{src:new URL("icon2-180.png",location.href).href,sizes:"180x180",type:"image/png"}]})}catch(e){}};
    md();document.addEventListener("play",md,true)}}catch(e){}
  /* a child's picture: an emoji, or one of the character pictures ("img:k1") */
  window.NAJMA_AV=v=>/^img:k\d$/.test(v||"")?`<img src="img/kids/${v.slice(4)}.webp" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`:(v||"⭐");
  /* new look (test only): switched on by the test home page, never on the kids' iPads until published */
  try{if(!/(home\d*|parent|families|guide)\.html$/.test(location.pathname)&&location.pathname.split("/").pop()!==""){
    const l=document.createElement("link");l.rel="stylesheet";l.href="theme2.css?v=16";document.head.appendChild(l);const wst=window.scrollTo.bind(window);window.scrollTo=function(){try{const m=document.querySelector("main");if(m&&getComputedStyle(m).position==="fixed"){m.scrollTo.apply(m,arguments);return}}catch(e){}return wst.apply(null,arguments)};
    document.addEventListener("DOMContentLoaded",()=>{const H="home.html";
      const bk=document.createElement("a");bk.className="n2back";bk.textContent="➡️ رجوع";bk.href=document.referrer&&/home\d*\.html/.test(document.referrer)?document.referrer:H;document.body.appendChild(bk);
      const n=document.createElement("nav");n.className="n2bar";n.innerHTML=`<a href="${H}"><img src="img/home2/nav_home.webp" alt=""><b>الرئيسية</b><small>Home</small></a><a href="${H}#c=hw"><img src="img/home2/nav_hw.webp" alt=""><b>الواجب</b><small>Homework</small></a><a href="${H}#c=prog"><img src="img/home2/nav_prog.webp" alt=""><b>تقدّمي</b><small>My Progress</small></a>`;document.body.appendChild(n);
      /* 3D button icons instead of emoji at the start of a button */
      const BI=[["⏪","back"],["⏩","fwd"],["🎮","game"],["🔊","sound"],["🔈","sound"],["🔉","sound"],["✏️","write"],["✍️","write"],["✏","write"],["🎤","mic"],["🎙️","mic"],["🎲","dice"],["🔄","again"],["🔁","again"],["💡","hint"],["✅","check"]];
      const swapIcons=()=>document.querySelectorAll("button,.btn,a.n2back").forEach(b=>{if(b.dataset.ic)return;const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){const v=t.nodeValue.replace(/^\s+/,"");if(!v)continue;
        const hit=BI.find(([e])=>v.startsWith(e));if(hit){const im=document.createElement("img");im.src="img/btn/"+hit[1]+".webp";im.alt="";im.className="bi";t.nodeValue=v.slice(hit[0].length).replace(/^️/,"");t.parentNode.insertBefore(im,t);b.dataset.ic=1;b.classList.add(b.textContent.trim()?"bi-text":"bi-only")}break}});
      swapIcons();new MutationObserver(swapIcons).observe(document.body,{subtree:true,childList:true});
      /* no rocket talk in the new look */
      const fix=()=>document.querySelectorAll(".count,.nx-count").forEach(e=>{const t=e.textContent,u=t.replace(/[،,]?\s*طِ?ر بالصاروخ إلى القمر!?/,"").replace(/\.?\s*Fly the rocket to the moon!?/i,"").replace("وصلت إلى القمر","أكملت كل شيء").replace("You reached the moon","You finished everything");if(u!==t)e.textContent=u});
      fix();new MutationObserver(fix).observe(document.body,{subtree:true,childList:true,characterData:true})})}}catch(e){}
  /* family code: private data (names, settings, recordings) is encrypted; each device stores the code once */
  let ckey=null;
  const ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),bu=a=>{let s="";a.forEach(x=>s+=String.fromCharCode(x));return btoa(s)};
  async function cryptoKey(){if(ckey)return ckey;const code=G.call(localStorage,"najma:key");if(!code||!crypto.subtle)throw new Error("nokey");
    const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(code),"PBKDF2",false,["deriveKey"]);
    ckey=await crypto.subtle.deriveKey({name:"PBKDF2",salt:new TextEncoder().encode("najma-family-v1"),iterations:150000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);return ckey}
  /* big recordings and pictures live in the iPad's database (much bigger than the settings storage); the settings keep a small pointer */
  function blobDB(){return new Promise((res,rej)=>{if(!IDBO)return rej(new Error("no db"));const r=IDBO("najma-blobs",1);r.onupgradeneeded=()=>r.result.createObjectStore("b");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
  async function blobGet(id){const db=await blobDB();return new Promise((res,rej)=>{const q=db.transaction("b").objectStore("b").get(id);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
  async function blobPutAll(map){const db=await blobDB();return new Promise((res,rej)=>{const tx=db.transaction("b","readwrite"),st=tx.objectStore("b");st.clear();Object.keys(map).forEach(k=>st.put(map[k],k));tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error)})}
  async function decrypt(o){if(o&&o.idb){const real=await blobGet(o.idb);if(!real)throw new Error("missing");o=real}const k=await cryptoKey();const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:ub(o.iv)},k,ub(o.ct));return JSON.parse(new TextDecoder().decode(pt))}
  async function encrypt(obj){const k=await cryptoKey();const iv=crypto.getRandomValues(new Uint8Array(12));
    const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},k,new TextEncoder().encode(JSON.stringify(obj)));return {v:1,iv:bu(iv),ct:bu(new Uint8Array(ct))}}
  /* voice choice per part of the app, set by the parent: "mine" (recordings), "ai", or "none" */
  function vmode(area,def){try{const Q=(sections||[]).find(s=>s.type==="qimg");const v=(Q&&Q.voice&&Q.voice[area])||def||"mine";return v==="shared"?"mine":v}catch(e){return def||"mine"}}
  const aiURL=(q,lang)=>`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang||"ar"}&q=${encodeURIComponent(q)}&total=1&idx=0&textlen=${q.length}`;
  const noEmoji=t=>String(t||"").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\uFE0F\u200D•]/gu," ").replace(/\s+/g," ").trim();
  async function loadAudio(name,v){window[v]=window[v]||{};const mode=vmode(name,"mine");if(mode==="none")return window[v];
    if(mode==="ai"){try{if(!window.BASE)await new Promise(r=>{const s=document.createElement("script");s.src="data/base.js";s.onload=s.onerror=r;document.head.appendChild(s)});
      ((window.BASE||{})[name]||{groups:[]}).groups.forEach(g=>g[1].forEach(([k,lab,say])=>{let t=noEmoji(say||lab).replace(/^حرف\s*/,"");if(t.split(" ").length<=2)t=t.replace(/([\u0621\u0623-\u0626\u0628-\u064A])(?=\s|$)/g,"$1\u0652");window[v][k]=aiURL(t)}))}catch(e){}return window[v]}
    try{const r=await fetch(`audio/${name}.enc`);const d=await decrypt(await r.json());Object.assign(window[v],d)}catch(e){}
    /* the parent's own re-recordings (portal → 🧩 الأساسية) replace the built-in ones */
    try{const Q=(sections||[]).find(s=>s.type==="qimg"),O=Q&&Q.ov&&Q.ov[name];if(O)await Promise.all(Object.keys(O).map(k=>decrypt(O[k]).then(u=>{window[v][k]=u}).catch(()=>{})))}catch(e){}
    return window[v]}
  async function checkCode(code){const old=G.call(localStorage,"najma:key");SET.call(localStorage,"najma:key",code);ckey=null;
    try{const r=await fetch("audio/numbers.enc");await decrypt(await r.json());return true}catch(e){if(old)SET.call(localStorage,"najma:key",old);else RM.call(localStorage,"najma:key");ckey=null;return false}}
  Object.assign(window.NAJMA,{vmode,lock:G.call(localStorage,"najma:lock"),decrypt,encrypt,loadAudio,checkCode,hasKey:()=>!!G.call(localStorage,"najma:key")});
  const SBX=window.SUPA&&SUPA.url;
  /* cloud settings: children and sections live in config.json on GitHub; every device follows it */
  const REPO="ayb88sec/Sounds";
  async function fetchConfig(){
    try{const r=await fetch(`https://api.github.com/repos/${REPO}/contents/config.json?ref=main&t=${Date.now()}`,{headers:{Accept:"application/vnd.github.raw+json"},cache:"no-store"});
      if(r.ok)return await r.json()}catch(e){}
    try{const r=await fetch(`https://raw.githubusercontent.com/${REPO}/main/config.json?t=${Date.now()}`,{cache:"no-store"});if(r.ok)return await r.json()}catch(e){}
    return null}
  async function pull(){let cfg=await fetchConfig();if(cfg&&cfg.ct){try{cfg=await decrypt(cfg)}catch(e){return false}}if(!cfg||!cfg.updated)return false;
    const P=JSON.stringify(cfg.profiles||[]),Sx=JSON.stringify(cfg.sections||[]);
    const changed=P!==G.call(localStorage,"najma:profiles")||Sx!==G.call(localStorage,"najma:sections");
    SET.call(localStorage,"najma:profiles",P);
      /* if the iPad's storage is full, keep voices first and drop the biggest pictures */
      SET.call(localStorage,"najma:syncAt",String(Date.now()));RM.call(localStorage,"najma:syncErr");
      try{SET.call(localStorage,"najma:sections",Sx)}catch(e){SET.call(localStorage,"najma:syncErr","full");try{const L=JSON.parse(Sx);L.forEach(s=>{if(s.type==="qimg"){s.poster={}}});let t=JSON.stringify(L);
        try{SET.call(localStorage,"najma:sections",t)}catch(e2){L.forEach(s=>{if(s.type==="qimg")s.img={};if(s.duas)s.duas.img={}});t=JSON.stringify(L);try{SET.call(localStorage,"najma:sections",t)}catch(e3){}}}catch(e4){}}SET.call(localStorage,"najma:pulledAt",String(Date.now()));
    const c=G.call(localStorage,"najma:cur");if(!G.call(localStorage,"najma:lock")&&(cfg.profiles||[]).length&&!(cfg.profiles||[]).some(p=>p.id===c))SET.call(localStorage,"najma:cur",cfg.profiles[0].id);
    return changed}
  window.NAJMA.REPO=REPO;window.NAJMA.fetchConfig=fetchConfig;
  if(!SBX&&!/parent\.html$/.test(location.pathname)&&navigator.onLine!==false){
    const last=+G.call(localStorage,"najma:pulledAt")||0,home=/home\.html$/.test(location.pathname);
    if(home||Date.now()-last>120000)pull().then(ch=>{if(!ch){sessionStorage.removeItem("najma:reloaded");return}if(home&&!sessionStorage.getItem("najma:reloaded")){sessionStorage.setItem("najma:reloaded","1");location.reload()}})}
  /* database mode (supa.js filled in): a child's iPad syncs its own settings and stars */
  const SB=window.SUPA&&SUPA.url?SUPA:null,DEV=G.call(localStorage,"najma:dev");window.NAJMA.db=!!SB;
  async function rpc(fn,args){const r=await fetch(`${SB.url}/rest/v1/rpc/${fn}`,{method:"POST",headers:Object.assign({apikey:SB.key,"Content-Type":"application/json"},/^eyJ/.test(SB.key)?{Authorization:"Bearer "+SB.key}:{}),body:JSON.stringify(args)});
    if(!r.ok)throw new Error(r.status);const t=await r.text();return t?JSON.parse(t):null}
  window.NAJMA.rpc=SB?rpc:null;
  /* natural AI Arabic voice (Google) for anything the parent has not recorded yet; long text is read in parts */
  let aiA=null,aiRun=0;
  /* Google refuses the voice when the request says which website asked for it */
  try{const m=document.createElement("meta");m.name="referrer";m.content="no-referrer";document.head.appendChild(m)}catch(e){}
  /* stop at the end of each word (no added "u"/"un" ending): put a sukun on the last letter when it has no vowel mark */
  const pause=t=>String(t).trim().split(/\s+/).length>2?String(t):String(t).replace(/([\u0621\u0623-\u0626\u0628-\u064A])(?=[\s،,.؛!؟?]|$)/g,"$1\u0652");
  window.NAJMA.aiSay=function(text,lang,rate){const id=++aiRun;if(aiA){aiA.onended=null;aiA.onerror=null;aiA.pause()}if(!lang||lang==="ar")text=pause(String(text||"").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\uFE0F\u200D•]/gu," ").replace(/ﷺ/g,"صلى الله عليه وسلم"));
    const parts=[];let cur="";String(text).replace(/\s+/g," ").trim().split(/(?<=[،,.؛!؟?])\s*/).forEach(s=>{
      while(s.length>180){let i=s.lastIndexOf(" ",180);if(i<40)i=180;if(cur){parts.push(cur);cur=""}parts.push(s.slice(0,i));s=s.slice(i).trim()}
      if((cur+" "+s).trim().length>180){parts.push(cur);cur=s}else cur=(cur+" "+s).trim()});if(cur)parts.push(cur);
    /* one audio element, reused, so iPad keeps permission after the first tap; two Google voice addresses as fallback */
    if(!aiA){aiA=new Audio();aiA.setAttribute("referrerpolicy","no-referrer");aiA.preload="auto"}
    const url=(q,c)=>`https://translate.google.com/translate_tts?ie=UTF-8&client=${c}&tl=${lang||"ar"}&q=${encodeURIComponent(q)}&total=1&idx=0&textlen=${q.length}${rate?"&ttsspeed="+rate:""}`;
    return new Promise(res=>{let k=0;const next=(ci=0)=>{if(id!==aiRun||k>=parts.length)return res();const q=parts[k],c=["tw-ob","gtx"][ci];
      aiA.onended=()=>{k++;next()};aiA.onerror=()=>{if(ci<1)next(ci+1);else{aiToast("⚠️ تعذّر تشغيل الصوت");res()}};
      aiA.src=url(q,c);const p=aiA.play();if(p&&p.catch)p.catch(err=>{if(err&&err.name==="NotAllowedError"){aiToast("👆 اضغط 🔊 مرة ثانية");res()}})};next()})};
  function aiToast(t){try{let d=document.getElementById("aiToast");if(!d){d=document.createElement("div");d.id="aiToast";d.style.cssText="position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#2b2340;color:#fff;padding:10px 18px;border-radius:999px;font:700 16px system-ui;z-index:99";document.body.appendChild(d)}
    d.textContent=t;d.style.display="";clearTimeout(d._t);d._t=setTimeout(()=>d.style.display="none",3500)}catch(e){}}
  window.NAJMA.aiStop=()=>{aiRun++;if(aiA){aiA.onended=null;aiA.onerror=null;aiA.pause()}};
  /* the iPad's storage is small: if everything does not fit, drop the biggest extras step by step (pictures first), never the child or progress */
  async function saveSecs(Sx){const put=t=>{try{SET.call(localStorage,"najma:sections",t)}catch(e){return false}
      /* leave room for stars and progress */try{SET0.call(localStorage,"najma:probe","x".repeat(150000));RM.call(localStorage,"najma:probe");return true}catch(e){try{RM.call(localStorage,"najma:probe")}catch(x){}return false}};if(put(Sx))return;
    try{RM.call(localStorage,"najma:sections")}catch(e){}if(put(Sx))return;
    let L;try{L=JSON.parse(Sx)}catch(e){return}
    try{const map={};const walk=o=>{if(!o||typeof o!=="object")return;Object.keys(o).forEach(k=>{const v=o[k];
        if(v&&typeof v==="object"&&typeof v.ct==="string"&&v.iv&&v.ct.length>1500){const id=v.ct.length+":"+v.ct.slice(0,24)+v.ct.slice(-24);map[id]=v;o[k]={ct:"",idb:id}}else walk(v)})};
      walk(L);await blobPutAll(map);if(put(JSON.stringify(L))){try{SET.call(localStorage,"najma:slim","db")}catch(e){}return}}catch(e){L=JSON.parse(Sx)}
    const steps=[
      ()=>L.forEach(x=>{if(x.type==="qimg"){x.poster={};x.img={};if(x.duas)x.duas.img={}}else if(x.img)x.img={}}),
      ()=>L.forEach(x=>{if(x.type==="qimg"&&x.mine===false)["explA","explV","secV","ov","colorRec","story","expl","extra"].forEach(k=>delete x[k])}),
      ()=>L.forEach(x=>{if(x.type==="qimg")["explA","explV","secV"].forEach(k=>delete x[k])}),
      ()=>L.forEach(x=>{if(x.type!=="qimg"&&x.mine===false){delete x.audio;delete x.qaudio}}),
      ()=>L.forEach(x=>{if(x.type==="qimg"&&x.ov)Object.keys(x.ov).filter(k=>k!=="clips").forEach(k=>delete x.ov[k])}),
      ()=>L.forEach(x=>{if(x.type!=="qimg"){delete x.audio;delete x.qaudio}})];
    for(const st of steps){st();if(put(JSON.stringify(L))){try{SET.call(localStorage,"najma:slim","1")}catch(e){}return}}}
  window.NAJMA.saveSecs=saveSecs;
  /* version of the app this device runs (shown to the parent, so old iPads are easy to spot) */
  window.NAJMA.V="2026-11-04a";
  /* a word with no recording of its own: reuse the same letter, syllable or word already recorded elsewhere (حروفي, كلماتي الأولى, ...) */
  const loadJS=src=>new Promise(r=>{const s=document.createElement("script");s.src=src;s.onload=s.onerror=r;document.head.appendChild(s)});
  const MARKS=/[\u064B-\u065F\u0670]/g,normT=t=>noEmoji(t).replace(/^حرف\s*/,"").replace(/[.,،؛؟?!:«»"]/g,"").replace(/\s+/g," ").trim();
  window.NAJMA.libVoice=async function(list){const out={};list=(list||[]).filter(Boolean);if(!list.length)return out;
    try{if(!window.BASE||!window.BASE.spell)await loadJS("data/base.js");if(!window.SPELL)await loadJS("data/spell.js")}catch(e){}
    const B=window.BASE||{},idx={},bare={},letter={},add=(m,t,h)=>{(m[t]=m[t]||[]).push(h)};
    Object.keys(B).forEach(app=>(B[app].groups||[]).forEach(g=>g[1].forEach(([k,lab,say])=>{const t=normT(say||lab);if(!t)return;add(idx,t,[app,k]);const b=t.replace(MARKS,"");if(b.length>1)add(bare,b,[app,k]);
      if(app==="clips"&&/-[s0]$/.test(k))add(letter,g[0],[app,k])/* the letter sound if recorded, otherwise the letter with fatha */})));
    if(window.SPELL)Object.entries(SPELL.keys).forEach(([t,k])=>{const n=normT(t),hit=k[0]==="l"?["clips",k]:["spell",k];add(idx,n,hit);const b=n.replace(MARKS,"");if(b.length>1)add(bare,b,hit)});
    /* every possible match, best first; the first one that has a recording wins */
    const want={};list.forEach(w=>{const n=normT(w),b=n.replace(MARKS,""),L=b.length===1?(letter[/[أإآ]/.test(b)?"ا":b]||[]):[];want[w]=[...(idx[n]||[]),...L,...(b.length>1?bare[b]||[]:[])]});
    const apps=[...new Set(Object.values(want).flat().map(h=>h[0]))],lib={};
    await Promise.all(apps.map(a=>loadAudio(a,"__lib_"+a).then(o=>{lib[a]=o||{}}).catch(()=>{lib[a]={}})));
    Object.entries(want).forEach(([w,hits])=>{for(const [a,k] of hits){const u=lib[a]&&lib[a][k];if(u){out[w]=u;break}}});return out};
  /* every kids' page: pull down to update */
  addEventListener("DOMContentLoaded",()=>{/* pull down to update */
(function(){if(/parent\.html/.test(location.pathname))return;let y0=null,dy=0;const tip=document.createElement("div");
  tip.style.cssText="position:fixed;top:0;left:50%;transform:translate(-50%,-60px);background:#fff;color:#5b3fd6;font:800 17px system-ui;padding:10px 20px;border-radius:0 0 18px 18px;box-shadow:0 4px 0 rgba(0,0,0,.15);z-index:99;transition:transform .2s";document.body.appendChild(tip);
  addEventListener("touchstart",e=>{const m=document.querySelector("main");y0=scrollY<=0&&(!m||m.scrollTop<=0)?e.touches[0].clientY:null;dy=0},{passive:true});
  addEventListener("touchmove",e=>{if(y0==null)return;dy=e.touches[0].clientY-y0;if(dy>10){tip.textContent=dy>90?"⬆️ اترك للتحديث":"⬇️ اسحب للتحديث";tip.style.transition="none";tip.style.transform=`translate(-50%,${Math.min(dy,120)-60}px)`}},{passive:true});
  addEventListener("touchend",()=>{tip.style.transition="";if(y0!=null&&dy>90){tip.textContent="🔄 جاري التحديث…";tip.style.transform="translate(-50%,0)";try{sessionStorage.removeItem("najma:reloaded")}catch(e){}setTimeout(()=>location.reload(),400)}else tip.style.transform="translate(-50%,-60px)";y0=null;dy=0})})();});
  if(SB&&DEV){const isProg=k=>typeof k==="string"&&!k.startsWith("najma:");
    const queue={};let qt=null;
    const flush=()=>{qt=null;const ks=Object.keys(queue);ks.forEach(k=>{const v=queue[k];delete queue[k];
      let d={};try{d=v==null?{}:JSON.parse(v)}catch(e){return}if(typeof d!=="object"||Array.isArray(d))return;rpc("kid_save",{tok:DEV,akey:k,adata:d}).catch(()=>{queue[k]=v})})};
    const push=(k,v)=>{queue[k]=v;clearTimeout(qt);qt=setTimeout(flush,1500)};
    const oSet=S.setItem,oRm=S.removeItem;
    S.setItem=function(k,v){const r=oSet.call(this,k,v);if(this===localStorage&&isProg(k))push(k,v);return r};
    S.removeItem=function(k){const r=oRm.call(this,k);if(this===localStorage&&isProg(k))push(k,null);return r};
    addEventListener("online",flush);
    if(navigator.onLine!==false)rpc("kid_sync",{tok:DEV}).then(js=>{if(!js||!js.child)return;let changed=false;
      const kid=js.child,P=JSON.stringify([kid]),Sx=JSON.stringify(js.sections||[]);
      let hh=7;for(let i=0;i<Sx.length;i+=3)hh=(hh*31+Sx.charCodeAt(i))|0;const hx=Sx.length+":"+hh;if(P!==G.call(localStorage,"najma:profiles")||hx!==G.call(localStorage,"najma:secHash"))changed=true;try{SET.call(localStorage,"najma:secHash",hx)}catch(e){}
      SET.call(localStorage,"najma:lock",kid.id);SET.call(localStorage,"najma:cur",kid.id);SET.call(localStorage,"najma:profiles",P);return saveSecs(Sx).then(()=>{try{SET.call(localStorage,"najma:syncAt",String(Date.now()));RM.call(localStorage,"najma:syncErr")}catch(e){}
      /* stars: keep the best of the iPad and the database, then send back anything the database is missing */
      const ns=k=>`najma:${kid.id}:${k}`;if(!me)changed=true;
      Object.entries(js.progress||{}).forEach(([k,srv])=>{let loc={};try{loc=JSON.parse(G.call(localStorage,ns(k))||"{}")}catch(e){}
        const m=Object.assign({},srv);Object.entries(loc).forEach(([x,v])=>{m[x]=typeof v==="number"&&typeof srv[x]==="number"?Math.max(v,srv[x]):v});
        const ms=JSON.stringify(m);if(ms!==G.call(localStorage,ns(k))){SET.call(localStorage,ns(k),ms);changed=true}if(ms!==JSON.stringify(srv))push(k,ms)});
      for(let i=0;i<localStorage.length;i++){const full=localStorage.key(i);if(full&&full.startsWith(`najma:${kid.id}:`)){const k=full.slice(kid.id.length+8);if(!(k in (js.progress||{})))push(k,G.call(localStorage,full))}}
      /* tell the portal how much space this iPad uses */
      try{if(navigator.storage&&navigator.storage.estimate)navigator.storage.estimate().then(e=>{const mb=Math.round((e.usage||0)/1e5)/10;try{SET.call(localStorage,"najma:spaceMB",String(mb))}catch(x){}push("ipadSpace",JSON.stringify({mb,net:me&&me.net==="online"?"online":"offline",at:Date.now(),v:window.NAJMA.V,host:location.hostname,app:window.NAJMA_APP}))}).catch(()=>{})}catch(e){}
      if(changed&&/home\.html$/.test(location.pathname)&&!sessionStorage.getItem("najma:reloaded")){sessionStorage.setItem("najma:reloaded","1");location.reload()}else if(!changed)sessionStorage.removeItem("najma:reloaded")})}).catch(e=>{try{SET.call(localStorage,"najma:syncErr",String(e&&e.message||e))}catch(x){}})}
  /* offline: cache everything once it has been opened online */
  const ONLINE=!!(me&&me.net==="online");window.NAJMA.online=ONLINE;
  if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){addEventListener("load",()=>{
    /* 📶 online: nothing is kept for offline use (less space); 💾 offline: the apps are saved on the iPad */
    if(ONLINE){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});if(window.caches)caches.keys().then(ks=>ks.forEach(k=>caches.delete(k))).catch(()=>{})}
    else navigator.serviceWorker.register("sw.js").catch(()=>{})})}
})();
