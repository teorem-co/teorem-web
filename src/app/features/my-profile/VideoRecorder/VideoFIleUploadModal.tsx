import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useLazyGetUploadVideoUrlQuery } from '../../../store/services/vimeoService';
import { uploadToVimeo } from './uploadToVimeo';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { t } from 'i18next';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';
import Modal from '../../../components/Modal';
import CtaButton from '../../../components/CtaButton';

interface IVideoFileUploadModalProps {
    file: File;
    className?: string;
    triggerSuccess: () => void;
    onClose: () => void;
    open: boolean;
}

export function VideoFIleUploadModal({
    file,
    className,
    triggerSuccess,
    onClose,
    open,
}: Readonly<IVideoFileUploadModalProps>) {
    const [getVideoUrl] = useLazyGetUploadVideoUrlQuery();
    const [showLoader, setShowLoader] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        // Create a blob URL when the file is set
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setVideoSrc(fileURL);

            // Cleanup the blob URL when the component unmounts or file changes
            return () => {
                URL.revokeObjectURL(fileURL);
            };
        }
    }, [file]);

    async function onSubmit() {
        const size = file.size; // change later
        setShowLoader(true);
        const linkUrl = await getVideoUrl(size).unwrap();
        setShowLoader(false);
        setShowProgressBar(true);

        await uploadToVimeo(file, linkUrl, setUploadProgress, triggerSuccess, null);
    }

    return (
        <Modal title={t('VIDEO_PREVIEW.TITLE')} open={open} onClose={onClose} onBackdropClick={onClose}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    overflowX: 'hidden',
                }}
            >
                <video src={videoSrc} controls height={250}></video>
                {!showLoader && !showProgressBar && (
                    <CtaButton onClick={onSubmit} type={'button'} disabled={!file}>
                        {t('VIDEO_PREVIEW.UPLOAD_VIDEO')}
                    </CtaButton>
                )}

                {showLoader && (
                    <div className={'flex flex--col flex--ai--center'}>
                        <p className={'mb-2'}>{t('VIDEO_PREVIEW.LOADING.PREPARING')}</p>
                        <SyncLoader color={'#7e6cf2'} loading={showLoader} size={12} />
                    </div>
                )}

                {!showLoader && showProgressBar && (
                    <div className={'mt-4'}>
                        <h3>{t('VIDEO_PREVIEW.LOADING.UPLOADING')}</h3>
                        <progress className={'w--100'} value={uploadProgress} max="100" color={'#7e6cf2'} />
                    </div>
                )}
            </div>
        </Modal>
    );
}
