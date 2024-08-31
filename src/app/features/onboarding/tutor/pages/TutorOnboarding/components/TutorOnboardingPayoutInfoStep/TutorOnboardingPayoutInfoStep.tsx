import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingPayoutInfoStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PAYOUT_INFO.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PAYOUT_INFO.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
