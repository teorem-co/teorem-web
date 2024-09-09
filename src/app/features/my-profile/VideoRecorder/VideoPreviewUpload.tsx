import React, { useEffect, useState } from 'react';
import { VideoFileUpload } from './VideoFileUpload';
import { VideoUploadPopup } from './VideoUploadPopup';
import { VideoRecorder } from './VideoRecorder';
import { BiSolidVideoRecording } from 'react-icons/bi';
import { VideoFIleUploadModal } from './VideoFIleUploadModal';
import { t } from 'i18next';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

interface Props {
    fetchData: () => void;
}

export const VideoPreviewUpload = (props: Props) => {
    const { fetchData } = props;
    const [showRecorder, setShowRecorder] = useState(false);
    const [showSuccessfullPopup, setShowSuccessfullPopup] = useState(false);
    const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);

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
            <div className={'flex flex--col'}>
                <div className={`flex   flex-gap-5 `}>
                    <div>
                        <h4 className={'type--center type--wgt--regular'}>{t('VIDEO_PREVIEW.RECORD_VIDEO')}</h4>
                        <ButtonPrimaryGradient
                            onClick={() => setShowRecorder(true)}
                            className={
                                'btn btn--md btn align-center record-video-button flex flex-row flex--jc--center flex--ai--center w--260'
                            }
                        >
                            <BiSolidVideoRecording size={25} className={'mr-2'} />
                            <p>{t('VIDEO_PREVIEW.START')}</p>
                        </ButtonPrimaryGradient>
                    </div>

                    <p className={'align-self-center'}>{t('VIDEO_PREVIEW.OR')}</p>

                    <div>
                        <h4 className={'type--center type--wgt--regular'}>{t('VIDEO_PREVIEW.UPLOAD_VIDEO')}</h4>
                        <VideoFileUpload
                            className={'w--260'}
                            setFile={setFile}
                            uploadedSectionTitle={'Upload title'}
                            acceptedTypes={ACCEPTED_TYPES}
                            description={t('VIDEO_PREVIEW.FILE_UPLOAD.FORMAT')}
                            maxSize={10 * 1024 * 1024} //10MB
                        />
                    </div>
                </div>
                <div className="flex flex--row mt-4">
                    <div>
                        <p>{t('VIDEO_PREVIEW.TIPS.DO.TITLE')}</p>
                        <ul>
                            {Array.from({ length: 7 }, (_, index) => (
                                <li key={index}>{t(`VIDEO_PREVIEW.TIPS.DO.LIST.TIP_${index + 1}`)}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p>{t('VIDEO_PREVIEW.TIPS.DONT.TITLE')}</p>
                        <ul>
                            {Array.from({ length: 4 }, (_, index) => (
                                <li key={index}>{t(`VIDEO_PREVIEW.TIPS.DONT.LIST.TIP_${index + 1}`)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {showFileUploadPopup && file && (
                <div className={'flex flex--col flex--ai--start modal__overlay'}>
                    <VideoFIleUploadModal
                        file={file}
                        onClose={() => setShowFileUploadPopup(false)}
                        triggerSuccess={() => {
                            setShowSuccessfullPopup(true);
                            setShowFileUploadPopup(false);
                        }}
                    />
                </div>
            )}

            {showRecorder && !showSuccessfullPopup && (
                <div className="flex flex--col flex--ai--start modal__overlay ">
                    <VideoRecorder
                        className={'bg__white w--60 video-recorder-container m-2 p-8'}
                        triggerSuccess={() => {
                            setShowSuccessfullPopup(true);
                            setShowRecorder(false);
                            setTimeout(() => {
                                location.reload();
                            }, 1500);
                        }}
                        onClose={() => setShowRecorder(false)}
                    />
                </div>
            )}

            {showSuccessfullPopup && (
                <div className="flex flex--col flex--ai--start modal__overlay">
                    <VideoUploadPopup setShowPopup={setShowSuccessfullPopup} />
                </div>
            )}
        </>
    );
};
