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
    "What's your name?",
    "How do we contact you?",
    "Lastly, create a password"
  ];

  function nextStep() {
    if (!isLastStep) return next();
    sendRequest();
    alert('Successful Account Creation');
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
      roleAbrv: 'tutor',
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
      <div className=' mb-20 '></div>

      {!isLastStep &&
        <div className='flex field__w-fit-content align--center'>
          <div className='flex flex--center' >

            {!isFirstStep &&
              <AiOutlineLeft
                className="mr-6"
                size={"3em"}
                onClick={back} />
            }

            <CircularProgress progressNumber={percentage} size={80} />

            <h4 className=' ml-6' style={{fontSize:"1.5em"}}>
              {titles[currentStepIndex]}
            </h4>


            <AiOutlineClose
              className="ml-6"
              size={isFirstStep? "2.5em" : "3em" }
              onClick={back}/>
          </div>
        </div>
      }

      <div
        //this div
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: 'red',
          background: 'white', // Note: 'backgroundColor' and 'background' are conflicting. Use one.
          padding: '2rem',
          margin: '0 auto',
          borderRadius: '.5rem',
          fontFamily: 'Arial',
          width: '100%', // This will set
        }}>
        {step}
      </div>
    </>
  );
}
