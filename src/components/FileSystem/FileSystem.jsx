// imports
import { useParams } from "react-router-dom"
import styles from "./FileSystem.module.css"
import { useState } from "react";
import FolderView from "../FolderView/FolderView";
import { useEffect } from "react";
import FileSystemSideBar from "../FileSystemSideBar/FileSystemSideBar";
import MobileSideBar from "../MobileSideBar/MobileSideBar";


// file system component
export default function FileSystem(){

    // a folders and files state that stores a list of
    // folders and files created by the user
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    // a selected file state to display the contents/details of
    // the selected(clicked) file
    const [selectedFile, setSelectedFile] = useState();

    // a folderId and fileId parameter from the
    // url path to dynamically fetch and render appropriate
    // files and folder
    const {folderId, fileId} = useParams();

    // a isMobile state to detect changes in screen size
    // and render components accordingly
    const [isMobile, setIsMobile] = useState(false);
    
    // a simple useEffect to fetch the sub-folders located
    // in the folder with id as folderId
    useEffect(() => {
        async function getFolders(){
            const response = await fetch(`http://localhost:3000/file-system/folders/${folderId || "root"}`, {
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok){
                setFolders([...data.folders]);
                setSelectedFile(null);
            } else{
                console.log('err')
            }
        }

        if (!fileId) getFolders();
    }, [JSON.stringify(folders), folderId])
    
    // a simple useEffect to fetch the files located
    // in the older with id as folderId

    useEffect(() => {
        async function getFiles(){
            const response = await fetch(`http://localhost:3000/file-system/files/${folderId || 'root'}`, {
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok){
                setFiles([...data.files]);
                setSelectedFile(null);

            } else{
                console.log('err')
            }
        }

        if (!fileId) getFiles();

    }, [JSON.stringify(files), folderId])

    // a simple useEffect to track the screen size
    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth < 1100){
                setIsMobile(true);
            } else{
                setIsMobile(false);
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize();
        return () => window.removeEventListener('resize', handleResize);

    }, [])

    return (
        <>
            <div className={styles["file-system-tree"]}>
                <div className={styles["file-system-container"]}>

                    {!isMobile && <FileSystemSideBar setFiles={setFiles} setFolders={setFolders} />}
                    <div className={styles["file-system-view"]}>
                       <FolderView folders={folders} setFolders={setFolders} files={files} setFiles={setFiles} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/> 
                    </div>
                </div>

                {isMobile && 
                    <div className={styles["mobile-sidebar"]}>
                        <MobileSideBar />
                    </div>
                }
            </div>
        </>
    )
}