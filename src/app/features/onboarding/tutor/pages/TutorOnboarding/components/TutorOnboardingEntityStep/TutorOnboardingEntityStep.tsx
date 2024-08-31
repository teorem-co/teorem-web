import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';

export default function TutorOnboardingEntityStep() {
    const { t } = useTranslation();
    return <OnboardingStepFormLayout title={t('ONBOARDING.TUTOR.ENTITY.TITLE')}></OnboardingStepFormLayout>;
}
