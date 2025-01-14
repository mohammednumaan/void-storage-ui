// imports
import { Link, useNavigate, useParams } from "react-router-dom"
import styles from "./FolderView.module.css"
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

// a simple function to convert the file size
// to a human readable format for display purposes
const getFileSize = (bytes) => {
    let sizes = [' Bytes', ' KB', ' MB', ' GB',
        ' TB', ' PB', ' EB', ' ZB', ' YB'];

    for (let i = 1; i < sizes.length; i++){
        if (bytes < Math.pow(1024, i)){
            return (Math.round((bytes / Math.pow(
                1024, i - 1)) * 100) / 100) + sizes[i - 1];
        }

    }
    return bytes;
        
}

// a folder/file view component
export default function FolderView({folders, files, setFolders, setFiles,  selectedFile, setSelectedFile}){

    const navigate = useNavigate();
    const {folderId, fileId} = useParams();

    const [editName, setEditName] = useState("");
    const [editable, setEditable] = useState(null)

    const [showMenu, setShowMenu] = useState("")
    const [height, setHeight] = useState(null);

    const menuRef = useRef([]);

    // a simple useEffect to retrieve file information when a file is clicked
    useEffect(() => {
        async function getFileDetails(){

            const response = await fetch(`http://localhost:3000/file-system/files/file/${folderId}/${fileId}`, {
                mode: 'cors',
                credentials: 'include'
            })

            const data = await response.json();
            console.log(data)
            if (response.ok){
                setFolders([]);
                setFiles([]);
                setSelectedFile(data.file);

            } else{
                console.log('err');
            }

        }
        if (fileId) getFileDetails();
    }, [fileId])
    
    // a simple async function to handle folder deletes
    const handleFolderDelete = async (event, folderId) => {
        event.preventDefault();
        event.stopPropagation()
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: JSON.stringify({folderId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFolders = folders.filter(folder => folder.id !== folderId)
            setFolders(prev => ([...updatedFolders]));
        }
        else{
            console.log('err')
        }

    }

    // a simple async function to handle file deletes
    const handleFileDelete = async (event, fileId) => {
        event.preventDefault();
        event.stopPropagation()
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',   
            body: JSON.stringify({fileId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFiles = files.filter(file => file.id !== fileId)
            console.log(updatedFiles)
            setFiles(prev => ([...updatedFiles]));
        }
        else{
            console.log('err')
        }

    }

    // a simple async function to handle folder edits
    const handleFolderEdit = async (event, folderId) => {
        event.preventDefault();
        
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: JSON.stringify({folderName: editName, folderId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFolders = folders.filter(folder => folder.name === editName)
            setFolders(prev => ([...updatedFolders]));
            setEditName("");
            setEditable(false);
        }
        else{
            console.log('err')
        }
    }

    // a simple async function to handle file edits
    const handleFileEdit = async (event, fileId) => {
        event.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: JSON.stringify({fileName: editName, fileId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedFiles = files.filter(file => file.name === editName)
            setFiles(prev => ([...updatedFiles]));
            setEditName("");
            setEditable(false);
        }
        else{
            console.log('err')
        }
    }      
    
    // a simple function to close the edit input
    const closeEditInput = () => {
        setEditable(false);
        setEditName("");
    }

    // a simple function to handle input change
    // for renaming a file/folder
    const handleRenameChange = (event) => {
        setEditName(event.target.value)
    }    

    const handleMenuClick = (event, id) => {

        // retrieve the current folder container
        // and its dimensional properties
        const container = event.currentTarget;
        const { top, height } = container.getBoundingClientRect();

        // check if the click is on the same folder
        // if true, we close the menu else, we close
        // the old menu and open the menu for the new folder
        if(id !== showMenu){
            setShowMenu(id)
            setHeight(`${top + height - 16}px`)
        } else{
            setShowMenu(null)
        }
    }

    // a simple useEffect to close the menu if a 
    // click anywhere outside the menu is detected when the menu is open
    useEffect(() => {
        const handleClick = (e) => {

            const clickedOutsideMenu = menuRef.current.every(
                (menu) => {
                    return menu && !menu.contains(e.target)
                }
            );
            if (clickedOutsideMenu) setShowMenu(null);
        }

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick)
    }, [menuRef])

    return (
        <>
            <div className={styles["folder-details-header"]}>

                <div className={styles["folder-details-right"]}>
                    <p style={{textAlign: "left"}}>Folder/File Name</p>
                    <p>Size</p> 
                    <p>Created At</p>
                    <p>Options</p>
                </div>

            </div>
            <hr />

            {selectedFile && (
                <div className={styles["file-view-container"]}>

                    <div className={styles["file-view-details"]} title="File Details">
                        <div className={styles["file"]}>

                            <div className={styles["file-left"]}>
                                <img alt="file icon" src="/public/file_icon.svg"></img>
                                <p>{selectedFile.fileName}</p>
                            </div>

                            <div className={styles["file-right"]}>

                                <div className={styles["file-right-size"]}>
                                    <p id={styles["file-size"]}>{getFileSize(selectedFile.fileSize)}</p>
                                </div>
                                <p>{format(selectedFile.createdAt, 'dd/MM/yyyy')}</p>

                                <div className={styles["file-right-options"]}>
                                    <img title="Confirm Rename" alt="file delete icon" src="/public/folder_delete_icon.svg"></img>
                                    <img title="Cancel Rename" alt="file edit icon" src="/public/folder_edit_icon.svg"></img>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className={styles["file-view"]}>
                    </div>
                    <div className={styles["file-view-options"]}>
                        <button>Download File</button>
                        <button>View File</button>

                    </div>

                </div>
            )}
            {folders.length !== 0 && folders.map((folder, idx) => (
                <Link key={folder.id} className={styles["folder-container"]} onDoubleClick={() => navigate(`/tree/${folderId || 'root'}/${folder.id}`)}  >
                    <div className={styles["folder"] }>

                        <div className={styles["folder-left"]}>
                            <img src="/public/folder_open_icon.svg" alt="folder icon"></img>
                            {editable == folder.id ? 

                            <div className={styles["edit-input-container"]}>
                                <input value={editName} onChange={handleRenameChange} id={styles["edit-input"]} type="text" name="rename" placeholder="Click To Rename..." /> 

                                <div className={styles["edit-options"]}>
                                    <img id={styles["confirm-rename-btn"]} src="/public/tick_icon.svg" alt="rename confirm button" onClick={(e) => handleFolderEdit(e, folder.id)} />
                                    <img id={styles["confirm-rename-btn"]} src="/public/close_icon.svg" alt="rename cancel button" onClick={closeEditInput} />
                                </div>    
                                                     
                            </div>
                            : <p style={{textOverflow: "ellipsis"}}>{folder.folderName}</p>}
                        </div>

                        <div className={styles["folder-right"]}>

                                <p id={styles["folder-right-size"]}>-</p>
                                <p id={styles["folder-right-created"]}>{format(folder.createdAt, 'dd/MM/yyyy')}</p>
                                <img id={styles["folder-options"]}ref={(el) => menuRef.current[idx] = el} onClick={(e) => handleMenuClick(e, folder.id)} title="More Options" src="/public/more_options_icon.svg" alt="more options icon"></img>
                                <div className={styles["folder-menu"]} style={{top: "10em"}}>
                                    <ul className={`${styles.menu} ${showMenu === folder.id ? styles.open : ''}`} style={{top: height}}>
                                    <li>
                                        <button className={styles["menu-item-btn"]} onClick={(e) => handleFolderDelete(e, folder.id)}>
                                        <img alt="folder delete icon" src="/public/folder_delete_icon.svg" title="Delete Folder" />
                                        Delete Folder
                                        </button>
                                    </li>
                                    <hr style={{backgroundColor: "white", width: "100%", height: "1px", opacity: 0.1, marginTop: "1px"}} />
                                    <li>
                                        <button className={styles["menu-item-btn"]} onClick={() => setEditable(folder.id)}>
                                        <img alt="folder edit icon" src="/public/folder_edit_icon.svg" title="Edit Folder" />
                                        Rename Folder
                                        </button>
                                    </li>
                                    </ul>
                                </div>
                        </div>
                    </div>
                </Link>
            ))}

        {files.length !== 0 && files.map(file => (
                <Link key={file.id} className={styles["file-container"]} onDoubleClick={() => navigate(`/tree/file/${file.folderId}/${file.id}`)}>
                    <div className={styles["file"]}>

                        <div className={styles["file-left"]}>
                            <img alt="file icon" src="/public/file_icon.svg"></img>
                            {editable == file.id ? 

                            <div className={styles["edit-input-container"]}>
                                <input value={editName} onChange={handleRenameChange} id={styles["edit-input"]} type="text" name="rename" placeholder="Click To Rename..." /> 

                                <div className={styles["edit-options"]}>
                                    <img id={styles["confirm-rename-btn"]} src="/public/tick_icon.svg" alt="rename confirm button" onClick={(e) => handleFileEdit(e, file.id)} />
                                    <img id={styles["confirm-rename-btn"]} src="/public/close_icon.svg" alt="rename cancel button" onClick={closeEditInput} />
                                </div>    
                                                     
                            </div>
                            : <p style={{textAlign: "left" ,overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "16rem"}}>{file.fileName}</p>}
                        </div>

                        <div className={styles["file-right"]}>

                            <div className={styles["file-right-size"]}>
                                <p className={styles["file-size"]}>{getFileSize(file.fileSize)}</p>
                            </div>
                            <p>{format(file.createdAt, 'dd/MM/yyyy')}</p>

                            <div className={styles["file-right-options"]}>
                                <img alt="file delete icon" src="/public/folder_delete_icon.svg" onClick={(e) => handleFileDelete(e, file.id)}></img>
                                <img alt="file edit icon" src="/public/folder_edit_icon.svg" onClick={() => setEditable(file.id)}></img>
                            </div>

                        </div>
                    </div>
                </Link>
            ))}

        {((folders.length == 0 && files.length == 0) && !selectedFile) && <h3 className={styles["no-file-folders-message"]}>Create Folders Or Upload a File Here To View This Folder's Contents.</h3>}
        </>
    )

}