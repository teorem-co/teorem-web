import { t } from 'i18next';
import React from 'react';
import { PATHS } from '../../../../routes';
import { useHistory } from 'react-router';

export const SignupFinalStep = () => {
  const history = useHistory();
  function resend(){
    alert("RESENDING...");
  }

  function toLogin(){
    history.push(PATHS.LOGIN);
  }

  return (
    <>
    <div className="flex flex--center flex--col align--center sign-up-form-wrapper">

      <p className='text-align--center mb-10'>{t('REGISTER.FORM.CONFIRM_EMAIL')}</p>

      <button
        className="btn p-3 btn--primary cur--pointer mt-5 btn-signup transition__05"
        onClick={toLogin}>{t('LOGIN.TITLE')}</button>

      <button
        className="btn p-3 btn--primary cur--pointer mt-5 btn-signup transition__05"
        onClick={resend}
      >{t('REGISTER.FORM.RESEND')}</button>

    </div>
    </>
  );
};
