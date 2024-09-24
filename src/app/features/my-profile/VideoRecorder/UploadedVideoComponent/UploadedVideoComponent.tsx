import React, { useState } from 'react';
import { ITutorVideoInformation, useLazyDeleteTutorVideoQuery } from '../../../../store/services/tutorService';
import { ConfirmationModal } from '../../../../components/ConfirmationModal';
import { useAppSelector } from '../../../../store/hooks';
import styles from './UploadedVideoComponent.module.scss';
import successImage from './assets/successImage.png';
import recordImage from './assets/record.png';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface Props {
    videoInformation: ITutorVideoInformation;
    fetchData: () => Promise<void>;
    onDelete?: () => void;
}

export const UploadedVideoComponent = (props: Props) => {
    const [t] = useTranslation();
    const { videoInformation, fetchData, onDelete } = props;
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteVideo] = useLazyDeleteTutorVideoQuery();
    const userId = useAppSelector((state) => state.auth.user?.id);

    async function handleDelete() {
        if (userId) {
            await deleteVideo(userId).unwrap();
            setShowDeleteConfirmModal(false);
            fetchData().then(() => onDelete?.());
        }
    }

    if (!videoInformation.videoTranscoded) {
        return (
            <div className={styles.container}>
                <img src={successImage} alt="Success" className={styles.icon} />
                <h2 className={styles.title}>{t('VIDEO_PREVIEW.SUCCESS_TITLE')}</h2>
                <Typography variant="body2">{t('VIDEO_PREVIEW.SUCCESS_DESCRIPTION')}</Typography>
                <IconButton className={styles.delete} onClick={() => setShowDeleteConfirmModal(true)}>
                    <Delete />
                </IconButton>
                {showDeleteConfirmModal ? (
                    <ConfirmationModal
                        onConfirm={() => handleDelete()}
                        confirmButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CONFIRM')}
                        cancelButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CANCEL')}
                        title={t('VIDEO_PREVIEW.CONFIRMATION.TITLE')}
                        description={t('VIDEO_PREVIEW.CONFIRMATION.DESCRIPTION')}
                        onCancel={() => setShowDeleteConfirmModal(false)}
                    />
                ) : null}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <video style={{ height: 'auto', maxWidth: '100%' }} src={videoInformation.url} controls></video>
            <IconButton className={styles.delete} onClick={() => setShowDeleteConfirmModal(true)}>
                <Delete />
            </IconButton>
            {showDeleteConfirmModal ? (
                <ConfirmationModal
                    onConfirm={() => handleDelete()}
                    confirmButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CONFIRM')}
                    cancelButtonTitle={t('VIDEO_PREVIEW.CONFIRMATION.CANCEL')}
                    title={t('VIDEO_PREVIEW.CONFIRMATION.TITLE')}
                    description={t('VIDEO_PREVIEW.CONFIRMATION.DESCRIPTION')}
                    onCancel={() => setShowDeleteConfirmModal(false)}
                />
            ) : null}
        </div>
    );
};
