// imports
import styles from "./DropdownMenu.module.css"

// a custom dropdown meny that dynamically renders based on the dataType passed in
export default function DropdownMenu({dataType, dataId, showMenu, setEditable, dataCollection, setDataCollection, height}){

    // a dynamic async function to handle file (or) folder deletion on click
    // based on the dataType passed into the component
    const handleDataDeletion = async (event, dataId) => {
        event.preventDefault();
        event.stopPropagation()
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: JSON.stringify({dataId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = dataCollection.filter(data => data.id !== dataId);
            setDataCollection((_) => [...updatedData]);
        }
        else{
            console.log('err')
        }

    }

    return (
        <div className={styles["dropdown-menu"]} style={{top: "10em"}}>
            <ul className={`${styles.menu} ${showMenu === dataId? styles.open : ''}`} style={{top: height}}>
                <li>
                    <button className={styles["menu-item-btn"]} 
                        onClick={(e) => handleDataDeletion(e, dataId)}>
                        
                        <img alt="delete icon" src="/public/folder_delete_icon.svg" title={`Delete ${dataType}`} />
                        Delete {dataType}
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} onClick={() => setEditable(dataId)}>
                    <img alt="rename icon" src="/public/folder_edit_icon.svg" title={`Delete ${dataType}`} />
                        Rename {dataType}
                    </button>
                </li>
                <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                <li>
                    <button className={styles["menu-item-btn"]} onClick={() => setSearch(dataId)}>
                        <img alt="movie icon" src="/public/move_icon.svg" title={`Move ${dataType}`} />
                        Move {dataType}
                    </button>
                </li>
            </ul>
        </div>
    )
};