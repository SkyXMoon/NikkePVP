let B={};const g="nikke:character-detail-refresh";let y=!1,C=!1,L=!1,f=!1;function X(e={}){B=e||{}}function s(e){const d=B[e];if(typeof d!="function")throw new Error(`Missing character detail modals API: ${e}`);return d}function n(...e){return s("escapeHtml")(...e)}function c(...e){return s("localize")(...e)}function j(...e){return s("getResearchLevelDefinitions")(...e)}function k(...e){return s("getResearchLevel")(...e)}function _(...e){return s("setResearchLevel")(...e)}function E(...e){return s("getCharacterDetailCube")(...e)}function R(...e){return s("sanitizeDetailCubeType")(...e)}function O(...e){return s("sanitizeDetailCubeLevel")(...e)}function G(...e){return s("saveCharacterDetailCube")(...e)}function F(...e){return s("getCharacterDetailCubeLevelByType")(...e)}function K(...e){return s("getCharacterDetailCubeIconPath")(...e)}function $(...e){return s("getCharacterCollectibleDetail")(...e)}function J(...e){return s("saveCharacterCollectibleDetail")(...e)}function Q(...e){return s("sanitizeCollectibleLevel")(...e)}function S(...e){return s("getCharacterEquipmentLevel")(...e)}function U(...e){return s("saveCharacterEquipmentLevel")(...e)}function ue(...e){return s("sanitizeEquipmentLevel")(...e)}function pe(...e){return s("getCharacterBondLevel")(...e)}function W(...e){return s("getCharacterMaxBondLevel")(...e)}function ve(...e){return s("saveCharacterBondLevel")(...e)}function q(...e){return s("getCharacterDetailLevel")(...e)}function Y(...e){return s("getCharacterDetailLevelMax")(...e)}function Z(...e){return s("saveCharacterDetailLevel")(...e)}function D(...e){return s("getCharacterBreakthroughCoreDetail")(...e)}function ee(...e){return s("sanitizeBreakthroughCount")(...e)}function te(...e){return s("sanitizeCoreEnhanceLevel")(...e)}function ae(...e){return s("saveCharacterBreakthroughCoreDetail")(...e)}function le(){return s("getCharacterDetailCubeOptions")()}function b(...e){return s("markCharacterDetailPanelDirty")(...e)}function m(e,d){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const r=()=>{const t=e.value||"";e.dataset.lastCommittedValue!==t&&(d(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",r),e.addEventListener("blur",r),e.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),r(),e.blur())})}function w(){const e=y;y=!1,document.querySelector(".research-level-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function N(){const e=L;L=!1,document.querySelector(".collectible-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function T(){const e=f;f=!1,document.querySelector(".detail-cube-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function z(){document.querySelector(".bond-level-modal-backdrop")?.remove()}function I(){document.querySelector(".character-level-modal-backdrop")?.remove()}function H(){const e=C;C=!1,document.querySelector(".equipment-level-modal-backdrop")?.remove(),e&&document.dispatchEvent(new CustomEvent(g))}function V(){document.querySelector(".breakthrough-core-modal-backdrop")?.remove()}function oe(){w(),y=!1;const e=q(),d=Number(e)>=400,r=document.createElement("div");r.className="help-modal-backdrop research-level-modal-backdrop",r.innerHTML=`
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
              ${n(t.key==="general"&&d?`${t.label} (${c("\u81EA\u52A8\u586B\u5199","Auto")})`:t.label)}
            </span>
            <input type="number" min="1" max="999" step="1" value="${n(k(t.key))}" data-research-level-input="${n(t.key)}"${t.key==="general"?" disabled":""} />
          </label>
        `).join("")}
      </div>
    </section>
  `,r.addEventListener("pointerdown",t=>t.stopPropagation()),r.addEventListener("click",t=>{t.stopPropagation()}),r.querySelector(".research-level-modal")?.addEventListener("click",t=>t.stopPropagation()),r.querySelector(".research-level-modal")?.addEventListener("pointerdown",t=>t.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",t=>{t.stopPropagation(),w()}),r.querySelectorAll("[data-research-level-input]").forEach(t=>{m(t,()=>{const o=t.dataset.researchLevelInput,l=k(o);_(o,t.value);const a=k(o);t.value=String(a),document.querySelectorAll(`[data-research-level-trigger="${CSS.escape(t.dataset.researchLevelInput)}"] small`).forEach(i=>{i.textContent=`LV.${k(t.dataset.researchLevelInput)}`}),a!==l&&(y=!0,b())})}),document.body.append(r)}function ne(e,d=null){T(),f=!1;const r=E(e),t=r.level>0,o=document.createElement("div");o.className="help-modal-backdrop detail-cube-modal-backdrop",o.innerHTML=`
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
          ${le().map(a=>`
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
  `;const l=()=>{const a=o.querySelector("[data-detail-cube-none]"),i=o.querySelector("[data-detail-cube-level-input]"),u=o.querySelector("[data-detail-cube-type]:checked"),p=a?.checked||u?.value==="none",h=R(p?r.type:u?.value),v=p?0:Math.max(1,O(i?.value||1)),P=E(e);G(e,{type:h,level:v});const M=E(e);i&&(i.disabled=v<=0,i.value=String(v>0?v:1)),o.querySelector(".detail-cube-none-option")?.classList.toggle("is-selected",v<=0),o.querySelectorAll(".detail-cube-type-option").forEach(A=>{const x=A.querySelector("[data-detail-cube-type]");x&&A.classList.toggle("is-selected",v>0&&x.checked)}),(P.type!==M.type||P.level!==M.level)&&(f=!0,b()),d?.(E(e))};o.addEventListener("pointerdown",a=>a.stopPropagation()),o.addEventListener("click",a=>a.stopPropagation()),o.querySelector(".detail-cube-modal")?.addEventListener("click",a=>a.stopPropagation()),o.querySelector(".detail-cube-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),o.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),T()}),o.querySelectorAll("input[name='detail-cube-type']").forEach(a=>a.addEventListener("change",()=>{const i=o.querySelector("[data-detail-cube-none]"),u=o.querySelector("[data-detail-cube-level-input]");if(u){if(a.value==="none")u.disabled=!0,u.value="1";else{u.disabled=!1;const p=F(a.value);u.value=String(p>0?p:1)}i&&(i.checked=a.value==="none")}l()})),m(o.querySelector("[data-detail-cube-level-input]"),l),document.body.append(o)}function re(e,d=null){N(),L=!1;const r=$(e),t=document.createElement("div");t.className="help-modal-backdrop collectible-modal-backdrop",t.innerHTML=`
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
          ${["R","SR"].map(l=>`
            <label class="collectible-rarity-option is-${l.toLowerCase()}${r.rarity===l?" is-selected":""}">
              <input type="radio" name="collectible-rarity" value="${l}" ${r.rarity===l?"checked":""} />
              <span>${l}</span>
            </label>
          `).join("")}
        </div>
        <label class="collectible-level-field">
          <span>${n(c("\u7B49\u7EA7","Level"))}</span>
          <input type="number" min="0" max="15" step="1" value="${n(r.level)}" data-collectible-level-input />
        </label>
      </div>
    </section>
  `;const o=()=>{const l=t.querySelector("input[name='collectible-rarity']:checked")?.value||"R",a=t.querySelector("[data-collectible-level-input]")?.value||0,i=$(e);J(e,{rarity:l,level:a});const u=$(e);(i.rarity!==u.rarity||i.level!==u.level)&&(L=!0,b()),d?.($(e))};t.addEventListener("pointerdown",l=>l.stopPropagation()),t.addEventListener("click",l=>{l.stopPropagation()}),t.querySelector(".collectible-modal")?.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".collectible-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),N()}),t.querySelectorAll("input[name='collectible-rarity']").forEach(l=>{l.addEventListener("change",()=>{t.querySelectorAll(".collectible-rarity-option").forEach(a=>a.classList.toggle("is-selected",a.querySelector("input")?.checked)),o()})}),m(t.querySelector("[data-collectible-level-input]"),()=>{const l=t.querySelector("[data-collectible-level-input]"),a=Q(l.value);String(a)!==l.value&&(l.value=String(a)),o()}),document.body.append(t)}function ce(e,d,r=null){H(),C=!1;const t=S(e,d?.part,d?.level),o=document.createElement("div");o.className="help-modal-backdrop equipment-level-modal-backdrop",o.innerHTML=`
    <section class="help-modal equipment-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u88C5\u5907\u7B49\u7EA7","Equipment level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Equipment</span>
          <strong>${n(c(`${d?.slot||"\u88C5\u5907"}\u7B49\u7EA7`,`${d?.slot||"Equipment"} level`))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u88C5\u5907\u7B49\u7EA7","Close equipment level"))}">X</button>
      </div>
      <div class="equipment-level-options">
        ${Array.from({length:6},(a,i)=>`
          <button class="equipment-level-option${i===t?" is-selected":""}" type="button" data-equipment-level-option="${i}">
            <span>LV.</span><strong>${i}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;const l=a=>{const i=S(e,d?.part,d?.level);U(e,d?.part,a);const u=S(e,d?.part,d?.level);o.querySelectorAll("[data-equipment-level-option]").forEach(p=>{p.classList.toggle("is-selected",Number(p.dataset.equipmentLevelOption)===u)}),i!==u&&(C=!0,b()),r?.(u)};o.addEventListener("pointerdown",a=>a.stopPropagation()),o.addEventListener("click",a=>a.stopPropagation()),o.querySelector(".equipment-level-modal")?.addEventListener("click",a=>a.stopPropagation()),o.querySelector(".equipment-level-modal")?.addEventListener("pointerdown",a=>a.stopPropagation()),o.querySelector(".help-modal-close")?.addEventListener("click",a=>{a.stopPropagation(),H()}),o.querySelectorAll("[data-equipment-level-option]").forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),l(i.currentTarget.dataset.equipmentLevelOption)})}),document.body.append(o)}function ie(e,d=null){z();const r=W(e),t=document.createElement("div");t.className="help-modal-backdrop bond-level-modal-backdrop",t.innerHTML=`
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
  `,d?.(r),t.addEventListener("pointerdown",o=>o.stopPropagation()),t.addEventListener("click",o=>o.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("click",o=>o.stopPropagation()),t.querySelector(".bond-level-modal")?.addEventListener("pointerdown",o=>o.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",o=>{o.stopPropagation(),z()}),document.body.append(t)}function se(e=null){I();const d=q(),r=Y(),t=document.createElement("div");t.className="help-modal-backdrop character-level-modal-backdrop",t.innerHTML=`
    <section class="help-modal character-level-modal" role="dialog" aria-modal="true" aria-label="${n(c("\u89D2\u8272\u7B49\u7EA7","Character level"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Level</span>
          <strong>${n(c("\u5168\u89D2\u8272\u7B49\u7EA7","Global character level"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(c("\u5173\u95ED\u89D2\u8272\u7B49\u7EA7","Close character level"))}">X</button>
      </div>
      <label class="character-level-field">
        <span>${n(c(`\u5168\u89D2\u8272\u5171\u7528\u7B49\u7EA7\uFF081-${r}\uFF09`,`Shared level for all characters (1-${r})`))}</span>
        <input type="number" min="1" max="${n(r)}" step="1" value="${n(d)}" data-character-level-input />
      </label>
    </section>
  `;const o=()=>{const l=t.querySelector("[data-character-level-input]"),a=q();Z(l?.value||400);const i=q();l&&(l.value=i),a!==i&&b(),e?.(i)};t.addEventListener("pointerdown",l=>l.stopPropagation()),t.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".character-level-modal")?.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".character-level-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),I()}),m(t.querySelector("[data-character-level-input]"),o),document.body.append(t)}function de(e,d=null){V();const r=D(e),t=document.createElement("div");t.className="help-modal-backdrop breakthrough-core-modal-backdrop",t.innerHTML=`
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
            ${Array.from({length:4},(l,a)=>`
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
  `;const o=(l=null)=>{const a=t.querySelector("[data-core-enhance-input]"),i=D(e),u=l===null?i.breakthroughCount:ee(l),p=te(a?.value||0,u);ae(e,{breakthroughCount:u,coreEnhanceLevel:p});const h=D(e);t.querySelectorAll("[data-breakthrough-count]").forEach(v=>{v.classList.toggle("is-selected",Number(v.dataset.breakthroughCount)===h.breakthroughCount)}),a&&(a.disabled=h.breakthroughCount<3,a.value=String(h.coreEnhanceLevel)),(i.breakthroughCount!==h.breakthroughCount||i.coreEnhanceLevel!==h.coreEnhanceLevel)&&b(),d?.(h)};t.addEventListener("pointerdown",l=>l.stopPropagation()),t.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("click",l=>l.stopPropagation()),t.querySelector(".breakthrough-core-modal")?.addEventListener("pointerdown",l=>l.stopPropagation()),t.querySelector(".help-modal-close")?.addEventListener("click",l=>{l.stopPropagation(),V()}),t.querySelectorAll("[data-breakthrough-count]").forEach(l=>{l.addEventListener("click",a=>{a.stopPropagation(),o(a.currentTarget.dataset.breakthroughCount)})}),m(t.querySelector("[data-core-enhance-input]"),()=>o(null)),document.body.append(t)}export{ie as openBondLevelModal,de as openBreakthroughCoreModal,se as openCharacterLevelModal,re as openCollectibleModal,ne as openDetailCubeModal,ce as openEquipmentLevelModal,oe as openResearchLevelModal,X as setCharacterDetailModalsApi};
