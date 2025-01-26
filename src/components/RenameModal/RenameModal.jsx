// imports
import { useState } from "react"
import styles from "./RenameModal.module.css"

export default function RenameModal({fileFolderData, handleRename, setRenameForm}){

    const [renameInput, setRenameInput] = useState();

    const handleRenameInput = (e) => {
        const value = e.target.value;
        setRenameInput(value);
    }

    return (
        <>
            <div className={styles["rename-form-container"]}>
                <div className={styles["rename-form"]}>
                    <form onSubmit={(e) => handleRename(e, fileFolderData.dataType, fileFolderData.data)} method="POST">
                        <label htmlFor="rename-input" id={styles["rename-label"]}>{dataType === "File" ? 'Rename File' : 'Rename Folder'}</label>
                        <input onChange={handleRenameInput} 
                            type="text" id={styles["rename-input"]}
                            name={fileFolderData.dataType === "File" ? 'newFileName' : 'newFolderName'} 
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