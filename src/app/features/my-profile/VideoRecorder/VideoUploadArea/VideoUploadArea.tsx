import { useEffect, useState } from 'react';
import VideoFileUpload from '../VideoFileUpload';
import { VideoFIleUploadModal } from '../VideoFIleUploadModal';
import { useTranslation } from 'react-i18next';
import styles from './VideoUploadArea.module.scss';
import clsx from 'clsx';
import recordImage from './assets/record.png';
import RecorderModal from '../RecorderModal';
import Alert from '@mui/material/Alert';

interface IVideoUploadAreaProps {
    onSuccess: () => void;
    onClose?: () => void;
}

export default function VideoUploadArea({ onClose, onSuccess }: IVideoUploadAreaProps) {
    const [showRecorder, setShowRecorder] = useState(false);
    const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
    const [showMaxSizeError, setShowMaxSizeError] = useState(false);
    const [showMaxDurationError, setShowMaxDurationError] = useState(false);
    const { t } = useTranslation();

    const [file, setFile] = useState<File>();
    const ACCEPTED_TYPES = 'video/*';

    useEffect(() => {
        if (file) {
            setShowFileUploadPopup(true);
        }
    }, [file]);

    return (
        <>
            <div className={styles.container}>
                <img src={recordImage} alt="Record" className={styles.icon} />
                <h4 className={styles.title}>{t('VIDEO_PREVIEW.ADD_VIDEO')}</h4>
                <div className={styles.buttons}>
                    <VideoFileUpload
                        className={clsx(styles.cta, styles.black)}
                        setFile={setFile}
                        acceptedTypes={ACCEPTED_TYPES}
                        description={t('VIDEO_PREVIEW.BROWSE')}
                        maxSize={10 * 1024 * 1024} //10MB
                        setShowMaxSizeError={setShowMaxSizeError}
                        setShowMaxDurationError={setShowMaxDurationError}
                    />
                    <p className={'align-self-center'}>{t('VIDEO_PREVIEW.OR')}</p>
                    {showMaxSizeError ? (
                        <Alert severity="error" style={{ marginBottom: '12px' }}>
                            {t('VIDEO_PREVIEW.FILE_UPLOAD.SIZE_MESSAGE')}
                        </Alert>
                    ) : null}
                    {showMaxDurationError ? (
                        <Alert severity="error" style={{ marginBottom: '12px' }}>
                            {t('VIDEO_PREVIEW.FILE_UPLOAD.DURATION_MESSAGE')}
                        </Alert>
                    ) : null}
                    <button onClick={() => setShowRecorder(true)} className={clsx(styles.cta, styles.white)}>
                        {t('VIDEO_PREVIEW.RECORD')}
                    </button>
                </div>
            </div>
            {file ? (
                <VideoFIleUploadModal
                    file={file}
                    open={showFileUploadPopup}
                    onClose={() => setShowFileUploadPopup(false)}
                    triggerSuccess={() => {
                        onSuccess();
                        setShowFileUploadPopup(false);
                    }}
                />
            ) : null}

            {showRecorder ? ( // must have showRecorder condition becase it asks for permission immediately on mount
                <RecorderModal
                    open={showRecorder}
                    onSuccess={() => {
                        onSuccess();
                        onClose?.();
                        setShowRecorder(false);
                    }}
                    onClose={() => {
                        onClose?.();
                        setShowRecorder(false);
                    }}
                />
            ) : null}
        </>
    );
}
