import { useTranslation } from 'react-i18next';
import OnboardingStepStartLayout from '../../../components/OnboardingStepStartLayout';
import image from './assets/lessons-image.png';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../components/OnboardingLayout';
import CtaButton from '../../../../../components/CtaButton';

export default function TutorOnboardingLessonsStep() {
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
                stepLabel={t('ONBOARDING.TUTOR.LESSONS.STEP_LABEL')}
                title={t('ONBOARDING.TUTOR.LESSONS.TITLE')}
                description={t('ONBOARDING.TUTOR.LESSONS.DESCRIPTION')}
                imageSrc={image}
            ></OnboardingStepStartLayout>
        </OnboardingLayout>
    );
}
