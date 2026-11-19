/* Najma lesson frame (new look): falcon and tools on the left, the lesson on the right, one landscape screen.
   A page calls NajmaFrame({say:"#say", tools:[{el:"#id", icon:"test|write|again|sound|play|mix|cards|listen"}], content:"section"}) */
(function(){
  const ICON={
    test:'<path d="M5 4h14v16H5z" fill="none"/><path d="M8 9l2 2 4-4M8 15h8"/>',
    write:'<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5 4 20z"/><path d="M14.5 6l3.5 3.5"/>',
    again:'<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/>',
    sound:'<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    play:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
    mix:'<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    cards:'<rect x="3" y="6" width="12" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    listen:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5" fill="currentColor"/><rect x="17" y="14" width="4" height="6" rx="1.5" fill="currentColor"/>'};
  window.NajmaFrame=function(o){
    const go=()=>{if(!document.documentElement.classList.contains("v2"))return;
      const D=document,A=D.createElement("aside");A.id="nf";
      A.innerHTML=`<div id="nfSay"></div><div id="nfTools"></div><img id="nfFal" src="img/approved/mascot-falcon.webp" alt="">`;D.body.appendChild(A);
      const say=(o.say&&D.querySelector(o.say))||D.querySelector('main .sub, main > p');if(say){D.getElementById("nfSay").appendChild(say)}else D.getElementById("nfSay").remove();
      const T=D.getElementById("nfTools");
      const list=[];(o.tools||[]).forEach(t=>{const els=typeof t.el==="string"?(t.all?[...D.querySelectorAll(t.el)]:[D.querySelector(t.el)]):[t.el];els.forEach((el,i)=>{if(el)list.push([Object.assign({},t,{icon:(t.icons&&t.icons[i])||t.icon,label:(t.labels&&t.labels[i])||t.label}),el])})});
      list.forEach(([t,el])=>{
        const lab=(el.textContent||"").replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,"").trim();
        el.classList.add("nfBtn");el.setAttribute("aria-label",t.label||lab);el.title=t.label||lab;if(t.tab)el.addEventListener("click",()=>{T.querySelectorAll(".nfBtn").forEach(x=>x.classList.toggle("on",x===el))});/* approved round buttons (ChatGPT bladi-visuals, approved by the user 2026-11-19: the old "listen" headphones were not liked); test/write keep their drawn icons */
        const IMI={listen:"ic-listen",sound:"ic-listen",play:"ic-playall",again:"ic-again",cards:"ic-cards",mix:"ic-shuffle"}[t.icon||"play"];
        if(IMI&&!D.getElementById("nfImgCss")){const st=D.createElement("style");st.id="nfImgCss";st.textContent='#nfTools .nfBtn img.nfImg{width:clamp(48px,4.8vw,60px);height:clamp(48px,4.8vw,60px);object-fit:contain;filter:drop-shadow(0 4px 4px rgba(120,80,20,.25));transition:transform .12s}#nfTools .nfBtn:active img.nfImg{transform:translateY(3px) scale(.96)}#nfTools .nfBtn.on img.nfImg{border-radius:50%;box-shadow:0 0 0 4px #12988d}';D.head.appendChild(st)}
        el.innerHTML=(IMI?`<img class="nfImg" src="img/approved/v4/${IMI}.webp" alt="">`:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${ICON[t.icon]||ICON.play}</svg>`)+`<b>${t.label||lab}</b>`;T.appendChild(el)});
      D.querySelectorAll('main .bar,main .center,#ctl').forEach(b=>{if(!b.querySelector('button,a'))b.style.display='none'});
      D.documentElement.classList.add("nfOn");
      /* the approved falcon (production artwork pack); he hops when tapped and when he talks */
      const fal=D.getElementById("nfFal"),hop=()=>{fal.classList.remove("hop");void fal.offsetWidth;fal.classList.add("hop")};
      fal.onclick=hop;
      if(say)new MutationObserver(hop).observe(say,{childList:true,characterData:true,subtree:true})};
    if(document.readyState==="complete")setTimeout(go,30);else addEventListener("load",()=>setTimeout(go,30));
  };
  const st=document.createElement("style");st.textContent=`
html.nfOn body::before{background-position:center bottom!important}
html.nfOn main::before{display:none!important}
html.nfOn main section{background:none!important;border:0!important;box-shadow:none!important}
html.nfOn main .tabs{justify-content:center}
html.nfOn main{position:fixed!important;inset:0 0 0 min(30vw,300px)!important;padding:calc(108px + env(safe-area-inset-top)) 18px 16px!important;overflow-y:auto!important}
html[dir=rtl].nfOn main{inset:0 min(30vw,300px) 0 0!important}
html.nfOn main h1{left:50%!important}
#nf{position:fixed;z-index:24;top:0;bottom:0;left:0;width:min(30vw,300px);display:flex;flex-direction:column;align-items:center;padding:calc(100px + env(safe-area-inset-top)) 14px 0;gap:14px;font-family:"Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif}
html[dir=rtl] #nf{left:auto;right:0}
#nfSay{width:100%}
#nfSay>*{display:block!important;position:static!important;margin:0!important;transform:none!important;max-width:none!important;background:#fffaf0!important;border:3px solid #fff!important;border-radius:24px!important;
  padding:12px 16px!important;font-size:clamp(16px,2vw,22px)!important;font-weight:800!important;line-height:1.3!important;color:#1d2a5c!important;text-align:center;box-shadow:0 6px 0 #e6c993,0 10px 16px rgba(120,80,20,.14)!important}
#nfTools{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px;width:100%}
/* readable on any scene: the tools sit on a cream panel, and nothing in the side panel can be text-selected by a long press */
#nf,#nf *{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none}
#nf ::selection{background:transparent}
#nfTools{box-sizing:border-box;padding:14px 10px 12px;border-radius:26px;background:linear-gradient(#fffaf0,#fbeacb);border:3px solid #fffdf5;box-shadow:0 6px 0 #e0bf86,0 12px 22px rgba(90,55,15,.25)}
#nfTools .nfBtn b{color:#13275a!important;font-size:clamp(14px,1.6vw,18px)!important}
#nfTools .nfBtn{all:unset;box-sizing:border-box;cursor:pointer;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;min-height:0!important;width:auto!important;text-shadow:none!important;display:flex!important;flex-direction:column;align-items:center;gap:4px;font:800 clamp(13px,1.5vw,16px)/1.15 "Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;color:#1d2a5c!important;text-align:center;-webkit-tap-highlight-color:transparent}
#nfTools .nfBtn svg{width:clamp(54px,6.4vw,70px);height:clamp(54px,6.4vw,70px);padding:15px;box-sizing:border-box;border-radius:50%;color:#1f7f74!important;stroke:#1f7f74!important;background:linear-gradient(#fffdf6,#fbeccb);border:3px solid #fff;box-shadow:0 6px 0 #e6c993,0 9px 14px rgba(120,80,20,.16);transition:transform .12s}
#nfTools .nfBtn:active svg{transform:translateY(4px);box-shadow:0 2px 0 #e6c993}
#nfTools .nfBtn b{font-weight:800}
#nfTools .nfBtn.on svg{color:#fff!important;stroke:#fff!important;background:linear-gradient(#3fb5a6,#1f7f74);border-color:#fff;box-shadow:0 6px 0 #17665d,0 0 0 4px rgba(63,181,166,.25)}
#nfFal{margin-top:auto;width:min(26vw,230px);max-height:42vh;object-fit:contain;object-position:bottom;filter:drop-shadow(0 10px 8px rgba(110,60,10,.28));cursor:pointer}
#nfFal.hop{animation:nfHop .6s cubic-bezier(.34,1.56,.64,1)}
@keyframes nfHop{40%{transform:translateY(-22px) scale(1.04)}}
@media (max-height:540px){html.nfOn main div:has(>.nx-prog){padding:4px 12px 6px!important;margin:0 auto 8px!important}html.nfOn main div:has(>.nx-prog) *{font-size:14px!important}html.nfOn .nx-prog{height:10px!important}#nf{padding-top:calc(58px + env(safe-area-inset-top));gap:8px}html.nfOn main{padding-top:calc(58px + env(safe-area-inset-top))!important}#nfFal{max-height:34vh}#nfTools .nfBtn svg{width:46px;height:46px;padding:11px}#nfTools .nfBtn{font-size:12px}#nfSay>*{font-size:14px!important;padding:8px 10px!important}}
/* ===== lesson layout as in the approved screens: the falcon stands large on the left, his words above him, a few round icon tools, the lesson on the right with nothing boxed in white ===== */
html.nfOn main,html[dir=rtl].nfOn main{inset:0 0 0 min(30vw,330px)!important}
#nf,html[dir=rtl] #nf{left:0!important;right:auto!important;width:min(30vw,330px)!important;padding:calc(96px + env(safe-area-inset-top)) 14px 0 18px!important;gap:12px!important}
#nfSay>*{border-radius:22px!important;border:3px solid #fffdf5!important;background:linear-gradient(#fffaf0,#fbeacb)!important;color:#13275a!important;box-shadow:0 5px 0 #e0bf86,0 10px 18px rgba(90,55,15,.22)!important;position:relative!important}
#nfTools{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;display:flex!important;flex-wrap:wrap;justify-content:center;gap:10px 12px!important}
#nfTools .nfBtn b{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap}
#nfTools .nfBtn svg{width:clamp(52px,5.6vw,64px)!important;height:clamp(52px,5.6vw,64px)!important;padding:14px!important;background:linear-gradient(#fff9e9,#ffe7b9)!important;border:2px solid #fff9e9!important;box-shadow:0 4px 0 #c9964d,0 7px 15px rgba(123,69,23,.25),inset 0 2px 0 #fff!important;color:#09958f!important;stroke:#09958f!important}
#nfTools .nfBtn.on svg{background:linear-gradient(#0db5a6,#07877e)!important;color:#fff!important;stroke:#fff!important;box-shadow:0 4px 0 #075d58,0 7px 15px rgba(7,93,88,.25)!important}
#nfFal{margin-top:auto!important;width:min(28vw,310px)!important;max-height:52vh!important}
html.nfOn main div:has(>.nx-prog){background:linear-gradient(#fffaf0,#fbeacb)!important;border:3px solid #fffdf5!important;border-radius:999px!important;box-shadow:0 5px 0 #e0bf86!important}
html.nfOn main h2,html.nfOn main section>h3{display:table;margin-inline:auto!important;padding:2px 18px!important;border-radius:999px;background:linear-gradient(#fffaf0,#fbeacb);color:#13275a!important;box-shadow:0 4px 0 #e0bf86}
@media (max-height:540px){#nf,html[dir=rtl] #nf{padding-top:calc(66px + env(safe-area-inset-top))!important;gap:6px!important}#nfFal{max-height:42vh!important}#nfTools .nfBtn svg{width:44px!important;height:44px!important;padding:10px!important}}
/* narrower side panel (user 2026-11-16: it took too much space) */
html.nfOn main,html[dir=rtl].nfOn main{inset:0 0 0 min(22vw,250px)!important}
#nf,html[dir=rtl] #nf{width:min(22vw,250px)!important;padding-left:10px!important;padding-right:10px!important}
#nfTools{gap:8px 10px!important}
#nfTools .nfBtn svg{width:clamp(44px,4.4vw,54px)!important;height:clamp(44px,4.4vw,54px)!important;padding:12px!important}
#nfSay>*{font-size:clamp(14px,1.5vw,17px)!important;padding:8px 10px!important}
#nfFal{width:min(20vw,220px)!important;max-height:44vh!important}
`;(document.head||document.documentElement).appendChild(st);
})();
