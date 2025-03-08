// imports
import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './HomeSidebar.module.css'
import CreateUploadModal from '../../Modals/CreateUploadModal/CreateUploadModal';

// a file system sidebar component
export default function HomeSidebar({setFolders, setFiles, rootFolderId, setLoading, setNotification}){

    // modal states to render the appropriate forms (file and folder creationi forms)
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 
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

                {fileForm && <CreateUploadModal 
                    formConfigObject={{formType: "File"}} 
                    setFileForm={setFileForm} 
                    setFileFolders={setFiles} 
                    rootFolderId={rootFolderId} 
                    setLoading={setLoading} 
                    setNotification={setNotification}
                />}

                {folderForm && 
                    <CreateUploadModal 
                    formConfigObject={{formType: "Folder"}} 
                    setFolderForm={setFolderForm} 
                    setFileFolders={setFolders} 
                    rootFolderId={rootFolderId} 
                    setLoading={setLoading} 
                    setNotification={setNotification}
                />}  
            </div>
        </>
    )
}