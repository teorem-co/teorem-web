import OnboardingLayout from '../../../components/OnboardingLayout';
import { useState } from 'react';
import CtaButton from '../../../../../components/CtaButton';
import { Button } from '@mui/material';
import Sidebar from '../../../../../components/Sidebar';
import TutorOnboardingRouter from './components/TutorOnboardingRouter';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';
import { useTranslation } from 'react-i18next';

export default function TutorOnboarding() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { step, substep, maxSubstep, formik, onBack } = useTutorOnboarding();
    const { t } = useTranslation();

    return (
        <OnboardingLayout
            header={
                <Button variant="outlined" color="secondary" onClick={() => setIsSidebarOpen(true)}>
                    {t('ONBOADING.QUESTIONS')}
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={<CtaButton onClick={() => formik.handleSubmit()}>{t('ONBOADING.NEXT')}</CtaButton>}
        >
            <Sidebar sideBarIsOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}></Sidebar>
            <TutorOnboardingRouter />
        </OnboardingLayout>
    );
}
