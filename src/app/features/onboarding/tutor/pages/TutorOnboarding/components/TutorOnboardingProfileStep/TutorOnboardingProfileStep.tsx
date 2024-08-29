import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../../../components/OnboardingStepStartLayout';
import image from './assets/profile-image.png';

export default function TutorOnboardingProfileStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepStartLayout
            stepLabel={t('ONBOARDING.TUTOR.PROFILE.STEP_LABEL')}
            title={t('ONBOARDING.TUTOR.PROFILE.TITLE')}
            description={t('ONBOARDING.TUTOR.PROFILE.DESCRIPTION')}
            imageSrc={image}
        ></OnboardingStepStartLayout>
    );
}
