
import parent from '../../../../../src/assets/images/parent.svg';
import student from '../../../../../src/assets/images/student.svg';
import logo from '../../../../assets/images/teorem_logo_purple.png';
import React from 'react';


export const SignupRoleSelect = () => {
  return (
    <>
      <div >
        <img
          src={logo}
          alt='logo'
          className="mt-5 ml-5 signup-logo"
        />

        <div className="flex flex--col mt-20">
          <h1 className="text-align--center mt-5 mb-5 signup-title">
            Are you a <span className="primary-color font">parent</span> or a <span className="primary-color">student</span>?</h1>

          <div className="flex  flex--row"
               style={{
                 // flexFlow:'wrap',
                 alignContent:'center',
                 justifyContent:'center',
                 alignItems:'center',
                 gap:'10px'
               }}
          >

            <div className="flex--col card--primary scale-hover--scale-105 cur--pointer">
              <img className="card-role-select" src={parent} alt='parent'/>
              <p className="text-align--center">PARENT</p>
            </div>

            <div className="flex--col card--primary scale-hover--scale-105 cur--pointer">
              <img className="card-role-select" src={student} alt='parent'/>
              <p className="text-align--center">STUDENT</p>
            </div>

          </div>
          <div className="text-align--center">
            <h3 className="mt-5 cur--pointer underline-hover primary-color ">Apply to become a tutor</h3>
          </div>
        </div>


      </div>
    </>
  );
};
