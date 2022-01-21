import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { resetParentRegister } from '../../../slices/parentRegisterSlice';
import { RoleOptions } from '../../../slices/roleSlice';
import { resetStudentRegister } from '../../../slices/studentRegisterSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
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
    const [trial, setTrial] = useState<boolean>(false);
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
        if (step < 2) {
            setStep(step + 1);
        } else if (step === 2) {
            setTrial(true);
        }
    };
    const handleNextStepParent = () => {
        if (step < 2) {
            setStep(step + 1);
        } else if (step === 2) {
            dispatch(resetParentRegister());
            history.push('/');
        }
    };

    const handleNextStepStudent = () => {
        history.push('/');
    };

    return (
        <>
            {trial ? (
                <TrialPopup />
            ) : (
                <div className="onboarding">
                    <div className="onboarding__aside">
                        <div className="onboarding__steps">
                            <div className="type--lg type--wgt--bold mb-2">
                                Welcome to Teorem!
                            </div>
                            <div className="w--350--max mb-10 type--wgt--regular type--color--secondary">
                                Please follow the onboarding process to finish
                                up your profile. It'll take only few minutes.
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
                        <div className="flex--grow">
                            <div className="mb-22">
                                <img
                                    className="w--128"
                                    src={logo}
                                    alt="Teorem"
                                />
                            </div>
                            {roleSelection === RoleOptions.Tutor ? (
                                <div className="type--lg type--wgt--bold mb-4">
                                    {step === 1
                                        ? 'Personal information'
                                        : step === 2
                                        ? 'Card Details'
                                        : ''}
                                </div>
                            ) : roleSelection === RoleOptions.Parent ? (
                                <>
                                    <div className="type--lg type--wgt--bold mb-4">
                                        {step === 1
                                            ? 'Personal information'
                                            : step === 2
                                            ? "Child's List"
                                            : ''}
                                    </div>
                                    {step === 1 ? (
                                        <></>
                                    ) : step === 2 ? (
                                        <div className="type--wgt--regular mb-2">
                                            Edit child's details
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <div className="type--lg type--wgt--bold mb-4">
                                    {step === 1 ? 'Personal information' : ''}
                                </div>
                            )}
                            {roleSelection === RoleOptions.Tutor ? (
                                <>
                                    <TutorOnboarding
                                        step={step}
                                        handleNextStep={handleNextStepTutor}
                                        handleGoBack={handleGoBack}
                                    />
                                </>
                            ) : roleSelection === RoleOptions.Parent ? (
                                <>
                                    <ParentOnboarding
                                        step={step}
                                        handleNextStep={handleNextStepParent}
                                        handleGoBack={handleGoBack}
                                    />
                                </>
                            ) : roleSelection === RoleOptions.Student ? (
                                <StudentOnboarding
                                    step={step}
                                    handleNextStep={handleNextStepStudent}
                                    handleGoBack={handleGoBack}
                                />
                            ) : (
                                history.push('/')
                            )}
                        </div>
                        <div className="flex--primary mt-8 w--448--max">
                            <div className="type--color--tertiary">
                                {t('WATERMARK')}
                            </div>
                            {roleSelection === RoleOptions.Parent &&
                            step === 2 ? (
                                <div>
                                    {/* {t('LOGIN.ACCOUNT')}{' '} */}
                                    You can add this later.{' '}
                                    {/* <Link to={!isLoading ? PATHS.ROLE_SELECTION : '#'}>
                        {t('LOGIN.REGISTER')}
                    </Link> */}
                                    <Link to={'/'}>Skip step</Link>
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
