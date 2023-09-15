import { useMultistepForm } from '../useMultiStepForm';
import React, { useEffect, useState } from 'react';
import { SignupFirstStep } from './SignupFirstStep';
import { SignupSecondStep } from './SignupSecondStep';
import { SignupThirdStep } from './SignupThirdStep';
import { useAppSelector } from '../../../../hooks';
import moment from 'moment/moment';
import {
  IRegister, useRegisterUserMutation,
} from '../../../../../services/authService';
import { useHistory } from 'react-router';

import { AiOutlineClose, AiOutlineLeft } from 'react-icons/ai';
import CircularProgress from '../../../my-profile/components/CircularProgress';
import { t } from 'i18next';
import { SignupFinalStep } from './SignupFinalStep';
import logo from '../../../../../assets/images/teorem_logo_purple.png';
import { SignupSubjectSelect } from '../student_and_parent/SignupSubjectSelect';
import { useDispatch } from 'react-redux';
import ROUTES, { PATHS } from '../../../../routes';
import { Role } from '../../../../lookups/role';
import { RoleOptions } from '../../../../../slices/roleSlice';

function ConfettiWrapper() {
  const confettiElements = [];
  for (let i = 150; i >= 0; i--) {
    const className = `confetti-${i}`;
    confettiElements.push(<div className={className} key={i}></div>);
  }
  return( <div className="wrapper">
    {confettiElements}
  </div>);
}

export function Signup() {
  const state = useAppSelector((state) => state.signUp);
  const selectedRole = useAppSelector((state) => state.role.selectedRole);

  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phoneNumber,
    countryId,
    password,
    confirmPassword,
    subjectId,
    levelId
  } = state;

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
      ...(selectedRole !== RoleOptions.Tutor ? [<SignupSubjectSelect nextStep={nextStep}/>] : []),
      <SignupFirstStep nextStep={nextStep} />,
      <SignupSecondStep nextStep={nextStep} />,
      <SignupThirdStep nextStep={nextStep} />,
      <SignupFinalStep/>,
    ]);

  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState(25);
  const history = useHistory();
  // const [registerTutor, { isSuccess, isLoading, isError }] = useRegisterTutorMutation();
  const [registerUser, { isSuccess, isLoading, isError }] = useRegisterUserMutation();
  const penultimateIndex = steps.length - 2;
  const titles = [
    ...(selectedRole !== RoleOptions.Tutor ? ["REGISTER.FORM.STEPS.STUDENT_PARENT_FIRST"] : []),
    "REGISTER.FORM.STEPS.FIRST",
    "REGISTER.FORM.STEPS.SECOND",
    "REGISTER.FORM.STEPS.THIRD",
    "REGISTER.FORM.STEPS.FINAL"
  ];


  useEffect(() => {
    if(!selectedRole)
      history.push(PATHS.ROLE_SELECTION);
  }, []);

  function nextStep() {
    if (currentStepIndex != penultimateIndex){
      return next();
    }else{
      sendRequest();
    }
  }

  function close(){
    const landingHostName = process.env.REACT_APP_LANDING_HOSTNAME || 'https://www.teorem.co';
    window.location.href = landingHostName;
  }

  async function sendRequest() {
    if(!selectedRole) return;
    const toSend: IRegister = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: moment(dateOfBirth).toISOString().substring(0, 10),
      email: email,
      phoneNumber: phoneNumber,
      countryId: countryId,
      password: password,
      confirmPassword: confirmPassword,
      roleAbrv: selectedRole.toString(),
      subjectId: subjectId,
      levelId: levelId
    };

    await registerUser(toSend).unwrap();

    if (!isError){
      next();
    }
  }

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

      <div className='margin-mobile'></div>

      <div className='flex field__w-fit-content align--center flex--center'>

        {!isFirstStep && !isLastStep &&
          <AiOutlineLeft
          className={`ml-2 mr-6 cur--pointer signup-icon ${isFirstStep ? 'hide-icon' : ''}`}
          color='grey'
          onClick={back}
        />}

        <CircularProgress
          className='progress-circle ml-1'
          progressNumber={percentage}
        />

        {!isLastStep ?
          <h4 className='signup-title ml-6 text-align--center '>
            <span dangerouslySetInnerHTML={{ __html: t(titles[currentStepIndex]) }} />
          </h4>
        :
          <h4 className='signup-title ml-6 text-align--center '>
            <span dangerouslySetInnerHTML={{ __html: firstName +', ' +t(titles[currentStepIndex]) }} />
          </h4>
        }

        {!isLastStep &&
          <AiOutlineClose
            className="mr-2 ml-6 cur--pointer signup-icon"
            color='grey'
            onClick={close}/>
        }
      </div>

      {selectedRole != RoleOptions.Tutor && isFirstStep && <p className='text-align--center font-family__poppins fw-300 info-text'>{t('REGISTER.FORM.CHOOSE_SUBJECTS_TIP')}</p>}

      <div
        style={{background:"#f8f4fe"}}
        className="signup-container">
        {step}
      </div>

    </>
  );
}
