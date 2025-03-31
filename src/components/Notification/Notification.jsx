import { useEffect, useState } from "react";
import styles from "./Notification.module.css";

export default function Notification({ notification, setNotifications }) {
  const [isClosed, setIsClosed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(notification.time);

  useEffect(() => {
    if (notification.time && lastUpdated !== notification.time) {
      setIsClosed(true);
      setTimeout(() => {
        setIsClosed(false);
        setLastUpdated(notification.time);
      }, 100);
    }
  }, [notification.time, lastUpdated]);
  console.log(lastUpdated, notification.time);
  return (
    <div
      className={`${styles["notification-container"]} ${notification.message && lastUpdated === notification.time ? styles["slidedown-animation"] : ""} ${isClosed && lastUpdated !== notification.time ? styles["slideup-animation"] : ""} `}
    >
      <p>
        <b>{notification.message}</b>
      </p>
      <img
        onClick={() => {
          setIsClosed(true);
          setNotifications({ message: null, time: null });
        }}
        style={{ color: "#0e0d0d", cursor: "pointer" }}
        alt="close icon"
        src="/public/close_icon_black.svg"
        title={"Close Notification"}
      />
    </div>
  );
}
