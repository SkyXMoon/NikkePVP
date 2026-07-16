let P={};function Oe(e={}){P=e||{}}function l(e){const t=P[e];if(typeof t!="function")throw new Error(`Missing champion data UI API: ${e}`);return t}function c(){return P.championDataState||{}}function se(){return P.state||{}}function A(){return Number(P.teamSize)||5}function G(){return P.championAllSeasonsKey||"all"}function Se(e="c"){return Number(P.paidArenaTeamCounts?.[e])||(e==="c"?5:3)}function i(...e){return l("escapeHtml")(...e)}function o(...e){return l("localize")(...e)}function ce(...e){return l("resolveChampionCharacterId")(...e)}function X(...e){return l("getCharacterById")(...e)}function ve(...e){return l("getChampionCharacterByName")(...e)}function je(...e){return l("getTeamSlotRarityClass")(...e)}function Ve(...e){return l("getAvatarMarkup")(...e)}function oe(...e){return l("getCharacterLocalizedName")(...e)}function be(...e){return l("getTeamLabel")(...e)}function Ue(...e){return l("getChampionRowsByMatchKey")(...e)}function ke(...e){return l("getChampionFilteredRows")(...e)}function N(...e){return l("getChampionMatchSummary")(...e)}function H(...e){return l("getChampionMatchWinnerName")(...e)}function Ga(...e){return l("getChampionMatchLoserName")(...e)}function Xa(...e){return l("getChampionStageRank")(...e)}function Ja(...e){return l("getChampionStageBaseLabel")(...e)}function re(...e){return l("getChampionGameNo")(...e)}function Ge(...e){return l("getChampionRows")(...e)}function J(...e){return l("getChampionSourceKey")(...e)}function Xe(...e){return l("getChampionSeason")(...e)}function Je(...e){return l("sortChampionSeasons")(...e)}function Ye(...e){return l("getChampionDisplayNameForFile")(...e)}function Qe(...e){return l("loadChampionFileRows")(...e)}function Ze(...e){return l("loadChampionTeamStats")(...e)}function ea(...e){return l("isChampionStatsPayload")(...e)}function le(...e){return l("getChampionDivision")(...e)}function aa(...e){return l("getUniqueChampionValues")(...e)}function ta(...e){return l("getChampionMatchGroups")(...e)}function ue(...e){return l("getChampionRowsByStageRank")(...e)}function de(...e){return l("closeChampionPlayerDetailModal")(...e)}function Ce(...e){return l("getChargeChartSize")(...e)}function Ya(...e){return l("getChampionTeamSavedScarletCounterEnabled")(...e)}function Qa(...e){return l("getChampionTeamSavedRosannaSacrificeFrames")(...e)}function Za(...e){return l("simulateBattle")(...e)}function na(...e){return l("getChargeChartMarkup")(...e)}function et(...e){return l("formatFrame")(...e)}function at(...e){return l("getPaidArenaModeLabel")(...e)}function tt(...e){return l("getPaidArenaDataTeamKey")(...e)}function nt(...e){return l("computePaidArenaBattleResultsForRow")(...e)}function ia(...e){return l("normalizeTeamKey")(...e)}function it(...e){return l("getPaidArenaResultText")(...e)}function st(...e){return l("getTauntTargetState")(...e)}function ct(...e){return l("getEffectiveLinkOwnerForTeam")(...e)}function ot(...e){return l("isEffectiveLinkEnabledForTeam")(...e)}function rt(...e){return l("getEffectiveLinkTargetIdsForTeam")(...e)}function lt(...e){return l("isRosanna")(...e)}function ut(...e){return l("sanitizeSacrificeFrame")(...e)}function dt(...e){return l("getCubeIconSrc")(...e)}function mt(...e){return l("getSavedCharacterCubeType")(...e)}function pt(...e){return l("sanitizeUniversalCharge")(...e)}function ht(...e){return l("canShowFinishMarker")(...e)}function sa(...e){return l("isRedHood")(...e)}function ft(...e){return l("sanitizeRedHoodPierceCount")(...e)}function gt(...e){return l("isScarlet")(...e)}function yt(...e){return l("sanitizeScarletCounterEnabled")(...e)}function $t(...e){return l("formatChargeNumber")(...e)}function ca(...e){return l("formatNumber")(...e)}function St(...e){return l("canEditChargeSpeed")(...e)}function vt(...e){return l("sanitizeChargeSpeed")(...e)}function bt(...e){return l("getDisplayMagazine")(...e)}function kt(...e){return l("isLocalDevRuntime")(...e)}function Ct(...e){return l("getStandardChargeBand")(...e)}function Mt(...e){return l("getRosannaSacrificeFrameState")(...e)}function wt(...e){return l("getRedHoodPierceCountState")(...e)}function Tt(...e){return l("getScarletCounterEnabledState")(...e)}function At(...e){return l("normalizeJackalLink")(...e)}function oa(...e){return l("getSavedCharacterChargeSpeed")(...e)}function ra(...e){return l("getSavedCharacterRedHoodPierceCount")(...e)}function la(...e){return l("createEmptyJackalLinkState")(...e)}function ua(...e){return l("isJackal")(...e)}function da(...e){return l("isLinkProvider")(...e)}function ma(...e){return l("createEmptyPaidArenaLineupSlot")(...e)}function pa(...e){return l("normalizePaidArenaLineupSlot")(...e)}function ha(...e){return l("isPaidArenaModeActive")(...e)}function fa(...e){return l("saveCurrentPaidArenaLineupSlot")(...e)}function ga(...e){return l("ensurePaidArenaLineupSlots")(...e)}function ya(...e){return l("getPaidArenaLineupSlotCount")(...e)}function $a(...e){return l("loadPaidArenaLineupSlot")(...e)}function Sa(...e){return l("syncPaidArenaChargeSpeedsFromSavedData")(...e)}function va(...e){return l("closeChampionDataModal")(...e)}function ba(...e){return l("hideChartTooltip")(...e)}function ka(...e){return l("saveTeam")(...e)}function Ca(...e){return l("render")(...e)}function Me(...e){return l("showToast")(...e)}function Ma(...e){return l("clearOpenSettings")(...e)}function we(...e){return l("withPaidArenaSimulationState")(...e)}function Y(...e){return l("getStunWindowsForTeam")(...e)}function Te(...e){return l("getDodgedStunEventsForTeam")(...e)}function Q(...e){return l("simulateBurst")(...e)}function Ae(...e){return l("getSpecialChargeEventsForTeam")(...e)}function wa(...e){return l("getSharedBattleCalculationEndFrame")(...e)}function Z(...e){return l("getResultSignature")(...e)}function Re(e,t,a,n){const s=n.map(r=>{const d=String(r.value??r),m=String(r.label??r);return`<option value="${i(d)}"${String(a||"")===d?" selected":""}>${i(m)}</option>`}).join("");return`
    <label class="champion-data-select">
      <span>${i(t)}</span>
      <select id="${i(e)}" name="${i(e)}">${s}</select>
    </label>
  `}function me(e={}){const t=e?.name||"",a=ce(e?.character_id??e?.characterId??e?.id),n=X(a)||ve(t),s=String(e?.name_code??e?.nameCode??"").trim(),r=s?`assets/avatars/namecode/${encodeURIComponent(s)}.webp`:"",d=n?je(n):"",m=n?Ve(n):r?`<img src="${i(r)}" alt="${i(t||s)}" loading="lazy" />`:`<span class="avatar-fallback"><span class="avatar-fallback-name">${i(t||"?")}</span></span>`;return`
    <span class="champion-member ${d}">
      <span class="champion-member-avatar team-avatar">${m}</span>
      <span class="champion-member-meta">
        <span class="champion-member-name">${i(n?oe(n):t)}</span>
      </span>
    </span>
  `}function pe(e=[],t,a="",n={}){const s=be(t==="attack"?"attack":"defense"),r=a===t?" is-winner":"",d=n.chartIndex!==void 0?` role="button" tabindex="0" data-champion-chart-side="${i(t)}" data-champion-chart-index="${i(String(n.chartIndex))}"`:"";return`
    <div class="champion-round-team champion-${t}${r}"${d}>
      <strong>${i(s)}</strong>
      <div class="champion-member-list">
        ${Array.from({length:A()},(m,u)=>me(e[u]||{position:u+1})).join("")}
      </div>
    </div>
  `}function q(e=[]){return`
    <div class="champion-round-team champion-lineup-only">
      <div class="champion-member-list">
        ${Array.from({length:A()},(t,a)=>me(e[a]||{position:a+1})).join("")}
      </div>
    </div>
  `}function K(e){return`${Math.trunc((Number(e)||0)*1e4)/100}%`}function ee(e,t="",a={}){const n=Number(e?.recommend_score),s=Number.isFinite(n)&&n>0?`<span>${i(o(`\u63A8\u8350\u5206 ${Math.round(n)}`,`Score ${Math.round(n)}`))}</span>`:"",r=String(a.matchupTeamKey||""),d=r?` role="button" tabindex="0" data-champion-matchup-team-key="${i(r)}"`:"";return`
    <div class="${`champion-stat-card${a.selected?" is-selected":""}${r?" is-clickable":""}`}"${d}>
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${q(e.team||[])}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e.win_rate??e.winRate))}</strong>
        <span>${i(o(`${e.wins}\u80DC${e.losses}\u8D1F / ${e.games}\u573A`,`${e.wins}W ${e.losses}L / ${e.games}`))}</span>
        ${s}
      </div>
    </div>
  `}function Ta(e,t=""){const a=Number(e?.system_score),n=Array.isArray(e?.core_members)?e.core_members:[],s=Array.isArray(e?.common_fillers)?e.common_fillers:[],r=s.length?`
    <div class="champion-core-fillers">
      <strong>${i(o("\u5E38\u89C1\u7B2C5\u4EBA","Common 5th"))}</strong>
      <div class="champion-core-filler-list">
        ${s.slice(0,4).map(d=>{const m=X(d.character_id),u=m?oe(m):String(d.character_id||""),h=Number(d.games||d.count||0),f=Number(d.wins||0),y=Number(d.win_rate),$=Number.isFinite(y)&&y>0?K(y):"";return`
            <span class="champion-core-filler">
              <span>${i(u)}</span>
              <small>${i(o(`${h}\u573A${$?` / ${$}`:""}`,`${h}G${$?` / ${$}`:""}`))}</small>
              ${f?`<small>${i(o(`${f}\u80DC`,`${f}W`))}</small>`:""}
            </span>
          `}).join("")}
      </div>
    </div>
  `:"";return`
    <div class="champion-stat-card champion-core-stat-card">
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
        <small>${i(o("\u6838\u5FC34\u4EBA","Core 4"))}</small>
      </div>
      <div class="champion-stat-team">
        ${q(n)}
        ${r}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e?.win_rate))}</strong>
        <span>${i(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
        <span>${i(o(`\u4F53\u7CFB\u5206 ${Math.round(a||0)}`,`System ${Math.round(a||0)}`))}</span>
      </div>
    </div>
  `}function Le(e,t=""){const a=ce(e?.character_id),n=X(a),s=n?oe(n):String(e?.character_id||"");return`
    <div class="champion-stat-card champion-character-stat-card">
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${me({character_id:a,name:s})}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e?.win_rate))}</strong>
        <span>${i(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
      </div>
    </div>
  `}function Aa(e,t=""){return`
    <div class="champion-stat-card champion-matchup-stat-card">
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${q(e.opponent_team||[])}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e.win_rate))}</strong>
        <span>${i(o(`${e.wins||0}\u80DC${e.losses||0}\u8D1F / ${e.games||0}\u573A`,`${e.wins||0}W ${e.losses||0}L / ${e.games||0}`))}</span>
      </div>
    </div>
  `}function Ne(e=[],t){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${i(t)}</p>`:`
    <div class="champion-stats-list champion-matchup-list">
      ${e.map((a,n)=>Aa(a,`#${n+1}`)).join("")}
    </div>
  `}function Ra(e=[],t){if(!Array.isArray(e)||!e.length)return`<p class="champion-data-empty">${i(t)}</p>`;const a=new Map;e.forEach(s=>{const r=Number(s.game_no);!Number.isInteger(r)||r<1||(a.has(r)||a.set(r,[]),a.get(r).push(s))});const n=[1,2,3,4,5].filter(s=>a.has(s));return n.length?`
    <section class="champion-stat-section">
      <div class="champion-stats-list champion-round-stats-list">
        ${n.map(s=>{const r=(a.get(s)||[]).slice(0,5),d=r[0],m=r.slice(1),u=String(c().expandedStatRound||"")===String(s);return`
            <article class="champion-round-stat-group${u?" is-expanded":""}" data-champion-stat-round-group="${i(String(s))}">
              <button class="champion-round-stat-primary" type="button" data-champion-stat-round-toggle="${i(String(s))}" aria-expanded="${u?"true":"false"}">
                ${ee(d,`R${s}`)}
                ${m.length?`<span class="champion-round-stat-stack" aria-hidden="true">${m.map(()=>"<i></i>").join("")}</span>`:""}
              </button>
              ${m.length?`
                <div class="champion-round-stat-extra">
                  ${m.map((h,f)=>ee(h,`#${f+2}`)).join("")}
                </div>
              `:""}
            </article>
          `}).join("")}
      </div>
    </section>
  `:`<p class="champion-data-empty">${i(t)}</p>`}function La(e=[],t,a={}){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${i(t)}</p>`:a.showRound?Ra(e,t):`
    <section class="champion-stat-section">
      <div class="champion-stats-list">
        ${e.map((n,s)=>ee(n,`#${s+1}`)).join("")}
      </div>
    </section>
  `}function Na(e={}){const t=c().selectedStatSide==="combined"?"combined":c().selectedStatSide==="defense"?"defense":"attack";let a=["recommend","systems","rate","round","characters"].includes(c().selectedStatRankType)?c().selectedStatRankType:"games";t==="combined"&&!["recommend","systems","characters"].includes(a)&&(a="recommend"),t!=="combined"&&["recommend","systems","characters"].includes(a)&&(a="games");const n=Array.isArray(e?.topByRate)?e.topByRate:[],s=Array.isArray(e?.topByGames)?e.topByGames:[],r=Array.isArray(e?.bestByRound)?e.bestByRound:[],d=Array.isArray(e?.ranking?.recommendations)?e.ranking.recommendations:[],m=Array.isArray(e?.ranking?.characters)?e.ranking.characters:[],u=Array.isArray(e?.ranking?.cores)?e.ranking.cores:[],h=e?.ranking?.matchups&&typeof e.ranking.matchups=="object"?e.ranking.matchups:{},f=Array.isArray(h.strongAgainst)?h.strongAgainst:[],y=Array.isArray(h.weakAgainst)?h.weakAgainst:[],$=String(c().selectedMatchupTeamKey||""),k=$?d.find(M=>String(M?.team_key||"")===$):null,S=Math.max(0,Math.trunc(Number(e?.minWins)||30)),w=o("\u63A8\u8350\u5206 = \u80DC\u7387\xD755 + \u6837\u672C\u5206\xD720 + \u51FA\u573A\u5206\xD715 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710\u3002\u6837\u672C\u5206\u6309\u8FBE\u5230\u6700\u4F4E\u80DC\u573A\u8BA1\u7B97\uFF0C\u51FA\u573A\u5206\u6309\u5F53\u524D\u8303\u56F4\u6700\u9AD8\u51FA\u573A\u8BA1\u7B97\u3002","Score = win rate x55 + sample x20 + usage x15 + season coverage x10. Sample score uses the minimum wins threshold; usage score is relative to the highest games in the current scope."),v=o("\u4F53\u7CFB\u5206 = \u80DC\u7387\xD745 + \u6837\u672C\u5206\xD718 + \u51FA\u573A\u5206\xD714 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710 + \u53D8\u4F53\u5206\xD713\u3002\u4F53\u7CFB\u63094\u4EBA\u6838\u5FC3 + \u5E38\u89C1\u7B2C5\u4EBA\u7EDF\u8BA1\uFF0C\u4E0D\u533A\u5206\u7AD9\u4F4D\u3002","System score = win rate x45 + sample x18 + usage x14 + season coverage x10 + variant x13. Systems are counted as a 4-unit core plus common 5th variants, ignoring positions."),g=a==="recommend"?d:a==="systems"?u:a==="rate"?n:a==="round"?r:a==="characters"?m:s,C=a==="recommend"?o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."):a==="rate"?o(`\u6682\u65E0${S}\u80DC\u4EE5\u4E0A\u80DC\u7387\u7EDF\u8BA1\u3002`,`No win-rate data with at least ${S} wins.`):a==="characters"?o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."):a==="systems"?o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."):a==="round"?o("\u6682\u65E0\u5C40\u5185\u8D70\u4F4D\u7EDF\u8BA1\u3002","No round-position data."):o("\u6682\u65E0\u51FA\u573A\u7EDF\u8BA1\u3002","No usage data.");return!n.length&&!s.length&&!r.length&&!d.length&&!m.length&&!u.length?`
      <section class="champion-stats-panel">
        ${fe(t)}
        ${he(a,S,t)}
        <p class="champion-data-empty">${i(o("\u6682\u65E0\u53EF\u7EDF\u8BA1\u7684\u961F\u4F0D\u6570\u636E\u3002","No team statistics data."))}</p>
      </section>
    `:t==="combined"?`
      <section class="champion-stats-panel">
        ${fe(t)}
        ${he(a,S,t)}
        <section class="champion-stat-section champion-combined-stat-section">
          <div class="champion-stats-head">
            <div class="champion-stats-title">
              <strong>${i(a==="characters"?o("\u89D2\u8272\u699C","Characters"):a==="systems"?o("\u4F53\u7CFB\u699C\uFF084+1\uFF0C\u4E0D\u5206\u7AD9\u4F4D\uFF09","Systems (4+1, positionless)"):o("\u7EFC\u5408\u63A8\u8350","Recommended"))}</strong>
              ${a==="recommend"||a==="systems"?`
                <span class="champion-score-help-wrap">
                  <button class="champion-score-help" type="button" aria-label="${i(a==="systems"?v:w)}" aria-describedby="championScoreTooltip">?</button>
                </span>
              `:""}
            </div>
            <span>${i(a==="characters"?o("\u6309\u51FA\u573A\u91CF\u548C\u80DC\u7387\u5C55\u793A\u73AF\u5883\u89D2\u8272","Shows meta characters by usage and win rate."):a==="systems"?o("\u63094\u4EBA\u6838\u5FC3\u548C\u5E38\u89C1\u7B2C5\u4EBA\u53D8\u4F53\u5C55\u793A\u4F53\u7CFB","Shows systems as a 4-unit core plus common 5th variants."):o("\u6309\u80DC\u7387\u3001\u6837\u672C\u3001\u51FA\u573A\u548C\u8D5B\u5B63\u8986\u76D6\u7EFC\u5408\u6392\u5E8F","Ranked by win rate, sample size, usage, and season coverage."))}</span>
            ${a==="recommend"||a==="systems"?`<span id="championScoreTooltip" class="champion-score-tooltip" role="tooltip">${i(a==="systems"?v:w)}</span>`:""}
          </div>
          <div class="champion-stats-list">
            ${a==="characters"?m.length?m.map((M,b)=>Le(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."))}</p>`:a==="systems"?u.length?u.map((M,b)=>Ta(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."))}</p>`:d.length?d.map((M,b)=>ee(M,`#${b+1}`,{matchupTeamKey:M.team_key,selected:$&&$===String(M.team_key||"")})).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."))}</p>`}
          </div>
        </section>
        ${a==="recommend"&&$?`
          <section class="champion-stat-section champion-matchup-section">
            <div class="champion-matchup-head">
              <div class="champion-matchup-heading">
                <strong>${i(o("\u514B\u5236\u67E5\u8BE2","Matchups"))}</strong>
              </div>
              <button class="champion-matchup-back" type="button" data-champion-matchup-back>
                ${i(o("\u8FD4\u56DE\u63A8\u8350\u5217\u8868","Back to recommendations"))}
              </button>
              <div class="champion-matchup-selected-team" aria-label="${i(o("\u5DF2\u9009\u961F\u4F0D","Selected team"))}">
                ${q(k?.team||[])}
              </div>
            </div>
            <div class="champion-matchup-columns">
              <section class="champion-matchup-column">
                <strong>${i(o("\u64C5\u957F\u6253\u8C01","Strong against"))}</strong>
                ${Ne(f,o("\u6682\u65E0\u514B\u5236\u6570\u636E\u3002","No favorable matchup data."))}
              </section>
              <section class="champion-matchup-column">
                <strong>${i(o("\u6015\u8C01","Weak against"))}</strong>
                ${Ne(y,o("\u6682\u65E0\u88AB\u514B\u6570\u636E\u3002","No weak matchup data."))}
              </section>
            </div>
          </section>
        `:""}
      </section>
    `:`
    <section class="champion-stats-panel">
      ${fe(t)}
      ${he(a,S,t)}
      ${a==="characters"?`<section class="champion-stat-section"><div class="champion-stats-list">${m.length?m.map((M,b)=>Le(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(C)}</p>`}</div></section>`:La(g,C,{showRound:a==="round"})}
    </section>
  `}function he(e="games",t=30,a="attack"){return a==="combined"?`
      <div class="champion-stat-rank-tabs is-combined" role="tablist" aria-label="${i(o("\u7EFC\u5408\u7EDF\u8BA1\u699C\u5355","Combined ranking type"))}">
        <button class="champion-stat-rank-tab${e==="recommend"?" is-active":""}" type="button" data-champion-stat-rank="recommend">
          ${i(o("\u7EFC\u5408\u63A8\u8350","Recommended"))}
        </button>
        <button class="champion-stat-rank-tab${e==="systems"?" is-active":""}" type="button" data-champion-stat-rank="systems">
          ${i(o("\u4F53\u7CFB\u699C\uFF084+1\uFF09","Systems (4+1)"))}
        </button>
        <button class="champion-stat-rank-tab${e==="characters"?" is-active":""}" type="button" data-champion-stat-rank="characters">
          ${i(o("\u89D2\u8272\u699C","Characters"))}
        </button>
      </div>
    `:`
    <div class="champion-stat-rank-tabs" role="tablist" aria-label="${i(o("\u80DC\u7387\u7EDF\u8BA1\u699C\u5355","Win-rate ranking type"))}">
      <button class="champion-stat-rank-tab${e==="games"?" is-active":""}" type="button" data-champion-stat-rank="games">
        ${i(o("\u51FA\u573A\u524D5","Top 5 Usage"))}
      </button>
      <button class="champion-stat-rank-tab${e==="rate"?" is-active":""}" type="button" data-champion-stat-rank="rate">
        ${i(o(`\u80DC\u7387\u524D5(${t}\u80DC+)`,`Top 5 Win Rate (${t}W+)`))}
      </button>
      <button class="champion-stat-rank-tab${e==="round"?" is-active":""}" type="button" data-champion-stat-rank="round">
        ${i(o("\u5C40\u5185\u6700\u591A\u4F7F\u7528","Most Used by Round"))}
      </button>
    </div>
  `}function fe(e="attack"){return`
    <div class="champion-stat-side-tabs" role="tablist" aria-label="${i(o("\u80DC\u7387\u7EDF\u8BA1\u4F4D\u7F6E","Win-rate side"))}">
      <button class="champion-stat-side-tab is-combined${e==="combined"?" is-active":""}" type="button" data-champion-stat-side="combined">
        ${i(o("\u7EFC\u5408","Combined"))}
      </button>
      <button class="champion-stat-side-tab is-attack${e==="attack"?" is-active":""}" type="button" data-champion-stat-side="attack">
        ${i(o("\u8FDB\u653B\u961F","Attack Teams"))}
      </button>
      <button class="champion-stat-side-tab is-defense${e==="defense"?" is-active":""}" type="button" data-champion-stat-side="defense">
        ${i(o("\u9632\u5B88\u961F","Defense Teams"))}
      </button>
    </div>
  `}function Wa(e,t=0){const a=e.winner==="attack"?o("\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u5B88\u65B9\u80DC","Defense Win"):o("\u672A\u77E5","Unknown"),n=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",s=re(e);return`
    <article class="champion-round-card ${n}">
      <div class="champion-round-head">
        <strong>Round ${i(String(s||"?"))}</strong>
        <span>${i(a)}</span>
      </div>
      <div class="champion-round-teams">
        ${pe(e.attack_team||[],"attack",e.winner,{chartIndex:t})}
        <span class="champion-round-vs">VS</span>
        ${pe(e.defense_team||[],"defense",e.winner,{chartIndex:t})}
      </div>
      ${qa(e,t)}
    </article>
  `}function Rt(e){const t=e.winner==="attack"?o("\u8FDB\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u8FDB\u653B\u65B9\u8D1F","Attack Lose"):o("\u672A\u77E5","Unknown"),a=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",n=re(e);return`
    <article class="champion-round-card champion-attack-only ${a}">
      <div class="champion-round-head">
        <strong>Round ${i(String(n||"?"))}</strong>
        <span>${i(e.attack_player||o("\u8FDB\u653B\u65B9","Attack"))} VS ${i(e.defense_player||o("\u9632\u5B88\u65B9","Defense"))} \xB7 ${i(t)}</span>
      </div>
      ${pe(e.attack_team||[],"attack",e.winner)}
    </article>
  `}function Ea(e,t=""){const n=e.defense_player===t&&e.attack_player!==t?"defense":"attack",s=re(e);return`
    <article class="champion-round-card champion-lineup-card">
      <div class="champion-round-head">
        <strong>Round ${i(String(s||"?"))}</strong>
      </div>
      ${q(e[`${n}_team`]||[])}
    </article>
  `}function Fa(e={}){const t=ce(e?.character_id??e?.characterId??e?.id);return X(t)||ve(e?.name||"")}function z(e=[]){return Array.from({length:A()},(t,a)=>Fa(e[a]||null)||null)}function xa(e=[],t="attack"){return Array.from({length:A()},(a,n)=>{const s=e?.[n];return s?oa(s,t):0})}function Pa(e=[],t="attack"){return Array.from({length:A()},(a,n)=>{const s=e?.[n];return s&&sa(s)?ra(s,t):0})}const Da=[0,2,4];function We(e=[]){const t=e.find(s=>s&&ua(s))||e.find(s=>s&&da(s));if(!t)return la();const a=e.findIndex(s=>s&&s.id===t.id),n=[...new Set([a,...Da])].filter(s=>Number.isInteger(s)&&s>=0&&s<A()&&!!e[s]);return{enabled:!0,ownerId:t.id,targetIds:n.map(s=>e[s]).filter(s=>s&&s.id!==t.id).map(s=>s.id).slice(0,2),fixedLinkedPositionIndices:n}}function Ia(e=[]){const a=ma("c");return e.slice(0,Se("c")).forEach((n,s)=>{const r=z(n.attack_team||[]),d=z(n.defense_team||[]);[{teamKey:"attack",team:r},{teamKey:"defense",team:d}].forEach(({teamKey:u,team:h})=>{a.teams[u][s]=h.map(f=>f?.id||null),a.chargeSpeeds[u][s]=xa(h,u),a.redHoodPierceCounts[u][s]=Pa(h,u),a.scarletCounterEnabled[u][s]=Array(A()).fill(!0),a.jackalLinks[u][s]=We(h)})}),a.activeRowIndex=0,a.activeTeamKey="attack",pa(a,"c")}function _a(e=[]){const t=Array.isArray(e)?e.slice(0,Se("c")):[];if(!t.some(r=>{const d=z(r.attack_team||[]),m=z(r.defense_team||[]);return[...d,...m].some(Boolean)})){Me(o("\u8D5B\u5B63\u961F\u4F0D\u4E3A\u7A7A\uFF0C\u65E0\u6CD5\u5957\u7528","Season teams are empty and cannot be applied"));return}const n=se();ha()&&fa(n.paidArenaMode);const s=ga("c");ya(s[0],"c")>0&&!window.confirm(o("\u5F53\u524D\u5C06\u8986\u76D6\u65B9\u68481\uFF0C\u662F\u5426\u786E\u8BA4\uFF1F","This will overwrite Plan 1. Continue?"))||(s[0]=Ia(t),n.paidArenaMode="c",n.testMode=!1,n.paidArenaActiveLineupIndex.c=0,n.paidArenaDisplayMode="round",n.paidArenaDataTeamKey="attack",n.paidArenaActiveRowIndex=0,$a("c",0),n.paidArenaDisplayMode="round",n.paidArenaDataTeamKey="attack",n.paidArenaActiveRowIndex=0,Sa("c"),Ma(),de(),va(),ba(),ka(),Ca(),Me(o("\u5DF2\u5957\u7528\u6574\u573A\u5BF9\u5C40\u5230\u51A0\u519B\u7ADE\u6280\u573A\u65B9\u68481","Applied the full match to Champion Arena Plan 1")))}function ae(e=[],t="attack"){const a=z(e);return{mode:"c",teamKey:ia(t),rowIndex:0,team:a,universalCharges:Array(A()).fill(0),sacrificeFrames:Array(A()).fill(null),redHoodPierceCounts:Array(A()).fill(0),scarletCounterEnabled:Array(A()).fill(!0),jackalLink:We(a),chargeSpeeds:Array(A()).fill(0),result:null}}function Ee(e={}){const t=ae(e.attack_team||[],"attack"),a=ae(e.defense_team||[],"defense"),n=se(),s=n.allowMissedShots;n.allowMissedShots=!1;try{return we(t,a,()=>{let r=Y("attack"),d=Y("defense"),m=[],u=[],h=Q(n.team,"attack",[],[],[],r,[],t.universalCharges,n.defenseTeam,t.sacrificeFrames,m),f=Q(n.defenseTeam,"defense",[],[],[],d,[],a.universalCharges,n.team,a.sacrificeFrames,u);for(let y=0;y<8;y+=1){r=Y("attack",h?.reloadTimeline||[]),d=Y("defense",f?.reloadTimeline||[]),m=Te("attack",h?.reloadTimeline||[]),u=Te("defense",f?.reloadTimeline||[]);const $=Ae(h,f),k=Ae(f,h),S=wa(h,f),w=Q(n.team,"attack",$,f?.reloadTimeline||[],f?.turnDodgeTimeline||[],r,f?.tauntTimeline||[],t.universalCharges,n.defenseTeam,t.sacrificeFrames,m,{continueUntilFrame:S}),v=Q(n.defenseTeam,"defense",k,h?.reloadTimeline||[],h?.turnDodgeTimeline||[],d,h?.tauntTimeline||[],a.universalCharges,n.team,a.sacrificeFrames,u,{continueUntilFrame:S}),g=Z(w)===Z(h)&&Z(v)===Z(f);if(h=w,f=v,g)break}return{attackResult:h,defenseResult:f}})}finally{n.allowMissedShots=s}}function Fe(e){return!e||e.error||!Number.isFinite(e.fullFrame)?"?RL":`${ca(e.fullFrame/76,2)}RL`}function Ba(e={}){try{const{attackResult:t,defenseResult:a}=Ee(e);return`${Fe(t)} VS ${Fe(a)}`}catch{return"?RL VS ?RL"}}function Ha(e){requestAnimationFrame(()=>{const t=e.getBoundingClientRect(),a=window.innerHeight||document.documentElement.clientHeight;(t.bottom>a-16||t.top<16)&&e.scrollIntoView({block:"nearest",behavior:"smooth"})})}function xe(e){const t=e?.getBoundingClientRect?.(),a=Ce();return{width:Math.max(320,Math.round(t?.width||a.width||1800)),height:Math.max(260,Math.round(t?.height||a.height||660))}}function Pe(e={},t=Ce()){const a=ae(e.attack_team||[],"attack"),n=ae(e.defense_team||[],"defense"),s=se(),r=s.allowMissedShots;s.allowMissedShots=!1;try{return we(a,n,()=>{const{attackResult:d,defenseResult:m}=Ee(e);return na(d,null,m,t)})}finally{s.allowMissedShots=r}}function De(e,t=[]){const a=Number(e?.dataset?.championChartIndex);if(!Number.isInteger(a)||!t[a])return;const n=e.closest(".champion-round-card");if(!n)return;const s=e?.dataset?.championChartSide||"summary",r=`${a}:${s}`,m=n.querySelector(".champion-inline-chart")?.dataset?.championChartKey===r;if(document.querySelectorAll(".champion-inline-chart").forEach(y=>y.remove()),document.querySelectorAll(".champion-round-team.is-chart-active, .champion-round-chart-toggle.is-chart-active").forEach(y=>y.classList.remove("is-chart-active")),m)return;const u=document.createElement("div"),h=t[a].winner==="attack"?"is-attack-win":t[a].winner==="defense"?"is-defense-win":"";u.className=`champion-inline-chart charge-chart ${h}`.trim(),u.dataset.championChartKey=r,n.append(u);const f=t[a];u.innerHTML=Pe(f,xe(u)),requestAnimationFrame(()=>{!u.isConnected||u.dataset.championChartKey!==r||(u.innerHTML=Pe(f,xe(u)))}),e.classList.add("is-chart-active"),n.querySelector(".champion-round-chart-toggle")?.classList.add("is-chart-active"),Ha(u)}function qa(e={},t=0){return`
    <button class="champion-round-chart-toggle" type="button" data-champion-chart-index="${i(String(t))}">
      <span class="champion-round-chart-toggle-speed">${i(Ba(e))}</span>
      <span class="champion-round-chart-toggle-hint">${i(o("\u70B9\u51FB\u53EF\u67E5\u770B\u5145\u80FD\u8BE6\u60C5","Tap to view charge details"))}</span>
    </button>
  `}function O(e,t,a={}){if(!e?.playerName)return"";const n=e.side==="attack"?"is-attack-win":e.side==="defense"?"is-defense-win":"",s=!!a.hideMeta,r=!!a.hideStage,d=Array.from(String(e.playerName||"")).length,m=d>6?" is-name-tiny":d>4?" is-name-small":"",u=s?"":`<span class="champion-player-seed">${i(t)}</span>`,h=s||r?"":`<span class="champion-player-stage">${i(e.scoreText||e.stageLabel||"")}</span>`,f=e.altMatchKey?` data-champion-alt-match="${i(String(e.altMatchKey))}" data-champion-alt-label="${i(String(e.altMatchLabel||""))}"`:"";return`
    <button class="champion-player-node ${n}${e.isWinner?" is-winner":" is-loser"}" type="button" data-champion-player="${i(e.playerName)}" data-champion-match="${i(String(e.matchKey||""))}" data-champion-detail="${i(e.detailMode||"match")}"${f}>
      ${u}
      <span class="champion-player-name${m}"><span class="champion-player-name-text">${i(e.playerName)}</span></span>
      ${h}
    </button>
  `}function Lt(e,t){const a=e.rows[0]||{},n=N(e.rows),s={playerName:a.attack_player||"",matchKey:e.key,side:"attack",stageLabel:e.stageLabel,scoreText:`${n.attackWins}`,isWinner:n.winner==="attack"},r={playerName:a.defense_player||"",matchKey:e.key,side:"defense",stageLabel:e.stageLabel,scoreText:`${n.defenseWins}`,isWinner:n.winner==="defense"},d=s.isWinner?s:r.isWinner?r:s,m=s.isWinner?r:r.isWinner?s:r;return`
    <article class="champion-match-pair">
      <div class="champion-match-pair-label">${i(e.matchLabel==="FINAL"?"FINAL":`M${t+1}`)}</div>
      <div class="champion-match-pair-nodes">
        ${O(d,"WIN")}
        ${O(m,"LOSE")}
      </div>
    </article>
  `}function W(e){const t=e?.rows?.[0]||{},a=N(e?.rows||[]);return[{playerName:t.attack_player||"",matchKey:e?.key||"",side:"attack",stageLabel:e?.stageLabel||"",scoreText:`${a.attackWins}`,isWinner:a.winner==="attack"},{playerName:t.defense_player||"",matchKey:e?.key||"",side:"defense",stageLabel:e?.stageLabel||"",scoreText:`${a.defenseWins}`,isWinner:a.winner==="defense"}].filter(n=>n.playerName)}function Ka(e,t=[]){if(!e||!t.length)return"winner";const a=t.find(n=>W(n).some(s=>s.playerName===e));return a?H(a.rows)===e?"winner":"loser":"winner"}function Nt(e=[],t=[],a=[]){const n=a[0]||null,s=n?H(n.rows):"",r=t.length?getChampionWinnerNodes(t).map(u=>({...u,isWinner:u.playerName===s})):n?W(n).map(u=>({...u,isWinner:u.playerName===s})):[],d=getChampionWinnerNodes(e).map(u=>({...u,isWinner:Ka(u.playerName,t)==="winner"})),m=e.flatMap(u=>W(u).map(h=>({...h,detailMode:"player-team",isWinner:h.isWinner})));return[{key:"champion",label:o("\u5C0F\u7EC4\u51A0\u519B","Group Champion"),nodes:s?[{playerName:s,matchKey:n?.key||"",side:N(n?.rows||[]).winner,stageLabel:o("\u51A0\u519B","Champion"),scoreText:"WIN",isWinner:!0}]:[]},{key:"top2",label:"2\u8FDB1",nodes:r,matches:n?[n]:[]},{key:"top4",label:"4\u8FDB2",nodes:d,matches:t},{key:"top8",label:"8\u8FDB4",nodes:m,matches:e}]}function za(e,t,a){const n=a?.key==="top2"||a?.key==="top4";return O(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:!n,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function Ie(e,t,a,n={}){const s=!!n.showScore,r=!!n.hideMeta;return O(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:r||!s,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function Oa(e,t,a){const n=W(e),s=N(e.rows||[]),r=n.find(h=>h.isWinner)||n[0];if(!r)return"";const d=a?.key==="top2"||a?.key==="top4",m=Ie({...r,scoreText:`${s.attackWins}:${s.defenseWins}`,isWinner:!0},0,a,{showScore:d}),u=n.map((h,f)=>Ie({...h,detailMode:a?.key==="top8"?"player-team":h.detailMode},f+1,a,{hideMeta:a?.key==="top8"})).join("");return`
    <article class="champion-tree-match-card champion-tree-match-${i(a?.key||"")}">
      <div class="champion-tree-match-winner">${m}</div>
      <div class="champion-tree-match-lines" aria-hidden="true"></div>
      <div class="champion-tree-match-participants">
        ${u}
      </div>
    </article>
  `}function Wt(e){const t=Array.isArray(e.matches)&&e.matches.length>0;return`
    <section class="champion-tree-row champion-tree-${i(e.key)}">
      <div class="champion-tree-row-title">${i(e.label)}</div>
      <div class="${t?"champion-tree-row-matches":"champion-tree-row-nodes"}">
        ${t?e.matches.map((a,n)=>Oa(a,n,e)).join(""):e.nodes.length?e.nodes.map((a,n)=>za(a,n,e)).join(""):`<span class="champion-empty-node">${i(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function _e(e=[],t=[],a=new Set){const n=e.map(r=>H(r.rows||[])).filter(Boolean),s=t.find(r=>a.has(r.key)?!1:W(r).some(d=>n.includes(d.playerName)));return s?.key&&a.add(s.key),s||null}function te(e,t="",a={}){const n=!!a.hideMeta,s=a.detailMode||e?.detailMode||"match";return O({...e,detailMode:s},t,{hideMeta:n,hideStage:!0}).replace('class="champion-player-node ','class="champion-player-node champion-tree-node champion-elim-node ')}function Et(e,t,a={}){if(!e?.rows?.length)return"";const n=W(e),s=N(e.rows||[]),r=n.find(u=>u.isWinner)||n[0];if(!r)return"";const d=!!a.hideParticipantMeta,m=`${s.attackWins}:${s.defenseWins}`;return`
    <article class="champion-elim-match">
      <div class="champion-elim-match-label">${i(t)}</div>
      <div class="champion-elim-match-winner">
        ${te({...r,scoreText:m,isWinner:!0},m)}
      </div>
      <div class="champion-elim-lines" aria-hidden="true"></div>
      <div class="champion-elim-participants">
        ${n.map(u=>te({...u,detailMode:a.participantDetailMode||u.detailMode},u.isWinner?u.scoreText||"WIN":u.scoreText||"LOSE",{hideMeta:d})).join("")}
      </div>
    </article>
  `}function ge(e={}){return`${e.attackWins||0}:${e.defenseWins||0}`}function D(e,t,a="",n={}){return e?.playerName?`<div class="champion-elim-slot ${i(t)}">${te(e,a,n)}</div>`:`<span class="champion-empty-node ${i(t)}">${i(o("\u6682\u65E0","Empty"))}</span>`}function ja(e,t={}){const a=e==="bottom",n=a?38:14,s=a?86:62,r=a?62:38,d=a?62:38,m=a?24:76,u=m,h=t.leftWinnerIndex===0,f=t.rightWinnerIndex===0,y=t.halfWinnerSide==="left",$=(v,g)=>`<path class="champion-elim-line-path ${g?"is-win-line":"is-lose-line"}" d="${v}" />`,k=(v,g,C=m)=>`
    <svg class="champion-elim-lines-svg ${v}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      ${$(`M ${g.leftOuter} ${n} H ${g.leftMergeX} V ${r} H ${g.leftWinner}`,h)}
      ${$(`M ${g.leftOuter} ${s} H ${g.leftMergeX} V ${r} H ${g.leftWinner}`,!h)}
      ${$(`M ${g.rightOuter} ${n} H ${g.rightMergeX} V ${r} H ${g.rightWinner}`,f)}
      ${$(`M ${g.rightOuter} ${s} H ${g.rightMergeX} V ${r} H ${g.rightWinner}`,!f)}
      ${$(`M ${g.leftFinal} ${d} H 50 V ${C}`,y)}
      ${$(`M ${g.rightFinal} ${d} H 50 V ${C}`,!y)}
    </svg>
  `,S={leftOuter:12,leftMergeX:20,leftWinner:23.5,rightOuter:88,rightMergeX:80,rightWinner:76.5,leftFinal:39,rightFinal:61},w={leftOuter:18,leftMergeX:21,leftWinner:21.5,rightOuter:82,rightMergeX:79,rightWinner:78.5,leftFinal:41,rightFinal:59};return`
    ${k("is-desktop-lines",S)}
    ${k("is-mobile-lines",w,u)}
  `}function Va(e,t=null,a=null){return e&&(t?.rows?.length?W(t):[]).find(s=>s.playerName===e)||a}function Be(e,t=[],a=null,n=null){const s=t.slice(0,2).map(b=>{const E=W(b).map(F=>({...F,detailMode:"player-team"}));return{group:b,participants:E,winner:E.find(F=>F.isWinner)||E[0]||null,summary:N(b.rows||[])}}),r=s[0]||{},d=s[1]||{},m=r.participants||[],u=d.participants||[],h=N(a?.rows||[]),f=a?W(a):[],y=f.find(b=>b.isWinner)||f[0]||null,$=N(n?.rows||[]),k=n?H(n.rows):"",S=y?{...Va(y.playerName,n,y)||y,scoreText:ge(h),isWinner:k?y.playerName===k:!0,altMatchKey:a?.key||"",altMatchLabel:o("\u67E5\u770B4\u8FDB2\u5BF9\u5C40","View semifinal")}:null,w=r.winner?{...r.winner,scoreText:ge(r.summary),isWinner:!0}:null,v=d.winner?{...d.winner,scoreText:ge(d.summary),isWinner:!0}:null,g=b=>{const E=b.participants||[],F=b.winner?.playerName,j=E.findIndex(ne=>ne.playerName===F);return j>=0?j:0},C=y?.playerName&&v?.playerName===y.playerName?"right":"left",M=e==="top"?o("\u4E0A\u534A\u533A","Upper Half"):o("\u4E0B\u534A\u533A","Lower Half");return`
    <section class="champion-elim-half champion-elim-half-${i(e)}" aria-label="${i(M)}">
      ${ja(e,{leftWinnerIndex:g(r),rightWinnerIndex:g(d),halfWinnerSide:C})}
      ${D(m[0],"slot-left-1","",{hideMeta:!0})}
      ${D(u[0],"slot-right-1","",{hideMeta:!0})}
      ${D(w,"slot-left-winner",w?.scoreText||"",{detailMode:"match"})}
      ${D(v,"slot-right-winner",v?.scoreText||"",{detailMode:"match"})}
      ${D(m[1],"slot-left-2","",{hideMeta:!0})}
      ${D(u[1],"slot-right-2","",{hideMeta:!0})}
      ${D(S,"slot-half-winner",S?.scoreText||"",{detailMode:"match"})}
      <span class="champion-elim-connector connector-left-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-left-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-half-final" aria-hidden="true"></span>
    </section>
  `}function Ft(e=null,t=[]){const a=e?.rows?.length?W(e):getChampionWinnerNodes(t),n=N(e?.rows||[]),s=e?H(e.rows):"",r=e?`${n.attackWins}:${n.defenseWins}`:"";return`
    <section class="champion-elim-final" aria-label="${i(o("\u51B3\u8D5B","Final"))}">
      <div class="champion-elim-final-label">${i(o("2\u8FDB1","Final"))}</div>
      <div class="champion-elim-final-lines" aria-hidden="true"></div>
      <div class="champion-elim-final-nodes">
        ${a.length?a.map(d=>te({...d,scoreText:r,isWinner:s?d.playerName===s:d.isWinner},r||(d.isWinner?"WIN":"LOSE"),{hideMeta:!e})).join(""):`<span class="champion-empty-node">${i(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function Ua(e=[],t=[],a=[]){const n=e.slice(0,2),s=e.slice(2,4),r=new Set,d=_e(n,t,r),m=_e(s,t,r)||t.find(h=>!r.has(h.key))||null,u=a[0]||null;return`
    <div class="champion-elim-board">
      ${Be("top",n,d,u)}
      <div class="champion-elim-vs" aria-hidden="true">VS</div>
      ${Be("bottom",s,m,u)}
    </div>
  `}function ye(e,t="",a="match",n="",s=""){de();const r=Ue(ke(),t),d=r[0]||{},m=a==="player-team",u=N(r),h=d.attack_player||o("\u8FDB\u653B\u65B9","Attack"),f=d.defense_player||o("\u9632\u5B88\u65B9","Defense"),y=!m&&n&&n!==t,$=c().selectedDivision==="champion"?o("\u67E5\u770B\u51A0\u519B\u5BF9\u5C40","View final"):o("\u67E5\u770B\u5C0F\u7EC4\u51A0\u519B\u5BF9\u5C40","View group final"),k=m?i(`${e||o("\u9009\u624B","Player")} ${o("\u961F\u4F0D\u4FE1\u606F","Teams")}`):`
      <span class="champion-matchup-player is-attack">${i(h)}</span>
      <span class="champion-matchup-score">\uFF08${i(String(u.attackWins))} VS ${i(String(u.defenseWins))}\uFF09</span>
      <span class="champion-matchup-player is-defense">${i(f)}</span>
      ${y?`
        <button class="champion-round-apply-button champion-round-switch-button" type="button" data-champion-switch-match="${i(String(n))}" data-champion-switch-label="${i(String($))}">
          ${i(s||o("\u5207\u6362\u5BF9\u5C40","Switch match"))}
        </button>
      `:""}
      <button class="champion-round-apply-button" type="button" data-champion-apply-match="1">
        ${i(o("\u5957\u7528\u67E5\u770B","Apply to view"))}
      </button>
    `,S=m?`
      <strong>${i(o("\u53C2\u8D5B\u9635\u5BB9","Lineups"))}</strong>
      <span>${i(o("\u8BE5\u9009\u624B\u76845\u961F\u9635\u5BB9","This player's 5 lineups"))}</span>
    `:"",w=r.length?r.map((g,C)=>m?Ea(g,e):Wa(g,C)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u8BE5\u9009\u624B\u5BF9\u5C40\u3002","No matches for this player."))}</p>`,v=document.createElement("div");v.className="help-modal-backdrop champion-player-detail-backdrop",v.innerHTML=`
    <section class="help-modal champion-player-detail-modal" role="dialog" aria-modal="true" aria-label="${i(o("\u80DC\u8D1F\u6570\u636E\u961F\u4F0D","Match teams"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Champion</span>
          <strong class="${m?"":"champion-matchup-title"}">${k}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${i(o("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content champion-player-detail-content">
        ${S?`<div class="champion-round-title">${S}</div>`:""}
        <div class="champion-round-list">
          ${w}
        </div>
      </div>
    </section>
  `,document.body.append(v),v.querySelector(".help-modal-close")?.addEventListener("click",de),v.querySelectorAll("[data-champion-chart-index]").forEach(g=>{g.addEventListener("click",()=>De(g,r)),g.addEventListener("keydown",C=>{["Enter"," "].includes(C.key)&&(C.preventDefault(),De(g,r))})}),v.querySelector("[data-champion-apply-match]")?.addEventListener("click",()=>_a(r)),v.querySelector("[data-champion-switch-match]")?.addEventListener("click",g=>{const C=g.currentTarget?.dataset?.championSwitchMatch||"",M=g.currentTarget?.dataset?.championSwitchLabel||"";ye(e,C,"match",t,M)})}function L(e){const t=e?.querySelector(".champion-data-content");if(!t)return;if(t.classList.toggle("is-loading",!!c().loading),c().loading&&(c().loadingMode==="meta"||!Array.isArray(c().sourceSets))){t.innerHTML=`<p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u83B7\u53D6\u8D5B\u5B63\u6570\u636E...","Loading season data..."))}</p>`;return}if(c().error){t.innerHTML=`<p class="champion-data-empty is-error">${i(c().error)}</p>`;return}const a=Array.isArray(c().sourceSets)?c().sourceSets:[];if(!a.length){t.innerHTML=`<p class="champion-data-empty">${i(o("\u6682\u65E0\u51A0\u519B\u7ADE\u6280\u573A\u6570\u636E\u3002","No champion arena data."))}</p>`;return}const n=a.map(p=>J(p)).filter(Boolean),s=new Map(n.map(p=>{const x=a.find(I=>J(I)===p);return[p,x?.season||Xe(p)]})),r=Je([...new Set([...s.values()])]);c().selectedModule==="stats"&&!c().selectedSeason&&(c().selectedSeason=G()),c().selectedSeason===G()&&c().selectedModule!=="stats"&&(c().selectedSeason=""),c().selectedSeason&&c().selectedSeason!==G()&&!r.includes(c().selectedSeason)&&(c().selectedSeason="");const d=n.filter(p=>s.get(p)===c().selectedSeason);c().selectedFile&&!d.includes(c().selectedFile)&&(c().selectedFile="");const m=Ge(),u=m.filter(p=>J(p)===c().selectedFile),h=[...c().selectedModule==="stats"?[{value:G(),label:o("\u5168\u8D5B\u5B63","All seasons")}]:[{value:"",label:o("\u9009\u62E9\u8D5B\u5B63","Select season")}],...r.map(p=>({value:p,label:p}))],f=[{value:"",label:o("\u9009\u62E9\u51A0\u519B","Select champion")},...d.map(p=>{const x=a.find(I=>J(I)===p);return{value:p,label:x?.champion_name||Ye(m,p)}})],y=`
    <div class="champion-module-tabs" role="tablist" aria-label="${i(o("\u8D5B\u5B63\u6570\u636E\u6A21\u5757","Season data modules"))}">
      <button class="champion-module-tab${c().selectedModule==="matches"?" is-active":""}" type="button" data-champion-module="matches">
        ${i(o("\u8D5B\u5B63\u5BF9\u5C40","Season Matches"))}
      </button>
      <button class="champion-module-tab${c().selectedModule==="stats"?" is-active":""}" type="button" data-champion-module="stats">
        ${i(o("\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1","Team Win Rate"))}
      </button>
    </div>
  `,$=`
    <div class="champion-data-select-group${c().selectedModule==="stats"?" is-season-only":""}">
      ${Re("championDataSeason",o("\u8D5B\u5B63","Season"),c().selectedSeason,h)}
      ${c().selectedModule==="stats"?"":Re("championDataFile",o("\u51A0\u519B","Champion"),c().selectedFile,f)}
    </div>
  `,k=`
    ${y}
    <div class="champion-data-toolbar">${$}</div>
  `,S=()=>{t.querySelectorAll("[data-champion-module]").forEach(p=>{p.addEventListener("click",()=>{c().selectedModule=p.dataset.championModule==="stats"?"stats":"matches",c().selectedModule==="stats"&&(c().selectedFile="",c().selectedStatSide="combined",c().selectedStatRankType="recommend",c().selectedMatchupTeamKey=""),c().selectedMatchNo=null,c().selectedPlayerName="",L(e)})}),t.querySelector("#championDataSeason")?.addEventListener("change",p=>{c().selectedSeason=p.target.value,c().selectedFile="",c().rows=null,c().expandedStatRound=null,c().selectedMatchupTeamKey="",c().selectedDivision="qualifier",c().selectedGroup="",c().selectedMatchNo=null,c().selectedPlayerName="",L(e)}),t.querySelector("#championDataFile")?.addEventListener("change",p=>{c().selectedFile=p.target.value,c().expandedStatRound=null,c().selectedDivision="qualifier",c().selectedGroup="",c().selectedMatchNo=null,c().selectedPlayerName="",c().selectedFile?Qe(e,c().selectedFile):(c().rows=null,L(e))})};if(!c().selectedSeason){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(c().selectedModule==="stats"?o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u540E\u67E5\u770B\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1\u3002","Select a season to view team win rates."):o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u548C\u51A0\u519B\u540E\u67E5\u770B\u6570\u636E\u3002","Select a season and champion to view data."))}</p>
    `,S();return}if(c().selectedModule==="stats"){const p=c().selectedStatSide==="combined"?"combined":c().selectedStatSide==="defense"?"defense":"attack",x=p==="combined"?String(c().selectedMatchupTeamKey||""):"",I=`${c().selectedSeason}|${p}|${x}`,ze=c().statsBySeasonSide?.[I],ie=ea(ze)?c().statsBySeasonSide[I]:null;if(!ie&&!c().loading&&Ze(e,c().selectedSeason,p),!ie||c().loadingMode==="stats"){t.innerHTML=`
        ${k}
        <p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u8BFB\u53D6\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1...","Loading team win rates..."))}</p>
      `,S();return}t.innerHTML=`
      ${k}
      <div class="champion-data-result">
        ${Na(ie)}
      </div>
    `,S(),t.querySelectorAll("[data-champion-stat-side]").forEach(T=>{T.addEventListener("click",()=>{c().selectedStatSide=T.dataset.championStatSide==="combined"?"combined":T.dataset.championStatSide==="defense"?"defense":"attack",c().selectedMatchupTeamKey="",c().selectedStatSide==="combined"&&(c().selectedStatRankType="recommend"),c().expandedStatRound=null,L(e)})}),t.querySelectorAll("[data-champion-stat-rank]").forEach(T=>{T.addEventListener("click",()=>{c().selectedStatRankType=["recommend","systems","rate","round","characters"].includes(T.dataset.championStatRank)?T.dataset.championStatRank:"games",["recommend","systems","characters"].includes(c().selectedStatRankType)&&c().selectedStatSide!=="combined"?c().selectedStatSide="combined":!["recommend","systems","characters"].includes(c().selectedStatRankType)&&c().selectedStatSide==="combined"&&(c().selectedStatSide="attack"),c().selectedStatRankType!=="recommend"&&(c().selectedMatchupTeamKey=""),c().expandedStatRound=null,L(e)})}),t.querySelectorAll("[data-champion-matchup-team-key]").forEach(T=>{const B=()=>{const R=String(T.dataset.championMatchupTeamKey||"");!R||R===c().selectedMatchupTeamKey||(c().selectedMatchupTeamKey=R,c().selectedStatSide="combined",c().selectedStatRankType="recommend",L(e))};T.addEventListener("click",B),T.addEventListener("keydown",R=>{R.key!=="Enter"&&R.key!==" "||(R.preventDefault(),B())})}),t.querySelector("[data-champion-matchup-back]")?.addEventListener("click",()=>{c().selectedMatchupTeamKey="",L(e)}),t.querySelectorAll("[data-champion-stat-round-toggle]").forEach(T=>{T.addEventListener("click",()=>{const B=T.dataset.championStatRoundToggle||"";c().expandedStatRound=String(c().expandedStatRound||"")===String(B)?null:B,L(e),c().expandedStatRound&&requestAnimationFrame(()=>{const R=t.querySelector(`[data-champion-stat-round-group="${String(c().expandedStatRound)}"]`),_=R?.closest(".champion-stats-list");if(!R||!_)return;const V=R.getBoundingClientRect(),U=_.getBoundingClientRect();V.top<U.top?_.scrollTo({top:_.scrollTop-(U.top-V.top)-6,behavior:"smooth"}):V.bottom>U.bottom&&_.scrollTo({top:_.scrollTop+(V.bottom-U.bottom)+6,behavior:"smooth"})})})});return}if(!c().selectedFile){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(o("\u8BF7\u9009\u62E9\u51A0\u519B\u540E\u67E5\u770B\u5BF9\u5C40\u6570\u636E\u3002","Select a champion to view match data."))}</p>
    `,S();return}if(c().loading&&c().loadingMode==="file"){t.innerHTML=`
      ${k}
      <p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u8BFB\u53D6\u8BE5\u51A0\u519B\u6570\u636E...","Loading selected champion data..."))}</p>
    `,S();return}if(!u.length){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(o("\u6682\u65E0\u8BE5\u51A0\u519B\u6570\u636E\u3002","No data for this champion."))}</p>
    `,S();return}const w=u.some(p=>le(p)==="champion"),v=u.some(p=>le(p)==="qualifier");c().selectedDivision==="champion"&&!w&&(c().selectedDivision="qualifier"),c().selectedDivision==="qualifier"&&!v&&(c().selectedDivision="champion");const g=u.filter(p=>le(p)==="qualifier"),C=aa(g,"stage_group").sort((p,x)=>Number(p)-Number(x));c().selectedDivision==="qualifier"&&(!c().selectedGroup||!C.map(String).includes(String(c().selectedGroup)))&&(c().selectedGroup=String(C[0]||""));const M=ke(),b=ta(M),E=ue(b,1),F=ue(b,2),j=ue(b,3),ne=Ua(E,F,j),$e=C.map(p=>({value:p,label:`GROUP ${String(p).padStart(2,"0")}`})),He=c().selectedDivision==="champion"?o("\u51A0\u519B\u4E89\u9738\u8D5B","Champion Finals"):o("\u664B\u7EA7\u8D5B","Qualifier"),qe=$e.find(p=>String(p.value)===String(c().selectedGroup))?.label||"",Ke=c().selectedDivision==="qualifier"?`<div class="champion-group-tabs" role="tablist" aria-label="${i(o("\u664B\u7EA7\u8D5B\u5C0F\u7EC4","Qualifier groups"))}">
        ${$e.map(p=>`
          <button class="champion-group-tab${String(p.value)===String(c().selectedGroup)?" is-active":""}" type="button" data-champion-group="${i(String(p.value))}">
            ${i(p.label)}
          </button>
        `).join("")}
      </div>`:"";t.innerHTML=`
    ${y}
    <div class="champion-data-toolbar">
      ${$}
      <div class="champion-division-tabs" role="tablist" aria-label="${i(o("\u8D5B\u7A0B","Bracket type"))}">
        <button class="champion-division-tab${c().selectedDivision==="qualifier"?" is-active":""}" type="button" data-champion-division="qualifier" ${v?"":"disabled"}>${i(o("\u664B\u7EA7\u8D5B","Qualifier"))}</button>
        <button class="champion-division-tab${c().selectedDivision==="champion"?" is-active":""}" type="button" data-champion-division="champion" ${w?"":"disabled"}>${i(o("\u51A0\u519B\u8D5B","Champion"))}</button>
      </div>
    </div>
    <div class="champion-data-result">
      ${Ke}
      <section class="champion-bracket-panel">
        <div class="champion-bracket-title">
          <span>${i(He)}</span>
          <strong>${i(c().selectedDivision==="qualifier"?qe:o("8\u7EC4\u51A0\u519B\u5BF9\u5C40","Top 8 group winners"))}</strong>
        </div>
        <div class="champion-bracket-board">
          ${ne}
        </div>
      </section>
    </div>
  `,S(),t.querySelectorAll("[data-champion-division]").forEach(p=>{p.addEventListener("click",()=>{c().selectedDivision=p.dataset.championDivision==="champion"?"champion":"qualifier",c().selectedMatchNo=null,c().selectedPlayerName="",L(e)})}),t.querySelectorAll("[data-champion-group]").forEach(p=>{p.addEventListener("click",()=>{c().selectedGroup=p.dataset.championGroup||"",c().selectedMatchNo=null,c().selectedPlayerName="",L(e)})}),t.querySelectorAll("[data-champion-player]").forEach(p=>{p.addEventListener("click",()=>{c().selectedMatchNo=p.dataset.championMatch||null,c().selectedPlayerName=p.dataset.championPlayer||"",ye(c().selectedPlayerName,c().selectedMatchNo,p.dataset.championDetail||"match",p.dataset.championAltMatch||"",p.dataset.championAltLabel||"")})})}export{ye as openChampionPlayerDetailModal,L as renderChampionDataModalContent,Oe as setChampionDataUiApi};
