import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import useMount from '../../../../../../../utils/useMount';

export default function TutorOnboardingPublishStep() {
    const { t } = useTranslation();

    const { setNextDisabled, setShowQuestions } = useTutorOnboarding();

    useMount(() => {
        setShowQuestions?.(false);
        setNextDisabled?.(false);
    });

    return (
        <OnboardingStepFormLayout
            title={t('ONBOARDING.TUTOR.PUBLISH.TITLE')}
            subtitle={t('ONBOARDING.TUTOR.PUBLISH.SUBTITLE')}
        ></OnboardingStepFormLayout>
    );
}
