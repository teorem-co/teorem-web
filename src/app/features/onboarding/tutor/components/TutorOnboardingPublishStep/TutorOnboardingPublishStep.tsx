import { useTranslation } from 'react-i18next';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../components/OnboardingLayout';
import CtaButton from '../../../../../components/CtaButton';
import styles from './TutorOnboardingPublishStep.module.scss';
import calendarImage from './assets/calendar.png';
import deviceImage from './assets/device.png';
import shareImage from './assets/share.png';
import TutorCard from '../../../../../components/TutorCard';
import PublishPoint from './components/PublishPoint';
import { useAppSelector } from '../../../../../store/hooks';
import { useMemo, useState } from 'react';
import IOnboardingSubject from '../../types/IOnboardingSubject';
import useMount from '../../../../../utils/useMount';
import Modal from '../../../../../components/Modal';
import { PATHS } from '../../../../../routes';
import { useLazyGetTutorByIdQuery } from '../../../../../store/services/tutorService';
import OnboardingLoader from '../../../components/OnboardingLoader';
import CalendarToday from '@mui/icons-material/CalendarToday';
import EditNote from '@mui/icons-material/EditNote';
import IosShare from '@mui/icons-material/IosShare';

export default function TutorOnboardingPublishStep() {
    const [t, i18n] = useTranslation();
    const { user } = useAppSelector((state) => state.auth);
    const { degrees } = useAppSelector((state) => state.degree);
    const { universities } = useAppSelector((state) => state.university);
    const { subjects } = useAppSelector((state) => state.subject);
    const { countries } = useAppSelector((state) => state.countryMarket);
    const [showPreview, setShowPreview] = useState(false);
    const [showIframeLoader, setShowIframeLoader] = useState(true);

    const { onBack, onNext, onSavePreview, step, substep, maxSubstep, formik, setNextDisabled } = useTutorOnboarding();
    const [getTutor, { data: tutorData }] = useLazyGetTutorByIdQuery();

    const education = useMemo(() => {
        if (formik.values.hasNoDegree) return undefined;

        const latestEducation = formik.values.degrees?.sort((a, b) => (b.startYear ?? 0) - (a.startYear ?? 0))[0];
        if (!latestEducation) return undefined;
        const degree = degrees.find((d) => d.id === latestEducation.degreeId);
        const university = universities.find((u) => u.id === latestEducation.universityId);
        if (!degree || !university) return undefined;

        return `${t('DEGREES.' + degree?.abrv)}, ${latestEducation.majorName}, ${t('UNIVERSITIES.' + university?.abrv)}`;
    }, [degrees, formik.values.degrees, formik.values.hasNoDegree, t, universities]);

    const displaySubjects = useMemo(() => {
        const uniqueSubjects = formik.values.subjects?.reduce((acc, curr) => {
            if (!acc.find((s) => s.subjectId === curr.subjectId)) {
                acc.push(curr);
            }
            return acc;
        }, [] as IOnboardingSubject[]);

        return uniqueSubjects
            ?.map((s) => {
                const subject = subjects.find((sub) => sub.id === s.subjectId);
                if (!subject) return '';
                return `${t('SUBJECTS.' + subject.abrv)}`;
            })
            .filter((s) => s.length > 0);
    }, [formik.values.subjects, subjects, t]);

    const marketCurrency = countries.find((c) => c.id === user?.countryId)?.currencyCode;

    const handlePublish = () => {
        onNext();
        setNextDisabled?.(true);
    };

    useMount(() => {
        if (!user?.id) {
            throw new Error('There is no user id');
        }
        onSavePreview?.();
        getTutor(user?.id);
    });

    return (
        <OnboardingLayout
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={handlePublish}>
                    {t('ONBOARDING.PUBLISH')}
                </CtaButton>
            }
        >
            <div className={styles.layout}>
                <div>
                    <h1 className={styles.title}>{t('ONBOARDING.TUTOR.PUBLISH.TITLE')}</h1>
                    <p className={styles.subtitle}>{t('ONBOARDING.TUTOR.PUBLISH.SUBTITLE')}</p>
                </div>
                <div className={styles.container}>
                    <div className={styles.tutorContainer}>
                        <TutorCard
                            name={user?.firstName + ' ' + user?.lastName[0] + '.'}
                            image={formik.values.imageLink}
                            price={parseFloat(formik.values.price + '').toLocaleString(i18n.language, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            education={education}
                            subjects={displaySubjects}
                            currency={t('CURRENCY.' + marketCurrency)}
                            actions={
                                <button
                                    className={styles.previewButton}
                                    onClick={() => {
                                        setShowIframeLoader(true);
                                        setShowPreview(true);
                                    }}
                                >
                                    {t('ONBOARDING.TUTOR.PUBLISH.SHOW_PREVIEW_BUTTON')}
                                </button>
                            }
                        />
                    </div>
                    <div className={styles.steps}>
                        <h2 className={styles.pointsTitle}>{t('ONBOARDING.TUTOR.PUBLISH.STEPS_TITLE')}</h2>
                        <PublishPoint
                            icon={<CalendarToday />}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_DESCRIPTION')}
                        />
                        <PublishPoint
                            icon={<EditNote />}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_DESCRIPTION')}
                        />
                        <PublishPoint
                            icon={<IosShare />}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_DESCRIPTION')}
                        />
                    </div>
                </div>
            </div>
            <Modal
                open={showPreview}
                title={t('ONBOARDING.TUTOR.PUBLISH.SHOW_PREVIEW_BUTTON')}
                onBackdropClick={() => setShowPreview(false)}
                onClose={() => setShowPreview(false)}
            >
                <div className={styles.iframeContainer}>
                    {showIframeLoader ? <OnboardingLoader /> : null}
                    <iframe
                        className={styles.iframe}
                        title="Preview"
                        onLoad={() => setShowIframeLoader(false)}
                        src={`${window.location.origin}${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutorData?.slug ?? '')}`}
                        width="100%"
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts "
                        height={window.innerHeight * 2}
                    ></iframe>
                    <div className={styles.overlay} />
                </div>
            </Modal>
        </OnboardingLayout>
    );
}
