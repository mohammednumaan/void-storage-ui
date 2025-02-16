import { useEffect, useState } from "react";
import styles from "./MoveFolder.module.css"
import { format } from "date-fns";
import { Link } from "react-router-dom";


export default function MoveFolder({moveFolderData, setMoveFolderData, rootFolderId, setLoading}){

    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    const [availableFolders, setAvailableFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(rootFolderId)

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        async function getAvailableFolders(){
            const response =    
            
            await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/${rootFolderId}`, {
                credentials: 'include',
                mode: 'cors'
            }) 
            const data = await response.json();
            if (response.ok){
                setAvailableFolders([...data.folders])
            }

        }
        getAvailableFolders(); 

    }, [])

    useEffect(() => {
        async function getFolderPathSegements(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/segments/${currentFolder}`, {
                credentials: 'include',
                mode: 'cors'
            });
            const data = await response.json();
            if (response.ok){
                setBreadcrumbs([...data.folderSegments])
            }
            
        }
        if (currentFolder) getFolderPathSegements(); 
        
    }, [currentFolder])

    const handleDoubleClick = async function getAvailableFolders(folderId){
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/${folderId}`, {
            credentials: 'include',
            mode: 'cors'
        });
        const data = await response.json();
        if (response.ok){
            setAvailableFolders([...data.folders])
            setCurrentFolder(folderId)
            setSelectedFolderId(folderId);
        }

    }

    const handleFolderSelection = async () => {
        setLoading(true)
        setDisabled(true)
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${moveFolderData.type === "Folder" ? 'folders' : 'files'}/move`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selectedFolderId: selectedFolderId || rootFolderId, moveData: moveFolderData.id}),
            credentials: 'include',
            mode: 'cors'
        })

        const data = await response.json();
        setMoveFolderData({type: "", id: null, folder: ""})
        setLoading(false)
        setDisabled(false)
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

                    <small className={styles["folder-details-right"]}>
                        <p>Folder</p>
                        <p>Size</p> 
                        <p>Created</p>
                    </small>
                    <hr />

                    {availableFolders.map(folder => (
                        moveFolderData.type === "Folder" && (folder.id === moveFolderData.id) ? "":

                        <div key={folder.id} 
                            className={`${styles["folder"]} ${selectedFolderId === folder.id ? styles["active"] : styles["inactive"]}`} 
                            onClick={() => setSelectedFolderId(folder.id)} 
                            onDoubleClick={() => handleDoubleClick(folder.id)}

                        >
                            <small className={`${styles["folder-left"]}`} >
                                <img  src="/public/folder_open_icon.svg" alt="folder icon"></img>
                                <p className={styles["folder-name"]} style={{textOverflow: "ellipsis"}}>{folder.folderName}</p>
                            </small>
                            <small className={styles["folder-size"]}>-</small>
                            <small className={styles["folder-created"]}>{format(folder.createdAt, 'MMM d, yyyy')}</small>
                        </div>

                    ))}

                    {/* <div className={styles["folder-navigation"]} */}
                    <nav className={styles["breadcrumbs"]}>
                        {breadcrumbs.length !== 0 && breadcrumbs.map(breadcrumb => (
                            <small className={styles["breadcrumb-segment"]}>
                                <Link onClick={() => breadcrumb.name === "root" ? handleDoubleClick(rootFolderId) : handleDoubleClick(breadcrumb.id)}>
                                    {breadcrumb.name}
                                </Link>                      
                                <img alt="chevron right icon" src="/public/chevron_right_icon.svg" />
                            </small>
                        ))}
                    </nav>
                    <button disabled={disabled} onClick={handleFolderSelection} id={styles["move-btn"]}>Select Folder</button>
                </div>

            </div>
        </>

)
}