// imports
import { useOutletContext } from "react-router-dom"

// file system component
export default function FileSystem(){

    // this hook retrieves the passed value (as a prop)
    // from the outlet component, in this case its the username
    const username = useOutletContext();
    return (
        <>
            <h1>File System</h1>
            <p>Welcome {username}!</p>
        </>
    )
}