let C={};function x(e={}){C=e||{}}function s(e){const n=C[e];if(typeof n!="function")throw new Error(`Missing character detail modals API: ${e}`);return n}function o(...e){return s("escapeHtml")(...e)}function i(...e){return s("localize")(...e)}function z(...e){return s("getResearchLevelDefinitions")(...e)}function m(...e){return s("getResearchLevel")(...e)}function N(...e){return s("setResearchLevel")(...e)}function f(...e){return s("getCharacterDetailCube")(...e)}function E(...e){return s("sanitizeDetailCubeType")(...e)}function R(...e){return s("sanitizeDetailCubeLevel")(...e)}function T(...e){return s("saveCharacterDetailCube")(...e)}function I(...e){return s("getCharacterDetailCubeLevelByType")(...e)}function H(...e){return s("getCharacterDetailCubeIconPath")(...e)}function q(...e){return s("getCharacterCollectibleDetail")(...e)}function X(...e){return s("saveCharacterCollectibleDetail")(...e)}function j(...e){return s("sanitizeCollectibleLevel")(...e)}function V(...e){return s("getCharacterEquipmentLevel")(...e)}function O(...e){return s("saveCharacterEquipmentLevel")(...e)}function $(...e){return s("sanitizeEquipmentLevel")(...e)}function le(...e){return s("getCharacterBondLevel")(...e)}function _(...e){return s("getCharacterMaxBondLevel")(...e)}function oe(...e){return s("saveCharacterBondLevel")(...e)}function g(...e){return s("getCharacterDetailLevel")(...e)}function G(...e){return s("saveCharacterDetailLevel")(...e)}function y(...e){return s("getCharacterBreakthroughCoreDetail")(...e)}function F(...e){return s("sanitizeBreakthroughCount")(...e)}function J(...e){return s("sanitizeCoreEnhanceLevel")(...e)}function K(...e){return s("saveCharacterBreakthroughCoreDetail")(...e)}function Q(){return s("getCharacterDetailCubeOptions")()}function h(e,n){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const c=()=>{const l=e.value||"";e.dataset.lastCommittedValue!==l&&(n(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",c),e.addEventListener("blur",c),e.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),c(),e.blur())})}function S(){document.querySelector(".research-level-modal-backdrop")?.remove()}function P(){document.querySelector(".collectible-modal-backdrop")?.remove()}function D(){document.querySelector(".detail-cube-modal-backdrop")?.remove()}function M(){document.querySelector(".bond-level-modal-backdrop")?.remove()}function B(){document.querySelector(".character-level-modal-backdrop")?.remove()}function w(){document.querySelector(".equipment-level-modal-backdrop")?.remove()}function A(){document.querySelector(".breakthrough-core-modal-backdrop")?.remove()}function U(){S();const e=document.createElement("div");e.className="help-modal-backdrop research-level-modal-backdrop",e.innerHTML=`
    <section class="help-modal research-level-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u7814\u7A76\u7B49\u7EA7","Research levels"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Research</span>
          <strong>${o(i("\u7814\u7A76\u7B49\u7EA7","Research levels"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u7814\u7A76\u7B49\u7EA7","Close research levels"))}">X</button>
      </div>
      <div class="research-level-grid">
        ${z().map(n=>`
          <label class="research-level-field">
            <span>${o(n.label)}</span>
            <input type="number" min="1" max="999" step="1" value="${o(m(n.key))}" data-research-level-input="${o(n.key)}" />
          </label>
        `).join("")}
      </div>
    </section>
  `,e.addEventListener("pointerdown",n=>n.stopPropagation()),e.addEventListener("click",n=>{n.stopPropagation()}),e.querySelector(".research-level-modal")?.addEventListener("click",n=>n.stopPropagation()),e.querySelector(".research-level-modal")?.addEventListener("pointerdown",n=>n.stopPropagation()),e.querySelector(".help-modal-close")?.addEventListener("click",n=>{n.stopPropagation(),S()}),e.querySelectorAll("[data-research-level-input]").forEach(n=>{h(n,()=>{N(n.dataset.researchLevelInput,n.value),n.value=String(m(n.dataset.researchLevelInput)),document.querySelectorAll(`[data-research-level-trigger="${CSS.escape(n.dataset.researchLevelInput)}"] small`).forEach(c=>{c.textContent=`LV.${m(n.dataset.researchLevelInput)}`}),document.dispatchEvent(new CustomEvent("nikke:research-level-change"))})}),document.body.append(e)}function W(e,n=null){D();const c=f(e),l=c.level>0,a=document.createElement("div");a.className="help-modal-backdrop detail-cube-modal-backdrop",a.innerHTML=`
    <section class="help-modal detail-cube-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u9B54\u65B9","Cube"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Cube</span>
          <strong>${o(i("\u9B54\u65B9","Cube"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u9B54\u65B9","Close cube"))}">X</button>
      </div>
      <div class="detail-cube-form">
        <div class="detail-cube-type-grid" role="radiogroup" aria-label="${o(i("\u9B54\u65B9\u7C7B\u578B","Cube type"))}">
          <label class="detail-cube-type-option detail-cube-none-option${l?"":" is-selected"}" title="${o(i("\u65E0\u9B54\u65B9","No cube"))}">
            <input type="radio" name="detail-cube-type" value="none" data-detail-cube-none ${l?"":"checked"} />
            <span>${o(i("\u65E0\u9B54\u65B9","No cube"))}</span>
          </label>
          ${Q().map(t=>`
            <label class="detail-cube-type-option${l&&c.type===t.type?" is-selected":""}" title="${o(i(t.name,t.enName))}">
              <input type="radio" name="detail-cube-type" value="${o(t.type)}" data-detail-cube-type ${l&&c.type===t.type?"checked":""} />
              <img src="${o(H(t.type))}" alt="" aria-hidden="true" loading="lazy" />
              <span>${o(i(t.name,t.enName))}</span>
            </label>
          `).join("")}
        </div>
        <label class="detail-cube-level-field">
          <span>${o(i("\u9B54\u65B9\u7B49\u7EA7\uFF081-15\uFF09","Cube level (1-15)"))}</span>
          <input type="number" min="1" max="15" step="1" value="${o(l?c.level:1)}" data-detail-cube-level-input ${l?"":"disabled"} />
        </label>
      </div>
    </section>
  `;const r=()=>{const t=a.querySelector("[data-detail-cube-none]"),d=a.querySelector("[data-detail-cube-level-input]"),u=a.querySelector("[data-detail-cube-type]:checked"),v=t?.checked||u?.value==="none",b=E(v?c.type:u?.value),p=v?0:Math.max(1,R(d?.value||1));T(e,{type:b,level:p}),d&&(d.disabled=p<=0,d.value=String(p>0?p:1)),a.querySelector(".detail-cube-none-option")?.classList.toggle("is-selected",p<=0),a.querySelectorAll(".detail-cube-type-option").forEach(k=>{const L=k.querySelector("[data-detail-cube-type]");L&&k.classList.toggle("is-selected",p>0&&L.checked)}),n?.(f(e))};a.addEventListener("pointerdown",t=>t.stopPropagation()),a.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".detail-cube-modal")?.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".detail-cube-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),a.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),D()}),a.querySelectorAll("input[name='detail-cube-type']").forEach(t=>t.addEventListener("change",()=>{const d=a.querySelector("[data-detail-cube-none]"),u=a.querySelector("[data-detail-cube-level-input]");if(u){if(t.value==="none")u.disabled=!0,u.value="1";else{u.disabled=!1;const v=I(t.value);u.value=String(v>0?v:1)}d&&(d.checked=t.value==="none")}r()})),h(a.querySelector("[data-detail-cube-level-input]"),r),document.body.append(a)}function Y(e,n=null){P();const c=q(e),l=document.createElement("div");l.className="help-modal-backdrop collectible-modal-backdrop",l.innerHTML=`
    <section class="help-modal collectible-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u6536\u85CF\u54C1","Collectible"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Collectible</span>
          <strong>${o(i("\u6536\u85CF\u54C1","Collectible"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u6536\u85CF\u54C1","Close collectible"))}">X</button>
      </div>
      <div class="collectible-form">
        <div class="collectible-rarity-options">
          ${["R","SR"].map(r=>`
            <label class="collectible-rarity-option is-${r.toLowerCase()}${c.rarity===r?" is-selected":""}">
              <input type="radio" name="collectible-rarity" value="${r}" ${c.rarity===r?"checked":""} />
              <span>${r}</span>
            </label>
          `).join("")}
        </div>
        <label class="collectible-level-field">
          <span>${o(i("\u7B49\u7EA7","Level"))}</span>
          <input type="number" min="0" max="15" step="1" value="${o(c.level)}" data-collectible-level-input />
        </label>
      </div>
    </section>
  `;const a=()=>{const r=l.querySelector("input[name='collectible-rarity']:checked")?.value||"R",t=l.querySelector("[data-collectible-level-input]")?.value||0;X(e,{rarity:r,level:t}),n?.(q(e))};l.addEventListener("pointerdown",r=>r.stopPropagation()),l.addEventListener("click",r=>{r.stopPropagation()}),l.querySelector(".collectible-modal")?.addEventListener("click",r=>r.stopPropagation()),l.querySelector(".collectible-modal")?.addEventListener("pointerdown",r=>r.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",r=>{r.stopPropagation(),P()}),l.querySelectorAll("input[name='collectible-rarity']").forEach(r=>{r.addEventListener("change",()=>{l.querySelectorAll(".collectible-rarity-option").forEach(t=>t.classList.toggle("is-selected",t.querySelector("input")?.checked)),a()})}),h(l.querySelector("[data-collectible-level-input]"),()=>{const r=l.querySelector("[data-collectible-level-input]"),t=j(r.value);String(t)!==r.value&&(r.value=String(t)),a()}),document.body.append(l)}function Z(e,n,c=null){w();const l=V(e,n?.part,n?.level),a=document.createElement("div");a.className="help-modal-backdrop equipment-level-modal-backdrop",a.innerHTML=`
    <section class="help-modal equipment-level-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u88C5\u5907\u7B49\u7EA7","Equipment level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Equipment</span>
          <strong>${o(i(`${n?.slot||"\u88C5\u5907"}\u7B49\u7EA7`,`${n?.slot||"Equipment"} level`))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u88C5\u5907\u7B49\u7EA7","Close equipment level"))}">X</button>
      </div>
      <div class="equipment-level-options">
        ${Array.from({length:6},(t,d)=>`
          <button class="equipment-level-option${d===l?" is-selected":""}" type="button" data-equipment-level-option="${d}">
            <span>LV.</span><strong>${d}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;const r=t=>{O(e,n?.part,t),a.querySelectorAll("[data-equipment-level-option]").forEach(d=>{d.classList.toggle("is-selected",Number(d.dataset.equipmentLevelOption)===$(t))}),c?.($(t))};a.addEventListener("pointerdown",t=>t.stopPropagation()),a.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".equipment-level-modal")?.addEventListener("click",t=>t.stopPropagation()),a.querySelector(".equipment-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),a.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),w()}),a.querySelectorAll("[data-equipment-level-option]").forEach(t=>{t.addEventListener("click",d=>{d.stopPropagation(),r(d.currentTarget.dataset.equipmentLevelOption)})}),document.body.append(a)}function ee(e,n=null){M();const c=_(e),l=document.createElement("div");l.className="help-modal-backdrop bond-level-modal-backdrop",l.innerHTML=`
    <section class="help-modal bond-level-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u597D\u611F\u7B49\u7EA7","Bond level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Bond</span>
          <strong>${o(i("\u597D\u611F\u7B49\u7EA7","Bond level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u597D\u611F\u7B49\u7EA7","Close bond level"))}">X</button>
      </div>
      <label class="bond-level-field">
        <span>${o(i("\u597D\u611F\u7B49\u7EA7","Bond level"))}</span>
        <input type="number" min="${o(c)}" max="${o(c)}" step="1" value="${o(c)}" data-bond-level-input disabled />
        <small>${o(i("\u5DF2\u81EA\u52A8\u8BBE\u7F6E\u4E3A\u6EE1","Auto set to max"))}</small>
      </label>
    </section>
  `,n?.(c),l.addEventListener("pointerdown",a=>a.stopPropagation()),l.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".bond-level-modal")?.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".bond-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),M()}),document.body.append(l)}function te(e=null){B();const n=g(),c=document.createElement("div");c.className="help-modal-backdrop character-level-modal-backdrop",c.innerHTML=`
    <section class="help-modal character-level-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u89D2\u8272\u7B49\u7EA7","Character level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Level</span>
          <strong>${o(i("\u5168\u89D2\u8272\u7B49\u7EA7","Global character level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u89D2\u8272\u7B49\u7EA7","Close character level"))}">X</button>
      </div>
      <label class="character-level-field">
        <span>${o(i("\u5168\u89D2\u8272\u5171\u7528\u7B49\u7EA7\uFF081-600\uFF09","Shared level for all characters (1-600)"))}</span>
        <input type="number" min="1" max="600" step="1" value="${o(n)}" data-character-level-input />
      </label>
    </section>
  `;const l=()=>{const a=c.querySelector("[data-character-level-input]");G(a?.value||400),a&&(a.value=g()),e?.(g())};c.addEventListener("pointerdown",a=>a.stopPropagation()),c.addEventListener("click",a=>a.stopPropagation()),c.querySelector(".character-level-modal")?.addEventListener("click",a=>a.stopPropagation()),c.querySelector(".character-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),c.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),B()}),h(c.querySelector("[data-character-level-input]"),l),document.body.append(c)}function ae(e,n=null){A();const c=y(e),l=document.createElement("div");l.className="help-modal-backdrop breakthrough-core-modal-backdrop",l.innerHTML=`
    <section class="help-modal breakthrough-core-modal" role="dialog" aria-modal="true" aria-label="${o(i("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Limit</span>
          <strong>${o(i("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(i("\u5173\u95ED\u7A81\u7834\u8BBE\u7F6E","Close breakthrough settings"))}">X</button>
      </div>
      <div class="breakthrough-core-content">
        <div class="breakthrough-core-section">
          <span>${o(i("\u7A81\u7834\u6B21\u6570","Breakthrough count"))}</span>
          <div class="breakthrough-core-stars" role="group" aria-label="${o(i("\u9009\u62E9\u7A81\u7834\u6B21\u6570","Select breakthrough count"))}">
            ${Array.from({length:4},(r,t)=>`
              <button class="breakthrough-core-star-option${t===c.breakthroughCount?" is-selected":""}" type="button" data-breakthrough-count="${t}">
                ${t===0?o(i("\u65E0","None")):Array.from({length:t},()=>"&#10022;").join("")}
              </button>
            `).join("")}
          </div>
        </div>
        <label class="breakthrough-core-field">
          <span>${o(i("\u6838\u5FC3\u5F3A\u5316\uFF08\u9700 3 \u661F\u7A81\u7834\uFF09","Core enhancement (requires 3-star breakthrough)"))}</span>
          <input type="number" min="0" max="7" step="1" value="${o(c.coreEnhanceLevel)}" data-core-enhance-input ${c.breakthroughCount<3?"disabled":""} />
        </label>
      </div>
    </section>
  `;const a=(r=null)=>{const t=l.querySelector("[data-core-enhance-input]"),d=y(e),u=r===null?d.breakthroughCount:F(r),v=J(t?.value||0,u);K(e,{breakthroughCount:u,coreEnhanceLevel:v});const b=y(e);l.querySelectorAll("[data-breakthrough-count]").forEach(p=>{p.classList.toggle("is-selected",Number(p.dataset.breakthroughCount)===b.breakthroughCount)}),t&&(t.disabled=b.breakthroughCount<3,t.value=String(b.coreEnhanceLevel)),n?.(b)};l.addEventListener("pointerdown",r=>r.stopPropagation()),l.addEventListener("click",r=>r.stopPropagation()),l.querySelector(".breakthrough-core-modal")?.addEventListener("click",r=>r.stopPropagation()),l.querySelector(".breakthrough-core-modal")?.addEventListener("pointerdown",r=>r.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",r=>{r.stopPropagation(),A()}),l.querySelectorAll("[data-breakthrough-count]").forEach(r=>{r.addEventListener("click",t=>{t.stopPropagation(),a(t.currentTarget.dataset.breakthroughCount)})}),h(l.querySelector("[data-core-enhance-input]"),()=>a(null)),document.body.append(l)}export{ee as openBondLevelModal,ae as openBreakthroughCoreModal,te as openCharacterLevelModal,Y as openCollectibleModal,W as openDetailCubeModal,Z as openEquipmentLevelModal,U as openResearchLevelModal,x as setCharacterDetailModalsApi};
