import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';
import TextField from '../../../components/form/TextField';
import TooltipPassword from '../TooltipPassword';
import { useState } from 'react';

interface StepThreeValues {
  password: string;
  confirmPassword: string;
  termsAndConditions: boolean;
}

export function TutorSignupThirdStep() {
  const [passTooltip, setPassTooltip] = useState<boolean>(false);

  const initialValues: StepThreeValues = {
    password: '',
    confirmPassword: '',
    termsAndConditions: false
  };

  const handleSubmit = async (values: StepThreeValues) => {
    console.log("handling submit step one");
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
      confirmPassword: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .oneOf([Yup.ref('password'), null], t('FORM_VALIDATION.PASSWORD_MATCH')),
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
    } else {
      letter?.classList.remove('icon--success');
      letter?.classList.add('icon--grey');
    }

    // Validate capital letters
    const upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
      capital?.classList.remove('icon--grey');
      capital?.classList.add('icon--success');
    } else {
      capital?.classList.remove('icon--success');
      capital?.classList.add('icon--grey');
    }

    // Validate numbers
    const numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
      number?.classList.remove('icon--grey');
      number?.classList.add('icon--success');
    } else {
      number?.classList.remove('icon--success');
      number?.classList.add('icon--grey');
    }

    // Validate length
    if (myInput.value.length >= 8) {
      length?.classList.remove('icon--grey');
      length?.classList.add('icon--success');
    } else {
      length?.classList.remove('icon--success');
      length?.classList.add('icon--grey');
    }

    // Validate special characters
    const specialCharacters = /[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]/;
    if (myInput.value.match(specialCharacters)) {
      special?.classList.remove('icon--grey');
      special?.classList.add('icon--success');
    } else {
      special?.classList.remove('icon--success');
      special?.classList.add('icon--grey');
    }
  };

  return (
    <>
      <div
        className="align-self-center"
        style={{width:"50%", margin:"3em auto"}}
      >
        <FormikProvider value={formik}>
          <Form>
            <div
              className="container--flex--space-around"
              style={{flexDirection:"column"}}
            >

              {/*password*/}
              <div className="field">
                <label className="field__label" htmlFor="password">
                  {t('REGISTER.FORM.PASSWORD')}
                </label>
                <TextField
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
                <TooltipPassword passTooltip={passTooltip} />

                {/*confirm password*/}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="confirmPassword">
                  {t('REGISTER.FORM.CONFIRM_PASSWORD')}
                </label>
                <TextField
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder={t('REGISTER.FORM.CONFIRM_PASSWORD_PLACEHOLDER')}
                  className="input input--base input--text input--icon"
                  password={true}
                />
              </div>


              <label className="align--center">
                <Field type="checkbox" name="termsAndConditions"/>
                {t('REGISTER.FORM.TERMS_AND_CONDITIONS')}
              </label>
              {formik.touched.termsAndConditions && formik.errors.termsAndConditions ? (
                <div style={{color:'#e53e3e', fontSize:'12px'}}>{formik.errors.termsAndConditions}</div>
              ) : null}

              <button className="mt-3 btn--primary btn--sm btn " type={'submit'}>
                handle submit
              </button>
            </div>
          </Form>
        </FormikProvider>


      </div>

    </>
  );
}
