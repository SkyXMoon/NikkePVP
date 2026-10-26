import{renderThirdPartyAuthorization as D,loadThirdPartyAuthorization as N}from"./third-party-authorization.js";let h={};const L="nikke-pending-invite-code-v1",v=new Proxy({},{get(e,c){return h.state?.[c]},set(e,c,i){return h.state&&(h.state[c]=i),!0}});function K(e={}){h=e||{}}function n(e){const c=h[e];if(typeof c!="function")throw new Error("account modal api missing: "+e);return c}function M(...e){return n("getAuthSessionEmail")(...e)}function w(...e){return n("getAccountProfileDisplayName")(...e)}function I(...e){return n("getAuthSessionUsername")(...e)}function z(...e){return n("hasAccountProfileChangedEffectiveDisplayName")(...e)}function a(...e){return n("escapeHtml")(...e)}function t(...e){return n("localize")(...e)}function R(...e){return n("getPendingInviteCode")(...e)}function _(...e){return n("loadExternalApiKeyPanel")(...e)}function F(...e){return n("loadInvitePanel")(...e)}function O(...e){return n("openLegalModal")(...e)}function T(...e){return n("supabaseAuthRequest")(...e)}function A(...e){return n("saveAuthSession")(...e)}function y(...e){return n("showToast")(...e)}function k(...e){return n("normalizeUsername")(...e)}function E(...e){return n("validateUsername")(...e)}function B(...e){return n("updateAccountDisplayName")(...e)}function V(...e){return n("getAccountProfileTapTapUid")(...e)}function H(...e){return n("updateAccountTapTapUid")(...e)}function S(...e){return n("getAuthErrorMessage")(...e)}function Q(...e){return n("validateAccountPassword")(...e)}function x(...e){return n("getAuthRedirectUrl")(...e)}function W(...e){return n("isExistingEmailSignupPayload")(...e)}function U(...e){return n("normalizeSupabaseAuthSession")(...e)}function q(...e){return n("refreshAccountStatus")(...e)}function Y(...e){return n("acceptPendingInviteIfNeeded")(...e)}function G(...e){return n("hydrateAuthSessionUserIfNeeded")(...e)}function X(...e){return n("normalizeInviteCode")(...e)}function j(...e){return n("canUseAccountFeature")(...e)}function st(...e){return n("syncExternalEquipmentOncePerSession")(...e)}function ct(...e){return n("syncTapTapUserInfoOncePerPage")(...e)}function J(...e){return n("syncTapTapUserInfoManually")(...e)}function Z(...e){return n("getTapTapAutoSyncLastSyncedAt")(...e)}function tt(...e){return n("syncAccountDataOncePerPage")(...e)}function C(){return[{id:"qq",label:"QQ",request:()=>n("requestQqBindingToken")()},{id:"wechat",label:t("\u5FAE\u4FE1","WeChat"),request:()=>n("requestWechatBindingToken")()}]}function et(e){const c=e?.querySelector("[data-taptap-uid-panel]");if(!c)return;const i=c.querySelector("[data-taptap-uid-input]"),o=c.querySelector("[data-taptap-uid-status]"),u=c.querySelector("[data-taptap-uid-save]"),d=c.querySelector("[data-taptap-manual-sync]"),s=c.querySelector("[data-taptap-uid-last-sync]"),r=String(V()||"").trim(),p=()=>{const l=Z();s&&(s.textContent=l?`${t("\u6700\u8FD1\u540C\u6B65","Last synced")}: ${new Date(l).toLocaleString(v.language==="en"?"en-US":"zh-CN",{hour12:!1})}`:t("\u6700\u8FD1\u540C\u6B65\uFF1A\u5C1A\u672A\u540C\u6B65","Last synced: Never"))};i&&(i.value=r),d&&(d.disabled=!r),o&&(o.textContent=r?t("\u5DF2\u4FDD\u5B58","Saved"):t("\u5C1A\u672A\u8BBE\u7F6E","Not set")),p(),u?.addEventListener("click",async()=>{const l=String(i?.value||"").trim();if(l&&!/^\d{1,20}$/.test(l)){y(t("TapTap UID \u53EA\u80FD\u586B\u5199 1-20 \u4F4D\u6570\u5B57","TapTap UID must contain 1-20 digits."),{duration:3200});return}u.disabled=!0,u.textContent=t("\u4FDD\u5B58\u4E2D...","Saving...");try{await H(l),o&&(o.textContent=l?t("\u5DF2\u4FDD\u5B58","Saved"):t("\u5C1A\u672A\u8BBE\u7F6E","Not set")),d&&(d.disabled=!l),p(),y(l?t("TapTap UID \u5DF2\u4FDD\u5B58","TapTap UID saved."):t("TapTap UID \u5DF2\u6E05\u9664","TapTap UID cleared."))}catch(g){y(S(g),{duration:3600})}finally{u.disabled=!1,u.textContent=t("\u4FDD\u5B58 TapTapUID","Save TapTap UID")}}),d?.addEventListener("click",async()=>{d.disabled=!0,d.textContent=t("\u540C\u6B65\u4E2D...","Syncing...");try{await J(),p(),y(t("TapTap \u6570\u636E\u5DF2\u540C\u6B65","TapTap data synced."))}catch(l){y(S(l),{duration:3600})}finally{d.disabled=!1,d.textContent=t("\u624B\u52A8\u540C\u6B65 TapTap","Sync TapTap manually")}})}function at(e){const c=v.authSession,i=M(c),o=v.accountProfile||{},u=w()||I(c),d=!z(o),s=e==="update-password";if(i&&!s)return`
      <article class="account-status-card account-settings-panel">
        <span>${a(t("\u5F53\u524D\u8D26\u53F7","Current account"))}</span>
        <strong>${a(u||t("\u5DF2\u767B\u5F55","Signed in"))}</strong>
        <small>${a(i)}</small>
        ${d?`<div class="account-display-name-panel" data-account-display-name-panel>
          <div class="account-display-name-view" data-account-display-name-view>
            <span>${a(t("\u540D\u79F0\u53EF\u4FEE\u6539\u4E00\u6B21","Name can be changed once"))}</span>
            <button class="account-secondary-button" type="button" data-account-display-name-edit>${a(t("\u4FEE\u6539","Edit"))}</button>
          </div>
          <form class="account-display-name-form" data-account-display-name-form hidden>
            <label>
              <span>${a(t("\u65B0\u540D\u79F0","New name"))}</span>
              <input name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" minlength="2" maxlength="16" value="${a(u||"")}" />
            </label>
            <div class="account-display-name-actions">
              <button class="account-primary-button" type="submit">${a(t("\u786E\u8BA4","Confirm"))}</button>
              <button class="account-secondary-button" type="button" data-account-display-name-cancel>${a(t("\u53D6\u6D88","Cancel"))}</button>
            </div>
            <p>${a(t("\u540D\u79F0\u53EA\u80FD\u4FEE\u6539\u4E00\u6B21\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u63D0\u4EA4\u3002","You can only change your name once. Check it before submitting."))}</p>
          </form>
        </div>`:""}
      </article>
      <section class="account-invite-panel account-settings-panel" data-invite-panel>
        <div class="external-api-key-head">
          <strong>${a(t("\u6211\u7684\u9080\u8BF7","My invites"))}</strong>
          <small data-invite-status>${a(t("\u6B63\u5728\u8BFB\u53D6\u9080\u8BF7\u4FE1\u606F...","Loading invite info..."))}</small>
        </div>
        <div class="account-pending-invite" data-pending-invite-confirm hidden>
          <span>${a(t("\u68C0\u6D4B\u5230\u9080\u8BF7\u7801","Invite code detected"))} <strong data-pending-invite-code></strong></span>
          <div>
            <button class="account-primary-button" type="button" data-pending-invite-accept>${a(t("\u63A5\u53D7\u9080\u8BF7","Accept"))}</button>
            <button class="account-secondary-button" type="button" data-pending-invite-cancel>${a(t("\u53D6\u6D88","Cancel"))}</button>
          </div>
        </div>
        <div class="account-invite-code-row">
          <span>${a(t("\u9080\u8BF7\u7801","Invite code"))}</span>
          <strong data-invite-code>-</strong>
        </div>
        <div class="account-invite-link-row">
          <input data-invite-link type="text" readonly value="" aria-label="${a(t("\u9080\u8BF7\u94FE\u63A5","Invite link"))}" />
          <button class="account-secondary-button" type="button" data-invite-copy>${a(t("\u590D\u5236","Copy"))}</button>
          <button class="account-secondary-button" type="button" data-invite-refresh>${a(t("\u5237\u65B0","Refresh"))}</button>
        </div>
        <div class="account-invite-records" data-invite-records></div>
      </section>
      <section class="external-api-key-panel account-settings-panel" data-external-api-key-panel hidden>
        <div class="external-api-key-head">
          <strong>${a(t("\u7B2C\u4E09\u65B9\u6570\u636E\u540C\u6B65","External sync settings"))}</strong>
          <small data-external-api-key-status>${a(t("\u6B63\u5728\u8BFB\u53D6\u7B2C\u4E09\u65B9 API Key...","Loading third-party API key..."))}</small>
        </div>
        <label class="external-api-key-field">
          <span>${a(t("\u7B2C\u4E09\u65B9 API Key","Third-party API key"))}</span>
          <div class="external-api-key-control">
            <input data-external-api-key-input type="text" name="nikke-equipment-access-token" autocomplete="off" autocapitalize="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" readonly spellcheck="false" data-visible="false" placeholder="${a(t("\u8BF7\u8F93\u5165\u7B2C\u4E09\u65B9API Key","Enter third-party API key"))}" />
            <button class="external-api-key-toggle" type="button" data-external-api-key-toggle aria-pressed="false" aria-label="${a(t("\u663E\u793A\u7B2C\u4E09\u65B9 API Key","Show third-party API key"))}">${a(t("\u663E\u793A","Show"))}</button>
          </div>
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-external-api-key-save>${a(t("\u4FDD\u5B58Key","Save key"))}</button>
          <button class="account-secondary-button" type="button" data-external-api-key-delete disabled>${a(t("\u5220\u9664","Delete"))}</button>
          <button class="account-secondary-button" type="button" data-external-equipment-sync disabled>${a(t("\u540C\u6B65","Sync"))}</button>
        </div>
        <p>${a(t("\u7FA4\u5185 Arcana \u7528\u6237\u79C1\u804A /\u83B7\u53D6Key\uFF0C\u83B7\u5F97\u4E2A\u4EBA API \u540E\u586B\u5165\u3002\u53EF\u7528\u4E8E\u591A\u8BBE\u5907\u540C\u6B65\uFF1B\u88C5\u5907\u7B49\u7EA7\u7B49\u4FE1\u606F\u4EE5\u963F\u5361\u63A5\u53E3\u8FD4\u56DE\u4E3A\u51C6\u3002","In the group Arcana, private message /\u83B7\u53D6Key to obtain your personal API key, then enter it here for multi-device sync. Equipment levels and other available data depend on the Arcana API response."))}</p>
      </section>
      <section class="account-taptap-panel account-settings-panel" data-taptap-uid-panel>
        <div class="external-api-key-head">
          <strong>${a(t("TapTap \u6570\u636E\u540C\u6B65","TapTap data sync"))}</strong>
          <small data-taptap-uid-status>${a(t("\u6B63\u5728\u8BFB\u53D6 TapTap UID...","Loading TapTap UID..."))}</small>
        </div>
        <label class="account-taptap-field">
          <span>${a(t("TapTapUID","TapTap UID"))}</span>
          <input data-taptap-uid-input type="text" name="taptap-uid" inputmode="numeric" autocomplete="off" maxlength="20" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" spellcheck="false" placeholder="${a(t("\u8BF7\u8F93\u5165 TapTap UID","Enter TapTap UID"))}" />
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-taptap-uid-save>${a(t("\u4FDD\u5B58 TapTapUID","Save TapTap UID"))}</button>
          <button class="account-secondary-button" type="button" data-taptap-manual-sync>${a(t("\u624B\u52A8\u540C\u6B65 TapTap","Sync TapTap manually"))}</button>
        </div>
        <small data-taptap-uid-last-sync>${a(t("\u6700\u8FD1\u540C\u6B65\uFF1A\u5C1A\u672A\u540C\u6B65","Last synced: Never"))}</small>
        <p>${a(t("\u4FDD\u5B58\u540E\uFF0C\u767B\u5F55\u6216\u5237\u65B0\u9875\u9762\u65F6\u4F1A\u81EA\u52A8\u4ECE\u540E\u7AEF\u83B7\u53D6 TapTap \u6570\u636E\u3002","After saving, TapTap data is fetched from the backend on sign-in or page refresh."))}</p>
      </section>
      ${D({providers:C(),localize:t,escapeHtml:a})}
      <div class="account-modal-actions">
        <button class="account-secondary-button" type="button" data-account-action="logout">${a(t("\u9000\u51FA\u767B\u5F55","Sign out"))}</button>
      </div>
    `;const r=e==="register",p=e==="recover",l=s?"accountPasswordUpdateForm":p?"accountRecoveryForm":r?"accountRegisterForm":"accountLoginForm",g=s?t("\u8BBE\u7F6E\u65B0\u5BC6\u7801","Set new password"):p?t("\u91CD\u7F6E\u5BC6\u7801","Reset password"):r?t("\u6CE8\u518C NIKKE PVP\u8D26\u53F7","Create NIKKE PVP account"):t("NIKKE PVP\u8D26\u53F7\u767B\u5F55","NIKKE PVP account login"),m=s?t("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):p?t("\u53D1\u9001\u90AE\u4EF6","Send email"):r?t("\u6CE8\u518C","Sign up"):t("\u767B\u5F55","Sign in"),f=r?`<p class="account-switch-line">${a(t("\u5DF2\u6709\u8D26\u53F7\uFF1F","Already have an account?"))}<button type="button" data-account-mode="login">${a(t("\u767B\u5F55","Sign in"))}</button></p>`:p||s?`<p class="account-switch-line"><button type="button" data-account-mode="login">${a(t("\u8FD4\u56DE\u767B\u5F55","Back to sign in"))}</button></p>`:`<p class="account-switch-line">${a(t("\u6CA1\u6709\u8D26\u53F7\uFF1F","No account?"))}<button type="button" data-account-mode="register">${a(t("\u6CE8\u518C","Sign up"))}</button></p>`;return`
    <form id="${l}" class="account-form" data-account-form="${a(e)}" method="post" action="/" autocomplete="on">
      <strong>${a(g)}</strong>
      ${s?"":`<label>
        <span>${a(t("\u90AE\u7BB1","Email"))}</span>
        <input id="accountEmailInput" name="email" type="email" autocomplete="username" inputmode="email" autocapitalize="none" autocorrect="off" spellcheck="false" required placeholder="${a(t("\u8BF7\u8F93\u5165\u90AE\u7BB1","Enter email"))}" />
      </label>`}
      ${p?"":`
        <div class="account-password-block">
          <label>
            <span>${a(s?t("\u65B0\u5BC6\u7801","New password"):t("\u5BC6\u7801","Password"))}</span>
            <input id="accountPasswordInput" name="password" type="password" autocomplete="${r||s?"new-password":"current-password"}" autocapitalize="none" autocorrect="off" spellcheck="false" required minlength="${r||s?"8":"6"}" placeholder="${a(s?t("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801","Enter new password"):t("\u8BF7\u8F93\u5165\u5BC6\u7801","Enter password"))}" />
          </label>
          ${!r&&!s?`<button class="account-forgot-button" type="button" data-account-mode="recover">${a(t("\u5FD8\u8BB0\u5BC6\u7801\uFF1F","Forgot password?"))}</button>`:""}
        </div>
      `}
      ${r?`<label>
        <span>${a(t("\u7528\u6237\u540D","Username"))}</span>
        <input id="accountUsernameInput" name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" required minlength="2" maxlength="16" placeholder="${a(t("\u8BF7\u8F93\u5165\u7528\u6237\u540D","Enter username"))}" />
      </label>`:""}
      ${r?`<label>
        <span>${a(t("\u9080\u8BF7\u7801\uFF08\u9009\u586B\uFF09","Invite code (optional)"))}</span>
        <input id="accountInviteCodeInput" name="invite-code" type="text" autocomplete="off" inputmode="latin" maxlength="32" value="${a(R())}" placeholder="${a(t("\u53EF\u586B\u5199\u597D\u53CB\u9080\u8BF7\u7801","Enter a friend's invite code"))}" />
      </label>`:""}
      <div class="account-modal-actions">
        <button class="account-primary-button" type="submit">${a(m)}</button>
      </div>
      ${r?`<p class="account-agreement">${a(t("\u6CE8\u518C\u5373\u4EE3\u8868\u60A8\u540C\u610F","Signing up means you agree to the "))}<button type="button" data-legal-document="terms">${a(t("\u8D26\u53F7\u7528\u6237\u534F\u8BAE","Account User Agreement"))}</button>${a(t("\u548C"," and "))}<button type="button" data-legal-document="privacy">${a(t("\u9690\u79C1\u653F\u7B56","Privacy Policy"))}</button></p>`:""}
      <p class="account-form-note">${a(s?t("\u4FDD\u5B58\u540E\u5373\u53EF\u4F7F\u7528\u65B0\u5BC6\u7801\u767B\u5F55\u3002","After saving, you can sign in with the new password."):r?t("\u6CE8\u518C\u540E\u8BF7\u524D\u5F80\u90AE\u7BB1\u5B8C\u6210\u786E\u8BA4\u3002","Confirm your account from your inbox after signing up."):p?t("\u91CD\u7F6E\u90AE\u4EF6\u4F1A\u53D1\u9001\u5230\u8BE5\u90AE\u7BB1\u3002","A reset email will be sent to this address."):"")}</p>
      ${f}
    </form>
  `}function b(e,c){const i=e.querySelector(".account-modal-content");i&&(i.innerHTML=at(c),N(i,{providers:C(),state:v,localize:t,showToast:y,getAuthErrorMessage:S}),et(i),_(i),F(i),i.querySelectorAll("[data-account-mode]").forEach(o=>{o.addEventListener("click",()=>b(e,o.dataset.accountMode||"login"))}),i.querySelectorAll("[data-legal-document]").forEach(o=>{o.addEventListener("click",()=>{O(o.dataset.legalDocument||"terms")})}),i.querySelector("[data-account-action='logout']")?.addEventListener("click",async()=>{const o=v.authSession;try{o?.accessToken&&await T("/auth/v1/logout",{accessToken:o.accessToken})}catch{}A(null),b(e,"login"),y(t("\u5DF2\u9000\u51FA\u767B\u5F55","Signed out"))}),i.querySelector("[data-account-display-name-edit]")?.addEventListener("click",()=>{const o=i.querySelector("[data-account-display-name-panel]");o?.querySelector("[data-account-display-name-view]")?.setAttribute("hidden",""),o?.querySelector("[data-account-display-name-form]")?.removeAttribute("hidden"),o?.querySelector("input[name='display-name']")?.focus()}),i.querySelector("[data-account-display-name-cancel]")?.addEventListener("click",()=>{const o=i.querySelector("[data-account-display-name-panel]"),u=o?.querySelector("input[name='display-name']");u&&(u.value=w()||I()||""),o?.querySelector("[data-account-display-name-form]")?.setAttribute("hidden",""),o?.querySelector("[data-account-display-name-view]")?.removeAttribute("hidden")}),i.querySelector("[data-account-display-name-form]")?.addEventListener("submit",async o=>{o.preventDefault();const u=o.currentTarget,d=u.elements["display-name"],s=u.querySelector("button[type='submit']"),r=k(d?.value||""),p=E(r);if(p){y(p,{duration:3200});return}if(r===w()){y(t("\u65B0\u540D\u79F0\u548C\u5F53\u524D\u540D\u79F0\u76F8\u540C","The new name is the same as the current name."));return}s.disabled=!0,s.textContent=t("\u4FEE\u6539\u4E2D...","Updating...");try{await B(r),b(e,"login"),y(t("\u540D\u79F0\u5DF2\u4FEE\u6539","Name updated."))}catch(l){y(S(l),{duration:3600}),s.disabled=!1,s.textContent=t("\u4FEE\u6539\u540D\u79F0","Change name")}}),i.querySelector(".account-form")?.addEventListener("submit",async o=>{o.preventDefault();const u=o.currentTarget,d=u.querySelector("button[type='submit']"),s=String(u.elements.username?.value||u.elements.email?.value||"").trim(),r=String(u.elements.password?.value||""),p=k(u.elements["display-name"]?.value||""),l=X(u.elements["invite-code"]?.value||""),g=u.dataset.accountForm||"login";if(!(g!=="update-password"&&!s)){if(g==="register"||g==="update-password"){const m=Q(r);if(m){y(m,{duration:3200});return}}if(g==="register"){const m=E(p);if(m){y(m,{duration:3200});return}if(l)try{localStorage.setItem(L,l)}catch{}}d.disabled=!0,d.textContent=t("\u5904\u7406\u4E2D...","Processing...");try{if(g==="update-password"){const m=v.authSession;if(!m?.accessToken)throw new Error(t("\u91CD\u7F6E\u767B\u5F55\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u91CD\u7F6E\u90AE\u4EF6","Recovery session expired. Send another reset email."));await T("/auth/v1/user",{method:"PUT",accessToken:m.accessToken,body:{password:r}}),v.authRecoveryPending=!1,A(null),b(e,"login"),y(t("\u5BC6\u7801\u5DF2\u66F4\u65B0","Password updated."))}else if(g==="register"){const m=encodeURIComponent(x()),f=await T(`/auth/v1/signup?redirect_to=${m}`,{body:{email:s,password:r,data:{username:p,display_name:p,name:p}}});if(W(f))throw new Error(t("\u8BE5\u90AE\u7BB1\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u76F4\u63A5\u767B\u5F55\u6216\u4F7F\u7528\u5FD8\u8BB0\u5BC6\u7801","This email is already registered. Please sign in or reset your password."));const P=U(f);P&&A(P),await q(),await Y(l),b(e,"login"),y(t("\u6CE8\u518C\u8BF7\u6C42\u5DF2\u53D1\u9001\uFF0C\u8BF7\u67E5\u770B\u90AE\u7BB1\u786E\u8BA4\u90AE\u4EF6","Sign-up sent. Please check your email."))}else if(g==="recover"){const m=encodeURIComponent(x());await T(`/auth/v1/recover?redirect_to=${m}`,{body:{email:s}}),b(e,"login"),y(t("\u5BC6\u7801\u91CD\u7F6E\u90AE\u4EF6\u5DF2\u53D1\u9001","Password reset email sent."))}else{const m=await T("/auth/v1/token?grant_type=password",{body:{email:s,password:r}}),f=U(m);if(!f?.accessToken)throw new Error(t("\u767B\u5F55\u54CD\u5E94\u65E0\u6548\uFF0C\u8BF7\u91CD\u8BD5","Invalid sign-in response. Please try again."));A({...f,email:f.email||s,user:f.user?{...f.user,email:f.user.email||s}:{email:s}}),await G(),await q(),tt(),$(),y(t("\u767B\u5F55\u6210\u529F","Signed in."))}}catch(m){y(S(m),{duration:3600}),d.disabled=!1,d.textContent=g==="update-password"?t("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):g==="recover"?t("\u53D1\u9001\u90AE\u4EF6","Send email"):g==="register"?t("\u6CE8\u518C","Sign up"):t("\u767B\u5F55","Sign in")}}}))}function $(){document.querySelector(".account-modal-backdrop")?.remove()}function nt(e="login"){if(!j())return;$();const c=document.createElement("div");c.className="help-modal-backdrop account-modal-backdrop",c.innerHTML=`
    <section class="help-modal account-modal" role="dialog" aria-modal="true" aria-label="${a(t("\u8D26\u53F7","Account"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Account</span>
          <strong>${a(t("\u8D26\u53F7","Account"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${a(t("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content account-modal-content"></div>
    </section>
  `,c.querySelector(".account-modal").addEventListener("click",o=>o.stopPropagation()),c.querySelector(".help-modal-close")?.addEventListener("click",$),document.body.append(c),b(c,e)}export{nt as openAccountModal,K as setAccountModalApi};
