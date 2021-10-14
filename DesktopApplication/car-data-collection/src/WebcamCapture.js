import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import styles from "./app.module.css";

export const WebcamCapture = ({ webcamRef }) => {
  const [devices, setDevices] = useState([]);
  const [displaySelected, setDisplaySelected] = useState(0);

  return (
    <>
      <WebcamSelector
        devices={devices}
        setDevices={setDevices}
        displaySelected={displaySelected}
        setDisplaySelected={setDisplaySelected}
      />
      {devices && devices.length > 0 && (
        <WebCamVideo camera={devices[displaySelected]} webcamRef={webcamRef} />
      )}
    </>
  );
};

const WebCamVideo = ({ camera, webcamRef }) => {
  return (
    <>
      {camera && (
        <>
          {camera.label || `Unknown`}
          <Webcam
            className={styles.webCamVideo}
            audio={false}
            ref={webcamRef}
            videoConstraints={{ deviceId: camera.deviceId }}
          />
        </>
      )}
    </>
  );
};

const WebcamSelector = ({
  devices,
  setDevices,
  displaySelected,
  setDisplaySelected,
}) => {
  const [deviceId, setDeviceId] = useState({});

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Select Camera">
        {devices.map((device, index) => (
          <Dropdown.Item
            key={"camera-" + index}
            onClick={() => setDisplaySelected(index)}
          >
            {device.label || `Device ${index + 1}`}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </>
  );
};
