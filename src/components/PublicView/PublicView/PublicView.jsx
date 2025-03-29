import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import PublicFileFolderContainer from "../FileFolderContainers/PublicFileFolderContainer";
import styles from "../../FolderView/FolderView.module.css"

export default function PublicView({resource, linkId, isOpenDetails, setIsOpenDetails}){
    const {parentFolder, folderId} = useParams();

    const [folders, setFolders] = useState([])
    const [files, setFiles] = useState([])

    useEffect(() => {
        async function getFolders(){
            const res = await fetch(`http://localhost:3000/file-system/folders/${folderId || resource.id}/`, {
                mode: 'cors',                
            });

            const data = await res.json();
            if (res.ok){
                setFolders([...data.folders])
            }
        }

        if (folderId || (resource.id && resource.type === "Folder")) getFolders();
    }, [resource.id, folderId])

    useEffect(() => {
        async function getFiles(){
            const response = await fetch(`http://localhost:3000/file-system/files/${folderId || resource.id}`, {
                mode: 'cors',
            });

            const data = await response.json();
            if (response.ok){
                setFiles([...data.allFiles]);


            } else{
                console.log('err')
            }
        }

        if (folderId || (resource.id && resource.type === "Folder")) getFiles();

    }, [resource.id, folderId])


    return (
        <>  
        
            <div className={styles["folder-list"]}>
                {folders.length !== 0 && folders.map((folder) => (
                    <PublicFileFolderContainer key={folder.id}
                        fileFolderData={{dataType: "Folder", data: folder}}
                        parentFolder={resource.id || parentFolder}
                        linkId={linkId}
                        isOpenDetails={isOpenDetails}
                        setIsOpenDetails={setIsOpenDetails}

                    />
                ))}
            </div>

            <div className={styles["file-list"]}>
                {files.length !== 0 && files.map((file) => (
                    <PublicFileFolderContainer key={file.id}
                        fileFolderData={{dataType: "File", data: file}}
                        parentFolder={resource.id || parentFolder}
                        linkId={linkId}
                        isOpenDetails={isOpenDetails}
                        setIsOpenDetails={setIsOpenDetails}

                    />
                ))}
            </div>
        </>
    )

}