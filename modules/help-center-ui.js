const De=9e4,E=new Map;let m={},r={},D={},$="",N="help",R=5;function te(t={}){m=t||{},r=m.state||{},D=m.els||{},$=m.endpoint||"",N=m.shareUrlParam||"help",R=Number(m.teamSize||5)}function c(t,e=null){const u=m[t];return typeof u=="function"?u:e||(()=>{})}function n(t,e){return c("localize",(u,l)=>u||l||"")(t,e)}function a(t){return c("escapeHtml",e=>String(e??""))(t)}function i(t){return c("showToast")(t)}function T(...t){return c("handleRejectedAuthSessionResponse")(...t)}function H(t=!1){return c("getHelpCenterHeaders")(t)}function w(){return c("buildHelpCenterPayload",()=>({}))()}function M(t){return c("isHelpCenterSolvableArenaMode",e=>e==="normal"||e==="special")(t)}function x(t,e){return c("hasHelpCenterSideMembers",()=>!1)(t,e)}function ne(t){return c("findSolvedHelpCenterRequestForDefense",async()=>null)(t)}function O(t){return c("toHelpCenterProtocolPayload",e=>e)(t)}function U(t,e){return c("getHelpCenterPayloadForRequestMode",u=>u)(t,e)}function ae(t){return c("clearHelpCenterAttackDraft")(t)}function ue(t){return c("clearHelpCenterSolveDraft")(t)}function F(){return c("render")()}function P(t){return c("getHelpCenterModeLabel",e=>String(e||""))(t)}function re(t){return c("getHelpCenterRegionLabel",e=>e==="global"?"Global":"CN")(t)}function le(t,e){return c("getHelpCenterRows",()=>[])(t,e)}function B(t){return c("getCharacterById",()=>null)(t)}function j(t){return c("getCharacterLocalizedName",e=>e?.name||e?.id||"")(t)}function V(t){return c("getAvatarMarkup",()=>'<span class="avatar-fallback"><span class="avatar-fallback-name">?</span></span>')(t)}function z(t){return c("getTeamSlotRarityClass",()=>"")(t)}function se(...t){return c("renderFeatureTouchCard",()=>"")(...t)}function oe(...t){return c("bindFeatureTouchCards")(...t)}function K(){return c("requireHelpCenterLogin",()=>!1)()}function ie(t){return c("applyHelpCenterRequestToSolveWorkspace",()=>!1)(t)}function ce(t){return c("copyTextToClipboard",async()=>{})(t)}function W(t){return c("normalizeHelpCenterRequestId",e=>String(e||"").trim())(t)}function g(){document.removeEventListener("keydown",Y),document.querySelector(".help-center-modal-backdrop")?.remove()}function Y(t){t.key==="Escape"&&g()}async function de(){return import("./help-center-service.js")}function pe(t){(t?.response||t?.payload)&&T(t.response,t.payload)}function fe(t={}){const e=!!t.append,u=new URLSearchParams({limit:"30"}),l=r.helpCenter.filters||{};return(l.status==="open"||l.status==="closed")&&u.set("status",l.status),l.arenaMode&&l.arenaMode!=="all"&&u.set("mode",l.arenaMode),l.region&&l.region!=="all"&&u.set("region",l.region),l.sort&&u.set("sort",l.sort),l.scope&&l.scope!=="all"&&u.set("scope",l.scope),e&&r.helpCenter.nextCursor&&u.set("cursor",r.helpCenter.nextCursor),u}function G(t){const e=new URLSearchParams(t);return e.delete("cursor"),e.toString()}function _(t){const e=t==="global"?"global":"cn";return`<span class="help-center-region-badge is-${a(e)}">${a(re(e))}</span>`}function he(t){const e=E.get(G(t));return!e||Date.now()-e.savedAt>9e4?null:e}function be(t,e){E.set(G(t),{savedAt:Date.now(),requests:Array.isArray(e.data)?e.data:[],nextCursor:e.meta?.nextCursor||""})}function Ce(){E.clear()}async function S(t,e={}){const u=!!e.append,l=!!e.force,o=fe({append:u});let d=!1;if(!u&&!l){const s=he(o);s&&(d=!0,r.helpCenter.loading=!1,r.helpCenter.error="",r.helpCenter.requests=s.requests,r.helpCenter.nextCursor=s.nextCursor,I(t))}d||(r.helpCenter.loading=!0,r.helpCenter.error="",I(t));try{const s=await fetch(`${$}?${o.toString()}`,{headers:await H(!1)}),p=await s.json().catch(()=>null);if(!s.ok||!p?.ok||!Array.isArray(p.data))throw T(s,p),new Error(p?.code||"LOAD_FAILED");r.helpCenter.requests=u?[...r.helpCenter.requests||[],...p.data]:p.data,r.helpCenter.nextCursor=p.meta?.nextCursor||"",u||be(o,p)}catch(s){d||(r.helpCenter.error=h(s)),console.warn("[HelpCenter] list failed",s)}finally{r.helpCenter.loading=!1,I(t)}}async function v(t,e){r.helpCenter.loading=!0,r.helpCenter.error="",r.helpCenter.selectedId=e,r.helpCenter.mode="detail",r.helpCenter.detail=null,y(t);try{const u=new URLSearchParams({id:e,solutionLimit:"50"}),l=await fetch(`${$}?${u.toString()}`,{headers:await H(!1)}),o=await l.json().catch(()=>null);if(!l.ok||!o?.ok||!o.data?.request)throw T(l,o),new Error(o?.code||"LOAD_FAILED");r.helpCenter.detail=o.data}catch(u){r.helpCenter.error=n("\u6C42\u52A9\u8BE6\u60C5\u8BFB\u53D6\u5931\u8D25","Failed to load help detail"),console.warn("[HelpCenter] detail failed",u)}finally{r.helpCenter.loading=!1,y(t)}}async function b(t){const e=await de();try{const u=await e.postHelpCenterActionPayload($,t,await H(!0));return Ce(),u.data||{}}catch(u){throw pe(u),u}}async function ve(t,e={}){if(r.helpCenter.actionPending)return;const u=A(t.querySelector("[data-help-title]")?.value,20),l=A(t.querySelector("[data-help-description]")?.value,100),o=w();if(!u){i(n("\u8BF7\u586B\u5199\u6C42\u52A9\u6807\u9898","Please enter a title."));return}if(!M(o.mode)){i(n("\u4E92\u52A9\u6C42\u52A9\u6682\u65F6\u53EA\u652F\u6301\u666E\u901A\u548C\u7279\u6B8A\u7ADE\u6280\u573A","Help requests currently support Normal and Special Arena only."));return}if(!x(o,"defense")){i(n("\u5F53\u524D\u9632\u5B88\u961F\u4F0D\u4E3A\u7A7A","Current defense team is empty."));return}if(!e.skipSolvedCheck)try{const s=await ne(o);if(s?.id&&window.confirm(n(`\u53D1\u73B0\u76F8\u540C\u9632\u5B88\u5DF2\u6709\u5DF2\u89E3\u51B3\u6C42\u52A9\uFF1A\u300A${s.title||"\u672A\u547D\u540D\u6C42\u52A9"}\u300B\u3002\u786E\u5B9A\u67E5\u770B\u5DF2\u6709\u89E3\u6CD5\uFF1F\u53D6\u6D88\u5219\u7EE7\u7EED\u53D1\u5E03\u3002`,`A solved request with the same defense already exists: "${s.title||"Untitled"}". OK to view it, Cancel to continue publishing.`))){await v(t,s.id);return}}catch(s){console.warn("[HelpCenter] solved duplicate check failed",s)}r.helpCenter.actionPending="create-request";const d=t.querySelector("[data-help-create]");d&&(d.disabled=!0,d.textContent=n("\u53D1\u5E03\u4E2D...","Publishing..."));try{const s=await b({action:"create_request",title:u,description:l,arenaMode:o.mode,region:o.region,defensePayload:O(o)});i(n("\u6C42\u52A9\u5DF2\u53D1\u5E03","Help request created.")),await v(t,s.id)}catch(s){console.warn("[HelpCenter] create request failed",s),i(h(s)),d&&(d.disabled=!1,d.textContent=n("\u786E\u8BA4\u53D1\u5E03","Create"))}finally{r.helpCenter.actionPending=""}}async function ye(t){if(r.helpCenter.actionPending)return;const e=r.helpCenter.detail?.request;if(!e?.id)return;const u=U(w(),e.arenaMode);if(u.mode!==e.arenaMode){i(n("\u5F53\u524D\u7ADE\u6280\u573A\u6A21\u5F0F\u4E0E\u6C42\u52A9\u4E0D\u4E00\u81F4","Current arena mode does not match this request."));return}if(!x(u,"attack")){i(n("\u5F53\u524D\u8FDB\u653B\u961F\u4F0D\u4E3A\u7A7A","Current attack team is empty."));return}const l=A(t.querySelector("[data-help-solution-description]")?.value,100);r.helpCenter.actionPending="create-solution";const o=t.querySelector("[data-help-create-solution]");o&&(o.disabled=!0,o.textContent=n("\u63D0\u4EA4\u4E2D...","Submitting..."));try{await b({action:"create_solution",requestId:e.id,attackPayload:O(u),description:l}),i(n("\u89E3\u6CD5\u5DF2\u63D0\u4EA4","Solution submitted.")),ae(e.arenaMode),ue(e.id),F(),await v(t,e.id)}catch(d){console.warn("[HelpCenter] create solution failed",d),i(h(d)),o&&(o.disabled=!1,o.textContent=n("\u63D0\u4EA4\u89E3\u6CD5","Submit solution"))}finally{r.helpCenter.actionPending=""}}async function me(t,e){try{await b({action:"toggle_solution_vote",solutionId:e}),await v(t,r.helpCenter.detail?.request?.id||r.helpCenter.selectedId)}catch(u){console.warn("[HelpCenter] vote failed",u),i(h(u))}}async function $e(t){const e=r.helpCenter.detail?.request;if(e?.id)try{await b({action:"close_request",requestId:e.id}),await v(t,e.id)}catch(u){console.warn("[HelpCenter] close request failed",u),i(h(u))}}async function ge(t,e){const u=r.helpCenter.detail?.request;if(!(!u?.id||!e))try{await b({action:"accept_solution",requestId:u.id,solutionId:e}),i(n("\u5DF2\u91C7\u7EB3\u89E3\u6CD5\u5E76\u5173\u95ED\u6C42\u52A9","Solution accepted and request closed.")),await v(t,u.id)}catch(l){console.warn("[HelpCenter] accept solution failed",l),i(h(l))}}async function Se(t){const e=r.helpCenter.detail?.request;if(e?.id)try{await b({action:"hide_request",requestId:e.id}),i(n("\u5DF2\u9690\u85CF\u6C42\u52A9","Request hidden.")),r.helpCenter.mode="list",r.helpCenter.detail=null,await S(t)}catch(u){console.warn("[HelpCenter] hide request failed",u),i(h(u))}}async function qe(t,e){const u=r.helpCenter.detail?.request;if(!(!u?.id||!e))try{await b({action:"hide_solution",solutionId:e}),i(n("\u5DF2\u9690\u85CF\u89E3\u6CD5","Solution hidden.")),await v(t,u.id)}catch(l){console.warn("[HelpCenter] hide solution failed",l),i(h(l))}}async function Q(t,e){if(!t||!e)return;const u=window.prompt(n("\u8BF7\u586B\u5199\u4E3E\u62A5\u539F\u56E0\uFF08\u53EF\u7559\u7A7A\uFF09","Report reason (optional)"),"");if(u!==null)try{await b({action:"report_content",targetType:t,targetId:e,reason:A(u,240)}),i(n("\u4E3E\u62A5\u5DF2\u63D0\u4EA4","Report submitted."))}catch(l){console.warn("[HelpCenter] report failed",l),i(h(l))}}function He(t){const e=W(t),u=new URL(window.location.href);return u.search="",u.hash="",u.searchParams.set(N,e),u.toString()}async function we(){const t=r.helpCenter.detail?.request,e=W(t?.id);if(!e){i(n("\u6C42\u52A9\u94FE\u63A5\u751F\u6210\u5931\u8D25","Failed to create request link"));return}try{const u=`${n("\u6C42\u52A9\uFF0C\u8FD9\u4E2A\u961F\u4F0D\u600E\u4E48\u89E3\uFF1A","Help: how should this team be solved?")}
${He(e)}`;await ce(u),i(n("\u5DF2\u590D\u5236\u6C42\u52A9\u94FE\u63A5","Request link copied"))}catch(u){console.warn("[HelpCenter] copy request link failed",u),i(n("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u526A\u8D34\u677F\u6743\u9650","Copy failed. Please check clipboard permission."))}}function Le(t){const e=r.helpCenter.detail?.request;if(e?.id&&K()){if(!M(e.arenaMode)){i(n("\u4E92\u52A9\u89E3\u9898\u6682\u65F6\u53EA\u652F\u6301\u666E\u901A\u548C\u7279\u6B8A\u7ADE\u6280\u573A","Solving currently supports Normal and Special Arena only."));return}if(!ie(e)){i(n("\u6C42\u52A9\u961F\u4F0D\u6570\u636E\u5F02\u5E38\uFF0C\u65E0\u6CD5\u8F7D\u5165","Request team data is invalid."));return}r.helpCenter.solveRequestId=e.id,r.helpCenter.solveRequestTitle=e.title||"",r.helpCenter.solveRequestRegion=e.region||e.defensePayload?.region||"",g(),F(),D.teamSlots?.scrollIntoView({behavior:"smooth",block:"start"}),i(n("\u5DF2\u8F7D\u5165\u6C42\u52A9\u9632\u5B88\uFF0C\u586B\u5199\u8FDB\u653B\u961F\u540E\u70B9\u5E95\u90E8\u6309\u94AE\u63D0\u4EA4","Defense loaded. Fill attack teams, then use the bottom submit button."))}}async function L(t){r.helpCenter.loading=!0,r.helpCenter.error="",r.helpCenter.mode="reports",y(t);try{const e=new URLSearchParams({reports:"1",limit:"30",reportStatus:r.helpCenter.reportStatus||"open"}),u=await fetch(`${$}?${e.toString()}`,{headers:await H(!0)}),l=await u.json().catch(()=>null);if(!u.ok||!l?.ok||!Array.isArray(l.data))throw new Error(l?.code||"LOAD_FAILED");r.helpCenter.reports=l.data}catch(e){r.helpCenter.error=h(e),console.warn("[HelpCenter] reports failed",e)}finally{r.helpCenter.loading=!1,y(t)}}async function X(t,e,u="reviewed"){try{await b({action:"review_report",reportId:e,status:u}),i(n("\u4E3E\u62A5\u72B6\u6001\u5DF2\u66F4\u65B0","Report status updated.")),await L(t)}catch(l){console.warn("[HelpCenter] review report failed",l),i(h(l))}}async function Ae(t,e){const u=(r.helpCenter.reports||[]).find(l=>l.id===e);if(u?.targetId)try{await b({action:u.targetType==="solution"?"hide_solution":"hide_request",id:u.targetId}),await b({action:"review_report",reportId:e,status:"reviewed"}),i(n("\u5DF2\u9690\u85CF\u88AB\u4E3E\u62A5\u5185\u5BB9","Reported content hidden.")),await L(t)}catch(l){console.warn("[HelpCenter] hide report target failed",l),i(h(l))}}function A(t,e){return String(t||"").trim().slice(0,e)}function k(t){return t?.displayName||n("\u533F\u540D\u7528\u6237","Anonymous")}function Ee(t){const e=k(t),u=Number(t?.acceptedSolutionCount||0);return u<=0?e:`${e} \xB7 ${n("\u91C7\u7EB3","Accepted")} ${u}`}function h(t){const e=String(t?.message||"");return e==="UNAUTHENTICATED"?n("\u8BF7\u5148\u767B\u5F55","Please sign in first."):e==="RATE_LIMITED"?n("\u64CD\u4F5C\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5","Too many actions. Try again later."):e==="INVALID_PAYLOAD"?n("\u961F\u4F0D\u6570\u636E\u4E0D\u5B8C\u6574\u6216\u683C\u5F0F\u5F02\u5E38","Team payload is incomplete or invalid."):e==="DUPLICATE_SOLUTION"?n("\u8FD9\u4E2A\u8FDB\u653B\u961F\u4F0D\u5DF2\u7ECF\u63D0\u4EA4\u8FC7\u89E3\u6CD5","This attack team has already been submitted."):e==="REQUEST_CLOSED"?n("\u8BE5\u6C42\u52A9\u5DF2\u5173\u95ED","This request is closed."):e==="SELF_SOLUTION_NOT_ALLOWED"?n("\u4E0D\u80FD\u7ED9\u81EA\u5DF1\u7684\u6C42\u52A9\u63D0\u4EA4\u89E3\u6CD5","You cannot submit a solution to your own request."):e==="SELF_VOTE_NOT_ALLOWED"?n("\u4E0D\u80FD\u7ED9\u81EA\u5DF1\u7684\u89E3\u6CD5\u70B9\u8D5E","You cannot vote for your own solution."):e==="TARGET_TYPE_INVALID"||e==="TARGET_REQUIRED"||e==="NOT_FOUND"?n("\u4E3E\u62A5\u5BF9\u8C61\u4E0D\u5B58\u5728","Report target not found."):n("\u6C42\u52A9\u64CD\u4F5C\u5931\u8D25","Help center action failed.")}function q(t,e,u={}){const l=le(t,e);return l.length?l.length>1&&u.compactStack?`
      <div class="help-center-stack-teams" aria-label="${a(e==="attack"?n("\u8FDB\u653B\u961F\u4F0D","Attack teams"):n("\u9632\u5B88\u961F\u4F0D","Defense teams"))}">
        <div class="help-center-stack-labels">
          ${l.map((o,d)=>`<span>R${d+1}</span>`).join("")}
        </div>
        <div class="help-center-stack-cards">
          ${l.map((o,d)=>`
            <div class="help-center-stack-card" title="R${d+1}">
              ${Array.from({length:R},(s,p)=>{const f=B(o?.[p]);return`
                  <span class="help-center-stack-member${z(f)}" title="${a(f?j(f):"-")}">
                    ${f?V(f):'<span class="avatar-fallback"><span class="avatar-fallback-name">?</span></span>'}
                  </span>
                `}).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    `:l.map((o,d)=>{const s=l.length>1?`R${d+1}`:e==="attack"?n("\u8FDB\u653B","ATK"):"";return`
    <div class="help-center-team-row${s?"":" is-label-hidden"}">
      ${s?`<span class="help-center-round">${a(s)}</span>`:""}
      <div class="help-center-members">
        ${Array.from({length:R},(p,f)=>{const C=B(o?.[f]);return`
            <span class="help-center-member${z(C)}" title="${a(C?j(C):"-")}">
              ${C?V(C):'<span class="avatar-fallback"><span class="avatar-fallback-name">?</span></span>'}
            </span>
          `}).join("")}
      </div>
    </div>
  `}).join(""):`<p class="help-center-empty">${a(n("\u6682\u65E0\u961F\u4F0D","No team"))}</p>`}function Re(t={}){const{className:e="",title:u="",meta:l="",actions:o="",noteLabel:d="",note:s="",teamLabel:p="",teamPayload:f=null,teamSide:C="defense"}=t;return`
    <article class="help-center-display-card${e?` ${e}`:""}">
      <div class="help-center-display-head">
        <div class="help-center-display-title-wrap">
          <strong class="help-center-display-title">${a(u)}</strong>
          ${l?`<span class="help-center-display-meta">${l}</span>`:""}
        </div>
        ${o?`<div class="help-center-display-actions">${o}</div>`:""}
      </div>
      ${s?`
        <div class="help-center-display-section help-center-display-note">
          <span>${a(d)}</span>
          <p class="help-center-description">${a(s)}</p>
        </div>
      `:""}
      <div class="help-center-display-section help-center-display-teams">
        ${p?`<strong class="help-center-display-team-title">${a(p)}</strong>`:""}
        ${q(f,C)}
      </div>
    </article>
  `}function Z(){if(r.helpCenter.loading)return`<p class="help-center-empty champion-data-loading">${a(n("\u6B63\u5728\u8BFB\u53D6\u6C42\u52A9\u5217\u8868","Loading help requests"))}</p>`;if(r.helpCenter.error)return`<p class="help-center-error">${a(r.helpCenter.error)}</p>`;const t=r.helpCenter.requests||[];return`
    <div class="help-center-list">
      ${t.length?t.map(e=>`
        <button class="help-center-request-card is-${e.status==="closed"?"closed":"open"}" type="button" data-help-request-id="${a(e.id)}">
          <span class="help-center-request-title">${a(e.title)}</span>
          <span class="help-center-request-meta">${a(P(e.arenaMode))} ${_(e.region||e.defensePayload?.region)} <span class="help-center-status-badge is-${e.status==="closed"?"closed":"open"}">${e.status==="closed"?a(n("\u5DF2\u5173\u95ED","Closed")):a(n("\u6C42\u89E3\u4E2D","Open"))}</span> ${a(k(e.author))} \xB7 ${Number(e.solutionCount||0)} ${a(n("\u4E2A\u89E3\u6CD5","solutions"))} \xB7 ${Number(e.voteCount||0)} ${a(n("\u8D5E","votes"))}</span>
          <div class="help-center-team-mini">${q(e.defensePayload,"defense",{compactStack:!0})}</div>
        </button>
      `).join(""):`<p class="help-center-empty">${a(n("\u6682\u65E0\u6C42\u52A9\u3002\u5982\u679C\u4F60\u6709\u96BE\u62C6\u7684\u9632\u5B88\uFF0C\u5148\u5728\u961F\u4F0D\u533A\u6446\u597D\u9632\u5B88\uFF0C\u518D\u70B9\u51FB\u201C\u53D1\u5E03\u5F53\u524D\u9632\u5B88\u6C42\u52A9\u201D\u3002",'No requests yet. Set up a difficult defense first, then click "Create request from current defense".'))}</p>`}
    </div>
    ${r.helpCenter.nextCursor?`<button class="help-center-action-button help-center-load-more" type="button" data-help-load-more>${a(n("\u52A0\u8F7D\u66F4\u591A","Load more"))}</button>`:""}
  `}function Te(){const t=r.helpCenter.filters||{};return`
    <div class="help-center-detail-scroll">
    <div class="help-center-sticky-controls">
      <div class="help-center-toolbar">
        <button class="help-center-action-button is-primary" type="button" data-help-view="create">${a(n("\u53D1\u5E03\u5F53\u524D\u9632\u5B88\u6C42\u52A9","Create request from current defense"))}</button>
        <button class="help-center-action-button" type="button" data-help-refresh>${a(n("\u5237\u65B0","Refresh"))}</button>
        ${r.isAdmin?`<button class="help-center-action-button" type="button" data-help-view="reports">${a(n("\u4E3E\u62A5\u5217\u8868","Reports"))}</button>`:""}
      </div>
      <div class="help-center-filters">
        <label><span>${a(n("\u8303\u56F4","Scope"))}</span><select data-help-filter="scope">
          <option value="all" ${t.scope==="all"?"selected":""}>${a(n("\u5168\u90E8","All"))}</option>
          <option value="mine" ${t.scope==="mine"?"selected":""}>${a(n("\u6211\u7684\u6C42\u52A9","My requests"))}</option>
          <option value="solutions" ${t.scope==="solutions"?"selected":""}>${a(n("\u6211\u7684\u89E3\u6CD5","My solutions"))}</option>
        </select></label>
        <label><span>${a(n("\u72B6\u6001","Status"))}</span><select data-help-filter="status">
          <option value="all" ${t.status==="all"?"selected":""}>${a(n("\u5168\u90E8","All"))}</option>
          <option value="open" ${t.status==="open"?"selected":""}>${a(n("\u6C42\u89E3\u4E2D","Open"))}</option>
          <option value="closed" ${t.status==="closed"?"selected":""}>${a(n("\u5DF2\u5173\u95ED","Closed"))}</option>
        </select></label>
        <label><span>${a(n("\u6392\u5E8F","Sort"))}</span><select data-help-filter="sort">
          <option value="latest" ${t.sort==="latest"?"selected":""}>${a(n("\u6700\u65B0","Latest"))}</option>
          <option value="hot" ${t.sort==="hot"?"selected":""}>${a(n("\u70ED\u95E8","Hot"))}</option>
          <option value="solved" ${t.sort==="solved"?"selected":""}>${a(n("\u5DF2\u89E3\u51B3","Solved"))}</option>
        </select></label>
      </div>
    </div>
    <div class="help-center-scroll-body">
    ${se("help-center-touch-card-v1",n("\u7ADE\u6280\u573A\u4E92\u52A9\u600E\u4E48\u7528\uFF1F","How arena help works"),n("\u53D1\u5E03\u9632\u5B88\u6C42\u52A9\u540E\uFF0C\u5176\u4ED6\u4EBA\u53EF\u4EE5\u70B9\u201C\u53BB\u89E3\u9898\u201D\u8F7D\u5165\u9632\u5B88\uFF0C\u586B\u5199\u8FDB\u653B\u961F\u4F0D\u5E76\u63D0\u4EA4\u89E3\u6CD5\u3002","Post a defense request; others can solve it by loading the locked defense, filling attack teams, and submitting a solution."))}
    <div data-help-list-results>
      ${Z()}
    </div>
    </div>
    </div>
  `}function I(t){if(r.helpCenter.mode!=="list"){y(t);return}const e=t.querySelector("[data-help-list-results]");if(!e){y(t);return}const u=e.getBoundingClientRect().height;r.helpCenter.loading&&u>0&&(e.style.minHeight=`${Math.ceil(u)}px`),e.innerHTML=Z(),r.helpCenter.loading||(e.style.minHeight=""),J(t)}function Me(){if(r.helpCenter.loading)return`<p class="help-center-empty champion-data-loading">${a(n("\u6B63\u5728\u8BFB\u53D6\u4E3E\u62A5\u5217\u8868","Loading reports"))}</p>`;if(r.helpCenter.error)return`<p class="help-center-error">${a(r.helpCenter.error)}</p>`;const t=r.helpCenter.reports||[];return`
    <div class="help-center-detail-scroll">
    <div class="help-center-sticky-controls">
      <div class="help-center-toolbar">
        <button class="help-center-action-button" type="button" data-help-back>${a(n("\u8FD4\u56DE","Back"))}</button>
        <label class="help-center-report-status">
          <span>${a(n("\u4E3E\u62A5\u72B6\u6001","Report status"))}</span>
          <select data-help-report-status>
            <option value="open" ${r.helpCenter.reportStatus==="open"?"selected":""}>${a(n("\u5F85\u5904\u7406","Open"))}</option>
            <option value="reviewed" ${r.helpCenter.reportStatus==="reviewed"?"selected":""}>${a(n("\u5DF2\u5904\u7406","Reviewed"))}</option>
            <option value="dismissed" ${r.helpCenter.reportStatus==="dismissed"?"selected":""}>${a(n("\u5DF2\u5FFD\u7565","Dismissed"))}</option>
          </select>
        </label>
      </div>
    </div>
    <div class="help-center-scroll-body">
    <div class="help-center-report-list">
      ${t.length?t.map(e=>{const u=e.targetType==="request"?e.target?.title||e.targetId:e.target?.description||`${n("\u89E3\u6CD5","Solution")} ${e.targetId}`;return`
          <article class="help-center-report-card">
            <div>
              <strong>${a(e.targetType==="request"?n("\u6C42\u52A9","Request"):n("\u89E3\u6CD5","Solution"))} \xB7 ${a(u)}</strong>
              <p class="help-center-description">${a(e.reason||n("\u672A\u586B\u5199\u539F\u56E0","No reason"))}</p>
              <span class="help-center-request-meta">${a(e.reporter?.displayName||n("\u533F\u540D\u7528\u6237","Anonymous"))} \xB7 ${a(e.createdAt||"")}</span>
            </div>
            <div class="help-center-display-actions">
              <button class="help-center-action-button" type="button" data-help-hide-report-target="${a(e.id)}">${a(n("\u9690\u85CF\u76EE\u6807","Hide target"))}</button>
              <button class="help-center-action-button is-primary" type="button" data-help-review-report="${a(e.id)}">${a(n("\u6807\u8BB0\u5904\u7406","Mark reviewed"))}</button>
              <button class="help-center-action-button" type="button" data-help-dismiss-report="${a(e.id)}">${a(n("\u5FFD\u7565","Dismiss"))}</button>
            </div>
          </article>
        `}).join(""):`<p class="help-center-empty">${a(n("\u6682\u65E0\u4E3E\u62A5","No reports"))}</p>`}
    </div>
    </div>
    </div>
  `}function Pe(){const t=w();return`
    <div class="help-center-detail-scroll">
    <div class="help-center-sticky-controls">
      <div class="help-center-toolbar">
        <button class="help-center-action-button" type="button" data-help-back>${a(n("\u8FD4\u56DE","Back"))}</button>
      </div>
    </div>
    <div class="help-center-scroll-body">
    <label class="help-center-field">
      <span>${a(n("\u6807\u9898","Title"))}</span>
      <input data-help-title maxlength="20" placeholder="${a(n("\u4F8B\u5982\uFF1A\u8FD9\u4E2A\u9632\u5B88\u600E\u4E48\u62C6\uFF1F","Example: how to attack this defense?"))}" />
    </label>
    <label class="help-center-field">
      <span>${a(n("\u8865\u5145\u8BF4\u660E","Description"))}</span>
      <textarea data-help-description maxlength="100" rows="3" placeholder="${a(n("\u53EF\u586B\u5199\u6218\u529B\u9650\u5236\u3001\u7981\u6B62\u89D2\u8272\u3001\u76EE\u6807\u80DC\u7387\u7B49","Power limits, banned characters, target win rate, etc."))}"></textarea>
    </label>
    <section class="help-center-section">
      <strong>${a(n("\u5C06\u53D1\u5E03\u7684\u9632\u5B88\u961F\u4F0D","Defense to publish"))} \xB7 ${a(P(t.mode))} ${_(t.region)}</strong>
      ${q(t,"defense")}
    </section>
    <button class="help-center-action-button is-primary" type="button" data-help-create ${r.helpCenter.actionPending==="create-request"?"disabled":""}>${a(r.helpCenter.actionPending==="create-request"?n("\u53D1\u5E03\u4E2D...","Publishing..."):n("\u786E\u8BA4\u53D1\u5E03","Create"))}</button>
    </div>
    </div>
  `}function _e(){const t=r.helpCenter.detail;if(r.helpCenter.loading&&!t)return`<p class="help-center-empty champion-data-loading">${a(n("\u6B63\u5728\u8BFB\u53D6\u6C42\u52A9\u8BE6\u60C5","Loading help detail"))}</p>`;if(r.helpCenter.error)return`<p class="help-center-error">${a(r.helpCenter.error)}</p>`;const e=t?.request;if(!e)return`<p class="help-center-empty">${a(n("\u672A\u627E\u5230\u6C42\u52A9","Request not found"))}</p>`;const u=[...t?.solutions||[]].sort((s,p)=>e.acceptedSolutionId===s.id?-1:e.acceptedSolutionId===p.id?1:0),l=U(w(),e.arenaMode),o=!!((e.isMine||e.canModerate)&&e.status==="open"),d=`${a(P(e.arenaMode))} ${_(e.region||e.defensePayload?.region)} <span class="help-center-status-badge is-${e.status==="closed"?"closed":"open"}">${e.status==="closed"?a(n("\u5DF2\u5173\u95ED","Closed")):a(n("\u6C42\u89E3\u4E2D","Open"))}</span> ${a(k(e.author))}`;return`
    <div class="help-center-detail-scroll">
    <div class="help-center-sticky-controls">
      <div class="help-center-toolbar">
        <button class="help-center-action-button" type="button" data-help-back>${a(n("\u8FD4\u56DE","Back"))}</button>
        <button class="help-center-action-button" type="button" data-help-share-request>${a(n("\u5206\u4EAB\u6C42\u52A9","Share request"))}</button>
        ${e.status==="open"&&!e.isMine&&M(e.arenaMode)?`<button class="help-center-action-button is-primary" type="button" data-help-start-solve>${a(n("\u53BB\u89E3\u9898","Solve"))}</button>`:""}
        ${e.isMine&&e.status==="open"?`<button class="help-center-action-button" type="button" data-help-close-request>${a(n("\u5173\u95ED\u6C42\u52A9","Close request"))}</button>`:""}
        ${e.isMine?"":`<button class="help-center-action-button" type="button" data-help-report-request>${a(n("\u4E3E\u62A5","Report"))}</button>`}
        ${e.canModerate?`<button class="help-center-action-button" type="button" data-help-hide-request>${a(n("\u9690\u85CF\u6C42\u52A9","Hide request"))}</button>`:""}
      </div>
    </div>
    <div class="help-center-scroll-body">
    <article class="help-center-display-card is-request">
      <div class="help-center-display-head">
        <div class="help-center-display-title-wrap">
          <strong class="help-center-display-title">${a(e.title)}</strong>
          <span class="help-center-display-meta">${d}</span>
        </div>
      </div>
      ${e.description?`
        <div class="help-center-display-section help-center-display-note">
          <span>${a(n("\u8865\u5145\u8BF4\u660E","Description"))}</span>
          <p class="help-center-description">${a(e.description)}</p>
        </div>
      `:""}
      <div class="help-center-display-section help-center-display-teams">
        <strong class="help-center-display-team-title">${a(n("\u9632\u5B88\u961F\u4F0D","Defense teams"))}</strong>
        ${q(e.defensePayload,"defense")}
      </div>
    </article>
    <section class="help-center-section help-center-solutions-section">
      <strong>${a(n("\u5DF2\u6709\u89E3\u6CD5","Solutions"))}</strong>
      <div class="help-center-solution-list">
        ${u.length?u.map((s,p)=>{const f=e.acceptedSolutionId===s.id,C=`#${p+1}${f?` \xB7 ${n("\u5DF2\u91C7\u7EB3","Accepted")}`:""} \xB7 ${Ee(s.author)}`,ee=`
            ${o?`<button class="help-center-action-button is-primary" type="button" data-help-accept="${a(s.id)}">${a(n("\u91C7\u7EB3\u5E76\u5173\u95ED","Accept and close"))}</button>`:""}
            ${s.isMine?"":`<button class="help-center-action-button" type="button" data-help-report-solution="${a(s.id)}">${a(n("\u4E3E\u62A5","Report"))}</button>`}
            ${e.canModerate?`<button class="help-center-action-button" type="button" data-help-hide-solution="${a(s.id)}">${a(n("\u9690\u85CF","Hide"))}</button>`:""}
            ${s.isMine?`<span class="help-center-self-vote">${a(n("\u81EA\u5DF1\u7684\u89E3\u6CD5","Own solution"))} \xB7 ${Number(s.voteCount||0)}</span>`:`<button class="help-center-action-button" type="button" data-help-vote="${a(s.id)}">${s.votedByMe?a(n("\u5DF2\u8D5E","Voted")):a(n("\u70B9\u8D5E","Vote"))} \xB7 ${Number(s.voteCount||0)}</button>`}
          `;return Re({className:`is-solution${f?" is-accepted":""}`,title:C,actions:ee,noteLabel:n("\u89E3\u6CD5\u8BF4\u660E","Solution note"),note:s.description,teamLabel:n("\u8FDB\u653B\u961F\u4F0D","Attack teams"),teamPayload:s.attackPayload,teamSide:"attack"})}).join(""):`<p class="help-center-empty">${a(n("\u6682\u65E0\u89E3\u6CD5\u3002\u70B9\u51FB\u201C\u53BB\u89E3\u9898\u201D\u4F1A\u8FDB\u5165\u4E92\u52A9\u89E3\u9898\u6A21\u5F0F\uFF0C\u9632\u5B88\u961F\u4F0D\u4F1A\u81EA\u52A8\u9501\u5B9A\uFF0C\u53EA\u9700\u8981\u586B\u5199\u8FDB\u653B\u961F\u4F0D\u3002",'No solutions yet. Click "Solve" to enter help-solving mode: the defense is locked, and you only need to fill attack teams.'))}</p>`}
      </div>
    </section>
    ${e.status==="open"&&!e.isMine?`
      <section class="help-center-section help-center-submit-section">
        <strong>${a(n("\u63D0\u4EA4\u5F53\u524D\u8FDB\u653B\u961F\u4F0D\u4F5C\u4E3A\u89E3\u6CD5","Submit current attack as a solution"))}</strong>
        <div class="help-center-display-section help-center-display-teams">
          ${q(l,"attack")}
        </div>
        <label class="help-center-field">
          <span>${a(n("\u89E3\u6CD5\u8BF4\u660E","Solution note"))}</span>
          <textarea data-help-solution-description maxlength="100" rows="3" placeholder="${a(n("\u53EF\u586B\u5199\u64CD\u4F5C\u987A\u5E8F\u3001\u6CE8\u610F\u4E8B\u9879\u7B49","Operation order or notes"))}"></textarea>
        </label>
        <button class="help-center-action-button is-primary" type="button" data-help-create-solution ${r.helpCenter.actionPending==="create-solution"?"disabled":""}>${a(r.helpCenter.actionPending==="create-solution"?n("\u63D0\u4EA4\u4E2D...","Submitting..."):n("\u63D0\u4EA4\u89E3\u6CD5","Submit solution"))}</button>
      </section>
    `:""}
    </div>
    </div>
  `}function y(t){const e=t.querySelector(".help-center-content");if(!e)return;const u=r.helpCenter.mode!=="list";r.helpCenter.mode==="create"?e.innerHTML=Pe():r.helpCenter.mode==="detail"?e.innerHTML=_e():r.helpCenter.mode==="reports"?e.innerHTML=Me():e.innerHTML=Te(),u&&(e.scrollTop=0,e.querySelector(".help-center-scroll-body")?.scrollTo({top:0,left:0})),ke(t)}function J(t){t.querySelectorAll("[data-help-request-id]").forEach(e=>{e.addEventListener("click",()=>{v(t,e.dataset.helpRequestId||"")})}),t.querySelector("[data-help-load-more]")?.addEventListener("click",()=>{S(t,{append:!0})})}function ke(t){J(t),oe(t),t.querySelector("[data-help-view='create']")?.addEventListener("click",()=>{K()&&(r.helpCenter.mode="create",y(t))}),t.querySelector("[data-help-view='reports']")?.addEventListener("click",()=>{r.helpCenter.reportStatus="open",L(t)}),t.querySelector("[data-help-refresh]")?.addEventListener("click",()=>{S(t,{force:!0})}),t.querySelectorAll("[data-help-filter]").forEach(e=>{e.addEventListener("change",()=>{const u=e.dataset.helpFilter;u&&(r.helpCenter.filters[u]=e.value,r.helpCenter.nextCursor="",S(t))})}),t.querySelector("[data-help-report-status]")?.addEventListener("change",e=>{r.helpCenter.reportStatus=e.target.value||"open",L(t)}),t.querySelectorAll("[data-help-back]").forEach(e=>{e.addEventListener("click",()=>{r.helpCenter.mode="list",r.helpCenter.detail=null,y(t)})}),t.querySelector("[data-help-create]")?.addEventListener("click",()=>{ve(t)}),t.querySelector("[data-help-share-request]")?.addEventListener("click",()=>{we()}),t.querySelector("[data-help-start-solve]")?.addEventListener("click",()=>Le(t)),t.querySelector("[data-help-create-solution]")?.addEventListener("click",()=>{ye(t)}),t.querySelector("[data-help-close-request]")?.addEventListener("click",()=>{$e(t)}),t.querySelector("[data-help-hide-request]")?.addEventListener("click",()=>{Se(t)}),t.querySelector("[data-help-report-request]")?.addEventListener("click",()=>{Q("request",r.helpCenter.detail?.request?.id||"")}),t.querySelectorAll("[data-help-accept]").forEach(e=>{e.addEventListener("click",()=>{ge(t,e.dataset.helpAccept||"")})}),t.querySelectorAll("[data-help-hide-solution]").forEach(e=>{e.addEventListener("click",()=>{qe(t,e.dataset.helpHideSolution||"")})}),t.querySelectorAll("[data-help-report-solution]").forEach(e=>{e.addEventListener("click",()=>{Q("solution",e.dataset.helpReportSolution||"")})}),t.querySelectorAll("[data-help-vote]").forEach(e=>{e.addEventListener("click",()=>{me(t,e.dataset.helpVote||"")})}),t.querySelectorAll("[data-help-review-report]").forEach(e=>{e.addEventListener("click",()=>{X(t,e.dataset.helpReviewReport||"","reviewed")})}),t.querySelectorAll("[data-help-dismiss-report]").forEach(e=>{e.addEventListener("click",()=>{X(t,e.dataset.helpDismissReport||"","dismissed")})}),t.querySelectorAll("[data-help-hide-report-target]").forEach(e=>{e.addEventListener("click",()=>{Ae(t,e.dataset.helpHideReportTarget||"")})})}function Ie(t={}){g(),r.helpCenter.mode=t.requestId?"detail":"list",r.helpCenter.error="",r.helpCenter.detail=null,r.helpCenter.nextCursor="";const e=document.createElement("div");e.className="help-modal-backdrop help-center-modal-backdrop",e.innerHTML=`
    <section class="help-modal help-center-modal" role="dialog" aria-modal="true" aria-label="${a(n("\u7ADE\u6280\u573A\u6C42\u52A9","Arena Help"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Arena Help</span>
          <strong>${a(n("\u7ADE\u6280\u573A\u6C42\u52A9","Arena Help"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${a(n("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content help-center-content"></div>
    </section>
  `,document.body.append(e),document.addEventListener("keydown",Y),e.querySelector(".help-modal-close")?.addEventListener("click",g),y(e),t.requestId?v(e,t.requestId):S(e)}export{g as closeHelpCenterModal,Ie as openHelpCenterModal,te as setHelpCenterUiApi};
