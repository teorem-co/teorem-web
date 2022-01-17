import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { RoleOptions } from '../../../slices/roleSlice';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import TrialPopup from '../register/TrialPopup';
import logo from './../../../assets/images/logo.svg';
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
        if (step < 3) {
            setStep(step + 1);
        } else if (step === 3) {
            setTrial(true);
        }
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
                                    <>
                                        <div className="steps__item steps__item__line mb-10">
                                            <div
                                                className={`steps__item--left active ${
                                                    step === 2 || step === 3
                                                        ? 'steps__item--left--completed'
                                                        : ''
                                                } mr-2`}
                                            >
                                                {step === 2 || step === 3 ? (
                                                    <i className="icon icon--check icon--base icon--white"></i>
                                                ) : (
                                                    1
                                                )}
                                            </div>
                                            <div className="steps__item--right">
                                                <div className="steps__title steps__title--primary">
                                                    Personal information
                                                </div>
                                                <div className="steps__title steps__title--secondary">
                                                    Let us get to know you a
                                                    little bit better
                                                </div>
                                            </div>
                                        </div>

                                        <div className="steps__item mb-10">
                                            <div
                                                className={`steps__item--left ${
                                                    step === 3
                                                        ? 'steps__item--left--completed active'
                                                        : step === 2
                                                        ? 'active'
                                                        : ''
                                                } mr-2`}
                                            >
                                                {step === 3 ? (
                                                    <i className="icon icon--check icon--base icon--white"></i>
                                                ) : (
                                                    2
                                                )}
                                            </div>
                                            <div className="steps__item--right">
                                                <div className="steps__title steps__title--primary">
                                                    My Teachings
                                                </div>
                                                <div className="steps__title steps__title--secondary">
                                                    Share your professional
                                                    background
                                                </div>
                                            </div>
                                        </div>

                                        <div className="steps__item">
                                            <div
                                                className={`steps__item--left ${
                                                    step === 3 ? 'active' : ''
                                                } mr-2`}
                                            >
                                                3
                                            </div>
                                            <div className="steps__item--right">
                                                <div className="steps__title steps__title--primary">
                                                    Additional information
                                                </div>
                                                <div className="steps__title steps__title--secondary">
                                                    It’s never too much
                                                    informations
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : roleSelection === RoleOptions.Parent ? (
                                    <>
                                        <div className="steps__item steps__item__line--sm mb-10">
                                            <div
                                                className={`steps__item--left active ${
                                                    step === 2 || step === 3
                                                        ? 'steps__item--left--completed'
                                                        : ''
                                                } mr-2`}
                                            >
                                                {step === 2 || step === 3 ? (
                                                    <i className="icon icon--check icon--base icon--white"></i>
                                                ) : (
                                                    1
                                                )}
                                            </div>
                                            <div className="steps__item--right">
                                                <div className="steps__title steps__title--primary">
                                                    Personal information
                                                </div>
                                                <div className="steps__title steps__title--secondary">
                                                    Let us get to know you a
                                                    little bit better
                                                </div>
                                            </div>
                                        </div>

                                        <div className="steps__item mb-10">
                                            <div
                                                className={`steps__item--left ${
                                                    step === 3
                                                        ? 'steps__item--left--completed active'
                                                        : step === 2
                                                        ? 'active'
                                                        : ''
                                                } mr-2`}
                                            >
                                                {step === 3 ? (
                                                    <i className="icon icon--check icon--base icon--white"></i>
                                                ) : (
                                                    2
                                                )}
                                            </div>
                                            <div className="steps__item--right">
                                                <div className="steps__title steps__title--primary">
                                                    Child's List
                                                </div>
                                                <div className="steps__title steps__title--secondary">
                                                    Lorem ipsum dolor sit
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="steps__item">
                                        <div className="steps__item--left active mr-2">
                                            1
                                        </div>
                                        <div className="steps__item--right">
                                            <div className="steps__title steps__title--primary">
                                                Personal information
                                            </div>
                                            <div className="steps__title steps__title--secondary">
                                                Let us get to know you a little
                                                bit better
                                            </div>
                                        </div>
                                    </div>
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
                            ) : (
                                <StudentOnboarding
                                    step={step}
                                    handleNextStep={handleNextStep}
                                    handleGoBack={handleGoBack}
                                />
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
