/* Najma hint helper (kids-app-design): after the 2nd miss on a question the right answer glows.
   NajmaHint(button, rightSelector?, {key, keep})
   - the right button is found by rightSelector, or by data-ok="1" on a sibling
   - key: a question id when the same box is reused for several questions (sequencing games)
   - keep: do not fade the wrong button (when it is needed again later) */
(function(){
  const css=document.createElement("style");css.textContent=`
  .nr-off{opacity:.35!important;pointer-events:none}
  .nr-glow{box-shadow:0 0 0 7px #ffe066,0 0 26px 8px rgba(255,214,74,.9)!important;animation:nrPulse 1s ease-in-out infinite;position:relative;z-index:2}
  @keyframes nrPulse{50%{transform:scale(1.06)}}
  @media (prefers-reduced-motion:reduce){.nr-glow{animation:none}}`;
  document.head.appendChild(css);
  window.NajmaHint=function(b,sel,o){o=o||{};const box=b.parentElement;if(!box)return;
    if(o.key!==undefined&&box._nk!==o.key){box._nk=o.key;box._nm=0;box.querySelectorAll(".nr-glow").forEach(x=>x.classList.remove("nr-glow"))}
    box._nm=(box._nm||0)+1;if(!o.keep)b.classList.add("nr-off");
    if(box._nm>=2){const r=sel?box.querySelector(sel):box.querySelector('[data-ok="1"]');if(r)r.classList.add("nr-glow")}};
})();
