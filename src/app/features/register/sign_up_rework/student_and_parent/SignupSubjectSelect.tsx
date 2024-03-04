import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ISubject from '../../../../../interfaces/ISubject';
import { setStepZero } from '../../../../../slices/signUpSlice';
import { useAppSelector } from '../../../../hooks';
import { LevelCard } from './LevelCard';
import { levels } from './levels';
import { SubjectCard } from './SubjectCard';
import { allSubjects, popularSubjects } from './subjects';

interface Props {
    nextStep: () => void;
}

export const SignupSubjectSelect = (props: Props) => {
    const { nextStep } = props;
    const dispatch = useDispatch();
    const state = useAppSelector((state) => state.signUp);
    const { levelId, subjectId } = state;

    const [stateLevelId, setStateLevelId] = useState<string>(levelId);
    const [stateSubjectId, setStateSubjectId] = useState(subjectId);
    const [animate, setAnimate] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [showSubjectCards, setShowSubjectCards] = useState(levelId !== '');
    const [showLoadMoreSubjects, setShowLoadMoreSubjects] = useState(true);
    const [subjects, setSubjects] = useState<ISubject[]>(popularSubjects);
    const selectedRole = useAppSelector((state) => state.role.selectedRole);

    async function handleNextStep() {
        if (stateLevelId && stateSubjectId) {
            //TODO: set level and subject in state
            await dispatch(
                setStepZero({
                    levelId: stateLevelId,
                    subjectId: stateSubjectId,
                })
            );
            nextStep();
        }
    }

    useEffect(() => {
        if (stateLevelId && stateSubjectId) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [stateLevelId, stateSubjectId]);

    //animation
    useEffect(() => {
        if (stateLevelId && !subjectId) {
            setAnimate(true);
            setTimeout(() => {
                setShowSubjectCards(true);
            }, 50); // a small delay
        }

        return () => {
            setAnimate(false);
        };
    }, [stateLevelId]);

    function addAdditionalSubjects() {
        if (showLoadMoreSubjects) {
            setSubjects((prevSubjects) => [...prevSubjects, ...allSubjects]);
        } else {
            setSubjects((prevSubjects) => prevSubjects.filter((subject) => !allSubjects.some((allSubject) => allSubject.id === subject.id)));
        }

        setShowLoadMoreSubjects(!showLoadMoreSubjects);
    }

    return (
        <>
            <div className="signup-subject-container flex flex--center flex--col align--center sign-up-form-wrapper">
                <div className="flex--row level-card-container mb-4" style={{ gap: '10px', width: '100%' }}>
                    {levels.map((level) => (
                        <LevelCard
                            className={'font-family__poppins fw-300'}
                            onClick={() => setStateLevelId(level.id)}
                            key={level.id}
                            level={level}
                            isSelected={stateLevelId === level.id}
                        />
                    ))}
                </div>

                {showSubjectCards && (
                    <div className={`${animate ? 'slide-in' : ''}`}>
                        <div
                            className={`subject-card-container mb-3`}
                            style={{
                                justifyContent: 'center',
                            }}
                        >
                            {subjects.map((subject) => (
                                <SubjectCard
                                    className={'font-family__poppins fw-300'}
                                    subject={subject}
                                    key={subject.id}
                                    isSelected={stateSubjectId === subject.id}
                                    onClick={() => setStateSubjectId(subject.id)}
                                />
                            ))}
                        </div>

                        {showLoadMoreSubjects && (
                            <p
                                onClick={() => addAdditionalSubjects()}
                                id={`show-more-subjects-${selectedRole}`}
                                className="cur--pointer change-color-hover--primary font-family__poppins fw-300 info-text"
                            >
                                {t('REGISTER.FORM.LOAD_MORE_SUBJECTS')}
                            </p>
                        )}

                        {!showLoadMoreSubjects && (
                            <p
                                onClick={() => addAdditionalSubjects()}
                                id={`show-less-subjects-${selectedRole}`}
                                className="cur--pointer change-color-hover--primary font-family__poppins fw-300 info-text"
                            >
                                {t('REGISTER.FORM.HIDE_MORE_SUBJECTS')}
                            </p>
                        )}
                    </div>
                )}

                {showSubjectCards && stateSubjectId && (
                    <button
                        id={`next-button-subjects-${selectedRole}`}
                        disabled={buttonDisabled}
                        className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup transition__05"
                        onClick={handleNextStep}
                    >
                        {t('REGISTER.NEXT_BUTTON')}
                    </button>
                )}
            </div>
        </>
    );
};
