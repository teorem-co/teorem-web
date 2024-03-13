import React, { useState } from 'react';
import { ITutorVideoInformation, useLazyDeleteTutorVideoQuery } from '../../../../services/tutorService';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useAppSelector } from '../../../hooks';
import { BiSolidTrash } from 'react-icons/bi';
import { t } from 'i18next';

interface Props {
    videoInformation: ITutorVideoInformation;
    fetchData: () => void;
}

export const UploadedVideoComponent = (props: Props) => {
    const { videoInformation, fetchData } = props;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [deleteVideo] = useLazyDeleteTutorVideoQuery();
    const userId = useAppSelector((state) => state.auth.user?.id);

    async function handleDelete() {
        if (userId) {
            await deleteVideo(userId).unwrap();
            setShowConfirmationModal(false);
            fetchData();
        }
    }

    return (
        <>
            {videoInformation.videoTranscoded ? (
                <div>
                    {!videoInformation.approved && (
                        <div className={'flex flex--row flex--ai--center mb-2'}>
                            <i className={'icon icon--base icon--error icon--red cur--default'}></i>
                            <p className={'type--color--error'}>{t('VIDEO_PREVIEW.NOT_APPROVED')}</p>
                        </div>
                    )}
                    <div className={'flex flex--row flex--ai--center flex--jc--space-between'}>
                        <iframe
                            id={'iframe-video'}
                            src={videoInformation.url}
                            width="640"
                            height="360"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            style={{ background: 'black' }}
                        ></iframe>
                        <button
                            onClick={() => setShowConfirmationModal(true)}
                            className={'btn btn--primary btn--md align--center flex flex-row flex--jc--center flex--ai--center'}
                        >
                            <BiSolidTrash size={25} />
                            <p className={'ml-2'}>{t('VIDEO_PREVIEW.DELETE')}</p>
                        </button>
                    </div>
                    {showConfirmationModal && (
                        <ConfirmationModal
                            onConfirm={() => handleDelete()}
                            confirmButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CONFIRM')}
                            cancelButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CANCEL')}
                            title={t('VIDEO_PREVIEW.CONFIRMATION.TITLE')}
                            description={t('VIDEO_PREVIEW.CONFIRMATION.DESCRIPTION')}
                            onCancel={() => setShowConfirmationModal(false)}
                        />
                    )}
                </div>
            ) : (
                <>
                    <p>{t('VIDEO_PREVIEW.TRANSCODING')}</p>
                </>
            )}
        </>
    );
};
