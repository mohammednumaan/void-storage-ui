// imports
import { Link } from "react-router-dom"
import styles from "./NavigationBar.module.css"

// navigation bar component
export default function NavigationBar(){
    return (
        <>
            <div className={styles["navbar-container"]}>
                <div className={styles["navbar-header"]}>
                    <h4>Void</h4>
                    <h4 id={styles["header-text-two"]}>Storage</h4>
                </div>

                <div className={styles["navbar-links"]}>
                <Link to='/register'>Register</Link>
                <Link to='/login'>Login</Link>
                </div>
            </div>
        </>
    )
}