/* WritePad: trace a big faint glyph with a finger, then check it.
   WritePad.open({items:["ب","ت"], index:0, rtl:true, font:"...", labels:{...}, onStar:(item,stars)=>{}, onSay:(item)=>{}}) */
(function(){
const css=`
.wp-modal{position:fixed;inset:0;background:rgba(20,15,60,.6);display:none;align-items:center;justify-content:center;z-index:50;padding:10px}
.wp-modal.show{display:flex}
.wp-card{background:#fff;border-radius:30px;padding:14px 14px 16px;width:100%;max-width:var(--wpw,560px);text-align:center;position:relative;animation:wpzoom .4s cubic-bezier(.3,1.6,.5,1)}
@keyframes wpzoom{from{transform:scale(.4);opacity:0}}
.wp-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.wp-title{font-size:24px;font-weight:800;font-family:inherit}
.wp-x{border:0;background:#f0edf7;border-radius:50%;width:42px;height:42px;font-size:20px;cursor:pointer}
.wp-stage{position:relative;width:100%;aspect-ratio:var(--wpa,1);max-height:62vh;margin:0 auto;border-radius:24px;overflow:hidden;
  background:#fffdf5;box-shadow:inset 0 0 0 4px #ffe9a8;touch-action:none}
.wp-stage canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}
.wp-lines{position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 calc(25% - 2px),#ffe1e1 calc(25% - 2px) 25%)}
.wp-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.wp-b{font-family:inherit;font-size:19px;font-weight:800;border:0;border-radius:999px;padding:10px 16px;cursor:pointer;color:#2b2340;background:#f3f0fa;box-shadow:0 5px 0 #d9d1ea}
.wp-b:active{transform:translateY(4px);box-shadow:0 1px 0 #d9d1ea}
.wp-b.go{background:#3fc35a;color:#fff;box-shadow:0 5px 0 #2a9442}
.wp-b.y{background:#ffe066;box-shadow:0 5px 0 #d9a400}
.wp-colors{display:flex;gap:8px;justify-content:center;margin-top:10px}
.wp-colors button{width:34px;height:34px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #ddd;cursor:pointer}
.wp-colors button.on{box-shadow:0 0 0 3px #2b2340}
.wp-res{position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,.75);font-size:28px;font-weight:800}
.wp-res.show{display:flex;animation:wpzoom .4s}
.wp-res b{font-size:64px;letter-spacing:4px}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

const L={ar:{title:"اكتب",clear:"🧽 امسح",check:"✅ تحقق",guide:"👁️ الدليل",next:"التالي",prev:"السابق",great:"ممتاز!",good:"جيد جدًا!",try:"حاول مرة ثانية 💪",hear:"🔊"},
         en:{title:"Write it",clear:"🧽 Clear",check:"✅ Check",guide:"👁️ Guide",next:"Next",prev:"Back",great:"Amazing!",good:"Good job!",try:"Try again 💪",hear:"🔊"}};
let m,cv,ctx,gcv,o,items,idx,showGuide=true,ink="#4f8bff",strokes=[],drawing=false,T;

function build(){
  m=document.createElement("div");m.className="wp-modal";
  m.innerHTML=`<div class="wp-card"><div class="wp-top"><button class="wp-x">✕</button><div class="wp-title"></div><button class="wp-b wp-hear">🔊</button></div>
   <div class="wp-stage"><div class="wp-lines"></div><canvas class="wp-g"></canvas><canvas class="wp-d"></canvas><div class="wp-res"></div></div>
   <div class="wp-colors"></div>
   <div class="wp-row"><button class="wp-b wp-clear"></button><button class="wp-b wp-guide"></button><button class="wp-b go wp-check"></button></div>
   <div class="wp-row"><button class="wp-b y wp-prev"></button><button class="wp-b y wp-next"></button></div></div>`;
  document.body.appendChild(m);
  gcv=m.querySelector(".wp-g");cv=m.querySelector(".wp-d");ctx=cv.getContext("2d");
  const cols=m.querySelector(".wp-colors");
  ["#4f8bff","#ff5d73","#3fc35a","#a66bff","#ffb020","#2b2340"].forEach((c,i)=>{const b=document.createElement("button");b.style.background=c;if(!i)b.className="on";
    b.onclick=()=>{ink=c;cols.querySelectorAll("button").forEach(x=>x.classList.remove("on"));b.classList.add("on")};cols.appendChild(b)});
  m.querySelector(".wp-x").onclick=()=>m.classList.remove("show");
  m.querySelector(".wp-clear").onclick=clear;
  m.querySelector(".wp-guide").onclick=()=>{showGuide=!showGuide;drawGuide()};
  m.querySelector(".wp-check").onclick=check;
  m.querySelector(".wp-prev").onclick=()=>go(idx-1);
  m.querySelector(".wp-next").onclick=()=>go(idx+1);
  m.querySelector(".wp-hear").onclick=()=>o.onSay&&o.onSay(items[idx]);
  m.querySelector(".wp-res").onclick=e=>e.currentTarget.classList.remove("show");
  const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
  cv.addEventListener("pointerdown",e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);drawing=true;strokes.push({c:ink,p:[pos(e)]});redraw()});
  cv.addEventListener("pointermove",e=>{if(!drawing)return;e.preventDefault();strokes[strokes.length-1].p.push(pos(e));redraw()});
  const up=()=>{drawing=false};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  addEventListener("resize",()=>{if(m.classList.contains("show"))setup()});
}
function W(){return cv.width}
function H(){return cv.height}
function lw(){return Math.min(W(),H())*0.065}
function setup(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  cv.width=gcv.width=Math.round(r.width*d);cv.height=gcv.height=Math.round(r.height*d);drawGuide();redraw()}
function fontFor(t,c,w,h){const len=[...t].length;let s=Math.min(h*(len>2?0.62:0.78),w*(len>2?0.5:len>1?0.62:0.78));if(o.aspect>1)s=h*0.7;c.font=`700 ${s}px ${o.font}`;
  const mw=c.measureText(t).width;if(mw>w*0.88){s*=w*0.88/mw;c.font=`700 ${s}px ${o.font}`}return s}
function glyph(c,t,mode){const w=c.canvas.width,hh=c.canvas.height;c.save();c.textAlign="center";c.textBaseline="middle";c.direction=o.rtl?"rtl":"ltr";
  fontFor(t,c,w,hh);const y=hh*(o.yShift||0.5);
  if(mode==="guide"){c.fillStyle="rgba(150,140,180,.22)";c.fillText(t,w/2,y);const mn=Math.min(w,hh);c.setLineDash([mn*.02,mn*.018]);c.lineWidth=mn*.006;c.strokeStyle="rgba(120,110,160,.55)";c.strokeText(t,w/2,y)}
  else if(mode==="fill"){c.fillStyle="#000";c.fillText(t,w/2,y)}
  else if(mode==="wide"){c.fillStyle="#000";c.strokeStyle="#000";c.lineJoin="round";c.lineWidth=lw()*1.6;c.strokeText(t,w/2,y);c.fillText(t,w/2,y)}
  c.restore()}
function drawGuide(){const g=gcv.getContext("2d");g.clearRect(0,0,gcv.width,gcv.height);if(showGuide)glyph(g,items[idx],"guide")}
function redraw(c=ctx,width=lw()){c.clearRect(0,0,c.canvas.width,c.canvas.height);c.lineCap="round";c.lineJoin="round";
  for(const s of strokes){c.strokeStyle=c===ctx?s.c:"#000";c.lineWidth=width;c.beginPath();
    s.p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(s.p.length===1){c.lineTo(s.p[0][0]+.1,s.p[0][1])}c.stroke()}}
function clear(){strokes=[];redraw();m.querySelector(".wp-res").classList.remove("show")}
let MW=120,MH=120;
function mask(fn){const c=document.createElement("canvas");c.width=W();c.height=H();const x=c.getContext("2d");fn(x);
  MW=120;MH=Math.max(30,Math.round(120*H()/W()));const s=document.createElement("canvas");s.width=MW;s.height=MH;const y=s.getContext("2d");y.drawImage(c,0,0,MW,MH);
  const N=MW*MH,d=y.getImageData(0,0,MW,MH).data,a=new Uint8Array(N);for(let i=0;i<N;i++)a[i]=d[i*4+3]>60?1:0;return a}
function check(){const lab=L[o.lang];const res=m.querySelector(".wp-res");
  if(!strokes.length){res.innerHTML=`<div>${lab.try}</div>`;res.classList.add("show");return}
  const target=mask(c=>glyph(c,items[idx],"fill")),allowed=mask(c=>glyph(c,items[idx],"wide")),
        inkThin=mask(c=>redraw(c,lw())),inkWide=mask(c=>redraw(c,lw()*2.2));
  let t=0,cov=0,n=0,inside=0;for(let i=0;i<MW*MH;i++){if(target[i]){t++;if(inkWide[i])cov++}if(inkThin[i]){n++;if(allowed[i])inside++}}
  const coverage=t?cov/t:0,precision=n?inside/n:0;
  const stars=coverage>.72&&precision>.8?3:coverage>.5&&precision>.65?2:coverage>.3&&precision>.5?1:0;
  res.innerHTML=stars?`<b>${"⭐".repeat(stars)}</b><div>${stars>=3?lab.great:stars==2?lab.good:lab.try}</div>`:`<div style="font-size:60px">🤔</div><div>${lab.try}</div>`;
  res.classList.add("show");o.onStar&&o.onStar(items[idx],stars,res)}
function go(i){if(i<0||i>=items.length)return;idx=i;strokes=[];showGuide=true;
  m.querySelector(".wp-title").textContent=`${L[o.lang].title}: ${items[idx]}`;
  m.querySelector(".wp-prev").style.visibility=i>0?"visible":"hidden";m.querySelector(".wp-next").style.visibility=i<items.length-1?"visible":"hidden";
  m.querySelector(".wp-res").classList.remove("show");drawGuide();redraw()}
window.WritePad={open(opts){o=Object.assign({lang:"en",rtl:false,font:"sans-serif",aspect:1},opts);items=o.items;idx=o.index||0;if(!m)build();
  m.style.setProperty("--wpa",o.aspect);m.style.setProperty("--wpw",o.aspect>1?"900px":"560px");
  const lab=L[o.lang];m.dir=o.rtl?"rtl":"ltr";
  m.querySelector(".wp-clear").textContent=lab.clear;m.querySelector(".wp-guide").textContent=lab.guide;m.querySelector(".wp-check").textContent=lab.check;
  m.querySelector(".wp-prev").textContent=(o.rtl?"➡️ ":"⬅️ ")+lab.prev;m.querySelector(".wp-next").textContent=lab.next+(o.rtl?" ⬅️":" ➡️");
  m.querySelector(".wp-hear").style.visibility=o.onSay?"visible":"hidden";
  m.classList.add("show");
  const f=o.font.split(",")[0].replace(/"/g,"");
  (document.fonts?document.fonts.load(`700 40px "${f}"`,items.join("")):Promise.resolve()).catch(()=>{}).then(()=>{setup();go(o.index||0)})}};
})();
