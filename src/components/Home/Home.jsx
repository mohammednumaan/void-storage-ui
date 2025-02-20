// imports
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import FolderView from "../FolderView/FolderView";
import MobileMenu from "../Menus/BottomMenu/BottomMenu";
import styles from "./Home.module.css"
import Loader from "../Loader/Loader";
import HomeSidebar from "../Sidebars/HomeSidebar/HomeSidebar";

// file system component
export default function Home(){

    // a folders and files state that stores a list of
    // folders and files created by the user
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);


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
                console.log("hi")

            } else{
                console.log('err')
            }
        }

        getRootFolder();
    }, [])

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
            } else{
                console.log('err')
            }
        }

        if (!fileId && rootFolderId) getFolders();
    }, [folderId, rootFolderId])
    
    // a simple useEffect to fetch all the files of a particular folder
    useEffect(() => {
        async function getFiles(){
            const response = await fetch(`http://localhost:3000/file-system/files/${folderId || rootFolderId}`, {
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok){
                setFiles([...data.allFiles]);


            } else{
                console.log('err')
            }
        }

        if (!fileId && rootFolderId) getFiles();

    }, [folderId, rootFolderId])

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
            <Loader loading={loading} />
            <div className={styles["file-system-tree"]}>
                <div className={styles["file-system-container"]}>

                    {!isMobile && 
                        <HomeSidebar 
                            setFiles={setFiles} 
                            setFolders={setFolders} 
                            rootFolderId={rootFolderId} 
                            setLoading={setLoading}
                        />
                    }
                    
                    <div className={styles["file-system-view"]}>
                       <FolderView 
                            folders={folders} 
                            setFolders={setFolders} 
                            files={files} 
                            setFiles={setFiles} 
                            rootFolderId={rootFolderId}
                            setLoading={setLoading}
                        /> 
                    </div>
                </div>

                {isMobile && 
                    <MobileMenu 
                        setFolders={setFolders} 
                        setFiles={setFiles} 
                        rootFolderId={rootFolderId} 
                        setLoading={setLoading}
                    />
                }
            </div>
        </>
    )
}