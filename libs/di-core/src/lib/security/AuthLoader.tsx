import { Notification } from '@mantine/core';
import React from 'react';

export interface loadingProps {
  msg: string;
}

export const AuthLoader: React.FC<loadingProps> = (rx) => {
  return (
    <Notification loading title="Please wait ..." disallowClose>
      <div>{rx.msg}</div>
    </Notification>
  );
};
