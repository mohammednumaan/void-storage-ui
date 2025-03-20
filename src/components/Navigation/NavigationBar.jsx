// imports
import { Link, useNavigate } from "react-router-dom"
import styles from "./NavigationBar.module.css"

// navigation bar component
export default function NavigationBar(){

    const navigate = useNavigate();
    const handleLogout = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/logout`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        })

        const data = await response.json();    
        console.log(data)
        if (response.ok){
            navigate('/')
        } else{
            
        }
    }
    return (
        <>
            <div className={styles["navbar-container"]}>
                <div className={styles["navbar-header"]}>
                    <h4>Void</h4>
                    <h4 id={styles["header-text-two"]}>Storage</h4>
                </div>

                <div className={styles["navbar-links"]}>
                <Link to='/'><img src="/public/account_icon.svg" alt="account button icon" title="Account" /></Link>
                <img onClick={handleLogout} src="/public/logout_icon.svg" alt="logout button icon" title="Logout" />
                </div>
            </div>
        </>
    )
}