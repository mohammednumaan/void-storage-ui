import { useEffect, useState } from "react";
import styles from "./FileDetails.module.css"
import { Link, useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";

export default function FileDetails({selectedFile, setIsOpenDetails, getFileSize}){
    
    const [file, setFile] = useState(null);
    const location = useLocation();

    useEffect(() => {
        async function getFileInformation(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files/asset/${selectedFile?.fileId}`, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            })

            const data = await response.json();
            if (response.ok){
                console.log(data.file)
                setFile(data.file)
            }
        }
        if (selectedFile) getFileInformation();
    }, [selectedFile])
    return (

        <div className={styles["file-info-container"]}>
            <div className={styles["file-info-sidebar"]}>

                <div className={styles["file-details-header"]}>
                    <h1>{file?.fileName} </h1>
                    <img onClick={() => setIsOpenDetails({fileId: null})} style={{padding: "20px", cursor: "pointer"}} alt="close icon" src="/public/close_icon.svg" title={"Close File Details"} />
                </div>
                <div className={styles["file-preview"]}>
                    <img style={{borderRadius: "10px"}} width={"100%"} height={"100%"} src={file?.fileUrl} alt={`${file?.fileName} image`} />
                </div>

                <div className={styles["file-info"]}>
                    <ul className={styles["file-details"]}>
                        <h3 id={styles["file-info-header"]}>File Details</h3>
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
                            <small>{file?.createdAt && format(file?.createdAt, "MMM d, yyyy")}</small>
                        </li>

                        <li className={styles["file-details-item"]}>
                            <small>Location</small>
                            <Link to={location.pathname}><button id={styles["folder-loc-btn"]}><small>Go to folder</small></button></Link>
                        </li>
                    </ul>
                </div>
                <div className={styles["file-options"]}>
                    <button id={styles["download-btn"]}>Download File</button>
                    <button id={styles["share-btn"]}>Share File</button>

                </div>
            </div>
        </div>
    )
}