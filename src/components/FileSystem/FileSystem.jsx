// imports
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import FolderView from "../FolderView/FolderView";
import MobileMenu from "../MobileMenu/MobileMenu";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./FileSystem.module.css"


// file system component
export default function FileSystem(){

    // a folders and files state that stores a list of
    // folders and files created by the user
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    // a selected file state to display the contents/details of
    // the selected(clicked) file
    const [selectedFile, setSelectedFile] = useState();

    // a rootFolderId state to store the current user's root folder's id
    // to help display the home/root sub-folders
    const [rootFolderId, setRootFolderId] = useState(null);

    // a folderId and fileId parameter from the
    // url path to dynamically fetch and render appropriate
    // files and folder
    let {folderId, fileId} = useParams();

    // a isMobile state to detect changes in screen size
    // and render components accordingly
    const [isMobile, setIsMobile] = useState(false);

    
    // a simple useEffect to fetch the root folder's id for the current user
    useEffect(() => {
        async function getRootFolder(){
            const response = await fetch(`http://localhost:3000/file-system/folders/root`, {
                mode: 'cors',
                credentials: 'include'
            });
            
            const data = await response.json();
            if (response.ok){
                setRootFolderId(data.rootFolderId)
            } else{
                console.log('err')
            }
        }

        getRootFolder();
    }, [rootFolderId])

    // a simple useEffct that fetches all sub-folders of a particular folder
    useEffect(() => {
        async function getFolders(){
            const response = await fetch(`http://localhost:3000/file-system/folders/${folderId || rootFolderId}`, {
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

        if (!fileId && rootFolderId) getFolders();
    }, [JSON.stringify(folders), folderId, rootFolderId])
    
    // a simple useEffect to fetch all the files of a particular folder
    useEffect(() => {
        async function getFiles(){
            const response = await fetch(`http://localhost:3000/file-system/files/${folderId || rootFolderId}`, {
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

        if (!fileId && rootFolderId) getFiles();

    }, [JSON.stringify(files), folderId])

    // a simple useEffect to track the screen size to dynamically
    // render components based on screen size
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

                    {!isMobile && <Sidebar setFiles={setFiles} setFolders={setFolders} rootFolderId={rootFolderId}/>}
                    
                    <div className={styles["file-system-view"]}>
                       <FolderView folders={folders} setFolders={setFolders} files={files} setFiles={setFiles} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/> 
                    </div>
                </div>

                {isMobile && <MobileMenu setFolders={setFolders} setFiles={setFiles} rootFolderId={rootFolderId} />}
            </div>
        </>
    )
}