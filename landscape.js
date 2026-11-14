/* Najma is a landscape app. Held upright, the falcon asks the child to turn the device. */
(function(){
  if(/(parent|families|guide)\.html$/.test(location.pathname)||/old=1/.test(location.search))return;
  const st=document.createElement("style");
  st.textContent=`#najTurn{position:fixed;inset:0;z-index:2147483000;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;
  background:#f3cf98 url(img/v2/home_bg.webp) center/cover no-repeat;font-family:"Baloo Bhaijaan 2","Baloo 2",system-ui,sans-serif;text-align:center;padding:24px}
@media (orientation:portrait){#najTurn{display:flex}html,body{overflow:hidden!important}}
#najTurn .ph{width:110px;height:180px;border-radius:22px;border:8px solid #7d4a1c;background:#fffaf0;box-shadow:0 10px 0 rgba(90,50,10,.3);animation:najT 2.4s ease-in-out infinite}
@keyframes najT{0%,25%{transform:rotate(0)}55%,100%{transform:rotate(-90deg)}}
#najTurn img{width:170px;height:170px;object-fit:contain;filter:drop-shadow(0 8px 8px rgba(110,60,10,.3))}
#najTurn b{display:inline-block;padding:6px 26px 10px;border-radius:999px;background:linear-gradient(#d99a52,#b9722f);border:4px solid #7d4a1c;color:#fffdf7;font-size:30px;text-shadow:0 3px 0 #6a3b12;box-shadow:0 7px 0 rgba(90,50,10,.35)}
#najTurn small{font-size:20px;font-weight:800;color:#5c3008}`;
  (document.head||document.documentElement).appendChild(st);
  const add=()=>{if(document.getElementById("najTurn"))return;const d=document.createElement("div");d.id="najTurn";
    d.innerHTML=`<img src="img/v2/f_point.webp" alt=""><div class="ph"></div><b>لفّ الجهاز</b><small>Turn your iPad sideways</small>`;document.body.appendChild(d)};
  if(document.body)add();else document.addEventListener("DOMContentLoaded",add);
})();
