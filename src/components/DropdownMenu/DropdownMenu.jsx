// imports
import { useParams } from "react-router-dom";
import styles from "./DropdownMenu.module.css"

// a custom dropdown meny that dynamically renders based on the dataType passed in
export default function DropdownMenu({
    fileFolderData, 
    handleDeletion, 
    menuId, 
    setSearchData, 
    setRenameForm, 
    height, 
    rootFolderId, 
    setLoading
}){
    const {folderId} = useParams();
    return (
        <div className={styles["dropdown-menu"]} style={{top: "10em"}}>
            <ul className={`${styles.menu} ${menuId === fileFolderData.data.id ? styles.open : ''}`} style={{top: height}}>
                <li>
                    <button className={styles["menu-item-btn"]} 
                        onClick={(e) => handleDeletion(e, fileFolderData.dataType, fileFolderData.data.id)}>
                        
                        <img alt="delete icon" src="/public/folder_delete_icon.svg" title={`Delete ${fileFolderData.dataType}`} />
                        Delete
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} onClick={() => setRenameForm(true)}>
                    <img alt="rename icon" src="/public/folder_edit_icon.svg" title={`Delete ${fileFolderData.dataType}`} />
                        Edit
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} 
                        onClick={() => setSearchData({type: fileFolderData.dataType, id: fileFolderData.data.id, folder: folderId || rootFolderId})}
                    >
                    <img alt="movie icon" src="/public/move_icon.svg" title={`Move ${fileFolderData.dataType}`} />
                        Move
                    </button>
                </li>
            </ul>
        </div>
    )
};