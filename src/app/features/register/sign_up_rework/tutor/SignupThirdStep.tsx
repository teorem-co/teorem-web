import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';
import TextField from '../../../../components/form/TextField';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { setStepThree } from '../../../../../slices/signUpSlice';

import PasswordTooltip from '../../PasswordTooltip';

interface StepThreeValues {
  password: string;
  confirmPassword: string;
  termsAndConditions: boolean;
}

type StepThreeProps ={
  nextStep:() => void
};

export function SignupThirdStep({ nextStep }:StepThreeProps) {

  const dispatch = useDispatch();
  const store = useAppSelector((store) => store.signUp);
  const{password, confirmPassword} = store;
  const [passTooltip, setPassTooltip] = useState<boolean>(false);

  const initialValues: StepThreeValues = {
    password: password,
    confirmPassword: confirmPassword,
    termsAndConditions: false
  };

  const handleSubmit = async (values: StepThreeValues) => {
    console.log("Handling submit step three: ", values.password);
    await dispatch(
      setStepThree(
        {
          password: values.password,
          confirmPassword: values.confirmPassword
        }
      ));

    nextStep();
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .min(8, t('FORM_VALIDATION.TOO_SHORT'))
        .max(128, t('FORM_VALIDATION.TOO_LONG'))
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
          t('FORM_VALIDATION.PASSWORD_STRENGTH')
        ),
      // confirmPassword: Yup.string()
      //   .required(t('FORM_VALIDATION.REQUIRED'))
      //   .oneOf([Yup.ref('password'), null], t('FORM_VALIDATION.PASSWORD_MATCH')),
      termsAndConditions: Yup.boolean()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .oneOf([true], t('FORM_VALIDATION.AGREE_TERMS_REQUIRED'))
    }),
  });


  const handlePasswordFocus = () => {
    setPassTooltip(true);
  };

  const handlePasswordBlur = () => {
    setPassTooltip(false);
  };

  const myInput = document.getElementById('password') as HTMLInputElement;
  const letter = document.getElementById('letter');
  const capital = document.getElementById('capital');
  const number = document.getElementById('number');
  const length = document.getElementById('length');
  const special = document.getElementById('special');


  const handleKeyUp = () => {
    const lowerCaseLetters = /[a-z]/g;
    if (letter && myInput?.value.match(lowerCaseLetters)) {
      letter.classList.remove('icon--grey');
      letter.classList.add('icon--success');
      letter.classList.remove('icon--close');
      letter.classList.add('icon--check');
    } else {
      letter?.classList.remove('icon--success');
      letter?.classList.add('icon--grey');
      letter?.classList.add('icon--close');
      letter?.classList.remove('icon--check');
    }

    // Validate capital letters
    const upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
      capital?.classList.remove('icon--grey');
      capital?.classList.add('icon--success');
      capital?.classList.remove('icon--close');
      capital?.classList.add('icon--check');
    } else {
      capital?.classList.remove('icon--success');
      capital?.classList.add('icon--grey');
      capital?.classList.add('icon--close');
      capital?.classList.remove('icon--check');
    }

    // Validate numbers
    const numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
      number?.classList.remove('icon--grey');
      number?.classList.add('icon--success');
      number?.classList.remove('icon--close');
      number?.classList.add('icon--check');
    } else {
      number?.classList.remove('icon--success');
      number?.classList.add('icon--grey');
      number?.classList.add('icon--close');
      number?.classList.remove('icon--check');
    }
    // Validate length
    if (myInput.value.length >= 8) {
      length?.classList.remove('icon--grey');
      length?.classList.add('icon--success');
      length?.classList.remove('icon--close');
      length?.classList.add('icon--check');
    } else {
      length?.classList.remove('icon--success');
      length?.classList.add('icon--grey');
      length?.classList.add('icon--close');
      length?.classList.remove('icon--check');
    }

    // Validate special characters
    const specialCharacters = /[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]/;
    if (myInput.value.match(specialCharacters)) {
      special?.classList.remove('icon--grey');
      special?.classList.add('icon--success');
      special?.classList.remove('icon--close');
      special?.classList.add('icon--check');
    } else {
      special?.classList.remove('icon--success');
      special?.classList.add('icon--grey');
      special?.classList.add('icon--close');
      special?.classList.remove('icon--check');
    }
  };

  return (
    <>
        <div className="sign-up-form-wrapper">
          <FormikProvider value={formik}>
            <Form>
              <div
                className="container--flex--space-around"
                style={{flexDirection:"column"}}
              >

                {/*password*/}
                <div className="field mb-5">
                  <TextField
                    style={{background:'white'}}
                    name="password"
                    id="password"
                    placeholder={t('REGISTER.FORM.PASSWORD_PLACEHOLDER')}
                    className="input input--base input--text input--icon"
                    password={true}
                    // disabled={isLoading}
                    onFocus={handlePasswordFocus}
                    onBlur={(e: any) => {
                      handlePasswordBlur();
                      formik.handleBlur(e);
                    }}
                    onKeyUp={handleKeyUp}
                  />
                  <PasswordTooltip className="password-tooltip" passTooltip={true} positionTop={false}/>
                </div>
                {/*confirm password*/}
                {/*<div className="field">*/}
                {/*  <label className="field__label" htmlFor="confirmPassword">*/}
                {/*    {t('REGISTER.FORM.CONFIRM_PASSWORD')}*/}
                {/*  </label>*/}
                {/*  <TextField*/}
                {/*    name="confirmPassword"*/}
                {/*    id="confirmPassword"*/}
                {/*    placeholder={t('REGISTER.FORM.CONFIRM_PASSWORD_PLACEHOLDER')}*/}
                {/*    className="input input--base input--text input--icon"*/}
                {/*    password={true}*/}
                {/*  />*/}
                {/*</div>*/}

                <div className="flex flex--row font__sm align--center">
                  <Field type="checkbox" name="termsAndConditions"/>
                  <div className="text-align--start ml-5"  dangerouslySetInnerHTML={{ __html: t('REGISTER.FORM.TERMS_AND_CONDITIONS') }} />
                </div>

                <ErrorMessage name="termsAndConditions">
                  {msg => <div className="field__validation">{msg}</div>}
                </ErrorMessage>




              </div>

              <button
                type="button"
                className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup"
                // onClick={() => formik.handleSubmit()}>{t('REGISTER.NEXT_BUTTON')}</button>
                onClick={nextStep}>{t('REGISTER.NEXT_BUTTON')}</button>
            </Form>
          </FormikProvider>
        </div>
    </>
  );
}
