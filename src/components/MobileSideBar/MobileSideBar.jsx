import { useState } from "react";
import FileFolderModal from "../Modal/CreateFileFolderModal";
import styles from "./MobileSideBar.module.css"
// onClick={/* () => setFolderForm(true)*/}
// onClick={() => setFileForm(true)}

export default function MobileSideBar({setFolders, setFiles}){
    // modal states to render the appropriate forms (file and folder creationi forms)
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 
    return (

        <>
            <div className={styles["mobile-sidebar-container"]}>
                <div className={styles["mobile-file-options"]}>
                    <button id={styles['add-folder-btn']} onClick={() => setFileForm(true)}>
                        <img alt='create new file icon' src='/public/new_folder_icon.svg' title='Create Folder' />
                    </button>

                    <button id={styles['add-file-btn']} onClick={() => setFolderForm(true)}>
                        <img alt='create new file icon' src='/public/new_file_icon.svg' title='Upload File'/>
                    </button>
                </div>
            </div>

            {fileForm && <FileFolderModal formConfigObject={{formType: "File"}} setFileForm={setFileForm} setFileFolders={setFiles} />}
            {folderForm && <FileFolderModal formConfigObject={{formType: "Folder"}} setFolderForm={setFolderForm} setFileFolders={setFolders} />}  
        
        </>
    )
}