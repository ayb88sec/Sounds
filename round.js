/* Najma game round helper (kids-app-design phase 2)
   - a round is 6 questions, then an end screen (Play again / Home): a natural place to stop
   - hints build up: 1st miss fades the wrong answer and replays, 2nd miss makes the right answer glow,
     3rd miss the falcon points at it and says it; the child still taps it
   - the falcon says why an answer is right
   - first-try answers are saved on the iPad (najma:mastery) for the mastery screen later */
(function(){
  const BOY=((window.NAJMA&&NAJMA.me)||{}).gender==="m";
  const css=document.createElement("style");css.textContent=`
  .nr-guide{display:flex;align-items:center;gap:10px;margin:22px 0 4px;text-align:start}
  .nr-guide img{width:84px;height:84px;object-fit:contain;flex:none;transition:transform .3s}
  .nr-guide p{flex:1;margin:0;background:linear-gradient(#fffdf5,#fff6d8);border:3px solid #fff;border-radius:22px;padding:10px 14px;
    font:800 22px "Baloo 2","Baloo Bhaijaan 2",system-ui,sans-serif;line-height:1.3;color:#16204a;box-shadow:0 6px 14px rgba(120,80,20,.18)}
  .nr-dots{display:flex;gap:8px;justify-content:center;margin:8px 0 2px}
  .nr-dots span{width:34px;height:12px;border-radius:99px;background:rgba(0,0,0,.1)}
  .nr-dots span.on{background:linear-gradient(#ffe27a,#ffb703)}
  .opts{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .opts button.nr-off{opacity:.35;pointer-events:none}
  .opts button.nr-glow{box-shadow:0 0 0 7px #ffe066,0 0 26px 8px rgba(255,214,74,.9)!important;animation:nrPulse 1s ease-in-out infinite}
  @keyframes nrPulse{50%{transform:scale(1.06)}}
  .nr-end{display:flex;flex-direction:column;align-items:center;gap:14px;padding:10px 0 4px}
  .nr-end img.f{width:150px;height:150px;object-fit:contain}
  .nr-end h3{margin:0;font:800 34px "Baloo 2","Baloo Bhaijaan 2",system-ui,sans-serif;color:#16204a}
  .nr-end .st{display:flex;gap:4px}.nr-end .st img{width:38px;height:38px}
  .nr-end .ws{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
  .nr-end .ws span{color:#fff;border-radius:14px;padding:4px 14px;font-size:26px;font-weight:700}
  .nr-end .row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
  .nr-end .row a,.nr-end .row button{display:flex;align-items:center;gap:8px;border:4px solid rgba(255,255,255,.85);border-radius:999px;padding:8px 22px;
    font:800 24px "Baloo 2","Baloo Bhaijaan 2",system-ui,sans-serif;color:#16204a;text-decoration:none;cursor:pointer;
    background:linear-gradient(160deg,#fff6c4,#ffd84a);box-shadow:0 6px 0 rgba(120,80,20,.25)}
  .nr-end .row a{background:linear-gradient(160deg,#fff,#e9f4ff)}
  .nr-end .row img{width:40px;height:40px}`;
  document.head.appendChild(css);
  const COL=["#ff5d73","#ffb020","#22c7b8","#4f8bff","#a66bff","#3fc35a"];

  window.NajmaRound=function(o){
    /* o: {card, ar, total=6, again(), colors} */
    const T=o.total||6,ar=!!o.ar,card=o.card;
    let n=0,miss=0,got=[],firsts=0;
    const guide=document.createElement("div");guide.className="nr-guide";guide.innerHTML=`<img src="img/uae/saqoor_point.webp" alt=""><p></p>`;
    const dots=document.createElement("div");dots.className="nr-dots";
    const q=card.querySelector(".q");q.after(dots);card.querySelector(".x").after(guide);
    const end=document.createElement("div");end.className="nr-end";end.style.display="none";card.appendChild(end);
    const parts=[...card.children].filter(x=>x!==end&&!x.classList.contains("x"));
    function say(t,mood){guide.querySelector("p").textContent=t;const im=guide.querySelector("img");im.src=`img/uae/saqoor_${mood||"point"}.webp`;
      im.style.transform="scale(1.12)";setTimeout(()=>im.style.transform="",300)}
    function drawDots(){dots.innerHTML=Array.from({length:T},(_,i)=>`<span class="${i<n?"on":""}"></span>`).join("")}
    function master(key,first){try{const k="najma:mastery",m=JSON.parse(localStorage.getItem(k)||"{}"),d=new Date().toISOString().slice(0,10),r=m[key]||{run:0,days:[],miss:0};
      if(first){r.run++;if(!r.days.includes(d))r.days.push(d);r.days=r.days.slice(-5)}else{r.run=0;r.miss++}r.last=d;m[key]=r;localStorage.setItem(k,JSON.stringify(m))}catch(e){}}
    const R={
      say,
      start(){n=0;miss=0;got=[];firsts=0;end.style.display="none";parts.forEach(x=>x.style.display="");drawDots();say(o.hello||"")},
      question(){miss=0},
      /* a wrong tap. btn = the wrong button, right = the right button, replay() plays the target again, hint = what the falcon says */
      miss(btn,right,replay,hint){miss++;btn.classList.add("wrong","nr-off");
        if(miss===1){say(ar?"اسمع مرة ثانية":"Listen again","think");setTimeout(replay,450)}
        else if(miss===2){right.classList.add("nr-glow");say(hint,"think");setTimeout(replay,450)}
        else{right.classList.add("nr-glow");say(hint,"point");setTimeout(replay,450)}},
      /* a right tap: returns true when the round is finished */
      hit(key,word,why){const first=miss===0;if(first)firsts++;master(key,first);n++;got.push(word);drawDots();say(why,"cheer");return n>=T},
      finish(){parts.forEach(x=>x.style.display="none");const g=BOY?"أحسنت":"أحسنتِ";
        end.innerHTML=`<img class="f" src="img/uae/saqoor_cheer.webp" alt=""><h3>${ar?`${g}! أنهيت ${T} أسئلة`:`You did ${T}!`}</h3>
          <div class="st">${Array.from({length:T},()=>`<img src="img/home2/nav_star.webp" alt="">`).join("")}</div>
          <div class="ws">${got.map((w,i)=>`<span style="background:${COL[i%6]}">${w}</span>`).join("")}</div>
          <div class="row"><button type="button" class="nr-again"><img src="img/btn/again.webp" alt="">${ar?"العب مرة ثانية":"Play again"}</button>
          <a href="home.html"><img src="img/home2/nav_home.webp" alt="">${ar?"الرئيسية":"Home"}</a></div>`;
        end.style.display="";end.querySelector(".nr-again").onclick=()=>o.again()}
    };
    return R};

  /* mix the order of a grid of tiles so the child reads the word, not its place */
  window.NajmaMix=function(grid){const t=[...grid.children];for(let i=t.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[t[i],t[j]]=[t[j],t[i]]}
    t.forEach((x,i)=>{x.style.animation="none";void x.offsetWidth;x.style.animation="";x.style.animationDelay=(i*.04)+"s";grid.appendChild(x)})};
})();
