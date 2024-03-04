import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Recorder = () => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder>();
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [replayVideoUrl, setReplayVideoUrl] = useState<string>('');

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDevice(videoDevices[0].deviceId);
            }
        });
    }, []);

    const handleStartCaptureClick = () => {
        setCapturing(true);
        setRecordedChunks([]);
        setReplayVideoUrl('');
        const options = {
            mimeType: 'video/webm',
            videoBitsPerSecond: 550000, // Lower bitrate for smaller size
        };
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current!.stream!, options);
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorderRef.current.start();
        const id = setInterval(() => setTimer((t) => t + 1), 1000);
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

    async function sendRecordedChunks() {
        const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoFile = new File([videoBlob], 'videoFileName.webm', { type: 'video/webm' });

        const formData = new FormData();
        formData.append('file_data', videoFile);

        const res = await fetch(
            'https://1512435583.cloud.vimeo.com/upload?ticket_id=901701419&video_file_id=3719908543&signature=ff5801e879dc269a2eb704f691d4c281&v6=1&redirect_url=https%3A%2F%2Fvimeo.com%2Fupload%2Fapi%3Fvideo_file_id%3D3719908543%26app_id%3D283492%26ticket_id%3D901701419%26signature%3Df187687c1160f716259e4a15e326a7474cb102f2%26redirect%3Dhttps%253A%252F%252Fwww.teorem.co',
            {
                body: formData,
                method: 'POST',
            }
        );
        console.log(res);
    }

    useEffect(() => {
        if (recordedChunks.length) {
            console.log('inside');
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            console.log(url);
            setReplayVideoUrl(url);
        } else {
            console.log('failed IF statement');
        }
    }, [recordedChunks]);

    const handleDownload = () => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setReplayVideoUrl(url);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = 'recorded-video.webm';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return (
        <div>
            <Webcam audio={true} ref={webcamRef} videoConstraints={{ deviceId: selectedDevice }} />
            <select onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
                {devices.map((device) => (
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

            <button onClick={sendRecordedChunks}>POSALJI TESTIRANJE</button>

            <div className={'background-blue'}>
                <form
                    method="POST"
                    action="https://1512435599.cloud.vimeo.com/upload?ticket_id=901698075&video_file_id=3719905077&signature=714fb8b992bd7ece027bea0fc35e4800&v6=1&redirect_url=https%3A%2F%2Fvimeo.com%2Fupload%2Fapi%3Fvideo_file_id%3D3719905077%26app_id%3D283492%26ticket_id%3D901698075%26signature%3D7e519b085b67e07785b2a3516e8c11198c413d27%26redirect%3Dhttps%253A%252F%252Fwww.teorem.co"
                    encType="multipart/form-data"
                >
                    <label htmlFor="file">File:</label>
                    <input type="file" name="file_data" id="file" />
                    <br />
                    <input type="submit" name="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
};

export default Recorder;
