import { useState } from "react";
import styles from "./Notification.module.css";

export default function Notification({message, setNotifications}){
    const [isClosed, setIsClosed] = useState(false)

    return (
        <div className={`${styles["notification-container"]} ${message ? styles["slidedown-animation"] : ''} ${isClosed ? styles['slideup-animation'] : ''} `}>
            <p><bold>{message}</bold></p>
            <img 
                onClick={() => {
                    setIsClosed(true)
                    setNotifications(null)
                }}
                style={{color: "#0e0d0d", cursor: "pointer"}} alt="close icon" src="/public/close_icon_black.svg" 
                title={"Close Notification"}

            />
            
        </div>
    )
}