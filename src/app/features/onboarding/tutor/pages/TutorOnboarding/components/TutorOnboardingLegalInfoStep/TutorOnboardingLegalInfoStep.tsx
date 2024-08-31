import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingLegalInfoStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.LEGAL_INFO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.LEGAL_INFO.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
