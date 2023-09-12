import { useMultistepForm } from './useMultiStepForm';
import React, { FormEvent, useEffect, useState } from 'react';
import { TutorSignupFirstStep } from './TutorSignupFirstStep';
import { TutorSignupSecondStep } from './TutorSignupSecondStep';
import { TutorSignupThirdStep } from './TutorSignupThirdStep';
import { useAppSelector } from '../../../hooks';
import moment from 'moment/moment';
import {
  IRegisterTutor,
  useRegisterTutorMutation,
} from '../../../../services/authService';
import { PATHS, PROFILE_PATHS } from '../../../routes';
import { useHistory } from 'react-router';
import MultiStepProgressBar from '../multi_step_progress_bar/MultistepProgressBar';
import { AiOutlineClose, AiOutlineLeft } from 'react-icons/ai';
import CircularProgress from '../../my-profile/components/CircularProgress';
import { t } from 'i18next';
import { NavLink } from 'react-router-dom';
import { TutorSignupFinalStep } from './TutorSignupFinalStep';
import { grey } from '@mui/material/colors';
import logo from '../../../../assets/images/teorem_logo_purple.png';

export function TutorSignup() {

  const [percentage, setPercentage] = useState(25);
  const history = useHistory();
  const state = useAppSelector((state) => state.tutorSignUp);
  const [registerTutor, { isSuccess, isLoading }] = useRegisterTutorMutation();
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phoneNumber,
    countryId,
    password,
    confirmPassword,
  } = state;

  const titles = [
    "REGISTER.FORM.STEPS.FIRST", "REGISTER.FORM.STEPS.SECOND", "REGISTER.FORM.STEPS.THIRD", "REGISTER.FORM.STEPS.FINAL"
  ];


  function nextStep() {
    if (!isLastStep) return next();
    sendRequest();
    alert('Successful Account Creation');
  }

  function close(){
    const landingHostName = process.env.REACT_APP_LANDING_HOSTNAME || 'https://www.teorem.co';
    window.location.href = landingHostName;
  }

  async function sendRequest() {
    console.log('sending request');

    const toSend: IRegisterTutor = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: moment(dateOfBirth).toISOString().substring(0, 10),
      email: email,
      phoneNumber: phoneNumber,
      countryId: countryId,
      password: password,
      confirmPassword: confirmPassword,
      roleAbrv: 'tutor', //TODO: fix this don't use hardcoded value
    };

    //await registerTutor(toSend).unwrap(); //TODO: uncomment
    if (isSuccess)
      alert('SUCCESSFUL REGISTRATION');
    //TODO: maybe add confirmation, or no, redirect to well done may men
    history.push(PATHS.LOGIN);
    //TODO: maybe clear storage
  }

  const {
    steps,
    currentStepIndex,
    goTo,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
  } =
    useMultistepForm([
      <TutorSignupFirstStep nextStep={nextStep} />,
      <TutorSignupSecondStep nextStep={nextStep} />,
      <TutorSignupThirdStep nextStep={nextStep} />,
      <TutorSignupFinalStep/>,
    ]);




  useEffect(() => {
    setPercentage(((currentStepIndex + 1) / steps.length) * 100);
  }, [currentStepIndex]);
  return (
    <>
      <img
        src={logo}
        alt='logo'
        className="mt-5 ml-5 signup-logo"
      />
      <div className='mb-20'></div>

      {/*// <div className='flex field__w-fit-content align--center' >*/}
        <div className='flex field__w-fit-content align--center flex--center'>

          {!isFirstStep && !isLastStep &&
            <AiOutlineLeft
            className={`ml-2 mr-6 cur--pointer signup-icon ${isFirstStep ? 'hide-icon' : ''}`}
            color='grey'
            onClick={back}
          />}

          <CircularProgress
            className='progress-circle'
            progressNumber={percentage}
          />

          <h4 className='signup-title ml-6 text-align--center '>
            <span dangerouslySetInnerHTML={{ __html: t(titles[currentStepIndex]) }} />
          </h4>

          {!isLastStep &&
            <AiOutlineClose
              className="mr-2 ml-6 cur--pointer signup-icon"
              color='grey'
              onClick={close}/>
          }

        </div>
      <div
        style={{background:"#f8f4fe"}}
        className="signup-container">
        {step}
      </div>
    </>
  );
}
