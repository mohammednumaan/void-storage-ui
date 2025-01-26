

import styles from "./Loader.module.css"
import React from "react";

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
