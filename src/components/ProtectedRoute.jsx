// imports
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// protected route component
export default function ProtectedRoute(){

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  
  // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // if true, we render the respective component, else, we re-direct the user to the login page
  useEffect(() => {
      (async () => {
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}users/authenticate`, {
          mode: 'cors',
          credentials: 'include'
        })

        const data = await response.json();
        if (data.authenticated){
          setUsername(data.username);
          setLoading(false);
        } 
        
        else{
          setUsername("")
          setLoading(true);
          navigate('/register');
        }
      })();
  
  }, [])

  return (
    <>
      {loading ? <h1>Loading...</h1> : <Outlet context={username} />}
    </>
  )
}


