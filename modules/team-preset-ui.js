let b={},S={},E=5,f=null,g=null;function j(e={}){b=e||{},S=b.state||{},E=Number(b.teamSize||5)}function a(e,t=null){const n=b[e];return typeof n=="function"?n:t||(()=>{})}function P(){return a("getCurrentLanguageText",()=>({}))()}function l(e,t){return a("localize",(n,s)=>n||s||"")(e,t)}function r(e){return a("escapeHtml",t=>String(t??""))(e)}function J(e){return a("normalizeTeamPresetTeam",t=>t||{})(e)}function F(e){return a("normalizeTeamPresetRawSlot",()=>Array(E).fill(null))(e)}function N(e){return a("getCharacterById",()=>null)(e)}function X(e){return a("getTeamSlotRarityClass",()=>"")(e)}function Z(e){return a("normalizeTeamKey",t=>t==="attack"?"attack":"defense")(e)}function _(e){return a("sanitizeChargeSpeed",t=>Math.max(0,Math.min(100,Number(t)||0)))(e)}function G(e){return a("sanitizeUniversalCharge",t=>Math.max(0,Number(t)||0))(e)}function Q(e){return a("sanitizeCubeType",t=>String(t||"none"))(e)}function Y(e){return a("sanitizeMagazine",t=>Math.max(0,Number(t)||0))(e)}function V(e){return a("getCubeIconSrc",()=>"")(e)}function ee(...e){return a("getEffectiveLinkOwnerForTeam",()=>null)(...e)}function te(...e){return a("isEffectiveLinkEnabledForTeam",()=>!1)(...e)}function ae(...e){return a("getAutoFullTeamLinkOwner",()=>null)(...e)}function ne(...e){return a("getEffectiveLinkTargetIdsForTeam",()=>[])(...e)}function se(e){return a("isLinkProvider",()=>!1)(e)}function re(e){return a("isJackal",()=>!1)(e)}function ie(e){return a("isRedHood",()=>!1)(e)}function L(e){return a("isScarlet",()=>!1)(e)}function k(e){return a("isRosanna",()=>!1)(e)}function oe(e){return a("sanitizeRedHoodPierceCount",t=>Math.max(0,Number(t)||0))(e)}function le(e){return a("sanitizeScarletCounterEnabled",t=>t!==!1)(e)}function R(e){return a("sanitizeSacrificeFrame",t=>t==null||t===""?null:Number(t))(e)}function ce(e){return a("canEditChargeSpeed",()=>!1)(e)}function ue(e){return a("formatChargeNumber",t=>String(t||0))(e)}function me(e){return a("getCharacterLocalizedName",t=>t?.name||"")(e)}function de(e){return a("getAvatarMarkup",()=>'<span class="avatar-fallback"><span class="avatar-fallback-name">?</span></span>')(e)}function pe(...e){return a("getSacrificeMarkMarkup",()=>"")(...e)}function fe(e){return a("deleteTeamPreset",()=>!1)(e)}function ge(e,t){return a("loadTeamPresetById",()=>!1)(e,t)}function ve(e,t,n={},s="attack"){const o=X(e),d=Z(s),i=F(n.team).map(m=>N(m)),c=_(n.chargeSpeeds?.[t]),u=G(n.universalCharges?.[t]),v=Q(n.cubeTypes?.[t]),T=Y(n.magazines?.[t]),p=e?V(v):"",C=n.jackalLinks?.[d]||{enabled:!1,ownerId:null,targetIds:[]},A=ee(i,C),M=te(i,C),H=!!ae(i),x=new Set(ne(i,C)),B=e&&M&&se(e)&&A?.id===e.id&&(!H||re(e)),O=e&&M&&x.has(e.id),$=e&&ie(e)?oe(n.redHoodPierceCounts?.[t]):0,q=e&&L(e)?le(n.scarletCounterEnabled?.[t]):!1,h=R(n.rosannaSacrificeFrames?.[t]),W=i.some(m=>m&&k(m)),K=i.some((m,D)=>m&&!k(m)&&R(n.rosannaSacrificeFrames?.[D])!==null),U=e&&W&&!k(e)&&h!==null,w=e&&ce(e)&&c>0?`${c}%`:e&&L(e)&&T>0?String(T):"";return e?`
    <span class="team-slot team-preset-slot filled${o}" aria-label="${r(me(e))}">
      <span class="team-avatar">${de(e)}</span>
      <span class="slot-copy" aria-hidden="true">
        ${U?pe(h):""}
        ${p?`<span class="slot-cube-badge"><img src="${p}" alt="" /></span>`:""}
        ${w?`<span class="slot-speed-badge">${w}</span>`:""}
        ${$>0?`<span class="slot-pierce-count is-active"><img class="slot-pierce-icon" src="assets/icons/ui/pierce.svg" alt="" /><span class="slot-pierce-value">${$}</span></span>`:""}
        ${L(e)?`<span class="slot-counter-toggle${q?" is-active":""}"><img src="assets/icons/ui/pierce.svg" alt="" /></span>`:""}
        ${k(e)?`<span class="slot-sacrifice-toggle${K?" is-active":""}"><img src="assets/icons/ui/pierce.svg" alt="" /></span>`:""}
        ${B?'<span class="slot-link-toggle is-active"><img src="assets/icons/ui/link.svg" alt="" /></span>':O?'<span class="slot-link-target is-selected"><img src="assets/icons/ui/link.svg" alt="" /></span>':""}
      </span>
    </span>
  `:`
      <span class="team-slot team-preset-slot team-preset-slot-empty${u>0?" has-universal":""}">
        <span class="slot-empty">
          <span class="team-avatar empty-avatar">${u>0?r(ue(u)):"+"}</span>
          ${u>0?`<span class="team-preset-universal-label">${r(l("\u5145","C"))}</span>`:""}
        </span>
      </span>
    `}function Te(e=[],t={},n="defense"){return F(e).map((s,o)=>ve(N(s),o,t,n)).join("")}function be(e={}){return Se(e.createdAt)}function Se(e){const t=Number.isFinite(Number(e))?Number(e):0;return t?new Date(t).toLocaleString():l("\u672A\u77E5\u65F6\u95F4","Unknown time")}function ke(e={}){const t=J(e),n=P(),s=Te(t.team,t,t.teamKey);return`
    <article class="team-preset-item" data-team-preset-id="${r(String(t.id))}">
      <div class="team-preset-item-top">
        <strong class="team-preset-title">${r(be(t))}</strong>
        <button type="button" class="team-preset-delete" aria-label="${r(n.teamPresetDeleteButton||l("\u5220\u9664","Delete"))}">
          ${r(n.teamPresetDeleteButton||l("\u5220\u9664","Delete"))}
        </button>
      </div>
      <div class="team-preset-members-row" aria-label="${r(l("\u961F\u4F0D\u6210\u5458","Team members"))}">
        ${s}
      </div>
    </article>
  `}function I(e){if(e){if(!S.teamPresets.length){const t=P();e.innerHTML=`<p class="team-preset-empty">${r(t.teamPresetListEmpty||l("\u6682\u65E0\u961F\u4F0D\u5FEB\u7167","No saved teams"))}</p>`;return}e.innerHTML=S.teamPresets.map(t=>ke(t)).join("")}}function y(e){if(!e)return;const t=e.querySelectorAll(".team-preset-members-row");if(!t.length)return;const s=e.querySelector(".team-preset-content")?.clientWidth;if(!s||s<=0)return;const o=window.matchMedia("(max-width: 760px)").matches,d=o?4:8,i=Math.max(0,window.innerWidth-document.documentElement.clientWidth),c=o?14+i:0,u=Math.floor((s-c-d*4)/5),v=44,T=o?Math.max(v,u):Math.max(v,Math.min(84,u));t.forEach(p=>{p.style.setProperty("--team-preset-slot-size",`${T}px`),p.style.setProperty("--team-preset-slot-gap",`${d}px`),p.style.gridTemplateColumns="repeat(5, minmax(0, var(--team-preset-slot-size)))"})}function ye(){z();const e=P(),t=document.createElement("div");t.className="help-modal-backdrop team-preset-backdrop",t.innerHTML=`
    <section class="help-modal team-preset-modal" role="dialog" aria-modal="true" aria-label="${r(l("\u672C\u5730\u961F\u4F0D\u5FEB\u7167","Team snapshots"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">${r(e.teamPresetModalKicker||l("\u672C\u5730","Local"))}</span>
          <strong>${r(e.teamPresetModalTitle||l("\u672C\u5730\u961F\u4F0D\u5FEB\u7167","Team snapshots"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${r(l("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content team-preset-content"></div>
    </section>
  `;const n=t.querySelector(".team-preset-content");I(n),t.querySelector(".help-modal-close")?.addEventListener("click",z),n?.addEventListener("click",o=>{const d=o.target.closest(".team-preset-delete"),i=o.target.closest(".team-preset-item");if(!i)return;const c=i.dataset.teamPresetId;if(d){fe(c),I(n),y(t.querySelector(".team-preset-modal"));return}ge(c,S.activeTeamKey)&&z()}),document.body.append(t);const s=t.querySelector(".team-preset-modal");requestAnimationFrame(()=>y(s)),f=()=>y(s),window.addEventListener("resize",f),window.ResizeObserver&&(g=new ResizeObserver(()=>y(s)),g.observe(t))}function z(){f&&(window.removeEventListener("resize",f),f=null),g&&(g.disconnect(),g=null),document.querySelector(".team-preset-backdrop")?.remove()}export{z as closeTeamPresetModal,ye as openTeamPresetModal,j as setTeamPresetUiApi};
