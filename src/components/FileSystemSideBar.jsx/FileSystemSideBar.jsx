// imports
import styles from './FileSystemSideBar.module.css'

// a file system sidebar component
export default function FileSystemSideBar(){

    return (
        <>
            <div className={styles["folder-container"]}>
                <h1 style={{color: "#ff5a30", textAlign: "center", fontSize: "40px"}}>Folders</h1>
                <div className={styles["folder-list"]}>

                </div>
            </div>
        </>
    )
}