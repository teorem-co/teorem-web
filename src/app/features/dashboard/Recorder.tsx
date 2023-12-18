import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const Recorder = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [replayVideoUrl, setReplayVideoUrl] = useState<string>("");

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    });
  }, []);

  const handleStartCaptureClick = () => {
    setCapturing(true);
    setRecordedChunks([]);
    setReplayVideoUrl("");
    const options = {
      mimeType: "video/webm",
      videoBitsPerSecond: 550000 // Lower bitrate for smaller size
    };
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current!.stream!, options);
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    setIntervalId(id);
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      setRecordedChunks((prev) => prev.concat(event.data));
    }
  };

  const handleStopCaptureClick = () => {
    mediaRecorderRef.current!.stop();
    setCapturing(false);
    if (intervalId) clearInterval(intervalId);
    setTimer(0);


  };

  useEffect(() => {
    if (recordedChunks.length) {
      console.log('inside');
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      console.log(url);
      setReplayVideoUrl(url);
    }else{
      console.log('failed IF statement');
    }
  }, [recordedChunks]);


  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setReplayVideoUrl(url);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <Webcam
        audio={true}
        ref={webcamRef}
        videoConstraints={{ deviceId: selectedDevice }}
      />
      <select onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
      {capturing ? (
        <div>
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
          <span>Recording Time: {timer} seconds</span>
        </div>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <div>
          <button onClick={handleDownload}>Download</button>
          <video src={replayVideoUrl} controls></video>
        </div>
      )}
    </div>
  );
};

export default Recorder;
