import { Link, useLocation } from "react-router-dom"

export default function AccessErrorPage(){
    const {state} = useLocation();
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "90vh"}}>
            <h2>{state.error}</h2>
            <Link to={'/'}>
                <button style={{color: "#ff5a30", width: "300px"}}>
                    Home &rarr;
                </button>
            </Link>
        </div>
    )
}