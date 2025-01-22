// imports
import { useState } from "react"
import styles from "./RenameModal.module.css"
import { useParams } from "react-router-dom";

export default function RenameModal({dataId, dataType, dataCollection, setDataCollection, setRenameForm, rootFolderId}){

    const {folderId} = useParams();
    const [renameInput, setRenameInput] = useState();

    const handleRenameInput = (e) => {
        const value = e.target.value;
        setRenameInput(value);
    }

    const handleRenameSubmit = async (event, dataId) => {
        event.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: (dataType === "Folder") 
                ? JSON.stringify({newFolderName: renameInput, folderId: dataId})
                : JSON.stringify({newFileName: renameInput, fileId: dataId, folderId: folderId || rootFolderId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = dataCollection.filter(data => data.name === renameInput);
            setDataCollection((_) => [...updatedData]);
        }
        else{
            console.log('err')
        }
    }

    return (
        <>
            <div className={styles["rename-form-container"]}>
                <div className={styles["rename-form"]}>
                    <form onSubmit={(e) => handleRenameSubmit(e, dataId)} method="POST">
                        <label htmlFor="rename-input" id={styles["rename-label"]}>{dataType === "File" ? 'Rename File' : 'Rename Folder'}</label>
                        <input onChange={handleRenameInput} 
                            type="text" id={styles["rename-input"]}
                            name={dataType === "File" ? 'newFileName' : 'newFolderName'} 
                            value={renameInput}
                        />
                        
                        <div className={styles["rename-form-btns"]}>
                            <button type="submit">Rename</button>
                            <button onClick={() => setRenameForm(false)}>Close</button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )

}