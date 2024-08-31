import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingPublishStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PUBLISH.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PUBLISH.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
