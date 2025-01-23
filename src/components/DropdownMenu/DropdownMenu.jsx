// imports
import { useParams } from "react-router-dom";
import styles from "./DropdownMenu.module.css"

// a custom dropdown meny that dynamically renders based on the dataType passed in
export default function DropdownMenu({dataType, dataId, showMenu, setSearchData, dataCollection, setRenameForm, setDataCollection, height, rootFolderId}){

    const {folderId} = useParams()
    // a dynamic async function to handle file (or) folder deletion on click
    // based on the dataType passed into the component
    const handleDataDeletion = async (event, dataId) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(dataId)
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: dataType === 'Folder' ? JSON.stringify({folderId: dataId}) : JSON.stringify({fileId: dataId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = dataCollection.filter(data => data.id !== dataId);
            setDataCollection((_) => [...updatedData]);
        }
        else{
            console.log(response)
        }

    }

    return (
        <div className={styles["dropdown-menu"]} style={{top: "10em"}}>
            <ul className={`${styles.menu} ${showMenu === dataId? styles.open : ''}`} style={{top: height}}>
                <li>
                    <button className={styles["menu-item-btn"]} 
                        onClick={(e) => handleDataDeletion(e, dataId)}>
                        
                        <img alt="delete icon" src="/public/folder_delete_icon.svg" title={`Delete ${dataType}`} />
                        Delete
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} onClick={() => setRenameForm(true)}>
                    <img alt="rename icon" src="/public/folder_edit_icon.svg" title={`Delete ${dataType}`} />
                        Edit
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} onClick={() => setSearchData({type: dataType, id: dataId, folder: folderId || rootFolderId})}>
                        <img alt="movie icon" src="/public/move_icon.svg" title={`Move ${dataType}`} />
                        Move
                    </button>
                </li>
            </ul>
        </div>
    )
};