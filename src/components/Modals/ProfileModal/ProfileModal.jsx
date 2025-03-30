// imports
import { useState } from "react";
import styles from "./ProfileModal.module.css"
import { useNavigate } from "react-router-dom";

export default function ProfileModal({user, setNotifications, setUser, handleProfileOpen}){
    const [username, setUsername] = useState(user)
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        console.log(username)
        setUsername(e.target.value);
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:3000/users/profile/`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username})
        });

        const data = await res.json();
        if (res.ok){
            setUsername(data.username)
            setUser(data.username)
        } else{
            setNotifications({message: data.message || data.errors[0].msg, timestamp: new Date()})
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:3000/users/profile/delete/`, {
            mode: 'cors',
            credentials: 'include',
        });

        const data = await res.json();
        if (res.ok){
            navigate('/')
        } else{
            setNotifications({message: data.message || data.errors[0].msg, timestamp: new Date()})
        }
    }
    return (
        <>
            <div className={styles["profile-form-container"]}>
                <div className={styles["profile-form"]}>
                    <h1 id={styles["profile-title"]}>Profile</h1>
                    <p style={{color: 'gray', marginTop: '-20px'}}>Welcome {user}!</p>
                    <form onSubmit={(e) => {
                        handleUpdate(e)
                        setDisabled(true)
                    }} 
                        method="POST"
                    >
                        <label id={styles["profile-username-label"]} htmlFor="username">Username</label>
                        <input value={username} onChange={handleUsernameChange} name="username" id={styles["profile-username-input"]}></input>

                        <div className={styles["profile-form-btns"]}>
                            <button disabled={username === user} type="submit">Update</button>
                            <button onClick={() => handleProfileOpen(false)}>Close</button>
                        </div>
                    </form>
                    <button onClick={handleDeleteAccount} id={styles["delete-account-btn"]}>Delete Account</button>
                </div>

            </div>
        </>
    )

}