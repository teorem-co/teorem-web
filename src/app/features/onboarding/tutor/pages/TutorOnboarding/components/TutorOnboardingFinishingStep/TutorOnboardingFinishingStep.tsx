import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../../../components/OnboardingStepStartLayout';
import finishImage from './assets/finish-image.png';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import useMount from '../../../../../../../utils/useMount';

export default function TutorOnboardingFinishingStep() {
    const { t } = useTranslation();

    const { setNextDisabled } = useTutorOnboarding();

    useMount(() => {
        setNextDisabled?.(false);
    });

    return (
        <OnboardingStepStartLayout
            stepLabel={t('ONBOARDING.TUTOR.FINISHING.STEP_LABEL')}
            title={t('ONBOARDING.TUTOR.FINISHING.TITLE')}
            description={t('ONBOARDING.TUTOR.FINISHING.DESCRIPTION')}
            imageSrc={finishImage}
        ></OnboardingStepStartLayout>
    );
}
