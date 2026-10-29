/* Najma profiles: gives each child their own progress by namespacing storage, and exposes their settings.
   Must load before any page script. */
(function(){
  const S=Storage.prototype,G=S.getItem,SET=S.setItem,RM=S.removeItem;
  if(location.hash.startsWith("#key=")||location.hash.startsWith("#dev=")){const hp=new URLSearchParams(location.hash.slice(1));
    SET.call(localStorage,"najma:key",(hp.get("key")||"").trim().toUpperCase());
    if(hp.get("kid")){SET.call(localStorage,"najma:lock",hp.get("kid"));SET.call(localStorage,"najma:cur",hp.get("kid"))}
    if(hp.get("dev")){SET.call(localStorage,"najma:dev",hp.get("dev"));if(hp.get("kid"))SET.call(localStorage,"najma:lock",hp.get("kid"))}
    history.replaceState(null,"",location.pathname+location.search)}
  /* a child's iPad is locked to that child: no switching, no seeing siblings */
  const LOCK=G.call(localStorage,"najma:lock");if(LOCK)SET.call(localStorage,"najma:cur",LOCK);
  let profiles=[];try{profiles=JSON.parse(G.call(localStorage,"najma:profiles")||"[]")}catch(e){}
  let cur=LOCK||G.call(localStorage,"najma:cur");
  let me=profiles.find(p=>p.id===cur)||null;
  const key=k=>(typeof k==="string"&&!k.startsWith("najma:")&&!k.startsWith("sb-")&&me)?`najma:${me.id}:${k}`:k;
  S.getItem=function(k){return G.call(this,key(k))};
  S.setItem=function(k,v){return SET.call(this,key(k),v)};
  S.removeItem=function(k){return RM.call(this,key(k))};
  if(window.indexedDB&&me){const open=indexedDB.open.bind(indexedDB);indexedDB.open=(n,v)=>open(`${n}__${me.id}`,v)}
  const DEF={apps:{arabic:true,numAr:true,islam:true,iman:true,sounds:true,cvc:true,sent:true,writeEn:true,numEn:true,shapes:true,name:true,quran:true},numMax:20,sightGroups:[0,1,2,3,4,5,6,7,8]};
  const DEFSEC=[{id:"spell1",title:"Spelling",icon:"🐝",lang:"en",words:["antiseptic","antibiotic","baby","bad","bear"]}];
  let sections;try{sections=JSON.parse(G.call(localStorage,"najma:sections")||"null")}catch(e){}
  if(!Array.isArray(sections))sections=DEFSEC;
  /* levels the parent can switch on per child; default: all on */
  const LEVELS={arabic:["ا – خ","د – ص","ض – ق","ك – ي","الكلمات البصرية"],sounds:["Set 1","Special friends"],wt:["1.1 · m a s d t","1.2 · i n p g o","1.3 · c k u b","1.4 · f e l h sh","1.5 · r j v y w","1.6 · th z ch qu x ng nk","1.7 · 4–5 sounds"],
    sent:["Level 1","Level 2","Level 3","Level 4"],shapes:["Level 1","Level 2","Level 3"],writeEn:["abc","ABC","123"],
    quran:["الفاتحة","الناس – قريش","الفيل – القدر","العلق – الفجر","الغاشية – النبأ"]};
  const lv=app=>{const L=me&&me.levels&&me.levels[app];return Array.isArray(L)&&L.length?L:LEVELS[app].map((_,i)=>i)};
  window.NAJMA={LEVELS,lv,me,profiles,sections,DEFSEC,settings:Object.assign({},DEF,me||{},{apps:Object.assign({},DEF.apps,(me&&me.apps)||{})}),DEF,
    raw:{get:k=>G.call(localStorage,k),set:(k,v)=>SET.call(localStorage,k,v),remove:k=>RM.call(localStorage,k)}};
  /* name chip next to the home button on every page */
  if(me&&!/(home|parent)\.html$/.test(location.pathname)){document.addEventListener("DOMContentLoaded",()=>{
    const c=document.createElement("a");c.href="home.html";
    c.style.cssText=`position:fixed;top:calc(10px + env(safe-area-inset-top));left:70px;z-index:15;height:52px;border-radius:18px;background:${me.color||"#fff"};color:#fff;
      display:flex;align-items:center;gap:6px;padding:0 14px 0 8px;font:800 20px "Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;text-decoration:none;box-shadow:0 5px 0 rgba(0,0,0,.18);text-shadow:0 2px 0 rgba(0,0,0,.15)`;
    c.innerHTML=`<span style="font-size:30px">${me.avatar||"⭐"}</span><span dir="auto">${me.name}</span>`;document.body.appendChild(c);const st=document.createElement("style");st.textContent="main{padding-top:74px !important}";document.head.appendChild(st)})}
  /* family code: private data (names, settings, recordings) is encrypted; each device stores the code once */
  let ckey=null;
  const ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),bu=a=>{let s="";a.forEach(x=>s+=String.fromCharCode(x));return btoa(s)};
  async function cryptoKey(){if(ckey)return ckey;const code=G.call(localStorage,"najma:key");if(!code||!crypto.subtle)throw new Error("nokey");
    const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(code),"PBKDF2",false,["deriveKey"]);
    ckey=await crypto.subtle.deriveKey({name:"PBKDF2",salt:new TextEncoder().encode("najma-family-v1"),iterations:150000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);return ckey}
  async function decrypt(o){const k=await cryptoKey();const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:ub(o.iv)},k,ub(o.ct));return JSON.parse(new TextDecoder().decode(pt))}
  async function encrypt(obj){const k=await cryptoKey();const iv=crypto.getRandomValues(new Uint8Array(12));
    const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},k,new TextEncoder().encode(JSON.stringify(obj)));return {v:1,iv:bu(iv),ct:bu(new Uint8Array(ct))}}
  async function loadAudio(name,v){window[v]=window[v]||{};try{const r=await fetch(`audio/${name}.enc`);const d=await decrypt(await r.json());Object.assign(window[v],d)}catch(e){}return window[v]}
  async function checkCode(code){const old=G.call(localStorage,"najma:key");SET.call(localStorage,"najma:key",code);ckey=null;
    try{const r=await fetch("audio/numbers.enc");await decrypt(await r.json());return true}catch(e){if(old)SET.call(localStorage,"najma:key",old);else RM.call(localStorage,"najma:key");ckey=null;return false}}
  Object.assign(window.NAJMA,{lock:G.call(localStorage,"najma:lock"),decrypt,encrypt,loadAudio,checkCode,hasKey:()=>!!G.call(localStorage,"najma:key")});
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
    SET.call(localStorage,"najma:profiles",P);SET.call(localStorage,"najma:sections",Sx);SET.call(localStorage,"najma:pulledAt",String(Date.now()));
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
      if(P!==G.call(localStorage,"najma:profiles")||Sx!==G.call(localStorage,"najma:sections"))changed=true;
      SET.call(localStorage,"najma:profiles",P);SET.call(localStorage,"najma:sections",Sx);SET.call(localStorage,"najma:lock",kid.id);SET.call(localStorage,"najma:cur",kid.id);
      /* stars: keep the best of the iPad and the database, then send back anything the database is missing */
      const ns=k=>`najma:${kid.id}:${k}`;if(!me)changed=true;
      Object.entries(js.progress||{}).forEach(([k,srv])=>{let loc={};try{loc=JSON.parse(G.call(localStorage,ns(k))||"{}")}catch(e){}
        const m=Object.assign({},srv);Object.entries(loc).forEach(([x,v])=>{m[x]=typeof v==="number"&&typeof srv[x]==="number"?Math.max(v,srv[x]):v});
        const ms=JSON.stringify(m);if(ms!==G.call(localStorage,ns(k))){SET.call(localStorage,ns(k),ms);changed=true}if(ms!==JSON.stringify(srv))push(k,ms)});
      for(let i=0;i<localStorage.length;i++){const full=localStorage.key(i);if(full&&full.startsWith(`najma:${kid.id}:`)){const k=full.slice(kid.id.length+8);if(!(k in (js.progress||{})))push(k,G.call(localStorage,full))}}
      if(changed&&/home\.html$/.test(location.pathname)&&!sessionStorage.getItem("najma:reloaded")){sessionStorage.setItem("najma:reloaded","1");location.reload()}else if(!changed)sessionStorage.removeItem("najma:reloaded")}).catch(()=>{})}
  /* offline: cache everything once it has been opened online */
  if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
})();
