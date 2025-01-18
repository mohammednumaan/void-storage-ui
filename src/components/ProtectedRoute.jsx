// imports
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar/NavigationBar";
import Cookies from 'js-cookie';

// protected route component
export default function ProtectedRoute({isAuth, setIsAuth}){
  // const [isAuth, setIsAuth] = useState(false);
  // const [rootFolderId, setRootFolderId] = useState("");
  const [loading, setLoading] = useState(true);
  
  // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // if true, we render the respective component, else, we re-direct the user to the login page
  useEffect(() => {
    
  }, [isAuth])
  return (
    <>
      {!isAuth && !loading ? <Navigate to={'/register'} /> : 
        <> 
          <div>
            <NavigationBar />
          </div>
          <Outlet />
        </>}
    </>
  )
}


