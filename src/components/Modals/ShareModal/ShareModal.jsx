import { useState } from "react";
import styles from "./ShareModal.module.css";

const expiryDays = [
  { duration: 1, unit: "hour", text: "1 Hour" },
  { duration: 2, unit: "hours", text: "2 Hours" },
  { duration: 3, unit: "hours", text: "3 Hours" },
  { duration: 1, unit: "day", text: "1 Day" },
  { duration: 3, unit: "days", text: "3 Days" },
  { duration: 7, unit: "days", text: "1 Week" },
];

export function ShareModal({ fileFolderData, setShareForm, setNotification }) {
  const [link, setLink] = useState(null);
  const [duration, setDuration] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState(null);

  const handleShare = async () => {
    setStatus("Generating...")
    const res = await fetch(
      `${import.meta.env.VITE_PROD_SERVER }/file-system/${fileFolderData.dataType === "Folder" ? "folders" : "files"}/generate/`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: duration?.duration,
          unit: duration?.unit,
          resourceId: fileFolderData?.id,
        }),
      },
    );
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setLink(`https://void-storage-frontend.vercel.app/${data.link}`);
      setDisabled(true);
    } else{
      setNotification({ message: data.message, time: Date.now() });
    }
    setStatus(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setNotification({ message: "Copied To Clipboard!", time: Date.now() });

  };
  return (
    <>
      <div className={styles["share-form-container"]}>
        <div className={styles["share-form"]}>
          <h1 id={styles["share-title"]}>Share File</h1>
          <p style={{ color: "#ff5a30" }}>
            {fileFolderData.dataType === "Folder"
              ? "Generate a public link to share the current folder and its contents"
              : "Generate a public link to share the selected file"}
          </p>

          <p className={styles["share-duration-title"]}>
            Links will expire after the specified duration
          </p>
          <div className={styles["share-form-days"]}>
            {expiryDays.map((day) => (
              <div
                className={`${styles["day"]} ${duration === day ? styles["selected-day"] : ""}`}
                onClick={() => setDuration(day)}
              >
                {day.text}
              </div>
            ))}
          </div>
          {link && (
            <div className={styles["generated-link-container"]}>
              <div className={styles["generated-link"]}>
                <small style={{ fontSize: "10px", marginLeft: "22px" }}>
                  {link}
                </small>
              </div>
              <img
                onClick={handleCopy}
                alt="copy icon"
                src="/copy_icon.svg"
                id={styles["copy"]}
              />
              <span id={styles["copy-tooltip"]}></span>
            </div>
          )}
          <div className={styles["share-form-btns"]}>
            <button disabled={disabled} type="submit" onClick={handleShare}>
              {!status ? 'Generate' : status}
            </button>
            <button
              onClick={() => {
                setStatus(null);
                setShareForm({ isOpen: false, fileFolder: null })
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
