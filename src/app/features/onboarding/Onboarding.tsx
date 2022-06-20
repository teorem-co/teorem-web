import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { resetParentRegister, setSkip } from '../../../slices/parentRegisterSlice';
import { resetSelectedRole , RoleOptions } from '../../../slices/roleSlice';
import { resetStudentRegister } from '../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../slices/tutorRegisterSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import EmailConfirmationModal from '../register/EmailConfirmationModal';
import TrialPopup from '../register/TrialPopup';
import logo from './../../../assets/images/logo.svg';
import NavigationParent from './components/NavigationParent';
import NavigationStudent from './components/NavigationStudent';
import NavigationTutor from './components/NavigationTutor';
import ParentOnboarding from './components/ParentOnboarding';
import StudentOnboarding from './components/StudentOnboarding';
import TutorOnboarding from './components/TutorOnboarding';

const Onboarding = () => {
    const [step, setStep] = useState<number>(1);
    const [emailConfirmationModalOpen, setEmailConfirmationModalOpen] = useState<boolean>(false);
    const [trial, setTrial] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const roleSelection = useAppSelector((state) => state.role.selectedRole);
    const history = useHistory();
    const { t } = useTranslation();

    const handleGoBack = () => {
        if (step === 1) {
            history.push(PATHS.REGISTER);
        } else if (step === 2) {
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
            setEmailConfirmationModalOpen(true);
            // history.push(PATHS.LOGIN);
            // setTrial(true);
            //if there is step with card informations
            // } else if (step === 2) {
            //     setTrial(true);
        }
    };
    const handleNextStepParent = () => {
        if (step < 2) {
            setStep(step + 1);
        } else if (step === 2) {
            dispatch(resetParentRegister());
            dispatch(resetSelectedRole());
            history.push(PATHS.LOGIN);
        }
    };

    const handleNextStepStudent = () => {
        dispatch(resetStudentRegister());
        dispatch(resetSelectedRole());
        history.push(PATHS.LOGIN);
    };
    const showDesc = (data: boolean) => {
        setShow(data);
    };

    return (
        <>
            {trial ? (
                <TrialPopup />
            ) : 
            emailConfirmationModalOpen ? (
                <EmailConfirmationModal/>
            ) :
            (
                <div className="onboarding">
                    <div className="onboarding__aside">
                        <div className="onboarding__steps">
                            <div className="type--lg type--wgt--bold mb-2">{t('ONBOARDING.NAVIGATION.TITLE')}</div>
                            <div className="w--350--max mb-10 type--wgt--regular type--color--secondary">
                                {t('ONBOARDING.NAVIGATION.DESCRIPTION')}
                            </div>
                            <div className="steps">
                                {roleSelection === RoleOptions.Tutor ? (
                                    <NavigationTutor step={step} />
                                ) : roleSelection === RoleOptions.Parent ? (
                                    <NavigationParent step={step} />
                                ) : (
                                    <NavigationStudent />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="onboarding__content">
                        <div className="flex--grow w--448--max">
                            <div className="mb-22">
                                <img className="w--128" src={logo} alt="Teorem" />
                            </div>
                            {roleSelection === RoleOptions.Tutor ? (
                                <div className="type--lg type--wgt--bold mb-4">
                                    {step === 1 
                                    ? t('ONBOARDING.NAVIGATION.STEP_ONE.TITLE') 
                                    : step === 2 ? t('ONBOARDING.NAVIGATION.TUTOR.STEP_TWO.TITLE') : ''}
                                </div>
                            ) : roleSelection === RoleOptions.Parent ? (
                                <>
                                    <div className="type--lg type--wgt--bold mb-4">
                                        {step === 1 
                                        ? t('ONBOARDING.NAVIGATION.STEP_ONE.TITLE')
                                         : step === 2 ? t('ONBOARDING.NAVIGATION.PARENT.STEP_TWO.TITLE') : ''}
                                    </div>
                                    {step === 1 ? (
                                        <></>
                                    ) : step === 2 && show ? (
                                        <div className="type--wgt--regular mb-2">{t('ONBOARDING.EDIT_CHILD_DETAILS')}</div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <div className="type--lg type--wgt--bold mb-4">{step === 1 ? 'Personal information' : ''}</div>
                            )}
                            {roleSelection === RoleOptions.Tutor ? (
                                <>
                                    <TutorOnboarding step={step} handleNextStep={handleNextStepTutor} handleGoBack={handleGoBack} />
                                </>
                            ) : roleSelection === RoleOptions.Parent ? (
                                <>
                                    <ParentOnboarding
                                        showDesc={(data) => showDesc(data)}
                                        step={step}
                                        handleNextStep={handleNextStepParent}
                                        handleGoBack={handleGoBack}
                                    />
                                </>
                            ) : roleSelection === RoleOptions.Student ? (
                                <StudentOnboarding step={step} handleNextStep={handleNextStepStudent} handleGoBack={handleGoBack} />
                            ) : (
                                history.push(PATHS.LOGIN)
                            )}
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
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Onboarding;
