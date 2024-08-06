import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resetParentRegister, setSkip } from '../../store/slices/parentRegisterSlice';
import { resetSelectedRole, RoleOptions } from '../../store/slices/roleSlice';
import { resetStudentRegister } from '../../store/slices/studentRegisterSlice';
import { resetTutorRegister } from '../../store/slices/tutorRegisterSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import TrialPopup from './TrialPopup';
import logo from './../../../assets/images/logo.svg';
import ParentOnboarding from './components/ParentOnboarding';
import StudentOnboarding from './components/StudentOnboarding';
import TutorOnboarding from './components/TutorOnboarding';
import { setConfirmationModalOpen } from '../../store/slices/modalsSlice';

const Onboarding = () => {
    const [step, setStep] = useState<number>(1);
    const [trial, setTrial] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const roleSelection = useAppSelector((state) => state.role.selectedRole);
    const { t } = useTranslation();

    const handleGoBack = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const handleNextStepTutor = () => {
        if (step < 1) {
            setStep(step + 1);
        } else if (step === 1) {
            dispatch(resetTutorRegister());
            dispatch(resetSelectedRole());
            dispatch(setConfirmationModalOpen(true));
        }
    };
    const handleNextStepParent = () => {
        if (step < 2) {
            setStep(step + 1);
        } else if (step === 2) {
            dispatch(resetParentRegister());
            dispatch(resetSelectedRole());
            dispatch(setConfirmationModalOpen(true));
        }
    };

    const handleNextStepStudent = () => {
        dispatch(resetStudentRegister());
        dispatch(resetSelectedRole());
        dispatch(setConfirmationModalOpen(true));
    };
    const showDesc = (data: boolean) => {
        setShow(data);
    };

    return trial ? (
        <TrialPopup />
    ) : (
        <div className="onboarding">
            <div className="onboarding__content">
                <div className="flex--grow w--448--max">
                    <div className="mb-22">
                        <img className="w--128" src={logo} alt="Teorem" />
                    </div>
                    {roleSelection === RoleOptions.Tutor ? (
                        <div className="type--lg type--wgt--bold mb-4">
                            {step === 1
                                ? t('ONBOARDING.NAVIGATION.STEP_ONE.TITLE')
                                : step === 2
                                  ? t('ONBOARDING.NAVIGATION.TUTOR.STEP_TWO.TITLE')
                                  : ''}
                        </div>
                    ) : roleSelection === RoleOptions.Parent ? (
                        <>
                            <div className="type--lg type--wgt--bold mb-4">
                                {step === 1
                                    ? t('ONBOARDING.NAVIGATION.STEP_ONE.TITLE')
                                    : step === 2
                                      ? t('ONBOARDING.NAVIGATION.PARENT.STEP_TWO.TITLE')
                                      : ''}
                            </div>
                            {step === 2 && show ? (
                                <div className="type--wgt--regular mb-2">{t('ONBOARDING.EDIT_CHILD_DETAILS')}</div>
                            ) : null}
                        </>
                    ) : (
                        <div className="type--lg type--wgt--bold mb-4">{step === 1 ? 'Personal information' : ''}</div>
                    )}
                    {roleSelection === RoleOptions.Tutor ? (
                        <TutorOnboarding step={step} handleNextStep={handleNextStepTutor} handleGoBack={handleGoBack} />
                    ) : roleSelection === RoleOptions.Parent ? (
                        <ParentOnboarding
                            showDesc={(data) => showDesc(data)}
                            step={step}
                            handleNextStep={handleNextStepParent}
                            handleGoBack={handleGoBack}
                        />
                    ) : roleSelection === RoleOptions.Student ? (
                        <StudentOnboarding
                            step={step}
                            handleNextStep={handleNextStepStudent}
                            handleGoBack={handleGoBack}
                        />
                    ) : null}
                </div>
                <div className="flex--primary mt-8 w--448--max">
                    <div className="type--color--tertiary">{t('WATERMARK')}</div>
                    {roleSelection === RoleOptions.Parent && step === 2 && show ? (
                        <div>
                            {/* {t('LOGIN.ACCOUNT')}{' '} */}
                            You can add this later.{' '}
                            {/* <Link to={!isLoading ? PATHS.ROLE_SELECTION : '#'}>
                        {t('LOGIN.REGISTER')}
                    </Link> */}
                            <button
                                className="btn btn--clear type--wgt--extra-bold"
                                form="formSubmit"
                                onClick={() => dispatch(setSkip(true))}
                            >
                                Skip step
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
