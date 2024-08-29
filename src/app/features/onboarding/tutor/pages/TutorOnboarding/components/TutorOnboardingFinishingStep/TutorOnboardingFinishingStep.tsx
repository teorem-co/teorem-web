import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../../../components/OnboardingStepStartLayout';
import finishImage from './assets/finish-image.png';

export default function TutorOnboardingFinishingStep() {
    const { t } = useTranslation();
    return (
        <OnboardingStepStartLayout
            stepLabel={t('ONBOARDING.TUTOR.FINISHING.STEP_LABEL')}
            title={t('ONBOARDING.TUTOR.FINISHING.TITLE')}
            description={t('ONBOARDING.TUTOR.FINISHING.DESCRIPTION')}
            imageSrc={finishImage}
        ></OnboardingStepStartLayout>
    );
}
