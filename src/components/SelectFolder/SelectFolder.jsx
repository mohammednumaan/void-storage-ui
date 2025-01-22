import { useEffect, useState } from "react";
import styles from "./SelectFolder.module.css"
import { format } from "date-fns";

export default function SelectFolder({setSearchData, searchData}){

    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [availableFolders, setAvailableFolders] = useState([]);

    useEffect(() => {
        async function getAvailableFolders(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/available/${searchData.folder}`, {
                credentials: 'include',
                mode: 'cors'
            });
            const data = await response.json();
            if (response.ok){
                setAvailableFolders([...data.availableFolders])
            }

        }
        console.log(selectedFolderId, availableFolders)
        if (searchData.id && searchData.folder) getAvailableFolders(); 

    }, [JSON.stringify(availableFolders)], searchData.folder)


    const handleFolderSelection = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${searchData.type === "Folder" ? 'folders' : 'files'}/move`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selectedFolderId, moveData: searchData.id}),
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
    console.log("HELLO", searchData)
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

                    {availableFolders.map(folder => (
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