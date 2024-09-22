/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useLazyGetUploadVideoUrlQuery } from '../../../../store/services/vimeoService';
import { uploadToVimeo } from '../uploadToVimeo';
import { t } from 'i18next';
import moment from 'moment';
import MicrophoneTest from '../../../dashboard/MicrophoneTest';
import { ClipLoader, SyncLoader } from 'react-spinners';
import Select, { SingleValue } from 'react-select';
import styles from './RecorderModal.module.scss';
import Modal from '../../../../components/Modal';
import CtaButton from '../../../../components/CtaButton';
import { Button } from '@mui/material';

const MINUTE_AND_A_HALF_IN_SECONDS = 90;
const TWO_MINUTES_IN_SECONDS = 120;

export interface Option {
    value: string;
    // label: string | HTMLDivElement;
    label: any;
}

interface IRecorderModalProps {
    open: boolean;
    onSuccess: () => void;
    onClose: () => void;
}

export default function RecorderModal({ open, onSuccess, onClose }: Readonly<IRecorderModalProps>) {
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
    const webcamRef = useRef<Webcam | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

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

        mediaRecorderRef.current?.stop();

        streamRef.current?.getTracks().forEach((track) => {
            track.stop();
        });

        const file: File = new File(recordedChunks, 'video.webm', { type: 'video/webm' }); // todo: change it later
        const size = file.size; // change later
        setShowLoader(true);
        const linkUrl = await getVideoUrl(size).unwrap();
        setShowLoader(false);
        setShowProgressBar(true);

        await uploadToVimeo(file, linkUrl, setUploadProgress, onSuccess, webcamRef.current);
    }

    const cleanup = () => {
        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => {
            track.stop();
        });

        onClose?.(); // Assuming this calls the passed onClose prop to notify parent components.
    };

    useEffect(() => {
        const updateDevices = () => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                if (videoDevices.length > 0) {
                    setSelectedVideoDevice(videoDevices[0].deviceId);
                }

                const cameraOptions: Option[] = videoDevices.map((device) => ({
                    value: device.deviceId,
                    label: device.label || `Device ${device.deviceId}`,
                }));
                setCameraOptions(cameraOptions);

                const audioDevices = devices.filter((device) => device.kind === 'audioinput');

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

    const handleStartCaptureClick = useCallback(async () => {
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
            //@ts-ignore
            webcamRef.current = { stream };
            //this one is for cleanup
            streamRef.current = stream;

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
    }, [selectedVideoDevice, selectedMicrophoneDevice]);

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
        <Modal
            title={t('VIDEO_PREVIEW.RECORD_MODAL.TITLE')}
            open={open}
            onClose={() => cleanup()}
            onBackdropClick={() => cleanup()}
        >
            <div className={styles.container}>
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

                <h3 className={'mb-4 type--center'}>{t('VIDEO_PREVIEW.RECORD_MODAL.SETTINGS')}</h3>

                {showStartingLoader ? (
                    <div className="align--center flex flex--row flex--jc--center">
                        <ClipLoader loading={showStartingLoader} size={35} />
                    </div>
                ) : (
                    <>
                        <h4>{t('VIDEO_PREVIEW.RECORD_MODAL.CAMERA')}</h4>
                        <Select
                            classNamePrefix="select"
                            value={cameraOptions.find((option) => option.value === selectedVideoDevice)}
                            onChange={handleChangeCamera}
                            options={cameraOptions}
                            placeholder="Select a Camera..."
                        />

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

                        {!showLoader && !showProgressBar && (
                            <div className={styles.buttons}>
                                {capturing ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleStopCaptureClick}
                                        type={'button'}
                                    >
                                        {t('VIDEO_PREVIEW.RECORD_MODAL.STOP')}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleStartCaptureClick}
                                        type={'button'}
                                    >
                                        {t('VIDEO_PREVIEW.RECORD_MODAL.START')}
                                    </Button>
                                )}
                                <CtaButton
                                    onClick={onSubmit}
                                    type={'button'}
                                    disabled={capturing || recordedChunks.length == 0}
                                >
                                    {t('VIDEO_PREVIEW.RECORD_MODAL.UPLOAD')}
                                </CtaButton>
                            </div>
                        )}
                    </>
                )}

                {!showLoader && showProgressBar ? (
                    <>
                        <h3>{t('VIDEO_PREVIEW.LOADING.UPLOADING')}</h3>
                        <progress className={'w--100'} value={uploadProgress} max="100" color={'#7e6cf2'} />
                    </>
                ) : null}

                {showLoader ? (
                    <>
                        <p>{t('VIDEO_PREVIEW.LOADING.PREPARING')}</p>
                        <SyncLoader color={'#7e6cf2'} loading={showLoader} size={12} />
                    </>
                ) : null}
            </div>

            {capturing ? (
                <span>
                    {t('VIDEO_PREVIEW.RECORD_MODAL.RECORDING_TIME')} {formatTime(timer)}
                </span>
            ) : null}

            {timer >= MINUTE_AND_A_HALF_IN_SECONDS && capturing ? (
                <div className={'type--color--error'}>
                    {t('VIDEO_PREVIEW.RECORD_MODAL.REMAINING_TIME.PART_1')} {TWO_MINUTES_IN_SECONDS - timer}{' '}
                    {t('VIDEO_PREVIEW.RECORD_MODAL.REMAINING_TIME.PART_2')}
                </div>
            ) : null}
        </Modal>
    );
}
