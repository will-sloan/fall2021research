import styles from "./app.module.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { WebcamCapture } from "./WebcamCapture";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

export function WebCam({ index }) {
  const [running, setRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [recordedTime, setRecordedTime] = useState(0);
  const counterRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const timeRef = useRef(null);
  const [label, setLabel] = useState("Camera " + index);

  useEffect(() => {
    // console.log("------------");
    // console.log("here", stopwatchTime, Date.now());
    let date = new Date(1970, 0, 1); // Epoch
    date.setSeconds(stopwatchTime);
    let time = date.toTimeString().split(" ");
    // console.log("time:", time);
    timeRef.current.textContent = time[0];
  }, [stopwatchTime]);

  function startTimer() {
    setRunning("start");
    handleStartCaptureClick();
    counterRef.current = setInterval(() => {
      // console.log("increasing", stopwatchTime + 1);
      setStopwatchTime((prev) => prev + 1);
    }, 1000);
  }
  function pauseTimer() {
    setRecordedTime(Date.now());
    setRunning("stop");
    handleStopCaptureClick();
    clearInterval(counterRef.current);
  }
  function resetTimer() {
    setRunning("reset");
    setStopwatchTime(0);
    handleResetCaptureClick();
  }

  const handleStartCaptureClick = useCallback(() => {
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/x-matroska;codecs:H.264",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, mediaRecorderRef]);

  function getAllSupportedMimeTypes(...mediaTypes) {
    if (!mediaTypes.length) mediaTypes.push(...["video", "audio"]);
    const FILE_EXTENSIONS = ["webm", "ogg", "mp4", "x-matroska"];
    const CODECS = [
      "vp9",
      "vp9.0",
      "vp8",
      "vp8.0",
      "avc1",
      "av1",
      "h265",
      "h.265",
      "h264",
      "h.264",
      "opus",
    ];

    return [
      ...new Set(
        FILE_EXTENSIONS.flatMap((ext) =>
          CODECS.flatMap((codec) =>
            mediaTypes.flatMap((mediaType) => [
              `${mediaType}/${ext};codecs:${codec}`,
              `${mediaType}/${ext};codecs=${codec}`,
              `${mediaType}/${ext};codecs:${codec.toUpperCase()}`,
              `${mediaType}/${ext};codecs=${codec.toUpperCase()}`,
              `${mediaType}/${ext}`,
            ])
          )
        )
      ),
    ].filter((variation) => MediaRecorder.isTypeSupported(variation));
  }

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
  }, [mediaRecorderRef, webcamRef]);

  const handleDownload = useCallback(() => {
    // console.log("downloading ", recordedChunks.length);
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/x-matroska;codecs:H.264",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = recordedTime + "_" + label + ".mkv";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const handleResetCaptureClick = useCallback(() => {
    setRecordedChunks([]);
  }, [recordedChunks]);

  return (
    <div className={styles.WebCamSeg}>
      <div className={styles.videoElement}>
        <WebcamCapture webcamRef={webcamRef} index={index} />
      </div>
      <div className={styles.labelContainer}>
        <InputGroup className={styles.label}>
          <InputGroup.Text id="inputGroup-sizing-default">
            Camera label
          </InputGroup.Text>
          <FormControl
            value={label}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(e) => setLabel(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className={styles.buttons}>
        {running === "start" ? (
          <Button
            className={styles.buttonsSizes}
            variant="danger"
            onClick={pauseTimer}
          >
            Stop Capture
          </Button>
        ) : (
          <Button
            className={styles.buttonsSizes}
            variant={stopwatchTime > 0 ? "warning" : "success"}
            onClick={startTimer}
          >
            {stopwatchTime > 0 ? "Continue" : "Start Capture"}
          </Button>
        )}

        <Button
          className={styles.buttonsSizes}
          variant="primary"
          onClick={() => handleDownload()}
          disabled={stopwatchTime > 0 && running !== "start" ? false : true}
        >
          Download
        </Button>
        <Button
          className={styles.buttonsSizes}
          variant="primary"
          onClick={resetTimer}
          disabled={stopwatchTime > 0 && running !== "start" ? false : true}
        >
          Reset Capture
        </Button>
      </div>
      <p style={{ textAlign: "center" }} ref={timeRef}></p>
    </div>
  );
}
