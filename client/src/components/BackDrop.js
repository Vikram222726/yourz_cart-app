import React from "react";
import "./BackDrop.css";
const BackDrop = ({ flipBackDrop }) => {
  return <div className="backdrop" onClick={flipBackDrop}></div>;
};

export default BackDrop;
