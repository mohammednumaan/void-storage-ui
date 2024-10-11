// imports
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import Form from './components/Form/Form'
import Home from './components/Home/Home'
import FileSystem from './components/FileSystem/FileSystem'
import { useEffect, useState } from 'react'
import ProtectedRoute from './components/ProtectedRoute'


// configuration objects that are passed as props to the form 
// component to help the component determine the type of form and its behaviour
const loginFormOptions = {
  formType: "Login",
  linkTo: "register",
}

const registerFormOptions = {
  formType: "Register",
  linkTo: "login",
}

// app component
function App() {

  const navigate = useNavigate();

  // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // if true, we re-direct the user to /tree, else, we render the home page with login and register component
  useEffect(() => {
    (async () => {
      const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}users/authenticate`, {
        mode: 'cors',
        credentials: 'include'
      })

      const data = await response.json();
      if (data.authenticated){
        navigate('/tree');
      }
    })();
  },[])

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Form formOptions={registerFormOptions} />} />
        <Route path='/login' element={<Form formOptions={loginFormOptions} />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/tree' element={<FileSystem />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
