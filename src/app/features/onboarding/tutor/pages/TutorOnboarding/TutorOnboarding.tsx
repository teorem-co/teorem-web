import OnboardingLayout from '../../../components/OnboardingLayout';
import { useState } from 'react';
import CtaButton from '../../../../../components/CtaButton';
import { Button } from '@mui/material';
import Sidebar from '../../../../../components/Sidebar';
import TutorOnboardingRouter from './components/TutorOnboardingRouter';
import { useTutorOnboarding } from '../../providers/TutorOnboardingProvider';

export default function TutorOnboarding() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { step, substep, maxSubstep, formik, onBack } = useTutorOnboarding();

    return (
        <OnboardingLayout
            header={
                <Button variant="outlined" color="secondary" onClick={() => setIsSidebarOpen(true)}>
                    Questions?
                </Button>
            }
            step={step}
            substep={substep}
            maxSubstep={maxSubstep}
            onBack={onBack}
            actions={<CtaButton onClick={() => formik.handleSubmit()}>Next</CtaButton>}
        >
            <Sidebar sideBarIsOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}></Sidebar>
            <TutorOnboardingRouter />
        </OnboardingLayout>
    );
}
