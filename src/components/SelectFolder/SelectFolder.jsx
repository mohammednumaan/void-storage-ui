import { useState } from "react";
import styles from "./SelectFolder.module.css"
import { format } from "date-fns";

export default function SelectFolder({setSearch, fileFolderId}){

    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const handleFolderSelection = async () => {
        // e.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files/move`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selectedFolderId, fileId: fileFolderId}),
            credentials: 'include',
            mode: 'cors'
        })

        const data = await response.json();
        if (data.ok){
            setSelectedFolderId(null);
        }

    }

    const handleFolderClick = (folderId) => {
        setSelectedFolderId(folderId);
    }

    return (
        <>
            <div className={styles["search-folder-container"]}>
                <div className={styles["search-folder-view"]}>
                    <div className={styles["search-bar"]}>
                        <input id={styles["search-folder-input"]} name="search-folder" placeholder="Search..."></input>
                        <button className={styles["search-btn"]}>
                            <img src="/public/search_icon.svg" alt="search icon"></img>

                        </button>
                    </div>

                    <div className={styles["folder-details-right"]}>
                        <p>Folder</p>
                        <p>Size</p> 
                        <p>Created</p>
                    </div>
                    <hr />

                    {folders.map(folder => (
                        <div key={folder.id} 
                            className={`${styles["folder"]} ${selectedFolderId === folder.id ? styles["active"] : styles["inactive"]}`} 
                            onClick={() => handleFolderClick(folder.id)} 
                        >
                            <div className={`${styles["folder-left"]}`} >
                                <img src="/public/folder_open_icon.svg" alt="folder icon"></img>
                                <p style={{textOverflow: "ellipsis"}}>{folder.folderName}</p>
                            </div>
                            <p>-</p>
                            <p>{format(folder.createdAt, 'dd/MM/yyyy')}</p>
                        </div>
                    ))}
                    <button onClick={handleFolderSelection} id={styles["move-btn"]}>Move Folder</button>
                </div>

            </div>
        </>

    )
}