import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import styles from './TutorOnboardingVideoStep.module.scss';

export default function TutorOnboardingVideoStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.VIDEO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.VIDEO.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
