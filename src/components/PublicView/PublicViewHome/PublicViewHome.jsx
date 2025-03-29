import { useEffect, useState } from "react";
import PublicView from "../PublicView/PublicView";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../Navigation/NavigationBar";
import styles from "../../FolderView/FolderView.module.css"


export default function PublicViewHome(){
    
    const navigate = useNavigate();
    const {linkId, folderId} = useParams();
    
    const [resource, setResource] = useState({type: null, id: null, name: null})
    const [isOpenDetails, setIsOpenDetails] = useState({fileId: null});

    const [breadcrumbs, setBreadcrumbs] = useState([])


    useEffect(() => {
        async function getSharedResource(){
            const res = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/view/public/${linkId}/`, {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({linkId, type: "Folder"})
                
            });

            const data = await res.json();
            if (res.ok){
                setResource({type: data.type, id: data.id});
            } else{
                navigate('/view/public/error', {state: {error: data.message}})
            }
        }

        getSharedResource();
    }, [isOpenDetails, breadcrumbs])  

    useEffect(() => {
        async function getFolderPathSegements(){
            const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/segments/${resource.id}/${folderId}`, {
                mode: 'cors'
            });
            const data = await response.json();
            if (response.ok){   
                console.log(data)
                const segments = data.folderSegments;
                setBreadcrumbs([...segments])    
            } else{
                console.error(data.message);
            }
            
        }

        if (folderId && resource.id) getFolderPathSegements(); 
        
    }, [folderId, resource.id])

    return (
        <>
            <NavigationBar />
            <nav className={styles["breadcrumbs"]}>
                <small className={styles["breadcrumb-segment"]}>
                    <Link to={`/view/public/folder/${linkId}`}>
                        {resource.name}
                    </Link>  
                </small>                    
                {breadcrumbs.length !== 0 && breadcrumbs.map(breadcrumb => (
                    <>
                        <small key={breadcrumb.id} className={styles["breadcrumb-segment"]}>
                            <Link to={`/view/public/folder/${linkId}/${folderId}/${breadcrumb.id}`}>
                                {breadcrumb.name}
                            </Link>                      
                            <img alt="chevron right icon" src="/public/chevron_right_icon.svg" />
                        </small>
                    </>
                ))}
            </nav>
        
            <PublicView resource={resource} linkId={linkId} isOpenDetails={isOpenDetails} setIsOpenDetails={setIsOpenDetails}/>
        </>
    )
}