import { t } from 'i18next';
import React from 'react';

export const SignupFinalStep = () => {
  function resend(){
    alert("RESENDING...");
  }

  return (
    <>
    <div className="flex flex--center flex--col align--center sign-up-form-wrapper">

      <p className='text-align--center'>{t('REGISTER.FORM.CONFIRM_EMAIL')}</p>
      <button
        className="btn btn-signup btn--primary btn--md mt-10"
        onClick={resend}
      >{t('REGISTER.FORM.RESEND')}</button>
    </div>
    </>
  );
};
