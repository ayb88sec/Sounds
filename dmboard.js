/* Calendar boards for الأيام and الأشهر (ChatGPT artwork approved by the user 2026-11-16, lesson-pipeline days-months).
   The board picture sits where the train was; every day/month stays a live button placed exactly in a slot of the picture.
   Slot positions were measured on the artwork (percent of the picture). */
(function(){
  const B={
    days:{img:"img/approved/dm-board-days.webp",ar:"2400/900",w:9.4,h:28.4,fs:"2.25cqw",
      slots:[9.8,22.0,33.8,45.8,57.7,69.7,81.5].map(x=>[x,47.1])},
    months:{img:"img/approved/dm-board-months.webp",ar:"1600/1250",w:19.3,h:16.1,fs:"3.7cqw",
      slots:[27.9,51.1,73.9].flatMap(y=>[5.3,29.0,51.8,74.8].map(x=>[x,y]))}
  };
  const st=document.createElement("style");
  st.textContent=`
.rail:has(.dmb){background:none!important;box-shadow:none!important;border:0!important;padding:0!important;overflow:visible!important}
.rail:has(.dmb) .ground{display:none!important}
html .track.dmb,html.v2 .track.dmb{background:none!important;box-shadow:none!important}
.track.dmb{border:0!important;border-radius:0!important;position:relative!important;display:block!important;overflow:visible!important;padding:0!important;margin:0 auto!important;width:min(100%,1040px);aspect-ratio:var(--dmar);container-type:inline-size}
.track.dmb.months{width:min(100%,calc((100dvh - 260px)*1.28),820px)}
.track.dmb .dmb-img{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;user-select:none}
.track.dmb .car{position:absolute!important;margin:0!important;padding:0 .3cqw!important;min-width:0!important;background:transparent!important;color:#13275a!important;border:0!important;
  border-radius:2cqw!important;box-shadow:none!important;font-size:var(--dmfs)!important;font-weight:800;line-height:1.15;display:flex;align-items:center;justify-content:center;text-align:center;
  animation:none;text-shadow:none!important;scroll-snap-align:none;-webkit-tap-highlight-color:transparent}
.track.dmb .car .e{display:none!important}
.track.dmb .car::after{display:none!important}
.track.dmb .car:active{transform:scale(.95)}
.track.dmb .car.hop{animation:dmHop .5s}
@keyframes dmHop{40%{transform:translateY(-1.6cqw) scale(1.04)}}
.track.dmb .car.now{box-shadow:0 0 0 .55cqw #07988f,0 0 0 1.2cqw rgba(7,152,143,.22)!important}
.track.dmb .car.now::before{content:""!important;position:absolute;top:-2.2cqw;right:-1.6cqw;left:auto;width:4.2cqw;height:4.2cqw;transform:none;animation:none;
  background:url(img/approved/reward-star.webp) center/contain no-repeat}
.track.dmb .car.dim{opacity:.4}
.track.dmb .car.q{background:url(img/approved/dm-slot-gap.webp) center/100% 100% no-repeat!important;color:transparent!important;transform:scale(1.12)}
/* the answer cards of the games live in #ctl, which the lesson frame hides once its buttons move to the side panel */
main #ctl:has(.picks){display:block!important;margin-top:clamp(14px,3vh,28px)}
.picks{display:flex!important;justify-content:center;gap:clamp(12px,2.4vw,24px);flex-wrap:wrap}
.picks .car{font-size:clamp(20px,2.4vw,28px)!important;min-width:clamp(120px,15vw,180px);border-radius:22px!important;background:linear-gradient(#fffaf0,#fbeacb)!important;color:#13275a!important;border:3px solid #fffdf5!important;box-shadow:0 6px 0 #e0bf86,0 10px 16px rgba(110,62,15,.18)!important;
  font-weight:800;min-height:64px;padding:10px 18px!important;text-shadow:none!important}
.picks .car .e,.picks .car::after{display:none!important}
`;
  document.head.appendChild(st);
  window.DMB={
    /* returns the board picture; call place() after the cards are appended */
    start(tr,kind){const b=B[kind];tr.classList.add("dmb",kind);tr.style.setProperty("--dmar",b.ar);tr.style.setProperty("--dmfs",b.fs);
      return `<img class="dmb-img" src="${b.img}" alt="">`},
    /* cards in reading order: Arabic fills each row right to left */
    place(tr,kind,rtl){const b=B[kind],cols=kind==="days"?7:4;
      [...tr.children].filter(e=>!e.classList.contains("dmb-img")).forEach((e,i)=>{
        const r=Math.floor(i/cols),c=i%cols,slot=b.slots[r*cols+(rtl?cols-1-c:c)];if(!slot)return;
        e.style.left=slot[0]+"%";e.style.top=slot[1]+"%";e.style.width=b.w+"%";e.style.height=b.h+"%"});
      /* long names (Wednesday, Thursday...) shrink until they fit inside their card (user 2026-11-19) */
      const fit=()=>{const C=[...tr.querySelectorAll(".car")];C.forEach(e=>e.style.removeProperty("font-size"));let k=1,fs=0;C.forEach(e=>{const t=[...e.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).pop();if(!t)return;const cs=getComputedStyle(e),room=e.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);const g=document.createRange();g.selectNodeContents(t);const w=g.getBoundingClientRect().width;fs=parseFloat(cs.fontSize);if(w>room&&w>0)k=Math.min(k,room/w*0.97)});
        /* one size for every card, so the names match */if(k<1)C.forEach(e=>e.style.setProperty("font-size",(fs*k)+"px","important"))};
      requestAnimationFrame(fit);if(!tr._dmfit){tr._dmfit=1;addEventListener("resize",()=>requestAnimationFrame(fit))}}
  };
})();
