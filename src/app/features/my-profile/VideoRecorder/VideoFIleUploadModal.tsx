import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useLazyGetUploadVideoUrlQuery } from '../../../store/services/vimeoService';
import { uploadToVimeo } from './uploadToVimeo';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { t } from 'i18next';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

interface Props {
    file: File;
    className?: string;
    triggerSuccess: () => void;
    onClose: () => void;
}

export const VideoFIleUploadModal = (props: Props) => {
    const { file, className, triggerSuccess, onClose } = props;
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
        <div className={`${className} bg__white w--60 video-recorder-container m-2 p-2 h--45 flex flex--col flex--ai--center h--450`}>
            <h2>{t('VIDEO_PREVIEW.TITLE')}</h2>
            <video src={videoSrc} controls height={300}></video>
            {!showLoader && !showProgressBar && (
                <ButtonPrimaryGradient
                    className={'btn btn--md flex flex--row flex--ai--center flex--jc--center mt-2'}
                    onClick={onSubmit}
                    type={'button'}
                    disabled={!file}
                >
                    <MdOutlineCloudUpload size={25} className={'mr-2'} />
                    {t('VIDEO_PREVIEW.UPLOAD_VIDEO')}
                </ButtonPrimaryGradient>
            )}

            <div className={'mt-2 w--30'}>
                {showLoader && (
                    <div className={'flex flex--col flex--ai--center'}>
                        <p className={'mb-2'}>{t('VIDEO_PREVIEW.LOADING.PREPARING')}</p>
                        <SyncLoader color={'#7e6cf2'} loading={showLoader} size={12} />
                    </div>
                )}

                {!showLoader && showProgressBar && (
                    <div className={'mt-4'}>
                        <h3 className={''}>{t('VIDEO_PREVIEW.LOADING.UPLOADING')}</h3>
                        <progress className={'w--100'} value={uploadProgress} max="100" color={'#7e6cf2'} />
                    </div>
                )}
            </div>
            <div
                className="icon icon--grey icon--base icon--close"
                onClick={onClose}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
            ></div>
        </div>
    );
};
