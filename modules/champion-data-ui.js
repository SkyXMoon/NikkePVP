let B={};function xe(e={}){B=e||{}}function d(e){const t=B[e];if(typeof t!="function")throw new Error(`Missing champion data UI API: ${e}`);return t}function s(){return B.championDataState||{}}function A(){return Number(B.teamSize)||5}function G(){return B.championAllSeasonsKey||"all"}function i(...e){return d("escapeHtml")(...e)}function o(...e){return d("localize")(...e)}function te(...e){return d("resolveChampionCharacterId")(...e)}function X(...e){return d("getCharacterById")(...e)}function fe(...e){return d("getChampionCharacterByName")(...e)}function Pe(...e){return d("getTeamSlotRarityClass")(...e)}function De(...e){return d("getAvatarMarkup")(...e)}function ne(...e){return d("getCharacterLocalizedName")(...e)}function ge(...e){return d("getTeamLabel")(...e)}function _e(...e){return d("getChampionRowsByMatchKey")(...e)}function ye(...e){return d("getChampionFilteredRows")(...e)}function L(...e){return d("getChampionMatchSummary")(...e)}function H(...e){return d("getChampionMatchWinnerName")(...e)}function Sa(...e){return d("getChampionMatchLoserName")(...e)}function va(...e){return d("getChampionStageRank")(...e)}function ba(...e){return d("getChampionStageBaseLabel")(...e)}function ie(...e){return d("getChampionGameNo")(...e)}function Ie(...e){return d("getChampionRows")(...e)}function J(...e){return d("getChampionSourceKey")(...e)}function Be(...e){return d("getChampionSeason")(...e)}function He(...e){return d("sortChampionSeasons")(...e)}function qe(...e){return d("getChampionDisplayNameForFile")(...e)}function Ke(...e){return d("loadChampionFileRows")(...e)}function ze(...e){return d("loadChampionTeamStats")(...e)}function Oe(...e){return d("isChampionStatsPayload")(...e)}function se(...e){return d("getChampionDivision")(...e)}function je(...e){return d("getUniqueChampionValues")(...e)}function Ve(...e){return d("getChampionMatchGroups")(...e)}function ce(...e){return d("getChampionRowsByStageRank")(...e)}function oe(...e){return d("closeChampionPlayerDetailModal")(...e)}function Ue(...e){return d("getChargeChartSize")(...e)}function ka(...e){return d("getChampionTeamSavedScarletCounterEnabled")(...e)}function Ca(...e){return d("getChampionTeamSavedRosannaSacrificeFrames")(...e)}function Ma(...e){return d("simulateBattle")(...e)}function Ge(...e){return d("getChargeChartMarkup")(...e)}function Ta(...e){return d("formatFrame")(...e)}function wa(...e){return d("getPaidArenaModeLabel")(...e)}function Aa(...e){return d("getPaidArenaDataTeamKey")(...e)}function Ra(...e){return d("computePaidArenaBattleResultsForRow")(...e)}function Xe(...e){return d("normalizeTeamKey")(...e)}function Na(...e){return d("getPaidArenaResultText")(...e)}function La(...e){return d("getTauntTargetState")(...e)}function Wa(...e){return d("getEffectiveLinkOwnerForTeam")(...e)}function Ea(...e){return d("isEffectiveLinkEnabledForTeam")(...e)}function Fa(...e){return d("getEffectiveLinkTargetIdsForTeam")(...e)}function xa(...e){return d("isRosanna")(...e)}function Pa(...e){return d("sanitizeSacrificeFrame")(...e)}function Da(...e){return d("getCubeIconSrc")(...e)}function _a(...e){return d("getSavedCharacterCubeType")(...e)}function Ia(...e){return d("sanitizeUniversalCharge")(...e)}function Ba(...e){return d("canShowFinishMarker")(...e)}function Je(...e){return d("isRedHood")(...e)}function Ha(...e){return d("sanitizeRedHoodPierceCount")(...e)}function qa(...e){return d("isScarlet")(...e)}function Ka(...e){return d("sanitizeScarletCounterEnabled")(...e)}function za(...e){return d("formatChargeNumber")(...e)}function Oa(...e){return d("canEditChargeSpeed")(...e)}function ja(...e){return d("sanitizeChargeSpeed")(...e)}function Va(...e){return d("getDisplayMagazine")(...e)}function Ua(...e){return d("isLocalDevRuntime")(...e)}function Ga(...e){return d("getStandardChargeBand")(...e)}function Xa(...e){return d("getRosannaSacrificeFrameState")(...e)}function Ja(...e){return d("getRedHoodPierceCountState")(...e)}function Ya(...e){return d("getScarletCounterEnabledState")(...e)}function Qa(...e){return d("normalizeJackalLink")(...e)}function $e(e,t,a,c){const n=c.map(r=>{const u=String(r.value??r),p=String(r.label??r);return`<option value="${i(u)}"${String(a||"")===u?" selected":""}>${i(p)}</option>`}).join("");return`
    <label class="champion-data-select">
      <span>${i(t)}</span>
      <select id="${i(e)}" name="${i(e)}">${n}</select>
    </label>
  `}function re(e={}){const t=e?.name||"",a=te(e?.character_id??e?.characterId??e?.id),c=X(a)||fe(t),n=String(e?.name_code??e?.nameCode??"").trim(),r=n?`assets/avatars/namecode/${encodeURIComponent(n)}.webp`:"",u=c?Pe(c):"",p=c?De(c):r?`<img src="${i(r)}" alt="${i(t||n)}" loading="lazy" />`:`<span class="avatar-fallback"><span class="avatar-fallback-name">${i(t||"?")}</span></span>`;return`
    <span class="champion-member ${u}">
      <span class="champion-member-avatar team-avatar">${p}</span>
      <span class="champion-member-meta">
        <span class="champion-member-name">${i(c?ne(c):t)}</span>
      </span>
    </span>
  `}function le(e=[],t,a="",c={}){const n=ge(t==="attack"?"attack":"defense"),r=a===t?" is-winner":"",u=c.chartIndex!==void 0?` role="button" tabindex="0" data-champion-chart-side="${i(t)}" data-champion-chart-index="${i(String(c.chartIndex))}"`:"";return`
    <div class="champion-round-team champion-${t}${r}"${u}>
      <strong>${i(n)}</strong>
      <div class="champion-member-list">
        ${Array.from({length:A()},(p,l)=>re(e[l]||{position:l+1})).join("")}
      </div>
    </div>
  `}function q(e=[]){return`
    <div class="champion-round-team champion-lineup-only">
      <div class="champion-member-list">
        ${Array.from({length:A()},(t,a)=>re(e[a]||{position:a+1})).join("")}
      </div>
    </div>
  `}function K(e){return`${Math.trunc((Number(e)||0)*1e4)/100}%`}function Y(e,t="",a={}){const c=Number(e?.recommend_score),n=Number.isFinite(c)&&c>0?`<span>${i(o(`\u63A8\u8350\u5206 ${Math.round(c)}`,`Score ${Math.round(c)}`))}</span>`:"",r=String(a.matchupTeamKey||""),u=r?` role="button" tabindex="0" data-champion-matchup-team-key="${i(r)}"`:"";return`
    <div class="${`champion-stat-card${a.selected?" is-selected":""}${r?" is-clickable":""}`}"${u}>
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${q(e.team||[])}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e.win_rate??e.winRate))}</strong>
        <span>${i(o(`${e.wins}\u80DC${e.losses}\u8D1F / ${e.games}\u573A`,`${e.wins}W ${e.losses}L / ${e.games}`))}</span>
        ${n}
      </div>
    </div>
  `}function Ye(e,t=""){const a=Number(e?.system_score),c=Array.isArray(e?.core_members)?e.core_members:[],n=Array.isArray(e?.common_fillers)?e.common_fillers:[],r=n.length?`
    <div class="champion-core-fillers">
      <strong>${i(o("\u5E38\u89C1\u7B2C5\u4EBA","Common 5th"))}</strong>
      <div class="champion-core-filler-list">
        ${n.slice(0,4).map(u=>{const p=X(u.character_id),l=p?ne(p):String(u.character_id||""),h=Number(u.games||u.count||0),g=Number(u.wins||0),y=Number(u.win_rate),$=Number.isFinite(y)&&y>0?K(y):"";return`
            <span class="champion-core-filler">
              <span>${i(l)}</span>
              <small>${i(o(`${h}\u573A${$?` / ${$}`:""}`,`${h}G${$?` / ${$}`:""}`))}</small>
              ${g?`<small>${i(o(`${g}\u80DC`,`${g}W`))}</small>`:""}
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
        ${q(c)}
        ${r}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e?.win_rate))}</strong>
        <span>${i(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
        <span>${i(o(`\u4F53\u7CFB\u5206 ${Math.round(a||0)}`,`System ${Math.round(a||0)}`))}</span>
      </div>
    </div>
  `}function Se(e,t=""){const a=te(e?.character_id),c=X(a),n=c?ne(c):String(e?.character_id||"");return`
    <div class="champion-stat-card champion-character-stat-card">
      <div class="champion-stat-rank">
        <span>${i(t)}</span>
      </div>
      <div class="champion-stat-team">
        ${re({character_id:a,name:n})}
      </div>
      <div class="champion-stat-metrics">
        <strong>${i(K(e?.win_rate))}</strong>
        <span>${i(o(`${e?.wins||0}\u80DC${e?.losses||0}\u8D1F / ${e?.games||0}\u573A`,`${e?.wins||0}W ${e?.losses||0}L / ${e?.games||0}`))}</span>
      </div>
    </div>
  `}function Qe(e,t=""){return`
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
  `}function ve(e=[],t){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${i(t)}</p>`:`
    <div class="champion-stats-list champion-matchup-list">
      ${e.map((a,c)=>Qe(a,`#${c+1}`)).join("")}
    </div>
  `}function Ze(e=[],t){if(!Array.isArray(e)||!e.length)return`<p class="champion-data-empty">${i(t)}</p>`;const a=new Map;e.forEach(n=>{const r=Number(n.game_no);!Number.isInteger(r)||r<1||(a.has(r)||a.set(r,[]),a.get(r).push(n))});const c=[1,2,3,4,5].filter(n=>a.has(n));return c.length?`
    <section class="champion-stat-section">
      <div class="champion-stats-list champion-round-stats-list">
        ${c.map(n=>{const r=(a.get(n)||[]).slice(0,5),u=r[0],p=r.slice(1),l=String(s().expandedStatRound||"")===String(n);return`
            <article class="champion-round-stat-group${l?" is-expanded":""}" data-champion-stat-round-group="${i(String(n))}">
              <button class="champion-round-stat-primary" type="button" data-champion-stat-round-toggle="${i(String(n))}" aria-expanded="${l?"true":"false"}">
                ${Y(u,`R${n}`)}
                ${p.length?`<span class="champion-round-stat-stack" aria-hidden="true">${p.map(()=>"<i></i>").join("")}</span>`:""}
              </button>
              ${p.length?`
                <div class="champion-round-stat-extra">
                  ${p.map((h,g)=>Y(h,`#${g+2}`)).join("")}
                </div>
              `:""}
            </article>
          `}).join("")}
      </div>
    </section>
  `:`<p class="champion-data-empty">${i(t)}</p>`}function ea(e=[],t,a={}){return!Array.isArray(e)||!e.length?`<p class="champion-data-empty">${i(t)}</p>`:a.showRound?Ze(e,t):`
    <section class="champion-stat-section">
      <div class="champion-stats-list">
        ${e.map((c,n)=>Y(c,`#${n+1}`)).join("")}
      </div>
    </section>
  `}function aa(e={}){const t=s().selectedStatSide==="combined"?"combined":s().selectedStatSide==="defense"?"defense":"attack";let a=["recommend","systems","rate","round","characters"].includes(s().selectedStatRankType)?s().selectedStatRankType:"games";t==="combined"&&!["recommend","systems","characters"].includes(a)&&(a="recommend"),t!=="combined"&&["recommend","systems","characters"].includes(a)&&(a="games");const c=Array.isArray(e?.topByRate)?e.topByRate:[],n=Array.isArray(e?.topByGames)?e.topByGames:[],r=Array.isArray(e?.bestByRound)?e.bestByRound:[],u=Array.isArray(e?.ranking?.recommendations)?e.ranking.recommendations:[],p=Array.isArray(e?.ranking?.characters)?e.ranking.characters:[],l=Array.isArray(e?.ranking?.cores)?e.ranking.cores:[],h=e?.ranking?.matchups&&typeof e.ranking.matchups=="object"?e.ranking.matchups:{},g=Array.isArray(h.strongAgainst)?h.strongAgainst:[],y=Array.isArray(h.weakAgainst)?h.weakAgainst:[],$=String(s().selectedMatchupTeamKey||""),k=$?u.find(M=>String(M?.team_key||"")===$):null,S=Math.max(0,Math.trunc(Number(e?.minWins)||30)),T=o("\u63A8\u8350\u5206 = \u80DC\u7387\xD755 + \u6837\u672C\u5206\xD720 + \u51FA\u573A\u5206\xD715 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710\u3002\u6837\u672C\u5206\u6309\u8FBE\u5230\u6700\u4F4E\u80DC\u573A\u8BA1\u7B97\uFF0C\u51FA\u573A\u5206\u6309\u5F53\u524D\u8303\u56F4\u6700\u9AD8\u51FA\u573A\u8BA1\u7B97\u3002","Score = win rate x55 + sample x20 + usage x15 + season coverage x10. Sample score uses the minimum wins threshold; usage score is relative to the highest games in the current scope."),v=o("\u4F53\u7CFB\u5206 = \u80DC\u7387\xD745 + \u6837\u672C\u5206\xD718 + \u51FA\u573A\u5206\xD714 + \u8D5B\u5B63\u8986\u76D6\u5206\xD710 + \u53D8\u4F53\u5206\xD713\u3002\u4F53\u7CFB\u63094\u4EBA\u6838\u5FC3 + \u5E38\u89C1\u7B2C5\u4EBA\u7EDF\u8BA1\uFF0C\u4E0D\u533A\u5206\u7AD9\u4F4D\u3002","System score = win rate x45 + sample x18 + usage x14 + season coverage x10 + variant x13. Systems are counted as a 4-unit core plus common 5th variants, ignoring positions."),f=a==="recommend"?u:a==="systems"?l:a==="rate"?c:a==="round"?r:a==="characters"?p:n,C=a==="recommend"?o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."):a==="rate"?o(`\u6682\u65E0${S}\u80DC\u4EE5\u4E0A\u80DC\u7387\u7EDF\u8BA1\u3002`,`No win-rate data with at least ${S} wins.`):a==="characters"?o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."):a==="systems"?o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."):a==="round"?o("\u6682\u65E0\u5C40\u5185\u8D70\u4F4D\u7EDF\u8BA1\u3002","No round-position data."):o("\u6682\u65E0\u51FA\u573A\u7EDF\u8BA1\u3002","No usage data.");return!c.length&&!n.length&&!r.length&&!u.length&&!p.length&&!l.length?`
      <section class="champion-stats-panel">
        ${de(t)}
        ${ue(a,S,t)}
        <p class="champion-data-empty">${i(o("\u6682\u65E0\u53EF\u7EDF\u8BA1\u7684\u961F\u4F0D\u6570\u636E\u3002","No team statistics data."))}</p>
      </section>
    `:t==="combined"?`
      <section class="champion-stats-panel">
        ${de(t)}
        ${ue(a,S,t)}
        <section class="champion-stat-section champion-combined-stat-section">
          <div class="champion-stats-head">
            <div class="champion-stats-title">
              <strong>${i(a==="characters"?o("\u89D2\u8272\u699C","Characters"):a==="systems"?o("\u4F53\u7CFB\u699C\uFF084+1\uFF0C\u4E0D\u5206\u7AD9\u4F4D\uFF09","Systems (4+1, positionless)"):o("\u7EFC\u5408\u63A8\u8350","Recommended"))}</strong>
              ${a==="recommend"||a==="systems"?`
                <span class="champion-score-help-wrap">
                  <button class="champion-score-help" type="button" aria-label="${i(a==="systems"?v:T)}" aria-describedby="championScoreTooltip">?</button>
                </span>
              `:""}
            </div>
            <span>${i(a==="characters"?o("\u6309\u51FA\u573A\u91CF\u548C\u80DC\u7387\u5C55\u793A\u73AF\u5883\u89D2\u8272","Shows meta characters by usage and win rate."):a==="systems"?o("\u63094\u4EBA\u6838\u5FC3\u548C\u5E38\u89C1\u7B2C5\u4EBA\u53D8\u4F53\u5C55\u793A\u4F53\u7CFB","Shows systems as a 4-unit core plus common 5th variants."):o("\u6309\u80DC\u7387\u3001\u6837\u672C\u3001\u51FA\u573A\u548C\u8D5B\u5B63\u8986\u76D6\u7EFC\u5408\u6392\u5E8F","Ranked by win rate, sample size, usage, and season coverage."))}</span>
            ${a==="recommend"||a==="systems"?`<span id="championScoreTooltip" class="champion-score-tooltip" role="tooltip">${i(a==="systems"?v:T)}</span>`:""}
          </div>
          <div class="champion-stats-list">
            ${a==="characters"?p.length?p.map((M,b)=>Se(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u89D2\u8272\u73AF\u5883\u7EDF\u8BA1\u3002","No character meta data."))}</p>`:a==="systems"?l.length?l.map((M,b)=>Ye(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u4F53\u7CFB\u699C\u6570\u636E\u3002","No system data."))}</p>`:u.length?u.map((M,b)=>Y(M,`#${b+1}`,{matchupTeamKey:M.team_key,selected:$&&$===String(M.team_key||"")})).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u7EFC\u5408\u63A8\u8350\u6570\u636E\u3002","No recommendation data."))}</p>`}
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
                ${ve(g,o("\u6682\u65E0\u514B\u5236\u6570\u636E\u3002","No favorable matchup data."))}
              </section>
              <section class="champion-matchup-column">
                <strong>${i(o("\u6015\u8C01","Weak against"))}</strong>
                ${ve(y,o("\u6682\u65E0\u88AB\u514B\u6570\u636E\u3002","No weak matchup data."))}
              </section>
            </div>
          </section>
        `:""}
      </section>
    `:`
    <section class="champion-stats-panel">
      ${de(t)}
      ${ue(a,S,t)}
      ${a==="characters"?`<section class="champion-stat-section"><div class="champion-stats-list">${p.length?p.map((M,b)=>Se(M,`#${b+1}`)).join(""):`<p class="champion-data-empty">${i(C)}</p>`}</div></section>`:ea(f,C,{showRound:a==="round"})}
    </section>
  `}function ue(e="games",t=30,a="attack"){return a==="combined"?`
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
  `}function de(e="attack"){return`
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
  `}function ta(e,t=0){const a=e.winner==="attack"?o("\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u5B88\u65B9\u80DC","Defense Win"):o("\u672A\u77E5","Unknown"),c=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",n=ie(e);return`
    <article class="champion-round-card ${c}">
      <div class="champion-round-head">
        <strong>Round ${i(String(n||"?"))}</strong>
        <span>${i(a)}</span>
      </div>
      <div class="champion-round-teams">
        ${le(e.attack_team||[],"attack",e.winner,{chartIndex:t})}
        <span class="champion-round-vs">VS</span>
        ${le(e.defense_team||[],"defense",e.winner,{chartIndex:t})}
      </div>
      ${ma(e,t)}
    </article>
  `}function Za(e){const t=e.winner==="attack"?o("\u8FDB\u653B\u65B9\u80DC","Attack Win"):e.winner==="defense"?o("\u8FDB\u653B\u65B9\u8D1F","Attack Lose"):o("\u672A\u77E5","Unknown"),a=e.winner==="attack"?"is-attack-win":e.winner==="defense"?"is-defense-win":"",c=ie(e);return`
    <article class="champion-round-card champion-attack-only ${a}">
      <div class="champion-round-head">
        <strong>Round ${i(String(c||"?"))}</strong>
        <span>${i(e.attack_player||o("\u8FDB\u653B\u65B9","Attack"))} VS ${i(e.defense_player||o("\u9632\u5B88\u65B9","Defense"))} \xB7 ${i(t)}</span>
      </div>
      ${le(e.attack_team||[],"attack",e.winner)}
    </article>
  `}function na(e,t=""){const c=e.defense_player===t&&e.attack_player!==t?"defense":"attack",n=ie(e);return`
    <article class="champion-round-card champion-lineup-card">
      <div class="champion-round-head">
        <strong>Round ${i(String(n||"?"))}</strong>
      </div>
      ${q(e[`${c}_team`]||[])}
    </article>
  `}function ia(e={}){const t=te(e?.character_id??e?.characterId??e?.id);return X(t)||fe(e?.name||"")}function z(e=[]){return Array.from({length:A()},(t,a)=>ia(e[a]||null)||null)}function sa(e=[],t="attack"){return Array.from({length:A()},(a,c)=>{const n=e?.[c];return n?getSavedCharacterChargeSpeed(n,t):0})}function ca(e=[],t="attack"){return Array.from({length:A()},(a,c)=>{const n=e?.[c];return n&&Je(n)?getSavedCharacterRedHoodPierceCount(n,t):0})}const oa=[0,2,4];function be(e=[]){const t=e.find(n=>n&&isJackal(n))||e.find(n=>n&&isLinkProvider(n));if(!t)return createEmptyJackalLinkState();const a=e.findIndex(n=>n&&n.id===t.id),c=[...new Set([a,...oa])].filter(n=>Number.isInteger(n)&&n>=0&&n<A()&&!!e[n]);return{enabled:!0,ownerId:t.id,targetIds:c.map(n=>e[n]).filter(n=>n&&n.id!==t.id).map(n=>n.id).slice(0,2),fixedLinkedPositionIndices:c}}function ra(e=[]){const a=createEmptyPaidArenaLineupSlot("c");return e.slice(0,PAID_ARENA_TEAM_COUNTS.c).forEach((c,n)=>{const r=z(c.attack_team||[]),u=z(c.defense_team||[]);[{teamKey:"attack",team:r},{teamKey:"defense",team:u}].forEach(({teamKey:l,team:h})=>{a.teams[l][n]=h.map(g=>g?.id||null),a.chargeSpeeds[l][n]=sa(h,l),a.redHoodPierceCounts[l][n]=ca(h,l),a.scarletCounterEnabled[l][n]=Array(A()).fill(!0),a.jackalLinks[l][n]=be(h)})}),a.activeRowIndex=0,a.activeTeamKey="attack",normalizePaidArenaLineupSlot(a,"c")}function la(e=[]){const t=Array.isArray(e)?e.slice(0,PAID_ARENA_TEAM_COUNTS.c):[];if(!t.some(n=>{const r=z(n.attack_team||[]),u=z(n.defense_team||[]);return[...r,...u].some(Boolean)})){showToast(o("\u8D5B\u5B63\u961F\u4F0D\u4E3A\u7A7A\uFF0C\u65E0\u6CD5\u5957\u7528","Season teams are empty and cannot be applied"));return}isPaidArenaModeActive()&&saveCurrentPaidArenaLineupSlot(state.paidArenaMode);const c=ensurePaidArenaLineupSlots("c");getPaidArenaLineupSlotCount(c[0],"c")>0&&!window.confirm(o("\u5F53\u524D\u5C06\u8986\u76D6\u65B9\u68481\uFF0C\u662F\u5426\u786E\u8BA4\uFF1F","This will overwrite Plan 1. Continue?"))||(c[0]=ra(t),state.paidArenaMode="c",state.testMode=!1,state.paidArenaActiveLineupIndex.c=0,state.paidArenaDisplayMode="round",state.paidArenaDataTeamKey="attack",state.paidArenaActiveRowIndex=0,loadPaidArenaLineupSlot("c",0),state.paidArenaDisplayMode="round",state.paidArenaDataTeamKey="attack",state.paidArenaActiveRowIndex=0,syncPaidArenaChargeSpeedsFromSavedData("c"),openSlotSettings=null,openRosannaSacrificeSettings=null,oe(),closeChampionDataModal(),hideChartTooltip(),saveTeam(),render(),showToast(o("\u5DF2\u5957\u7528\u6574\u573A\u5BF9\u5C40\u5230\u51A0\u519B\u7ADE\u6280\u573A\u65B9\u68481","Applied the full match to Champion Arena Plan 1")))}function Q(e=[],t="attack"){const a=z(e);return{mode:"c",teamKey:Xe(t),rowIndex:0,team:a,universalCharges:Array(A()).fill(0),sacrificeFrames:Array(A()).fill(null),redHoodPierceCounts:Array(A()).fill(0),scarletCounterEnabled:Array(A()).fill(!0),jackalLink:be(a),chargeSpeeds:Array(A()).fill(0),result:null}}function ke(e={}){const t=Q(e.attack_team||[],"attack"),a=Q(e.defense_team||[],"defense"),c=state.allowMissedShots;state.allowMissedShots=!1;try{return withPaidArenaSimulationState(t,a,()=>{let n=getStunWindowsForTeam("attack"),r=getStunWindowsForTeam("defense"),u=[],p=[],l=simulateBurst(state.team,"attack",[],[],[],n,[],t.universalCharges,state.defenseTeam,t.sacrificeFrames,u),h=simulateBurst(state.defenseTeam,"defense",[],[],[],r,[],a.universalCharges,state.team,a.sacrificeFrames,p);for(let g=0;g<8;g+=1){n=getStunWindowsForTeam("attack",l?.reloadTimeline||[]),r=getStunWindowsForTeam("defense",h?.reloadTimeline||[]),u=getDodgedStunEventsForTeam("attack",l?.reloadTimeline||[]),p=getDodgedStunEventsForTeam("defense",h?.reloadTimeline||[]);const y=getSpecialChargeEventsForTeam(l,h),$=getSpecialChargeEventsForTeam(h,l),k=getSharedBattleCalculationEndFrame(l,h),S=simulateBurst(state.team,"attack",y,h?.reloadTimeline||[],h?.turnDodgeTimeline||[],n,h?.tauntTimeline||[],t.universalCharges,state.defenseTeam,t.sacrificeFrames,u,{continueUntilFrame:k}),T=simulateBurst(state.defenseTeam,"defense",$,l?.reloadTimeline||[],l?.turnDodgeTimeline||[],r,l?.tauntTimeline||[],a.universalCharges,state.team,a.sacrificeFrames,p,{continueUntilFrame:k}),v=getResultSignature(S)===getResultSignature(l)&&getResultSignature(T)===getResultSignature(h);if(l=S,h=T,v)break}return{attackResult:l,defenseResult:h}})}finally{state.allowMissedShots=c}}function Ce(e){return!e||e.error||!Number.isFinite(e.fullFrame)?"?RL":`${formatNumber(e.fullFrame/76,2)}RL`}function ua(e={}){try{const{attackResult:t,defenseResult:a}=ke(e);return`${Ce(t)} VS ${Ce(a)}`}catch{return"?RL VS ?RL"}}function da(e){requestAnimationFrame(()=>{const t=e.getBoundingClientRect(),a=window.innerHeight||document.documentElement.clientHeight;(t.bottom>a-16||t.top<16)&&e.scrollIntoView({block:"nearest",behavior:"smooth"})})}function Me(e){const t=e?.getBoundingClientRect?.();return{width:Math.max(CHART_MIN_WIDTH,Math.round(t?.width||CHART_WIDTH)),height:Math.max(260,Math.round(t?.height||CHART_HEIGHT))}}function Te(e={},t=Ue()){const a=Q(e.attack_team||[],"attack"),c=Q(e.defense_team||[],"defense"),n=state.allowMissedShots;state.allowMissedShots=!1;try{return withPaidArenaSimulationState(a,c,()=>{const{attackResult:r,defenseResult:u}=ke(e);return Ge(r,null,u,t)})}finally{state.allowMissedShots=n}}function we(e,t=[]){const a=Number(e?.dataset?.championChartIndex);if(!Number.isInteger(a)||!t[a])return;const c=e.closest(".champion-round-card");if(!c)return;const n=e?.dataset?.championChartSide||"summary",r=`${a}:${n}`,p=c.querySelector(".champion-inline-chart")?.dataset?.championChartKey===r;if(document.querySelectorAll(".champion-inline-chart").forEach(y=>y.remove()),document.querySelectorAll(".champion-round-team.is-chart-active, .champion-round-chart-toggle.is-chart-active").forEach(y=>y.classList.remove("is-chart-active")),p)return;const l=document.createElement("div"),h=t[a].winner==="attack"?"is-attack-win":t[a].winner==="defense"?"is-defense-win":"";l.className=`champion-inline-chart charge-chart ${h}`.trim(),l.dataset.championChartKey=r,c.append(l);const g=t[a];l.innerHTML=Te(g,Me(l)),requestAnimationFrame(()=>{!l.isConnected||l.dataset.championChartKey!==r||(l.innerHTML=Te(g,Me(l)))}),e.classList.add("is-chart-active"),c.querySelector(".champion-round-chart-toggle")?.classList.add("is-chart-active"),da(l)}function ma(e={},t=0){return`
    <button class="champion-round-chart-toggle" type="button" data-champion-chart-index="${i(String(t))}">
      <span class="champion-round-chart-toggle-speed">${i(ua(e))}</span>
      <span class="champion-round-chart-toggle-hint">${i(o("\u70B9\u51FB\u53EF\u67E5\u770B\u5145\u80FD\u8BE6\u60C5","Tap to view charge details"))}</span>
    </button>
  `}function O(e,t,a={}){if(!e?.playerName)return"";const c=e.side==="attack"?"is-attack-win":e.side==="defense"?"is-defense-win":"",n=!!a.hideMeta,r=!!a.hideStage,u=Array.from(String(e.playerName||"")).length,p=u>6?" is-name-tiny":u>4?" is-name-small":"",l=n?"":`<span class="champion-player-seed">${i(t)}</span>`,h=n||r?"":`<span class="champion-player-stage">${i(e.scoreText||e.stageLabel||"")}</span>`,g=e.altMatchKey?` data-champion-alt-match="${i(String(e.altMatchKey))}" data-champion-alt-label="${i(String(e.altMatchLabel||""))}"`:"";return`
    <button class="champion-player-node ${c}${e.isWinner?" is-winner":" is-loser"}" type="button" data-champion-player="${i(e.playerName)}" data-champion-match="${i(String(e.matchKey||""))}" data-champion-detail="${i(e.detailMode||"match")}"${g}>
      ${l}
      <span class="champion-player-name${p}"><span class="champion-player-name-text">${i(e.playerName)}</span></span>
      ${h}
    </button>
  `}function et(e,t){const a=e.rows[0]||{},c=L(e.rows),n={playerName:a.attack_player||"",matchKey:e.key,side:"attack",stageLabel:e.stageLabel,scoreText:`${c.attackWins}`,isWinner:c.winner==="attack"},r={playerName:a.defense_player||"",matchKey:e.key,side:"defense",stageLabel:e.stageLabel,scoreText:`${c.defenseWins}`,isWinner:c.winner==="defense"},u=n.isWinner?n:r.isWinner?r:n,p=n.isWinner?r:r.isWinner?n:r;return`
    <article class="champion-match-pair">
      <div class="champion-match-pair-label">${i(e.matchLabel==="FINAL"?"FINAL":`M${t+1}`)}</div>
      <div class="champion-match-pair-nodes">
        ${O(u,"WIN")}
        ${O(p,"LOSE")}
      </div>
    </article>
  `}function W(e){const t=e?.rows?.[0]||{},a=L(e?.rows||[]);return[{playerName:t.attack_player||"",matchKey:e?.key||"",side:"attack",stageLabel:e?.stageLabel||"",scoreText:`${a.attackWins}`,isWinner:a.winner==="attack"},{playerName:t.defense_player||"",matchKey:e?.key||"",side:"defense",stageLabel:e?.stageLabel||"",scoreText:`${a.defenseWins}`,isWinner:a.winner==="defense"}].filter(c=>c.playerName)}function pa(e,t=[]){if(!e||!t.length)return"winner";const a=t.find(c=>W(c).some(n=>n.playerName===e));return a?H(a.rows)===e?"winner":"loser":"winner"}function at(e=[],t=[],a=[]){const c=a[0]||null,n=c?H(c.rows):"",r=t.length?getChampionWinnerNodes(t).map(l=>({...l,isWinner:l.playerName===n})):c?W(c).map(l=>({...l,isWinner:l.playerName===n})):[],u=getChampionWinnerNodes(e).map(l=>({...l,isWinner:pa(l.playerName,t)==="winner"})),p=e.flatMap(l=>W(l).map(h=>({...h,detailMode:"player-team",isWinner:h.isWinner})));return[{key:"champion",label:o("\u5C0F\u7EC4\u51A0\u519B","Group Champion"),nodes:n?[{playerName:n,matchKey:c?.key||"",side:L(c?.rows||[]).winner,stageLabel:o("\u51A0\u519B","Champion"),scoreText:"WIN",isWinner:!0}]:[]},{key:"top2",label:"2\u8FDB1",nodes:r,matches:c?[c]:[]},{key:"top4",label:"4\u8FDB2",nodes:u,matches:t},{key:"top8",label:"8\u8FDB4",nodes:p,matches:e}]}function ha(e,t,a){const c=a?.key==="top2"||a?.key==="top4";return O(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:!c,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function Ae(e,t,a,c={}){const n=!!c.showScore,r=!!c.hideMeta;return O(e,e.isWinner?e.scoreText||"WIN":e.scoreText||"LOSE",{hideMeta:r||!n,hideStage:!0}).replace('class="champion-player-node ',`class="champion-player-node champion-tree-node champion-tree-node-${t+1} `)}function fa(e,t,a){const c=W(e),n=L(e.rows||[]),r=c.find(h=>h.isWinner)||c[0];if(!r)return"";const u=a?.key==="top2"||a?.key==="top4",p=Ae({...r,scoreText:`${n.attackWins}:${n.defenseWins}`,isWinner:!0},0,a,{showScore:u}),l=c.map((h,g)=>Ae({...h,detailMode:a?.key==="top8"?"player-team":h.detailMode},g+1,a,{hideMeta:a?.key==="top8"})).join("");return`
    <article class="champion-tree-match-card champion-tree-match-${i(a?.key||"")}">
      <div class="champion-tree-match-winner">${p}</div>
      <div class="champion-tree-match-lines" aria-hidden="true"></div>
      <div class="champion-tree-match-participants">
        ${l}
      </div>
    </article>
  `}function tt(e){const t=Array.isArray(e.matches)&&e.matches.length>0;return`
    <section class="champion-tree-row champion-tree-${i(e.key)}">
      <div class="champion-tree-row-title">${i(e.label)}</div>
      <div class="${t?"champion-tree-row-matches":"champion-tree-row-nodes"}">
        ${t?e.matches.map((a,c)=>fa(a,c,e)).join(""):e.nodes.length?e.nodes.map((a,c)=>ha(a,c,e)).join(""):`<span class="champion-empty-node">${i(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function Re(e=[],t=[],a=new Set){const c=e.map(r=>H(r.rows||[])).filter(Boolean),n=t.find(r=>a.has(r.key)?!1:W(r).some(u=>c.includes(u.playerName)));return n?.key&&a.add(n.key),n||null}function Z(e,t="",a={}){const c=!!a.hideMeta,n=a.detailMode||e?.detailMode||"match";return O({...e,detailMode:n},t,{hideMeta:c,hideStage:!0}).replace('class="champion-player-node ','class="champion-player-node champion-tree-node champion-elim-node ')}function nt(e,t,a={}){if(!e?.rows?.length)return"";const c=W(e),n=L(e.rows||[]),r=c.find(l=>l.isWinner)||c[0];if(!r)return"";const u=!!a.hideParticipantMeta,p=`${n.attackWins}:${n.defenseWins}`;return`
    <article class="champion-elim-match">
      <div class="champion-elim-match-label">${i(t)}</div>
      <div class="champion-elim-match-winner">
        ${Z({...r,scoreText:p,isWinner:!0},p)}
      </div>
      <div class="champion-elim-lines" aria-hidden="true"></div>
      <div class="champion-elim-participants">
        ${c.map(l=>Z({...l,detailMode:a.participantDetailMode||l.detailMode},l.isWinner?l.scoreText||"WIN":l.scoreText||"LOSE",{hideMeta:u})).join("")}
      </div>
    </article>
  `}function me(e={}){return`${e.attackWins||0}:${e.defenseWins||0}`}function P(e,t,a="",c={}){return e?.playerName?`<div class="champion-elim-slot ${i(t)}">${Z(e,a,c)}</div>`:`<span class="champion-empty-node ${i(t)}">${i(o("\u6682\u65E0","Empty"))}</span>`}function ga(e,t={}){const a=e==="bottom",c=a?38:14,n=a?86:62,r=a?62:38,u=a?62:38,p=a?24:76,l=p,h=t.leftWinnerIndex===0,g=t.rightWinnerIndex===0,y=t.halfWinnerSide==="left",$=(v,f)=>`<path class="champion-elim-line-path ${f?"is-win-line":"is-lose-line"}" d="${v}" />`,k=(v,f,C=p)=>`
    <svg class="champion-elim-lines-svg ${v}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      ${$(`M ${f.leftOuter} ${c} H ${f.leftMergeX} V ${r} H ${f.leftWinner}`,h)}
      ${$(`M ${f.leftOuter} ${n} H ${f.leftMergeX} V ${r} H ${f.leftWinner}`,!h)}
      ${$(`M ${f.rightOuter} ${c} H ${f.rightMergeX} V ${r} H ${f.rightWinner}`,g)}
      ${$(`M ${f.rightOuter} ${n} H ${f.rightMergeX} V ${r} H ${f.rightWinner}`,!g)}
      ${$(`M ${f.leftFinal} ${u} H 50 V ${C}`,y)}
      ${$(`M ${f.rightFinal} ${u} H 50 V ${C}`,!y)}
    </svg>
  `,S={leftOuter:12,leftMergeX:20,leftWinner:23.5,rightOuter:88,rightMergeX:80,rightWinner:76.5,leftFinal:39,rightFinal:61},T={leftOuter:18,leftMergeX:21,leftWinner:21.5,rightOuter:82,rightMergeX:79,rightWinner:78.5,leftFinal:41,rightFinal:59};return`
    ${k("is-desktop-lines",S)}
    ${k("is-mobile-lines",T,l)}
  `}function ya(e,t=null,a=null){return e&&(t?.rows?.length?W(t):[]).find(n=>n.playerName===e)||a}function Ne(e,t=[],a=null,c=null){const n=t.slice(0,2).map(b=>{const E=W(b).map(F=>({...F,detailMode:"player-team"}));return{group:b,participants:E,winner:E.find(F=>F.isWinner)||E[0]||null,summary:L(b.rows||[])}}),r=n[0]||{},u=n[1]||{},p=r.participants||[],l=u.participants||[],h=L(a?.rows||[]),g=a?W(a):[],y=g.find(b=>b.isWinner)||g[0]||null,$=L(c?.rows||[]),k=c?H(c.rows):"",S=y?{...ya(y.playerName,c,y)||y,scoreText:me(h),isWinner:k?y.playerName===k:!0,altMatchKey:a?.key||"",altMatchLabel:o("\u67E5\u770B4\u8FDB2\u5BF9\u5C40","View semifinal")}:null,T=r.winner?{...r.winner,scoreText:me(r.summary),isWinner:!0}:null,v=u.winner?{...u.winner,scoreText:me(u.summary),isWinner:!0}:null,f=b=>{const E=b.participants||[],F=b.winner?.playerName,j=E.findIndex(ee=>ee.playerName===F);return j>=0?j:0},C=y?.playerName&&v?.playerName===y.playerName?"right":"left",M=e==="top"?o("\u4E0A\u534A\u533A","Upper Half"):o("\u4E0B\u534A\u533A","Lower Half");return`
    <section class="champion-elim-half champion-elim-half-${i(e)}" aria-label="${i(M)}">
      ${ga(e,{leftWinnerIndex:f(r),rightWinnerIndex:f(u),halfWinnerSide:C})}
      ${P(p[0],"slot-left-1","",{hideMeta:!0})}
      ${P(l[0],"slot-right-1","",{hideMeta:!0})}
      ${P(T,"slot-left-winner",T?.scoreText||"",{detailMode:"match"})}
      ${P(v,"slot-right-winner",v?.scoreText||"",{detailMode:"match"})}
      ${P(p[1],"slot-left-2","",{hideMeta:!0})}
      ${P(l[1],"slot-right-2","",{hideMeta:!0})}
      ${P(S,"slot-half-winner",S?.scoreText||"",{detailMode:"match"})}
      <span class="champion-elim-connector connector-left-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-pair" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-left-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-right-final" aria-hidden="true"></span>
      <span class="champion-elim-connector connector-half-final" aria-hidden="true"></span>
    </section>
  `}function it(e=null,t=[]){const a=e?.rows?.length?W(e):getChampionWinnerNodes(t),c=L(e?.rows||[]),n=e?H(e.rows):"",r=e?`${c.attackWins}:${c.defenseWins}`:"";return`
    <section class="champion-elim-final" aria-label="${i(o("\u51B3\u8D5B","Final"))}">
      <div class="champion-elim-final-label">${i(o("2\u8FDB1","Final"))}</div>
      <div class="champion-elim-final-lines" aria-hidden="true"></div>
      <div class="champion-elim-final-nodes">
        ${a.length?a.map(u=>Z({...u,scoreText:r,isWinner:n?u.playerName===n:u.isWinner},r||(u.isWinner?"WIN":"LOSE"),{hideMeta:!e})).join(""):`<span class="champion-empty-node">${i(o("\u6682\u65E0","Empty"))}</span>`}
      </div>
    </section>
  `}function $a(e=[],t=[],a=[]){const c=e.slice(0,2),n=e.slice(2,4),r=new Set,u=Re(c,t,r),p=Re(n,t,r)||t.find(h=>!r.has(h.key))||null,l=a[0]||null;return`
    <div class="champion-elim-board">
      ${Ne("top",c,u,l)}
      <div class="champion-elim-vs" aria-hidden="true">VS</div>
      ${Ne("bottom",n,p,l)}
    </div>
  `}function pe(e,t="",a="match",c="",n=""){oe();const r=_e(ye(),t),u=r[0]||{},p=a==="player-team",l=L(r),h=u.attack_player||o("\u8FDB\u653B\u65B9","Attack"),g=u.defense_player||o("\u9632\u5B88\u65B9","Defense"),y=!p&&c&&c!==t,$=s().selectedDivision==="champion"?o("\u67E5\u770B\u51A0\u519B\u5BF9\u5C40","View final"):o("\u67E5\u770B\u5C0F\u7EC4\u51A0\u519B\u5BF9\u5C40","View group final"),k=p?i(`${e||o("\u9009\u624B","Player")} ${o("\u961F\u4F0D\u4FE1\u606F","Teams")}`):`
      <span class="champion-matchup-player is-attack">${i(h)}</span>
      <span class="champion-matchup-score">\uFF08${i(String(l.attackWins))} VS ${i(String(l.defenseWins))}\uFF09</span>
      <span class="champion-matchup-player is-defense">${i(g)}</span>
      ${y?`
        <button class="champion-round-apply-button champion-round-switch-button" type="button" data-champion-switch-match="${i(String(c))}" data-champion-switch-label="${i(String($))}">
          ${i(n||o("\u5207\u6362\u5BF9\u5C40","Switch match"))}
        </button>
      `:""}
      <button class="champion-round-apply-button" type="button" data-champion-apply-match="1">
        ${i(o("\u5957\u7528\u67E5\u770B","Apply to view"))}
      </button>
    `,S=p?`
      <strong>${i(o("\u53C2\u8D5B\u9635\u5BB9","Lineups"))}</strong>
      <span>${i(o("\u8BE5\u9009\u624B\u76845\u961F\u9635\u5BB9","This player's 5 lineups"))}</span>
    `:"",T=r.length?r.map((f,C)=>p?na(f,e):ta(f,C)).join(""):`<p class="champion-data-empty">${i(o("\u6682\u65E0\u8BE5\u9009\u624B\u5BF9\u5C40\u3002","No matches for this player."))}</p>`,v=document.createElement("div");v.className="help-modal-backdrop champion-player-detail-backdrop",v.innerHTML=`
    <section class="help-modal champion-player-detail-modal" role="dialog" aria-modal="true" aria-label="${i(o("\u80DC\u8D1F\u6570\u636E\u961F\u4F0D","Match teams"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Champion</span>
          <strong class="${p?"":"champion-matchup-title"}">${k}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${i(o("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content champion-player-detail-content">
        ${S?`<div class="champion-round-title">${S}</div>`:""}
        <div class="champion-round-list">
          ${T}
        </div>
      </div>
    </section>
  `,document.body.append(v),v.querySelector(".help-modal-close")?.addEventListener("click",oe),v.querySelectorAll("[data-champion-chart-index]").forEach(f=>{f.addEventListener("click",()=>we(f,r)),f.addEventListener("keydown",C=>{["Enter"," "].includes(C.key)&&(C.preventDefault(),we(f,r))})}),v.querySelector("[data-champion-apply-match]")?.addEventListener("click",()=>la(r)),v.querySelector("[data-champion-switch-match]")?.addEventListener("click",f=>{const C=f.currentTarget?.dataset?.championSwitchMatch||"",M=f.currentTarget?.dataset?.championSwitchLabel||"";pe(e,C,"match",t,M)})}function N(e){const t=e?.querySelector(".champion-data-content");if(!t)return;if(t.classList.toggle("is-loading",!!s().loading),s().loading&&(s().loadingMode==="meta"||!Array.isArray(s().sourceSets))){t.innerHTML=`<p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u83B7\u53D6\u8D5B\u5B63\u6570\u636E...","Loading season data..."))}</p>`;return}if(s().error){t.innerHTML=`<p class="champion-data-empty is-error">${i(s().error)}</p>`;return}const a=Array.isArray(s().sourceSets)?s().sourceSets:[];if(!a.length){t.innerHTML=`<p class="champion-data-empty">${i(o("\u6682\u65E0\u51A0\u519B\u7ADE\u6280\u573A\u6570\u636E\u3002","No champion arena data."))}</p>`;return}const c=a.map(m=>J(m)).filter(Boolean),n=new Map(c.map(m=>{const x=a.find(D=>J(D)===m);return[m,x?.season||Be(m)]})),r=He([...new Set([...n.values()])]);s().selectedModule==="stats"&&!s().selectedSeason&&(s().selectedSeason=G()),s().selectedSeason===G()&&s().selectedModule!=="stats"&&(s().selectedSeason=""),s().selectedSeason&&s().selectedSeason!==G()&&!r.includes(s().selectedSeason)&&(s().selectedSeason="");const u=c.filter(m=>n.get(m)===s().selectedSeason);s().selectedFile&&!u.includes(s().selectedFile)&&(s().selectedFile="");const p=Ie(),l=p.filter(m=>J(m)===s().selectedFile),h=[...s().selectedModule==="stats"?[{value:G(),label:o("\u5168\u8D5B\u5B63","All seasons")}]:[{value:"",label:o("\u9009\u62E9\u8D5B\u5B63","Select season")}],...r.map(m=>({value:m,label:m}))],g=[{value:"",label:o("\u9009\u62E9\u51A0\u519B","Select champion")},...u.map(m=>{const x=a.find(D=>J(D)===m);return{value:m,label:x?.champion_name||qe(p,m)}})],y=`
    <div class="champion-module-tabs" role="tablist" aria-label="${i(o("\u8D5B\u5B63\u6570\u636E\u6A21\u5757","Season data modules"))}">
      <button class="champion-module-tab${s().selectedModule==="matches"?" is-active":""}" type="button" data-champion-module="matches">
        ${i(o("\u8D5B\u5B63\u5BF9\u5C40","Season Matches"))}
      </button>
      <button class="champion-module-tab${s().selectedModule==="stats"?" is-active":""}" type="button" data-champion-module="stats">
        ${i(o("\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1","Team Win Rate"))}
      </button>
    </div>
  `,$=`
    <div class="champion-data-select-group${s().selectedModule==="stats"?" is-season-only":""}">
      ${$e("championDataSeason",o("\u8D5B\u5B63","Season"),s().selectedSeason,h)}
      ${s().selectedModule==="stats"?"":$e("championDataFile",o("\u51A0\u519B","Champion"),s().selectedFile,g)}
    </div>
  `,k=`
    ${y}
    <div class="champion-data-toolbar">${$}</div>
  `,S=()=>{t.querySelectorAll("[data-champion-module]").forEach(m=>{m.addEventListener("click",()=>{s().selectedModule=m.dataset.championModule==="stats"?"stats":"matches",s().selectedModule==="stats"&&(s().selectedFile="",s().selectedStatSide="combined",s().selectedStatRankType="recommend",s().selectedMatchupTeamKey=""),s().selectedMatchNo=null,s().selectedPlayerName="",N(e)})}),t.querySelector("#championDataSeason")?.addEventListener("change",m=>{s().selectedSeason=m.target.value,s().selectedFile="",s().rows=null,s().expandedStatRound=null,s().selectedMatchupTeamKey="",s().selectedDivision="qualifier",s().selectedGroup="",s().selectedMatchNo=null,s().selectedPlayerName="",N(e)}),t.querySelector("#championDataFile")?.addEventListener("change",m=>{s().selectedFile=m.target.value,s().expandedStatRound=null,s().selectedDivision="qualifier",s().selectedGroup="",s().selectedMatchNo=null,s().selectedPlayerName="",s().selectedFile?Ke(e,s().selectedFile):(s().rows=null,N(e))})};if(!s().selectedSeason){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(s().selectedModule==="stats"?o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u540E\u67E5\u770B\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1\u3002","Select a season to view team win rates."):o("\u8BF7\u9009\u62E9\u8D5B\u5B63\u548C\u51A0\u519B\u540E\u67E5\u770B\u6570\u636E\u3002","Select a season and champion to view data."))}</p>
    `,S();return}if(s().selectedModule==="stats"){const m=s().selectedStatSide==="combined"?"combined":s().selectedStatSide==="defense"?"defense":"attack",x=m==="combined"?String(s().selectedMatchupTeamKey||""):"",D=`${s().selectedSeason}|${m}|${x}`,Fe=s().statsBySeasonSide?.[D],ae=Oe(Fe)?s().statsBySeasonSide[D]:null;if(!ae&&!s().loading&&ze(e,s().selectedSeason,m),!ae||s().loadingMode==="stats"){t.innerHTML=`
        ${k}
        <p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u8BFB\u53D6\u961F\u4F0D\u80DC\u7387\u7EDF\u8BA1...","Loading team win rates..."))}</p>
      `,S();return}t.innerHTML=`
      ${k}
      <div class="champion-data-result">
        ${aa(ae)}
      </div>
    `,S(),t.querySelectorAll("[data-champion-stat-side]").forEach(w=>{w.addEventListener("click",()=>{s().selectedStatSide=w.dataset.championStatSide==="combined"?"combined":w.dataset.championStatSide==="defense"?"defense":"attack",s().selectedMatchupTeamKey="",s().selectedStatSide==="combined"&&(s().selectedStatRankType="recommend"),s().expandedStatRound=null,N(e)})}),t.querySelectorAll("[data-champion-stat-rank]").forEach(w=>{w.addEventListener("click",()=>{s().selectedStatRankType=["recommend","systems","rate","round","characters"].includes(w.dataset.championStatRank)?w.dataset.championStatRank:"games",["recommend","systems","characters"].includes(s().selectedStatRankType)&&s().selectedStatSide!=="combined"?s().selectedStatSide="combined":!["recommend","systems","characters"].includes(s().selectedStatRankType)&&s().selectedStatSide==="combined"&&(s().selectedStatSide="attack"),s().selectedStatRankType!=="recommend"&&(s().selectedMatchupTeamKey=""),s().expandedStatRound=null,N(e)})}),t.querySelectorAll("[data-champion-matchup-team-key]").forEach(w=>{const I=()=>{const R=String(w.dataset.championMatchupTeamKey||"");!R||R===s().selectedMatchupTeamKey||(s().selectedMatchupTeamKey=R,s().selectedStatSide="combined",s().selectedStatRankType="recommend",N(e))};w.addEventListener("click",I),w.addEventListener("keydown",R=>{R.key!=="Enter"&&R.key!==" "||(R.preventDefault(),I())})}),t.querySelector("[data-champion-matchup-back]")?.addEventListener("click",()=>{s().selectedMatchupTeamKey="",N(e)}),t.querySelectorAll("[data-champion-stat-round-toggle]").forEach(w=>{w.addEventListener("click",()=>{const I=w.dataset.championStatRoundToggle||"";s().expandedStatRound=String(s().expandedStatRound||"")===String(I)?null:I,N(e),s().expandedStatRound&&requestAnimationFrame(()=>{const R=t.querySelector(`[data-champion-stat-round-group="${String(s().expandedStatRound)}"]`),_=R?.closest(".champion-stats-list");if(!R||!_)return;const V=R.getBoundingClientRect(),U=_.getBoundingClientRect();V.top<U.top?_.scrollTo({top:_.scrollTop-(U.top-V.top)-6,behavior:"smooth"}):V.bottom>U.bottom&&_.scrollTo({top:_.scrollTop+(V.bottom-U.bottom)+6,behavior:"smooth"})})})});return}if(!s().selectedFile){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(o("\u8BF7\u9009\u62E9\u51A0\u519B\u540E\u67E5\u770B\u5BF9\u5C40\u6570\u636E\u3002","Select a champion to view match data."))}</p>
    `,S();return}if(s().loading&&s().loadingMode==="file"){t.innerHTML=`
      ${k}
      <p class="champion-data-empty champion-data-loading">${i(o("\u6B63\u5728\u8BFB\u53D6\u8BE5\u51A0\u519B\u6570\u636E...","Loading selected champion data..."))}</p>
    `,S();return}if(!l.length){t.innerHTML=`
      ${k}
      <p class="champion-data-empty">${i(o("\u6682\u65E0\u8BE5\u51A0\u519B\u6570\u636E\u3002","No data for this champion."))}</p>
    `,S();return}const T=l.some(m=>se(m)==="champion"),v=l.some(m=>se(m)==="qualifier");s().selectedDivision==="champion"&&!T&&(s().selectedDivision="qualifier"),s().selectedDivision==="qualifier"&&!v&&(s().selectedDivision="champion");const f=l.filter(m=>se(m)==="qualifier"),C=je(f,"stage_group").sort((m,x)=>Number(m)-Number(x));s().selectedDivision==="qualifier"&&(!s().selectedGroup||!C.map(String).includes(String(s().selectedGroup)))&&(s().selectedGroup=String(C[0]||""));const M=ye(),b=Ve(M),E=ce(b,1),F=ce(b,2),j=ce(b,3),ee=$a(E,F,j),he=C.map(m=>({value:m,label:`GROUP ${String(m).padStart(2,"0")}`})),Le=s().selectedDivision==="champion"?o("\u51A0\u519B\u4E89\u9738\u8D5B","Champion Finals"):o("\u664B\u7EA7\u8D5B","Qualifier"),We=he.find(m=>String(m.value)===String(s().selectedGroup))?.label||"",Ee=s().selectedDivision==="qualifier"?`<div class="champion-group-tabs" role="tablist" aria-label="${i(o("\u664B\u7EA7\u8D5B\u5C0F\u7EC4","Qualifier groups"))}">
        ${he.map(m=>`
          <button class="champion-group-tab${String(m.value)===String(s().selectedGroup)?" is-active":""}" type="button" data-champion-group="${i(String(m.value))}">
            ${i(m.label)}
          </button>
        `).join("")}
      </div>`:"";t.innerHTML=`
    ${y}
    <div class="champion-data-toolbar">
      ${$}
      <div class="champion-division-tabs" role="tablist" aria-label="${i(o("\u8D5B\u7A0B","Bracket type"))}">
        <button class="champion-division-tab${s().selectedDivision==="qualifier"?" is-active":""}" type="button" data-champion-division="qualifier" ${v?"":"disabled"}>${i(o("\u664B\u7EA7\u8D5B","Qualifier"))}</button>
        <button class="champion-division-tab${s().selectedDivision==="champion"?" is-active":""}" type="button" data-champion-division="champion" ${T?"":"disabled"}>${i(o("\u51A0\u519B\u8D5B","Champion"))}</button>
      </div>
    </div>
    <div class="champion-data-result">
      ${Ee}
      <section class="champion-bracket-panel">
        <div class="champion-bracket-title">
          <span>${i(Le)}</span>
          <strong>${i(s().selectedDivision==="qualifier"?We:o("8\u7EC4\u51A0\u519B\u5BF9\u5C40","Top 8 group winners"))}</strong>
        </div>
        <div class="champion-bracket-board">
          ${ee}
        </div>
      </section>
    </div>
  `,S(),t.querySelectorAll("[data-champion-division]").forEach(m=>{m.addEventListener("click",()=>{s().selectedDivision=m.dataset.championDivision==="champion"?"champion":"qualifier",s().selectedMatchNo=null,s().selectedPlayerName="",N(e)})}),t.querySelectorAll("[data-champion-group]").forEach(m=>{m.addEventListener("click",()=>{s().selectedGroup=m.dataset.championGroup||"",s().selectedMatchNo=null,s().selectedPlayerName="",N(e)})}),t.querySelectorAll("[data-champion-player]").forEach(m=>{m.addEventListener("click",()=>{s().selectedMatchNo=m.dataset.championMatch||null,s().selectedPlayerName=m.dataset.championPlayer||"",pe(s().selectedPlayerName,s().selectedMatchNo,m.dataset.championDetail||"match",m.dataset.championAltMatch||"",m.dataset.championAltLabel||"")})})}export{pe as openChampionPlayerDetailModal,N as renderChampionDataModalContent,xe as setChampionDataUiApi};
