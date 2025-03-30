// imports
import { Link, useNavigate } from "react-router-dom"
import styles from "./NavigationBar.module.css"

// navigation bar component
export default function NavigationBar({handleProfileOpen}){

    const navigate = useNavigate();
    const handleLogout = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/logout`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        })

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
                <img onClick={handleProfileOpen} src="/public/account_icon.svg" alt="account button icon" title="Account" />
                <img onClick={handleLogout} src="/public/logout_icon.svg" alt="logout button icon" title="Logout" />
                </div>
            </div>
        </>
    )
}