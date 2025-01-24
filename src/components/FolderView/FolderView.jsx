// imports
import styles from "./FolderView.module.css"
import { memo, useEffect, useRef, useState } from "react";
import FileFolderContainer from "../FileFolderContainer/FileFolderContainer";
import SelectFolder from "../SelectFolder/SelectFolder";
import { Link, useParams } from "react-router-dom";

// a folder/file view component
export default function FolderView({folders, files, setFolders, setFiles,  selectedFile, setSelectedFile, rootFolderId}){

    // extract the folderId from the route url
    const {folderId} = useParams();

    // a state to manage breadcrumb navigation
    const [breadcrumbs, setBreadcrumbs] = useState([])
    
    const menuRef = useRef([]);
    const [showMenu, setShowMenu] = useState("")

    const [searchData, setSearchData] = useState({type: "", id: null, folder: ""});

    // a simple useEffect to close the menu if a 
    // click anywhere outside the menu is detected when the menu is open
    useEffect(() => {

        const handleClick = (e) => {
            console.log(menuRef)
            const clickedOutsideMenu = menuRef.current.every(
                (menu) => {
                    if (menu == null) return true;
                    return menu && !menu.contains(e.target)
                }
            );
            if (clickedOutsideMenu) setShowMenu(null);
        }

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick)
    }, [menuRef])

    useEffect(() => {
        async function getFolderPathSegements(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/segments/${folderId || rootFolderId}`, {
                credentials: 'include',
                mode: 'cors'
            });
            const data = await response.json();
            if (response.ok){
                setBreadcrumbs([...data.folderSegments])
            }
            
        }
        if (folderId || rootFolderId) getFolderPathSegements(); 
        
    }, [folderId, rootFolderId])
    return (
        <>  

            <nav className={styles["breadcrumbs"]}>
                {breadcrumbs.length !== 0 && breadcrumbs.map(breadcrumb => (
                    <small className={styles["breadcrumb-segment"]}>
                        <Link to={breadcrumb.name === "root" ? `/tree` :  `/tree/${folderId || rootFolderId}/${breadcrumb.id}`}>
                            {breadcrumb.name}
                        </Link>                      
                        <img alt="chevron right icon" src="/public/chevron_right_icon.svg" />
                    </small>
                ))}
            </nav>
            
            <div className={styles["file-folder-header"]}>
                <div className={styles["file-folder-header-right"]}>
                    <p style={{textAlign: "left"}}>Name</p>
                    <p>Size</p> 
                    <p>Created</p>
                    <p>Options</p>
                </div>

            </div>
            <hr />

            {/* {selectedFile && (
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
            )} */}
            <div className={styles["folder-list"]}>
                {folders.length !== 0 && folders.map((folder) => (
                    <FileFolderContainer 
                        key={folder.id}
                        dataType={"Folder"}   
                        setSearchData={setSearchData}
                        data={folder}
                        menuRef={menuRef}
                        dataCollection={folders}
                        setDataCollection={setFolders}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                        rootFolderId={rootFolderId}
                    />
                ))}
            </div>

            <div className={styles["file-list"]}>
                {files.length !== 0 && files.map((file, idx) => (
                    <FileFolderContainer 
                        key={file.id}
                        dataType={"File"}     
                        data={file}
                        setSearchData={setSearchData}
                        menuRef={menuRef}
                        dataCollection={files}
                        setDataCollection={setFiles}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                        rootFolderId={rootFolderId}

                        
                    />
                ))}
            </div>

            {((folders.length == 0 && files.length == 0) && !selectedFile) && 
                <h3 className={styles["no-file-folders-message"]}>
                    Create Folders Or Upload a File Here To View This Folder's Contents.
                </h3>
            }

            {searchData.id &&
                <>
                    
                    <SelectFolder setSearchData={setSearchData} searchData={searchData} rootFolderId={rootFolderId}>
                        
                    </SelectFolder>
                </>

            }
        </>
    )

}