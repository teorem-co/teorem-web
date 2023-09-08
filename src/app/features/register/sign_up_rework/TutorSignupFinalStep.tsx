import React from 'react';

import CircularProgress from '../../my-profile/components/CircularProgress';


export const TutorSignupFinalStep = () => {
  return (
    <>
    <div className="flex flex--center  flex--col align--center">
      <CircularProgress progressNumber={100} size={80} />
      WELCOME TO TEOREM PLATFORM
      <div>
        Please confirm email adress by clicking link that we sent you
      </div>
      <button>RESEND</button>
    </div>
    </>
  );
};
