import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useLazyGetProfileProgressQuery } from '../../../../../store/services/tutorService';
import useMount from '../../../../../utils/useMount';
import { PATHS } from '../../../../../routes';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { useCallback, useState } from 'react';
import CtaButton from '../../../../../components/CtaButton';
import { Button } from '@mui/material';
import Sidebar from '../../../../../components/Sidebar';
import { FormikProvider } from 'formik';
import ITutorOnboardingFormValues from '../../types/ITutorOnboardingFormValues';
import useTutorOnboardingFormik from './hooks/useTutorOnboardingFormik';
import TutorOnboardingRouter from './components/TutorOnboardingRouter';
import {
    useFinishOnboardingMutation,
    useLazyGetOnboardingStateQuery,
    useSetOnboardingStateMutation,
} from '../../../../../store/services/onboardingService';
import { useLazyGetUserQuery } from '../../../../../store/services/userService';
import { setUser } from '../../../../../store/slices/authSlice';

export default function TutorOnboarding() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { user } = useAppSelector((state) => state.auth);
    const [step, setStep] = useState(1);
    const [substep, setSubstep] = useState(0);
    const [maxSubstep, setMaxSubstep] = useState(3);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [getOnboardingState] = useLazyGetOnboardingStateQuery();
    const [setOnboardingState] = useSetOnboardingStateMutation();
    const [finishOnboarding] = useFinishOnboardingMutation();
    const [getUser] = useLazyGetUserQuery();

    const init = async () => {
        if (user?.onboardingCompleted || !user?.id) {
            return history.replace(PATHS.DASHBOARD);
        }
        getOnboardingState({
            userId: user?.id,
        });
    };

    useMount(() => {
        init();
    });

    const handleBack = useCallback(() => {
        if (step === 2 && substep === 0) {
            setStep((prevStep) => prevStep - 1);
            setSubstep(3);
        } else if (step === 3 && substep === 0) {
            setStep((prevStep) => prevStep - 1);
            setSubstep(6);
        } else {
            setSubstep((prevSubstep) => prevSubstep - 1);
        }
    }, [step, substep]);

    const handleSubmit = useCallback(
        async (values: ITutorOnboardingFormValues) => {
            if (!user) throw new Error('User not found');

            if (step === 3 && substep === 7) {
                const res = await finishOnboarding({
                    userId: user?.id,
                    onboardingState: {
                        step,
                        substep,
                        formData: JSON.stringify(values),
                    },
                }).unwrap();
                console.log(res);

                const res1 = await getUser(user?.id).unwrap();
                dispatch(setUser(res1));
                history.push(PATHS.DASHBOARD);
            } else {
                const res = await setOnboardingState({
                    userId: user?.id,
                    onboardingState: {
                        step,
                        substep,
                        formData: JSON.stringify(values),
                    },
                }).unwrap();
                console.log(res);

                if (step === 1 && substep === 3) {
                    setStep(2);
                    setSubstep(0);
                    setMaxSubstep(6);
                } else if (step === 2 && substep === 5) {
                    setStep(3);
                    setSubstep(0);
                    setMaxSubstep(8);
                } else {
                    setSubstep((prevSubstep) => prevSubstep + 1);
                }
            }
        },
        [dispatch, finishOnboarding, getUser, history, setOnboardingState, step, substep, user]
    );

    const formik = useTutorOnboardingFormik(handleSubmit);

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
            onBack={handleBack}
            actions={<CtaButton onClick={() => formik.handleSubmit()}>Next</CtaButton>}
        >
            <Sidebar sideBarIsOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}></Sidebar>
            <FormikProvider value={formik}>
                <TutorOnboardingRouter step={step} substep={substep} formik={formik} />
            </FormikProvider>
        </OnboardingLayout>
    );
}
