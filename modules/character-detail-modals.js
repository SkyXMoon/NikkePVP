let C={};function A(e={}){C=e||{}}function s(e){const n=C[e];if(typeof n!="function")throw new Error(`Missing character detail modals API: ${e}`);return n}function r(...e){return s("escapeHtml")(...e)}function c(...e){return s("localize")(...e)}function z(...e){return s("getResearchLevelDefinitions")(...e)}function m(...e){return s("getResearchLevel")(...e)}function x(...e){return s("setResearchLevel")(...e)}function f(...e){return s("getCharacterDetailCube")(...e)}function N(...e){return s("sanitizeDetailCubeType")(...e)}function R(...e){return s("sanitizeDetailCubeLevel")(...e)}function T(...e){return s("saveCharacterDetailCube")(...e)}function I(...e){return s("getCharacterDetailCubeIconPath")(...e)}function E(...e){return s("getCharacterCollectibleDetail")(...e)}function H(...e){return s("saveCharacterCollectibleDetail")(...e)}function X(...e){return s("sanitizeCollectibleLevel")(...e)}function j(...e){return s("getCharacterEquipmentLevel")(...e)}function V(...e){return s("saveCharacterEquipmentLevel")(...e)}function q(...e){return s("sanitizeEquipmentLevel")(...e)}function g(...e){return s("getCharacterBondLevel")(...e)}function O(...e){return s("getCharacterMaxBondLevel")(...e)}function _(...e){return s("saveCharacterBondLevel")(...e)}function y(...e){return s("getCharacterDetailLevel")(...e)}function G(...e){return s("saveCharacterDetailLevel")(...e)}function k(...e){return s("getCharacterBreakthroughCoreDetail")(...e)}function F(...e){return s("sanitizeBreakthroughCount")(...e)}function J(...e){return s("sanitizeCoreEnhanceLevel")(...e)}function K(...e){return s("saveCharacterBreakthroughCoreDetail")(...e)}function Q(){return s("getCharacterDetailCubeOptions")()}function p(e,n){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const i=()=>{const l=e.value||"";e.dataset.lastCommittedValue!==l&&(n(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",i),e.addEventListener("blur",i),e.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),i(),e.blur())})}function $(){document.querySelector(".research-level-modal-backdrop")?.remove()}function S(){document.querySelector(".collectible-modal-backdrop")?.remove()}function P(){document.querySelector(".detail-cube-modal-backdrop")?.remove()}function D(){document.querySelector(".bond-level-modal-backdrop")?.remove()}function M(){document.querySelector(".character-level-modal-backdrop")?.remove()}function B(){document.querySelector(".equipment-level-modal-backdrop")?.remove()}function w(){document.querySelector(".breakthrough-core-modal-backdrop")?.remove()}function U(){$();const e=document.createElement("div");e.className="help-modal-backdrop research-level-modal-backdrop",e.innerHTML=`
    <section class="help-modal research-level-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Research</span>
          <strong>${r(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u7814\u7A76\u7B49\u7EA7","Close research levels"))}">X</button>
      </div>
      <div class="research-level-grid">
        ${z().map(n=>`
          <label class="research-level-field">
            <span>${r(n.label)}</span>
            <input type="number" min="1" max="999" step="1" value="${r(m(n.key))}" data-research-level-input="${r(n.key)}" />
          </label>
        `).join("")}
      </div>
    </section>
  `,e.addEventListener("pointerdown",n=>n.stopPropagation()),e.addEventListener("click",n=>{n.stopPropagation()}),e.querySelector(".research-level-modal")?.addEventListener("click",n=>n.stopPropagation()),e.querySelector(".research-level-modal")?.addEventListener("pointerdown",n=>n.stopPropagation()),e.querySelector(".help-modal-close")?.addEventListener("click",n=>{n.stopPropagation(),$()}),e.querySelectorAll("[data-research-level-input]").forEach(n=>{p(n,()=>{x(n.dataset.researchLevelInput,n.value),n.value=String(m(n.dataset.researchLevelInput)),document.querySelectorAll(`[data-research-level-trigger="${CSS.escape(n.dataset.researchLevelInput)}"] small`).forEach(i=>{i.textContent=`LV.${m(n.dataset.researchLevelInput)}`}),document.dispatchEvent(new CustomEvent("nikke:research-level-change"))})}),document.body.append(e)}function W(e,n=null){P();const i=f(e),l=i.level>0,a=document.createElement("div");a.className="help-modal-backdrop detail-cube-modal-backdrop",a.innerHTML=`
    <section class="help-modal detail-cube-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u9B54\u65B9","Cube"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Cube</span>
          <strong>${r(c("\u9B54\u65B9","Cube"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u9B54\u65B9","Close cube"))}">X</button>
      </div>
      <div class="detail-cube-form">
        <div class="detail-cube-type-grid" role="radiogroup" aria-label="${r(c("\u9B54\u65B9\u7C7B\u578B","Cube type"))}">
          <label class="detail-cube-type-option detail-cube-none-option${l?"":" is-selected"}" title="${r(c("\u65E0\u9B54\u65B9","No cube"))}">
            <input type="radio" name="detail-cube-type" value="none" data-detail-cube-none ${l?"":"checked"} />
            <span>${r(c("\u65E0\u9B54\u65B9","No cube"))}</span>
          </label>
          ${Q().map(t=>`
            <label class="detail-cube-type-option${l&&i.type===t.type?" is-selected":""}" title="${r(c(t.name,t.enName))}">
              <input type="radio" name="detail-cube-type" value="${r(t.type)}" data-detail-cube-type ${l&&i.type===t.type?"checked":""} />
              <img src="${r(I(t.type))}" alt="" aria-hidden="true" loading="lazy" />
              <span>${r(c(t.name,t.enName))}</span>
            </label>
          `).join("")}
        </div>
        <label class="detail-cube-level-field">
          <span>${r(c("\u9B54\u65B9\u7B49\u7EA7\uFF081-15\uFF09","Cube level (1-15)"))}</span>
          <input type="number" min="1" max="15" step="1" value="${r(l?i.level:1)}" data-detail-cube-level-input ${l?"":"disabled"} />
        </label>
      </div>
    </section>
  `;const o=()=>{const t=a.querySelector("[data-detail-cube-none]"),d=a.querySelector("[data-detail-cube-level-input]"),b=a.querySelector("[data-detail-cube-type]:checked"),h=N(b?.value),u=t?.checked?0:R(d?.value||1)||1;T(e,{type:h,level:u}),d&&(d.disabled=u<=0,d.value=String(u>0?u:1)),a.querySelector(".detail-cube-none-option")?.classList.toggle("is-selected",u<=0),a.querySelectorAll(".detail-cube-type-option").forEach(v=>{const L=v.querySelector("[data-detail-cube-type]");L&&v.classList.toggle("is-selected",u>0&&L.checked)}),n?.(f(e))};a.addEventListener("pointerdown",t=>t.stopPropagation()),a.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".detail-cube-modal")?.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".detail-cube-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),a.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),P()}),a.querySelectorAll("input[name='detail-cube-type']").forEach(t=>t.addEventListener("change",o)),p(a.querySelector("[data-detail-cube-level-input]"),o),document.body.append(a)}function Y(e,n=null){S();const i=E(e),l=document.createElement("div");l.className="help-modal-backdrop collectible-modal-backdrop",l.innerHTML=`
    <section class="help-modal collectible-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u6536\u85CF\u54C1","Collectible"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Collectible</span>
          <strong>${r(c("\u6536\u85CF\u54C1","Collectible"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u6536\u85CF\u54C1","Close collectible"))}">X</button>
      </div>
      <div class="collectible-form">
        <div class="collectible-rarity-options">
          ${["R","SR"].map(o=>`
            <label class="collectible-rarity-option is-${o.toLowerCase()}${i.rarity===o?" is-selected":""}">
              <input type="radio" name="collectible-rarity" value="${o}" ${i.rarity===o?"checked":""} />
              <span>${o}</span>
            </label>
          `).join("")}
        </div>
        <label class="collectible-level-field">
          <span>${r(c("\u7B49\u7EA7","Level"))}</span>
          <input type="number" min="0" max="15" step="1" value="${r(i.level)}" data-collectible-level-input />
        </label>
      </div>
    </section>
  `;const a=()=>{const o=l.querySelector("input[name='collectible-rarity']:checked")?.value||"R",t=l.querySelector("[data-collectible-level-input]")?.value||0;H(e,{rarity:o,level:t}),n?.(E(e))};l.addEventListener("pointerdown",o=>o.stopPropagation()),l.addEventListener("click",o=>{o.stopPropagation()}),l.querySelector(".collectible-modal")?.addEventListener("click",o=>o.stopPropagation()),l.querySelector(".collectible-modal")?.addEventListener("pointerdown",o=>o.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",o=>{o.stopPropagation(),S()}),l.querySelectorAll("input[name='collectible-rarity']").forEach(o=>{o.addEventListener("change",()=>{l.querySelectorAll(".collectible-rarity-option").forEach(t=>t.classList.toggle("is-selected",t.querySelector("input")?.checked)),a()})}),p(l.querySelector("[data-collectible-level-input]"),()=>{const o=l.querySelector("[data-collectible-level-input]"),t=X(o.value);String(t)!==o.value&&(o.value=String(t)),a()}),document.body.append(l)}function Z(e,n,i=null){B();const l=j(e,n?.part,n?.level),a=document.createElement("div");a.className="help-modal-backdrop equipment-level-modal-backdrop",a.innerHTML=`
    <section class="help-modal equipment-level-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u88C5\u5907\u7B49\u7EA7","Equipment level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Equipment</span>
          <strong>${r(c(`${n?.slot||"\u88C5\u5907"}\u7B49\u7EA7`,`${n?.slot||"Equipment"} level`))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u88C5\u5907\u7B49\u7EA7","Close equipment level"))}">X</button>
      </div>
      <div class="equipment-level-options">
        ${Array.from({length:6},(t,d)=>`
          <button class="equipment-level-option${d===l?" is-selected":""}" type="button" data-equipment-level-option="${d}">
            <span>LV.</span><strong>${d}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;const o=t=>{V(e,n?.part,t),a.querySelectorAll("[data-equipment-level-option]").forEach(d=>{d.classList.toggle("is-selected",Number(d.dataset.equipmentLevelOption)===q(t))}),i?.(q(t))};a.addEventListener("pointerdown",t=>t.stopPropagation()),a.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".equipment-level-modal")?.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".equipment-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),a.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),B()}),a.querySelectorAll("[data-equipment-level-option]").forEach(t=>{t.addEventListener("click",d=>{d.stopPropagation(),o(d.currentTarget.dataset.equipmentLevelOption)})}),document.body.append(a)}function ee(e,n=null){D();const i=g(e),l=O(e),a=document.createElement("div");a.className="help-modal-backdrop bond-level-modal-backdrop",a.innerHTML=`
    <section class="help-modal bond-level-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Bond</span>
          <strong>${r(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u597D\u611F\u7B49\u7EA7","Close bond level"))}">X</button>
      </div>
      <label class="bond-level-field">
        <span>${r(c(`\u597D\u611F\u7B49\u7EA7\uFF081-${l}\uFF09`,`Bond level (1-${l})`))}</span>
        <input type="number" min="1" max="${r(l)}" step="1" value="${r(i)}" data-bond-level-input />
      </label>
    </section>
  `;const o=()=>{const t=a.querySelector("[data-bond-level-input]");_(e,t?.value||1),t&&(t.value=g(e)),n?.(g(e))};a.addEventListener("pointerdown",t=>t.stopPropagation()),a.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".bond-level-modal")?.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".bond-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),a.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),D()}),p(a.querySelector("[data-bond-level-input]"),o),document.body.append(a)}function te(e=null){M();const n=y(),i=document.createElement("div");i.className="help-modal-backdrop character-level-modal-backdrop",i.innerHTML=`
    <section class="help-modal character-level-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u89D2\u8272\u7B49\u7EA7","Character level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Level</span>
          <strong>${r(c("\u5168\u89D2\u8272\u7B49\u7EA7","Global character level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u89D2\u8272\u7B49\u7EA7","Close character level"))}">X</button>
      </div>
      <label class="character-level-field">
        <span>${r(c("\u5168\u89D2\u8272\u5171\u7528\u7B49\u7EA7\uFF081-600\uFF09","Shared level for all characters (1-600)"))}</span>
        <input type="number" min="1" max="600" step="1" value="${r(n)}" data-character-level-input />
      </label>
    </section>
  `;const l=()=>{const a=i.querySelector("[data-character-level-input]");G(a?.value||400),a&&(a.value=y()),e?.(y())};i.addEventListener("pointerdown",a=>a.stopPropagation()),i.addEventListener("click",a=>a.stopPropagation()),i.querySelector(".character-level-modal")?.addEventListener("click",a=>a.stopPropagation()),i.querySelector(".character-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),i.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),M()}),p(i.querySelector("[data-character-level-input]"),l),document.body.append(i)}function ae(e,n=null){w();const i=k(e),l=document.createElement("div");l.className="help-modal-backdrop breakthrough-core-modal-backdrop",l.innerHTML=`
    <section class="help-modal breakthrough-core-modal" role="dialog" aria-modal="true" aria-label="${r(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Limit</span>
          <strong>${r(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(c("\u5173\u95ED\u7A81\u7834\u8BBE\u7F6E","Close breakthrough settings"))}">X</button>
      </div>
      <div class="breakthrough-core-content">
        <div class="breakthrough-core-section">
          <span>${r(c("\u7A81\u7834\u6B21\u6570","Breakthrough count"))}</span>
          <div class="breakthrough-core-stars" role="group" aria-label="${r(c("\u9009\u62E9\u7A81\u7834\u6B21\u6570","Select breakthrough count"))}">
            ${Array.from({length:4},(o,t)=>`
              <button class="breakthrough-core-star-option${t===i.breakthroughCount?" is-selected":""}" type="button" data-breakthrough-count="${t}">
                ${t===0?r(c("\u65E0","None")):Array.from({length:t},()=>"&#10022;").join("")}
              </button>
            `).join("")}
          </div>
        </div>
        <label class="breakthrough-core-field">
          <span>${r(c("\u6838\u5FC3\u5F3A\u5316\uFF08\u9700 3 \u661F\u7A81\u7834\uFF09","Core enhancement (requires 3-star breakthrough)"))}</span>
          <input type="number" min="0" max="7" step="1" value="${r(i.coreEnhanceLevel)}" data-core-enhance-input ${i.breakthroughCount<3?"disabled":""} />
        </label>
      </div>
    </section>
  `;const a=(o=null)=>{const t=l.querySelector("[data-core-enhance-input]"),d=k(e),b=o===null?d.breakthroughCount:F(o),h=J(t?.value||0,b);K(e,{breakthroughCount:b,coreEnhanceLevel:h});const u=k(e);l.querySelectorAll("[data-breakthrough-count]").forEach(v=>{v.classList.toggle("is-selected",Number(v.dataset.breakthroughCount)===u.breakthroughCount)}),t&&(t.disabled=u.breakthroughCount<3,t.value=String(u.coreEnhanceLevel)),n?.(u)};l.addEventListener("pointerdown",o=>o.stopPropagation()),l.addEventListener("click",o=>o.stopPropagation()),l.querySelector(".breakthrough-core-modal")?.addEventListener("click",o=>o.stopPropagation()),l.querySelector(".breakthrough-core-modal")?.addEventListener("pointerdown",o=>o.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",o=>{o.stopPropagation(),w()}),l.querySelectorAll("[data-breakthrough-count]").forEach(o=>{o.addEventListener("click",t=>{t.stopPropagation(),a(t.currentTarget.dataset.breakthroughCount)})}),p(l.querySelector("[data-core-enhance-input]"),()=>a(null)),document.body.append(l)}export{ee as openBondLevelModal,ae as openBreakthroughCoreModal,te as openCharacterLevelModal,Y as openCollectibleModal,W as openDetailCubeModal,Z as openEquipmentLevelModal,U as openResearchLevelModal,A as setCharacterDetailModalsApi};
