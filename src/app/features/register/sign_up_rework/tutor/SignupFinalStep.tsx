import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../hooks';
import {
  useResendActivationEmailMutation
} from '../../../../../services/authService';


export const SignupFinalStep = () => {
  const store = useAppSelector(state => state.signUp);
  const {email} = store;
  const [resendActivationEmailPost, { isSuccess: isSuccessResendActivationEmail }] = useResendActivationEmailMutation();
  const [isResendButton, setIsResendButton] = useState();

  function resend(){
    setButtonIsActive(true);
    setSecondsLeft(40);
    resendActivationEmailPost({ email });
  }


    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(40);

    useEffect(() => {
      let timerInterval: NodeJS.Timeout;

      if (buttonIsActive && secondsLeft > 0) {
        timerInterval = setInterval(() => {
          setSecondsLeft((prevSeconds) => prevSeconds - 1);
        }, 1000);
      }

      if (secondsLeft === 0) {
        setButtonIsActive(false);
      }

      return () => {
        clearInterval(timerInterval);
      };
    }, [buttonIsActive, secondsLeft]);

  return (
    <>
    <div className="flex flex--center flex--col align--center sign-up-form-wrapper mt-5">

      <img src='/images/mail-icon.svg' alt='' className="mail-icon"/>

      <p className='text-align--center mb-10 font-family__poppins info-text'>{t('REGISTER.FORM.CONFIRM_EMAIL')}</p>

      <button
        disabled={buttonIsActive}
        className="btn p-3 btn--primary cur--pointer mt-5 btn-signup transition__05"
        onClick={resend}
        style={{zIndex:11}}

      >{buttonIsActive ? `${t('REGISTER.FORM.RESEND_MAIL_BUTTON_TRY')} ${secondsLeft}s` : t('REGISTER.FORM.RESEND')}</button>
    </div>
    </>
  );
};
