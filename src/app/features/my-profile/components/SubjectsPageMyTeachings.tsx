import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useLazyGetProfileProgressQuery, useLazyGetTutorByIdQuery } from '../../../store/services/tutorService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserId } from '../../../utils/getUserId';
import { useTranslation } from 'react-i18next';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';
import { ITutorSubject, setStepOne } from '../../../store/slices/onboardingSlice';
import ITutorSubjectLevel from '../../../../interfaces/ITutorSubjectLevel';
import { ICreateSubjectOnboarding, useCreateSubjectsOnboardingMutation } from '../../../store/services/subjectService';
import { CreateSubjectCard } from '../../onboarding/tutorOnboardingNew/CreateSubjectCard';
import toastService from '../../../store/services/toastService';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

const SubjectsPage = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getProfileData, { data: myTeachingsData, isLoading: myTeachingsLoading, isUninitialized: myTeachingsUninitialized }] =
        useLazyGetTutorByIdQuery();

    const [createSubjectsOnboarding, { isError: creatingSubjectsError }] = useCreateSubjectsOnboardingMutation();

    const [btnDisabled, setBtnDisabled] = useState(true);
    const dispatch = useAppDispatch();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const [progressPercentage, setProgressPercentage] = useState(profileProgressState.percentage);
    const tutorId = getUserId();
    const [initialSubjects, setInitialSubjects] = useState<ITutorSubject[]>([]);
    const [oldSubjects, setOldSubjects] = useState<ITutorSubjectLevel[]>([]);
    const [forms, setForms] = useState<ITutorSubject[]>([]);
    const [showButton, setShowButton] = useState(false);
    const [isLastForm, setIsLastForm] = useState(true);

    const { t } = useTranslation();
    const isLoading = myTeachingsLoading || myTeachingsUninitialized;

    const fetchData = async () => {
        if (tutorId) {
            getProfileData(tutorId);

            const progressResponse = await getProfileProgress().unwrap();
            setProgressPercentage(progressResponse.percentage);
            //If there is no state in redux for profileProgress fetch data and save result to redux
            if (profileProgressState.percentage === 0) {
                const progressResponse = await getProfileProgress().unwrap();
                setProgressPercentage(progressResponse.percentage);
                dispatch(setMyProfileProgress(progressResponse));
            }
        }
    };

    useEffect(() => {
        if (myTeachingsData) {
            const arr: ITutorSubject[] = [];
            if (myTeachingsData.TutorSubjects.length == 0) {
                forms.push({
                    id: 0,
                    levelId: '',
                    subjectId: '',
                    price: '',
                });

                return;
            }

            myTeachingsData.TutorSubjects.map((subjectInfo) => {
                const subj: ITutorSubject = {
                    id: subjectInfo.id,
                    levelId: subjectInfo.levelId,
                    subjectId: subjectInfo.subjectId,
                    price: subjectInfo.price + '',
                };
                //if (!forms.some(form => form.id === subj.id)) {
                arr.push(subj);
                // }
            });
            setForms(arr);
            setInitialSubjects(arr);
            setOldSubjects(myTeachingsData.TutorSubjects);
        }
    }, [myTeachingsData]);

    async function handleSubmit() {
        if (tutorId) {
            dispatch(
                setStepOne({
                    subjects: myTeachingsData?.TutorSubjects ? myTeachingsData.TutorSubjects : [],
                })
            );

            const oldAndNewSubjectsAreEqual = areArraysEqual(oldSubjects, forms);
            const mappedSubjects = mapToCreateSubject(forms);
            if (!oldAndNewSubjectsAreEqual) {
                await createSubjectsOnboarding({
                    tutorId: tutorId,
                    subjects: mappedSubjects,
                }).then((res) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (res.error && res.error.status !== 409) toastService.success(t('MY_PROFILE.MY_TEACHINGS.UPDATED'));
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (res.error && res.error.status === 409) {
                            setForms(initialSubjects);
                            return;
                        }
                    }

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (!res.data) {
                        toastService.success(t('MY_PROFILE.MY_TEACHINGS.UPDATED'));
                        setInitialSubjects(forms);
                        fetchData();
                        return;
                    }
                });

                if (oldSubjects.length == 0) {
                    dispatch(
                        setMyProfileProgress({
                            ...profileProgressState,
                            myTeachings: true,
                            // percentage: profileProgressState.percentage + 25,
                        })
                    );
                }
            }
        }
    }

    function isValidUUID(uuid: string): boolean {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return regex.test(uuid);
    }

    function mapToCreateSubject(arr: ITutorSubject[]): ICreateSubjectOnboarding[] {
        const result: ICreateSubjectOnboarding[] = [];

        arr.forEach((subLev) => {
            if (typeof subLev.id === 'number') {
                result.push({
                    subjectId: subLev.subjectId,
                    levelId: subLev.levelId,
                    price: subLev.price,
                });
            } else if (subLev.id && !isValidUUID(subLev.id)) {
                result.push({
                    subjectId: subLev.subjectId,
                    levelId: subLev.levelId,
                    price: subLev.price,
                });
            } else {
                result.push({
                    id: subLev.id,
                    levelId: subLev.levelId,
                    subjectId: subLev.subjectId,
                    price: subLev.price,
                });
            }
        });

        return result;
    }

    function areArraysEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }

        return (
            arr1.every((obj1) =>
                arr2.some(
                    (obj2) => obj1.id === obj2.id && obj1.subjectId === obj2.subjectId && obj1.levelId === obj2.levelId && obj1.price === obj2.price
                )
            ) &&
            arr2.every((obj1) =>
                arr1.some(
                    (obj2) => obj1.id === obj2.id && obj1.subjectId === obj2.subjectId && obj1.levelId === obj2.levelId && obj1.price === obj2.price
                )
            )
        );
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const allValid = forms.every((form) => form.subjectId && form.levelId && form.price && +form.price >= 10 && Number.isInteger(+form.price));
        setBtnDisabled(!allValid);
    }, [forms]);

    useEffect(() => {
        setShowButton(!areArraysSame(initialSubjects, forms));
    }, [forms, initialSubjects]);

    const [nextId, setNextId] = useState(1);

    const handleAddForm = () => {
        setForms([...forms, { id: nextId, levelId: '', subjectId: '', price: '' }]);
        setNextId((prevState) => prevState + 1);
    };

    const handleRemoveForm = (id: number | string) => {
        const updatedForms = forms.filter((form) => form.id !== id);
        setForms(updatedForms);
    };

    const updateForm = (id: number | string, newValues: any) => {
        setForms((prevForms) => prevForms.map((form) => (form.id === id ? { ...form, ...newValues } : form)));
    };

    useEffect(() => {
        setIsLastForm(forms.length == 1);
    }, [forms]);

    const areSubjectsEqual = (subject1: ITutorSubject, subject2: ITutorSubject) => {
        return (
            subject1.tutorId === subject2.tutorId &&
            subject1.levelId === subject2.levelId &&
            subject1.subjectId === subject2.subjectId &&
            +subject1.price === +subject2.price
        );
    };

    const areArraysSame = (arr1: ITutorSubject[], arr2: ITutorSubject[]) => {
        if (arr1.length !== arr2.length) return false;

        return arr1.every((subject1) => arr2.some((subject2) => areSubjectsEqual(subject1, subject2)));
    };

    function handleCancel() {
        setForms(initialSubjects);
    }

    return (
        <>
            <div
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {(isLoading && <LoaderPrimary />) || (
                    <div
                        className="flex--center"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    minWidth: '100px',
                                    maxWidth: 'fit-content',
                                    overflowY: 'unset',
                                }}
                                className=" dash-wrapper--adaptive flex--grow flex--col flex--jc--space-between"
                            >
                                <div>
                                    {forms.map((subject) => (
                                        <CreateSubjectCard
                                            data={subject}
                                            key={subject.id + subject.subjectId + subject.levelId}
                                            isLastForm={isLastForm}
                                            updateForm={updateForm}
                                            id={subject.id}
                                            removeItem={() => handleRemoveForm(subject.id)}
                                            handleGetData={() => getProfileData(tutorId ? tutorId : '')}
                                        />
                                    ))}
                                </div>
                                <div className="dash-wrapper__item w--100">
                                    <div className="dash-wrapper__item__element dash-border" onClick={() => handleAddForm()}>
                                        <div className="flex--primary cur--pointer flex-gap-10">
                                            <div className="type--wgt--bold">{t('MY_PROFILE.MY_TEACHINGS.ADD_NEW')}</div>
                                            <i className="icon icon--base icon--plus icon--primary"></i>
                                        </div>
                                    </div>
                                </div>
                                {showButton && (
                                    <div className="flex flex--col flex--ai--center flex--jc--center">
                                        <ButtonPrimaryGradient
                                            onClick={() => handleSubmit()}
                                            disabled={btnDisabled}
                                            className="btn btn--lg mt-4 mb-4"
                                        >
                                            {t('MY_PROFILE.MY_TEACHINGS.SAVE')}
                                        </ButtonPrimaryGradient>

                                        {/*<button*/}
                                        {/*  onClick={() => handleCancel()}*/}
                                        {/*  className='btn btn--sm mt-1 pr-4 pl-4 pt-2 pb-2 btn--ghost--error'>*/}
                                        {/*  {t('MY_PROFILE.MY_TEACHINGS.CANCEL')}*/}
                                        {/*</button>*/}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SubjectsPage;
