import React, { useCallback } from 'react';
import Async from 'react-async';
import { Navigate } from 'react-router-dom';
import { REDIRECT_URL_KEY, SecurityCtx } from './types';
import { LogoutPage } from './Logout';
import { AuthLoader } from './AuthLoader';

export const LoginComplete: React.FC<SecurityCtx> = (rx) => {
  
  const redirectTo = localStorage.getItem(REDIRECT_URL_KEY) || '/';

  const completeLogin = useCallback(async () => {
    const user = await rx.manager.signinCallback();
    if (!user) {
      throw new Error('login failed');
    }
    await rx.manager.storeUser(user);
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
