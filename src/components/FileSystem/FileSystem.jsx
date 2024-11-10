// imports
import { useOutletContext } from "react-router-dom"
import styles from "./FileSystem.module.css"
import FileSystemSideBar from "../FileSystemSideBar/FileSystemSideBar";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useState } from "react";
import FolderView from "../FolderView/FolderView";

// file system component
export default function FileSystem(){

    // modal states to render the appropriate forms
    const [fileForm, setFileForm] = useState(false);
    const [folderForm, setFolderForm] = useState(false); 


    // this hook retrieves the passed value (as a prop)
    // from the outlet component, in this case its the username
    const username = useOutletContext();

    return (
        <>
            <div className={styles["file-system-tree"]}>
                <div>
                    <NavigationBar />
                </div>

                <div className={styles["file-system-container"]}>
                    <FileSystemSideBar />

                    <div className={styles["file-system-view"]}>
                       <FolderView /> 
                    </div>
                </div>

            </div>
        </>
    )
}