// imports
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "./Navigation/NavigationBar";

// protected route component
export default function ProtectedRoute({isAuth, setIsAuth}){
  // const [isAuth, setIsAuth] = useState(false);
  // const [rootFolderId, setRootFolderId] = useState("");
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/authenticate`, {
  //       mode: 'cors',
  //       credentials: 'include'
  //     })

  //     const data = await response.json();
  //     if (data.authenticated){
  //       setIsAuth(true)
  //     } else{
  //       setIsAuth(false)
  //     }
  //   })();
  // },[])
  
  
  // // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // // if true, we render the respective component, else, we re-direct the user to the login page
  // useEffect(() => {

  //   if (!isAuth) setLoading(false);
  //   else setLoading(true);
    
  // }, [isAuth, loading])
  if (isAuth && loading){
    return (
      <> 
        <Outlet context={isAuth} />
      </>
    )
  } else{
    return <Navigate to={'/register'} />
  }
  
}


