// imports
import styles from "./FolderView.module.css"
import { memo, useEffect, useRef, useState } from "react";
import FileFolderContainer from "../FileFolderContainer/FileFolderContainer";
import SelectFolder from "../SelectFolder/SelectFolder";
import { Link, useParams } from "react-router-dom";
import FileDetailsView from "../FIleDetailsView/FileDetailsView";

// a folder/file view component
export default function FolderView({folders, files, setFolders, setSelectedFile, selectedFile, setFiles, rootFolderId, setLoading}){

    // extract the folderId from the route url
    const {folderId, fileId} = useParams();

    // a state to manage breadcrumb navigation
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [isOpenRenameForm , setIsOpenRenameForm] = useState(false);
    const [isOpenDeleteForm , setIsOpenDeleteForm] = useState(false);

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

    useEffect(() => {
        async function getFileInformation(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files/asset/${fileId}`, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            })

            const data = await response.json();
            if (response.ok){
                setSelectedFile(data.file)
            }
        }

        if (fileId) getFileInformation();
    }, [fileId])

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
        setIsOpenDeleteForm(false)
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
        setIsOpenRenameForm(false)
        setLoading(false)
    }

    const handleFileSelection = (file) => {
        setFiles([])
        setFolders([])
        setSelectedFile(file)
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

            {selectedFile && (
                <FileDetailsView file={selectedFile} />
            )}

            <div className={styles["folder-list"]}>
                {folders.length !== 0 && folders.map((folder) => (
                    <FileFolderContainer 
                        key={folder.id}
                        fileFolderData={{dataType: "Folder", data: folder}}
                        handleDeletion={handleDeletion}
                        handleRename={handleRename}
                        setSearchData={setSearchData}
                        handleFileSelection={handleFileSelection}
                        rootFolderId={rootFolderId}
                        renameForm={{isOpenRenameForm, setIsOpenRenameForm}}
                        deleteForm={{isOpenDeleteForm, setIsOpenDeleteForm}}

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
                        handleFileSelection={handleFileSelection}
                        rootFolderId={rootFolderId}     
                        renameForm={{isOpenRenameForm, setIsOpenRenameForm}}
                        deleteForm={{isOpenDeleteForm, setIsOpenDeleteForm}}
                    />
                ))}
            </div>

            {((folders.length == 0 && files.length == 0 && !selectedFile)) && 
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