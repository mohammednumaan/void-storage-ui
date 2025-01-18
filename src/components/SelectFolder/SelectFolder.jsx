import { useState } from "react";
import styles from "./SelectFolder.module.css"

export default function SelectFolder({setSearch, folders, currentFolderId}){

    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const handleFolderSelection = async () => {
        // e.preventDefault();
        console.log(currentFolderId, selectedFolderId)
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/move`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selectedFolderId, currentFolderId}),
            credentials: 'include',
            mode: 'cors'
        })

        const data = await response.json();
        console.log(data)

    }

    const handleFolderClick = (folderId) => {
        setSelectedFolderId(folderId);
    }
    console.log(selectedFolderId)

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
                        <div className={`${styles["folder"]}`} onClick={() => handleFolderClick(folder.id)} >
                            <div className={`styles["folder-left"] ${selectedFolderId === folder.id} ? ${styles.active} : styles.inactive}`} >
                                <img src="/public/folder_open_icon.svg" alt="folder icon"></img>
                                <p style={{textOverflow: "ellipsis"}}>{folder.folderName}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleFolderSelection} id={styles["move-btn"]}>Move Folder</button>
                </div>

            </div>
        </>

    )
}