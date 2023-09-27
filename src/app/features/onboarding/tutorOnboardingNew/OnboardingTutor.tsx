import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { useHistory } from 'react-router';

import { AiOutlineClose, AiOutlineLeft } from 'react-icons/ai';
import { t } from 'i18next';
import logo from '../../../../assets/images/teorem_logo_purple.png';
import { useDispatch } from 'react-redux';
import {useMultistepForm} from "../../register/sign_up_rework/useMultiStepForm";
import {
  SignupThirdStep
} from "../../register/sign_up_rework/tutor/SignupThirdStep";
import {
  SignupFinalStep
} from "../../register/sign_up_rework/tutor/SignupFinalStep";
import {PATHS} from "../../../routes";
import CircularProgress from "../../my-profile/components/CircularProgress";
import AvailabilityPage from "./AvailabilityPage";
import SubjectsPage from "./SubjectsPage";
import AdditionalInfoPage from "./AdditionalInfoPage";
import PayoutsPage from "./PayoutsPage";

export function OnboardingTutor() {
  const state = useAppSelector((state) => state.onboarding);

  const {
    availability,
    subjects,
    currentOccupation,
    yearsOfExperience,
    aboutYou,
    aboutYourLessons,
    address,
    addressLine2,
    postcode,
    city,
    country,
    IBAN,
    image,
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
      <AvailabilityPage nextStep={nextStep} />,
      <SubjectsPage nextStep={nextStep} backStep={backStep}/>,
      <AdditionalInfoPage nextStep={nextStep} backStep={backStep} />,
      <PayoutsPage nextStep={nextStep} backStep={backStep}/>,
      <SignupFinalStep/>,
    ]);

  const dispatch = useDispatch();
  const history = useHistory();
  const penultimateIndex = steps.length - 2;

  function nextStep() {
    if (currentStepIndex != penultimateIndex){
      return next();
    }else{
      history.push(PATHS.DASHBOARD);
    }
  }

  function backStep() {
    if (currentStepIndex != 0){
      return back();
    }else{
      history.push(PATHS.DASHBOARD);
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
