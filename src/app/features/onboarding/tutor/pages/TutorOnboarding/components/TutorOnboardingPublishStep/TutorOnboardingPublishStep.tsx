import { useTranslation } from 'react-i18next';
import OnboardingStepFormLayout from '../../../../../components/OnboardingStepFormLayout';
import { useTutorOnboarding } from '../../../../providers/TutorOnboardingProvider';
import OnboardingLayout from '../../../../../components/OnboardingLayout';
import CtaButton from '../../../../../../../components/CtaButton';
import styles from './TutorOnboardingPublishStep.module.scss';
import calendarImage from './assets/calendar.png';
import deviceImage from './assets/device.png';
import shareImage from './assets/share.png';
import TutorCard from '../../../../../../../components/TutorCard';
import { Typography } from '@mui/material';
import PublishStep from './components/PublishStep';

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
                centerOnDesktop
            >
                <div className={styles.container}>
                    <div>
                        <TutorCard />
                    </div>
                    <div className={styles.steps}>
                        <Typography variant="h5">{t('ONBOARDING.TUTOR.PUBLISH.STEPS_TITLE')}</Typography>
                        <PublishStep
                            icon={calendarImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_1_DESCRIPTION')}
                        />
                        <PublishStep
                            icon={deviceImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_2_DESCRIPTION')}
                        />
                        <PublishStep
                            icon={shareImage}
                            title={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_TITLE')}
                            description={t('ONBOARDING.TUTOR.PUBLISH.STEP_3_DESCRIPTION')}
                        />
                    </div>
                </div>
            </OnboardingStepFormLayout>
        </OnboardingLayout>
    );
}
