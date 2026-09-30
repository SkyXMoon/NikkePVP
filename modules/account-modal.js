let h={};const C="nikke-pending-invite-code-v1",f=new Proxy({},{get(t,c){return h.state?.[c]},set(t,c,i){return h.state&&(h.state[c]=i),!0}});function D(t={}){h=t||{}}function o(t){const c=h[t];if(typeof c!="function")throw new Error("account modal api missing: "+t);return c}function L(...t){return o("getAuthSessionEmail")(...t)}function w(...t){return o("getAccountProfileDisplayName")(...t)}function q(...t){return o("getAuthSessionUsername")(...t)}function N(...t){return o("hasAccountProfileChangedEffectiveDisplayName")(...t)}function a(...t){return o("escapeHtml")(...t)}function e(...t){return o("localize")(...t)}function R(...t){return o("getPendingInviteCode")(...t)}function K(...t){return o("loadExternalApiKeyPanel")(...t)}function M(...t){return o("loadInvitePanel")(...t)}function z(...t){return o("openLegalModal")(...t)}function T(...t){return o("supabaseAuthRequest")(...t)}function k(...t){return o("saveAuthSession")(...t)}function d(...t){return o("showToast")(...t)}function P(...t){return o("normalizeUsername")(...t)}function I(...t){return o("validateUsername")(...t)}function Q(...t){return o("updateAccountDisplayName")(...t)}function _(...t){return o("getAccountProfileTapTapUid")(...t)}function F(...t){return o("updateAccountTapTapUid")(...t)}function S(...t){return o("getAuthErrorMessage")(...t)}function O(...t){return o("validateAccountPassword")(...t)}function x(...t){return o("getAuthRedirectUrl")(...t)}function B(...t){return o("isExistingEmailSignupPayload")(...t)}function E(...t){return o("normalizeSupabaseAuthSession")(...t)}function U(...t){return o("refreshAccountStatus")(...t)}function V(...t){return o("acceptPendingInviteIfNeeded")(...t)}function H(...t){return o("hydrateAuthSessionUserIfNeeded")(...t)}function Y(...t){return o("normalizeInviteCode")(...t)}function G(...t){return o("canUseAccountFeature")(...t)}function ae(...t){return o("syncExternalEquipmentOncePerSession")(...t)}function ne(...t){return o("syncTapTapUserInfoOncePerPage")(...t)}function X(...t){return o("syncTapTapUserInfoManually")(...t)}function j(...t){return o("getTapTapAutoSyncLastSyncedAt")(...t)}function J(...t){return o("syncAccountDataOncePerPage")(...t)}function W(t){const c=t?.querySelector("[data-qq-binding-token-panel]");if(!c)return;const i=c.querySelector("[data-qq-token-issue]"),n=c.querySelector("[data-qq-token-copy]"),u=c.querySelector("[data-qq-token-value]"),l=c.querySelector("[data-qq-token-status]");let s=0;i.addEventListener("click",async()=>{i.disabled=!0,i.textContent=e("\u7533\u8BF7\u4E2D...","Requesting...");try{const r=await o("requestQqBindingToken")();u.value=r.token,s=Date.parse(r.expiresAt),n.disabled=!1,l.textContent=e("\u6709\u6548\u671F\u81F3","Valid until")+" "+new Date(s).toLocaleTimeString(f.language==="en"?"en-US":"zh-CN",{hour12:!1})}catch(r){d(S(r),{duration:3600})}finally{i.disabled=!1,i.textContent=e("\u7533\u8BF7\u77ED Token","Request short token")}}),n.addEventListener("click",async()=>{if(!u.value||Date.now()>=s){u.value="",n.disabled=!0,l.textContent=e("\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u7533\u8BF7","Expired. Request a new token.");return}try{await navigator.clipboard.writeText(u.value),d(e("\u77ED Token \u5DF2\u590D\u5236","Short token copied."))}catch{u.select(),d(e("\u8BF7\u624B\u52A8\u590D\u5236\u77ED Token","Please copy the short token manually."))}})}function Z(t){const c=t?.querySelector("[data-taptap-uid-panel]");if(!c)return;const i=c.querySelector("[data-taptap-uid-input]"),n=c.querySelector("[data-taptap-uid-status]"),u=c.querySelector("[data-taptap-uid-save]"),l=c.querySelector("[data-taptap-manual-sync]"),s=c.querySelector("[data-taptap-uid-last-sync]"),r=String(_()||"").trim(),y=()=>{const p=j();s&&(s.textContent=p?`${e("\u6700\u8FD1\u540C\u6B65","Last synced")}: ${new Date(p).toLocaleString(f.language==="en"?"en-US":"zh-CN",{hour12:!1})}`:e("\u6700\u8FD1\u540C\u6B65\uFF1A\u5C1A\u672A\u540C\u6B65","Last synced: Never"))};i&&(i.value=r),l&&(l.disabled=!r),n&&(n.textContent=r?e("\u5DF2\u4FDD\u5B58","Saved"):e("\u5C1A\u672A\u8BBE\u7F6E","Not set")),y(),u?.addEventListener("click",async()=>{const p=String(i?.value||"").trim();if(p&&!/^\d{1,20}$/.test(p)){d(e("TapTap UID \u53EA\u80FD\u586B\u5199 1-20 \u4F4D\u6570\u5B57","TapTap UID must contain 1-20 digits."),{duration:3200});return}u.disabled=!0,u.textContent=e("\u4FDD\u5B58\u4E2D...","Saving...");try{await F(p),n&&(n.textContent=p?e("\u5DF2\u4FDD\u5B58","Saved"):e("\u5C1A\u672A\u8BBE\u7F6E","Not set")),l&&(l.disabled=!p),y(),d(p?e("TapTap UID \u5DF2\u4FDD\u5B58","TapTap UID saved."):e("TapTap UID \u5DF2\u6E05\u9664","TapTap UID cleared."))}catch(g){d(S(g),{duration:3600})}finally{u.disabled=!1,u.textContent=e("\u4FDD\u5B58 TapTapUID","Save TapTap UID")}}),l?.addEventListener("click",async()=>{l.disabled=!0,l.textContent=e("\u540C\u6B65\u4E2D...","Syncing...");try{await X(),y(),d(e("TapTap \u6570\u636E\u5DF2\u540C\u6B65","TapTap data synced."))}catch(p){d(S(p),{duration:3600})}finally{l.disabled=!1,l.textContent=e("\u624B\u52A8\u540C\u6B65 TapTap","Sync TapTap manually")}})}function ee(t){const c=f.authSession,i=L(c),n=f.accountProfile||{},u=w()||q(c),l=!N(n),s=t==="update-password";if(i&&!s)return`
      <article class="account-status-card">
        <span>${a(e("\u5F53\u524D\u8D26\u53F7","Current account"))}</span>
        <strong>${a(u||e("\u5DF2\u767B\u5F55","Signed in"))}</strong>
        <small>${a(i)}</small>
        ${l?`<div class="account-display-name-panel" data-account-display-name-panel>
          <div class="account-display-name-view" data-account-display-name-view>
            <span>${a(e("\u540D\u79F0\u53EF\u4FEE\u6539\u4E00\u6B21","Name can be changed once"))}</span>
            <button class="account-secondary-button" type="button" data-account-display-name-edit>${a(e("\u4FEE\u6539","Edit"))}</button>
          </div>
          <form class="account-display-name-form" data-account-display-name-form hidden>
            <label>
              <span>${a(e("\u65B0\u540D\u79F0","New name"))}</span>
              <input name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" minlength="2" maxlength="16" value="${a(u||"")}" />
            </label>
            <div class="account-display-name-actions">
              <button class="account-primary-button" type="submit">${a(e("\u786E\u8BA4","Confirm"))}</button>
              <button class="account-secondary-button" type="button" data-account-display-name-cancel>${a(e("\u53D6\u6D88","Cancel"))}</button>
            </div>
            <p>${a(e("\u540D\u79F0\u53EA\u80FD\u4FEE\u6539\u4E00\u6B21\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u63D0\u4EA4\u3002","You can only change your name once. Check it before submitting."))}</p>
          </form>
        </div>`:""}
      </article>
      <section class="account-invite-panel" data-invite-panel>
        <div class="external-api-key-head">
          <strong>${a(e("\u6211\u7684\u9080\u8BF7","My invites"))}</strong>
          <small data-invite-status>${a(e("\u6B63\u5728\u8BFB\u53D6\u9080\u8BF7\u4FE1\u606F...","Loading invite info..."))}</small>
        </div>
        <div class="account-pending-invite" data-pending-invite-confirm hidden>
          <span>${a(e("\u68C0\u6D4B\u5230\u9080\u8BF7\u7801","Invite code detected"))} <strong data-pending-invite-code></strong></span>
          <div>
            <button class="account-primary-button" type="button" data-pending-invite-accept>${a(e("\u63A5\u53D7\u9080\u8BF7","Accept"))}</button>
            <button class="account-secondary-button" type="button" data-pending-invite-cancel>${a(e("\u53D6\u6D88","Cancel"))}</button>
          </div>
        </div>
        <div class="account-invite-code-row">
          <span>${a(e("\u9080\u8BF7\u7801","Invite code"))}</span>
          <strong data-invite-code>-</strong>
        </div>
        <div class="account-invite-link-row">
          <input data-invite-link type="text" readonly value="" aria-label="${a(e("\u9080\u8BF7\u94FE\u63A5","Invite link"))}" />
          <button class="account-secondary-button" type="button" data-invite-copy>${a(e("\u590D\u5236","Copy"))}</button>
          <button class="account-secondary-button" type="button" data-invite-refresh>${a(e("\u5237\u65B0","Refresh"))}</button>
        </div>
        <div class="account-invite-records" data-invite-records></div>
      </section>
      <section class="external-api-key-panel" data-external-api-key-panel hidden>
        <div class="external-api-key-head">
          <strong>${a(e("\u7B2C\u4E09\u65B9\u6570\u636E\u540C\u6B65","External sync settings"))}</strong>
          <small data-external-api-key-status>${a(e("\u6B63\u5728\u8BFB\u53D6\u7B2C\u4E09\u65B9 API Key...","Loading third-party API key..."))}</small>
        </div>
        <label class="external-api-key-field">
          <span>${a(e("\u7B2C\u4E09\u65B9 API Key","Third-party API key"))}</span>
          <div class="external-api-key-control">
            <input data-external-api-key-input type="text" name="nikke-equipment-access-token" autocomplete="off" autocapitalize="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" readonly spellcheck="false" data-visible="false" placeholder="${a(e("\u8BF7\u8F93\u5165\u7B2C\u4E09\u65B9API Key","Enter third-party API key"))}" />
            <button class="external-api-key-toggle" type="button" data-external-api-key-toggle aria-pressed="false" aria-label="${a(e("\u663E\u793A\u7B2C\u4E09\u65B9 API Key","Show third-party API key"))}">${a(e("\u663E\u793A","Show"))}</button>
          </div>
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-external-api-key-save>${a(e("\u4FDD\u5B58Key","Save key"))}</button>
          <button class="account-secondary-button" type="button" data-external-api-key-delete disabled>${a(e("\u5220\u9664","Delete"))}</button>
          <button class="account-secondary-button" type="button" data-external-equipment-sync disabled>${a(e("\u540C\u6B65","Sync"))}</button>
        </div>
        <p>${a(e("\u7FA4\u5185 Arcana \u7528\u6237\u79C1\u804A #APIKEY\uFF0C\u83B7\u5F97\u4E2A\u4EBA API \u540E\u586B\u5165\u3002\u53EF\u5B9E\u73B0\u6570\u636E\u591A\u8BBE\u5907\u540C\u6B65\u3002\u6CE8\u610F\uFF1A\u88C5\u5907\u7B49\u7EA7\u548C\u9B54\u65B9\u4E0D\u4F1A\u540C\u6B65\u3002","In the group Arcana, private message #APIKEY to obtain your personal API key, then enter it here. This enables multi-device sync. Note: equipment grade and cube data are not synced."))}</p>
      </section>
      <section class="account-taptap-panel" data-taptap-uid-panel>
        <div class="external-api-key-head">
          <strong>${a(e("TapTap \u6570\u636E\u540C\u6B65","TapTap data sync"))}</strong>
          <small data-taptap-uid-status>${a(e("\u6B63\u5728\u8BFB\u53D6 TapTap UID...","Loading TapTap UID..."))}</small>
        </div>
        <label class="account-taptap-field">
          <span>${a(e("TapTapUID","TapTap UID"))}</span>
          <input data-taptap-uid-input type="text" name="taptap-uid" inputmode="numeric" autocomplete="off" maxlength="20" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" spellcheck="false" placeholder="${a(e("\u8BF7\u8F93\u5165 TapTap UID","Enter TapTap UID"))}" />
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-taptap-uid-save>${a(e("\u4FDD\u5B58 TapTapUID","Save TapTap UID"))}</button>
          <button class="account-secondary-button" type="button" data-taptap-manual-sync>${a(e("\u624B\u52A8\u540C\u6B65 TapTap","Sync TapTap manually"))}</button>
        </div>
        <small data-taptap-uid-last-sync>${a(e("\u6700\u8FD1\u540C\u6B65\uFF1A\u5C1A\u672A\u540C\u6B65","Last synced: Never"))}</small>
        <p>${a(e("\u4FDD\u5B58\u540E\uFF0C\u767B\u5F55\u6216\u5237\u65B0\u9875\u9762\u65F6\u4F1A\u81EA\u52A8\u4ECE\u540E\u7AEF\u83B7\u53D6 TapTap \u6570\u636E\u3002","After saving, TapTap data is fetched from the backend on sign-in or page refresh."))}</p>
      </section>
      <section class="account-taptap-panel" data-qq-binding-token-panel>
        <div class="external-api-key-head">
          <strong>${a(e("QQ \u673A\u5668\u4EBA\u6388\u6743","QQ bot authorization"))}</strong>
          <small data-qq-token-status role="status">${a(e("\u77ED Token 10 \u5206\u949F\u6709\u6548\uFF0C\u4EC5\u53EF\u4F7F\u7528\u4E00\u6B21\u3002","Short tokens expire in 10 minutes and can be used once."))}</small>
        </div>
        <label class="account-taptap-field">
          <span>${a(e("\u77ED Token","Short token"))}</span>
          <input data-qq-token-value type="text" readonly autocomplete="off" spellcheck="false" placeholder="${a(e("\u70B9\u51FB\u7533\u8BF7\u83B7\u53D6","Request a token below"))}" />
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-qq-token-issue>${a(e("\u7533\u8BF7\u77ED Token","Request short token"))}</button>
          <button class="account-secondary-button" type="button" data-qq-token-copy disabled>${a(e("\u590D\u5236","Copy"))}</button>
        </div>
        <p>${a(e("\u5411 QQ \u673A\u5668\u4EBA\u53D1\u9001\uFF1A/\u6388\u6743\u7ED1\u5B9A \u77EDToken\uFF1B\u7ED1\u5B9A\u540E\u53EF\u4F7F\u7528 /\u63A8\u8350\u89E3\u6CD5\u3002\u91CD\u65B0\u7533\u8BF7\u540E\uFF0C\u65E7 Token \u7ACB\u5373\u5931\u6548\u3002","Send /\u6388\u6743\u7ED1\u5B9A followed by the short token to the QQ bot, then use /\u63A8\u8350\u89E3\u6CD5. Requesting a new token immediately invalidates the previous one."))}</p>
      </section>
      <div class="account-modal-actions">
        <button class="account-secondary-button" type="button" data-account-action="logout">${a(e("\u9000\u51FA\u767B\u5F55","Sign out"))}</button>
      </div>
    `;const r=t==="register",y=t==="recover",p=s?"accountPasswordUpdateForm":y?"accountRecoveryForm":r?"accountRegisterForm":"accountLoginForm",g=s?e("\u8BBE\u7F6E\u65B0\u5BC6\u7801","Set new password"):y?e("\u91CD\u7F6E\u5BC6\u7801","Reset password"):r?e("\u6CE8\u518C NIKKE PVP\u8D26\u53F7","Create NIKKE PVP account"):e("NIKKE PVP\u8D26\u53F7\u767B\u5F55","NIKKE PVP account login"),m=s?e("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):y?e("\u53D1\u9001\u90AE\u4EF6","Send email"):r?e("\u6CE8\u518C","Sign up"):e("\u767B\u5F55","Sign in"),v=r?`<p class="account-switch-line">${a(e("\u5DF2\u6709\u8D26\u53F7\uFF1F","Already have an account?"))}<button type="button" data-account-mode="login">${a(e("\u767B\u5F55","Sign in"))}</button></p>`:y||s?`<p class="account-switch-line"><button type="button" data-account-mode="login">${a(e("\u8FD4\u56DE\u767B\u5F55","Back to sign in"))}</button></p>`:`<p class="account-switch-line">${a(e("\u6CA1\u6709\u8D26\u53F7\uFF1F","No account?"))}<button type="button" data-account-mode="register">${a(e("\u6CE8\u518C","Sign up"))}</button></p>`;return`
    <form id="${p}" class="account-form" data-account-form="${a(t)}" method="post" action="/" autocomplete="on">
      <strong>${a(g)}</strong>
      ${s?"":`<label>
        <span>${a(e("\u90AE\u7BB1","Email"))}</span>
        <input id="accountEmailInput" name="email" type="email" autocomplete="username" inputmode="email" autocapitalize="none" autocorrect="off" spellcheck="false" required placeholder="${a(e("\u8BF7\u8F93\u5165\u90AE\u7BB1","Enter email"))}" />
      </label>`}
      ${y?"":`
        <div class="account-password-block">
          <label>
            <span>${a(s?e("\u65B0\u5BC6\u7801","New password"):e("\u5BC6\u7801","Password"))}</span>
            <input id="accountPasswordInput" name="password" type="password" autocomplete="${r||s?"new-password":"current-password"}" autocapitalize="none" autocorrect="off" spellcheck="false" required minlength="${r||s?"8":"6"}" placeholder="${a(s?e("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801","Enter new password"):e("\u8BF7\u8F93\u5165\u5BC6\u7801","Enter password"))}" />
          </label>
          ${!r&&!s?`<button class="account-forgot-button" type="button" data-account-mode="recover">${a(e("\u5FD8\u8BB0\u5BC6\u7801\uFF1F","Forgot password?"))}</button>`:""}
        </div>
      `}
      ${r?`<label>
        <span>${a(e("\u7528\u6237\u540D","Username"))}</span>
        <input id="accountUsernameInput" name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" required minlength="2" maxlength="16" placeholder="${a(e("\u8BF7\u8F93\u5165\u7528\u6237\u540D","Enter username"))}" />
      </label>`:""}
      ${r?`<label>
        <span>${a(e("\u9080\u8BF7\u7801\uFF08\u9009\u586B\uFF09","Invite code (optional)"))}</span>
        <input id="accountInviteCodeInput" name="invite-code" type="text" autocomplete="off" inputmode="latin" maxlength="32" value="${a(R())}" placeholder="${a(e("\u53EF\u586B\u5199\u597D\u53CB\u9080\u8BF7\u7801","Enter a friend's invite code"))}" />
      </label>`:""}
      <div class="account-modal-actions">
        <button class="account-primary-button" type="submit">${a(m)}</button>
      </div>
      ${r?`<p class="account-agreement">${a(e("\u6CE8\u518C\u5373\u4EE3\u8868\u60A8\u540C\u610F","Signing up means you agree to the "))}<button type="button" data-legal-document="terms">${a(e("\u8D26\u53F7\u7528\u6237\u534F\u8BAE","Account User Agreement"))}</button>${a(e("\u548C"," and "))}<button type="button" data-legal-document="privacy">${a(e("\u9690\u79C1\u653F\u7B56","Privacy Policy"))}</button></p>`:""}
      <p class="account-form-note">${a(s?e("\u4FDD\u5B58\u540E\u5373\u53EF\u4F7F\u7528\u65B0\u5BC6\u7801\u767B\u5F55\u3002","After saving, you can sign in with the new password."):r?e("\u6CE8\u518C\u540E\u8BF7\u524D\u5F80\u90AE\u7BB1\u5B8C\u6210\u786E\u8BA4\u3002","Confirm your account from your inbox after signing up."):y?e("\u91CD\u7F6E\u90AE\u4EF6\u4F1A\u53D1\u9001\u5230\u8BE5\u90AE\u7BB1\u3002","A reset email will be sent to this address."):"")}</p>
      ${v}
    </form>
  `}function b(t,c){const i=t.querySelector(".account-modal-content");i&&(i.innerHTML=ee(c),W(i),Z(i),K(i),M(i),i.querySelectorAll("[data-account-mode]").forEach(n=>{n.addEventListener("click",()=>b(t,n.dataset.accountMode||"login"))}),i.querySelectorAll("[data-legal-document]").forEach(n=>{n.addEventListener("click",()=>{z(n.dataset.legalDocument||"terms")})}),i.querySelector("[data-account-action='logout']")?.addEventListener("click",async()=>{const n=f.authSession;try{n?.accessToken&&await T("/auth/v1/logout",{accessToken:n.accessToken})}catch{}k(null),b(t,"login"),d(e("\u5DF2\u9000\u51FA\u767B\u5F55","Signed out"))}),i.querySelector("[data-account-display-name-edit]")?.addEventListener("click",()=>{const n=i.querySelector("[data-account-display-name-panel]");n?.querySelector("[data-account-display-name-view]")?.setAttribute("hidden",""),n?.querySelector("[data-account-display-name-form]")?.removeAttribute("hidden"),n?.querySelector("input[name='display-name']")?.focus()}),i.querySelector("[data-account-display-name-cancel]")?.addEventListener("click",()=>{const n=i.querySelector("[data-account-display-name-panel]"),u=n?.querySelector("input[name='display-name']");u&&(u.value=w()||q()||""),n?.querySelector("[data-account-display-name-form]")?.setAttribute("hidden",""),n?.querySelector("[data-account-display-name-view]")?.removeAttribute("hidden")}),i.querySelector("[data-account-display-name-form]")?.addEventListener("submit",async n=>{n.preventDefault();const u=n.currentTarget,l=u.elements["display-name"],s=u.querySelector("button[type='submit']"),r=P(l?.value||""),y=I(r);if(y){d(y,{duration:3200});return}if(r===w()){d(e("\u65B0\u540D\u79F0\u548C\u5F53\u524D\u540D\u79F0\u76F8\u540C","The new name is the same as the current name."));return}s.disabled=!0,s.textContent=e("\u4FEE\u6539\u4E2D...","Updating...");try{await Q(r),b(t,"login"),d(e("\u540D\u79F0\u5DF2\u4FEE\u6539","Name updated."))}catch(p){d(S(p),{duration:3600}),s.disabled=!1,s.textContent=e("\u4FEE\u6539\u540D\u79F0","Change name")}}),i.querySelector(".account-form")?.addEventListener("submit",async n=>{n.preventDefault();const u=n.currentTarget,l=u.querySelector("button[type='submit']"),s=String(u.elements.username?.value||u.elements.email?.value||"").trim(),r=String(u.elements.password?.value||""),y=P(u.elements["display-name"]?.value||""),p=Y(u.elements["invite-code"]?.value||""),g=u.dataset.accountForm||"login";if(!(g!=="update-password"&&!s)){if(g==="register"||g==="update-password"){const m=O(r);if(m){d(m,{duration:3200});return}}if(g==="register"){const m=I(y);if(m){d(m,{duration:3200});return}if(p)try{localStorage.setItem(C,p)}catch{}}l.disabled=!0,l.textContent=e("\u5904\u7406\u4E2D...","Processing...");try{if(g==="update-password"){const m=f.authSession;if(!m?.accessToken)throw new Error(e("\u91CD\u7F6E\u767B\u5F55\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u91CD\u7F6E\u90AE\u4EF6","Recovery session expired. Send another reset email."));await T("/auth/v1/user",{method:"PUT",accessToken:m.accessToken,body:{password:r}}),f.authRecoveryPending=!1,k(null),b(t,"login"),d(e("\u5BC6\u7801\u5DF2\u66F4\u65B0","Password updated."))}else if(g==="register"){const m=encodeURIComponent(x()),v=await T(`/auth/v1/signup?redirect_to=${m}`,{body:{email:s,password:r,data:{username:y,display_name:y,name:y}}});if(B(v))throw new Error(e("\u8BE5\u90AE\u7BB1\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u76F4\u63A5\u767B\u5F55\u6216\u4F7F\u7528\u5FD8\u8BB0\u5BC6\u7801","This email is already registered. Please sign in or reset your password."));const A=E(v);A&&k(A),await U(),await V(p),b(t,"login"),d(e("\u6CE8\u518C\u8BF7\u6C42\u5DF2\u53D1\u9001\uFF0C\u8BF7\u67E5\u770B\u90AE\u7BB1\u786E\u8BA4\u90AE\u4EF6","Sign-up sent. Please check your email."))}else if(g==="recover"){const m=encodeURIComponent(x());await T(`/auth/v1/recover?redirect_to=${m}`,{body:{email:s}}),b(t,"login"),d(e("\u5BC6\u7801\u91CD\u7F6E\u90AE\u4EF6\u5DF2\u53D1\u9001","Password reset email sent."))}else{const m=await T("/auth/v1/token?grant_type=password",{body:{email:s,password:r}}),v=E(m);if(!v?.accessToken)throw new Error(e("\u767B\u5F55\u54CD\u5E94\u65E0\u6548\uFF0C\u8BF7\u91CD\u8BD5","Invalid sign-in response. Please try again."));k({...v,email:v.email||s,user:v.user?{...v.user,email:v.user.email||s}:{email:s}}),await H(),await U(),J(),$(),d(e("\u767B\u5F55\u6210\u529F","Signed in."))}}catch(m){d(S(m),{duration:3600}),l.disabled=!1,l.textContent=g==="update-password"?e("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):g==="recover"?e("\u53D1\u9001\u90AE\u4EF6","Send email"):g==="register"?e("\u6CE8\u518C","Sign up"):e("\u767B\u5F55","Sign in")}}}))}function $(){document.querySelector(".account-modal-backdrop")?.remove()}function te(t="login"){if(!G())return;$();const c=document.createElement("div");c.className="help-modal-backdrop account-modal-backdrop",c.innerHTML=`
    <section class="help-modal account-modal" role="dialog" aria-modal="true" aria-label="${a(e("\u8D26\u53F7","Account"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Account</span>
          <strong>${a(e("\u8D26\u53F7","Account"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${a(e("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content account-modal-content"></div>
    </section>
  `,c.querySelector(".account-modal").addEventListener("click",n=>n.stopPropagation()),c.querySelector(".help-modal-close")?.addEventListener("click",$),document.body.append(c),b(c,t)}export{te as openAccountModal,D as setAccountModalApi};
