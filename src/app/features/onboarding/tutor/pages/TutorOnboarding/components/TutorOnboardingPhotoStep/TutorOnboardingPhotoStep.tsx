import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPhotoStep.module.scss';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useSetTutorProfileImageMutation } from '../../../../../../../store/services/userService';
import { IconButton } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import PhotoUploadArea from './components/PhotoUploadArea';
import CheckBox from '@mui/icons-material/CheckBox';
import Close from '@mui/icons-material/Close';

export default function TutorOnboardingPhotoStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, setShowQuestions } = useTutorOnboarding();
    const [updateUserInformation, { isLoading: isLoadingUserUpdate }] = useSetTutorProfileImageMutation();

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.imageLink);
        setShowQuestions?.(true);
    }, [formik.errors.imageLink, setNextDisabled, setShowQuestions]);

    const uploadImage = useCallback(
        (image: File) => {
            setNextDisabled?.(true);
            if (!image) {
                return;
            }
            const options = {
                maxSizeMB: 5,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };
            imageCompression(image, options)
                .then((compressedImage) => {
                    const toSend: any = {};
                    toSend['profileImage'] = compressedImage;

                    return updateUserInformation(toSend)
                        .unwrap()
                        .then((res) => {
                            console.log({ res });
                            formik.setFieldValue('imageLink', res);
                        });
                })
                .finally(() => {
                    setNextDisabled?.(false);
                });
        },
        [formik, setNextDisabled, updateUserInformation]
    );

    const handleDelete = () => {
        formik.setFieldValue('imageLink', '');
    };

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PHOTO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PHOTO.SUBTITLE')}
        >
            <div className={styles.content}>
                {formik.values.imageLink?.length ? (
                    <div className={styles.imgContainer}>
                        <img src={formik.values.imageLink} alt="profile image" />
                        <IconButton className={styles.delete} onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                    </div>
                ) : (
                    <PhotoUploadArea
                        setFieldValue={(_, value) => uploadImage(value)}
                        id="profileImage"
                        name="profileImage"
                        value={formik.values.imageLink ?? ''}
                        disabled={false}
                        removePreviewOnUnmount={true}
                        title={t('ONBOARDING.TUTOR.PHOTO.DRAG_TITLE')}
                        description={t('ONBOARDING.TUTOR.PHOTO.DRAG_DESCRIPTION')}
                        cta={t('ONBOARDING.TUTOR.PHOTO.BROWSE')}
                    />
                )}
            </div>
            <div className={styles.points}>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_SMILE')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_FRAME')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_FACE')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_PERSON')}</span>
                </div>
                <div className={styles.point}>
                    <Close className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.PHOTO.POINT_LOGO')}</span>
                </div>
            </div>
        </OnboardingStepFormLayout>
    );
}
