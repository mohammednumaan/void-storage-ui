// imports
import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'
import FileFolderModal from '../Modal/Modal';

// a file system sidebar component
export default function Sidebar({setFolders, setFiles, rootFolderId, setLoading}){

    // modal states to render the appropriate forms (file and folder creationi forms)
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 
    console.log(setLoading)
    return (
        <>
            <div className={styles["folder-container"]}>
                <div className={styles["folder-headers"]}>
                    <h1 id={styles["folder-header-title"]}>Folders</h1>
                    <button id={styles['add-folder-btn']} onClick={() => setFolderForm(true)}>
                         Add Folders 
                        <img alt='create new file icon' src='/public/new_folder_icon.svg' title='Create Folder' />
                    </button>

                    <button id={styles['add-file-btn']} onClick={() => setFileForm(true)}>
                        Add File 
                        <img alt='create new file icon' src='/public/new_file_icon.svg' title='Upload File'/>
                    </button>

                </div>
                
                <div className={styles["folder-list"]}>
                    <div className={styles["folder"]}> 
                        <h2><Link to={`/tree`}>Root</Link></h2>
                    </div>
                </div>

                {fileForm && <FileFolderModal formConfigObject={{formType: "File"}} setFileForm={setFileForm} setFileFolders={setFiles} rootFolderId={rootFolderId} setLoading={setLoading} />}
                {folderForm && <FileFolderModal formConfigObject={{formType: "Folder"}} setFolderForm={setFolderForm} setFileFolders={setFolders} rootFolderId={rootFolderId} setLoading={setLoading} />}  
            </div>
        </>
    )
}