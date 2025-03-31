// imports
import { useState } from "react";
import styles from "./ProfileModal.module.css";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({
  user,
  setNotification,
  setUser,
  handleProfileOpen,
}) {
  const [username, setUsername] = useState(user);
  const [password, setPassword] = useState("");

  const [deleteStatus, setDeleteStatus] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_PROD_SERVER }/users/profile/`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    if (res.ok) {
      setUsername(data.username);
      setUser(data.username);
    } else {
      setNotification({
        message: data.message || data.errors[0].msg,
        time: Date.now(),
      });
    }
  };

  const handleDeleteConfirmation = () => {
    setDeleteStatus("Confirm Deletion");
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteStatus("Deleting...");
    const res = await fetch(`${import.meta.env.VITE_PROD_SERVER }/users/profile/delete/`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(null);
      setTimeout(() => navigate("/"), 2000);
    } else {
      setDeleteStatus("Confirm Deletion");
      setNotification({
        message: data.message || data.errors[0].msg,
        time: Date.now(),
      });
    }
  };
  return (
    <>
      <div className={styles["profile-form-container"]}>
        <div className={styles["profile-form"]}>
          <h1 id={styles["profile-title"]}>Profile</h1>
          <p style={{ color: "gray", marginTop: "-20px" }}>Welcome {user}!</p>
          <form
            onSubmit={(e) => {
              handleUpdate(e);
              setDisabled(true);
            }}
            method="POST"
          >
            <label id={styles["profile-label"]} htmlFor="username">
              Change username
            </label>
            <input
              value={username}
              onChange={handleUsernameChange}
              name="username"
              id={styles["profile-input"]}
            ></input>

            {deleteStatus && (
              <>
                <label id={styles["profile-label"]} htmlFor="delete">
                  Enter Your Password To Confirm Deletion
                </label>
                <input
                  value={password}
                  placeholder="Your Password..."
                  onChange={handlePasswordChange}
                  name="delete"
                  id={styles["profile-input"]}
                ></input>
              </>
            )}

            <div className={styles["profile-form-btns"]}>
              <button disabled={username === user} type="submit">
                Update
              </button>
              <button onClick={() => handleProfileOpen(false)}>Close</button>
            </div>
          </form>
          {
            <button
              onClick={
                !deleteStatus ? handleDeleteConfirmation : handleDeleteAccount
              }
              id={styles["delete-account-btn"]}
            >
              {!deleteStatus ? "Delete Account" : deleteStatus}
            </button>
          }
        </div>
      </div>
    </>
  );
}
