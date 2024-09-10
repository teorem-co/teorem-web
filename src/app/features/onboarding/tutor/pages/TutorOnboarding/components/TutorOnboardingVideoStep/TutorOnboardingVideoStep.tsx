import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingVideoStep.module.scss';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useState } from 'react';
import {
    ITutorVideoInformation,
    useLazyGetTutorVideoInformationQuery,
} from '../../../../../../../store/services/tutorService';
import LoaderPrimary from '../../../../../../../components/skeleton-loaders/LoaderPrimary';
import { UploadedVideoComponent } from '../../../../../../my-profile/VideoRecorder/UploadedVideoComponent';
import { VideoPreviewUpload } from '../../../../../../my-profile/VideoRecorder/VideoPreviewUpload';

export default function TutorOnboardingVideoStep() {
    const { t } = useTranslation();
    const { formik, setNextDisabled, setShowQuestions } = useTutorOnboarding();
    const [getVideoInformation] = useLazyGetTutorVideoInformationQuery();
    const [showVideoSection, setShowVideoSection] = useState(false);
    const [videoInformation, setVideoInformation] = useState<ITutorVideoInformation>({
        url: undefined,
        approved: undefined,
        videoTranscoded: false,
    });

    const fetchData = useCallback(async () => {
        const videoInfo = await getVideoInformation().unwrap();
        setShowVideoSection(true);
        setVideoInformation({
            ...videoInfo,
        });
        if (videoInfo.url) {
            const lastIndexOfSlash = videoInfo.url.lastIndexOf('/');
            const videoId = videoInfo.url.substring(lastIndexOfSlash + 1);
            formik.setFieldValue('videoId', videoId);
        }
    }, [formik, getVideoInformation]);

    useEffect(() => {
        setShowQuestions?.(true);
        setNextDisabled?.(!!formik.errors.videoId);
        fetchData();
    }, [fetchData, formik.errors.videoId, setNextDisabled, setShowQuestions]);
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.VIDEO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.VIDEO.SUBTITLE')}
        >
            {!showVideoSection ? (
                <LoaderPrimary />
            ) : videoInformation.url ? (
                <UploadedVideoComponent fetchData={fetchData} videoInformation={videoInformation} />
            ) : (
                <VideoPreviewUpload fetchData={fetchData} />
            )}
        </OnboardingStepFormLayout>
    );
}
