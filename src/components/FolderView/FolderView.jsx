// imports
import { Link, useParams } from "react-router-dom"
import styles from "./FolderView.module.css"
import { format } from "date-fns";
import { useEffect } from "react";

// a simple function to convert the file size
// to a human readable format for display purposes
const getFileSize = (bytes) => {
    let sizes = [' Bytes', ' KB', ' MB', ' GB',
        ' TB', ' PB', ' EB', ' ZB', ' YB'];

    for (let i = 1; i < sizes.length; i++){
        if (bytes < Math.pow(1024, i)){
            return (Math.round((bytes / Math.pow(
                1024, i - 1)) * 100) / 100) + sizes[i - 1];
        }

    }
    return bytes;
        
}

// a folder/file view component
export default function FolderView({folders, files, setFolders, setFiles,  selectedFile, setSelectedFile}){

    const {folderId, fileId} = useParams();

    useEffect(() => {
        async function getFileDetails(){

                const response = await fetch(`http://localhost:3000/file-system/files/file/${folderId}/${fileId}`, {
                    mode: 'cors',
                    credentials: 'include'
                })
    
                const data = await response.json();
                console.log(data)
                if (response.ok){
                    setFolders([]);
                    setFiles([]);
                    setSelectedFile(data.file);

                } else{
                    console.log('err');
                }

        }
        if (fileId) getFileDetails();
    }, [fileId])
    
    // a simple async function to handle folder deletes
    const handleFolderDelete = async (event, folderId) => {
        event.preventDefault();
        event.stopPropagation()
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: JSON.stringify({folderId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFolders = folders.filter(folder => folder.id !== folderId)
            setFolders(prev => ([...updatedFolders]));
        }
        else{
            console.log('err')
        }

    }

    // a simple async function to handle file deletes
    const handleFileDelete = async (event, fileId) => {
        event.preventDefault();
        event.stopPropagation()
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: JSON.stringify({fileId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFiles = files.filter(file => file.id !== fileId)
            console.log(updatedFiles)
            setFiles(prev => ([...updatedFiles]));
        }
        else{
            console.log('err')
        }

    }

    return (
        <>
            <div className={styles["folder-details-header"]}>
                <p>Folder/File Name</p>

                <div className={styles["folder-details-right"]}>
                    <p>Size</p>
                    <p>Created At</p>
                    <p>Options</p>
                </div>

            </div>
            <hr />

            {selectedFile && (
                <div className={styles["file-view-container"]}>

                    <div className={styles["file-view-details"]} title="File Details">
                        <div className={styles["file"]}>

                            <div className={styles["file-left"]}>
                                <img alt="file icon" src="/public/file_icon.svg"></img>
                                <p>{selectedFile.fileName}</p>
                            </div>

                            <div className={styles["file-right"]}>

                                <div className={styles["file-right-size"]}>
                                    <p id={styles["file-size"]}>{getFileSize(selectedFile.fileSize)}</p>
                                </div>
                                <p>{format(selectedFile.createdAt, 'dd/MM/yyyy')}</p>

                                <div className={styles["file-right-options"]}>
                                    <img alt="file delete icon" src="/public/folder_delete_icon.svg"></img>
                                    <img alt="file edit icon" src="/public/folder_edit_icon.svg"></img>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className={styles["file-view"]}>
                    </div>
                    <div className={styles["file-view-options"]}>
                        <button>Download File</button>
                        <button>View File</button>

                    </div>

                </div>
            )}
            {folders.length !== 0 && folders.map(folder => (
                <Link key={folder.id} className={styles["folder-container"]} to={`/tree/${folderId || 'root'}/${folder.id}`}>
                    <div className={styles["folder"]}>

                        <div className={styles["folder-left"]}>
                            <img src="/public/folder_open_icon.svg" alt="folder icon"></img>
                            <p>{folder.folderName}</p>
                        </div>

                        <div className={styles["folder-right"]}>
                            <p id={styles["folder-right-size"]}>-</p>
                            <p>{format(folder.createdAt, 'dd/MM/yyyy')}</p>

                            <div className={styles["folder-right-options"]}>
                                <img alt="folder delete icon" src="/public/folder_delete_icon.svg" title="Delete Folder" onClick={(e) => handleFolderDelete(e, folder.id)}></img>
                                <img alt="folder edit icon" src="/public/folder_edit_icon.svg" title="Edit Folder"></img>
                            </div>

                        </div>
                    </div>
                </Link>
            ))}

        {files.length !== 0 && files.map(file => (
                <Link key={file.id} className={styles["file-container"]} to={`/tree/file/${file.folderId}/${file.id}`}>
                    <div className={styles["file"]}>

                        <div className={styles["file-left"]}>
                            <img alt="file icon" src="/public/file_icon.svg"></img>
                            <p>{file.fileName}</p>
                        </div>

                        <div className={styles["file-right"]}>

                            <div className={styles["file-right-size"]}>
                                <p id={styles["file-size"]}>{getFileSize(file.fileSize)}</p>
                            </div>
                            <p>{format(file.createdAt, 'dd/MM/yyyy')}</p>

                            <div className={styles["file-right-options"]}>
                                <img alt="file delete icon" src="/public/folder_delete_icon.svg" onClick={(e) => handleFileDelete(e, file.id)}></img>
                                <img alt="file edit icon" src="/public/folder_edit_icon.svg"></img>
                            </div>

                        </div>
                    </div>
                </Link>
            ))}

        {((folders.length == 0 && files.length == 0) && !selectedFile) && <h3 className={styles["no-file-folders-message"]}>Create Folders Or Upload a File Here To View This Folder's Contents.</h3>}
        </>
    )

}