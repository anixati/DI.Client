import React, { useCallback } from 'react';
import Async from 'react-async';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthLoader } from './AuthLoader';
import { LogoutPage } from './Logout';
import { REDIRECT_URL_KEY, SecurityCtx } from './types';

export const LoginComplete: React.FC<SecurityCtx> = (rx) => {
  const location = useLocation();

  const redirectTo = localStorage.getItem(REDIRECT_URL_KEY) || '/';

  const completeLogin = useCallback(async () => {
    const user = await rx.manager.signinCallback();
    if (!user) {
      throw new Error('login failed');
    }
    await rx.manager.storeUser(user);
    if (redirectTo) {
      const rx = redirectTo.substring(0, redirectTo.indexOf('/', 1));
    }

    return user;
  }, [rx.manager]);

  return (
    <Async promiseFn={completeLogin}>
      <Async.Loading>
        <AuthLoader msg="Logging in... Please wait" />
      </Async.Loading>
      <Async.Resolved>
        <Navigate to={redirectTo} />
      </Async.Resolved>
      <Async.Rejected>
        <LogoutPage manager={rx.manager} />
      </Async.Rejected>
    </Async>
  );
};
