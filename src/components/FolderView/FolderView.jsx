import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import styles from "./FolderView.module.css"
import { format } from "date-fns";

export default function FolderView(){

    const [folders, setFolders] = useState([]);
    const {folderId} = useParams();

    useEffect(() => {
        async function getFolders(){
            const response = await fetch(`http://localhost:3000/file-system/folders/${folderId || 'root'}`, {
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok){
                
                setFolders([...data.folders]);
            } else{
                console.log('err')
            }
        }
        getFolders();
    }, [folderId])

    return (
        <>
            <div className={styles["folder-details-header"]}>
                <p>Folder Name</p>

                <div className={styles["folder-details-right"]}>
                    <p>Created At</p>
                    <p>Options</p>
                </div>

            </div>
            <hr classname={styles["folder-details-view-divider"]}></hr>
            {folders.length !== 0 && folders.map(folder => (
                <Link className={styles["folder-container"]} to={`/tree/${folder.folderName}`}>
                    <div className={styles["folder"]}>

                        <div className={styles["folder-left"]}>
                            <img src="/public/folder_open_icon.svg"></img>
                            <p>{folder.folderName}</p>
                        </div>

                   

                        <div className={styles["folder-right"]}>
                            <p>{format(folder.createdAt, 'dd/MM/yyyy')}</p>
                            <img src="/public/folder_delete_icon.svg"></img>
                            <img src="/public/folder_edit_icon.svg"></img>

                        </div>
                    </div>
                </Link>
            ))}

            {folders.length == 0 && <h3>Create Folders Or Upload a File Here To View Folder Contents.</h3>}
        </>
    )

}