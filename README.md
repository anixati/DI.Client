 const logout = () => {
    console.log('...')
  };
const {userManager} = useAuth();
 
  useEffect(() => {
    async function signoutAsync() {
      userManager.clearStaleState();
      userManager.removeUser();
      await userManager.signoutRedirectCallback();
      navigate("/",{})
    }
    signoutAsync()
  }, [userManager,navigate])



import React from "react";
import "./styles.css";
import * as Icons from "react-icons/fa";

/* Your icon name from database data can now be passed as prop */
const DynamicFaIcon = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) { // Return a default one
    return <Icons.FaBeer />;
  }

  return <IconComponent />;
};

export default function App() {
  return (
    <div className="App">
      <DynamicFaIcon name="FaAngellist" />
      <DynamicFaIcon />
    </div>
  );
}