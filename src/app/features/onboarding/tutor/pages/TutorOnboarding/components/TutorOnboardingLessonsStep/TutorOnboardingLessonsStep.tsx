import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../../../components/OnboardingStepStartLayout';
import image from './assets/lessons-image.png';

export default function TutorOnboardingLessonsStep() {
    const { t } = useTranslation();

    return (
        <OnboardingStepStartLayout
            stepLabel={t('ONBOARDING.TUTOR.LESSONS.STEP_LABEL')}
            title={t('ONBOARDING.TUTOR.LESSONS.TITLE')}
            description={t('ONBOARDING.TUTOR.LESSONS.DESCRIPTION')}
            imageSrc={image}
        ></OnboardingStepStartLayout>
    );
}
