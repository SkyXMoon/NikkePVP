import{calculateCharacterDetailCombatPower as w,getCharacterBaseStatItems as P,getCharacterWeaponStatItems as O,setCharacterDetailPowerActiveCharacter as Q,setCharacterDetailStatsApi as Y}from"./character-detail-stats.js";let C={};function Z(e={}){C=e||{},Y({...e,renderCharacterDetailPanel:j})}function r(e){const c=C[e];if(typeof c!="function")throw new Error(`Missing character detail panel API: ${e}`);return c}function ee(){return C.state||{}}function S(...e){return r("getCharacterEquipmentDetail")(...e)}function n(...e){return r("escapeHtml")(...e)}function o(...e){return r("localize")(...e)}function te(...e){return r("isFavoriteCharacter")(...e)}function I(...e){return r("getCharacterDetailLevel")(...e)}function ae(...e){return r("getCharacterClassResearchKey")(...e)}function re(...e){return r("getCharacterCompanyResearchKey")(...e)}function M(...e){return r("getCharacterDetailCube")(...e)}function A(...e){return r("getCharacterCollectibleDetail")(...e)}function B(...e){return r("getCharacterBondLevel")(...e)}function R(...e){return r("getCharacterSkillLevels")(...e)}function U(...e){return r("getCharacterBreakthroughCoreDetail")(...e)}function ne(...e){return r("getCharacterDetailPortraitUrl")(...e)}function le(...e){return r("getCharacterDetailPanel")(...e)}function H(...e){return r("getCharacterDisplayName")(...e)}function ie(...e){return r("getRarityIconPath")(...e)}function K(...e){return r("getCharacterBreakthroughStarsMarkup")(...e)}function k(...e){return r("getCharacterDetailIconChip")(...e)}function oe(...e){return r("getDetailElementIcon")(...e)}function ce(...e){return r("getDetailWeaponIcon")(...e)}function T(...e){return r("getCharacterDetailResearchChip")(...e)}function se(...e){return r("getDetailClassIcon")(...e)}function _(...e){return r("getResearchLevel")(...e)}function ue(...e){return r("getDetailCompanyIcon")(...e)}function de(...e){return r("getDetailBurstIcon")(...e)}function z(...e){return r("getCharacterDetailCubeButtonContent")(...e)}function ge(...e){return r("getEquipmentAffixAt")(...e)}function pe(...e){return r("openResearchLevelModal")(...e)}function N(...e){return r("closeCharacterDetailPanel")(...e)}function he(...e){return r("openCollectibleModal")(...e)}function ve(...e){return r("openDetailCubeModal")(...e)}function be(...e){return r("openBondLevelModal")(...e)}function fe(...e){return r("openCharacterLevelModal")(...e)}function Ce(...e){return r("openBreakthroughCoreModal")(...e)}function me(...e){return r("openAccountModal")(...e)}function ye(...e){return r("sanitizeCharacterSkillLevel")(...e)}function $e(...e){return r("saveCharacterSkillLevels")(...e)}function Se(...e){return r("openEquipmentLevelModal")(...e)}function p(...e){return r("markCharacterDetailPanelDirty")(...e)}function ke(...e){return r("shareCharacterDetailImage")(...e)}function Le(...e){return r("toggleFavoriteCharacter")(...e)}function qe(...e){return r("renderCharacters")(...e)}function De(...e){return r("openCharacterEquipmentUploadModal")(...e)}function Ee(...e){return r("uploadCharacterEquipmentImage")(...e)}function V(...e){return r("scheduleCharacterDetailExportPreload")(...e)}async function F(...e){const c=C.ensureExternalEquipmentApiKeyBeforeUpload;return typeof c=="function"?c(...e):!0}function we(e,c){const d=S(c);P(c,d).forEach(s=>{const g=e.querySelector(`[data-detail-base-stat="${s.key}"] strong`);g&&(g.textContent=s.value)})}function f(e,c){const d=S(c),s=w(c,d),g=e.querySelector(".character-detail-combat-power"),h=g?.querySelector("strong");h&&(h.textContent=String(s)),g?.setAttribute("aria-label",o(`\u6218\u6597\u529B ${s}`,`Combat power ${s}`)),we(e,c),V(c)}function Pe(e,c){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const d=()=>{const s=e.value||"";e.dataset.lastCommittedValue!==s&&(c(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",d),e.addEventListener("blur",d),e.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),d(),e.blur())})}function j(e){const c=S(e),d=String(e?.rarity||"SSR").trim().toLowerCase(),s=["r","sr","ssr"].includes(d)?`is-rarity-${d}`:"is-rarity-ssr",g=!!ee().authSession?.accessToken,h=te(e),W=g?`<p class="character-detail-equipment-empty">${n(o("\u672A\u540C\u6B65\u88C5\u5907\u6570\u636E","Equipment data not synced"))}</p>`:`<div class="character-detail-equipment-empty character-detail-equipment-login-empty">
        <span>${n(o("\u767B\u5F55\u540E\u53EF\u540C\u6B65\u88C5\u5907\u6570\u636E","Sign in to sync equipment data"))}</span>
        <button class="character-detail-login-button" type="button" data-character-detail-login>${n(o("\u767B\u5F55","Sign in"))}</button>
      </div>`,x=P(e,c),X=O(e,c);Q(e);const m=w(e,c),y=I(),L=ae(e),q=re(e),D=M(e),v=A(e),G=B(e),$=R(e),J=U(e),E=ne(e),l=le();l.__researchPowerHandler&&document.removeEventListener("nikke:character-detail-refresh",l.__researchPowerHandler),l.__researchPowerHandler=()=>{l.classList.contains("show")&&f(l,e)},document.addEventListener("nikke:character-detail-refresh",l.__researchPowerHandler),l.classList.remove("is-rarity-r","is-rarity-sr","is-rarity-ssr"),l.classList.add(s),l.setAttribute("aria-label",e.name||H(e)),l.innerHTML=`
    <div class="character-detail-portrait" style="${E?`background-image: url('${n(E)}');`:""}"></div>
    <div class="character-detail-scrim"></div>
    <div class="character-detail-content">
      <header class="character-detail-header">
        <div class="character-detail-title-block">
          <div class="character-detail-name-row">
            <strong><img src="${n(ie(e))}" alt="${n(e.rarity||"SSR")}" loading="lazy" />${n(e.name||H(e))}</strong>
            <button class="character-detail-breakthrough-stars" type="button" data-breakthrough-core-trigger aria-label="${n(o("\u8BBE\u7F6E\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Set breakthrough and core enhancement"))}">${K(J)}</button>
          </div>
        </div>
        <button class="character-detail-close" type="button" data-character-detail-close aria-label="${n(o("\u5173\u95ED\u8BE6\u60C5","Close details"))}">X</button>
        <button class="character-detail-level" type="button" data-character-level-trigger aria-label="${n(o(`\u8BBE\u7F6E\u7B49\u7EA7 ${y}`,`Set level ${y}`))}">
          <span>LV.</span><strong>${n(y)}</strong>
        </button>
      </header>
      <div class="character-detail-icons">
        <div class="character-detail-icon-list">
          ${k(oe(e),e.element||"-","is-plain")}
          ${k(ce(e),e.weapon||"-")}
          ${T(se(e),e.classType||"-",L,_(L))}
          ${T(ue(e),e.company||"-",q,_(q))}
          ${k(de(e),e.burstStage||"-","is-plain")}
        </div>
        <div class="character-detail-combat-power" aria-label="${n(o(`\u6218\u6597\u529B ${m}`,`Combat power ${m}`))}">
          <span>${n(o("\u6218\u6597\u529B","Power"))}</span>
          <strong>${n(String(m))}</strong>
        </div>
      </div>
      <section class="character-detail-base-stat-grid">
        ${x.map(t=>`
              <div class="character-detail-stat is-base-stat" data-detail-base-stat="${n(t.key)}">
                <span>${n(t.label)}</span>
                <strong>${n(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-weapon-stat-grid">
        ${X.map(t=>`
              <div class="character-detail-stat">
                <span>${n(t.label)}${t.bonus?`<em>${n(t.bonus)}</em>`:""}</span>
                <strong>${n(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-power-row">
        <button class="character-detail-cube${D.level>0?" has-cube-icon":""}" type="button" data-detail-cube-trigger>
          ${z(D)}
        </button>
        <button class="character-detail-collectible ${v.rarity==="SR"?"is-sr":"is-r"}" type="button" data-collectible-trigger>
          <img src="${n(v.icon)}" alt="" aria-hidden="true" loading="lazy" />
          <span>${n(v.name)}</span>
          <strong class="${v.rarity==="SR"?"is-sr":"is-r"}">${n(`Lv.${v.level}`)}</strong>
        </button>
        
      </section>
      <section class="character-detail-skill-row" aria-label="${n(o("\u6280\u80FD\u7B49\u7EA7","Skill levels"))}">
        <label>
          <span>${n(o("1\u6280\u80FD","Skill 1"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n($.skill1)}" data-skill-level-input="skill1" />
        </label>
        <label>
          <span>${n(o("2\u6280\u80FD","Skill 2"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n($.skill2)}" data-skill-level-input="skill2" />
        </label>
        <label>
          <span>${n(o("\u7206\u88C2\u6280\u80FD","Burst skill"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n($.burst)}" data-skill-level-input="burst" />
        </label>
        <button class="character-detail-bond" type="button" data-bond-level-trigger>
          <span>${n(o("\u597D\u611F","Bond"))}</span>
          <strong>${n(`Lv.${G}`)}</strong>
        </button>
      </section>
      <section class="character-detail-equipment-grid">
        ${c.length?c.map(t=>`
              <article class="character-detail-equipment-card">
                <button class="character-detail-equipment-icon" type="button" data-equipment-level-trigger="${n(t.part)}" aria-label="${n(o(`\u8BBE\u7F6E${t.slot}\u7B49\u7EA7`,`Set ${t.slot} level`))}">
                  <img src="${n(t.icon)}" alt="${n(t.slot)}" loading="lazy" />
                  <small>LV.${n(t.level)}</small>
                </button>
                <div class="character-detail-affixes">
                  ${Array.from({length:3},(a,i)=>ge(t.affixes,i)).map(a=>a?`
                          <div class="character-detail-affix${a.highlight?" is-highlight":""}${a.highlightLevel?` is-tier-${n(a.highlightLevel)}`:""}">
                            <span>${n(a.name)}</span>
                            <strong>${n(a.value)}</strong>
                            <em>${a.tier==="-"?"":`${n(a.tier)}${n(o("\u9636"," tier"))}`}</em>
                          </div>
                        `:`
                          <div class="character-detail-affix is-empty">${n(t.emptyText||o("\u672A\u83B7\u5F97\u6548\u679C","Effect not acquired"))}</div>
                        `).join("")}
                </div>
              </article>
              `).join(""):W}
      </section>
      <div class="character-detail-share-row">
        <button class="character-detail-share-button character-detail-favorite-button${h?" is-favorite":""}" type="button" data-character-detail-favorite>${n(h?o("\u53D6\u6D88\u6536\u85CF","Unfavorite"):o("\u52A0\u5165\u6536\u85CF","Add favorite"))}</button>
        <button class="character-detail-share-button" type="button" data-character-detail-share>${o("\u5206\u4EAB\u56FE\u7247","Share image")}</button>
        <button class="character-detail-share-button" type="button" data-character-equipment-upload>${o("\u4E0A\u4F20\u88C5\u5907\u56FE","Upload equipment")}</button>
        <input class="character-detail-equipment-upload-input" type="file" accept="image/*" data-character-equipment-file multiple hidden />
      </div>
    </div>
  `,l.querySelectorAll("[data-research-level-trigger]").forEach(t=>{t.addEventListener("click",pe)}),l.querySelector("[data-character-detail-close]")?.addEventListener("click",t=>{t.stopPropagation(),N()}),l.querySelector("[data-collectible-trigger]")?.addEventListener("click",()=>{const t=A(e);he(e,a=>{const i=l.querySelector("[data-collectible-trigger]"),u=l.querySelector("[data-collectible-trigger] strong");i?.classList.toggle("is-sr",a.rarity==="SR"),i?.classList.toggle("is-r",a.rarity!=="SR"),u&&(u.className=a.rarity==="SR"?"is-sr":"is-r",u.innerHTML=`${n(`Lv.${a.level}`)}`),(t?.rarity!==a.rarity||t?.level!==a.level)&&p()})}),l.querySelector("[data-detail-cube-trigger]")?.addEventListener("click",()=>{const t=M(e);ve(e,a=>{const i=l.querySelector("[data-detail-cube-trigger]");i&&(i.classList.toggle("has-cube-icon",a.level>0),i.innerHTML=z(a)),(t?.level!==a.level||t?.rarity!==a.rarity)&&p()})}),l.querySelector("[data-bond-level-trigger]")?.addEventListener("click",()=>{const t=B(e);be(e,a=>{const i=l.querySelector("[data-bond-level-trigger] strong");i&&(i.textContent=`Lv.${a}`),t!==a&&p(),f(l,e)})}),l.querySelector("[data-character-level-trigger]")?.addEventListener("click",()=>{const t=I();fe(a=>{const i=l.querySelector("[data-character-level-trigger]"),u=i?.querySelector("strong");u&&(u.textContent=String(a)),t!==a&&p(),i?.setAttribute("aria-label",o(`\u8BBE\u7F6E\u7B49\u7EA7 ${a}`,`Set level ${a}`)),f(l,e)})}),l.querySelector("[data-breakthrough-core-trigger]")?.addEventListener("click",()=>{const t=U(e);Ce(e,a=>{const i=l.querySelector("[data-breakthrough-core-trigger]");i&&(i.innerHTML=K(a)),(t?.breakthroughCount!==a?.breakthroughCount||t?.coreEnhanceLevel!==a?.coreEnhanceLevel)&&p(),f(l,e)})}),l.querySelector("[data-character-detail-login]")?.addEventListener("click",t=>{t.stopPropagation(),N(),me("login")}),l.querySelectorAll("[data-skill-level-input]").forEach(t=>{Pe(t,()=>{const a=R(e),i=t.dataset.skillLevelInput,u=ye(t.value);a[i]!==u&&(a[i]=u,$e(e,a),p()),t.value=String(a[t.dataset.skillLevelInput]),f(l,e)})}),l.querySelectorAll("[data-equipment-level-trigger]").forEach(t=>{t.addEventListener("click",()=>{const a=c.find(i=>i.part===t.dataset.equipmentLevelTrigger);a&&Se(e,a,i=>{const u=t.querySelector("small");u&&(u.textContent=`LV.${i}`),a.level!==i&&p()})})}),l.querySelector("[data-character-detail-share]")?.addEventListener("click",()=>ke(e)),l.querySelector("[data-character-detail-favorite]")?.addEventListener("click",t=>{const a=t.currentTarget,i=Le(e);a.classList.toggle("is-favorite",i),a.textContent=i?o("\u53D6\u6D88\u6536\u85CF","Unfavorite"):o("\u52A0\u5165\u6536\u85CF","Add favorite"),qe()});const b=l.querySelector("[data-character-equipment-file]");return l.querySelector("[data-character-equipment-upload]")?.addEventListener("click",async()=>{await F()&&De(e,b)}),b?.addEventListener("change",async()=>{if(!document.querySelector(".character-equipment-upload-backdrop")){if(!await F()){b&&(b.value="");return}Ee(e,b)}}),V(e),l}export{j as renderCharacterDetailPanel,Z as setCharacterDetailPanelApi};
