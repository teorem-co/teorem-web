import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingVideoStep.module.scss';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ITutorVideoInformation,
    useLazyGetTutorVideoInformationQuery,
} from '../../../../../store/services/tutorService';
import { UploadedVideoComponent } from '../../../../my-profile/VideoRecorder/UploadedVideoComponent/UploadedVideoComponent';
import CheckBox from '@mui/icons-material/CheckBox';
import Close from '@mui/icons-material/Close';
import { VideoUploadArea } from '../../../../my-profile/VideoRecorder/VideoUploadArea';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../constants/questionArticles';
import QuestionListItem from '../../../components/QuestionListItem';
import { useAppSelector } from '../../../../../store/hooks';
import { FormikContextType } from 'formik';
import ITutorOnboardingFormValues from '../../types/ITutorOnboardingFormValues';
import useMount from '../../../../../utils/useMount';
import OndemandVideo from '@mui/icons-material/OndemandVideo';
import clsx from 'clsx';
import VIDEO_EXAMPLE from './constant/videoExample';

const fetchData = async (formik: FormikContextType<ITutorOnboardingFormValues>, getter: () => any) => {
    const videoInfo = await getter().unwrap();

    if (videoInfo.url) {
        const lastIndexOfSlash = videoInfo.url.lastIndexOf('/');
        const videoId = videoInfo.url.substring(lastIndexOfSlash + 1);
        formik.setFieldValue('videoId', videoId);
    }
    return videoInfo;
};

export default function TutorOnboardingVideoStep() {
    const { t } = useTranslation();
    const { formik, setNextDisabled, onBack, onNext, onSaveState, nextDisabled, step, substep, maxSubstep } =
        useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [getVideoInformation] = useLazyGetTutorVideoInformationQuery();
    const [videoInformation, setVideoInformation] = useState<ITutorVideoInformation>({
        url: undefined,
        approved: undefined,
        videoTranscoded: false,
    });
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);
    const { languages } = useAppSelector((state) => state.lang);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    const languageAbrv = useMemo(
        () => languages.find((l) => l.id === user?.languageId)?.abrv,
        [languages, user?.languageId]
    );

    useMount(() => {
        setNextDisabled?.(!!formik.errors.videoId && false); //TODO: Remove false
        fetchData(formik, getVideoInformation).then((videoInfo) => setVideoInformation(videoInfo));
    });

    useEffect(() => {
        setNextDisabled?.(!!formik.errors.videoId && false);
    }, [setNextDisabled, formik.errors.videoId]);

    const demoLink = VIDEO_EXAMPLE[(languageAbrv as 'HR' | 'EN') ?? 'EN'];

    return (
        <OnboardingLayout
            header={
                <Button
                    variant="outlined"
                    color="secondary"
                    className={onboardingStyles.questions}
                    onClick={() => setIsSidebarOpen(true)}
                >
                    {t('ONBOARDING.QUESTIONS')}
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext} disabled={nextDisabled}>
                    {t('ONBOARDING.NEXT')}
                </CtaButton>
            }
            isSidebarOpen={isSidebarOpen}
            onSidebarClose={() => setIsSidebarOpen(false)}
            sidebar={QUESTION_ARTICLES.VIDEO[countryAbrv ?? '']?.map((article) => (
                <QuestionListItem
                    key={article.title}
                    description={article.description}
                    title={article.title}
                    link={article.link}
                    image={article.image}
                />
            ))}
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.VIDEO.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.VIDEO.SUBTITLE')}
            >
                <div className={styles.content}>
                    {videoInformation.url ? (
                        <UploadedVideoComponent
                            fetchData={() => fetchData(formik, getVideoInformation).then((d) => setVideoInformation(d))}
                            onDelete={onSaveState}
                            videoInformation={videoInformation}
                        />
                    ) : (
                        <VideoUploadArea
                            fetchData={() => {
                                async function pinger() {
                                    const info = (await fetchData(
                                        formik,
                                        getVideoInformation
                                    )) as ITutorVideoInformation;

                                    setVideoInformation(info);

                                    if (!info.videoTranscoded) {
                                        setTimeout(() => {
                                            pinger();
                                        }, 5000);
                                    }
                                }

                                pinger();
                            }}
                        />
                    )}
                </div>
                {formik.touched?.videoId && formik.errors?.videoId ? (
                    <div className="field__validation">{formik.errors.videoId}</div>
                ) : null}
                <h2 className={styles.pointsTitle}>{t('ONBOARDING.TUTOR.VIDEO.POINT_TITLE')}</h2>
                <div className={styles.points}>
                    <div className={styles.point}>
                        <OndemandVideo className={styles.icon} />
                        <a
                            href={demoLink}
                            rel="noopener noreferrer"
                            target="_blank"
                            className={clsx(styles.pointText, styles.pointLink)}
                        >
                            {t('ONBOARDING.TUTOR.VIDEO.POINT_DEMO')}
                        </a>
                    </div>
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
        </OnboardingLayout>
    );
}
