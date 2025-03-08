// imports
import { useState } from "react";
import styles from "./DeleteModal.module.css"

export default function DeleteModal({fileFolderData, handleDelete, setDeleteForm}){
    const [disabled, setDisabled] = useState(false);
    return (
        <>
            <div className={styles["delete-form-container"]}>
                <div className={styles["delete-form"]}>
                    <form onSubmit={(e) => {
                        handleDelete(e, fileFolderData.dataType, fileFolderData.data.id)
                        setDisabled(true)
                    }} 
                        method="POST"
                    >
                        <h1 id={styles["delete-title"]}>{fileFolderData.dataType === "File" ? 'Delete File' : 'Delete Folder'}</h1>
                        <p style={{color: '#d62c2c', opacity: 0.8}}>
                            {fileFolderData.dataType === "Folder" ? "Are you sure you want to delete this folder (and its entire contents)?" 
                            : "Are you sure you want to delete this file permenantly?"
                            }
                        </p>
                        <div className={styles["delete-form-btns"]}>
                            <button disabled={disabled} type="submit">Delete</button>
                            <button disabled={disabled} onClick={() => setDeleteForm({isOpen: false, fileFolder: null})}>Close</button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )

}