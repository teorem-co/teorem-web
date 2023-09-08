import { useMultistepForm } from './useMultiStepForm';
import { FormEvent, useEffect, useState } from 'react';
import { TutorSignupFirstStep } from './TutorSignupFirstStep';
import { TutorSignupSecondStep } from './TutorSignupSecondStep';
import { TutorSignupThirdStep } from './TutorSignupThirdStep';
import { useAppSelector } from '../../../hooks';
import moment from 'moment/moment';
import {
  IRegisterTutor,
  useRegisterTutorMutation,
} from '../../../../services/authService';
import { PATHS } from '../../../routes';
import { useHistory } from 'react-router';
import MultiStepProgressBar from '../multi_step_progress_bar/MultistepProgressBar';
import { AiOutlineLeft } from 'react-icons/ai';


export function TutorSignup() {
  const history = useHistory();
  const state = useAppSelector((state) => state.tutorSignUp);
  const {firstName, lastName, dateOfBirth, email, phoneNumber, countryId, password, confirmPassword} = state;
  const [registerTutor, { isSuccess, isLoading }] = useRegisterTutorMutation();

  function nextStep() {
    console.log("next Step");
    if (!isLastStep) return next();
    sendRequest();
    alert("Successful Account Creation");
  }

  async function sendRequest(){
    console.log("sending request");

    const toSend:IRegisterTutor ={
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: moment(dateOfBirth).toISOString().substring(0, 10),
      email: email,
      phoneNumber: phoneNumber,
      countryId: countryId,
      password: password,
      confirmPassword: confirmPassword,
      roleAbrv: "tutor"
    };

    await registerTutor(toSend).unwrap();
    if(isSuccess)
      alert("SUCCESSFUL REGISTRATION");
    //TODO: maybe add confirmation, or no, redirect to well done may men
    history.push(PATHS.LOGIN);
      //TODO: maybe clear storage
  }

  const { steps, currentStepIndex, goTo, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <TutorSignupFirstStep    nextStep={nextStep}/>,
      <TutorSignupSecondStep   nextStep={nextStep}/>,
      <TutorSignupThirdStep    nextStep={nextStep}/>
    ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();
    alert("Successful Account Creation");
  }

  function onPageNumberClick(pageIndex:number){

    goTo(pageIndex);
  }

  return (
    <>
      <div className="text-align--center mb-20 mt-10">{(currentStepIndex + 1)/ (steps.length + 1)}</div>


      <div style={{
        display: 'flex',
        // backgroundColor:"red",
        alignItems:"center",
        flexDirection:'row'
      }}>
        <AiOutlineLeft
          size={20}
          onClick={back}
          style={{backgroundColor:'yellow'}}/>

        <MultiStepProgressBar
          page={currentStepIndex}
          totalNumOfPages={steps.length}
          onPageNumberClick={onPageNumberClick}/>
      </div>
      <div
        //this div
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: 'red',
          background: "white", // Note: 'backgroundColor' and 'background' are conflicting. Use one.
          padding: "2rem",
          margin: "0 auto",
          borderRadius: ".5rem",
          fontFamily: "Arial",
          width: '100%' // This will set
        }}>
        {step}
      </div>
    </>
  );
}
