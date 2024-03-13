import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useLazyGetUploadVideoUrlQuery } from '../../onboarding/services/vimeoService';
import { uploadToVimeo } from './uploadToVimeo';
import { SyncLoader } from 'react-spinners';
import { VscDebugStart, VscDebugStop } from 'react-icons/vsc';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { t } from 'i18next';
import MicrophoneTest from '../../dashboard/MicrophoneTest';
import moment from 'moment';

interface Props {
    className?: string;
    triggerSuccess: () => void;
    onClose: () => void;
}

export const VideoRecorder = (props: Props) => {
    const { className, triggerSuccess, onClose } = props;
    const webcamRef = useRef<Webcam>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
    const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedMicrophoneDevice, setSelectedMicrophoneDevice] = useState<string>('');
    const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [showPermissionsErrorMessage, setShowPermissionsErrorMessage] = useState(false);

    const [showLoader, setShowLoader] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);

    const [getVideoUrl] = useLazyGetUploadVideoUrlQuery();
    const [capturing, setCapturing] = useState(false);
    const [replayVideoUrl, setReplayVideoUrl] = useState<string>('');
    const mediaRecorderRef = useRef<MediaRecorder>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [timer, setTimer] = useState(0);

    async function onSubmit() {
        if (recordedChunks.length === 0) return;
        if (webcamRef.current && webcamRef.current.stream) {
            console.log('INSIDE IF IN SUBMIT');
            webcamRef.current.stream.getTracks().forEach((track) => track.stop());
        }
        const file: File = new File(recordedChunks, 'video.webm', { type: 'video/webm' }); // todo: change it later
        const size = file.size; // change later
        setShowLoader(true);
        const linkUrl = await getVideoUrl(size).unwrap();
        setShowLoader(false);
        setShowProgressBar(true);

        await uploadToVimeo(file, linkUrl, setUploadProgress, triggerSuccess, webcamRef.current);
    }

    const cleanup = () => {
        // Stop all tracks
        if (webcamRef.current && webcamRef.current.stream) {
            webcamRef.current.stream.getTracks().forEach((track) => track.stop());
        }

        onClose(); // Assuming this calls the passed onClose prop to notify parent components.
    };

    useEffect(() => {
        const updateDevices = () => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                setVideoDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedVideoDevice(videoDevices[0].deviceId);
                }

                const audioDevices = devices.filter((device) => device.kind === 'audioinput');
                setMicrophoneDevices(audioDevices);
                if (audioDevices.length > 0) {
                    setSelectedMicrophoneDevice(audioDevices[0].deviceId);
                }
            });
        };

        // Try to get user media to prompt for permission
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(updateDevices)
            .catch((error) => {
                console.error('Error accessing media devices:', error);
                setShowPermissionsErrorMessage(true);
            });
    }, []);

    useEffect(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setReplayVideoUrl(url);
        }
    }, [recordedChunks]);

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
            setRecordedChunks((prev) => prev.concat(event.data));
        }
    };

    const handleStartCaptureClick = async () => {
        setCapturing(true);
        setRecordedChunks([]);
        setReplayVideoUrl('');

        try {
            // Request the media streams from the specified devices
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: selectedVideoDevice } },
                audio: { deviceId: { exact: selectedMicrophoneDevice } }, // Assuming selectedMicrophoneDevice is defined
            });

            // Here, the stream includes both video and audio from the specified devices
            webcamRef.current!.stream! = stream;

            const options = {
                mimeType: 'video/webm',
                videoBitsPerSecond: 550000, // Lower bitrate for smaller size
            };

            mediaRecorderRef.current = new MediaRecorder(stream, options);
            mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
            mediaRecorderRef.current.start();

            // Timer setup
            const id = setInterval(() => setTimer((t) => t + 1), 1000);
            setIntervalId(id);
        } catch (error) {
            console.error('Error accessing media devices:', error);
            // Handle errors (e.g., user denied access to devices)
        }
    };

    const handleStopCaptureClick = () => {
        mediaRecorderRef.current!.stop();
        setCapturing(false);
        if (intervalId) clearInterval(intervalId);
        setTimer(0);
    };

    useEffect(() => {
        if (timer > 119 && capturing) {
            handleStopCaptureClick();
        }
    }, [timer]);

    function restartRecording() {
        handleStopCaptureClick();

        //wait for mediaRecorder to finish
        setTimeout(() => {
            setRecordedChunks([]);
            setReplayVideoUrl('');
            setIntervalId(null);
            setCapturing(false);
        }, 1000);
    }

    function formatTime(seconds: number): string {
        const duration = moment.duration(seconds, 'seconds');
        const minutes = duration.minutes();
        const remainingSeconds = duration.seconds();

        // Format minutes and seconds to ensure it always shows two digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <>
            <div className={className}>
                <div className="flex flex--row flex--jc--space-between">
                    <div className="flex flex--col w--50">
                        {showPermissionsErrorMessage && (
                            <div className={'w--100 type--color--error flex flex--row'}>
                                <i className={'icon icon--base icon--error icon--red'}></i>
                                <p>{t('VIDEO_PREVIEW.RECORD_MODAL.PERMISSIONS_ERROR_MESSAGE')}</p>
                            </div>
                        )}
                        <div className={''}>
                            {recordedChunks.length > 0 && !capturing ? (
                                <div>
                                    <video style={{ width: '100%', height: 'auto' }} src={replayVideoUrl} controls></video>
                                </div>
                            ) : (
                                <div>
                                    <Webcam
                                        muted={true}
                                        audio={true}
                                        ref={webcamRef}
                                        videoConstraints={{
                                            deviceId: selectedVideoDevice,
                                            width: 1280,
                                            height: 720,
                                        }}
                                        audioConstraints={{ deviceId: selectedMicrophoneDevice }}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/************************************************************/}

                    <div className="flex flex--col w--50">
                        <div className={'w--300--min align--center'}>
                            <h3 className={'mb-4'}>{t('VIDEO_PREVIEW.RECORD_MODAL.SETTINGS')}</h3>
                            <div className={'mb-4'}>
                                <h4>{t('VIDEO_PREVIEW.RECORD_MODAL.CAMERA')}</h4>
                                <select className={'w--100'} onChange={(e) => setSelectedVideoDevice(e.target.value)} value={selectedVideoDevice}>
                                    {videoDevices.map((device) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Device ${device.deviceId}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={'flex flex--col'}>
                                <h4>{t('VIDEO_PREVIEW.RECORD_MODAL.MICROPHONE')}</h4>
                                <MicrophoneTest className={'mb-1'} deviceId={selectedMicrophoneDevice} />
                                <select className={''} onChange={(e) => setSelectedMicrophoneDevice(e.target.value)} value={selectedMicrophoneDevice}>
                                    {microphoneDevices.map((device) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Device ${device.deviceId}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!showLoader && !showProgressBar && (
                                <div>
                                    <div className={'flex flex--row flex--jc--space-between mb-2 mt-5'}>
                                        {capturing ? (
                                            <button onClick={handleStopCaptureClick} type={'button'} className={'flex flex--row flex--ai--center'}>
                                                <VscDebugStop size={25} />
                                                <p>{t('VIDEO_PREVIEW.RECORD_MODAL.STOP')}</p>
                                            </button>
                                        ) : (
                                            <button onClick={handleStartCaptureClick} type={'button'} className={'flex flex--row flex--ai--center'}>
                                                <VscDebugStart size={25} />
                                                <p>{t('VIDEO_PREVIEW.RECORD_MODAL.START')}</p>
                                            </button>
                                        )}
                                        <button onClick={restartRecording} type={'button'}>
                                            {t('VIDEO_PREVIEW.RECORD_MODAL.RESTART')}
                                        </button>
                                    </div>
                                    <button
                                        className={'btn btn--primary btn--md w--100 flex flex--row flex--ai--center flex--jc--center'}
                                        onClick={onSubmit}
                                        type={'button'}
                                        disabled={capturing || recordedChunks.length == 0}
                                    >
                                        <MdOutlineCloudUpload size={25} className={'mr-2'} />
                                        {t('VIDEO_PREVIEW.RECORD_MODAL.UPLOAD')}
                                    </button>
                                </div>
                            )}

                            <div className={'mt-2'}>
                                {!showLoader && showProgressBar && (
                                    <div className={'w--100 mt-4'}>
                                        <h3 className={''}>{t('VIDEO_PREVIEW.LOADING.UPLOADING')}</h3>
                                        <progress className={'w--100'} value={uploadProgress} max="100" color={'#7e6cf2'} />
                                    </div>
                                )}

                                {showLoader && (
                                    <div>
                                        <p className={'mb-2'}>{t('VIDEO_PREVIEW.LOADING.PREPARING')}</p>
                                        <SyncLoader color={'#7e6cf2'} loading={showLoader} size={12} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {capturing && (
                    <span>
                        {t('VIDEO_PREVIEW.RECORD_MODAL.RECORDING_TIME')} {formatTime(timer)}
                    </span>
                )}

                {timer > 90 && capturing && <div className={'type--color--error'}>Snimka će se automatski zaustaviti za {120 - timer} sekundi</div>}
                <i
                    className="icon icon--grey icon--base icon--close"
                    onClick={cleanup}
                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                ></i>
            </div>
        </>
    );
};
