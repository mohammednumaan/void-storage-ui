// imports
import { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./MobileMenu.module.css"
import { Link } from "react-router-dom";

export default function MobileMenu({setFolders, setFiles, rootFolderId}){

    // modal states to render the appropriate forms (file and folder creationi forms)
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 

    return (

        <>
            <div className={styles["mobile-menu-container"]}>
          
                    <button id={styles['add-folder-btn']} onClick={() => setFolderForm(true)}>
                        <img alt='create new file icon' src='/public/new_folder_icon.svg' title='Create Folder' />
                    </button>

                    <Link to={`/tree`}>
                        <button id={styles['home-folder-btn']}>
                            <img alt='home icon' src='/public/home_icon.svg' title='Root Folder' />
                        </button>
                    </Link>

                    <button id={styles['add-file-btn']} onClick={() => setFileForm(true)}>
                        <img alt='create new file icon' src='/public/new_file_icon.svg' title='Upload File'/>
                    </button>
            </div>

            {fileForm && <Modal formConfigObject={{formType: "File"}} setFileForm={setFileForm} setFileFolders={setFiles} rootFolderId={rootFolderId} />}
            {folderForm && <Modal formConfigObject={{formType: "Folder"}} setFolderForm={setFolderForm} setFileFolders={setFolders} rootFolderId={rootFolderId} />}  
        </>
    )
}