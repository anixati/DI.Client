import { Notification } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import Async from 'react-async';
import { X } from 'tabler-icons-react';
import { getErrorMsg } from '../di-core';
import { AuthLoader } from './AuthLoader';
import { SecurityCtx } from './types';

export const RedirectToLogin: React.FC<SecurityCtx> = (rx) => {
  const [err, SetErr] = useState<string>('');

  const redirect = useCallback(async () => {
    try {
      await rx.manager.clearStaleState();
      await rx.manager.removeUser();
      await rx.manager.revokeAccessToken();
      await rx.manager.signinRedirect();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise((r) => {});
    } catch (error) {console.error(error);
      SetErr(getErrorMsg(error));
      throw new Error('Failed');
    }
  }, [rx.manager]);

  return (
    <Async promiseFn={redirect}>
      <Async.Initial>
        <AuthLoader msg="Please wait" />
      </Async.Initial>
      <Async.Loading>
        <AuthLoader msg="Redirecting... Please wait" />
      </Async.Loading>
      <Async.Rejected>
        <Notification icon={<X size={18} />} color="red" title="Authentication failed" disallowClose>
          {err}
        </Notification>
      </Async.Rejected>
    </Async>
  );
};
