import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { CenterPanel } from '@dotars/di-controls';
import { SecurityCtx, useAppContext } from '@dotars/di-core';
import { useCallback } from 'react';

export const AccessDeniedPage: React.FC<SecurityCtx> = (rx) => {
  const { logout } = useAppContext();

  const onLogout = useCallback(async () => {
    const user = await rx.manager?.getUser();
    
    await rx.manager.clearStaleState();
    await rx.manager.revokeAccessToken();
    await rx.manager.removeUser();
    await rx.manager.signoutRedirect({ 'id_token_hint': user?.id_token });
    if (logout) logout();
  }, [rx.manager, logout]);

  return (
    <CenterPanel title="Access Denied!" desc="You need additional privileges in order to access.">
      <Button fullWidth style={{ marginTop: 14 }} variant="gradient" onClick={() => onLogout()}>
        Try Again
      </Button>
    </CenterPanel>
  );
};
