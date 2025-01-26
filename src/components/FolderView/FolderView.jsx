// imports
import styles from "./FolderView.module.css"
import { memo, useEffect, useRef, useState } from "react";
import FileFolderContainer from "../FileFolderContainer/FileFolderContainer";
import SelectFolder from "../SelectFolder/SelectFolder";
import { Link, useParams } from "react-router-dom";

// a folder/file view component
export default function FolderView({folders, files, setFolders, setFiles, rootFolderId, setLoading}){

    // extract the folderId from the route url
    const {folderId} = useParams();

    // a state to manage breadcrumb navigation
    const [breadcrumbs, setBreadcrumbs] = useState([])
    
    const [searchData, setSearchData] = useState({type: "", id: null, folder: ""});


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

    const handleDeletion = async (event, dataType, dataId) => {
        event.preventDefault();
        event.stopPropagation();
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
        setLoading(false)
    }

    const handleRename = async (event, dataType, dataId) => {
        event.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: (dataType === "Folder") 
                ? JSON.stringify({newFolderName: renameInput, folderId: dataId})
                : JSON.stringify({newFileName: renameInput, fileId: dataId, folderId: folderId || rootFolderId, parentFolderId: folderId || rootFolderId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = (dataType === "Folder" ? folders : files).filter(data => data.name === renameInput);
            (dataType === "Folder") ? setFolders((_) => [...updatedData]) : setFiles((_) => [...updatedData]);
        }
        else{
            console.log('err')
        }
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
                        handleDeletion={handleDeletion}
                        handleRename={handleRename}
                        setSearchData={setSearchData}
                        rootFolderId={rootFolderId}
                    />
                ))}
            </div>

            <div className={styles["file-list"]}>
                {files.length !== 0 && files.map((file, idx) => (
                    <FileFolderContainer 
                        key={file.id}
                        fileFolderData={{dataType: "File", data: file}}
                        handleDeletion={handleDeletion}
                        handleRename={handleRename}
                        setSearchData={setSearchData}
                        rootFolderId={rootFolderId}     
                    />
                ))}
            </div>

            {((folders.length == 0 && files.length == 0)) && 
                <h3 className={styles["no-file-folders-message"]}>
                    Create Folders Or Upload a File Here To View This Folder's Contents.
                </h3>
            }

            {searchData.id &&
                <>
                    
                    <SelectFolder setSearchData={setSearchData} searchData={searchData} rootFolderId={rootFolderId}>
                        
                    </SelectFolder>
                </>

            }
        </>
    )

}