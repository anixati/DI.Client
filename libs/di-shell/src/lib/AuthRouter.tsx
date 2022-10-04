import { AuthenticateInner, createUserManager, LoginComplete, LogoutPage, ProtectedArea, setUserManager, useAppContext } from '@dotars/di-core';
import { UserManager, WebStorageStateStore } from 'oidc-client';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AccessDeniedPage, NotFoundPage, SignOutPage } from './pages';
import { ShellPage } from './shell/ShellPage';

export const AuthRouter: React.FC = (rx) => {
  const ctx = useAppContext();

  const [mgr] = useState<UserManager>(() => {
    const oidc_config = {
      loadUserInfo: true,
      userStore: new WebStorageStateStore({
        store: localStorage,
      }),
      authority: `${ctx.settings?.oidc_authority}`,
      client_id: `${ctx.settings?.oidc_clientId}`,
      redirect_uri: `${ctx.settings?.clientBase}/login_complete`,
      response_type: `${ctx.settings?.oidc_responseType}`,
      response_mode: 'fragment',
      scope: `${ctx.settings?.oidc_scope}`, // add other scopes here
     // post_logout_redirect_uri: `${ctx.settings?.clientBase}/logout`,
    };
    console.log(oidc_config);
    const usm = createUserManager(oidc_config);
    if (usm) setUserManager(usm);
    return usm;
  });

  

  return (
    <Routes>
      <Route path="/login_complete" element={<LoginComplete manager={mgr} />} />
      <Route path="signedout/*" element={<SignOutPage />} />
      <Route path="/denied" element={<AccessDeniedPage  manager={mgr} />} />
      
      <Route path="/logout" element={<LogoutPage manager={mgr} />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/"
        element={
          <AuthenticateInner manager={mgr} basename={ctx.settings?.baseName}>
            <ProtectedArea>
              <ShellPage manager={mgr} />
            </ProtectedArea>
          </AuthenticateInner>
        }
      >
        {rx.children}
      </Route>
    </Routes>
  );
};
