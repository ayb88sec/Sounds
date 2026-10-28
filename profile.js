/* Najma profiles: gives each child their own progress by namespacing storage, and exposes their settings.
   Must load before any page script. */
(function(){
  const S=Storage.prototype,G=S.getItem,SET=S.setItem,RM=S.removeItem;
  let profiles=[];try{profiles=JSON.parse(G.call(localStorage,"najma:profiles")||"[]")}catch(e){}
  let cur=G.call(localStorage,"najma:cur");
  let me=profiles.find(p=>p.id===cur)||null;
  const key=k=>(typeof k==="string"&&!k.startsWith("najma:")&&me)?`najma:${me.id}:${k}`:k;
  S.getItem=function(k){return G.call(this,key(k))};
  S.setItem=function(k,v){return SET.call(this,key(k),v)};
  S.removeItem=function(k){return RM.call(this,key(k))};
  if(window.indexedDB&&me){const open=indexedDB.open.bind(indexedDB);indexedDB.open=(n,v)=>open(`${n}__${me.id}`,v)}
  const DEF={apps:{arabic:true,numAr:true,islam:true,iman:true,sounds:true,sight:true,numEn:true},numMax:20,sightGroups:[0,1,2,3,4,5,6,7,8]};
  const DEFSEC=[{id:"spell1",title:"Spelling",icon:"🐝",lang:"en",words:["antiseptic","antibiotic","baby","bad","bear"]}];
  let sections;try{sections=JSON.parse(G.call(localStorage,"najma:sections")||"null")}catch(e){}
  if(!Array.isArray(sections))sections=DEFSEC;
  window.NAJMA={me,profiles,sections,DEFSEC,settings:Object.assign({},DEF,me||{},{apps:Object.assign({},DEF.apps,(me&&me.apps)||{})}),DEF,
    raw:{get:k=>G.call(localStorage,k),set:(k,v)=>SET.call(localStorage,k,v),remove:k=>RM.call(localStorage,k)}};
  /* name chip next to the home button on every page */
  if(me&&!/home\.html$/.test(location.pathname)){document.addEventListener("DOMContentLoaded",()=>{
    const c=document.createElement("a");c.href="home.html";
    c.style.cssText=`position:fixed;top:calc(10px + env(safe-area-inset-top));left:70px;z-index:15;height:52px;border-radius:18px;background:${me.color||"#fff"};color:#fff;
      display:flex;align-items:center;gap:6px;padding:0 14px 0 8px;font:800 20px "Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;text-decoration:none;box-shadow:0 5px 0 rgba(0,0,0,.18);text-shadow:0 2px 0 rgba(0,0,0,.15)`;
    c.innerHTML=`<span style="font-size:30px">${me.avatar||"⭐"}</span><span dir="auto">${me.name}</span>`;document.body.appendChild(c);const st=document.createElement("style");st.textContent="main{padding-top:74px !important}";document.head.appendChild(st)})}
  /* cloud settings: children and sections live in config.json on GitHub; every device follows it */
  const REPO="ayb88sec/Sounds";
  async function fetchConfig(){
    try{const r=await fetch(`https://api.github.com/repos/${REPO}/contents/config.json?ref=main&t=${Date.now()}`,{headers:{Accept:"application/vnd.github.raw+json"},cache:"no-store"});
      if(r.ok)return await r.json()}catch(e){}
    try{const r=await fetch(`https://raw.githubusercontent.com/${REPO}/main/config.json?t=${Date.now()}`,{cache:"no-store"});if(r.ok)return await r.json()}catch(e){}
    return null}
  async function pull(){const cfg=await fetchConfig();if(!cfg||!cfg.updated)return false;
    const P=JSON.stringify(cfg.profiles||[]),Sx=JSON.stringify(cfg.sections||[]);
    const changed=P!==G.call(localStorage,"najma:profiles")||Sx!==G.call(localStorage,"najma:sections");
    SET.call(localStorage,"najma:profiles",P);SET.call(localStorage,"najma:sections",Sx);SET.call(localStorage,"najma:pulledAt",String(Date.now()));
    const c=G.call(localStorage,"najma:cur");if((cfg.profiles||[]).length&&!(cfg.profiles||[]).some(p=>p.id===c))SET.call(localStorage,"najma:cur",cfg.profiles[0].id);
    return changed}
  window.NAJMA.REPO=REPO;window.NAJMA.fetchConfig=fetchConfig;
  if(!/parent\.html$/.test(location.pathname)&&navigator.onLine!==false){
    const last=+G.call(localStorage,"najma:pulledAt")||0,home=/home\.html$/.test(location.pathname);
    if(home||Date.now()-last>120000)pull().then(ch=>{if(!ch){sessionStorage.removeItem("najma:reloaded");return}if(home&&!sessionStorage.getItem("najma:reloaded")){sessionStorage.setItem("najma:reloaded","1");location.reload()}})}
  /* offline: cache everything once it has been opened online */
  if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
})();
