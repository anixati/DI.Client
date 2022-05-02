
import { User } from 'oidc-client';
import React, { useCallback } from 'react';
import Async from 'react-async';

import { AuthLoader } from './AuthLoader';
import { OidcProvider } from './AuthProvider';
import { RedirectToLogin } from './RedirectToLogin';
import { REDIRECT_URL_KEY, SecurityCtx } from './types';

export const AuthenticateInner: React.FC<SecurityCtx> = (rx) => {
  const login = useCallback(async () => {
    localStorage.setItem(REDIRECT_URL_KEY, rx.basename ? window.location.href.replace(rx.basename, '') : window.location.pathname);
    const user = await rx.manager.getUser();
    console.log(user);
    if (!user || user.expired) {
      await rx.manager.removeUser();
      throw new Error('No user account');
    }
    return user;
    //      
    //    return null;
  }, [rx]);

  return (
    <Async promiseFn={login} key="user">
      <Async.Resolved<User>>{(user) => <OidcProvider user={user}>{rx.children}</OidcProvider>}</Async.Resolved>
      <Async.Loading>
        <AuthLoader msg="loading..." />
      </Async.Loading>
      <Async.Rejected>
        <RedirectToLogin manager={rx.manager} />
      </Async.Rejected>
    </Async>
  );
};
