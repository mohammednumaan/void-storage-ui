// imports
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import Form from './components/Form/Form'
import Home from './components/Home/Home'
import FileSystem from './components/FileSystem/FileSystem'
import ProtectedRoute from './components/ProtectedRoute'
import FolderView from './components/FolderView/FolderView'
import NavigationBar from './components/NavigationBar/NavigationBar'
import { memo, useEffect, useState } from 'react'
import ErrorPage from './components/ErrorPage'


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

// here, i memoize the protected route component to prevent
// unncessary re-render causes by useNavigate hook
const MemoizedProtectedRoute = memo(ProtectedRoute)


// app component
function App() {

  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false)

  // once the component is mounted, we check if the user's session is still authenticated (logged in)
  // if true, we re-direct the user to /tree, else, we render the home page with login and register component
  useEffect(() => {
    (async () => {
      console.log("App")
      const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/authenticate`, {
        mode: 'cors',
        credentials: 'include'
      })

      const data = await response.json();
      if (data.authenticated){
        setIsAuth(true)
        navigate('/tree');
      } else{
        setIsAuth(false)
      }
    })();
  },[isAuth])
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Form formOptions={registerFormOptions} />} />
        <Route path='/login' element={<Form formOptions={loginFormOptions} />} />

        <Route element={<MemoizedProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} />}>
            <Route path='/tree' element={<FileSystem />} >
              <Route path=':parentFolder/:folderId' element={<FolderView />}></Route>
              <Route path='file/:folderId/:fileId' element={<FolderView />}></Route>
            </Route>
         
        </Route>
      </Routes>
    </>
  )
}

export default App
