import styles from "./FileDetailsView.module.css"
export default function FileDetailsView({file}){

    return (
        <>

            <div className={styles["file-details"]}>
                <small>{file.fileName}</small>
                <small>{file.fileSize}</small>
                {/* <small>{file.}</small> */}

            </div>
            <div className={styles["file-preview"]}>
                <img src={file.fileUrl} />
            </div>
        </>
    )

}