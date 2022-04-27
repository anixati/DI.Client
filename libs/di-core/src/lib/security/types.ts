import { UserManager } from 'oidc-client';

export const REDIRECT_URL_KEY = 'REDIRECT_URL';

export type SecurityCtx = { manager: UserManager; basename?: string };
