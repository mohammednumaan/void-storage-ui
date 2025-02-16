// imports
import React from "react";
import styles from "./Loader.module.css"

// a simple "indeterminate" loader component that runs 
// at the top of the screen
export default function Loader({ loading }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "99.5%",
        height: "5px",
        zIndex: 5,
        top: "0px",
        overflowX: "hidden"
      }}
    >
      <div className={loading ? `${styles["animated-div"]}` : ""} />
    </div>
  );
}
