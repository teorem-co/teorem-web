import { useEffect, useState } from 'react';
import VideoFileUpload from '../VideoFileUpload';
import { VideoFIleUploadModal } from '../VideoFIleUploadModal';
import { VideoUploadPopup } from '../VideoUploadPopup';
import { useTranslation } from 'react-i18next';
import styles from './VideoUploadArea.module.scss';
import clsx from 'clsx';
import recordImage from './assets/record.png';
import RecorderModal from '../RecorderModal';

interface IVideoUploadAreaProps {
    fetchData: () => void;
}

export default function VideoUploadArea({ fetchData }: IVideoUploadAreaProps) {
    const [showRecorder, setShowRecorder] = useState(false);
    const [showSuccessfullPopup, setShowSuccessfullPopup] = useState(false);
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

    useEffect(() => {
        if (!showSuccessfullPopup) {
            fetchData();
        }
    }, [fetchData, showSuccessfullPopup]);

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
                    <button onClick={() => setShowRecorder(true)} className={clsx(styles.cta, styles.white)}>
                        {t('VIDEO_PREVIEW.RECORD')}
                    </button>
                </div>
            </div>

            {showMaxSizeError ? (
                <div className="field__validation">{t('VIDEO_PREVIEW.FILE_UPLOAD.SIZE_MESSAGE')}</div>
            ) : null}
            {showMaxDurationError ? (
                <div className="field__validation">{t('VIDEO_PREVIEW.FILE_UPLOAD.DURATION_MESSAGE')}</div>
            ) : null}

            {file ? (
                <div className={'flex flex--col flex--ai--start modal__overlay'}>
                    <VideoFIleUploadModal
                        file={file}
                        open={showFileUploadPopup}
                        onClose={() => setShowFileUploadPopup(false)}
                        triggerSuccess={() => {
                            setShowSuccessfullPopup(true);
                            setShowFileUploadPopup(false);
                        }}
                    />
                </div>
            ) : null}

            {!showSuccessfullPopup ? (
                <RecorderModal
                    open={showRecorder}
                    onSuccess={() => {
                        setShowSuccessfullPopup(true);
                        setShowRecorder(false);
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    }}
                    onClose={() => setShowRecorder(false)}
                />
            ) : null}

            {showSuccessfullPopup ? (
                <div className="flex flex--col flex--ai--start modal__overlay">
                    <VideoUploadPopup setShowPopup={setShowSuccessfullPopup} />
                </div>
            ) : null}
        </>
    );
}
