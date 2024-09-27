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
import useTutorOnboardingFormik from '../hooks/useTutorOnboardingFormik';
import { setUser } from '../../../../store/slices/authSlice';
import { PATHS } from '../../../../routes';
import { FormikContextType, FormikProvider } from 'formik';
import useMount from '../../../../utils/useMount';
import MAX_STEPS_MAP from '../constants/maxStepsMap';
import IOnboardingAvailability from '../types/IOnboardingAvailability';
import { DAY_STRINGS_MAP } from '../types/DayEnum';
import IOnboardingState from '../../../../types/IOnboardingState';
import { useLazyGetTutorByIdQuery } from '../../../../store/services/tutorService';

interface ITutorOnboardingContextValue {
    step: number;
    substep: number;
    maxSubstep: number;
    formik: FormikContextType<ITutorOnboardingFormValues>;
    onBack: () => void;
    onNext: () => void;
    onSaveState: () => Promise<IOnboardingState>;
    onSavePreview?: () => Promise<void>;
    nextDisabled?: boolean;
    setNextDisabled?: (value: boolean) => void;
    isLoading: boolean;
}

const TutorOnboardingContext = createContext<ITutorOnboardingContextValue>({} as ITutorOnboardingContextValue);

export default function TutorOnboardingProvider({ children }: Readonly<PropsWithChildren<{}>>) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [substep, setSubstep] = useState(0);
    const [maxSubstep, setMaxSubstep] = useState(MAX_STEPS_MAP[1]);
    const { user } = useAppSelector((state) => state.auth);
    const [getTutor] = useLazyGetTutorByIdQuery();
    const [setOnboardingState] = useSetOnboardingStateMutation();
    const [finishOnboarding] = useFinishOnboardingMutation();
    const [getUser] = useLazyGetUserQuery();
    const [getOnboardingState] = useLazyGetOnboardingStateQuery();
    const [nextDisabled, setNextDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        async (values: ITutorOnboardingFormValues, isPreview?: boolean) => {
            if (!user) throw new Error('User not found');

            const res = await finishOnboarding({
                userId: user?.id,
                isPreview,
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

            if (isPreview) return;

            // when saving for preview there is no redirect, we open a modal with the preview
            const res1 = await getUser(user?.id).unwrap();
            dispatch(setUser(res1));
            history.push(PATHS.DASHBOARD);
        },
        [dispatch, finishOnboarding, getUser, history, user]
    );

    const formik = useTutorOnboardingFormik(handleSubmit);

    const init = async () => {
        if (user?.onboardingCompleted || !user?.id) {
            return history.replace(PATHS.DASHBOARD);
        }

        const res = await getOnboardingState({
            userId: user?.id,
        }).unwrap();
        const tutorRes = await getTutor(user?.id).unwrap();

        if (res?.step && res?.substep) {
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

            if (res.formData?.length) {
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
        } else {
            const initValues = {
                imageLink: user?.profileImage,
                phoneNumber: user?.phoneNumber,
                profileTitle: tutorRes?.aboutTutor,
                profileDescription: tutorRes?.aboutLessons,
                subjects: tutorRes?.TutorSubjects.map((ts) => ({
                    levelId: ts.levelId,
                    subjectId: ts.subjectId,
                })),
                price: tutorRes?.maximumPrice,
                videoId: tutorRes?.videoUrl?.split('/')?.pop() ?? '',
            } as ITutorOnboardingFormValues;

            setStep(1);
            setSubstep(0);
            formik.setValues({
                ...formik.values,
                ...initValues,
            });
        }
    };

    useMount(() => {
        init().finally(() => setIsLoading(false));
    });

    const handleSaveState = useCallback(async () => {
        if (!user) throw new Error('User not found');
        return await setOnboardingState({
            userId: user?.id,
            onboardingState: {
                step,
                substep,
                formData: JSON.stringify(formik.values),
            },
        }).unwrap();
    }, [formik.values, setOnboardingState, step, substep, user]);

    const handleBack = useCallback(() => {
        goToPreviousStep();
    }, [goToPreviousStep]);

    const handleNext = useCallback(async () => {
        if (!user) throw new Error('User not found');

        if (step === 3 && substep === MAX_STEPS_MAP[3]) {
            return handleSubmit(formik.values);
        } else {
            handleSaveState().then(() => goToNextStep());
        }
    }, [formik.values, goToNextStep, handleSaveState, handleSubmit, step, substep, user]);

    const handleSavePreview = useCallback(() => {
        return handleSubmit(formik.values, true);
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
                onSaveState: handleSaveState,
                onSavePreview: handleSavePreview,
                nextDisabled,
                setNextDisabled,
                isLoading,
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
