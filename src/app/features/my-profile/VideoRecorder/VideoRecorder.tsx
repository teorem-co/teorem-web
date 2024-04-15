import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useLazyGetUploadVideoUrlQuery } from '../../onboarding/services/vimeoService';
import { uploadToVimeo } from './uploadToVimeo';
import { t } from 'i18next';
import moment from 'moment';
import MicrophoneTest from '../../dashboard/MicrophoneTest';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { ClipLoader, SyncLoader } from 'react-spinners';
import Select, { SingleValue } from 'react-select';

const MINUTE_AND_A_HALF_IN_SECONDS = 90;
const TWO_MINUTES_IN_SECONDS = 120;

export interface Option {
    value: string;
    label: string;
}

interface Props {
    className?: string;
    triggerSuccess: () => void;
    onClose: () => void;
}

export const VideoRecorder = (props: Props) => {
    const { className, triggerSuccess, onClose } = props;
    const [microphoneOptions, setMicrophoneOptions] = useState<Option[]>([]);
    const [cameraOptions, setCameraOptions] = useState<Option[]>([]);
    const handleChangeMicrophone = (selectedOption: SingleValue<Option>) => {
        const selectedValue = selectedOption ? selectedOption.value : '';
        setSelectedMicrophoneDevice(selectedValue);
    };
    const handleChangeCamera = (selectedOption: SingleValue<Option>) => {
        const selectedValue = selectedOption ? selectedOption.value : '';
        setSelectedVideoDevice(selectedValue);
    };
    const webcamRef = useRef<Webcam>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
    const [selectedMicrophoneDevice, setSelectedMicrophoneDevice] = useState<string>('');
    const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [showPermissionsErrorMessage, setShowPermissionsErrorMessage] = useState(false);

    const [showStartingLoader, setShowStartingLoader] = useState(true);
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

                const cameraOptions: Option[] = videoDevices.map((device) => ({
                    value: device.deviceId,
                    label: device.label || `Device ${device.deviceId}`,
                }));
                setCameraOptions(cameraOptions);

                const audioDevices = devices.filter((device) => device.kind === 'audioinput');
                setMicrophoneDevices(audioDevices);

                const options: Option[] = audioDevices.map((device) => ({
                    value: device.deviceId,
                    label: device.label || `Device ${device.deviceId}`,
                }));
                setMicrophoneOptions(options);
                if (audioDevices.length > 0) {
                    setSelectedMicrophoneDevice(audioDevices[0].deviceId);
                }
            });
        };

        // Try to get user media to prompt for permission
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(() => {
                updateDevices();
                setShowStartingLoader(false);
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
                setShowPermissionsErrorMessage(true);
                setShowStartingLoader(false);
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
        if (capturing && timer === TWO_MINUTES_IN_SECONDS) {
            handleStopCaptureClick();
        }
    }, [timer]);

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
                <div className="flex flex--row flex--jc--space-between flex--ai--center">
                    <div className="flex flex--col w--50">
                        {showPermissionsErrorMessage && (
                            <div className={'w--100 type--color--error flex flex--row'}>
                                <i className={'icon icon--base icon--error icon--red'}></i>
                                <p>{t('VIDEO_PREVIEW.RECORD_MODAL.PERMISSIONS_ERROR_MESSAGE')}</p>
                            </div>
                        )}
                        {recordedChunks.length > 0 && !capturing ? (
                            <div>
                                <video style={{ width: '100%', height: 'auto' }} src={replayVideoUrl} controls></video>
                            </div>
                        ) : (
                            <div className={''}>
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
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex--col w--50">
                        <div className={'w--300--min align--center'}>
                            <h3 className={'mb-4 type--center'}>{t('VIDEO_PREVIEW.RECORD_MODAL.SETTINGS')}</h3>

                            {showStartingLoader ? (
                                <div className="align--center flex flex--row flex--jc--center">
                                    <ClipLoader loading={showStartingLoader} size={35} />
                                </div>
                            ) : (
                                <>
                                    <div className={'mb-4'}>
                                        <h4>{t('VIDEO_PREVIEW.RECORD_MODAL.CAMERA')}</h4>
                                        <Select
                                            classNamePrefix="select"
                                            value={cameraOptions.find((option) => option.value === selectedVideoDevice)}
                                            onChange={handleChangeCamera}
                                            options={cameraOptions}
                                            placeholder="Select a Camera..."
                                        />
                                    </div>

                                    <div className={'flex flex--col'}>
                                        <h4>{t('VIDEO_PREVIEW.RECORD_MODAL.MICROPHONE')}</h4>
                                        <MicrophoneTest className={'mb-1'} deviceId={selectedMicrophoneDevice} />
                                        <Select
                                            className={'mt-1'}
                                            classNamePrefix="select"
                                            value={microphoneOptions.find((option) => option.value === selectedMicrophoneDevice)}
                                            onChange={handleChangeMicrophone}
                                            options={microphoneOptions}
                                            placeholder="Select a Microphone..."
                                        />
                                    </div>

                                    <div>
                                        {!showLoader && !showProgressBar && (
                                            <div>
                                                <div className={'flex flex--row flex--jc--space-between mb-2 mt-5'}>
                                                    {capturing ? (
                                                        <button
                                                            className={'btn btn--base'}
                                                            style={{
                                                                backgroundColor: '#F44336',
                                                                color: 'white',
                                                            }}
                                                            onClick={handleStopCaptureClick}
                                                            type={'button'}
                                                        >
                                                            <p>{t('VIDEO_PREVIEW.RECORD_MODAL.STOP')}</p>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={'btn btn--sm'}
                                                            onClick={handleStartCaptureClick}
                                                            type={'button'}
                                                            style={{
                                                                backgroundColor: '#4CAF50',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            <p>{t('VIDEO_PREVIEW.RECORD_MODAL.START')}</p>
                                                        </button>
                                                    )}
                                                    <button
                                                        className={'btn btn--primary btn--base flex flex--row flex--ai--center flex--jc--center'}
                                                        onClick={onSubmit}
                                                        type={'button'}
                                                        disabled={capturing || recordedChunks.length == 0}
                                                    >
                                                        <MdOutlineCloudUpload size={25} className={'mr-2'} />
                                                        {t('VIDEO_PREVIEW.RECORD_MODAL.UPLOAD')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
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

                {timer >= MINUTE_AND_A_HALF_IN_SECONDS && capturing && (
                    <div className={'type--color--error'}>
                        {t('VIDEO_PREVIEW.RECORD_MODAL.REMAINING_TIME.PART_1')} {TWO_MINUTES_IN_SECONDS - timer}{' '}
                        {t('VIDEO_PREVIEW.RECORD_MODAL.REMAINING_TIME.PART_2')}
                    </div>
                )}
                <i
                    className="icon icon--grey icon--base icon--close"
                    onClick={cleanup}
                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                ></i>
            </div>
        </>
    );
};
