import { format } from "date-fns";
import styles from "../../FileFolderContainer/FileFolder.module.css"
import { Link, useNavigate } from "react-router-dom";
import FileDetailsSidebar from "../../Sidebars/FileDetailsSidebar/FileDetailsSidebar";
import { useState } from "react";



export default function PublicFileFolderContainer({fileFolderData, parentFolder, linkId, isOpenDetails, setIsOpenDetails, getFileSize}){

    const navigate = useNavigate();


    const handleDoubleClick = () => {
        if (fileFolderData.dataType === "Folder"){
            navigate(`/view/public/folder/${linkId}/${parentFolder}/${fileFolderData.data.id}`)
        }
    } 

    const handleClick = () => {
        if (fileFolderData.dataType === "File"){
            setIsOpenDetails({fileId: fileFolderData.data.id})
        }
    }

    return (
        <>
            <Link  
                style={{marginLeft: "7px", width: "100%"}}
                className={styles["file-folder-container"]} 
                onDoubleClick={handleDoubleClick} 
                onClick={fileFolderData.dataType === "File" ? handleClick : ''  }
            >
                <div className={styles["file-folder"] }>
                    <div className={styles["file-folder-left"]}>
                        {fileFolderData.dataType === "Folder" ? <img className={styles["folder-icon"]} src="/public/folder_open_icon.svg" alt="folder icon" />
                            : <img src="/public/file_icon.svg" className={styles["file-icon"]} alt="file icon" />
                        }       
                    
                        <small className={styles["file-folder-name"]}>
                            {fileFolderData.dataType === "File" && (
                                <span className={styles["file-extension"]}>
                                    {`[${fileFolderData.data.fileName.split('.')[fileFolderData.data.fileName.split('.').length - 1]}]`}
                                </span>
                            )}
                            <span>
                                {fileFolderData.dataType ==="Folder" ? fileFolderData.data.folderName : fileFolderData.data.fileName}
                            </span>
                        </small>
                    </div>

                    <div className={styles["file-folder-right"]}>
                        <small className={styles["file-folder-size"]}>{fileFolderData.dataType === "Folder" ? '-' : getFileSize(fileFolderData.data.fileSize)}</small>
                        <small className={styles["file-folder-created"]}>{format(fileFolderData.data.createdAt, 'MMM d, yyyy')}</small>
                    </div>
                </div>
            </Link>

            <FileDetailsSidebar
                selectedFile={isOpenDetails} 
                setIsOpenDetails={setIsOpenDetails} 
                getFileSize={getFileSize} 
            />
        </>
    )
    
}