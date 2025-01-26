// imports
import { useState } from "react"
import styles from "./RenameModal.module.css"

export default function RenameModal({fileFolderData, handleRename, setIsOpenRenameForm}){

    const [renameInput, setRenameInput] = useState("");
    const [disabled, setDisabled] = useState(false);
    const handleRenameInput = (e) => {
        const value = e.target.value;
        setRenameInput(value);
    }

    return (
        <>
            <div className={styles["rename-form-container"]}>
                <div className={styles["rename-form"]}>
                    <form onSubmit={(e) => {
                            handleRename(e, fileFolderData.dataType, fileFolderData.data.id, renameInput)
                            setDisabled(true)
                        }} 
                        method="POST"
                    >
                        <label htmlFor="rename-input" id={styles["rename-label"]}>{fileFolderData.dataType === "File" ? 'Rename File' : 'Rename Folder'}</label>
                        <input disabled={disabled} onChange={handleRenameInput} 
                            type="text" id={styles["rename-input"]}
                            name={fileFolderData.dataType === "File" ? 'newFileName' : 'newFolderName'} 
                            value={renameInput}
                        />
                        
                        <div className={styles["rename-form-btns"]}>
                            <button disabled={disabled} type="submit">Rename</button>
                            <button disabled={disabled} onClick={() => setIsOpenRenameForm(false)}>Close</button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )

}