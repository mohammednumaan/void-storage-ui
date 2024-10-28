// imports
import { useOutletContext } from "react-router-dom"
import styles from "./FileSystem.module.css"
import FileSystemSideBar from "../FileSystemSideBar.jsx/FileSystemSideBar";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useState } from "react";


// file system component
export default function FileSystem(){

    // a file state to store the uploaded file
    const [file, setFile] = useState(null);

    // a simple function to handle input change
    // for the file-input field
    const handleFileInput = (e) => {
        setFile(e.target.files[0]);
    }

    // a simple async functiont o handle submission
    // of the 'add file' form
    const handleFileSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3000/file-system/files", {
            method: "POST",
            body: formData,
            credentials: "include",
            mode: "cors",
        })

        const data = await response.json();
    }

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
                        <form onSubmit={handleFileSubmit} encType="multipart/form-data">
                            <label htmlFor="file" id="file-label">Add File</label>
                            <input onChange={handleFileInput} type="file" id="file-input" name="file" />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    
                </div>
                
            </div>
        </>
    )
}