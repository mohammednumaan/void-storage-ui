// imports
import styles from "./FolderView.module.css"
import { useEffect, useState } from "react";
import FileFolderContainer from "../FileFolderContainer/FileFolderContainer";
import { Link, useParams } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModal/DeleteModal";
import MoveFolder from "../MoveFolder/MoveFolder";
import RenameModal from "../Modals/RenameModal/RenameModal";

// a folder/file view component
export default function FolderView({folders, files, setFolders, setFiles, rootFolderId, setLoading}){

    // extract the folderId from the route url
    const {folderId} = useParams();

    // a state to manage breadcrumb navigation
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [renameForm , setRenameForm] = useState({isOpen: false, fileFolder: null});
    const [deleteForm , setDeleteForm] = useState({isOpen: false, fileFolder: null});
    const [moveFolderData, setMoveFolderData] = useState({type: "", id: null, folder: ""});

    // a simple useEffect to get the current folder's path
    useEffect(() => {
        async function getFolderPathSegements(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/segments/${folderId || rootFolderId}`, {
                credentials: 'include',
                mode: 'cors'
            });
            const data = await response.json();
            if (response.ok){
                setBreadcrumbs([...data.folderSegments])
            }
            
        }
        if (folderId || rootFolderId) getFolderPathSegements(); 
        
    }, [folderId, rootFolderId])

    const handleDelete = async (event, dataType, dataId) => {
        event.preventDefault();
        setLoading(true)

        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: dataType === 'Folder' ? JSON.stringify({folderId: dataId}) : JSON.stringify({fileId: dataId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = (dataType === "Folder" ? folders : files).filter(data => data.id !== dataId);
            (dataType === "Folder") ? setFolders((_) => [...updatedData]) : setFiles((_) => [...updatedData]);
        }
        else{
            console.log(response)
        }
        setDeleteForm({isOpen: false, fileFolder: null})
        setLoading(false)
    }

    const handleRename = async (event, dataType, dataId, newName) => {
        event.preventDefault();
        setLoading(true)

        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: (dataType === "Folder") 
                ? JSON.stringify({newFolderName: newName, folderId: dataId})
                : JSON.stringify({newFileName: newName, fileId: dataId, folderId: folderId || rootFolderId, parentFolderId: folderId || rootFolderId}),
            credentials: 'include'
        })
        if (response.ok){
            const renamedData = await response.json();
            const updatedData = (dataType === "Folder" ? folders : files).filter(data => data.id !== dataId);
            (dataType === "Folder") ? setFolders((_) => [...updatedData, renamedData.renamedFolder]) : setFiles((_) => [...updatedData, renamedData.renamedFile]);
        }
        else{
            console.log('err')
        }
        setRenameForm({isOpen: false, fileFolder: null})
        setLoading(false)
    }


    return (
        <>  

            <nav className={styles["breadcrumbs"]}>
                {breadcrumbs.length !== 0 && breadcrumbs.map(breadcrumb => (
                    <small className={styles["breadcrumb-segment"]}>
                        <Link to={breadcrumb.name === "root" ? `/tree` :  `/tree/${folderId || rootFolderId}/${breadcrumb.id}`}>
                            {breadcrumb.name}
                        </Link>                      
                        <img alt="chevron right icon" src="/public/chevron_right_icon.svg" />
                    </small>
                ))}
            </nav>
            
            <div className={styles["file-folder-header"]}>
                <div className={styles["file-folder-header-right"]}>
                    <p style={{textAlign: "left"}}>Name</p>
                    <p>Size</p> 
                    <p>Created</p>
                    <p>Options</p>
                </div>
            </div>

            <hr />

            <div className={styles["folder-list"]}>
                {folders.length !== 0 && folders.map((folder) => (
                    <FileFolderContainer 
                        key={folder.id}
                        fileFolderData={{dataType: "Folder", data: folder}}
                        rootFolderId={rootFolderId}
                        setRenameForm={setRenameForm}
                        setDeleteForm={setDeleteForm}
                        setMoveFolderData={setMoveFolderData}
                    />
                ))}
            </div>

            <div className={styles["file-list"]}>
                {files.length !== 0 && files.map((file, idx) => (
                    <FileFolderContainer 
                        key={file.id}
                        fileFolderData={{dataType: "File", data: file}}                        
                        rootFolderId={rootFolderId}   
                        setRenameForm={setRenameForm}
                        setDeleteForm={setDeleteForm}
                        setMoveFolderData={setMoveFolderData}
                    />
                ))}
            </div>


            {moveFolderData.id &&   
                <MoveFolder 
                    setLoading={setLoading}
                    moveFolderData={moveFolderData} 
                    setMoveFolderData={setMoveFolderData} 
                    rootFolderId={rootFolderId}
                />
            }

            {(deleteForm.isOpen && deleteForm.fileFolder.data.id) && 
                <DeleteModal 
                    fileFolderData={deleteForm.fileFolder}
                    handleDelete={handleDelete}
                    setDeleteForm={setDeleteForm}
                />
            }

            {(renameForm.isOpen && renameForm.fileFolder.data.id) && 
                <RenameModal 
                    fileFolderData={renameForm.fileFolder}
                    handleRename={handleRename}
                    setRenameForm={setRenameForm}
                />
            }

            
            {((folders.length == 0 && files.length == 0)) && 
                <h3 className={styles["no-file-folders-message"]}>
                    Create Folders Or Upload a File Here To View This Folder's Contents.
                </h3>
            }
        </>
    )

}