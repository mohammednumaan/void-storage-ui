// imports
import NavigationBar from '../Navigation/NavigationBar';
import styles from './LandingPage.module.css'
import { Link } from "react-router-dom";

// a home component
export default function LandingPage(){
    return (
        <>  

            <div className={styles["header"]}>
                <div className={styles["header-container"]}>
                    <NavigationBar isHome={true} />
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
                    <h2 style={{marginTop: '-14px', color: 'gray'}}>A Mini File Storage Platform</h2>

                    <div className={styles["get-started-links"]}>
                        <Link to='/register'>
                            <button>
                                Register &rarr;
                            </button>
                        </Link>
                        <Link to='/login'>
                            <button>
                                Login &rarr;
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    )
}