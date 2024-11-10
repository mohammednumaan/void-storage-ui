// imports
import NavigationBar from '../NavigationBar/NavigationBar';
import styles from './Home.module.css'
import { Link } from "react-router-dom";

// a home component
export default function Home(){
    return (
        <>  

            <div className={styles["header"]}>
                <div className={styles["header-container"]}>
                    <NavigationBar />
                </div>
            </div>

            <div className={styles["get-started"]}>

                <div className={styles["home-background"]}>
                    <div className={styles["home-background-dot-top"]}></div>
                    <div className={styles["home-background-dot-bottom"]}></div>
                </div>

                <div className={styles["get-started-container"]}>

                    <div className={styles["get-started-header"]}>
                        <h1>Void</h1>
                        <h1 id={styles["header-text-two"]}>Storage</h1>
                    </div>

                    <h4>A Mini File Storage Platform</h4>
                    <div className={styles["get-started-links"]}>
                        <Link to='/register'>Register</Link>
                        <Link to='/login'>Login</Link>
                    </div>
                </div>

            </div>
        </>
    )
}