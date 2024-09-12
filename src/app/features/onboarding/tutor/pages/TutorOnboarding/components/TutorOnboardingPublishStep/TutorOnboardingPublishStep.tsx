import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';
import styles from './TutorOnboardingPublishStep.module.scss';
import calendarImage from './assets/calendar.png';
import deviceImage from './assets/device.png';
import shareImage from './assets/share.png';
import TutorCard from '../../../../../../../components/TutorCard';
import { Typography } from '@mui/material';
import PublishPoint from './components/PublishPoint';
import { useAppSelector } from '../../../../../../../store/hooks';
import { useMemo } from 'react';
import IOnboardingSubject from '../../../../types/IOnboardingSubject';

export default function TutorOnboardingPublishStep() {
    const [t, i18n] = useTranslation();
    const { user } = useAppSelector((state) => state.auth);
    const { degrees } = useAppSelector((state) => state.degree);
    const { universities } = useAppSelector((state) => state.university);
    const { subjects } = useAppSelector((state) => state.subject);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const { onBack, onNext, step, substep, maxSubstep, formik, setNextDisabled } = useTutorOnboarding();

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

    const marketAbrv = countries.find((c) => c.id === user?.countryId)?.abrv;

    const handlePublish = () => {
        onNext();
        setNextDisabled?.(true);
    };

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
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.PUBLISH.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.PUBLISH.SUBTITLE')}
                centerOnDesktop
            >
                <div className={styles.container}>
                    <div>
                        <TutorCard
                            name={user?.firstName + ' ' + user?.lastName[0] + '.'}
                            image={formik.values.imageLink}
                            price={parseFloat(formik.values.price + '').toLocaleString(i18n.language, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            education={education}
                            subjects={displaySubjects}
                            currency={t('CURRENCY.' + marketAbrv)}
                        />
                    </div>
                    <div className={styles.steps}>
                        <Typography variant="h5">{t('ONBOARDING.TUTOR.PUBLISH.STEPS_TITLE')}</Typography>
                        <PublishPoint
                            icon={calendarImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_DESCRIPTION')}
                        />
                        <PublishPoint
                            icon={deviceImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_DESCRIPTION')}
                        />
                        <PublishPoint
                            icon={shareImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_DESCRIPTION')}
                        />
                    </div>
                </div>
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
