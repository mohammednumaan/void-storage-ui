import styles from "./MobileSideBar.module.css"
// onClick={/* () => setFolderForm(true)*/}
// onClick={() => setFileForm(true)}

export default function MobileSideBar({setFolderForm, setFileForm}){
    return (

        <>
            <div className={styles["mobile-sidebar-container"]}>
                <div className={styles["mobile-file-options"]}>
                    <button id={styles['add-folder-btn']}>
                        <img alt='create new file icon' src='/public/new_folder_icon.svg' title='Create Folder' />
                    </button>

                    <button id={styles['add-file-btn']}>
                        <img alt='create new file icon' src='/public/new_file_icon.svg' title='Upload File'/>
                    </button>
                </div>
            </div>
        
        </>
    )
}