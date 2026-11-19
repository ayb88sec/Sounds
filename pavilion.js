/* أركان الإسلام / أركان الإيمان as the approved connected pavilion (screen-designs/06-approved-connected-islam.png).
   The empty frames are the approved production files (img/approved/frame-*-connected.webp); each pillar stays a live button placed in its arch.
   Arch positions were measured on the frames (percent of the picture). Pictures inside the arches: the current pillar pictures until the new ones are approved. */
(function(){
  const ISL=/islam\.html/.test(location.pathname);
  const F=ISL?{img:"img/approved/frame-islam-connected.webp",ar:"1920/819",title:[30.7,4,38.6,17],
      back:[6.5,25,87,42],slots:[77,59.9,42.4,25.4,7.7].map(x=>[x,27,15,53])}
    :{img:"img/approved/frame-iman-connected.webp",ar:"1752/897",title:[31,3.5,38,16],
      back:[13,21,74,62],slots:[[64.1,22],[39.6,22],[15.1,22],[64.1,55],[39.6,55],[15.1,55]].map(([x,y])=>[x,y,20.7,27.5])};
  const st=document.createElement("style");
  st.textContent=`
main .building{position:relative!important;max-width:min(100%,1000px)!important;margin:6px auto 0!important;aspect-ratio:${F.ar};filter:drop-shadow(0 12px 14px rgba(110,62,15,.25))!important;container-type:inline-size}
main .building .roof,main .building .beam,main .building .base,main .building .base2{display:none!important}
main .building .pv-back{position:absolute;left:${F.back[0]}%;top:${F.back[1]}%;width:${F.back[2]}%;height:${F.back[3]}%;background:linear-gradient(#fffaf0,#f6e3bd);border-radius:2cqw}
main .building .pv-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
main .building .pv-title{position:absolute;left:${F.title[0]}%;top:${F.title[1]}%;width:${F.title[2]}%;height:${F.title[3]}%;display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:4.2cqw;color:#13275a;pointer-events:none}
main .building #cols{position:absolute!important;inset:0!important;display:block!important;padding:0!important;background:none!important}
main .building .col{position:absolute!important;margin:0!important;padding:0!important;flex:none!important;background:transparent!important;color:#13275a!important;
  box-shadow:none!important;border-radius:1.6cqw!important;display:flex!important;flex-direction:column;align-items:center;justify-content:flex-start}
main .building .col .n{display:none!important}
main .building .col .e{margin-top:${ISL?"3%":"4%"}!important;width:${ISL?"74%":"52%"};aspect-ratio:1;display:block}
main .building .col .e img{width:100%!important;height:100%!important;border-radius:1.4cqw!important;border:.35cqw solid #fff!important;box-shadow:0 .5cqw 1cqw rgba(110,62,15,.25);object-fit:cover}
main .building .col .t{position:absolute;left:4%;right:4%;bottom:${ISL?"3%":"4%"};margin:0!important;padding:0!important;font-size:${ISL?"2.15cqw":"1.9cqw"}!important;color:#13275a!important;
  text-shadow:none!important;white-space:normal!important;line-height:1.2;text-align:center}
main .building .col.done::after{content:"✓";position:absolute;top:2%;left:4%;width:3.2cqw;height:3.2cqw;border-radius:50%;background:#2fbf71;color:#fff;font-size:2cqw;display:flex;align-items:center;justify-content:center;font-weight:900}
main .building .col:active{transform:scale(.96)}
main footer a{display:none!important}
`;
  document.head.appendChild(st);
  function build(){const b=document.querySelector("main .building");if(!b||b.querySelector(".pv-frame"))return;
    const t=(document.querySelector("main .building .beam")||{}).textContent||(ISL?"أركان الإسلام":"أركان الإيمان");
    b.insertAdjacentHTML("afterbegin",`<div class="pv-back"></div><img class="pv-frame" src="${F.img}" alt=""><div class="pv-title">${t}</div>`);
    /* the arches are drawn above the cream wall; the pillar buttons above the frame */
    const cols=b.querySelector("#cols");b.appendChild(cols);place()}
  function place(){document.querySelectorAll("main .building .col").forEach((c,i)=>{const s=F.slots[i];if(!s)return;
    const set=(k,v)=>c.style.setProperty(k,v,"important");
    set("left",s[0]+"%");set("top",s[1]+"%");set("width",s[2]+"%");set("height",s[3]+"%");set("background","transparent");set("box-shadow","none");set("border","0")})}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(build,0));else setTimeout(build,0);
  addEventListener("load",()=>{build();place()});
})();
