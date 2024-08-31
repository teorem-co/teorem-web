import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingNotificationStep.module.scss';

export default function TutorOnboardingNotificationStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.NOTIFICATION.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.NOTIFICATION.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
