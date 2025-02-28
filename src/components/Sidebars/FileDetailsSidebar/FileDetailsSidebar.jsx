import { useEffect, useState } from "react";
import styles from "./FileDetailsSidebar.module.css"
import { Link, useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";

export default function FileDetailsSidebar({selectedFile, setIsOpenDetails, getFileSize}){
    
    const [file, setFile] = useState(null);
    const location = useLocation();
    const [isClosed, setIsClosed] = useState(false)

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


    console.log(selectedFile)
    return (

        <div className={selectedFile.fileId ? styles["file-info-container"] : styles["file-info-container-hidden"]}>
            <div className={`${styles["file-info-sidebar"]} ${selectedFile.fileId ? styles["slidein-animation"] : ''} ${isClosed ? styles["slideout-animation"] : ''}`}>

                <div className={styles["file-details-header"]}>
                    <h3 className={styles["filename"]}>{file?.fileName} </h3>
                    <img onClick={() => {
                            setIsOpenDetails({fileId: null})
                            setIsClosed(true)
                        }} 
                        style={{padding: "20px", cursor: "pointer"}} alt="close icon" src="/public/close_icon.svg" 
                        title={"Close File Details"} />
                </div>
                <div className={styles["file-preview"]}>
                    <img style={{borderRadius: "10px"}} width={"100%"} height={"100%"} src={file?.fileUrl} alt={`${file?.fileName} image`} />
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
                            <small>{file?.createdAt && format(file?.createdAt, "MMM d, yyyy")}</small>
                        </li>

                        <li className={styles["file-details-item"]}>
                            <small>Location</small>
                            <Link to={location.pathname}><button id={styles["folder-loc-btn"]}><small>Go to folder</small></button></Link>
                        </li>
                    </ul>
                </div>
                <div className={styles["file-options"]}>
                    <button  id={styles["download-btn"]}>Download File</button>
                    <button id={styles["share-btn"]}>Share File</button>
                </div>
            </div>
        </div>
    )
}