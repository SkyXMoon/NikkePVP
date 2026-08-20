let R={};const g="nikke:character-detail-refresh";let y=!1,C=!1,L=!1,f=!1;function X(e={}){R=e||{}}function i(e){const s=R[e];if(typeof s!="function")throw new Error(`Missing character detail modals API: ${e}`);return s}function n(...e){return i("escapeHtml")(...e)}function c(...e){return i("localize")(...e)}function j(...e){return i("getResearchLevelDefinitions")(...e)}function k(...e){return i("getResearchLevel")(...e)}function _(...e){return i("setResearchLevel")(...e)}function E(...e){return i("getCharacterDetailCube")(...e)}function w(...e){return i("sanitizeDetailCubeType")(...e)}function O(...e){return i("sanitizeDetailCubeLevel")(...e)}function G(...e){return i("saveCharacterDetailCube")(...e)}function F(...e){return i("getCharacterDetailCubeLevelByType")(...e)}function K(...e){return i("getCharacterDetailCubeIconPath")(...e)}function $(...e){return i("getCharacterCollectibleDetail")(...e)}function J(...e){return i("saveCharacterCollectibleDetail")(...e)}function Q(...e){return i("sanitizeCollectibleLevel")(...e)}function S(...e){return i("getCharacterEquipmentLevel")(...e)}function U(...e){return i("saveCharacterEquipmentLevel")(...e)}function de(...e){return i("sanitizeEquipmentLevel")(...e)}function ue(...e){return i("getCharacterBondLevel")(...e)}function W(...e){return i("getCharacterMaxBondLevel")(...e)}function pe(...e){return i("saveCharacterBondLevel")(...e)}function q(...e){return i("getCharacterDetailLevel")(...e)}function Y(...e){return i("saveCharacterDetailLevel")(...e)}function P(...e){return i("getCharacterBreakthroughCoreDetail")(...e)}function Z(...e){return i("sanitizeBreakthroughCount")(...e)}function ee(...e){return i("sanitizeCoreEnhanceLevel")(...e)}function te(...e){return i("saveCharacterBreakthroughCoreDetail")(...e)}function ae(){return i("getCharacterDetailCubeOptions")()}function b(...e){return i("markCharacterDetailPanelDirty")(...e)}function m(e,s){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const r=()=>{const t=e.value||"";e.dataset.lastCommittedValue!==t&&(s(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",r),e.addEventListener("blur",r),e.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),r(),e.blur())})}function x(){const e=y;y=!1,document.querySelector(".research-level-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function N(){const e=L;L=!1,document.querySelector(".collectible-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function T(){const e=f;f=!1,document.querySelector(".detail-cube-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function z(){document.querySelector(".bond-level-modal-backdrop")?.remove()}function I(){document.querySelector(".character-level-modal-backdrop")?.remove()}function H(){const e=C;C=!1,document.querySelector(".equipment-level-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function V(){document.querySelector(".breakthrough-core-modal-backdrop")?.remove()}function le(){x(),y=!1;const e=q(),s=Number(e)>=400,r=document.createElement("div");r.className="help-modal-backdrop research-level-modal-backdrop",r.innerHTML=`
    <section class="help-modal research-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Research</span>
          <strong>${n(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u7814\u7A76\u7B49\u7EA7","Close research levels"))}">X</button>
      </div>
    <div class="research-level-grid">
      ${j().map(t=>`
          <label class="research-level-field">
            <span>
              ${t.icon?`<img src="${n(t.icon)}" alt="" aria-hidden="true" class="research-level-icon" loading="lazy" />`:""}
              ${n(t.key==="general"&&s?`${t.label} (${c("\u81EA\u52A8\u586B\u5199","Auto")})`:t.label)}
            </span>
            <input type="number" min="1" max="999" step="1" value="${n(k(t.key))}" data-research-level-input="${n(t.key)}"${t.key==="general"?" disabled":""} />
          </label>
        `).join("")}
      </div>
    </section>
  `,r.addEventListener("pointerdown",t=>t.stopPropagation()),r.addEventListener("click",t=>{t.stopPropagation()}),r.querySelector(".research-level-modal")?.addEventListener("click",t=>t.stopPropagation()),r.querySelector(".research-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),x()}),r.querySelectorAll("[data-research-level-input]").forEach(t=>{m(t,()=>{const l=t.dataset.researchLevelInput,o=k(l);_(l,t.value);const a=k(l);t.value=String(a),document.querySelectorAll(`[data-research-level-trigger="${CSS.escape(t.dataset.researchLevelInput)}"] small`).forEach(d=>{d.textContent=`LV.${k(t.dataset.researchLevelInput)}`}),a!==o&&(y=!0,b())})}),document.body.append(r)}function oe(e,s=null){T(),f=!1;const r=E(e),t=r.level>0,l=document.createElement("div");l.className="help-modal-backdrop detail-cube-modal-backdrop",l.innerHTML=`
    <section class="help-modal detail-cube-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u9B54\u65B9","Cube"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Cube</span>
          <strong>${n(c("\u9B54\u65B9","Cube"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u9B54\u65B9","Close cube"))}">X</button>
      </div>
      <div class="detail-cube-form">
        <div class="detail-cube-type-grid" role="radiogroup" aria-label="${n(c("\u9B54\u65B9\u7C7B\u578B","Cube type"))}">
          <label class="detail-cube-type-option detail-cube-none-option${t?"":" is-selected"}" title="${n(c("\u65E0\u9B54\u65B9","No cube"))}">
            <input type="radio" name="detail-cube-type" value="none" data-detail-cube-none ${t?"":"checked"} />
            <span>${n(c("\u65E0\u9B54\u65B9","No cube"))}</span>
          </label>
          ${ae().map(a=>`
            <label class="detail-cube-type-option${t&&r.type===a.type?" is-selected":""}" title="${n(c(a.name,a.enName))}">
              <input type="radio" name="detail-cube-type" value="${n(a.type)}" data-detail-cube-type ${t&&r.type===a.type?"checked":""} />
              <img src="${n(K(a.type))}" alt="" aria-hidden="true" loading="lazy" />
              <span>${n(c(a.name,a.enName))}</span>
            </label>
          `).join("")}
        </div>
        <label class="detail-cube-level-field">
          <span>${n(c("\u9B54\u65B9\u7B49\u7EA7\uFF081-15\uFF09","Cube level (1-15)"))}</span>
          <input type="number" min="1" max="15" step="1" value="${n(t?r.level:1)}" data-detail-cube-level-input ${t?"":"disabled"} />
        </label>
      </div>
    </section>
  `;const o=()=>{const a=l.querySelector("[data-detail-cube-none]"),d=l.querySelector("[data-detail-cube-level-input]"),u=l.querySelector("[data-detail-cube-type]:checked"),p=a?.checked||u?.value==="none",h=w(p?r.type:u?.value),v=p?0:Math.max(1,O(d?.value||1)),D=E(e);G(e,{type:h,level:v});const A=E(e);d&&(d.disabled=v<=0,d.value=String(v>0?v:1)),l.querySelector(".detail-cube-none-option")?.classList.toggle("is-selected",v<=0),l.querySelectorAll(".detail-cube-type-option").forEach(M=>{const B=M.querySelector("[data-detail-cube-type]");B&&M.classList.toggle("is-selected",v>0&&B.checked)}),(D.type!==A.type||D.level!==A.level)&&(f=!0,b()),s?.(E(e))};l.addEventListener("pointerdown",a=>a.stopPropagation()),l.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".detail-cube-modal")?.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".detail-cube-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),T()}),l.querySelectorAll("input[name='detail-cube-type']").forEach(a=>a.addEventListener("change",()=>{const d=l.querySelector("[data-detail-cube-none]"),u=l.querySelector("[data-detail-cube-level-input]");if(u){if(a.value==="none")u.disabled=!0,u.value="1";else{u.disabled=!1;const p=F(a.value);u.value=String(p>0?p:1)}d&&(d.checked=a.value==="none")}o()})),m(l.querySelector("[data-detail-cube-level-input]"),o),document.body.append(l)}function ne(e,s=null){N(),L=!1;const r=$(e),t=document.createElement("div");t.className="help-modal-backdrop collectible-modal-backdrop",t.innerHTML=`
    <section class="help-modal collectible-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u6536\u85CF\u54C1","Collectible"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Collectible</span>
          <strong>${n(c("\u6536\u85CF\u54C1","Collectible"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u6536\u85CF\u54C1","Close collectible"))}">X</button>
      </div>
      <div class="collectible-form">
        <div class="collectible-rarity-options">
          ${["R","SR"].map(o=>`
            <label class="collectible-rarity-option is-${o.toLowerCase()}${r.rarity===o?" is-selected":""}">
              <input type="radio" name="collectible-rarity" value="${o}" ${r.rarity===o?"checked":""} />
              <span>${o}</span>
            </label>
          `).join("")}
        </div>
        <label class="collectible-level-field">
          <span>${n(c("\u7B49\u7EA7","Level"))}</span>
          <input type="number" min="0" max="15" step="1" value="${n(r.level)}" data-collectible-level-input />
        </label>
      </div>
    </section>
  `;const l=()=>{const o=t.querySelector("input[name='collectible-rarity']:checked")?.value||"R",a=t.querySelector("[data-collectible-level-input]")?.value||0,d=$(e);J(e,{rarity:o,level:a});const u=$(e);(d.rarity!==u.rarity||d.level!==u.level)&&(L=!0,b()),s?.($(e))};t.addEventListener("pointerdown",o=>o.stopPropagation()),t.addEventListener("click",o=>{o.stopPropagation()}),t.querySelector(".collectible-modal")?.addEventListener("click",o=>o.stopPropagation()),t.querySelector(".collectible-modal")?.addEventListener("pointerdown",o=>o.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",o=>{o.stopPropagation(),N()}),t.querySelectorAll("input[name='collectible-rarity']").forEach(o=>{o.addEventListener("change",()=>{t.querySelectorAll(".collectible-rarity-option").forEach(a=>a.classList.toggle("is-selected",a.querySelector("input")?.checked)),l()})}),m(t.querySelector("[data-collectible-level-input]"),()=>{const o=t.querySelector("[data-collectible-level-input]"),a=Q(o.value);String(a)!==o.value&&(o.value=String(a)),l()}),document.body.append(t)}function re(e,s,r=null){H(),C=!1;const t=S(e,s?.part,s?.level),l=document.createElement("div");l.className="help-modal-backdrop equipment-level-modal-backdrop",l.innerHTML=`
    <section class="help-modal equipment-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u88C5\u5907\u7B49\u7EA7","Equipment level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Equipment</span>
          <strong>${n(c(`${s?.slot||"\u88C5\u5907"}\u7B49\u7EA7`,`${s?.slot||"Equipment"} level`))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u88C5\u5907\u7B49\u7EA7","Close equipment level"))}">X</button>
      </div>
      <div class="equipment-level-options">
        ${Array.from({length:6},(a,d)=>`
          <button class="equipment-level-option${d===t?" is-selected":""}" type="button" data-equipment-level-option="${d}">
            <span>LV.</span><strong>${d}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;const o=a=>{const d=S(e,s?.part,s?.level);U(e,s?.part,a);const u=S(e,s?.part,s?.level);l.querySelectorAll("[data-equipment-level-option]").forEach(p=>{p.classList.toggle("is-selected",Number(p.dataset.equipmentLevelOption)===u)}),d!==u&&(C=!0,b()),r?.(u)};l.addEventListener("pointerdown",a=>a.stopPropagation()),l.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".equipment-level-modal")?.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".equipment-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),H()}),l.querySelectorAll("[data-equipment-level-option]").forEach(a=>{a.addEventListener("click",d=>{d.stopPropagation(),o(d.currentTarget.dataset.equipmentLevelOption)})}),document.body.append(l)}function ce(e,s=null){z();const r=W(e),t=document.createElement("div");t.className="help-modal-backdrop bond-level-modal-backdrop",t.innerHTML=`
    <section class="help-modal bond-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Bond</span>
          <strong>${n(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u597D\u611F\u7B49\u7EA7","Close bond level"))}">X</button>
      </div>
      <label class="bond-level-field">
        <span>${n(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}</span>
        <input type="number" min="${n(r)}" max="${n(r)}" step="1" value="${n(r)}" data-bond-level-input disabled />
        <small>${n(c("\u5DF2\u81EA\u52A8\u8BBE\u7F6E\u4E3A\u6EE1","Auto set to max"))}</small>
      </label>
    </section>
  `,s?.(r),t.addEventListener("pointerdown",l=>l.stopPropagation()),t.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),z()}),document.body.append(t)}function ie(e=null){I();const s=q(),r=document.createElement("div");r.className="help-modal-backdrop character-level-modal-backdrop",r.innerHTML=`
    <section class="help-modal character-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u89D2\u8272\u7B49\u7EA7","Character level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Level</span>
          <strong>${n(c("\u5168\u89D2\u8272\u7B49\u7EA7","Global character level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u89D2\u8272\u7B49\u7EA7","Close character level"))}">X</button>
      </div>
      <label class="character-level-field">
        <span>${n(c("\u5168\u89D2\u8272\u5171\u7528\u7B49\u7EA7\uFF081-600\uFF09","Shared level for all characters (1-600)"))}</span>
        <input type="number" min="1" max="600" step="1" value="${n(s)}" data-character-level-input />
      </label>
    </section>
  `;const t=()=>{const l=r.querySelector("[data-character-level-input]"),o=q();Y(l?.value||400);const a=q();l&&(l.value=a),o!==a&&b(),e?.(a)};r.addEventListener("pointerdown",l=>l.stopPropagation()),r.addEventListener("click",l=>l.stopPropagation()),r.querySelector(".character-level-modal")?.addEventListener("click",l=>l.stopPropagation()),r.querySelector(".character-level-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),I()}),m(r.querySelector("[data-character-level-input]"),t),document.body.append(r)}function se(e,s=null){V();const r=P(e),t=document.createElement("div");t.className="help-modal-backdrop breakthrough-core-modal-backdrop",t.innerHTML=`
    <section class="help-modal breakthrough-core-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Limit</span>
          <strong>${n(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u7A81\u7834\u8BBE\u7F6E","Close breakthrough settings"))}">X</button>
      </div>
      <div class="breakthrough-core-content">
        <div class="breakthrough-core-section">
          <span>${n(c("\u7A81\u7834\u6B21\u6570","Breakthrough count"))}</span>
          <div class="breakthrough-core-stars" role="group" aria-label="${n(c("\u9009\u62E9\u7A81\u7834\u6B21\u6570","Select breakthrough count"))}">
            ${Array.from({length:4},(o,a)=>`
              <button class="breakthrough-core-star-option${a===r.breakthroughCount?" is-selected":""}" type="button" data-breakthrough-count="${a}">
                ${a===0?n(c("\u65E0","None")):Array.from({length:a},()=>"&#10022;").join("")}
              </button>
            `).join("")}
          </div>
        </div>
        <label class="breakthrough-core-field">
          <span>${n(c("\u6838\u5FC3\u5F3A\u5316\uFF08\u9700 3 \u661F\u7A81\u7834\uFF09","Core enhancement (requires 3-star breakthrough)"))}</span>
          <input type="number" min="0" max="7" step="1" value="${n(r.coreEnhanceLevel)}" data-core-enhance-input ${r.breakthroughCount<3?"disabled":""} />
        </label>
      </div>
    </section>
  `;const l=(o=null)=>{const a=t.querySelector("[data-core-enhance-input]"),d=P(e),u=o===null?d.breakthroughCount:Z(o),p=ee(a?.value||0,u);te(e,{breakthroughCount:u,coreEnhanceLevel:p});const h=P(e);t.querySelectorAll("[data-breakthrough-count]").forEach(v=>{v.classList.toggle("is-selected",Number(v.dataset.breakthroughCount)===h.breakthroughCount)}),a&&(a.disabled=h.breakthroughCount<3,a.value=String(h.coreEnhanceLevel)),(d.breakthroughCount!==h.breakthroughCount||d.coreEnhanceLevel!==h.coreEnhanceLevel)&&b(),s?.(h)};t.addEventListener("pointerdown",o=>o.stopPropagation()),t.addEventListener("click",o=>o.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("click",o=>o.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("pointerdown",o=>o.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",o=>{o.stopPropagation(),V()}),t.querySelectorAll("[data-breakthrough-count]").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation(),l(a.currentTarget.dataset.breakthroughCount)})}),m(t.querySelector("[data-core-enhance-input]"),()=>l(null)),document.body.append(t)}export{ce as openBondLevelModal,se as openBreakthroughCoreModal,ie as openCharacterLevelModal,ne as openCollectibleModal,oe as openDetailCubeModal,re as openEquipmentLevelModal,le as openResearchLevelModal,X as setCharacterDetailModalsApi};
