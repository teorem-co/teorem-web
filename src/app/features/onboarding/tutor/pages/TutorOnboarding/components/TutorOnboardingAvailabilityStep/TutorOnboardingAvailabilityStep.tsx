import { useTranslation } from 'react-i18next';
import styles from './TutorOnboardingAvailabilityStep.module.scss';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingAvailabilityStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.AVAILABILITY.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.AVAILABILITY.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
