import { createContext, useContext } from 'react';
import { User } from 'oidc-client';

const AuthenticationContext = createContext<User>(null as any);
export const useUserIdentity = () => {
  return useContext(AuthenticationContext);
};

export const OidcProvider: React.FC<{ user: User }> = ({ user, children }) => {
  return (
    <AuthenticationContext.Provider value={user}>
      {children}
    </AuthenticationContext.Provider>
  );
};
