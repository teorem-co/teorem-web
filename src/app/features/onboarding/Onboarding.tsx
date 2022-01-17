import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { RoleOptions } from '../../../slices/roleSlice';
import { useAppSelector } from '../../hooks';
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

    const handleNextStep = () => {
        if (step < 2) {
            setStep(step + 1);
        } else if (step === 2) {
            setTrial(true);
        }
    };

    const handleNextStepStudent = () => {
        setTrial(true);
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
                                Welcome to Theorem!
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
                            <div className="type--lg type--wgt--bold mb-4">
                                {step === 1
                                    ? 'Personal information'
                                    : step === 2
                                    ? 'My Teachings'
                                    : 'Additional information'}
                            </div>
                            {roleSelection === RoleOptions.Tutor ? (
                                <>
                                    <TutorOnboarding
                                        step={step}
                                        handleNextStep={handleNextStep}
                                        handleGoBack={handleGoBack}
                                    />
                                </>
                            ) : roleSelection === RoleOptions.Parent ? (
                                <>
                                    <ParentOnboarding
                                        step={step}
                                        handleNextStep={handleNextStep}
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
                        <div className="mt-8">
                            <div className="type--color--tertiary">
                                {' '}
                                {t('WATERMARK')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Onboarding;
