let P={};function Ge(e={}){P=e||{}}function l(e){const t=P[e];if(typeof t!="function")throw new Error(`Missing champion data UI API: ${e}`);return t}function n(){return P.championDataState||{}}function se(){return P.state||{}}function R(){return Number(P.teamSize)||5}function X(){return P.championAllSeasonsKey||"all"}function ve(e="c"){return Number(P.paidArenaTeamCounts?.[e])||(e==="c"?5:3)}function c(...e){return l("escapeHtml")(...e)}function o(...e){return l("localize")(...e)}function ce(...e){return l("resolveChampionCharacterId")(...e)}function J(...e){return l("getCharacterById")(...e)}function be(...e){return l("getChampionCharacterByName")(...e)}function Xe(...e){return l("getTeamSlotRarityClass")(...e)}function Je(...e){return l("getAvatarMarkup")(...e)}function oe(...e){return l("getCharacterLocalizedName")(...e)}function ke(...e){return l("getTeamLabel")(...e)}function Ye(...e){return l("getChampionRowsByMatchKey")(...e)}function Ce(...e){return l("getChampionFilteredRows")(...e)}function N(...e){return l("getChampionMatchSummary")(...e)}function q(...e){return l("getChampionMatchWinnerName")(...e)}function Za(...e){return l("getChampionMatchLoserName")(...e)}function et(...e){return l("getChampionStageRank")(...e)}function at(...e){return l("getChampionStageBaseLabel")(...e)}function re(...e){return l("getChampionGameNo")(...e)}function Qe(...e){return l("getChampionRows")(...e)}function Y(...e){return l("getChampionSourceKey")(...e)}function Ze(...e){return l("getChampionSeason")(...e)}function ea(...e){return l("sortChampionSeasons")(...e)}function aa(...e){return l("getChampionDisplayNameForFile")(...e)}function ta(...e){return l("loadChampionFileRows")(...e)}function na(...e){return l("loadChampionTeamStats")(...e)}function ia(...e){return l("refreshChampionMatchRows")(...e)}function sa(...e){return l("isChampionStatsPayload")(...e)}function le(...e){return l("getChampionDivision")(...e)}function ca(...e){return l("getUniqueChampionValues")(...e)}function oa(...e){return l("getChampionMatchGroups")(...e)}function ue(...e){return l("getChampionRowsByStageRank")(...e)}function de(...e){return l("closeChampionPlayerDetailModal")(...e)}function Me(...e){return l("getChargeChartSize")(...e)}function tt(...e){return l("getChampionTeamSavedScarletCounterEnabled")(...e)}function nt(...e){return l("getChampionTeamSavedRosannaSacrificeFrames")(...e)}function it(...e){return l("simulateBattle")(...e)}function ra(...e){return l("getChargeChartMarkup")(...e)}function st(...e){return l("formatFrame")(...e)}function ct(...e){return l("getPaidArenaModeLabel")(...e)}function ot(...e){return l("getPaidArenaDataTeamKey")(...e)}function rt(...e){return l("computePaidArenaBattleResultsForRow")(...e)}function la(...e){return l("normalizeTeamKey")(...e)}function lt(...e){return l("getPaidArenaResultText")(...e)}function ut(...e){return l("getTauntTargetState")(...e)}function dt(...e){return l("getEffectiveLinkOwnerForTeam")(...e)}function mt(...e){return l("isEffectiveLinkEnabledForTeam")(...e)}function pt(...e){return l("getEffectiveLinkTargetIdsForTeam")(...e)}function ht(...e){return l("isRosanna")(...e)}function ft(...e){return l("sanitizeSacrificeFrame")(...e)}function gt(...e){return l("getCubeIconSrc")(...e)}function St(...e){return l("getSavedCharacterCubeType")(...e)}function yt(...e){return l("sanitizeUniversalCharge")(...e)}function $t(...e){return l("canShowFinishMarker")(...e)}function ua(...e){return l("isRedHood")(...e)}function vt(...e){return l("sanitizeRedHoodPierceCount")(...e)}function bt(...e){return l("isScarlet")(...e)}function kt(...e){return l("sanitizeScarletCounterEnabled")(...e)}function Ct(...e){return l("formatChargeNumber")(...e)}function da(...e){return l("formatNumber")(...e)}function Mt(...e){return l("canEditChargeSpeed")(...e)}function wt(...e){return l("sanitizeChargeSpeed")(...e)}function Tt(...e){return l("getDisplayMagazine")(...e)}function Rt(...e){return l("isLocalDevRuntime")(...e)}function At(...e){return l("getStandardChargeBand")(...e)}function Lt(...e){return l("getRosannaSacrificeFrameState")(...e)}function Nt(...e){return l("getRedHoodPierceCountState")(...e)}function Wt(...e){return l("getScarletCounterEnabledState")(...e)}function Et(...e){return l("normalizeJackalLink")(...e)}function ma(...e){return l("getSavedCharacterChargeSpeed")(...e)}function pa(...e){return l("getSavedCharacterRedHoodPierceCount")(...e)}function ha(...e){return l("createEmptyJackalLinkState")(...e)}function fa(...e){return l("isJackal")(...e)}function ga(...e){return l("isLinkProvider")(...e)}function Sa(...e){return l("createEmptyPaidArenaLineupSlot")(...e)}function ya(...e){return l("normalizePaidArenaLineupSlot")(...e)}function $a(...e){return l("isPaidArenaModeActive")(...e)}function va(...e){return l("saveCurrentPaidArenaLineupSlot")(...e)}function ba(...e){return l("ensurePaidArenaLineupSlots")(...e)}function ka(...e){return l("getPaidArenaLineupSlotCount")(...e)}function Ca(...e){return l("loadPaidArenaLineupSlot")(...e)}function Ma(...e){return l("syncPaidArenaChargeSpeedsFromSavedData")(...e)}function wa(...e){return l("closeChampionDataModal")(...e)}function Ta(...e){return l("hideChartTooltip")(...e)}function Ra(...e){return l("saveTeam")(...e)}function Aa(...e){return l("render")(...e)}function we(...e){return l("showToast")(...e)}function La(...e){return l("clearOpenSettings")(...e)}function Te(...e){return l("withPaidArenaSimulationState")(...e)}function Q(...e){return l("getStunWindowsForTeam")(...e)}function Re(...e){return l("getDodgedStunEventsForTeam")(...e)}function Z(...e){return l("simulateBurst")(...e)}function Ae(...e){return l("getSpecialChargeEventsForTeam")(...e)}function Na(...e){return l("getSharedBattleCalculationEndFrame")(...e)}function ee(...e){return l("getResultSignature")(...e)}function me(e,t,a,i){const s=i.map(r=>{const d=String(r.value??r),p=String(r.label??r);return`<option value="${c(d)}"${String(a||"")===d?" selected":""}>${c(p)}</option>`}).join("");return`
    <label class="champion-data-select">
      <span>${c(t)}</span>
      <select id="${c(e)}" name="${c(e)}">${s}</select>
    </label>
  `}function pe(e={}){const t=e?.name||"",a=ce(e?.character_id??e?.characterId??e?.id),i=J(a)||be(t),s=String(e?.name_code??e?.nameCode??"").trim(),r=s?`assets/avatars/namecode/${encodeURIComponent(s)}.webp`:"",d=i?Xe(i):"",p=i?Je(i):r?`<img src="${c(r)}" alt="${c(t||s)}" loading="lazy" />`:`<span class="avatar-fallback"><span class="avatar-fallback-name">${c(t||"?")}</span></span>`;return`
    <span class="champion-member ${d}">
      <span class="champion-member-avatar team-avatar">${p}</span>
      <span class="champion-member-meta">
        <span class="champion-member-name">${c(i?oe(i):t)}</span>
      </span>
    </span>
  `}function he(e=[],t,a="",i={}){const s=ke(t==="attack"?"attack":"defense"),r=a===t?" is-winner":"",d=i.chartIndex!==void 0?` role="button" tabindex="0" data-champion-chart-side="${c(t)}" data-champion-chart-index="${c(String(i.chartIndex))}"`:"";return`
    <div class="champion-round-team champion-${t}${r}"${d}>
      <strong>${c(s)}</strong>
      <div class="champion-member-list">
        ${Array.from({length:R()},(p,u)=>pe(e[u]||{position:u+1})).join("")}
      </div>
    </div>
  `}function K(e=[]){return`
    <div class="champion-round-team champion-lineup-only">
      <div class="champion-member-list">
        ${Array.from({length:R()},(t,a)=>pe(e[a]||{position:a+1})).join("")}
      </div>
    </div>
  `}function z(e){return`${Math.trunc((Number(e)||0)*1e4)/100}%`}function ae(e,t="",a={}){const i=Number(e?.recommend_score),s=Number.isFinite(i)&&i>0?`<span>${c(o(`\u63A8\u8350\u5206 ${Math.round(i)}`,`Score ${Math.round(i)}`))}</span>`:"",r=String(a.matchupTeamKey||""),d=r?` role="button" tabindex="0" data-champion-matchup-team-key="${c(r)}"`:"";return`
    <div class="${`champion-stat-card${a.selected?" is-selected":""}${r?" is-clickable":""}`}"${d}>
      <div class="champion-stat-rank">
        <span>${c(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${K(e.team||[])}
      </div>
      <div class="champion-stat-metrics">
        <strong>${c(z(e.win_rate??e.winRate))}</strong>
        <span>${c(o(`${e.wins}\u80DC${e.losses}\u8D1F / ${e.games}\u573A`,`${e.wins}W ${e.losses}L / ${e.games}`))}</span>
        ${s}
      </div>
    </div>
  `}function Wa(e,t=""){const a=Number(e?.system_score),i=Array.isArray(e?.core_members)?e.core_members:[],s=Array.isArray(e?.common_fillers)?e.common_fillers:[],r=s.length?`
    <div class="champion-core-fillers">
      <strong>${c(o("\u5E38\u89C1\u7B2C5\u4EBA","Common 5th"))}</strong>
      <div class="champion-core-filler-list">
        ${s.slice(0,4).map(d=>{const p=J(d.character_id),u=p?oe(p):String(d.character_id||""),h=Number(d.games||d.count||0),g=Number(d.wins||0),S=Number(d.win_rate),y=Number.isFinite(S)&&S>0?z(S):"";return`
            <span class="champion-core-filler">
              <span>${c(u)}</span>
              <small>${c(o(`${h}\u573A${y?` / ${y}`:""}`,`${h}G${y?` / ${y}`:""}`))}</small>
              ${g?`<small>${c(o(`${g}\u80DC`,`${g}W`))}</small>`:""}
            </span>
          `}).join("")}
      </div>
    </div>
  `:"";return`
    <div class="champion-stat-card champion-core-stat-card">
      <div class="champion-stat-rank">
        <span>${c(t)}</span>
        <small>${c(o("\u6838\u5FC34\u4EBA","Core 4"))}</small>
      </div>
      <div class="champion-stat-team">
        ${K(i)}
        ${r}
      </div>
      <div class="champion-stat-metrics">
        <strong>${c(z(e?.win_rate))}</strong>
        <span>${c(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
        <span>${c(o(`\u4F53\u7CFB\u5206 ${Math.round(a||0)}`,`System ${Math.round(a||0)}`))}</span>
      </div>
    </div>
  `}function Le(e,t=""){const a=ce(e?.character_id),i=J(a),s=i?oe(i):String(e?.character_id||"");return`
    <div class="champion-stat-card champion-character-stat-card">
      <div class="champion-stat-rank">
        <span>${c(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${pe({character_id:a,name:s})}
      </div>
      <div class="champion-stat-metrics">
        <strong>${c(z(e?.win_rate))}</strong>
        <span>${c(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
      </div>
    </div>
  `}function Ea(e,t=""){return`
    <div class="champion-stat-card champion-matchup-stat-card">
      <div class="champion-stat-rank">
        <span>${c(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${K(e.opponent_team||[])}
      </div>
      <div class="champion-stat-metrics">
        <strong>${c(z(e.win_rate))}</strong>
        <span>${c(o(`${e.wins||0}\u80DC${e.losses||0}\u8D1F / ${e.games||0}\u573A`,`${e.wins||0}W ${e.losses||0}L / ${e.games||0}`))}</span>
      </div>
    </div>
  `}function Ne(e=[],t){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${c(t)}</p>`:`
    <div class="champion-stats-list champion-matchup-list">
      ${e.map((a,i)=>Ea(a,`#${i+1}`)).join("")}
    </div>
  `}function Fa(e=[],t){if(!Array.isArray(e)||!e.length)return`<p class="champion-data-empty">${c(t)}</p>`;const a=new Map;e.forEach(s=>{const r=Number(s.game_no);!Number.isInteger(r)||r<1||(a.has(r)||a.set(r,[]),a.get(r).push(s))});const i=[1,2,3,4,5].filter(s=>a.has(s));return i.length?`
    <section class="champion-stat-section">
      <div class="champion-stats-list champion-round-stats-list">
        ${i.map(s=>{const r=(a.get(s)||[]).slice(0,5),d=r[0],p=r.slice(1),u=String(n().expandedStatRound||"")===String(s);return`
            <article class="champion-round-stat-group${u?" is-expanded":""}" data-champion-stat-round-group="${c(String(s))}">
              <button class="champion-round-stat-primary" type="button" data-champion-stat-round-toggle="${c(String(s))}" aria-expanded="${u?"true":"false"}">
                ${ae(d,`R${s}`)}
                ${p.length?`<span class="champion-round-stat-stack" aria-hidden="true">${p.map(()=>"<i></i>").join("")}</span>`:""}
              </button>
              ${p.length?`
                <div class="champion-round-stat-extra">
                  ${p.map((h,g)=>ae(h,`#${g+2}`)).join("")}
                </div>
              `:""}
            </article>
          `}).join("")}
      </div>
    </section>
  `:`<p class="champion-data-empty">${c(t)}</p>`}function xa(e=[],t,a={}){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${c(t)}</p>`:a.showRound?Fa(e,t):`
    <section class="champion-stat-section">
      <div class="champion-stats-list">
        ${e.map((i,s)=>ae(i,`#${s+1}`)).join("")}
      </div>
    </section>
  `}function Pa(e={}){const t=n().selectedStatSide==="combined"?"combined":n().selectedStatSide==="defense"?"defense":"attack";let a=["recommend","systems","rate","round","characters"].includes(n().selectedStatRankType)?n().selectedStatRankType:"games";t==="combined"&&!["recommend","systems","characters"].includes(a)&&(a="recommend"),t!=="combined"&&["recommend","systems","characters"].includes(a)&&(a="games");const i=Array.isArray(e?.topByRate)?e.topByRate:[],s=Array.isArray(e?.topByGames)?e.topByGames:[],r=Array.isArray(e?.bestByRound)?e.bestByRound:[],d=Array.isArray(e?.ranking?.recommendations)?e.ranking.recommendations:[],p=Array.isArray(e?.ranking?.characters)?e.ranking.characters:[],u=Array.isArray(e?.ranking?.cores)?e.ranking.cores:[],h=e?.ranking?.matchups&&typeof e.ranking.matchups=="object"?e.ranking.matchups:{},g=Array.isArray(h.strongAgainst)?h.strongAgainst:[],S=Array.isArray(h.weakAgainst)?h.weakAgainst:[],y=String(n().selectedMatchupTeamKey||""),T=y?d.find(C=>String(C?.team_key||"")===y):null,k=Math.max(0,Math.trunc(Number(e?.minWins)||30)),M=o("\u63A8\u8350\u5206 = \u80DC\u7387\xD755 + \u6837\u672C\u5206\xD720 + \u51FA\u573A\u5206\xD715 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710\u3002\u6837\u672C\u5206\u6309\u8FBE\u5230\u6700\u4F4E\u80DC\u573A\u8BA1\u7B97\uFF0C\u51FA\u573A\u5206\u6309\u5F53\u524D\u8303\u56F4\u6700\u9AD8\u51FA\u573A\u8BA1\u7B97\u3002","Score = win rate x55 + sample x20 + usage x15 + season coverage x10. Sample score uses the minimum wins threshold; usage score is relative to the highest games in the current scope."),$=o("\u4F53\u7CFB\u5206 = \u80DC\u7387\xD745 + \u6837\u672C\u5206\xD718 + \u51FA\u573A\u5206\xD714 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710 + \u53D8\u4F53\u5206\xD713\u3002\u4EC5\u7EDF\u8BA1\u51FA\u73B0\u8FC7\u81F3\u5C11\u4E24\u79CD\u4E0D\u540C\u7B2C5\u4EBA\u53D8\u4F53\u76844\u4EBA\u6838\u5FC3\uFF0C\u4E0D\u533A\u5206\u7AD9\u4F4D\u3002","System score = win rate x45 + sample x18 + usage x14 + season coverage x10 + variant x13. Only 4-unit cores with at least two different 5th-member variants are listed, ignoring positions."),f=a==="recommend"?d:a==="systems"?u:a==="rate"?i:a==="round"?r:a==="characters"?p:s,v=a==="recommend"?o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."):a==="rate"?o(`\u6682\u65E0${k}\u80DC\u4EE5\u4E0A\u80DC\u7387\u7EDF\u8BA1\u3002`,`No win-rate data with at least ${k} wins.`):a==="characters"?o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."):a==="systems"?o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."):a==="round"?o("\u6682\u65E0\u5C40\u5185\u8D70\u4F4D\u7EDF\u8BA1\u3002","No round-position data."):o("\u6682\u65E0\u51FA\u573A\u7EDF\u8BA1\u3002","No usage data.");return!i.length&&!s.length&&!r.length&&!d.length&&!p.length&&!u.length?`
      <section class="champion-stats-panel">
        ${ge(t)}
        ${fe(a,k,t)}
        <p class="champion-data-empty">${c(o("\u6682\u65E0\u53EF\u7EDF\u8BA1\u7684\u961F\u4F0D\u6570\u636E\u3002","No team statistics data."))}</p>
      </section>
    `:t==="combined"?`
      <section class="champion-stats-panel">
        ${ge(t)}
        ${fe(a,k,t)}
        <section class="champion-stat-section champion-combined-stat-section">
          <div class="champion-stats-head">
            <div class="champion-stats-title">
              <strong>${c(a==="characters"?o("\u89D2\u8272\u699C","Characters"):a==="systems"?o("\u4F53\u7CFB\u699C\uFF084+1\uFF0C\u4E0D\u5206\u7AD9\u4F4D\uFF09","Systems (4+1, positionless)"):o("\u7EFC\u5408\u63A8\u8350","Recommended"))}</strong>
              ${a==="recommend"||a==="systems"?`
                <span class="champion-score-help-wrap">
                  <button class="champion-score-help" type="button" aria-label="${c(a==="systems"?$:M)}" aria-describedby="championScoreTooltip">?</button>
                </span>
              `:""}
            </div>
            <span>${c(a==="characters"?o("\u6309\u51FA\u573A\u91CF\u548C\u80DC\u7387\u5C55\u793A\u73AF\u5883\u89D2\u8272","Shows meta characters by usage and win rate."):a==="systems"?o("\u63094\u4EBA\u6838\u5FC3\u548C\u5E38\u89C1\u7B2C5\u4EBA\u53D8\u4F53\u5C55\u793A\u4F53\u7CFB","Shows systems as a 4-unit core plus common 5th variants."):o("\u6309\u80DC\u7387\u3001\u6837\u672C\u3001\u51FA\u573A\u548C\u8D5B\u5B63\u8986\u76D6\u7EFC\u5408\u6392\u5E8F","Ranked by win rate, sample size, usage, and season coverage."))}</span>
            ${a==="recommend"||a==="systems"?`<span id="championScoreTooltip" class="champion-score-tooltip" role="tooltip">${c(a==="systems"?$:M)}</span>`:""}
          </div>
          <div class="champion-stats-list">
            ${a==="characters"?p.length?p.map((C,b)=>Le(C,`#${b+1}`)).join(""):`<p class="champion-data-empty">${c(o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."))}</p>`:a==="systems"?u.length?u.map((C,b)=>Wa(C,`#${b+1}`)).join(""):`<p class="champion-data-empty">${c(o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."))}</p>`:d.length?d.map((C,b)=>ae(C,`#${b+1}`,{matchupTeamKey:C.team_key,selected:y&&y===String(C.team_key||"")})).join(""):`<p class="champion-data-empty">${c(o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."))}</p>`}
          </div>
        </section>
        ${a==="recommend"&&y?`
          <section class="champion-stat-section champion-matchup-section">
            <div class="champion-matchup-head">
              <div class="champion-matchup-heading">
                <strong>${c(o("\u514B\u5236\u67E5\u8BE2","Matchups"))}</strong>
              </div>
              <button class="champion-matchup-back" type="button" data-champion-matchup-back>
                ${c(o("\u8FD4\u56DE\u63A8\u8350\u5217\u8868","Back to recommendations"))}
              </button>
              <div class="champion-matchup-selected-team" aria-label="${c(o("\u5DF2\u9009\u961F\u4F0D","Selected team"))}">
                ${K(T?.team||[])}
              </div>
            </div>
            <div class="champion-matchup-columns">
              <section class="champion-matchup-column">
                <strong>${c(o("\u64C5\u957F\u6253\u8C01","Strong against"))}</strong>
                ${Ne(g,o("\u6682\u65E0\u514B\u5236\u6570\u636E\u3002","No favorable matchup data."))}
              </section>
              <section class="champion-matchup-column">
                <strong>${c(o("\u6015\u8C01","Weak against"))}</strong>
                ${Ne(S,o("\u6682\u65E0\u88AB\u514B\u6570\u636E\u3002","No weak matchup data."))}
              </section>
            </div>
          </section>
        `:""}
      </section>
    `:`
    <section class="champion-stats-panel">
      ${ge(t)}
      ${fe(a,k,t)}
      ${a==="characters"?`<section class="champion-stat-section"><div class="champion-stats-list">${p.length?p.map((C,b)=>Le(C,`#${b+1}`)).join(""):`<p class="champion-data-empty">${c(v)}</p>`}</div></section>`:xa(f,v,{showRound:a==="round"})}
    </section>
  `}function fe(e="games",t=30,a="attack"){return a==="combined"?`
      <div class="champion-stat-rank-tabs is-combined" role="tablist" aria-label="${c(o("\u7EFC\u5408\u7EDF\u8BA1\u699C\u5355","Combined ranking type"))}">
        <button class="champion-stat-rank-tab${e==="recommend"?" is-active":""}" type="button" data-champion-stat-rank="recommend">
          ${c(o("\u7EFC\u5408\u63A8\u8350","Recommended"))}
        </button>
        <button class="champion-stat-rank-tab${e==="systems"?" is-active":""}" type="button" data-champion-stat-rank="systems">
          ${c(o("\u4F53\u7CFB\u699C\uFF084+1\uFF09","Systems (4+1)"))}
        </button>
        <button class="champion-stat-rank-tab${e==="characters"?" is-active":""}" type="button" data-champion-stat-rank="characters">
          ${c(o("\u89D2\u8272\u699C","Characters"))}
        </button>
      </div>
    `:`
    <div class="champion-stat-rank-tabs" role="tablist" aria-label="${c(o("\u80DC\u7387\u7EDF\u8BA1\u699C\u5355","Win-rate ranking type"))}">
      <button class="champion-stat-rank-tab${e==="games"?" is-active":""}" type="button" data-champion-stat-rank="games">
        ${c(o("\u51FA\u573A\u524D5","Top 5 Usage"))}
      </button>
      <button class="champion-stat-rank-tab${e==="rate"?" is-active":""}" type="button" data-champion-stat-rank="rate">
        ${c(o(`\u80DC\u7387\u524D5(${t}\u80DC+)`,`Top 5 Win Rate (${t}W+)`))}
      </button>
      <button class="champion-stat-rank-tab${e==="round"?" is-active":""}" type="button" data-champion-stat-rank="round">
        ${c(o("\u5C40\u5185\u6700\u591A\u4F7F\u7528","Most Used by Round"))}
      </button>
    </div>
  `}function ge(e="attack"){return`
    <div class="champion-stat-side-tabs" role="tablist" aria-label="${c(o("\u80DC\u7387\u7EDF\u8BA1\u4F4D\u7F6E","Win-rate side"))}">
      <button class="champion-stat-side-tab is-combined${e==="combined"?" is-active":""}" type="button" data-champion-stat-side="combined">
        ${c(o("\u7EFC\u5408","Combined"))}
      </button>
      <button class="champion-stat-side-tab is-attack${e==="attack"?" is-active":""}" type="button" data-champion-stat-side="attack">
        ${c(o("\u8FDB\u653B\u961F","Attack Teams"))}
      </button>
      <button class="champion-stat-side-tab is-defense${e==="defense"?" is-active":""}" type="button" data-champion-stat-side="defense">
        ${c(o("\u9632\u5B88\u961F","Defense Teams"))}
      </button>
    </div>
  `}function Da(e,t=0){const a=e.winner==="attack"?o("\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u5B88\u65B9\u80DC","Defense Win"):o("\u672A\u77E5","Unknown"),i=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",s=re(e);return`
    <article class="champion-round-card ${i}">
      <div class="champion-round-head">
        <strong>Round ${c(String(s||"?"))}</strong>
        <span>${c(a)}</span>
      </div>
      <div class="champion-round-teams">
        ${he(e.attack_team||[],"attack",e.winner,{chartIndex:t})}
        <span class="champion-round-vs">VS</span>
        ${he(e.defense_team||[],"defense",e.winner,{chartIndex:t})}
      </div>
      ${Va(e,t)}
    </article>
  `}function Ft(e){const t=e.winner==="attack"?o("\u8FDB\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u8FDB\u653B\u65B9\u8D1F","Attack Lose"):o("\u672A\u77E5","Unknown"),a=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",i=re(e);return`
    <article class="champion-round-card champion-attack-only ${a}">
      <div class="champion-round-head">
        <strong>Round ${c(String(i||"?"))}</strong>
        <span>${c(e.attack_player||o("\u8FDB\u653B\u65B9","Attack"))} VS ${c(e.defense_player||o("\u9632\u5B88\u65B9","Defense"))} \xB7 ${c(t)}</span>
      </div>
      ${he(e.attack_team||[],"attack",e.winner)}
    </article>
  `}function Ia(e,t=""){const i=e.defense_player===t&&e.attack_player!==t?"defense":"attack",s=re(e);return`
    <article class="champion-round-card champion-lineup-card">
      <div class="champion-round-head">
        <strong>Round ${c(String(s||"?"))}</strong>
      </div>
      ${K(e[`${i}_team`]||[])}
    </article>
  `}function _a(e={}){const t=ce(e?.character_id??e?.characterId??e?.id);return J(t)||be(e?.name||"")}function O(e=[]){return Array.from({length:R()},(t,a)=>_a(e[a]||null)||null)}function Ba(e=[],t="attack"){return Array.from({length:R()},(a,i)=>{const s=e?.[i];return s?ma(s,t):0})}function Ha(e=[],t="attack"){return Array.from({length:R()},(a,i)=>{const s=e?.[i];return s&&ua(s)?pa(s,t):0})}const qa=[0,2,4];function We(e=[]){const t=e.find(s=>s&&fa(s))||e.find(s=>s&&ga(s));if(!t)return ha();const a=e.findIndex(s=>s&&s.id===t.id),i=[...new Set([a,...qa])].filter(s=>Number.isInteger(s)&&s>=0&&s<R()&&!!e[s]);return{enabled:!0,ownerId:t.id,targetIds:i.map(s=>e[s]).filter(s=>s&&s.id!==t.id).map(s=>s.id).slice(0,2),fixedLinkedPositionIndices:i}}function Ka(e=[]){const a=Sa("c");return e.slice(0,ve("c")).forEach((i,s)=>{const r=O(i.attack_team||[]),d=O(i.defense_team||[]);[{teamKey:"attack",team:r},{teamKey:"defense",team:d}].forEach(({teamKey:u,team:h})=>{a.teams[u][s]=h.map(g=>g?.id||null),a.chargeSpeeds[u][s]=Ba(h,u),a.redHoodPierceCounts[u][s]=Ha(h,u),a.scarletCounterEnabled[u][s]=Array(R()).fill(!0),a.jackalLinks[u][s]=We(h)})}),a.activeRowIndex=0,a.activeTeamKey="attack",ya(a,"c")}function za(e=[]){const t=Array.isArray(e)?e.slice(0,ve("c")):[];if(!t.some(r=>{const d=O(r.attack_team||[]),p=O(r.defense_team||[]);return[...d,...p].some(Boolean)})){we(o("\u8D5B\u5B63\u961F\u4F0D\u4E3A\u7A7A\uFF0C\u65E0\u6CD5\u5957\u7528","Season teams are empty and cannot be applied"));return}const i=se();$a()&&va(i.paidArenaMode);const s=ba("c");ka(s[0],"c")>0&&!window.confirm(o("\u5F53\u524D\u5C06\u8986\u76D6\u65B9\u68481\uFF0C\u662F\u5426\u786E\u8BA4\uFF1F","This will overwrite Plan 1. Continue?"))||(s[0]=Ka(t),i.paidArenaMode="c",i.testMode=!1,i.paidArenaActiveLineupIndex.c=0,i.paidArenaDisplayMode="round",i.paidArenaDataTeamKey="attack",i.paidArenaActiveRowIndex=0,Ca("c",0),i.paidArenaDisplayMode="round",i.paidArenaDataTeamKey="attack",i.paidArenaActiveRowIndex=0,Ma("c"),La(),de(),wa(),Ta(),Ra(),Aa(),we(o("\u5DF2\u5957\u7528\u6574\u573A\u5BF9\u5C40\u5230\u51A0\u519B\u7ADE\u6280\u573A\u65B9\u68481","Applied the full match to Champion Arena Plan 1")))}function te(e=[],t="attack"){const a=O(e);return{mode:"c",teamKey:la(t),rowIndex:0,team:a,universalCharges:Array(R()).fill(0),sacrificeFrames:Array(R()).fill(null),redHoodPierceCounts:Array(R()).fill(0),scarletCounterEnabled:Array(R()).fill(!0),jackalLink:We(a),chargeSpeeds:Array(R()).fill(0),result:null}}function Ee(e={}){const t=te(e.attack_team||[],"attack"),a=te(e.defense_team||[],"defense"),i=se(),s=i.allowMissedShots;i.allowMissedShots=!1;try{return Te(t,a,()=>{let r=Q("attack"),d=Q("defense"),p=[],u=[],h=Z(i.team,"attack",[],[],[],r,[],t.universalCharges,i.defenseTeam,t.sacrificeFrames,p),g=Z(i.defenseTeam,"defense",[],[],[],d,[],a.universalCharges,i.team,a.sacrificeFrames,u);for(let S=0;S<8;S+=1){r=Q("attack",h?.reloadTimeline||[]),d=Q("defense",g?.reloadTimeline||[]),p=Re("attack",h?.reloadTimeline||[]),u=Re("defense",g?.reloadTimeline||[]);const y=Ae(h,g),T=Ae(g,h),k=Na(h,g),M=Z(i.team,"attack",y,g?.reloadTimeline||[],g?.turnDodgeTimeline||[],r,g?.tauntTimeline||[],t.universalCharges,i.defenseTeam,t.sacrificeFrames,p,{continueUntilFrame:k}),$=Z(i.defenseTeam,"defense",T,h?.reloadTimeline||[],h?.turnDodgeTimeline||[],d,h?.tauntTimeline||[],a.universalCharges,i.team,a.sacrificeFrames,u,{continueUntilFrame:k}),f=ee(M)===ee(h)&&ee($)===ee(g);if(h=M,g=$,f)break}return{attackResult:h,defenseResult:g}})}finally{i.allowMissedShots=s}}function Fe(e){return!e||e.error||!Number.isFinite(e.fullFrame)?"?RL":`${da(e.fullFrame/76,2)}RL`}function Oa(e={}){try{const{attackResult:t,defenseResult:a}=Ee(e);return`${Fe(t)} VS ${Fe(a)}`}catch{return"?RL VS ?RL"}}function ja(e){requestAnimationFrame(()=>{const t=e.getBoundingClientRect(),a=window.innerHeight||document.documentElement.clientHeight;(t.bottom>a-16||t.top<16)&&e.scrollIntoView({block:"nearest",behavior:"smooth"})})}function xe(e){const t=e?.getBoundingClientRect?.(),a=Me();return{width:Math.max(320,Math.round(t?.width||a.width||1800)),height:Math.max(260,Math.round(t?.height||a.height||660))}}function Pe(e={},t=Me()){const a=te(e.attack_team||[],"attack"),i=te(e.defense_team||[],"defense"),s=se(),r=s.allowMissedShots;s.allowMissedShots=!1;try{return Te(a,i,()=>{const{attackResult:d,defenseResult:p}=Ee(e);return ra(d,null,p,t)})}finally{s.allowMissedShots=r}}function De(e,t=[]){const a=Number(e?.dataset?.championChartIndex);if(!Number.isInteger(a)||!t[a])return;const i=e.closest(".champion-round-card");if(!i)return;const s=e?.dataset?.championChartSide||"summary",r=`${a}:${s}`,p=i.querySelector(".champion-inline-chart")?.dataset?.championChartKey===r;if(document.querySelectorAll(".champion-inline-chart").forEach(S=>S.remove()),document.querySelectorAll(".champion-round-team.is-chart-active, .champion-round-chart-toggle.is-chart-active").forEach(S=>S.classList.remove("is-chart-active")),p)return;const u=document.createElement("div"),h=t[a].winner==="attack"?"is-attack-win":t[a].winner==="defense"?"is-defense-win":"";u.className=`champion-inline-chart charge-chart ${h}`.trim(),u.dataset.championChartKey=r,i.append(u);const g=t[a];u.innerHTML=Pe(g,xe(u)),requestAnimationFrame(()=>{!u.isConnected||u.dataset.championChartKey!==r||(u.innerHTML=Pe(g,xe(u)))}),e.classList.add("is-chart-active"),i.querySelector(".champion-round-chart-toggle")?.classList.add("is-chart-active"),ja(u)}function Va(e={},t=0){return`
    <button class="champion-round-chart-toggle" type="button" data-champion-chart-index="${c(String(t))}">
      <span class="champion-round-chart-toggle-speed">${c(Oa(e))}</span>
      <span class="champion-round-chart-toggle-hint">${c(o("\u70B9\u51FB\u53EF\u67E5\u770B\u5145\u80FD\u8BE6\u60C5","Tap to view charge details"))}</span>
    </button>
  `}function j(e,t,a={}){if(!e?.playerName)return"";const i=e.side==="attack"?"is-attack-win":e.side==="defense"?"is-defense-win":"",s=!!a.hideMeta,r=!!a.hideStage,d=Array.from(String(e.playerName||"")).length,p=d>6?" is-name-tiny":d>4?" is-name-small":"",u=s?"":`<span class="champion-player-seed">${c(t)}</span>`,h=s||r?"":`<span class="champion-player-stage">${c(e.scoreText||e.stageLabel||"")}</span>`,g=e.altMatchKey?` data-champion-alt-match="${c(String(e.altMatchKey))}" data-champion-alt-label="${c(String(e.altMatchLabel||""))}"`:"";return`
    <button class="champion-player-node ${i}${e.isWinner?" is-winner":" is-loser"}" type="button" data-champion-player="${c(e.playerName)}" data-champion-match="${c(String(e.matchKey||""))}" data-champion-detail="${c(e.detailMode||"match")}"${g}>
      ${u}
      <span class="champion-player-name${p}"><span class="champion-player-name-text">${c(e.playerName)}</span></span>
      ${h}
    </button>
  `}function xt(e,t){const a=e.rows[0]||{},i=N(e.rows),s={playerName:a.attack_player||"",matchKey:e.key,side:"attack",stageLabel:e.stageLabel,scoreText:`${i.attackWins}`,isWinner:i.winner==="attack"},r={playerName:a.defense_player||"",matchKey:e.key,side:"defense",stageLabel:e.stageLabel,scoreText:`${i.defenseWins}`,isWinner:i.winner==="defense"},d=s.isWinner?s:r.isWinner?r:s,p=s.isWinner?r:r.isWinner?s:r;return`
    <article class="champion-match-pair">
      <div class="champion-match-pair-label">${c(e.matchLabel==="FINAL"?"FINAL":`M${t+1}`)}</div>
      <div class="champion-match-pair-nodes">
        ${j(d,"WIN")}
        ${j(p,"LOSE")}
      </div>
    </article>
  `}function W(e){const t=e?.rows?.[0]||{},a=N(e?.rows||[]);return[{playerName:t.attack_player||"",matchKey:e?.key||"",side:"attack",stageLabel:e?.stageLabel||"",scoreText:`${a.attackWins}`,isWinner:a.winner==="attack"},{playerName:t.defense_player||"",matchKey:e?.key||"",side:"defense",stageLabel:e?.stageLabel||"",scoreText:`${a.defenseWins}`,isWinner:a.winner==="defense"}].filter(i=>i.playerName)}function Ua(e,t=[]){if(!e||!t.length)return"winner";const a=t.find(i=>W(i).some(s=>s.playerName===e));return a?q(a.rows)===e?"winner":"loser":"winner"}function Pt(e=[],t=[],a=[]){const i=a[0]||null,s=i?q(i.rows):"",r=t.length?getChampionWinnerNodes(t).map(u=>({...u,isWinner:u.playerName===s})):i?W(i).map(u=>({...u,isWinner:u.playerName===s})):[],d=getChampionWinnerNodes(e).map(u=>({...u,isWinner:Ua(u.playerName,t)==="winner"})),p=e.flatMap(u=>W(u).map(h=>({...h,detailMode:"player-team",isWinner:h.isWinner})));return[{key:"champion",label:o("\u5C0F\u7EC4\u51A0\u519B","Group Champion"),nodes:s?[{playerName:s,matchKey:i?.key||"",side:N(i?.rows||[]).winner,stageLabel:o("\u51A0\u519B","Champion"),scoreText:"WIN",isWinner:!0}]:[]},{key:"top2",label:"2\u8FDB1",nodes:r,matches:i?[i]:[]},{key:"top4",label:"4\u8FDB2",nodes:d,matches:t},{key:"top8",label:"8\u8FDB4",nodes:p,matches:e}]}function Ga(e,t,a){const i=a?.key==="top2"||a?.key==="top4";return j(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:!i,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function Ie(e,t,a,i={}){const s=!!i.showScore,r=!!i.hideMeta;return j(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:r||!s,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function Xa(e,t,a){const i=W(e),s=N(e.rows||[]),r=i.find(h=>h.isWinner)||i[0];if(!r)return"";const d=a?.key==="top2"||a?.key==="top4",p=Ie({...r,scoreText:`${s.attackWins}:${s.defenseWins}`,isWinner:!0},0,a,{showScore:d}),u=i.map((h,g)=>Ie({...h,detailMode:a?.key==="top8"?"player-team":h.detailMode},g+1,a,{hideMeta:a?.key==="top8"})).join("");return`
    <article class="champion-tree-match-card champion-tree-match-${c(a?.key||"")}">
      <div class="champion-tree-match-winner">${p}</div>
      <div class="champion-tree-match-lines" aria-hidden="true"></div>
      <div class="champion-tree-match-participants">
        ${u}
      </div>
    </article>
  `}function Dt(e){const t=Array.isArray(e.matches)&&e.matches.length>0;return`
    <section class="champion-tree-row champion-tree-${c(e.key)}">
      <div class="champion-tree-row-title">${c(e.label)}</div>
      <div class="${t?"champion-tree-row-matches":"champion-tree-row-nodes"}">
        ${t?e.matches.map((a,i)=>Xa(a,i,e)).join(""):e.nodes.length?e.nodes.map((a,i)=>Ga(a,i,e)).join(""):`<span class="champion-empty-node">${c(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function _e(e=[],t=[],a=new Set){const i=e.map(r=>q(r.rows||[])).filter(Boolean),s=t.find(r=>a.has(r.key)?!1:W(r).some(d=>i.includes(d.playerName)));return s?.key&&a.add(s.key),s||null}function ne(e,t="",a={}){const i=!!a.hideMeta,s=a.detailMode||e?.detailMode||"match";return j({...e,detailMode:s},t,{hideMeta:i,hideStage:!0}).replace('class="champion-player-node ','class="champion-player-node champion-tree-node champion-elim-node ')}function It(e,t,a={}){if(!e?.rows?.length)return"";const i=W(e),s=N(e.rows||[]),r=i.find(u=>u.isWinner)||i[0];if(!r)return"";const d=!!a.hideParticipantMeta,p=`${s.attackWins}:${s.defenseWins}`;return`
    <article class="champion-elim-match">
      <div class="champion-elim-match-label">${c(t)}</div>
      <div class="champion-elim-match-winner">
        ${ne({...r,scoreText:p,isWinner:!0},p)}
      </div>
      <div class="champion-elim-lines" aria-hidden="true"></div>
      <div class="champion-elim-participants">
        ${i.map(u=>ne({...u,detailMode:a.participantDetailMode||u.detailMode},u.isWinner?u.scoreText||"WIN":u.scoreText||"LOSE",{hideMeta:d})).join("")}
      </div>
    </article>
  `}function Se(e={}){return`${e.attackWins||0}:${e.defenseWins||0}`}function D(e,t,a="",i={}){return e?.playerName?`<div class="champion-elim-slot ${c(t)}">${ne(e,a,i)}</div>`:`<span class="champion-empty-node ${c(t)}">${c(o("\u6682\u65E0","Empty"))}</span>`}function Ja(e,t={}){const a=e==="bottom",i=a?38:14,s=a?86:62,r=a?62:38,d=a?62:38,p=a?24:76,u=p,h=t.leftWinnerIndex===0,g=t.rightWinnerIndex===0,S=t.halfWinnerSide==="left",y=($,f)=>`<path class="champion-elim-line-path ${f?"is-win-line":"is-lose-line"}" d="${$}" />`,T=($,f,v=p)=>`
    <svg class="champion-elim-lines-svg ${$}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      ${y(`M ${f.leftOuter} ${i} H ${f.leftMergeX} V ${r} H ${f.leftWinner}`,h)}
      ${y(`M ${f.leftOuter} ${s} H ${f.leftMergeX} V ${r} H ${f.leftWinner}`,!h)}
      ${y(`M ${f.rightOuter} ${i} H ${f.rightMergeX} V ${r} H ${f.rightWinner}`,g)}
      ${y(`M ${f.rightOuter} ${s} H ${f.rightMergeX} V ${r} H ${f.rightWinner}`,!g)}
      ${y(`M ${f.leftFinal} ${d} H 50 V ${v}`,S)}
      ${y(`M ${f.rightFinal} ${d} H 50 V ${v}`,!S)}
    </svg>
  `,k={leftOuter:12,leftMergeX:20,leftWinner:23.5,rightOuter:88,rightMergeX:80,rightWinner:76.5,leftFinal:39,rightFinal:61},M={leftOuter:18,leftMergeX:21,leftWinner:21.5,rightOuter:82,rightMergeX:79,rightWinner:78.5,leftFinal:41,rightFinal:59};return`
    ${T("is-desktop-lines",k)}
    ${T("is-mobile-lines",M,u)}
  `}function Ya(e,t=null,a=null){return e&&(t?.rows?.length?W(t):[]).find(s=>s.playerName===e)||a}function Be(e,t=[],a=null,i=null){const s=t.slice(0,2).map(b=>{const F=W(b).map(E=>({...E,detailMode:"player-team"}));return{group:b,participants:F,winner:F.find(E=>E.isWinner)||F[0]||null,summary:N(b.rows||[])}}),r=s[0]||{},d=s[1]||{},p=r.participants||[],u=d.participants||[],h=N(a?.rows||[]),g=a?W(a):[],S=g.find(b=>b.isWinner)||g[0]||null,y=N(i?.rows||[]),T=i?q(i.rows):"",k=S?{...Ya(S.playerName,i,S)||S,scoreText:Se(h),isWinner:T?S.playerName===T:!0,altMatchKey:a?.key||"",altMatchLabel:o("\u67E5\u770B4\u8FDB2\u5BF9\u5C40","View semifinal")}:null,M=r.winner?{...r.winner,scoreText:Se(r.summary),isWinner:!0}:null,$=d.winner?{...d.winner,scoreText:Se(d.summary),isWinner:!0}:null,f=b=>{const F=b.participants||[],E=b.winner?.playerName,V=F.findIndex(B=>B.playerName===E);return V>=0?V:0},v=S?.playerName&&$?.playerName===S.playerName?"right":"left",C=e==="top"?o("\u4E0A\u534A\u533A","Upper Half"):o("\u4E0B\u534A\u533A","Lower Half");return`
    <section class="champion-elim-half champion-elim-half-${c(e)}" aria-label="${c(C)}">
      ${Ja(e,{leftWinnerIndex:f(r),rightWinnerIndex:f(d),halfWinnerSide:v})}
      ${D(p[0],"slot-left-1","",{hideMeta:!0})}
      ${D(u[0],"slot-right-1","",{hideMeta:!0})}
      ${D(M,"slot-left-winner",M?.scoreText||"",{detailMode:"match"})}
      ${D($,"slot-right-winner",$?.scoreText||"",{detailMode:"match"})}
      ${D(p[1],"slot-left-2","",{hideMeta:!0})}
      ${D(u[1],"slot-right-2","",{hideMeta:!0})}
      ${D(k,"slot-half-winner",k?.scoreText||"",{detailMode:"match"})}
      <span class="champion-elim-connector connector-left-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-left-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-half-final" aria-hidden="true"></span>
    </section>
  `}function _t(e=null,t=[]){const a=e?.rows?.length?W(e):getChampionWinnerNodes(t),i=N(e?.rows||[]),s=e?q(e.rows):"",r=e?`${i.attackWins}:${i.defenseWins}`:"";return`
    <section class="champion-elim-final" aria-label="${c(o("\u51B3\u8D5B","Final"))}">
      <div class="champion-elim-final-label">${c(o("2\u8FDB1","Final"))}</div>
      <div class="champion-elim-final-lines" aria-hidden="true"></div>
      <div class="champion-elim-final-nodes">
        ${a.length?a.map(d=>ne({...d,scoreText:r,isWinner:s?d.playerName===s:d.isWinner},r||(d.isWinner?"WIN":"LOSE"),{hideMeta:!e})).join(""):`<span class="champion-empty-node">${c(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function Qa(e=[],t=[],a=[]){const i=e.slice(0,2),s=e.slice(2,4),r=new Set,d=_e(i,t,r),p=_e(s,t,r)||t.find(h=>!r.has(h.key))||null,u=a[0]||null;return`
    <div class="champion-elim-board">
      ${Be("top",i,d,u)}
      <div class="champion-elim-vs" aria-hidden="true">VS</div>
      ${Be("bottom",s,p,u)}
    </div>
  `}function ye(e,t="",a="match",i="",s=""){de();const r=Ye(Ce(),t),d=r[0]||{},p=a==="player-team",u=N(r),h=d.attack_player||o("\u8FDB\u653B\u65B9","Attack"),g=d.defense_player||o("\u9632\u5B88\u65B9","Defense"),S=!p&&i&&i!==t,y=n().selectedDivision==="champion"?o("\u67E5\u770B\u51A0\u519B\u5BF9\u5C40","View final"):o("\u67E5\u770B\u5C0F\u7EC4\u51A0\u519B\u5BF9\u5C40","View group final"),T=p?c(`${e||o("\u9009\u624B","Player")} ${o("\u961F\u4F0D\u4FE1\u606F","Teams")}`):`
      <span class="champion-matchup-player is-attack">${c(h)}</span>
      <span class="champion-matchup-score">\uFF08${c(String(u.attackWins))} VS ${c(String(u.defenseWins))}\uFF09</span>
      <span class="champion-matchup-player is-defense">${c(g)}</span>
      ${S?`
        <button class="champion-round-apply-button champion-round-switch-button" type="button" data-champion-switch-match="${c(String(i))}" data-champion-switch-label="${c(String(y))}">
          ${c(s||o("\u5207\u6362\u5BF9\u5C40","Switch match"))}
        </button>
      `:""}
      <button class="champion-round-apply-button" type="button" data-champion-apply-match="1">
        ${c(o("\u5957\u7528\u67E5\u770B","Apply to view"))}
      </button>
    `,k=p?`
      <strong>${c(o("\u53C2\u8D5B\u9635\u5BB9","Lineups"))}</strong>
      <span>${c(o("\u8BE5\u9009\u624B\u76845\u961F\u9635\u5BB9","This player's 5 lineups"))}</span>
    `:"",M=r.length?r.map((f,v)=>p?Ia(f,e):Da(f,v)).join(""):`<p class="champion-data-empty">${c(o("\u6682\u65E0\u8BE5\u9009\u624B\u5BF9\u5C40\u3002","No matches for this player."))}</p>`,$=document.createElement("div");$.className="help-modal-backdrop champion-player-detail-backdrop",$.innerHTML=`
    <section class="help-modal champion-player-detail-modal" role="dialog" aria-modal="true" aria-label="${c(o("\u80DC\u8D1F\u6570\u636E\u961F\u4F0D","Match teams"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Champion</span>
          <strong class="${p?"":"champion-matchup-title"}">${T}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${c(o("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content champion-player-detail-content">
        ${k?`<div class="champion-round-title">${k}</div>`:""}
        <div class="champion-round-list">
          ${M}
        </div>
      </div>
    </section>
  `,document.body.append($),$.querySelector(".help-modal-close")?.addEventListener("click",de),$.querySelectorAll("[data-champion-chart-index]").forEach(f=>{f.addEventListener("click",()=>De(f,r)),f.addEventListener("keydown",v=>{["Enter"," "].includes(v.key)&&(v.preventDefault(),De(f,r))})}),$.querySelector("[data-champion-apply-match]")?.addEventListener("click",()=>za(r)),$.querySelector("[data-champion-switch-match]")?.addEventListener("click",f=>{const v=f.currentTarget?.dataset?.championSwitchMatch||"",C=f.currentTarget?.dataset?.championSwitchLabel||"";ye(e,v,"match",t,C)})}function L(e){const t=e?.querySelector(".champion-data-content");if(!t)return;if(t.classList.toggle("is-loading",!!n().loading),n().loading&&(n().loadingMode==="meta"||!Array.isArray(n().sourceSets))){t.innerHTML=`<p class="champion-data-empty champion-data-loading">${c(o("\u6B63\u5728\u83B7\u53D6\u8D5B\u5B63\u6570\u636E...","Loading season data..."))}</p>`;return}if(n().error){t.innerHTML=`<p class="champion-data-empty is-error">${c(n().error)}</p>`;return}const a=["cn","international"].includes(n().selectedServerRegion)?n().selectedServerRegion:"cn",s=(Array.isArray(n().sourceSets)?n().sourceSets:[]).filter(m=>String(m?.server_region||"cn")===a),r=s.length>0,d=s.map(m=>Y(m)).filter(Boolean),p=new Map(d.map(m=>{const x=s.find(I=>Y(I)===m);return[m,x?.season||Ze(m)]})),u=ea([...new Set([...p.values()])]);n().selectedModule==="stats"&&!n().selectedSeason&&(n().selectedSeason=X()),n().selectedSeason===X()&&n().selectedModule!=="stats"&&(n().selectedSeason=""),n().selectedSeason&&n().selectedSeason!==X()&&!u.includes(n().selectedSeason)&&(n().selectedSeason="");const h=d.filter(m=>p.get(m)===n().selectedSeason);n().selectedFile&&!h.includes(n().selectedFile)&&(n().selectedFile="");const g=Qe(),S=g.filter(m=>Y(m)===n().selectedFile),y=[...n().selectedModule==="stats"?[{value:X(),label:o("\u5168\u8D5B\u5B63","All seasons")}]:[{value:"",label:o("\u9009\u62E9\u8D5B\u5B63","Select season")}],...u.map(m=>({value:m,label:m}))],T=[{value:"",label:o("\u9009\u62E9\u51A0\u519B","Select champion")},...h.map(m=>{const x=s.find(I=>Y(I)===m);return{value:m,label:x?.champion_name||aa(g,m)}})],k=[{value:"cn",label:o("\u56FD\u670D","China")},{value:"international",label:o("\u56FD\u9645\u670D","Global")}],M=`
    <div class="champion-module-tabs" role="tablist" aria-label="${c(o("\u8D5B\u5B63\u6570\u636E\u6A21\u5757","Season data modules"))}">
      <button class="champion-module-tab${n().selectedModule==="matches"?" is-active":""}" type="button" data-champion-module="matches">
        ${c(o("\u8D5B\u5B63\u5BF9\u5C40","Season Matches"))}
      </button>
      <button class="champion-module-tab${n().selectedModule==="stats"?" is-active":""}" type="button" data-champion-module="stats">
        ${c(o("\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1","Team Win Rate"))}
      </button>
    </div>
  `,$=`
    <div class="champion-data-select-group${n().selectedModule==="stats"?" is-season-only":""}">
      ${me("championDataServerRegion",o("\u670D\u52A1\u5668","Server"),a,k)}
      ${me("championDataSeason",o("\u8D5B\u5B63","Season"),n().selectedSeason,y)}
      ${n().selectedModule==="stats"?"":me("championDataFile",o("\u51A0\u519B","Champion"),n().selectedFile,T)}
    </div>
  `,f=`
    ${M}
    <div class="champion-data-toolbar">${$}</div>
  `,v=()=>{t.querySelectorAll("[data-champion-module]").forEach(m=>{m.addEventListener("click",()=>{n().selectedModule=m.dataset.championModule==="stats"?"stats":"matches",n().selectedModule==="stats"&&(n().selectedFile="",n().selectedStatSide="combined",n().selectedStatRankType="recommend",n().selectedMatchupTeamKey=""),n().selectedMatchNo=null,n().selectedPlayerName="",L(e)})}),t.querySelector("#championDataServerRegion")?.addEventListener("change",m=>{n().selectedServerRegion=["cn","international"].includes(m.target.value)?m.target.value:"cn",n().selectedServerRegion==="international"&&(n().selectedStatSide="attack"),n().selectedSeason="",n().selectedFile="",n().rows=null,n().expandedStatRound=null,n().selectedMatchupTeamKey="",n().selectedDivision="champion",n().selectedGroup="",n().selectedMatchNo=null,n().selectedPlayerName="",ia(e)}),t.querySelector("#championDataSeason")?.addEventListener("change",m=>{n().selectedSeason=m.target.value,n().selectedFile="",n().rows=null,n().expandedStatRound=null,n().selectedMatchupTeamKey="",n().selectedDivision="champion",n().selectedGroup="",n().selectedMatchNo=null,n().selectedPlayerName="",L(e)}),t.querySelector("#championDataFile")?.addEventListener("change",m=>{n().selectedFile=m.target.value,n().expandedStatRound=null,n().selectedDivision="champion",n().selectedGroup="",n().selectedMatchNo=null,n().selectedPlayerName="",n().selectedFile?ta(e,n().selectedFile):(n().rows=null,L(e))})};if(!r){t.innerHTML=`
      ${f}
      <p class="champion-data-empty">${c(a!=="cn"?o("\u8BE5\u533A\u670D\u8D5B\u5B63\u6570\u636E\u6B63\u5728\u51C6\u5907\u4E2D\uFF0C\u5BFC\u5165\u540E\u4F1A\u5728\u8FD9\u91CC\u6309\u8D5B\u5B63\u5C55\u793A\u3002","Season data for this server is being prepared and will appear here after import."):o("\u6682\u65E0\u51A0\u519B\u7ADE\u6280\u573A\u6570\u636E\u3002","No champion arena data."))}</p>
    `,v();return}if(!n().selectedSeason){t.innerHTML=`
      ${f}
      <p class="champion-data-empty">${c(n().selectedModule==="stats"?o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u540E\u67E5\u770B\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1\u3002","Select a season to view team win rates."):o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u548C\u51A0\u519B\u540E\u67E5\u770B\u6570\u636E\u3002","Select a season and champion to view data."))}</p>
    `,v();return}if(n().selectedModule==="stats"){const m=n().selectedStatSide==="combined"?"combined":n().selectedStatSide==="defense"?"defense":"attack",x=m==="combined"?String(n().selectedMatchupTeamKey||""):"",I=`${n().selectedSeason}|${m}|${x}`,Ue=n().statsBySeasonSide?.[I],ie=sa(Ue)?n().statsBySeasonSide[I]:null;if(!ie&&!n().loading&&na(e,n().selectedSeason,m),!ie||n().loadingMode==="stats"){t.innerHTML=`
        ${f}
        <p class="champion-data-empty champion-data-loading">${c(o("\u6B63\u5728\u8BFB\u53D6\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1...","Loading team win rates..."))}</p>
      `,v();return}t.innerHTML=`
      ${f}
      <div class="champion-data-result">
        ${Pa(ie)}
      </div>
    `,v(),t.querySelectorAll("[data-champion-stat-side]").forEach(w=>{w.addEventListener("click",()=>{n().selectedStatSide=w.dataset.championStatSide==="combined"?"combined":w.dataset.championStatSide==="defense"?"defense":"attack",n().selectedMatchupTeamKey="",n().selectedStatSide==="combined"&&(n().selectedStatRankType="recommend"),n().expandedStatRound=null,L(e)})}),t.querySelectorAll("[data-champion-stat-rank]").forEach(w=>{w.addEventListener("click",()=>{n().selectedStatRankType=["recommend","systems","rate","round","characters"].includes(w.dataset.championStatRank)?w.dataset.championStatRank:"games",["recommend","systems","characters"].includes(n().selectedStatRankType)&&n().selectedStatSide!=="combined"?n().selectedStatSide="combined":!["recommend","systems","characters"].includes(n().selectedStatRankType)&&n().selectedStatSide==="combined"&&(n().selectedStatSide="attack"),n().selectedStatRankType!=="recommend"&&(n().selectedMatchupTeamKey=""),n().expandedStatRound=null,L(e)})}),t.querySelectorAll("[data-champion-matchup-team-key]").forEach(w=>{const H=()=>{const A=String(w.dataset.championMatchupTeamKey||"");!A||A===n().selectedMatchupTeamKey||(n().selectedMatchupTeamKey=A,n().selectedStatSide="combined",n().selectedStatRankType="recommend",L(e))};w.addEventListener("click",H),w.addEventListener("keydown",A=>{A.key!=="Enter"&&A.key!==" "||(A.preventDefault(),H())})}),t.querySelector("[data-champion-matchup-back]")?.addEventListener("click",()=>{n().selectedMatchupTeamKey="",L(e)}),t.querySelectorAll("[data-champion-stat-round-toggle]").forEach(w=>{w.addEventListener("click",()=>{const H=w.dataset.championStatRoundToggle||"";n().expandedStatRound=String(n().expandedStatRound||"")===String(H)?null:H,L(e),n().expandedStatRound&&requestAnimationFrame(()=>{const A=t.querySelector(`[data-champion-stat-round-group="${String(n().expandedStatRound)}"]`),_=A?.closest(".champion-stats-list");if(!A||!_)return;const U=A.getBoundingClientRect(),G=_.getBoundingClientRect();U.top<G.top?_.scrollTo({top:_.scrollTop-(G.top-U.top)-6,behavior:"smooth"}):U.bottom>G.bottom&&_.scrollTo({top:_.scrollTop+(U.bottom-G.bottom)+6,behavior:"smooth"})})})});return}if(!n().selectedFile){t.innerHTML=`
      ${f}
      <p class="champion-data-empty">${c(o("\u8BF7\u9009\u62E9\u51A0\u519B\u540E\u67E5\u770B\u5BF9\u5C40\u6570\u636E\u3002","Select a champion to view match data."))}</p>
    `,v();return}if(n().loading&&n().loadingMode==="file"){t.innerHTML=`
      ${f}
      <p class="champion-data-empty champion-data-loading">${c(o("\u6B63\u5728\u8BFB\u53D6\u8BE5\u51A0\u519B\u6570\u636E...","Loading selected champion data..."))}</p>
    `,v();return}if(!S.length){t.innerHTML=`
      ${f}
      <p class="champion-data-empty">${c(o("\u6682\u65E0\u8BE5\u51A0\u519B\u6570\u636E\u3002","No data for this champion."))}</p>
    `,v();return}const C=S.some(m=>le(m)==="champion"),b=S.some(m=>le(m)==="qualifier");n().selectedDivision==="champion"&&!C&&(n().selectedDivision="qualifier"),n().selectedDivision==="qualifier"&&!b&&(n().selectedDivision="champion");const F=S.filter(m=>le(m)==="qualifier"),E=ca(F,"stage_group").sort((m,x)=>Number(m)-Number(x));n().selectedDivision==="qualifier"&&(!n().selectedGroup||!E.map(String).includes(String(n().selectedGroup)))&&(n().selectedGroup=String(E[0]||""));const V=Ce(),B=oa(V),He=ue(B,1),qe=ue(B,2),Ke=ue(B,3),ze=Qa(He,qe,Ke),$e=E.map(m=>({value:m,label:`GROUP ${String(m).padStart(2,"0")}`})),Oe=n().selectedDivision==="champion"?o("\u51A0\u519B\u4E89\u9738\u8D5B","Champion Finals"):o("\u664B\u7EA7\u8D5B","Qualifier"),je=$e.find(m=>String(m.value)===String(n().selectedGroup))?.label||"",Ve=n().selectedDivision==="qualifier"?`<div class="champion-group-tabs" role="tablist" aria-label="${c(o("\u664B\u7EA7\u8D5B\u5C0F\u7EC4","Qualifier groups"))}">
        ${$e.map(m=>`
          <button class="champion-group-tab${String(m.value)===String(n().selectedGroup)?" is-active":""}" type="button" data-champion-group="${c(String(m.value))}">
            ${c(m.label)}
          </button>
        `).join("")}
      </div>`:"";t.innerHTML=`
    ${M}
    <div class="champion-data-toolbar">
      ${$}
      <div class="champion-division-tabs" role="tablist" aria-label="${c(o("\u8D5B\u7A0B","Bracket type"))}">
        <button class="champion-division-tab${n().selectedDivision==="qualifier"?" is-active":""}" type="button" data-champion-division="qualifier" ${b?"":"disabled"}>${c(o("\u664B\u7EA7\u8D5B","Qualifier"))}</button>
        <button class="champion-division-tab${n().selectedDivision==="champion"?" is-active":""}" type="button" data-champion-division="champion" ${C?"":"disabled"}>${c(o("\u51A0\u519B\u8D5B","Champion"))}</button>
      </div>
    </div>
    <div class="champion-data-result">
      ${Ve}
      <section class="champion-bracket-panel">
        <div class="champion-bracket-title">
          <span>${c(Oe)}</span>
          <strong>${c(n().selectedDivision==="qualifier"?je:o("8\u7EC4\u51A0\u519B\u5BF9\u5C40","Top 8 group winners"))}</strong>
        </div>
        <div class="champion-bracket-board">
          ${ze}
        </div>
      </section>
    </div>
  `,v(),t.querySelectorAll("[data-champion-division]").forEach(m=>{m.addEventListener("click",()=>{n().selectedDivision=m.dataset.championDivision==="champion"?"champion":"qualifier",n().selectedMatchNo=null,n().selectedPlayerName="",L(e)})}),t.querySelectorAll("[data-champion-group]").forEach(m=>{m.addEventListener("click",()=>{n().selectedGroup=m.dataset.championGroup||"",n().selectedMatchNo=null,n().selectedPlayerName="",L(e)})}),t.querySelectorAll("[data-champion-player]").forEach(m=>{m.addEventListener("click",()=>{n().selectedMatchNo=m.dataset.championMatch||null,n().selectedPlayerName=m.dataset.championPlayer||"",ye(n().selectedPlayerName,n().selectedMatchNo,m.dataset.championDetail||"match",m.dataset.championAltMatch||"",m.dataset.championAltLabel||"")})})}export{ye as openChampionPlayerDetailModal,L as renderChampionDataModalContent,Ge as setChampionDataUiApi};
