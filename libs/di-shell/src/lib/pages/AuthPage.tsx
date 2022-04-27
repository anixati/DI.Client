import { Navigate, useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
 
  const navigate = useNavigate();
 
  // useEffect(() => {
  //   async function signinAsync() {
  //     console.log(auth.userData,'--\\-');
  //     //await auth.userManager.signinRedirect();
  //     await auth.userManager.signinSilent();
  //     console.log(auth.userData,'-------');
  //     navigate("/",{})
  //   }
  //   signinAsync()
  // }, [auth,navigate])
  return <Navigate to={"/"}/>;
};
