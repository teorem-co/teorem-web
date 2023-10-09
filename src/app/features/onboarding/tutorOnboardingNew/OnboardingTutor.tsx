import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { useHistory } from 'react-router';

import logo from '../../../../assets/images/teorem_logo_purple.png';
import { useDispatch } from 'react-redux';
import {useMultistepForm} from "../../register/sign_up_rework/useMultiStepForm";
import {PATHS} from "../../../routes";
import AvailabilityPage from "./AvailabilityPage";
import SubjectsPage from "./SubjectsPage";
import AdditionalInfoPage from "./AdditionalInfoPage";
import PayoutsPage from "./PayoutsPage";
import ImagePage from "./ImagePage";

export function OnboardingTutor() {
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
      <AvailabilityPage nextStep={nextStep} />,
      <SubjectsPage nextStep={nextStep} backStep={backStep}/>,
      <AdditionalInfoPage nextStep={nextStep} backStep={backStep} />,
      <ImagePage nextStep={nextStep} backStep={backStep}/>,
      <PayoutsPage nextStep={nextStep} backStep={backStep}/>,
    ]);

  const history = useHistory();
  function nextStep() {

    if (!isLastStep){
      return next();
    }else{
      history.push(PATHS.DASHBOARD);
    }
  }

  function backStep() {
    if (currentStepIndex != 0){
      back();
    }
  }

  function close(){
    const landingHostName = process.env.REACT_APP_LANDING_HOSTNAME || 'https://www.teorem.co';
    window.location.href = landingHostName;
  }

  return (
    <>
      <img
        src={logo}
        alt='logo'
        className="mt-5 ml-5 signup-logo"
      />

      <div className='margin-mobile'></div>

      <div
        style={{background:"#f8f4fe"}}>
        {step}
      </div>

    </>
  );
}
