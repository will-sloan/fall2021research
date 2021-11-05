import styles from "./app.module.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { WebcamCapture } from "./WebcamCapture";
import Button from "react-bootstrap/Button";

function App() {
  const [running, setRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const counterRef = useRef(null);
  const webcamRef = useRef(null);
  const webcamRef2 = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaRecorderRef2 = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedChunks2, setRecordedChunks2] = useState([]);

  useEffect(() => {
    console.log("------------");
    console.log("here", stopwatchTime, Date.now());
    let date = new Date(1970, 0, 1); // Epoch
    date.setSeconds(stopwatchTime);
    let time = date.toTimeString();
    document.querySelector(".clock").textContent = time;
  }, [stopwatchTime]);

  function startTimer() {
    setRunning("start");
    handleStartCaptureClick();
    counterRef.current = setInterval(() => {
      console.log("increasing", stopwatchTime + 1);
      setStopwatchTime((prev) => prev + 1);
    }, 1000);
  }
  function pauseTimer() {
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
    mediaRecorderRef2.current = new MediaRecorder(webcamRef2.current.stream, {
      mimeType: "video/x-matroska;codecs:H.264",
    });
    mediaRecorderRef2.current.addEventListener(
      "dataavailable",
      handleDataAvailable2
    );
    mediaRecorderRef2.current.start();
  }, [webcamRef, mediaRecorderRef, mediaRecorderRef2, webcamRef2]);

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
  const handleDataAvailable2 = useCallback(
    ({ data }) => {
      console.log("data: ", data);
      if (data.size > 0) {
        setRecordedChunks2((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks2]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef2.current.stop();
  }, [mediaRecorderRef, webcamRef, mediaRecorderRef2, webcamRef2]);

  const handleDownload = useCallback(() => {
    console.log("downloading ", recordedChunks.length);
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/x-matroska;codecs:H.264",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = Date.now() + "aPillarCameraRecording" + ".mkv";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
    if (recordedChunks2.length) {
      const blob = new Blob(recordedChunks2, {
        type: "video/x-matroska;codecs:H.264",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = Date.now() + "mirrorCameraRecording" + ".mkv";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks, recordedChunks2]);

  const handleResetCaptureClick = useCallback(() => {
    setRecordedChunks([]);
    setRecordedChunks2([]);
  }, [recordedChunks, recordedChunks2]);

  return (
    <div className="App">
      <div className={styles.elementsContainer}>
        <div className={styles.videoElement}>
          <WebcamCapture webcamRef={webcamRef} />
        </div>
        <div className={styles.videoElement}>
          <WebcamCapture webcamRef={webcamRef2} />
        </div>
      </div>

      <div className={styles.buttons}>
        {running === "start" ? (
          <Button variant="danger" onClick={pauseTimer}>
            Stop Capture
          </Button>
        ) : (
          <Button variant="success" onClick={startTimer}>
            {stopwatchTime > 0 ? "Continue" : "Start Capture"}
          </Button>
        )}

        <Button
          variant="primary"
          onClick={() => handleDownload()}
          disabled={stopwatchTime > 0 && running !== "start" ? false : true}
        >
          Download
        </Button>
        <Button
          variant="primary"
          onClick={resetTimer}
          disabled={stopwatchTime > 0 && running !== "start" ? false : true}
        >
          Reset Capture
        </Button>
      </div>
      <p style={{ textAlign: "center" }} className="clock"></p>
    </div>
  );
}

export default App;
