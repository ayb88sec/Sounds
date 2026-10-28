/* Progress rocket + parent-only reset, added to every app page.
   A page sets window.NAJMA_PROGRESS = () => ({done, total}) and window.NAJMA_RESET = () => {...clear its stars...}. */
(function(){
  const P=window.NAJMA_PROGRESS;if(!P)return;
  const ar=document.documentElement.dir==="rtl",main=document.querySelector("main");if(!main)return;
  const css=document.createElement("style");css.textContent=`
  .nx-prog{background:rgba(255,255,255,.25);border-radius:999px;height:30px;position:relative;margin:14px 34px 4px 8px;box-shadow:inset 0 3px 0 rgba(0,0,0,.1)}
  .nx-fill{position:absolute;top:0;${ar?"right":"left"}:0;height:100%;border-radius:999px;background:linear-gradient(${ar?270:90}deg,#ffe066,#ffb020,#ff5d73);width:0;transition:width .8s cubic-bezier(.3,1.6,.5,1)}
  .nx-rocket{position:absolute;top:50%;font-size:30px;transition:${ar?"right":"left"} .8s cubic-bezier(.3,1.6,.5,1);${ar?"right":"left"}:0;transform:translate(${ar?"50%":"-50%"},-55%) rotate(${ar?"-135deg":"45deg"})${ar?" scaleY(-1)":""}}
  .nx-moon{position:absolute;${ar?"left":"right"}:-30px;top:50%;transform:translateY(-55%);font-size:26px}
  .nx-count{color:#fff;text-align:center;font:700 18px "Baloo 2","Baloo Bhaijaan 2",system-ui;margin-top:4px;text-shadow:0 2px 0 rgba(0,0,0,.12)}
  .nx-reset{display:block;margin:26px auto 0;border:0;background:rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:8px 16px;font:700 15px "Baloo 2","Baloo Bhaijaan 2",system-ui;cursor:pointer}
  .nx-gate{position:fixed;inset:0;background:rgba(30,15,70,.6);display:flex;align-items:center;justify-content:center;z-index:80;padding:14px}
  .nx-gate div{background:#fff;border-radius:24px;padding:20px;text-align:center;width:300px;font-family:"Baloo 2","Baloo Bhaijaan 2",system-ui}
  .nx-gate input{width:100%;font:700 20px system-ui;border:3px solid #e6def8;border-radius:14px;padding:8px;text-align:center;letter-spacing:2px;text-transform:uppercase;margin:10px 0}
  .nx-gate button{font:800 17px inherit;border:0;border-radius:999px;padding:9px 16px;margin:3px;cursor:pointer;background:#f3f0fa}
  .nx-gate button.go{background:#ff5d73;color:#fff}`;document.head.appendChild(css);
  if(!window.NAJMA_HAS_ROCKET){
    const box=document.createElement("div");box.innerHTML=`<div class="nx-prog"><div class="nx-fill"></div><div class="nx-rocket">🚀</div><div class="nx-moon">🌙</div></div><div class="nx-count"></div>`;
    const anchor=main.querySelector("section,.tabs,.toggle,.building,.grid,.card");anchor?anchor.before(box):main.appendChild(box);
    let last=-1;const tick=()=>{let p;try{p=P()}catch(e){return}if(!p||!p.total)return;const d=Math.min(p.done,p.total);if(d===last)return;last=d;
      const pct=d/p.total*100;box.querySelector(".nx-fill").style.width=pct+"%";box.querySelector(".nx-rocket").style[ar?"right":"left"]=Math.max(4,Math.min(pct,94))+"%";
      box.querySelector(".nx-count").textContent=d>=p.total?(ar?"🏆 وصلت إلى القمر!":"🏆 You reached the moon!"):(ar?`⭐ ${d} من ${p.total}`:`⭐ ${d} of ${p.total}`)};
    tick();setInterval(tick,800)}
  /* old reset buttons were open to the kids; replace them with a parent-only one */
  document.querySelectorAll("#reset").forEach(b=>b.style.display="none");
  if(window.NAJMA_RESET){const r=document.createElement("button");r.className="nx-reset";r.textContent=ar?"🔄 تصفير النجوم (للوالدين)":"🔄 Reset stars (parents)";main.appendChild(r);
    r.onclick=()=>{const g=document.createElement("div");g.className="nx-gate";
      g.innerHTML=`<div><div style="font-size:40px">🔑</div><b>${ar?"رمز العائلة":"Family code"}</b><input dir="ltr" placeholder="XXXX-XXXX-XXXX"><div><button>${ar?"إلغاء":"Cancel"}</button><button class="go">${ar?"تصفير":"Reset"}</button></div></div>`;
      document.body.appendChild(g);const inp=g.querySelector("input");setTimeout(()=>inp.focus(),50);
      g.querySelector("button").onclick=()=>g.remove();
      g.querySelector(".go").onclick=()=>{if(inp.value.trim().toUpperCase()===(window.NAJMA&&NAJMA.raw.get("najma:key"))){try{window.NAJMA_RESET()}catch(e){}location.reload()}else{inp.value="";inp.placeholder="❌"}}}}
})();
