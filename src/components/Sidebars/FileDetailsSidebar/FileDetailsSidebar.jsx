import { useEffect, useState } from "react";
import styles from "./FileDetailsSidebar.module.css";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

export default function FileDetailsSidebar({
  selectedFile,
  setIsOpenDetails,
  getFileSize,
  setShareForm,
}) {
  const [file, setFile] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    async function getFileInformation() {
      const response = await fetch(
        `${import.meta.env.VITE_PROD_SERVER }/file-system/files/asset/${selectedFile?.fileId}`,
        {
          method: "GET",
          credentials: "include",
          mode: "cors",
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data.file);
        setFile(data.file);
      }
    }
    if (selectedFile.fileId) getFileInformation();
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile.fileId && isClosed) setIsClosed(false);
  }, [selectedFile.fileId, isClosed]);

  const handleDownload = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PROD_SERVER }/file-system/files/asset/download/${selectedFile.fileId}`,
      {
        method: "GET",
        credentials: "include",
        mode: "cors",
      },
    );

    const data = await response.blob();
    const url = URL.createObjectURL(data);

    // this code instantly downloads the file to the users file-system
    const temporaryLinkEl = document.createElement("a");
    temporaryLinkEl.href = url;
    temporaryLinkEl.download = file?.fileName || "image";
    document.body.appendChild(temporaryLinkEl);
    temporaryLinkEl.click();
    document.body.removeChild(temporaryLinkEl);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setShareForm({
      isOpen: true,
      fileFolder: { id: selectedFile.fileId, dataType: "File" },
    });
  };

  return (
    <div
      className={
        selectedFile.fileId
          ? styles["file-info-container"]
          : styles["file-info-container-hidden"]
      }
    >
      <div
        className={`${styles["file-info-sidebar"]} ${selectedFile.fileId ? styles["slidein-animation"] : ""} ${isClosed ? styles["slideout-animation"] : ""}`}
      >
        <div className={styles["file-details-header"]}>
          <h4 className={styles["filename"]}>{file?.fileName} </h4>
          <img
            onClick={() => {
              setIsOpenDetails({ fileId: null });
              setIsClosed(true);
            }}
            style={{ padding: "20px", cursor: "pointer", marginRight: "-10px" }}
            alt="close icon"
            src="/close_icon.svg"
            title={"Close File Details"}
          />
        </div>
        <div className={styles["file-preview"]}>
          {(file?.fileType.includes("pdf") && file?.fileName.includes(".pdf")) ? (
            <object
              style={{ borderRadius: "10px" }}
              data={file?.fileUrl}
              type="application/pdf"
              height={"100%"}
              width={"100%"}
            />
          ) : file?.fileType.includes("text") ||
            file?.fileType.includes("msword") || !file?.fileName.includes(".pdf") ? (
            <p>Text/Document File, Download This File To View</p>
          ) : (
            <img
              style={{ borderRadius: "10px" }}
              src={file?.fileUrl}
              alt={`${file?.fileName} image`}
            />
          )}
        </div>

        <div className={styles["file-info"]}>
          <h3 id={styles["file-info-header"]}>File Details</h3>
          <ul className={styles["file-details"]}>
            <li className={styles["file-details-item"]}>
              <small>Name</small>
              <small>{file?.fileName}</small>
            </li>

            <li className={styles["file-details-item"]}>
              <small>Type</small>
              <small>{file?.fileType}</small>
            </li>

            <li className={styles["file-details-item"]}>
              <small>Size</small>
              <small>{getFileSize(file?.fileSize)}</small>
            </li>

            <li className={styles["file-details-item"]}>
              <small>Created</small>
              <small>
                {file?.createdAt && format(file?.createdAt, "MMM d, yyyy")}
              </small>
            </li>

            {setShareForm && (
              <li className={styles["file-details-item"]}>
                <small>Location</small>
                <button
                  onClick={() => {
                    setIsOpenDetails({ fileId: null });
                    setIsClosed(true);
                  }}
                  id={styles["folder-loc-btn"]}
                >
                  <small>Go To Folder</small>
                </button>
              </li>
            )}
          </ul>
          <div className={styles["file-options"]}>
            <button id={styles["download-btn"]} onClick={handleDownload}>
              Download
            </button>
            <button
              disabled={!setShareForm}
              id={styles["share-btn"]}
              onClick={handleShare}
            >
              Share File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
