import{calculateCharacterDetailCombatPower as E,getCharacterBaseStatItems as w,getCharacterWeaponStatItems as F,setCharacterDetailPowerActiveCharacter as j,setCharacterDetailStatsApi as W}from"./character-detail-stats.js";let b={};function X(e={}){b=e||{},W({...e,renderCharacterDetailPanel:K})}function r(e){const o=b[e];if(typeof o!="function")throw new Error(`Missing character detail panel API: ${e}`);return o}function G(){return b.state||{}}function y(...e){return r("getCharacterEquipmentDetail")(...e)}function a(...e){return r("escapeHtml")(...e)}function i(...e){return r("localize")(...e)}function J(...e){return r("isFavoriteCharacter")(...e)}function O(...e){return r("getCharacterDetailLevel")(...e)}function Q(...e){return r("getCharacterClassResearchKey")(...e)}function Y(...e){return r("getCharacterCompanyResearchKey")(...e)}function Z(...e){return r("getCharacterDetailCube")(...e)}function ee(...e){return r("getCharacterCollectibleDetail")(...e)}function te(...e){return r("getCharacterBondLevel")(...e)}function I(...e){return r("getCharacterSkillLevels")(...e)}function ae(...e){return r("getCharacterBreakthroughCoreDetail")(...e)}function re(...e){return r("getCharacterDetailPortraitUrl")(...e)}function ne(...e){return r("getCharacterDetailPanel")(...e)}function M(...e){return r("getCharacterDisplayName")(...e)}function le(...e){return r("getRarityIconPath")(...e)}function P(...e){return r("getCharacterBreakthroughStarsMarkup")(...e)}function $(...e){return r("getCharacterDetailIconChip")(...e)}function ie(...e){return r("getDetailElementIcon")(...e)}function oe(...e){return r("getDetailWeaponIcon")(...e)}function A(...e){return r("getCharacterDetailResearchChip")(...e)}function ce(...e){return r("getDetailClassIcon")(...e)}function B(...e){return r("getResearchLevel")(...e)}function se(...e){return r("getDetailCompanyIcon")(...e)}function ue(...e){return r("getDetailBurstIcon")(...e)}function R(...e){return r("getCharacterDetailCubeButtonContent")(...e)}function de(...e){return r("getEquipmentAffixAt")(...e)}function ge(...e){return r("openResearchLevelModal")(...e)}function U(...e){return r("closeCharacterDetailPanel")(...e)}function pe(...e){return r("openCollectibleModal")(...e)}function he(...e){return r("openDetailCubeModal")(...e)}function ve(...e){return r("openBondLevelModal")(...e)}function be(...e){return r("openCharacterLevelModal")(...e)}function Ce(...e){return r("openBreakthroughCoreModal")(...e)}function fe(...e){return r("openAccountModal")(...e)}function me(...e){return r("sanitizeCharacterSkillLevel")(...e)}function ye(...e){return r("saveCharacterSkillLevels")(...e)}function $e(...e){return r("openEquipmentLevelModal")(...e)}function Se(...e){return r("shareCharacterDetailImage")(...e)}function qe(...e){return r("toggleFavoriteCharacter")(...e)}function Le(...e){return r("renderCharacters")(...e)}function ke(...e){return r("openCharacterEquipmentUploadModal")(...e)}function De(...e){return r("uploadCharacterEquipmentImage")(...e)}function H(...e){return r("scheduleCharacterDetailExportPreload")(...e)}async function x(...e){const o=b.ensureExternalEquipmentApiKeyBeforeUpload;return typeof o=="function"?o(...e):!0}function Ee(e,o){const u=y(o);w(o,u).forEach(s=>{const g=e.querySelector(`[data-detail-base-stat="${s.key}"] strong`);g&&(g.textContent=s.value)})}function d(e,o){const u=y(o),s=E(o,u),g=e.querySelector(".character-detail-combat-power"),p=g?.querySelector("strong");p&&(p.textContent=String(s)),g?.setAttribute("aria-label",i(`\u6218\u6597\u529B ${s}`,`Combat power ${s}`)),Ee(e,o),H(o)}function we(e,o){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const u=()=>{const s=e.value||"";e.dataset.lastCommittedValue!==s&&(o(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",u),e.addEventListener("blur",u),e.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),u(),e.blur())})}function K(e){const o=y(e),u=String(e?.rarity||"SSR").trim().toLowerCase(),s=["r","sr","ssr"].includes(u)?`is-rarity-${u}`:"is-rarity-ssr",g=!!G().authSession?.accessToken,p=J(e),T=g?`<p class="character-detail-equipment-empty">${a(i("\u672A\u540C\u6B65\u88C5\u5907\u6570\u636E","Equipment data not synced"))}</p>`:`<div class="character-detail-equipment-empty character-detail-equipment-login-empty">
        <span>${a(i("\u767B\u5F55\u540E\u53EF\u540C\u6B65\u88C5\u5907\u6570\u636E","Sign in to sync equipment data"))}</span>
        <button class="character-detail-login-button" type="button" data-character-detail-login>${a(i("\u767B\u5F55","Sign in"))}</button>
      </div>`,_=w(e,o),z=F(e,o);j(e);const C=E(e,o),f=O(),S=Q(e),q=Y(e),L=Z(e),h=ee(e),N=te(e),m=I(e),V=ae(e),k=re(e),n=ne();n.__researchPowerHandler&&document.removeEventListener("nikke:research-level-change",n.__researchPowerHandler),n.__researchPowerHandler=()=>d(n,e),document.addEventListener("nikke:research-level-change",n.__researchPowerHandler),n.classList.remove("is-rarity-r","is-rarity-sr","is-rarity-ssr"),n.classList.add(s),n.setAttribute("aria-label",e.name||M(e)),n.innerHTML=`
    <div class="character-detail-portrait" style="${k?`background-image: url('${a(k)}');`:""}"></div>
    <div class="character-detail-scrim"></div>
    <div class="character-detail-content">
      <header class="character-detail-header">
        <div class="character-detail-title-block">
          <div class="character-detail-name-row">
            <strong><img src="${a(le(e))}" alt="${a(e.rarity||"SSR")}" loading="lazy" />${a(e.name||M(e))}</strong>
            <button class="character-detail-breakthrough-stars" type="button" data-breakthrough-core-trigger aria-label="${a(i("\u8BBE\u7F6E\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Set breakthrough and core enhancement"))}">${P(V)}</button>
          </div>
        </div>
        <button class="character-detail-close" type="button" data-character-detail-close aria-label="${a(i("\u5173\u95ED\u8BE6\u60C5","Close details"))}">X</button>
        <button class="character-detail-level" type="button" data-character-level-trigger aria-label="${a(i(`\u8BBE\u7F6E\u7B49\u7EA7 ${f}`,`Set level ${f}`))}">
          <span>LV.</span><strong>${a(f)}</strong>
        </button>
      </header>
      <div class="character-detail-icons">
        <div class="character-detail-icon-list">
          ${$(ie(e),e.element||"-","is-plain")}
          ${$(oe(e),e.weapon||"-")}
          ${A(ce(e),e.classType||"-",S,B(S))}
          ${A(se(e),e.company||"-",q,B(q))}
          ${$(ue(e),e.burstStage||"-","is-plain")}
        </div>
        <div class="character-detail-combat-power" aria-label="${a(i(`\u6218\u6597\u529B ${C}`,`Combat power ${C}`))}">
          <span>${a(i("\u6218\u6597\u529B","Power"))}</span>
          <strong>${a(String(C))}</strong>
        </div>
      </div>
      <section class="character-detail-base-stat-grid">
        ${_.map(t=>`
              <div class="character-detail-stat is-base-stat" data-detail-base-stat="${a(t.key)}">
                <span>${a(t.label)}</span>
                <strong>${a(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-weapon-stat-grid">
        ${z.map(t=>`
              <div class="character-detail-stat">
                <span>${a(t.label)}${t.bonus?`<em>${a(t.bonus)}</em>`:""}</span>
                <strong>${a(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-power-row">
        <button class="character-detail-cube${L.level>0?" has-cube-icon":""}" type="button" data-detail-cube-trigger>
          ${R(L)}
        </button>
        <button class="character-detail-collectible ${h.rarity==="SR"?"is-sr":"is-r"}" type="button" data-collectible-trigger>
          <img src="${a(h.icon)}" alt="" aria-hidden="true" loading="lazy" />
          <span>${a(h.name)}</span>
          <strong class="${h.rarity==="SR"?"is-sr":"is-r"}">${a(`Lv.${h.level}`)}</strong>
        </button>
        <button class="character-detail-bond" type="button" data-bond-level-trigger>
          <span>${a(i("\u597D\u611F","Bond"))}</span>
          <strong>${a(`Lv.${N}`)}</strong>
        </button>
      </section>
      <section class="character-detail-skill-row" aria-label="${a(i("\u6280\u80FD\u7B49\u7EA7","Skill levels"))}">
        <label>
          <span>${a(i("1\u6280\u80FD","Skill 1"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(m.skill1)}" data-skill-level-input="skill1" />
        </label>
        <label>
          <span>${a(i("2\u6280\u80FD","Skill 2"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(m.skill2)}" data-skill-level-input="skill2" />
        </label>
        <label>
          <span>${a(i("\u7206\u88C2\u6280\u80FD","Burst skill"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(m.burst)}" data-skill-level-input="burst" />
        </label>
      </section>
      <section class="character-detail-equipment-grid">
        ${o.length?o.map(t=>`
              <article class="character-detail-equipment-card">
                <button class="character-detail-equipment-icon" type="button" data-equipment-level-trigger="${a(t.part)}" aria-label="${a(i(`\u8BBE\u7F6E${t.slot}\u7B49\u7EA7`,`Set ${t.slot} level`))}">
                  <img src="${a(t.icon)}" alt="${a(t.slot)}" loading="lazy" />
                  <small>LV.${a(t.level)}</small>
                </button>
                <div class="character-detail-affixes">
                  ${Array.from({length:3},(l,c)=>de(t.affixes,c)).map(l=>l?`
                          <div class="character-detail-affix${l.highlight?" is-highlight":""}${l.highlightLevel?` is-tier-${a(l.highlightLevel)}`:""}">
                            <span>${a(l.name)}</span>
                            <strong>${a(l.value)}</strong>
                            <em>${l.tier==="-"?"":`${a(l.tier)}${a(i("\u9636"," tier"))}`}</em>
                          </div>
                        `:`
                          <div class="character-detail-affix is-empty">${a(t.emptyText||i("\u672A\u83B7\u5F97\u6548\u679C","Effect not acquired"))}</div>
                        `).join("")}
                </div>
              </article>
              `).join(""):T}
      </section>
      <div class="character-detail-share-row">
        <button class="character-detail-share-button character-detail-favorite-button${p?" is-favorite":""}" type="button" data-character-detail-favorite>${a(p?i("\u53D6\u6D88\u6536\u85CF","Unfavorite"):i("\u52A0\u5165\u6536\u85CF","Add favorite"))}</button>
        <button class="character-detail-share-button" type="button" data-character-detail-share>${i("\u5206\u4EAB\u56FE\u7247","Share image")}</button>
        <button class="character-detail-share-button" type="button" data-character-equipment-upload>${i("\u4E0A\u4F20\u88C5\u5907\u56FE","Upload equipment")}</button>
        <input class="character-detail-equipment-upload-input" type="file" accept="image/*" data-character-equipment-file multiple hidden />
      </div>
    </div>
  `,n.querySelectorAll("[data-research-level-trigger]").forEach(t=>{t.addEventListener("click",ge)}),n.querySelector("[data-character-detail-close]")?.addEventListener("click",t=>{t.stopPropagation(),U()}),n.querySelector("[data-collectible-trigger]")?.addEventListener("click",()=>{pe(e,t=>{const l=n.querySelector("[data-collectible-trigger]"),c=n.querySelector("[data-collectible-trigger] strong");l?.classList.toggle("is-sr",t.rarity==="SR"),l?.classList.toggle("is-r",t.rarity!=="SR"),c&&(c.className=t.rarity==="SR"?"is-sr":"is-r",c.innerHTML=`${a(`Lv.${t.level}`)}`),d(n,e)})}),n.querySelector("[data-detail-cube-trigger]")?.addEventListener("click",()=>{he(e,t=>{const l=n.querySelector("[data-detail-cube-trigger]");l&&(l.classList.toggle("has-cube-icon",t.level>0),l.innerHTML=R(t)),d(n,e)})}),n.querySelector("[data-bond-level-trigger]")?.addEventListener("click",()=>{ve(e,t=>{const l=n.querySelector("[data-bond-level-trigger] strong");l&&(l.textContent=`Lv.${t}`),d(n,e)})}),n.querySelector("[data-character-level-trigger]")?.addEventListener("click",()=>{be(t=>{const l=n.querySelector("[data-character-level-trigger]"),c=l?.querySelector("strong");c&&(c.textContent=String(t)),l?.setAttribute("aria-label",i(`\u8BBE\u7F6E\u7B49\u7EA7 ${t}`,`Set level ${t}`)),d(n,e)})}),n.querySelector("[data-breakthrough-core-trigger]")?.addEventListener("click",()=>{Ce(e,t=>{const l=n.querySelector("[data-breakthrough-core-trigger]");l&&(l.innerHTML=P(t)),d(n,e)})}),n.querySelector("[data-character-detail-login]")?.addEventListener("click",t=>{t.stopPropagation(),U(),fe("login")}),n.querySelectorAll("[data-skill-level-input]").forEach(t=>{we(t,()=>{const l=I(e);l[t.dataset.skillLevelInput]=me(t.value),ye(e,l),t.value=String(l[t.dataset.skillLevelInput]),d(n,e)})}),n.querySelectorAll("[data-equipment-level-trigger]").forEach(t=>{t.addEventListener("click",()=>{const l=o.find(c=>c.part===t.dataset.equipmentLevelTrigger);l&&$e(e,l,c=>{const D=t.querySelector("small");D&&(D.textContent=`LV.${c}`),d(n,e)})})}),n.querySelector("[data-character-detail-share]")?.addEventListener("click",()=>Se(e)),n.querySelector("[data-character-detail-favorite]")?.addEventListener("click",t=>{const l=t.currentTarget,c=qe(e);l.classList.toggle("is-favorite",c),l.textContent=c?i("\u53D6\u6D88\u6536\u85CF","Unfavorite"):i("\u52A0\u5165\u6536\u85CF","Add favorite"),Le()});const v=n.querySelector("[data-character-equipment-file]");return n.querySelector("[data-character-equipment-upload]")?.addEventListener("click",async()=>{await x()&&ke(e,v)}),v?.addEventListener("change",async()=>{if(!document.querySelector(".character-equipment-upload-backdrop")){if(!await x()){v&&(v.value="");return}De(e,v)}}),H(e),n}export{K as renderCharacterDetailPanel,X as setCharacterDetailPanelApi};
