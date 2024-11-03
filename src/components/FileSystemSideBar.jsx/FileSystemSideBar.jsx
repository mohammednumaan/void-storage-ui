// imports
import { useEffect, useState } from 'react'
import styles from './FileSystemSideBar.module.css'
import FileFolderModal from '../Modal/CreateFileFolderModal';

// a file system sidebar component
export default function FileSystemSideBar(){

    // modal states to render the appropriate forms
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 

    // a folders state to store the fetched folders
    const [folders, setFolders] = useState([]);

    // a simple useEffect to fetch folder data
    useEffect(() => {
        async function fetchFolders(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders`, {
                credentials: 'include',
                mode: 'cors'
            });

            if (!response.ok){
                console.log("An Error Occured:", response)
            } 
            else{
                const data = await response.json();
                console.log(data)
                setFolders(data.folders);
            }
        }
        fetchFolders();
    }, [])

    return (
        <>
            <div className={styles["folder-container"]}>

                <div className={styles["folder-headers"]}>
                    <h1 id={styles["folder-header-title"]}>Folders</h1>
                    <button id={styles['add-folder-btn']} onClick={() => setFolderForm(true)}>
                         Add Folders 
                        <img alt='create new file icon' src='/public/new_folder_icon.svg' />
                    </button>

                    <button id={styles['add-file-btn']} onClick={() => setFileForm(true)}>
                        Add File 
                        <img alt='create new file icon' src='/public/new_file_icon.svg' />
                    </button>

                </div>
                
                <div className={styles["folder-list"]}>
                    {folders.length !== 0 && (
                        folders.map((folder) => (
                            <div className={styles["folder"]} key={folder.id}> 
                                <h2>{folder.folderName}</h2>
                            </div>
                        ))
                    )}
                </div>

                {fileForm && <FileFolderModal formConfigObject={{formType: "File"}} setFileForm={setFileForm} />}
                {folderForm && <FileFolderModal formConfigObject={{formType: "Folder"}} setFolderForm={setFolderForm} />}

                
            </div>
        </>
    )
}