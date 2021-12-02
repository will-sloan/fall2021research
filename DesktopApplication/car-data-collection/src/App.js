import styles from "./app.module.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { WebcamCapture } from "./WebcamCapture";
import { WebCam } from "./WebCam";
import Button from "react-bootstrap/Button";

function App() {
  return (
    <div className={styles.App}>
      <WebCam index={1} />
      <WebCam index={2} />
    </div>
  );
}

export default App;
