// imports
import { useState } from "react";
import styles from "./CreateFileFolderModal.module.css";
import { useParams } from "react-router-dom";

// a dynamic form component to upload files and create new folders 
export default function FileFolderModal({formConfigObject, setFolderForm, setFileForm, setFolders}){

    const {folderId} = useParams();

    // destructuring the formConfigObject to render the form accordingly
    const {formType} = formConfigObject;

    // a file state to store the uploaded file
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState({parentFolder: folderId || "root", folderName: ""});

    // a simple function to handle input change
    // for the file-input field
    const handleFileInput = (e) => {
        setFile(e.target.files[0]);
    }

    // a simple async function to handle submission 
    // of the 'add file' form
    const handleFileSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("file", file);
        formData.append("parentFolder", folderId || "root");
        
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files`, {
            method: "POST",
            body: formData,
            credentials: "include",
            mode: "cors",
        })

        const data = await response.json();
        setFileForm(false)
    }

    // a simple function to handle input change
    // for the file-input field
    const handleFolderInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFolder(prev => ({...prev, [name]: value}));
    }

    // a simple async function to handle to handle submission
    // of the 'add folder' form
    const handleFolderSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(folder),
            credentials: 'include',
            mode: 'cors'
        })

        const data = await response.json();
        setFolderForm(false);
        setFolders(folders => [...folders, data.createdFolder])
    } 

    return (
        <>
            <div className={styles["file-folder-form-container"]}>
                <div className={styles["file-folder-form"]}>
                    <form onSubmit={formType === "File" ? handleFileSubmit : handleFolderSubmit} method="POST" 
                        encType={formType === "File" ? "multipart/form-data" : "application/x-www-form-urlencoded"}>

                        <label htmlFor="file-folder-input" id={styles["file-folder-label"]}>{formType === "File" ? 'Upload File' : 'Create Folder'}</label>
                        <input onChange={formType === "File" ? handleFileInput : handleFolderInput} 
                            type={formType === "File" ? "file" : "text"} id={styles["file-folder-input"]} name={formType === "File" ? 'file' : 'folderName'} />
                        
                        <div className={styles["file-form-btns"]}>
                            <button type="submit">{formType === "File" ? 'Upload File' : 'Create Folder'}</button>
                            <button onClick={() => formType === "File" ? setFileForm(false) : setFolderForm(false)}>Close</button>

                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}   