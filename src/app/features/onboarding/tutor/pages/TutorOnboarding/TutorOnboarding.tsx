import OnboardingLayout from '../../../components/OnboardingLayout';
import { useState } from 'react';
import CtaButton from '../../../../../components/CtaButton';
import { Button } from '@mui/material';
import Sidebar from '../../../../../components/Sidebar';
import TutorOnboardingRouter from './components/TutorOnboardingRouter';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import { TFunction, useTranslation } from 'react-i18next';
import styles from './TutorOnboarding.module.scss';

function getCtaText(t: TFunction<'translation', undefined>, step: number, substep: number) {
    if (step === 1 && substep === 0) {
        return t('ONBOARDING.GET_STARTED');
    }

    if (step === 3 && substep === 7) {
        return t('ONBOARDING.PUBLISH');
    }
    return t('ONBOARDING.NEXT');
}

export default function TutorOnboarding() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { step, substep, maxSubstep, onBack, onNext, nextDisabled, showQuestions } = useTutorOnboarding();
    const { t } = useTranslation();

    const ctaText = getCtaText(t, step, substep);

    return (
        <OnboardingLayout
            header={
                showQuestions ? (
                    <Button
                        variant="outlined"
                        color="secondary"
                        className={styles.questions}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        {t('ONBOARDING.QUESTIONS')}
                    </Button>
                ) : null
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={
                <CtaButton fullWidth onClick={onNext} disabled={nextDisabled}>
                    {ctaText}
                </CtaButton>
            }
        >
            <Sidebar sideBarIsOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}></Sidebar>
            <TutorOnboardingRouter />
        </OnboardingLayout>
    );
}
