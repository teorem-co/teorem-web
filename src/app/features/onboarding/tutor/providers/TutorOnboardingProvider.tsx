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
import MAX_STEPS_MAP from '../constants/maxStepsMap';
import IOnboardingAvailability from '../types/IOnboardingAvailability';
import { DAY_STRINGS_MAP } from '../types/DayEnum';

interface ITutorOnboardingContextValue {
    step: number;
    substep: number;
    maxSubstep: number;
    formik: FormikContextType<ITutorOnboardingFormValues>;
    onBack: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    setNextDisabled?: (value: boolean) => void;
    showQuestions: boolean;
    setShowQuestions: (value: boolean) => void;
}

const TutorOnboardingContext = createContext<ITutorOnboardingContextValue>({} as ITutorOnboardingContextValue);

export default function TutorOnboardingProvider({ children }: Readonly<PropsWithChildren<{}>>) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [substep, setSubstep] = useState(0);
    const [maxSubstep, setMaxSubstep] = useState(MAX_STEPS_MAP[1]);
    const { user } = useAppSelector((state) => state.auth);
    const [setOnboardingState] = useSetOnboardingStateMutation();
    const [finishOnboarding] = useFinishOnboardingMutation();
    const [getUser] = useLazyGetUserQuery();
    const [getOnboardingState] = useLazyGetOnboardingStateQuery();
    const [nextDisabled, setNextDisabled] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    const goToNextStep = useCallback(() => {
        if (step === 1 && substep >= MAX_STEPS_MAP[1]) {
            setStep(2);
            setSubstep(0);
            setMaxSubstep(MAX_STEPS_MAP[2]);
        } else if (step === 2 && substep >= MAX_STEPS_MAP[2]) {
            setStep(3);
            setSubstep(0);
            setMaxSubstep(MAX_STEPS_MAP[3]);
        } else {
            setSubstep((prevSubstep) => prevSubstep + 1);
        }
    }, [step, substep]);

    const goToPreviousStep = useCallback(() => {
        if (step === 2 && substep === 0) {
            setStep((prevStep) => prevStep - 1);
            setSubstep(MAX_STEPS_MAP[1]);
            setMaxSubstep(MAX_STEPS_MAP[1]);
        } else if (step === 3 && substep === 0) {
            setStep((prevStep) => prevStep - 1);
            setSubstep(MAX_STEPS_MAP[2]);
            setMaxSubstep(MAX_STEPS_MAP[2]);
        } else {
            setSubstep((prevSubstep) => prevSubstep - 1);
        }
    }, [step, substep]);

    const handleSubmit = useCallback(
        async (values: ITutorOnboardingFormValues) => {
            console.log('Handle submit');
            if (!user) throw new Error('User not found');

            if (step === 3 && substep === MAX_STEPS_MAP[3]) {
                const res = await finishOnboarding({
                    userId: user?.id,
                    onboardingState: {
                        ...values,
                        // flatten availability object to array
                        availability: Object.values(values.availability || {})
                            .reduce(
                                (acc, val) => (val.selected ? acc.concat(val.entries || []) : []),
                                [] as IOnboardingAvailability[]
                            )
                            .map((a) => ({
                                ...a,
                                day: DAY_STRINGS_MAP[a.day],
                            })),
                    },
                }).unwrap();
                console.log(res);

                const res1 = await getUser(user?.id).unwrap();
                dispatch(setUser(res1));
                history.push(PATHS.DASHBOARD);
            } else {
                await setOnboardingState({
                    userId: user?.id,
                    onboardingState: {
                        step,
                        substep,
                        formData: JSON.stringify(values),
                    },
                }).unwrap();

                goToNextStep();
            }
        },
        [dispatch, finishOnboarding, getUser, goToNextStep, history, setOnboardingState, step, substep, user]
    );

    const formik = useTutorOnboardingFormik(handleSubmit);

    const init = async () => {
        if (user?.onboardingCompleted || !user?.id) {
            return history.replace(PATHS.DASHBOARD);
        }

        const res = await getOnboardingState({
            userId: user?.id,
        }).unwrap();
        console.log(res);

        if (res?.step) {
            if (res.step === 3 && res.substep === MAX_STEPS_MAP[3]) {
                setStep(3);
                setSubstep(MAX_STEPS_MAP[3]);
                setMaxSubstep(MAX_STEPS_MAP[3]);
            } else if (res.substep === MAX_STEPS_MAP[res.step as 1 | 2 | 3]) {
                setStep(res.step + 1);
                setSubstep(0);
                setMaxSubstep(MAX_STEPS_MAP[(res.step + 1) as 1 | 2 | 3]);
            } else {
                setStep(res.step);
                setSubstep(res.substep + 1);
                setMaxSubstep(MAX_STEPS_MAP[res.step as 1 | 2 | 3]);
            }

            if (res.formData) {
                try {
                    formik.setValues(JSON.parse(res.formData));
                } catch (e) {
                    console.error(e);
                    setStep(1);
                    setSubstep(0);
                    setMaxSubstep(MAX_STEPS_MAP[1]);
                    formik.setValues({} as ITutorOnboardingFormValues);
                }
            }
        }
    };

    useMount(() => {
        init();
    });

    const handleBack = useCallback(() => {
        goToPreviousStep();
    }, [goToPreviousStep]);

    const handleNext = useCallback(() => {
        handleSubmit(formik.values);
    }, [formik.values, handleSubmit]);

    return (
        <TutorOnboardingContext.Provider
            value={{
                step,
                substep,
                maxSubstep,
                formik,
                onBack: handleBack,
                onNext: handleNext,
                nextDisabled,
                setNextDisabled,
                showQuestions,
                setShowQuestions,
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
