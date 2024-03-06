import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tus from 'tus-js-client';
import { useLazyGetUploadVideoUrlQuery } from '../onboarding/services/vimeoService';

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
    const [getVideoUrl] = useLazyGetUploadVideoUrlQuery();

    const [uploadLink, setUploadLink] = useState<string>();

    async function onSubmit() {
        //TODO: check if it is recording or video upload
        // based on that I can determine size of the video
        const file: File = new File(recordedChunks, 'videoFileName.webm', { type: 'video/webm' }); // todo: change it later
        const size = 1; // change later
        const linkUrl = await getVideoUrl(size).unwrap();

        await uploadToVimeo(file, linkUrl);
    }

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

    const [blobSize, setBlobSize] = useState(0);

    async function uploadToVimeo(file: File | Blob, uploadUrl: string) {
        // const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        // const videoFile = new File([videoBlob], 'videoFileName.webm', { type: 'video/webm' });

        const upload = new tus.Upload(file, {
            uploadUrl: uploadUrl,
            retryDelays: [0, 1000, 3000, 5000],
            metadata: {
                filetype: file.type,
            },
            onError: (error) => {
                console.log('Failed because: ' + error);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                console.log(bytesUploaded, bytesTotal, `${percentage}%`);
                setUploadProgress(parseFloat(percentage));
            },
            onSuccess: () => {
                console.log('Download %s from %s', upload.file, upload.url);
            },
        });

        upload.start();
    }

    useEffect(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setReplayVideoUrl(url);
            setBlobSize(blob.size);
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

    const [uploadProgress, setUploadProgress] = useState<number>(0);

    return (
        <div>
            <h1>BLOB SIZE: {blobSize}</h1>
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

            <button onClick={onSubmit}>POSALJI TESTIRANJE</button>

            <h2>Upload Progress: {uploadProgress}%</h2>
        </div>
    );
};

export default Recorder;
