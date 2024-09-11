import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingVideoStep.module.scss';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useState } from 'react';
import {
    ITutorVideoInformation,
    useLazyGetTutorVideoInformationQuery,
} from '../../../../../../../store/services/tutorService';
import { UploadedVideoComponent } from '../../../../../../my-profile/VideoRecorder/UploadedVideoComponent/UploadedVideoComponent';
import CheckBox from '@mui/icons-material/CheckBox';
import Close from '@mui/icons-material/Close';
import { VideoUploadArea } from '../../../../../../my-profile/VideoRecorder/VideoUploadArea';

export default function TutorOnboardingVideoStep() {
    const { t } = useTranslation();
    const { formik, setNextDisabled, setShowQuestions } = useTutorOnboarding();
    const [getVideoInformation] = useLazyGetTutorVideoInformationQuery();
    const [videoInformation, setVideoInformation] = useState<ITutorVideoInformation>({
        url: undefined,
        approved: undefined,
        videoTranscoded: false,
    });

    const fetchData = useCallback(async () => {
        const videoInfo = await getVideoInformation().unwrap();
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
            <div className={styles.content}>
                {videoInformation.url ? (
                    <UploadedVideoComponent fetchData={fetchData} videoInformation={videoInformation} />
                ) : (
                    <VideoUploadArea fetchData={fetchData} />
                )}
            </div>
            <div className={styles.points}>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_LENGTH')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_HORIZONTAL')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_BACKGROUND')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_SURFACE')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_FACE')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_EXPERIENCE')}</span>
                </div>
                <div className={styles.point}>
                    <CheckBox className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_GREET')}</span>
                </div>
                <div className={styles.point}>
                    <Close className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_SURNAME')}</span>
                </div>
                <div className={styles.point}>
                    <Close className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_LOGO')}</span>
                </div>
                <div className={styles.point}>
                    <Close className={styles.icon} />
                    <span className={styles.pointText}>{t('ONBOARDING.TUTOR.VIDEO.POINT_PEOPLE')}</span>
                </div>
            </div>
        </OnboardingStepFormLayout>
    );
}
