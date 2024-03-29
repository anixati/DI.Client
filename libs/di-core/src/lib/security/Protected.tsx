import { Navigate, useLocation } from 'react-router-dom';
import { useUserIdentity } from './AuthProvider';
import { getAppToken, setAuthHeader, setBearerToken } from './Core';

export function ProtectedArea({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const user = useUserIdentity();
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
     getAppToken().then((tk)=>{
      setAuthHeader(tk);
    })
    
  }

  return children;
}
