import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingNotificationStep.module.scss';
import instantBookImage from './assets/thunder.png';
import manualApproveImage from './assets/chat.png';
import { useTutorOnboarding } from '../../../providers/TutorOnboardingProvider';
import { useEffect, useMemo, useState } from 'react';
import OnboardingTabButton from '../../../../components/OnboardingTabButton';
import OnboardingLayout from '../../../../components/OnboardingLayout';
import { Button } from '@mui/material';
import CtaButton from '../../../../../../components/CtaButton';
import onboardingStyles from '../../TutorOnboarding.module.scss';
import QUESTION_ARTICLES from '../../../constants/questionArticles';
import QuestionListItem from '../../../../components/QuestionListItem';
import { useAppSelector } from '../../../../../../store/hooks';

export default function TutorOnboardingNotificationStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, onBack, onNext, nextDisabled, step, substep, maxSubstep } = useTutorOnboarding();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { countries } = useAppSelector((state) => state.countryMarket);

    const countryAbrv = useMemo(
        () => countries.find((c) => c.id === user?.countryId)?.abrv,
        [countries, user?.countryId]
    );

    useEffect(() => {
        setNextDisabled?.(formik.values.autoAcceptBooking === null);
    }, [formik.values.autoAcceptBooking, setNextDisabled]);

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
            sidebar={QUESTION_ARTICLES.NOTIFICATION[countryAbrv ?? '']?.map((article) => (
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
                title={t('ONBOARDING.TUTOR.NOTIFICATION.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.NOTIFICATION.SUBTITLE')}
                centerOnDesktop
            >
                <OnboardingTabButton
                    active={formik.values.autoAcceptBooking === true}
                    onClick={() => {
                        formik.setFieldValue('autoAcceptBooking', true);
                    }}
                    image={instantBookImage}
                    title={t('ONBOARDING.TUTOR.NOTIFICATION.INSTANT_BOOK_TITLE')}
                    subtitle={t('ONBOARDING.TUTOR.NOTIFICATION.INSTANT_BOOK_SUBTITLE')}
                />
                <OnboardingTabButton
                    active={formik.values.autoAcceptBooking === false}
                    onClick={() => {
                        formik.setFieldValue('autoAcceptBooking', false);
                    }}
                    image={manualApproveImage}
                    title={t('ONBOARDING.TUTOR.NOTIFICATION.MANUAL_APPROVE_TITLE')}
                    subtitle={t('ONBOARDING.TUTOR.NOTIFICATION.MANUAL_APPROVE_SUBTITLE')}
                />
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
