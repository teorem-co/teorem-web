import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../components/OnboardingStepStartLayout';
import finishImage from './assets/finish-image.png';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import CtaButton from '../../../../../components/CtaButton';
import OnboardingLayout from '../../../components/OnboardingLayout';

export default function TutorOnboardingFinishingStep() {
    const { t } = useTranslation();

    const { onBack, onNext, step, substep, maxSubstep } = useTutorOnboarding();

    return (
        <OnboardingLayout
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext}>
                    {t('ONBOARDING.NEXT')}
                </CtaButton>
            }
        >
            <OnboardingStepStartLayout
                stepLabel={t('ONBOARDING.TUTOR.FINISHING.STEP_LABEL')}
                title={t('ONBOARDING.TUTOR.FINISHING.TITLE')}
                description={t('ONBOARDING.TUTOR.FINISHING.DESCRIPTION')}
                imageSrc={finishImage}
            ></OnboardingStepStartLayout>
        </OnboardingLayout>
    );
}
