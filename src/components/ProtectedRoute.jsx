// imports
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar/NavigationBar";

// protected route component
export default function ProtectedRoute(){

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // if true, we render the respective component, else, we re-direct the user to the login page
  useEffect(() => {
      (async () => {
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/authenticate`, {
          mode: 'cors',
          credentials: 'include'
        })

        const data = await response.json();
        if (data.authenticated){
          console.log(data);
          setIsAuth(true);
          setLoading(false);
        } 
        
        else{
          setIsAuth(false)
          setLoading(true);
        }
      })();
  
  }, [])

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


