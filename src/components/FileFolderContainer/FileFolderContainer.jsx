//  imports


import { useState } from "react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";

import styles from "./FileFolder.module.css"

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
// a dynamic component that renders both files and folders
export default function FileFolderContainer({dataType, data, menuRef, dataCollection, setDataCollection, idx}){

    // extract the folder and file id from the url
    const {folderId, fileId} = useParams;

    // states to handle rename/edit operations
    const [editName, setEditName] = useState("");
    const [editable, setEditable] = useState(null);

    const [showMenu, setShowMenu] = useState("")
    const [height, setHeight] = useState(null);


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


    const handleDataEdit = async (event, dataId) => {
        event.preventDefault();
        
        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${dataType === "Folder" ? 'folders' : 'files'}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},  
            mode: 'cors',   
            body: (dataType === "Folder") 
                ? JSON.stringify({newFolderName: editName, folderId: dataId})
                : JSON.stringify({newFileName: editName, fileId: dataId}),
            credentials: 'include'
        })

        if (response.ok){
            const updatedData = dataCollection.filter(data => data.name === editName);
            setDataCollection((_) => [...updatedData]);
            setEditName("");
            setEditable(false);
        }
        else{
            console.log('err')
        }
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

     
    return (
        <>
            <Link key={data.id} 
                className={styles["file-folder-container"]} 
                onDoubleClick={() => navigate(`/tree/${folderId}/${data.id}`)} 
             >
                <div className={styles["file-folder"] }>

                    <div className={styles["file-folder-left"]}>
                        {dataType === "Folder" ? <img src="/public/folder_open_icon.svg" alt="folder icon" />
                            : <img src="/public/file_icon.svg" alt="file icon" />
                        }       

                        {editable == data.id ? (

                            <div className={styles["file-folder-edit-input"]}>
                                <input value={editName} 
                                    onChange={handleRenameChange} 
                                    id={styles["edit-input"]} 
                                    type="text" name="rename" 
                                    placeholder="Click To Rename..." 
                            /> 

                                <div className={styles["file-folder-edit-options"]}>
                                    <img id={styles["confirm-rename-btn"]} 
                                        src="/public/tick_icon.svg" alt="rename confirm button" 
                                        onClick={(e) => handleFolderEdit(e, data.id)} />
                                    <img id={styles["confirm-rename-btn"]} 
                                        src="/public/close_icon.svg" alt="rename cancel button" 
                                        onClick={closeEditInput} />
                                </div>    
                                                    
                            </div>

                        ) : (
                         <p style={{textOverflow: "ellipsis"}}>{dataType ==="Folder" ? data.folderName : data.fileName}</p>
                        )}
                    </div>

                    <div className={styles["file-folder-right"]}>

                            <p className={styles["file-folder-size"]}>{dataType === "Folder" ? '-' : getFileSize(data.fileSize)}</p>
                            <p className={styles["file-folder-created"]}>{format(data.createdAt, 'dd/MM/yyyy')}</p>
                            <img className={styles["file-folder-options"]} ref={(el) => menuRef.current[idx] = el} 
                                onClick={(e) => handleMenuClick(e, data.id)} 
                                title="More Options" 
                                src="/public/more_options_icon.svg" 
                                alt="more options icon" 
                            />
                         
                            <DropdownMenu 
                                dataType={dataType} 
                                dataId={data.id} 
                                setEditable={setEditable} 
                                showMenu={showMenu} 
                                dataCollection={dataCollection}
                                setDataCollection={setDataCollection}
                                height={height} 
                            />
                    </div>
                </div>
            </Link>
        </>

    )
}