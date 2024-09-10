import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../../../components/OnboardingStepStartLayout';
import image from './assets/profile-image.png';
import useMount from '../../../../../../../utils/useMount';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';

export default function TutorOnboardingProfileStep() {
    const { t } = useTranslation();
    const { formik, setNextDisabled, setShowQuestions } = useTutorOnboarding();

    useMount(() => {
        setShowQuestions?.(false);
        setNextDisabled?.(false);
    });

    return (
        <OnboardingStepStartLayout
            stepLabel={t('ONBOARDING.TUTOR.PROFILE.STEP_LABEL')}
            title={t('ONBOARDING.TUTOR.PROFILE.TITLE')}
            description={t('ONBOARDING.TUTOR.PROFILE.DESCRIPTION')}
            imageSrc={image}
        ></OnboardingStepStartLayout>
    );
}
