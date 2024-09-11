import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';

export default function TutorOnboardingPublishStep() {
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
                    {t('ONBOARDING.PUBLISH')}
                </CtaButton>
            }
        >
            <OnboardingStepFormLayout
                title={t('ONBOARDING.TUTOR.PUBLISH.TITLE')}
                subtitle={t('ONBOARDING.TUTOR.PUBLISH.SUBTITLE')}
            ></OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
