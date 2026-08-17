let C={};function x(e={}){C=e||{}}function i(e){const s=C[e];if(typeof s!="function")throw new Error(`Missing character detail modals API: ${e}`);return s}function o(...e){return i("escapeHtml")(...e)}function c(...e){return i("localize")(...e)}function z(...e){return i("getResearchLevelDefinitions")(...e)}function g(...e){return i("getResearchLevel")(...e)}function N(...e){return i("setResearchLevel")(...e)}function f(...e){return i("getCharacterDetailCube")(...e)}function E(...e){return i("sanitizeDetailCubeType")(...e)}function R(...e){return i("sanitizeDetailCubeLevel")(...e)}function T(...e){return i("saveCharacterDetailCube")(...e)}function I(...e){return i("getCharacterDetailCubeLevelByType")(...e)}function H(...e){return i("getCharacterDetailCubeIconPath")(...e)}function $(...e){return i("getCharacterCollectibleDetail")(...e)}function X(...e){return i("saveCharacterCollectibleDetail")(...e)}function j(...e){return i("sanitizeCollectibleLevel")(...e)}function V(...e){return i("getCharacterEquipmentLevel")(...e)}function O(...e){return i("saveCharacterEquipmentLevel")(...e)}function q(...e){return i("sanitizeEquipmentLevel")(...e)}function le(...e){return i("getCharacterBondLevel")(...e)}function G(...e){return i("getCharacterMaxBondLevel")(...e)}function oe(...e){return i("saveCharacterBondLevel")(...e)}function m(...e){return i("getCharacterDetailLevel")(...e)}function _(...e){return i("saveCharacterDetailLevel")(...e)}function y(...e){return i("getCharacterBreakthroughCoreDetail")(...e)}function F(...e){return i("sanitizeBreakthroughCount")(...e)}function J(...e){return i("sanitizeCoreEnhanceLevel")(...e)}function K(...e){return i("saveCharacterBreakthroughCoreDetail")(...e)}function Q(){return i("getCharacterDetailCubeOptions")()}function h(e,s){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const r=()=>{const t=e.value||"";e.dataset.lastCommittedValue!==t&&(s(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",r),e.addEventListener("blur",r),e.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),r(),e.blur())})}function S(){document.querySelector(".research-level-modal-backdrop")?.remove()}function P(){document.querySelector(".collectible-modal-backdrop")?.remove()}function D(){document.querySelector(".detail-cube-modal-backdrop")?.remove()}function M(){document.querySelector(".bond-level-modal-backdrop")?.remove()}function B(){document.querySelector(".character-level-modal-backdrop")?.remove()}function A(){document.querySelector(".equipment-level-modal-backdrop")?.remove()}function w(){document.querySelector(".breakthrough-core-modal-backdrop")?.remove()}function U(){S();const e=m(),s=Number(e)>=400,r=document.createElement("div");r.className="help-modal-backdrop research-level-modal-backdrop",r.innerHTML=`
    <section class="help-modal research-level-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Research</span>
          <strong>${o(c("\u7814\u7A76\u7B49\u7EA7","Research levels"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u7814\u7A76\u7B49\u7EA7","Close research levels"))}">X</button>
      </div>
    <div class="research-level-grid">
      ${z().map(t=>`
          <label class="research-level-field">
            <span>
              ${t.icon?`<img src="${o(t.icon)}" alt="" aria-hidden="true" class="research-level-icon" loading="lazy" />`:""}
              ${o(t.key==="general"&&s?`${t.label} (${c("\u81EA\u52A8\u586B\u5199","Auto")})`:t.label)}
            </span>
            <input type="number" min="1" max="999" step="1" value="${o(g(t.key))}" data-research-level-input="${o(t.key)}"${t.key==="general"?" disabled":""} />
          </label>
        `).join("")}
      </div>
    </section>
  `,r.addEventListener("pointerdown",t=>t.stopPropagation()),r.addEventListener("click",t=>{t.stopPropagation()}),r.querySelector(".research-level-modal")?.addEventListener("click",t=>t.stopPropagation()),r.querySelector(".research-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),S()}),r.querySelectorAll("[data-research-level-input]").forEach(t=>{h(t,()=>{N(t.dataset.researchLevelInput,t.value),t.value=String(g(t.dataset.researchLevelInput)),document.querySelectorAll(`[data-research-level-trigger="${CSS.escape(t.dataset.researchLevelInput)}"] small`).forEach(l=>{l.textContent=`LV.${g(t.dataset.researchLevelInput)}`}),document.dispatchEvent(new CustomEvent("nikke:research-level-change"))})}),document.body.append(r)}function W(e,s=null){D();const r=f(e),t=r.level>0,l=document.createElement("div");l.className="help-modal-backdrop detail-cube-modal-backdrop",l.innerHTML=`
    <section class="help-modal detail-cube-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u9B54\u65B9","Cube"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Cube</span>
          <strong>${o(c("\u9B54\u65B9","Cube"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u9B54\u65B9","Close cube"))}">X</button>
      </div>
      <div class="detail-cube-form">
        <div class="detail-cube-type-grid" role="radiogroup" aria-label="${o(c("\u9B54\u65B9\u7C7B\u578B","Cube type"))}">
          <label class="detail-cube-type-option detail-cube-none-option${t?"":" is-selected"}" title="${o(c("\u65E0\u9B54\u65B9","No cube"))}">
            <input type="radio" name="detail-cube-type" value="none" data-detail-cube-none ${t?"":"checked"} />
            <span>${o(c("\u65E0\u9B54\u65B9","No cube"))}</span>
          </label>
          ${Q().map(a=>`
            <label class="detail-cube-type-option${t&&r.type===a.type?" is-selected":""}" title="${o(c(a.name,a.enName))}">
              <input type="radio" name="detail-cube-type" value="${o(a.type)}" data-detail-cube-type ${t&&r.type===a.type?"checked":""} />
              <img src="${o(H(a.type))}" alt="" aria-hidden="true" loading="lazy" />
              <span>${o(c(a.name,a.enName))}</span>
            </label>
          `).join("")}
        </div>
        <label class="detail-cube-level-field">
          <span>${o(c("\u9B54\u65B9\u7B49\u7EA7\uFF081-15\uFF09","Cube level (1-15)"))}</span>
          <input type="number" min="1" max="15" step="1" value="${o(t?r.level:1)}" data-detail-cube-level-input ${t?"":"disabled"} />
        </label>
      </div>
    </section>
  `;const n=()=>{const a=l.querySelector("[data-detail-cube-none]"),d=l.querySelector("[data-detail-cube-level-input]"),u=l.querySelector("[data-detail-cube-type]:checked"),v=a?.checked||u?.value==="none",b=E(v?r.type:u?.value),p=v?0:Math.max(1,R(d?.value||1));T(e,{type:b,level:p}),d&&(d.disabled=p<=0,d.value=String(p>0?p:1)),l.querySelector(".detail-cube-none-option")?.classList.toggle("is-selected",p<=0),l.querySelectorAll(".detail-cube-type-option").forEach(k=>{const L=k.querySelector("[data-detail-cube-type]");L&&k.classList.toggle("is-selected",p>0&&L.checked)}),s?.(f(e))};l.addEventListener("pointerdown",a=>a.stopPropagation()),l.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".detail-cube-modal")?.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".detail-cube-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),D()}),l.querySelectorAll("input[name='detail-cube-type']").forEach(a=>a.addEventListener("change",()=>{const d=l.querySelector("[data-detail-cube-none]"),u=l.querySelector("[data-detail-cube-level-input]");if(u){if(a.value==="none")u.disabled=!0,u.value="1";else{u.disabled=!1;const v=I(a.value);u.value=String(v>0?v:1)}d&&(d.checked=a.value==="none")}n()})),h(l.querySelector("[data-detail-cube-level-input]"),n),document.body.append(l)}function Y(e,s=null){P();const r=$(e),t=document.createElement("div");t.className="help-modal-backdrop collectible-modal-backdrop",t.innerHTML=`
    <section class="help-modal collectible-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u6536\u85CF\u54C1","Collectible"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Collectible</span>
          <strong>${o(c("\u6536\u85CF\u54C1","Collectible"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u6536\u85CF\u54C1","Close collectible"))}">X</button>
      </div>
      <div class="collectible-form">
        <div class="collectible-rarity-options">
          ${["R","SR"].map(n=>`
            <label class="collectible-rarity-option is-${n.toLowerCase()}${r.rarity===n?" is-selected":""}">
              <input type="radio" name="collectible-rarity" value="${n}" ${r.rarity===n?"checked":""} />
              <span>${n}</span>
            </label>
          `).join("")}
        </div>
        <label class="collectible-level-field">
          <span>${o(c("\u7B49\u7EA7","Level"))}</span>
          <input type="number" min="0" max="15" step="1" value="${o(r.level)}" data-collectible-level-input />
        </label>
      </div>
    </section>
  `;const l=()=>{const n=t.querySelector("input[name='collectible-rarity']:checked")?.value||"R",a=t.querySelector("[data-collectible-level-input]")?.value||0;X(e,{rarity:n,level:a}),s?.($(e))};t.addEventListener("pointerdown",n=>n.stopPropagation()),t.addEventListener("click",n=>{n.stopPropagation()}),t.querySelector(".collectible-modal")?.addEventListener("click",n=>n.stopPropagation()),t.querySelector(".collectible-modal")?.addEventListener("pointerdown",n=>n.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",n=>{n.stopPropagation(),P()}),t.querySelectorAll("input[name='collectible-rarity']").forEach(n=>{n.addEventListener("change",()=>{t.querySelectorAll(".collectible-rarity-option").forEach(a=>a.classList.toggle("is-selected",a.querySelector("input")?.checked)),l()})}),h(t.querySelector("[data-collectible-level-input]"),()=>{const n=t.querySelector("[data-collectible-level-input]"),a=j(n.value);String(a)!==n.value&&(n.value=String(a)),l()}),document.body.append(t)}function Z(e,s,r=null){A();const t=V(e,s?.part,s?.level),l=document.createElement("div");l.className="help-modal-backdrop equipment-level-modal-backdrop",l.innerHTML=`
    <section class="help-modal equipment-level-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u88C5\u5907\u7B49\u7EA7","Equipment level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Equipment</span>
          <strong>${o(c(`${s?.slot||"\u88C5\u5907"}\u7B49\u7EA7`,`${s?.slot||"Equipment"} level`))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u88C5\u5907\u7B49\u7EA7","Close equipment level"))}">X</button>
      </div>
      <div class="equipment-level-options">
        ${Array.from({length:6},(a,d)=>`
          <button class="equipment-level-option${d===t?" is-selected":""}" type="button" data-equipment-level-option="${d}">
            <span>LV.</span><strong>${d}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;const n=a=>{O(e,s?.part,a),l.querySelectorAll("[data-equipment-level-option]").forEach(d=>{d.classList.toggle("is-selected",Number(d.dataset.equipmentLevelOption)===q(a))}),r?.(q(a))};l.addEventListener("pointerdown",a=>a.stopPropagation()),l.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".equipment-level-modal")?.addEventListener("click",a=>a.stopPropagation()),l.querySelector(".equipment-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),l.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),A()}),l.querySelectorAll("[data-equipment-level-option]").forEach(a=>{a.addEventListener("click",d=>{d.stopPropagation(),n(d.currentTarget.dataset.equipmentLevelOption)})}),document.body.append(l)}function ee(e,s=null){M();const r=G(e),t=document.createElement("div");t.className="help-modal-backdrop bond-level-modal-backdrop",t.innerHTML=`
    <section class="help-modal bond-level-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Bond</span>
          <strong>${o(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u597D\u611F\u7B49\u7EA7","Close bond level"))}">X</button>
      </div>
      <label class="bond-level-field">
        <span>${o(c("\u597D\u611F\u7B49\u7EA7","Bond level"))}</span>
        <input type="number" min="${o(r)}" max="${o(r)}" step="1" value="${o(r)}" data-bond-level-input disabled />
        <small>${o(c("\u5DF2\u81EA\u52A8\u8BBE\u7F6E\u4E3A\u6EE1","Auto set to max"))}</small>
      </label>
    </section>
  `,s?.(r),t.addEventListener("pointerdown",l=>l.stopPropagation()),t.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),M()}),document.body.append(t)}function te(e=null){B();const s=m(),r=document.createElement("div");r.className="help-modal-backdrop character-level-modal-backdrop",r.innerHTML=`
    <section class="help-modal character-level-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u89D2\u8272\u7B49\u7EA7","Character level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Level</span>
          <strong>${o(c("\u5168\u89D2\u8272\u7B49\u7EA7","Global character level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u89D2\u8272\u7B49\u7EA7","Close character level"))}">X</button>
      </div>
      <label class="character-level-field">
        <span>${o(c("\u5168\u89D2\u8272\u5171\u7528\u7B49\u7EA7\uFF081-600\uFF09","Shared level for all characters (1-600)"))}</span>
        <input type="number" min="1" max="600" step="1" value="${o(s)}" data-character-level-input />
      </label>
    </section>
  `;const t=()=>{const l=r.querySelector("[data-character-level-input]");_(l?.value||400),l&&(l.value=m()),e?.(m())};r.addEventListener("pointerdown",l=>l.stopPropagation()),r.addEventListener("click",l=>l.stopPropagation()),r.querySelector(".character-level-modal")?.addEventListener("click",l=>l.stopPropagation()),r.querySelector(".character-level-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),B()}),h(r.querySelector("[data-character-level-input]"),t),document.body.append(r)}function ae(e,s=null){w();const r=y(e),t=document.createElement("div");t.className="help-modal-backdrop breakthrough-core-modal-backdrop",t.innerHTML=`
    <section class="help-modal breakthrough-core-modal" role="dialog" aria-modal="true" aria-label="${o(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Limit</span>
          <strong>${o(c("\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Breakthrough and core enhancement"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${o(c("\u5173\u95ED\u7A81\u7834\u8BBE\u7F6E","Close breakthrough settings"))}">X</button>
      </div>
      <div class="breakthrough-core-content">
        <div class="breakthrough-core-section">
          <span>${o(c("\u7A81\u7834\u6B21\u6570","Breakthrough count"))}</span>
          <div class="breakthrough-core-stars" role="group" aria-label="${o(c("\u9009\u62E9\u7A81\u7834\u6B21\u6570","Select breakthrough count"))}">
            ${Array.from({length:4},(n,a)=>`
              <button class="breakthrough-core-star-option${a===r.breakthroughCount?" is-selected":""}" type="button" data-breakthrough-count="${a}">
                ${a===0?o(c("\u65E0","None")):Array.from({length:a},()=>"&#10022;").join("")}
              </button>
            `).join("")}
          </div>
        </div>
        <label class="breakthrough-core-field">
          <span>${o(c("\u6838\u5FC3\u5F3A\u5316\uFF08\u9700 3 \u661F\u7A81\u7834\uFF09","Core enhancement (requires 3-star breakthrough)"))}</span>
          <input type="number" min="0" max="7" step="1" value="${o(r.coreEnhanceLevel)}" data-core-enhance-input ${r.breakthroughCount<3?"disabled":""} />
        </label>
      </div>
    </section>
  `;const l=(n=null)=>{const a=t.querySelector("[data-core-enhance-input]"),d=y(e),u=n===null?d.breakthroughCount:F(n),v=J(a?.value||0,u);K(e,{breakthroughCount:u,coreEnhanceLevel:v});const b=y(e);t.querySelectorAll("[data-breakthrough-count]").forEach(p=>{p.classList.toggle("is-selected",Number(p.dataset.breakthroughCount)===b.breakthroughCount)}),a&&(a.disabled=b.breakthroughCount<3,a.value=String(b.coreEnhanceLevel)),s?.(b)};t.addEventListener("pointerdown",n=>n.stopPropagation()),t.addEventListener("click",n=>n.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("click",n=>n.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("pointerdown",n=>n.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",n=>{n.stopPropagation(),w()}),t.querySelectorAll("[data-breakthrough-count]").forEach(n=>{n.addEventListener("click",a=>{a.stopPropagation(),l(a.currentTarget.dataset.breakthroughCount)})}),h(t.querySelector("[data-core-enhance-input]"),()=>l(null)),document.body.append(t)}export{ee as openBondLevelModal,ae as openBreakthroughCoreModal,te as openCharacterLevelModal,Y as openCollectibleModal,W as openDetailCubeModal,Z as openEquipmentLevelModal,U as openResearchLevelModal,x as setCharacterDetailModalsApi};
