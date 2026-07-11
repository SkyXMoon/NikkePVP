let f={};const K="nikke-pending-invite-code-v1",h=new Proxy({},{get(t,r){return f.state?.[r]},set(t,r,s){return f.state&&(f.state[r]=s),!0}});function T(t={}){f=t||{}}function o(t){const r=f[t];if(typeof r!="function")throw new Error("account modal api missing: "+t);return r}function U(...t){return o("getAuthSessionEmail")(...t)}function $(...t){return o("getAccountProfileDisplayName")(...t)}function E(...t){return o("getAuthSessionUsername")(...t)}function L(...t){return o("hasAccountProfileChangedEffectiveDisplayName")(...t)}function n(...t){return o("escapeHtml")(...t)}function e(...t){return o("localize")(...t)}function M(...t){return o("getPendingInviteCode")(...t)}function R(...t){return o("loadExternalApiKeyPanel")(...t)}function D(...t){return o("loadInvitePanel")(...t)}function z(...t){return o("openLegalModal")(...t)}function w(...t){return o("supabaseAuthRequest")(...t)}function S(...t){return o("saveAuthSession")(...t)}function m(...t){return o("showToast")(...t)}function P(...t){return o("normalizeUsername")(...t)}function I(...t){return o("validateUsername")(...t)}function _(...t){return o("updateAccountDisplayName")(...t)}function x(...t){return o("getAuthErrorMessage")(...t)}function V(...t){return o("validateAccountPassword")(...t)}function q(...t){return o("getAuthRedirectUrl")(...t)}function F(...t){return o("isExistingEmailSignupPayload")(...t)}function C(...t){return o("normalizeSupabaseAuthSession")(...t)}function N(...t){return o("refreshAccountStatus")(...t)}function H(...t){return o("acceptPendingInviteIfNeeded")(...t)}function B(...t){return o("hydrateAuthSessionUserIfNeeded")(...t)}function O(...t){return o("normalizeInviteCode")(...t)}function Y(...t){return o("canUseAccountFeature")(...t)}function G(t){const r=h.authSession,s=U(r),a=h.accountProfile||{},l=$()||E(r),g=!L(a),i=t==="update-password";if(s&&!i)return`
      <article class="account-status-card">
        <span>${n(e("\u5F53\u524D\u8D26\u53F7","Current account"))}</span>
        <strong>${n(l||e("\u5DF2\u767B\u5F55","Signed in"))}</strong>
        <small>${n(s)}</small>
        ${g?`<div class="account-display-name-panel" data-account-display-name-panel>
          <div class="account-display-name-view" data-account-display-name-view>
            <span>${n(e("\u540D\u79F0\u53EF\u4FEE\u6539\u4E00\u6B21","Name can be changed once"))}</span>
            <button class="account-secondary-button" type="button" data-account-display-name-edit>${n(e("\u4FEE\u6539","Edit"))}</button>
          </div>
          <form class="account-display-name-form" data-account-display-name-form hidden>
            <label>
              <span>${n(e("\u65B0\u540D\u79F0","New name"))}</span>
              <input name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" minlength="2" maxlength="16" value="${n(l||"")}" />
            </label>
            <div class="account-display-name-actions">
              <button class="account-primary-button" type="submit">${n(e("\u786E\u8BA4","Confirm"))}</button>
              <button class="account-secondary-button" type="button" data-account-display-name-cancel>${n(e("\u53D6\u6D88","Cancel"))}</button>
            </div>
            <p>${n(e("\u540D\u79F0\u53EA\u80FD\u4FEE\u6539\u4E00\u6B21\uFF0C\u8BF7\u786E\u8BA4\u540E\u518D\u63D0\u4EA4\u3002","You can only change your name once. Check it before submitting."))}</p>
          </form>
        </div>`:""}
      </article>
      <section class="account-invite-panel" data-invite-panel>
        <div class="external-api-key-head">
          <strong>${n(e("\u6211\u7684\u9080\u8BF7","My invites"))}</strong>
          <small data-invite-status>${n(e("\u6B63\u5728\u8BFB\u53D6\u9080\u8BF7\u4FE1\u606F...","Loading invite info..."))}</small>
        </div>
        <div class="account-pending-invite" data-pending-invite-confirm hidden>
          <span>${n(e("\u68C0\u6D4B\u5230\u9080\u8BF7\u7801","Invite code detected"))} <strong data-pending-invite-code></strong></span>
          <div>
            <button class="account-primary-button" type="button" data-pending-invite-accept>${n(e("\u63A5\u53D7\u9080\u8BF7","Accept"))}</button>
            <button class="account-secondary-button" type="button" data-pending-invite-cancel>${n(e("\u53D6\u6D88","Cancel"))}</button>
          </div>
        </div>
        <div class="account-invite-code-row">
          <span>${n(e("\u9080\u8BF7\u7801","Invite code"))}</span>
          <strong data-invite-code>-</strong>
        </div>
        <div class="account-invite-link-row">
          <input data-invite-link type="text" readonly value="" aria-label="${n(e("\u9080\u8BF7\u94FE\u63A5","Invite link"))}" />
          <button class="account-secondary-button" type="button" data-invite-copy>${n(e("\u590D\u5236","Copy"))}</button>
          <button class="account-secondary-button" type="button" data-invite-refresh>${n(e("\u5237\u65B0","Refresh"))}</button>
        </div>
        <div class="account-invite-records" data-invite-records></div>
      </section>
      <section class="external-api-key-panel" data-external-api-key-panel hidden>
        <div class="external-api-key-head">
          <strong>${n(e("\u88C5\u5907\u8BCD\u6761\u540C\u6B65","Equipment sync"))}</strong>
          <small data-external-api-key-status>${n(e("\u6B63\u5728\u8BFB\u53D6\u88C5\u5907API Key...","Loading equipment API key..."))}</small>
        </div>
        <label class="external-api-key-field">
          <span>${n(e("\u88C5\u5907API Key","Equipment API key"))}</span>
          <div class="external-api-key-control">
            <input data-external-api-key-input type="text" name="nikke-equipment-access-token" autocomplete="off" autocapitalize="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" readonly spellcheck="false" data-visible="false" placeholder="${n(e("\u8BF7\u8F93\u5165\u7B2C\u4E09\u65B9API Key","Enter third-party API key"))}" />
            <button class="external-api-key-toggle" type="button" data-external-api-key-toggle aria-pressed="false" aria-label="${n(e("\u663E\u793A\u88C5\u5907API Key","Show equipment API key"))}">${n(e("\u663E\u793A","Show"))}</button>
          </div>
        </label>
        <div class="external-api-key-actions">
          <button class="account-primary-button" type="button" data-external-api-key-save>${n(e("\u4FDD\u5B58Key","Save key"))}</button>
          <button class="account-secondary-button" type="button" data-external-api-key-delete disabled>${n(e("\u5220\u9664","Delete"))}</button>
          <button class="account-secondary-button" type="button" data-external-equipment-sync disabled>${n(e("\u540C\u6B65","Sync"))}</button>
        </div>
        <p>${n(e("\u5411\u963F\u5361\u79C1\u804A\u53D1\u9001 #ApiKey \u83B7\u53D6Key\uFF1BKey\u4F1A\u968F\u8D26\u53F7\u4FDD\u5B58\uFF0C\u540C\u6B65\u7ED3\u679C\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u672C\u5730\u3002","Send #ApiKey to Aka in private chat to get the key. The key is saved with your account; synced data is stored only in this browser."))}</p>
      </section>
      <div class="account-modal-actions">
        <button class="account-secondary-button" type="button" data-account-action="logout">${n(e("\u9000\u51FA\u767B\u5F55","Sign out"))}</button>
      </div>
    `;const c=t==="register",d=t==="recover",v=i?e("\u8BBE\u7F6E\u65B0\u5BC6\u7801","Set new password"):d?e("\u91CD\u7F6E\u5BC6\u7801","Reset password"):c?e("\u6CE8\u518C NIKKE PVP\u8D26\u53F7","Create NIKKE PVP account"):e("NIKKE PVP\u8D26\u53F7\u767B\u5F55","NIKKE PVP account login"),p=i?e("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):d?e("\u53D1\u9001\u90AE\u4EF6","Send email"):c?e("\u6CE8\u518C","Sign up"):e("\u767B\u5F55","Sign in"),u=c?`<p class="account-switch-line">${n(e("\u5DF2\u6709\u8D26\u53F7\uFF1F","Already have an account?"))}<button type="button" data-account-mode="login">${n(e("\u767B\u5F55","Sign in"))}</button></p>`:d||i?`<p class="account-switch-line"><button type="button" data-account-mode="login">${n(e("\u8FD4\u56DE\u767B\u5F55","Back to sign in"))}</button></p>`:`<p class="account-switch-line">${n(e("\u6CA1\u6709\u8D26\u53F7\uFF1F","No account?"))}<button type="button" data-account-mode="register">${n(e("\u6CE8\u518C","Sign up"))}</button></p>`;return`
    <form class="account-form" data-account-form="${n(t)}">
      <strong>${n(v)}</strong>
      ${i?"":`<label>
        <span>${n(e("\u90AE\u7BB1","Email"))}</span>
        <input id="accountEmailInput" name="username" type="email" autocomplete="username" inputmode="email" required placeholder="${n(e("\u8BF7\u8F93\u5165\u90AE\u7BB1","Enter email"))}" />
      </label>`}
      ${d?"":`
        <div class="account-password-block">
          <label>
            <span>${n(i?e("\u65B0\u5BC6\u7801","New password"):e("\u5BC6\u7801","Password"))}</span>
            <input id="accountPasswordInput" name="password" type="password" autocomplete="${c||i?"new-password":"current-password"}" required minlength="${c||i?"8":"6"}" placeholder="${n(i?e("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801","Enter new password"):e("\u8BF7\u8F93\u5165\u5BC6\u7801","Enter password"))}" />
          </label>
          ${!c&&!i?`<button class="account-forgot-button" type="button" data-account-mode="recover">${n(e("\u5FD8\u8BB0\u5BC6\u7801\uFF1F","Forgot password?"))}</button>`:""}
        </div>
      `}
      ${c?`<label>
        <span>${n(e("\u7528\u6237\u540D","Username"))}</span>
        <input id="accountUsernameInput" name="display-name" type="text" autocomplete="nickname" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" required minlength="2" maxlength="16" placeholder="${n(e("\u8BF7\u8F93\u5165\u7528\u6237\u540D","Enter username"))}" />
      </label>`:""}
      ${c?`<label>
        <span>${n(e("\u9080\u8BF7\u7801\uFF08\u9009\u586B\uFF09","Invite code (optional)"))}</span>
        <input id="accountInviteCodeInput" name="invite-code" type="text" autocomplete="off" inputmode="latin" maxlength="32" value="${n(M())}" placeholder="${n(e("\u53EF\u586B\u5199\u597D\u53CB\u9080\u8BF7\u7801","Enter a friend's invite code"))}" />
      </label>`:""}
      <div class="account-modal-actions">
        <button class="account-primary-button" type="submit">${n(p)}</button>
      </div>
      ${c?`<p class="account-agreement">${n(e("\u6CE8\u518C\u5373\u4EE3\u8868\u60A8\u540C\u610F","Signing up means you agree to the "))}<button type="button" data-legal-document="terms">${n(e("\u8D26\u53F7\u7528\u6237\u534F\u8BAE","Account User Agreement"))}</button>${n(e("\u548C"," and "))}<button type="button" data-legal-document="privacy">${n(e("\u9690\u79C1\u653F\u7B56","Privacy Policy"))}</button></p>`:""}
      <p class="account-form-note">${n(i?e("\u4FDD\u5B58\u540E\u5373\u53EF\u4F7F\u7528\u65B0\u5BC6\u7801\u767B\u5F55\u3002","After saving, you can sign in with the new password."):c?e("\u6CE8\u518C\u540E\u8BF7\u524D\u5F80\u90AE\u7BB1\u5B8C\u6210\u786E\u8BA4\u3002","Confirm your account from your inbox after signing up."):d?e("\u91CD\u7F6E\u90AE\u4EF6\u4F1A\u53D1\u9001\u5230\u8BE5\u90AE\u7BB1\u3002","A reset email will be sent to this address."):"")}</p>
      ${u}
    </form>
  `}function b(t,r){const s=t.querySelector(".account-modal-content");s&&(s.innerHTML=G(r),R(s),D(s),s.querySelectorAll("[data-account-mode]").forEach(a=>{a.addEventListener("click",()=>b(t,a.dataset.accountMode||"login"))}),s.querySelectorAll("[data-legal-document]").forEach(a=>{a.addEventListener("click",()=>{z(a.dataset.legalDocument||"terms")})}),s.querySelector("[data-account-action='logout']")?.addEventListener("click",async()=>{const a=h.authSession;try{a?.accessToken&&await w("/auth/v1/logout",{accessToken:a.accessToken})}catch{}S(null),b(t,"login"),m(e("\u5DF2\u9000\u51FA\u767B\u5F55","Signed out"))}),s.querySelector("[data-account-display-name-edit]")?.addEventListener("click",()=>{const a=s.querySelector("[data-account-display-name-panel]");a?.querySelector("[data-account-display-name-view]")?.setAttribute("hidden",""),a?.querySelector("[data-account-display-name-form]")?.removeAttribute("hidden"),a?.querySelector("input[name='display-name']")?.focus()}),s.querySelector("[data-account-display-name-cancel]")?.addEventListener("click",()=>{const a=s.querySelector("[data-account-display-name-panel]"),l=a?.querySelector("input[name='display-name']");l&&(l.value=$()||E()||""),a?.querySelector("[data-account-display-name-form]")?.setAttribute("hidden",""),a?.querySelector("[data-account-display-name-view]")?.removeAttribute("hidden")}),s.querySelector("[data-account-display-name-form]")?.addEventListener("submit",async a=>{a.preventDefault();const l=a.currentTarget,g=l.elements["display-name"],i=l.querySelector("button[type='submit']"),c=P(g?.value||""),d=I(c);if(d){m(d,{duration:3200});return}if(c===$()){m(e("\u65B0\u540D\u79F0\u548C\u5F53\u524D\u540D\u79F0\u76F8\u540C","The new name is the same as the current name."));return}i.disabled=!0,i.textContent=e("\u4FEE\u6539\u4E2D...","Updating...");try{await _(c),b(t,"login"),m(e("\u540D\u79F0\u5DF2\u4FEE\u6539","Name updated."))}catch(v){m(x(v),{duration:3600}),i.disabled=!1,i.textContent=e("\u4FEE\u6539\u540D\u79F0","Change name")}}),s.querySelector(".account-form")?.addEventListener("submit",async a=>{a.preventDefault();const l=a.currentTarget,g=l.querySelector("button[type='submit']"),i=String(l.elements.username?.value||l.elements.email?.value||"").trim(),c=String(l.elements.password?.value||""),d=P(l.elements["display-name"]?.value||""),v=O(l.elements["invite-code"]?.value||""),p=l.dataset.accountForm||"login";if(!(p!=="update-password"&&!i)){if(p==="register"||p==="update-password"){const u=V(c);if(u){m(u,{duration:3200});return}}if(p==="register"){const u=I(d);if(u){m(u,{duration:3200});return}if(v)try{localStorage.setItem(K,v)}catch{}}g.disabled=!0,g.textContent=e("\u5904\u7406\u4E2D...","Processing...");try{if(p==="update-password"){const u=h.authSession;if(!u?.accessToken)throw new Error(e("\u91CD\u7F6E\u767B\u5F55\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u91CD\u7F6E\u90AE\u4EF6","Recovery session expired. Send another reset email."));await w("/auth/v1/user",{method:"PUT",accessToken:u.accessToken,body:{password:c}}),h.authRecoveryPending=!1,S(null),b(t,"login"),m(e("\u5BC6\u7801\u5DF2\u66F4\u65B0","Password updated."))}else if(p==="register"){const u=encodeURIComponent(q()),y=await w(`/auth/v1/signup?redirect_to=${u}`,{body:{email:i,password:c,data:{username:d,display_name:d,name:d}}});if(F(y))throw new Error(e("\u8BE5\u90AE\u7BB1\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u76F4\u63A5\u767B\u5F55\u6216\u4F7F\u7528\u5FD8\u8BB0\u5BC6\u7801","This email is already registered. Please sign in or reset your password."));const k=C(y);k&&S(k),await N(),await H(v),b(t,"login"),m(e("\u6CE8\u518C\u8BF7\u6C42\u5DF2\u53D1\u9001\uFF0C\u8BF7\u67E5\u770B\u90AE\u7BB1\u786E\u8BA4\u90AE\u4EF6","Sign-up sent. Please check your email."))}else if(p==="recover"){const u=encodeURIComponent(q());await w(`/auth/v1/recover?redirect_to=${u}`,{body:{email:i}}),b(t,"login"),m(e("\u5BC6\u7801\u91CD\u7F6E\u90AE\u4EF6\u5DF2\u53D1\u9001","Password reset email sent."))}else{const u=await w("/auth/v1/token?grant_type=password",{body:{email:i,password:c}}),y=C(u);if(!y?.accessToken)throw new Error(e("\u767B\u5F55\u54CD\u5E94\u65E0\u6548\uFF0C\u8BF7\u91CD\u8BD5","Invalid sign-in response. Please try again."));S({...y,email:y.email||i,user:y.user?{...y.user,email:y.user.email||i}:{email:i}}),await B(),await N(),A(),m(e("\u767B\u5F55\u6210\u529F","Signed in."))}}catch(u){m(x(u),{duration:3600}),g.disabled=!1,g.textContent=p==="update-password"?e("\u4FDD\u5B58\u65B0\u5BC6\u7801","Save password"):p==="recover"?e("\u53D1\u9001\u90AE\u4EF6","Send email"):p==="register"?e("\u6CE8\u518C","Sign up"):e("\u767B\u5F55","Sign in")}}}))}function A(){document.querySelector(".account-modal-backdrop")?.remove()}function X(t="login"){if(!Y())return;A();const r=document.createElement("div");r.className="help-modal-backdrop account-modal-backdrop",r.innerHTML=`
    <section class="help-modal account-modal" role="dialog" aria-modal="true" aria-label="${n(e("\u8D26\u53F7","Account"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Account</span>
          <strong>${n(e("\u8D26\u53F7","Account"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${n(e("\u5173\u95ED","Close"))}">X</button>
      </div>
      <div class="help-modal-content account-modal-content"></div>
    </section>
  `,r.querySelector(".account-modal").addEventListener("click",a=>a.stopPropagation()),r.querySelector(".help-modal-close")?.addEventListener("click",A),document.body.append(r),b(r,t)}export{X as openAccountModal,T as setAccountModalApi};
