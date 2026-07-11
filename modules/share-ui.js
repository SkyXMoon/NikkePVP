let v={};const $="current-team",k="pair-teams",f="full";function L(e={}){v=e||{}}function p(e){const t=v[e];if(typeof t!="function")throw new Error("share ui api missing: "+e);return t}function S(...e){return p("normalizeTheme")(...e)}function s(...e){return p("escapeHtml")(...e)}function c(...e){return p("localize")(...e)}function b(...e){return p("getExportThemePalette")(...e)}function y(...e){return p("loadImageFromUrl")(...e)}function A(...e){return p("canvasToPngBlob")(...e)}function P(...e){return p("blobToDataUrl")(...e)}function R(...e){return p("normalArenaToPngBlob")(...e)}function U(...e){return p("paidArenaToPngBlob")(...e)}function E(...e){return p("isPaidArenaModeActive")(...e)}function T(e){e.querySelectorAll("input").forEach(t=>{if(t.type==="checkbox"||t.type==="radio"){t.checked?t.setAttribute("checked",""):t.removeAttribute("checked");return}t.setAttribute("value",t.value||"")})}function M(){return Array.from(document.styleSheets).map(e=>{try{return Array.from(e.cssRules||[]).map(t=>t.cssText).join(`
`)}catch{return""}}).filter(Boolean).join(`
`)}function x(e){e.querySelectorAll("img").forEach(t=>{const n=t.getAttribute("src");n&&t.setAttribute("src",new URL(n,window.location.href).href)}),e.querySelectorAll("image").forEach(t=>{const n=t.getAttribute("href")||t.getAttribute("xlink:href");if(!n)return;const a=new URL(n,window.location.href).href;t.setAttribute("href",a),t.setAttributeNS("http://www.w3.org/1999/xlink","href",a)})}async function C(e){const t="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E",n=async(r,o,i)=>{if(!(!o||o.startsWith("data:")))try{const l=await fetch(new URL(o,window.location.href).href);if(!l.ok)throw new Error(`asset request failed: ${l.status}`);i(await P(await l.blob()))}catch{i(t)}},a=[...Array.from(e.querySelectorAll("img")).map(r=>n(r,r.getAttribute("src"),o=>r.setAttribute("src",o))),...Array.from(e.querySelectorAll("image")).map(r=>n(r,r.getAttribute("href")||r.getAttribute("xlink:href"),o=>{r.setAttribute("href",o),r.setAttributeNS("http://www.w3.org/1999/xlink","href",o)}))];await Promise.all(a)}function N(e,t=[]){const n=S(document.documentElement.dataset.theme),a=document.createElement("div");return a.className="copy-image-export",a.dataset.theme=n,a.style.position="fixed",a.style.left="-10000px",a.style.top="0",a.style.width=`${Math.max(720,Math.ceil(Math.max(...t.map(r=>r?.scrollWidth||r?.getBoundingClientRect?.().width||0),0)))}px`,a.innerHTML=`<div class="copy-image-title">${s(e)}</div>`,t.filter(Boolean).forEach(r=>{const o=r.cloneNode(!0);o.querySelectorAll(".chart-hover-tooltip, .chart-hover-guide-x, .chart-hover-guide-y, .slot-settings-backdrop").forEach(i=>i.remove()),o.classList.add("copy-image-section"),o.style.width="100%",T(o),x(o),a.append(o)}),document.body.append(a),a}async function _(e){const t=b(),n=e.getBoundingClientRect(),a=Math.max(1,Math.ceil(n.width)),r=Math.max(1,Math.ceil(n.height)),o=e.cloneNode(!0);o.style.position="static",o.style.left="auto",o.style.top="auto",x(o),await C(o);const i=new XMLSerializer().serializeToString(o),l=`
    <svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${r}" viewBox="0 0 ${a} ${r}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${M()}</style>
          ${i}
        </div>
      </foreignObject>
    </svg>
  `,d=URL.createObjectURL(new Blob([l],{type:"image/svg+xml;charset=utf-8"}));try{const g=await y(d),m=2,u=document.createElement("canvas");u.width=Math.ceil(a*m),u.height=Math.ceil(r*m);const h=u.getContext("2d");return h.scale(m,m),h.fillStyle=t.page,h.fillRect(0,0,a,r),h.drawImage(g,0,0,a,r),await A(u)}finally{URL.revokeObjectURL(d)}}async function j(e,t){const n=b(),a=[e,...String(t||"").split(/\r?\n/)],r=960,o=30,i=28,l=Math.max(160,i*2+a.length*o),d=u=>String(u).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),g=`
    <svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${l}" viewBox="0 0 ${r} ${l}">
      <rect width="100%" height="100%" fill="${n.page}"/>
      ${a.map((u,h)=>{const w=h===0;return`<text x="${i}" y="${i+(h+1)*o}" fill="${w?n.title:n.text}" font-size="${w?22:18}" font-family="Arial, Microsoft YaHei, sans-serif">${d(u)}</text>`}).join("")}
    </svg>
  `,m=URL.createObjectURL(new Blob([g],{type:"image/svg+xml;charset=utf-8"}));try{const u=await y(m),h=document.createElement("canvas");return h.width=r,h.height=l,h.getContext("2d").drawImage(u,0,0,r,l),await A(h)}finally{URL.revokeObjectURL(m)}}function H(e){return e?.name==="SecurityError"||/tainted canvases/i.test(String(e?.message||e))}async function B(e){if(!navigator.clipboard?.write||typeof ClipboardItem>"u")throw new Error("rich clipboard is not supported");const t=Promise.resolve(e).then(n=>{if(!(n instanceof Blob)||n.size<=0)throw new Error("share image blob is empty");return n});await navigator.clipboard.write([new ClipboardItem({"image/png":t})])}async function I(e={}){return E()?U(e):R()}function q(){return E()?new Promise(e=>{const t=document.createElement("div");t.className="share-mode-backdrop",t.innerHTML=`
      <section class="share-mode-modal" role="dialog" aria-modal="true" aria-label="${s(c("\u9009\u62E9\u5206\u4EAB\u6A21\u5F0F","Choose share mode"))}">
        <div class="share-mode-head">
          <strong>${s(c("\u9009\u62E9\u5206\u4EAB\u6A21\u5F0F","Choose share mode"))}</strong>
          <button class="share-mode-close" type="button" aria-label="${s(c("\u5173\u95ED","Close"))}">\xD7</button>
        </div>
        <div class="share-mode-options">
          <button class="share-mode-option" type="button" data-share-mode="${$}">
            <strong>${s(c("\u5F53\u524D\u961F\u4F0D\u65E0\u8F74","Current side, no timeline"))}</strong>
            <span>${s(c("\u5BFC\u51FA\u5F53\u524D\u8FDB\u653B/\u9632\u5B88\u4FA7\u7684\u5168\u90E8\u961F\u4F0D\u5934\u50CF\u548C\u5145\u80FD\u7ED3\u679C\u3002","Export all teams on the current attack/defense side and charge results."))}</span>
          </button>
          <button class="share-mode-option" type="button" data-share-mode="${k}">
            <strong>${s(c("\u53CC\u65B9\u961F\u4F0D\u65E0\u8F74","Both teams, no timeline"))}</strong>
            <span>${s(c("\u5BFC\u51FA\u5168\u90E8 Round \u7684\u8FDB\u653B\u961F\u548C\u9632\u5B88\u961F\u5934\u50CF\u3002","Export attack and defense teams for all rounds."))}</span>
          </button>
          <button class="share-mode-option" type="button" data-share-mode="${f}">
            <strong>${s(c("\u5168\u90E8\u4FE1\u606F","Full details"))}</strong>
            <span>${s(c("\u5BFC\u51FA\u5168\u90E8\u961F\u4F0D\u3001\u5145\u80FD\u7ED3\u679C\u548C\u5145\u80FD\u8F74\u3002","Export all teams, results, and timelines."))}</span>
          </button>
        </div>
      </section>
    `;const n=(r=null)=>{document.body.contains(t)&&(t.remove(),window.removeEventListener("keydown",a),e(r))},a=r=>{r.key==="Escape"&&(r.preventDefault(),n(null))};t.querySelector(".share-mode-close")?.addEventListener("click",()=>n(null)),t.querySelectorAll("[data-share-mode]").forEach(r=>{r.addEventListener("click",()=>n(r.dataset.shareMode||f))}),t.querySelector(".share-mode-modal")?.addEventListener("click",r=>r.stopPropagation()),window.addEventListener("keydown",a,{capture:!0}),document.body.append(t)}):Promise.resolve(f)}function D(e,t="NIKKE PVP"){if(!e)return;const n=URL.createObjectURL(e),a=`nikke-pvp-${Date.now()}.png`,r=s(t),o=document.createElement("div");o.className="share-preview-backdrop",o.innerHTML=`
    <section class="share-preview-modal" role="dialog" aria-modal="true" aria-label="${s(c("\u5206\u4EAB\u56FE\u7247\u9884\u89C8","Share image preview"))}">
      <div class="share-preview-head">
        <span class="share-preview-title">${r}</span>
        <button class="share-preview-close" type="button" aria-label="${s(c("\u5173\u95ED\u9884\u89C8","Close preview"))}">\xD7</button>
      </div>
      <div class="share-preview-body">
        <img class="share-preview-image" src="${n}" alt="${r} ${s(c("\u5206\u4EAB\u56FE\u7247","share image"))}" />
      </div>
      <div class="share-preview-actions">
        <a class="share-preview-download" href="${n}" download="${a}" target="_blank" rel="noopener">${s(c("\u4E0B\u8F7D\u56FE\u7247","Download image"))}</a>
        <button class="share-preview-close-btn" type="button">${s(c("\u5173\u95ED","Close"))}</button>
      </div>
    </section>
  `;const i=()=>{document.body.contains(o)&&(o.remove(),URL.revokeObjectURL(n),window.removeEventListener("keydown",l))},l=d=>{d.key==="Escape"&&(d.preventDefault(),i())};o.querySelector(".share-preview-close")?.addEventListener("click",d=>{d.preventDefault(),i()}),o.querySelector(".share-preview-close-btn")?.addEventListener("click",d=>{d.preventDefault(),i()}),o.querySelector(".share-preview-modal")?.addEventListener("click",d=>d.stopPropagation()),window.addEventListener("keydown",l,{capture:!0}),document.body.append(o)}export{q as choosePaidArenaShareMode,I as copyCurrentArenaImage,B as copyRichImageToClipboard,D as openShareImagePreview,L as setShareUiApi};
