import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingPhotoStep.module.scss';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import UploadFile from '../../../../../../../components/form/MyUploadField';
import { useSetTutorProfileImageMutation } from '../../../../../../../store/services/userService';

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
            if (!image) {
                return;
            }
            const options = {
                maxSizeMB: 5,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };
            imageCompression(image, options).then((compressedImage) => {
                const toSend: any = {};
                toSend['profileImage'] = compressedImage;

                updateUserInformation(toSend)
                    .unwrap()
                    .then((res) => {
                        console.log({ res });
                        formik.setFieldValue('imageLink', res);
                    });
            });
        },
        [formik, updateUserInformation]
    );

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PHOTO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PHOTO.SUBTITLE')}
        >
            <UploadFile
                setFieldValue={(_, value) => uploadImage(value)}
                id="profileImage"
                name="profileImage"
                value={formik.values.imageLink ?? ''}
                disabled={false}
                removePreviewOnUnmount={true}
            />
            <img src={formik.values.imageLink} />
        </OnboardingStepFormLayout>
    );
}
