import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import ITutorOnboardingFormValues from '../types/ITutorOnboardingFormValues';
import { useLazyGetUserQuery } from '../../../../store/services/userService';
import {
    useFinishOnboardingMutation,
    useLazyGetOnboardingStateQuery,
    useSetOnboardingStateMutation,
} from '../../../../store/services/onboardingService';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useHistory } from 'react-router';
import useTutorOnboardingFormik from '../pages/TutorOnboarding/hooks/useTutorOnboardingFormik';
import { setUser } from '../../../../store/slices/authSlice';
import { PATHS } from '../../../../routes';
import { FormikContextType, FormikProvider } from 'formik';
import useMount from '../../../../utils/useMount';

interface ITutorOnboardingContextValue {
    step: number;
    substep: number;
    maxSubstep: number;
    formik: FormikContextType<ITutorOnboardingFormValues>;
    onBack: () => void;
}

const TutorOnboardingContext = createContext<ITutorOnboardingContextValue>({} as ITutorOnboardingContextValue);

export default function TutorOnboardingProvider({ children }: Readonly<PropsWithChildren<{}>>) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [substep, setSubstep] = useState(0);
    const [maxSubstep, setMaxSubstep] = useState(3);
    const { user } = useAppSelector((state) => state.auth);
    const [setOnboardingState] = useSetOnboardingStateMutation();
    const [finishOnboarding] = useFinishOnboardingMutation();
    const [getUser] = useLazyGetUserQuery();
    const [getOnboardingState] = useLazyGetOnboardingStateQuery();

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

    return (
        <TutorOnboardingContext.Provider
            value={{
                step,
                substep,
                maxSubstep,
                formik,
                onBack: handleBack,
            }}
        >
            <FormikProvider value={formik}>{children}</FormikProvider>
        </TutorOnboardingContext.Provider>
    );
}

export function useTutorOnboarding() {
    const context = useContext(TutorOnboardingContext);

    if (!context) {
        throw new Error('useTutorOnboarding must be used within TutorOnboardingProvider');
    }

    return context;
}
