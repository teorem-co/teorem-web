import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingNotificationStep.module.scss';
import instantBookImage from './assets/thunder.png';
import manualApproveImage from './assets/chat.png';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import { useEffect } from 'react';
import OnboardingTabButton from '../../../../../components/OnboardingTabButton';

export default function TutorOnboardingNotificationStep() {
    const { t } = useTranslation();
    const { setNextDisabled, formik, setShowQuestions } = useTutorOnboarding();

    useEffect(() => {
        setShowQuestions?.(true);
        setNextDisabled?.(formik.values.autoAcceptBooking === null);
    }, [formik.values.autoAcceptBooking, setNextDisabled, setShowQuestions]);

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.NOTIFICATION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.NOTIFICATION.SUBTITLE')}
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
    );
}
