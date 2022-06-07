
import { User } from 'oidc-client';
import React, { useCallback } from 'react';
import Async from 'react-async';
import { useAtom } from 'jotai';
import { rootNav } from '../site';

import { AuthLoader } from './AuthLoader';
import { OidcProvider } from './AuthProvider';
import { RedirectToLogin } from './RedirectToLogin';
import { REDIRECT_URL_KEY, SecurityCtx } from './types';

export const AuthenticateInner: React.FC<SecurityCtx> = (rx) => {
  const [root, SetRoot] = useAtom(rootNav);

  const login = useCallback(async () => {
    const xpath = rx.basename ? window.location.href.replace(rx.basename, '') : window.location.pathname;
    localStorage.setItem(REDIRECT_URL_KEY, xpath);
    const user = await rx.manager.getUser();
    if (!user || user.expired) {
      await rx.manager.removeUser();
      throw new Error('No user account');
    }else{
      const ix = xpath.indexOf('/', 1);
      const rx = (ix>0)?xpath.substring(0, xpath.indexOf('/', 1)):xpath;
      SetRoot(rx);
    }
    return user;
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
