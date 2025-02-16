// imports
import { useState } from "react"
import styles from "./SignupLoginForm.module.css"
import { Link, useNavigate } from "react-router-dom";

// a dynamic form component that renders
// a register form or a login form depending on the 
// formOptions prop passed in
export default function SignupLoginForm({formOptions}){

    const navigate = useNavigate();

    // destructuring the recieved objects for ease of access
    const {formType, linkTo} = formOptions;
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirm_password: ""
    })

    // a simple function to handle input changes
    // and render them correctly
    const handleFormInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    // a simple function that submits the form and registers/login's a user
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_DEVELOPMENT_SERVER}/users/${formType.toLowerCase()}`, {
            method: "POST",
            body: formType.toLowerCase() === "login" ? JSON.stringify({username: formData.username, password: formData.password}): JSON.stringify(formData),
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            mode: 'cors'
        })

        const data = await response.json();
        if (data.status){
            formType === 'Login' ? navigate('/tree') : navigate('/login');
        } else{
            alert("Error")
        }
    }
    
    return (
        <>
            <div className={styles["form-background"]}>
                <div className={styles["form-background-dot-top"]}></div>
                <div className={styles["form-background-dot-bottom"]}></div>

            </div>

            <div className={styles["form-container"]}>
                <div className={styles["form-ui"]}> 

                    <div className={styles["form-header-container"]}>
                        <h1>{formType === "Register" ? "Create" : "Welcome"}</h1>
                        <h1 style={{marginTop: "-40px"}}>{formType === "Register" ? "your" : "back."}</h1>
                        <h1 style={{marginTop: "-40px", color: "#ff5a30"}}>{formType === "Register" ? "account" : "Login To Continue"}.</h1>
                    </div>

                    <form id={styles["form"]} onSubmit={handleFormSubmit}>
                        <div className={styles["form-group"]}>
                            <label htmlFor="username-input" id="username-label">Username</label>
                            <input placeholder="Username" name="username" id="username-input" onChange={handleFormInput}></input>
                        </div>
                        <div className={styles["form-group"]}>
                            <label htmlFor="password-input" id="password-label">Password</label>
                            <input placeholder="Password" name="password" id="password-input" onChange={handleFormInput}></input>
                        </div>

                        {formType === "Register" && <div className={styles["form-group"]}>
                            <label htmlFor="confirm-password-input" id="confirm-password-label">Confirm Password</label>
                            <input placeholder="Confirm Password" name="confirm_password" id="confirm-password-input" onChange={handleFormInput}></input>
                        </div>}

                        <button className={styles["submit-button"]} type="submit">{formType}</button>
                    </form>

                    <div className="form-links">
                        <p>
                            {formType === "Register" ? "Already Have An Account?" : "Don't Have An Account?"} 
                            <Link to={`/${linkTo}`}> {linkTo.charAt(0).toUpperCase() + linkTo.slice(1)} </Link>
                        </p>
                    </div>
                </div>

                <div className={styles["form-ui-image"]}>
                    <img src="/src/assets/art.jpg"  height={"85%"} width={"100%"} style={{borderRadius: "20px"}}></img>
                </div>
            </div>
        </>
    )
}