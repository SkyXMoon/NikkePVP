import{calculateCharacterDetailCombatPower as A,getCharacterBaseStatItems as M,getCharacterWeaponStatItems as Z,setCharacterDetailPowerActiveCharacter as ee,setCharacterDetailStatsApi as te}from"./character-detail-stats.js";let f={};function ae(e={}){f=e||{},te({...e,renderCharacterDetailPanel:x})}function r(e){const o=f[e];if(typeof o!="function")throw new Error(`Missing character detail panel API: ${e}`);return o}function re(){return f.state||{}}function S(...e){return r("getCharacterEquipmentDetail")(...e)}function n(...e){return r("escapeHtml")(...e)}function c(...e){return r("localize")(...e)}function ne(...e){return r("isFavoriteCharacter")(...e)}function B(...e){return r("getCharacterDetailLevel")(...e)}function ie(...e){return r("getCharacterClassResearchKey")(...e)}function le(...e){return r("getCharacterCompanyResearchKey")(...e)}function R(...e){return r("getCharacterDetailCube")(...e)}function T(...e){return r("getCharacterCollectibleDetail")(...e)}function U(...e){return r("getCharacterBondLevel")(...e)}function H(...e){return r("getCharacterSkillLevels")(...e)}function K(...e){return r("getCharacterBreakthroughCoreDetail")(...e)}function oe(...e){return r("getCharacterDetailPortraitUrl")(...e)}function ce(...e){return r("getCharacterDetailPanel")(...e)}function N(...e){return r("getCharacterDisplayName")(...e)}function se(...e){return r("getRarityIconPath")(...e)}function _(...e){return r("getCharacterBreakthroughStarsMarkup")(...e)}function q(...e){return r("getCharacterDetailIconChip")(...e)}function ue(...e){return r("getDetailElementIcon")(...e)}function de(...e){return r("getDetailWeaponIcon")(...e)}function z(...e){return r("getCharacterDetailResearchChip")(...e)}function ge(...e){return r("getDetailClassIcon")(...e)}function V(...e){return r("getResearchLevel")(...e)}function pe(...e){return r("getDetailCompanyIcon")(...e)}function he(...e){return r("getDetailBurstIcon")(...e)}function F(...e){return r("getCharacterDetailCubeButtonContent")(...e)}function ve(...e){return r("getEquipmentAffixAt")(...e)}function fe(...e){return r("openResearchLevelModal")(...e)}function O(...e){return r("closeCharacterDetailPanel")(...e)}function be(...e){return r("openCollectibleModal")(...e)}function ye(...e){return r("openDetailCubeModal")(...e)}function Ce(...e){return r("openBondLevelModal")(...e)}function me(...e){return r("openCharacterLevelModal")(...e)}function $e(...e){return r("openBreakthroughCoreModal")(...e)}function ke(...e){return r("openAccountModal")(...e)}function Le(...e){return r("sanitizeCharacterSkillLevel")(...e)}function Se(...e){return r("saveCharacterSkillLevels")(...e)}function qe(...e){return r("openEquipmentLevelModal")(...e)}function v(...e){return r("markCharacterDetailPanelDirty")(...e)}function De(...e){return r("shareCharacterDetailImage")(...e)}function Ee(...e){return r("toggleFavoriteCharacter")(...e)}function we(...e){return r("renderCharacters")(...e)}function Pe(...e){return r("openCharacterEquipmentUploadModal")(...e)}function Ie(...e){return r("uploadCharacterEquipmentImage")(...e)}function j(...e){return r("scheduleCharacterDetailExportPreload")(...e)}async function W(...e){const o=f.ensureExternalEquipmentApiKeyBeforeUpload;return typeof o=="function"?o(...e):!0}function Ae(...e){const o=f.canEditThirdPartyCharacterData;return typeof o=="function"?!!o(...e):!0}function Me(...e){const o=f.showThirdPartyReadOnlyNotice;typeof o=="function"&&o(...e)}function Be(e,o){const d=S(o);M(o,d).forEach(s=>{const p=e.querySelector(`[data-detail-base-stat="${s.key}"] strong`);p&&(p.textContent=s.value)})}function C(e,o){const d=S(o),s=A(o,d),p=e.querySelector(".character-detail-combat-power"),g=p?.querySelector("strong");g&&(g.textContent=String(s)),p?.setAttribute("aria-label",c(`\u6218\u6597\u529B ${s}`,`Combat power ${s}`)),Be(e,o),j(o)}function Re(e,o){if(!e)return;e.dataset.lastCommittedValue=e.value||"";const d=()=>{const s=e.value||"";e.dataset.lastCommittedValue!==s&&(o(),e.dataset.lastCommittedValue=e.value||"")};e.addEventListener("change",d),e.addEventListener("blur",d),e.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),d(),e.blur())})}function x(e){const o=S(e),d=String(e?.rarity||"SSR").trim().toLowerCase(),s=["r","sr","ssr"].includes(d)?`is-rarity-${d}`:"is-rarity-ssr",p=!!re().authSession?.accessToken,g=!Ae(),h=g?' data-third-party-read-only aria-disabled="true"':"",m=g?' data-third-party-read-only readonly aria-readonly="true"':"",D=ne(e),X=p?`<p class="character-detail-equipment-empty">${n(c("\u672A\u540C\u6B65\u88C5\u5907\u6570\u636E","Equipment data not synced"))}</p>`:`<div class="character-detail-equipment-empty character-detail-equipment-login-empty">
        <span>${n(c("\u767B\u5F55\u540E\u53EF\u540C\u6B65\u88C5\u5907\u6570\u636E","Sign in to sync equipment data"))}</span>
        <button class="character-detail-login-button" type="button" data-character-detail-login>${n(c("\u767B\u5F55","Sign in"))}</button>
      </div>`,G=M(e,o),J=Z(e,o);ee(e);const $=A(e,o),k=B(),E=ie(e),w=le(e),P=R(e),b=T(e),Q=U(e),L=H(e),Y=K(e),I=oe(e),i=ce();i.__researchPowerHandler&&document.removeEventListener("nikke:character-detail-refresh",i.__researchPowerHandler),i.__researchPowerHandler=()=>{i.classList.contains("show")&&C(i,e)},document.addEventListener("nikke:character-detail-refresh",i.__researchPowerHandler),i.classList.remove("is-rarity-r","is-rarity-sr","is-rarity-ssr"),i.classList.add(s),i.classList.toggle("is-third-party-read-only",g),i.setAttribute("aria-label",e.name||N(e)),i.innerHTML=`
    <div class="character-detail-portrait" style="${I?`background-image: url('${n(I)}');`:""}"></div>
    <div class="character-detail-scrim"></div>
    <div class="character-detail-content">
      <header class="character-detail-header">
        <div class="character-detail-title-block">
          <div class="character-detail-name-row">
            <strong><img src="${n(se(e))}" alt="${n(e.rarity||"SSR")}" loading="lazy" />${n(e.name||N(e))}</strong>
            <button class="character-detail-breakthrough-stars" type="button" data-breakthrough-core-trigger aria-label="${n(c("\u8BBE\u7F6E\u7A81\u7834\u4E0E\u6838\u5FC3\u5F3A\u5316","Set breakthrough and core enhancement"))}"${h}>${_(Y)}</button>
          </div>
        </div>
        <button class="character-detail-close" type="button" data-character-detail-close aria-label="${n(c("\u5173\u95ED\u8BE6\u60C5","Close details"))}">X</button>
        <button class="character-detail-level" type="button" data-character-level-trigger aria-label="${n(c(`\u8BBE\u7F6E\u7B49\u7EA7 ${k}`,`Set level ${k}`))}"${h}>
          <span>LV.</span><strong>${n(k)}</strong>
        </button>
      </header>
      <div class="character-detail-icons">
        <div class="character-detail-icon-list">
          ${q(ue(e),e.element||"-","is-plain")}
          ${q(de(e),e.weapon||"-")}
          ${z(ge(e),e.classType||"-",E,V(E),g)}
          ${z(pe(e),e.company||"-",w,V(w),g)}
          ${q(he(e),e.burstStage||"-","is-plain")}
        </div>
        <div class="character-detail-combat-power" aria-label="${n(c(`\u6218\u6597\u529B ${$}`,`Combat power ${$}`))}">
          <span>${n(c("\u6218\u6597\u529B","Power"))}</span>
          <strong>${n(String($))}</strong>
        </div>
      </div>
      <section class="character-detail-base-stat-grid">
        ${G.map(t=>`
              <div class="character-detail-stat is-base-stat" data-detail-base-stat="${n(t.key)}">
                <span>${n(t.label)}</span>
                <strong>${n(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-weapon-stat-grid">
        ${J.map(t=>`
              <div class="character-detail-stat">
                <span>${n(t.label)}${t.bonus?`<em>${n(t.bonus)}</em>`:""}</span>
                <strong>${n(t.value)}</strong>
              </div>
            `).join("")}
      </section>
      <section class="character-detail-power-row">
        <button class="character-detail-cube${P.level>0?" has-cube-icon":""}" type="button" data-detail-cube-trigger${h}>
          ${F(P)}
        </button>
        <button class="character-detail-collectible ${b.rarity==="SR"?"is-sr":"is-r"}" type="button" data-collectible-trigger${h}>
          <img src="${n(b.icon)}" alt="" aria-hidden="true" loading="lazy" />
          <span>${n(b.name)}</span>
          <strong class="${b.rarity==="SR"?"is-sr":"is-r"}">${n(`Lv.${b.level}`)}</strong>
        </button>
        
      </section>
      <section class="character-detail-skill-row" aria-label="${n(c("\u6280\u80FD\u7B49\u7EA7","Skill levels"))}">
        <label>
          <span>${n(c("1\u6280\u80FD","Skill 1"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n(L.skill1)}" data-skill-level-input="skill1"${m} />
        </label>
        <label>
          <span>${n(c("2\u6280\u80FD","Skill 2"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n(L.skill2)}" data-skill-level-input="skill2"${m} />
        </label>
        <label>
          <span>${n(c("\u7206\u88C2\u6280\u80FD","Burst skill"))}</span>
          <input type="number" min="1" max="10" step="1" value="${n(L.burst)}" data-skill-level-input="burst"${m} />
        </label>
        <button class="character-detail-bond" type="button" data-bond-level-trigger${h}>
          <span>${n(c("\u597D\u611F","Bond"))}</span>
          <strong>${n(`Lv.${Q}`)}</strong>
        </button>
      </section>
      <section class="character-detail-equipment-grid">
        ${o.length?o.map(t=>`
              <article class="character-detail-equipment-card">
                <button class="character-detail-equipment-icon" type="button" data-equipment-level-trigger="${n(t.part)}" aria-label="${n(c(`\u8BBE\u7F6E${t.slot}\u7B49\u7EA7`,`Set ${t.slot} level`))}"${h}>
                  <img src="${n(t.icon)}" alt="${n(t.slot)}" loading="lazy" />
                  <small>LV.${n(t.level)}</small>
                </button>
                <div class="character-detail-affixes">
                  ${Array.from({length:3},(a,l)=>ve(t.affixes,l)).map(a=>a?`
                          <div class="character-detail-affix${a.highlight?" is-highlight":""}${a.highlightLevel?` is-tier-${n(a.highlightLevel)}`:""}">
                            <span>${n(a.name)}</span>
                            <strong>${n(a.value)}</strong>
                            <em>${a.tier==="-"?"":`${n(a.tier)}${n(c("\u9636"," tier"))}`}</em>
                          </div>
                        `:`
                          <div class="character-detail-affix is-empty">${n(t.emptyText||c("\u672A\u83B7\u5F97\u6548\u679C","Effect not acquired"))}</div>
                        `).join("")}
                </div>
              </article>
              `).join(""):X}
      </section>
      <div class="character-detail-share-row">
        <button class="character-detail-share-button character-detail-favorite-button${D?" is-favorite":""}" type="button" data-character-detail-favorite>${n(D?c("\u53D6\u6D88\u6536\u85CF","Unfavorite"):c("\u52A0\u5165\u6536\u85CF","Add favorite"))}</button>
        <button class="character-detail-share-button" type="button" data-character-detail-share>${c("\u5206\u4EAB\u56FE\u7247","Share image")}</button>
        <button class="character-detail-share-button" type="button" data-character-equipment-upload${h}>${c("\u4E0A\u4F20\u88C5\u5907\u56FE","Upload equipment")}</button>
        <input class="character-detail-equipment-upload-input" type="file" accept="image/*" data-character-equipment-file multiple hidden />
      </div>
    </div>
  `,g&&i.querySelectorAll("[data-third-party-read-only]").forEach(t=>{const a=l=>{l.type==="keydown"&&["Tab","Shift","Control","Alt","Meta"].includes(l.key)||(l.preventDefault(),l.stopImmediatePropagation(),Me())};t.addEventListener("click",a,!0),t.matches("input")&&(t.addEventListener("keydown",a,!0),t.addEventListener("beforeinput",a,!0),t.addEventListener("paste",a,!0),t.addEventListener("drop",a,!0))}),i.querySelectorAll("[data-research-level-trigger]").forEach(t=>{t.addEventListener("click",fe)}),i.querySelector("[data-character-detail-close]")?.addEventListener("click",t=>{t.stopPropagation(),O()}),i.querySelector("[data-collectible-trigger]")?.addEventListener("click",()=>{const t=T(e);be(e,a=>{const l=i.querySelector("[data-collectible-trigger]"),u=i.querySelector("[data-collectible-trigger] strong");l?.classList.toggle("is-sr",a.rarity==="SR"),l?.classList.toggle("is-r",a.rarity!=="SR"),u&&(u.className=a.rarity==="SR"?"is-sr":"is-r",u.innerHTML=`${n(`Lv.${a.level}`)}`),(t?.rarity!==a.rarity||t?.level!==a.level)&&v()})}),i.querySelector("[data-detail-cube-trigger]")?.addEventListener("click",()=>{const t=R(e);ye(e,a=>{const l=i.querySelector("[data-detail-cube-trigger]");l&&(l.classList.toggle("has-cube-icon",a.level>0),l.innerHTML=F(a)),(t?.level!==a.level||t?.rarity!==a.rarity)&&v()})}),i.querySelector("[data-bond-level-trigger]")?.addEventListener("click",()=>{const t=U(e);Ce(e,a=>{const l=i.querySelector("[data-bond-level-trigger] strong");l&&(l.textContent=`Lv.${a}`),t!==a&&v(),C(i,e)})}),i.querySelector("[data-character-level-trigger]")?.addEventListener("click",()=>{const t=B();me(a=>{const l=i.querySelector("[data-character-level-trigger]"),u=l?.querySelector("strong");u&&(u.textContent=String(a)),t!==a&&v(),l?.setAttribute("aria-label",c(`\u8BBE\u7F6E\u7B49\u7EA7 ${a}`,`Set level ${a}`)),C(i,e)})}),i.querySelector("[data-breakthrough-core-trigger]")?.addEventListener("click",()=>{const t=K(e);$e(e,a=>{const l=i.querySelector("[data-breakthrough-core-trigger]");l&&(l.innerHTML=_(a)),(t?.breakthroughCount!==a?.breakthroughCount||t?.coreEnhanceLevel!==a?.coreEnhanceLevel)&&v(),C(i,e)})}),i.querySelector("[data-character-detail-login]")?.addEventListener("click",t=>{t.stopPropagation(),O(),ke("login")}),i.querySelectorAll("[data-skill-level-input]").forEach(t=>{Re(t,()=>{const a=H(e),l=t.dataset.skillLevelInput,u=Le(t.value);a[l]!==u&&(a[l]=u,Se(e,a),v()),t.value=String(a[t.dataset.skillLevelInput]),C(i,e)})}),i.querySelectorAll("[data-equipment-level-trigger]").forEach(t=>{t.addEventListener("click",()=>{const a=o.find(l=>l.part===t.dataset.equipmentLevelTrigger);a&&qe(e,a,l=>{const u=t.querySelector("small");u&&(u.textContent=`LV.${l}`),a.level!==l&&v()})})}),i.querySelector("[data-character-detail-share]")?.addEventListener("click",()=>De(e)),i.querySelector("[data-character-detail-favorite]")?.addEventListener("click",t=>{const a=t.currentTarget,l=Ee(e);a.classList.toggle("is-favorite",l),a.textContent=l?c("\u53D6\u6D88\u6536\u85CF","Unfavorite"):c("\u52A0\u5165\u6536\u85CF","Add favorite"),we()});const y=i.querySelector("[data-character-equipment-file]");return i.querySelector("[data-character-equipment-upload]")?.addEventListener("click",async()=>{await W()&&Pe(e,y)}),y?.addEventListener("change",async()=>{if(!document.querySelector(".character-equipment-upload-backdrop")){if(!await W()){y&&(y.value="");return}Ie(e,y)}}),j(e),i}export{x as renderCharacterDetailPanel,ae as setCharacterDetailPanelApi};
