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
      A.innerHTML=`<div id="nfSay"></div><div id="nfTools"></div><img id="nfFal" src="img/v2/f_wave.webp" alt="">`;D.body.appendChild(A);
      const say=o.say&&D.querySelector(o.say);if(say){D.getElementById("nfSay").appendChild(say)}else D.getElementById("nfSay").remove();
      const T=D.getElementById("nfTools");
      (o.tools||[]).forEach(t=>{const el=typeof t.el==="string"?D.querySelector(t.el):t.el;if(!el)return;
        const lab=(el.textContent||"").replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,"").trim();
        el.classList.add("nfBtn");if(t.tab)el.addEventListener("click",()=>{T.querySelectorAll(".nfBtn").forEach(x=>x.classList.toggle("on",x===el))});el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${ICON[t.icon]||ICON.play}</svg><b>${t.label||lab}</b>`;T.appendChild(el)});
      D.documentElement.classList.add("nfOn");
      const fal=D.getElementById("nfFal");setInterval(()=>{const k=fal.src;fal.src="img/v2/f_blink.webp";setTimeout(()=>fal.src=k,160)},3400);
      fal.onclick=()=>{fal.src="img/v2/f_jump.webp";fal.classList.remove("hop");void fal.offsetWidth;fal.classList.add("hop");setTimeout(()=>fal.src="img/v2/f_wave.webp",900)};
      if(say)new MutationObserver(()=>{fal.src="img/v2/f_talk2.webp";fal.classList.remove("hop");void fal.offsetWidth;fal.classList.add("hop");clearTimeout(fal._t);fal._t=setTimeout(()=>fal.src="img/v2/f_wave.webp",900)}).observe(say,{childList:true,characterData:true,subtree:true})};
    if(document.readyState==="complete")setTimeout(go,30);else addEventListener("load",()=>setTimeout(go,30));
  };
  const st=document.createElement("style");st.textContent=`
html.nfOn body::before{background:#f3cf98 url(img/v2/bg_calm.webp) center bottom/cover no-repeat!important}
html.nfOn main::before{display:none!important}
html.nfOn main{position:fixed!important;inset:0 0 0 min(30vw,300px)!important;padding:calc(108px + env(safe-area-inset-top)) 18px 16px!important;overflow-y:auto!important}
html[dir=rtl].nfOn main{inset:0 min(30vw,300px) 0 0!important}
html.nfOn main h1{left:50%!important}
#nf{position:fixed;z-index:24;top:0;bottom:0;left:0;width:min(30vw,300px);display:flex;flex-direction:column;align-items:center;padding:calc(100px + env(safe-area-inset-top)) 14px 0;gap:14px;font-family:"Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif}
html[dir=rtl] #nf{left:auto;right:0}
#nfSay{width:100%}
#nfSay>*{display:block!important;position:static!important;margin:0!important;transform:none!important;max-width:none!important;background:#fffaf0!important;border:4px solid #f1d9ae!important;border-radius:24px!important;
  padding:12px 16px!important;font-size:clamp(16px,2vw,22px)!important;font-weight:800!important;line-height:1.3!important;color:#3b2a14!important;text-align:center;box-shadow:0 7px 0 rgba(170,115,50,.22)!important}
#nfTools{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px;width:100%}
#nfTools .nfBtn{all:unset;box-sizing:border-box;cursor:pointer;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;min-height:0!important;width:auto!important;text-shadow:none!important;display:flex!important;flex-direction:column;align-items:center;gap:4px;font:800 clamp(13px,1.5vw,16px)/1.15 "Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;color:#5c3008!important;text-align:center;-webkit-tap-highlight-color:transparent}
#nfTools .nfBtn svg{width:clamp(54px,6.4vw,70px);height:clamp(54px,6.4vw,70px);padding:15px;box-sizing:border-box;border-radius:50%;color:#fffdf7!important;stroke:#fffdf7!important;background:linear-gradient(#d99a52,#b9722f);border:4px solid #7d4a1c;box-shadow:0 6px 0 rgba(90,50,10,.35),inset 0 4px 0 rgba(255,255,255,.25);transition:transform .12s}
#nfTools .nfBtn:active svg{transform:translateY(4px);box-shadow:0 2px 0 rgba(90,50,10,.35)}
#nfTools .nfBtn b{font-weight:800}
#nfTools .nfBtn.on svg{background:linear-gradient(#2fa36b,#1f7a4e);border-color:#145236;box-shadow:0 6px 0 rgba(20,82,54,.4),0 0 0 4px #fff,0 0 14px 6px rgba(255,214,70,.7)}
#nfFal{margin-top:auto;width:min(26vw,230px);max-height:42vh;object-fit:contain;object-position:bottom;filter:drop-shadow(0 10px 8px rgba(110,60,10,.28));cursor:pointer}
#nfFal.hop{animation:nfHop .6s cubic-bezier(.34,1.56,.64,1)}
@keyframes nfHop{40%{transform:translateY(-22px) scale(1.04)}}
@media (max-height:540px){html.nfOn main div:has(>.nx-prog){padding:4px 12px 6px!important;margin:0 auto 8px!important}html.nfOn main div:has(>.nx-prog) *{font-size:14px!important}html.nfOn .nx-prog{height:10px!important}#nf{padding-top:calc(58px + env(safe-area-inset-top));gap:8px}html.nfOn main{padding-top:calc(58px + env(safe-area-inset-top))!important}#nfFal{max-height:34vh}#nfTools .nfBtn svg{width:46px;height:46px;padding:11px}#nfTools .nfBtn{font-size:12px}#nfSay>*{font-size:14px!important;padding:8px 10px!important}}
`;(document.head||document.documentElement).appendChild(st);
})();
