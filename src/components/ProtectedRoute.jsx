// imports
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

// protected route component
export default function ProtectedRoute(){

  const navigate = useNavigate();
  const {folderId} = useParams();
  const [username, setUsername] = useState("");
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
          setUsername(data.username);
          setLoading(false);
        } 
        
        else{
          setUsername("")
          setLoading(true);
          
          setTimeout(() => navigate('/'), 2000);
        }
      })();
  
  }, [folderId])

  return (
    <div style={loading ? {height: "95vh", display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff5a30'} : {}}>
      {loading ? <h1>Unauthorized, Redirecting To Home Page...</h1> : <Outlet context={username} />}
    </div>
  )
}

