import{calculateCharacterDetailCombatPower as E,getCharacterBaseStatItems as w,getCharacterWeaponStatItems as V,setCharacterDetailPowerActiveCharacter as F,setCharacterDetailStatsApi as j}from"./character-detail-stats.js";let f={};function W(e={}){f=e||{},j({...e,renderCharacterDetailPanel:U})}function r(e){const o=f[e];if(typeof o!="function")throw new Error(`Missing character detail panel API: ${e}`);return o}function X(){return f.state||{}}function y(...e){return r("getCharacterEquipmentDetail")(...e)}function a(...e){return r("escapeHtml")(...e)}function i(...e){return r("localize")(...e)}function G(...e){return r("isFavoriteCharacter")(...e)}function J(...e){return r("getCharacterDetailLevel")(...e)}function O(...e){return r("getCharacterClassResearchKey")(...e)}function Q(...e){return r("getCharacterCompanyResearchKey")(...e)}function Y(...e){return r("getCharacterDetailCube")(...e)}function Z(...e){return r("getCharacterCollectibleDetail")(...e)}function ee(...e){return r("getCharacterBondLevel")(...e)}function I(...e){return r("getCharacterSkillLevels")(...e)}function te(...e){return r("getCharacterBreakthroughCoreDetail")(...e)}function ae(...e){return r("getCharacterDetailPortraitUrl")(...e)}function re(...e){return r("getCharacterDetailPanel")(...e)}function M(...e){return r("getCharacterDisplayName")(...e)}function ne(...e){return r("getRarityIconPath")(...e)}function P(...e){return r("getCharacterBreakthroughStarsMarkup")(...e)}function $(...e){return r("getCharacterDetailIconChip")(...e)}function le(...e){return r("getDetailElementIcon")(...e)}function ie(...e){return r("getDetailWeaponIcon")(...e)}function A(...e){return r("getCharacterDetailResearchChip")(...e)}function oe(...e){return r("getDetailClassIcon")(...e)}function R(...e){return r("getResearchLevel")(...e)}function ce(...e){return r("getDetailCompanyIcon")(...e)}function se(...e){return r("getDetailBurstIcon")(...e)}function B(...e){return r("getCharacterDetailCubeButtonContent")(...e)}function ue(...e){return r("getEquipmentAffixAt")(...e)}function de(...e){return r("openResearchLevelModal")(...e)}function H(...e){return r("closeCharacterDetailPanel")(...e)}function ge(...e){return r("openCollectibleModal")(...e)}function pe(...e){return r("openDetailCubeModal")(...e)}function he(...e){return r("openBondLevelModal")(...e)}function ve(...e){return r("openCharacterLevelModal")(...e)}function be(...e){return r("openBreakthroughCoreModal")(...e)}function Ce(...e){return r("openAccountModal")(...e)}function me(...e){return r("sanitizeCharacterSkillLevel")(...e)}function fe(...e){return r("saveCharacterSkillLevels")(...e)}function ye(...e){return r("openEquipmentLevelModal")(...e)}function $e(...e){return r("shareCharacterDetailImage")(...e)}function Se(...e){return r("toggleFavoriteCharacter")(...e)}function Le(...e){return r("renderCharacters")(...e)}function ke(...e){return r("openCharacterEquipmentUploadModal")(...e)}function qe(...e){return r("uploadCharacterEquipmentImage")(...e)}function T(...e){return r("scheduleCharacterDetailExportPreload")(...e)}function De(e,o){const u=y(o);w(o,u).forEach(s=>{const g=e.querySelector(`[data-detail-base-stat="${s.key}"] strong`);g&&(g.textContent=s.value)})}function d(e,o){const u=y(o),s=E(o,u),g=e.querySelector(".character-detail-combat-power"),p=g?.querySelector("strong");p&&(p.textContent=String(s)),g?.setAttribute("aria-label",i(`\u6218\u6597\u529B ${s}`,`Combat power ${s}`)),De(e,o),T(o)}function Ee(e,o){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const u=()=>{const s=e.value||"";e.dataset.lastCommittedValue!==s&&(o(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",u),e.addEventListener("blur",u),e.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),u(),e.blur())})}function U(e){const o=y(e),u=String(e?.rarity||"SSR").trim().toLowerCase(),s=["r","sr","ssr"].includes(u)?`is-rarity-${u}`:"is-rarity-ssr",g=!!X().authSession?.accessToken,p=G(e),_=g?`<p class="character-detail-equipment-empty">${a(i("\u672A\u540C\u6B65\u88C5\u5907\u6570\u636E","Equipment data not synced"))}</p>`:`<div class="character-detail-equipment-empty character-detail-equipment-login-empty">
        <span>${a(i("\u767B\u5F55\u540E\u53EF\u540C\u6B65\u88C5\u5907\u6570\u636E","Sign in to sync equipment data"))}</span>
        <button class="character-detail-login-button" type="button" data-character-detail-login>${a(i("\u767B\u5F55","Sign in"))}</button>
      </div>`,x=w(e,o),z=V(e,o);F(e);const v=E(e,o),b=J(),S=O(e),L=Q(e),k=Y(e),h=Z(e),K=ee(e),C=I(e),N=te(e),q=ae(e),n=re();n.__researchPowerHandler&&document.removeEventListener("nikke:research-level-change",n.__researchPowerHandler),n.__researchPowerHandler=()=>d(n,e),document.addEventListener("nikke:research-level-change",n.__researchPowerHandler),n.classList.remove("is-rarity-r","is-rarity-sr","is-rarity-ssr"),n.classList.add(s),n.setAttribute("aria-label",e.name||M(e)),n.innerHTML=`
    <div class="character-detail-portrait" style="${q?`background-image: url('${a(q)}');`:""}"></div>
    <div class="character-detail-scrim"></div>
    <div class="character-detail-content">
      <header class="character-detail-header">
        <div class="character-detail-title-block">
          <div class="character-detail-name-row">
            <strong><img src="${a(ne(e))}" alt="${a(e.rarity||"SSR")}" loading="lazy" />${a(e.name||M(e))}</strong>
            <button class="character-detail-breakthrough-stars" type="button" data-breakthrough-core-trigger aria-label="${a(i("\u8BBE\u7F6E\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Set breakthrough and core enhancement"))}">${P(N)}</button>
          </div>
        </div>
        <button class="character-detail-close" type="button" data-character-detail-close aria-label="${a(i("\u5173\u95ED\u8BE6\u60C5","Close details"))}">X</button>
        <button class="character-detail-level" type="button" data-character-level-trigger aria-label="${a(i(`\u8BBE\u7F6E\u7B49\u7EA7 ${b}`,`Set level ${b}`))}">
          <span>LV.</span><strong>${a(b)}</strong>
        </button>
      </header>
      <div class="character-detail-icons">
        <div class="character-detail-icon-list">
          ${$(le(e),e.element||"-","is-plain")}
          ${$(ie(e),e.weapon||"-")}
          ${A(oe(e),e.classType||"-",S,R(S))}
          ${A(ce(e),e.company||"-",L,R(L))}
          ${$(se(e),e.burstStage||"-","is-plain")}
        </div>
        <div class="character-detail-combat-power" aria-label="${a(i(`\u6218\u6597\u529B ${v}`,`Combat power ${v}`))}">
          <span>${a(i("\u6218\u6597\u529B","Power"))}</span>
          <strong>${a(String(v))}</strong>
        </div>
      </div>
      <section class="character-detail-base-stat-grid">
        ${x.map(t=>`
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
        <button class="character-detail-cube${k.level>0?" has-cube-icon":""}" type="button" data-detail-cube-trigger>
          ${B(k)}
        </button>
        <button class="character-detail-collectible ${h.rarity==="SR"?"is-sr":"is-r"}" type="button" data-collectible-trigger>
          <img src="${a(h.icon)}" alt="" aria-hidden="true" loading="lazy" />
          <span>${a(h.name)}</span>
          <strong class="${h.rarity==="SR"?"is-sr":"is-r"}">${a(`Lv.${h.level}`)}</strong>
        </button>
        <button class="character-detail-bond" type="button" data-bond-level-trigger>
          <span>${a(i("\u597D\u611F","Bond"))}</span>
          <strong>${a(`Lv.${K}`)}</strong>
        </button>
      </section>
      <section class="character-detail-skill-row" aria-label="${a(i("\u6280\u80FD\u7B49\u7EA7","Skill levels"))}">
        <label>
          <span>${a(i("1\u6280\u80FD","Skill 1"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(C.skill1)}" data-skill-level-input="skill1" />
        </label>
        <label>
          <span>${a(i("2\u6280\u80FD","Skill 2"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(C.skill2)}" data-skill-level-input="skill2" />
        </label>
        <label>
          <span>${a(i("\u7206\u88C2\u6280\u80FD","Burst skill"))}</span>
          <input type="number" min="1" max="10" step="1" value="${a(C.burst)}" data-skill-level-input="burst" />
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
                  ${Array.from({length:3},(l,c)=>ue(t.affixes,c)).map(l=>l?`
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
              `).join(""):_}
      </section>
      <div class="character-detail-share-row">
        <button class="character-detail-share-button character-detail-favorite-button${p?" is-favorite":""}" type="button" data-character-detail-favorite>${a(p?i("\u53D6\u6D88\u6536\u85CF","Unfavorite"):i("\u52A0\u5165\u6536\u85CF","Add favorite"))}</button>
        <button class="character-detail-share-button" type="button" data-character-detail-share>${i("\u5206\u4EAB\u56FE\u7247","Share image")}</button>
        <button class="character-detail-share-button" type="button" data-character-equipment-upload>${i("\u4E0A\u4F20\u88C5\u5907\u56FE","Upload equipment")}</button>
        <input class="character-detail-equipment-upload-input" type="file" accept="image/*" data-character-equipment-file multiple hidden />
      </div>
    </div>
  `,n.querySelectorAll("[data-research-level-trigger]").forEach(t=>{t.addEventListener("click",de)}),n.querySelector("[data-character-detail-close]")?.addEventListener("click",t=>{t.stopPropagation(),H()}),n.querySelector("[data-collectible-trigger]")?.addEventListener("click",()=>{ge(e,t=>{const l=n.querySelector("[data-collectible-trigger]"),c=n.querySelector("[data-collectible-trigger] strong");l?.classList.toggle("is-sr",t.rarity==="SR"),l?.classList.toggle("is-r",t.rarity!=="SR"),c&&(c.className=t.rarity==="SR"?"is-sr":"is-r",c.innerHTML=`${a(`Lv.${t.level}`)}`),d(n,e)})}),n.querySelector("[data-detail-cube-trigger]")?.addEventListener("click",()=>{pe(e,t=>{const l=n.querySelector("[data-detail-cube-trigger]");l&&(l.classList.toggle("has-cube-icon",t.level>0),l.innerHTML=B(t)),d(n,e)})}),n.querySelector("[data-bond-level-trigger]")?.addEventListener("click",()=>{he(e,t=>{const l=n.querySelector("[data-bond-level-trigger] strong");l&&(l.textContent=`Lv.${t}`),d(n,e)})}),n.querySelector("[data-character-level-trigger]")?.addEventListener("click",()=>{ve(t=>{const l=n.querySelector("[data-character-level-trigger]"),c=l?.querySelector("strong");c&&(c.textContent=String(t)),l?.setAttribute("aria-label",i(`\u8BBE\u7F6E\u7B49\u7EA7 ${t}`,`Set level ${t}`)),d(n,e)})}),n.querySelector("[data-breakthrough-core-trigger]")?.addEventListener("click",()=>{be(e,t=>{const l=n.querySelector("[data-breakthrough-core-trigger]");l&&(l.innerHTML=P(t)),d(n,e)})}),n.querySelector("[data-character-detail-login]")?.addEventListener("click",t=>{t.stopPropagation(),H(),Ce("login")}),n.querySelectorAll("[data-skill-level-input]").forEach(t=>{Ee(t,()=>{const l=I(e);l[t.dataset.skillLevelInput]=me(t.value),fe(e,l),t.value=String(l[t.dataset.skillLevelInput]),d(n,e)})}),n.querySelectorAll("[data-equipment-level-trigger]").forEach(t=>{t.addEventListener("click",()=>{const l=o.find(c=>c.part===t.dataset.equipmentLevelTrigger);l&&ye(e,l,c=>{const D=t.querySelector("small");D&&(D.textContent=`LV.${c}`),d(n,e)})})}),n.querySelector("[data-character-detail-share]")?.addEventListener("click",()=>$e(e)),n.querySelector("[data-character-detail-favorite]")?.addEventListener("click",t=>{const l=t.currentTarget,c=Se(e);l.classList.toggle("is-favorite",c),l.textContent=c?i("\u53D6\u6D88\u6536\u85CF","Unfavorite"):i("\u52A0\u5165\u6536\u85CF","Add favorite"),Le()});const m=n.querySelector("[data-character-equipment-file]");return n.querySelector("[data-character-equipment-upload]")?.addEventListener("click",()=>{ke(e,m)}),m?.addEventListener("change",()=>{document.querySelector(".character-equipment-upload-backdrop")||qe(e,m)}),T(e),n}export{U as renderCharacterDetailPanel,W as setCharacterDetailPanelApi};
