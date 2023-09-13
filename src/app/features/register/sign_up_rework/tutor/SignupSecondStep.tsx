import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';
import moment from 'moment';
import MyPhoneInput from '../../../../components/form/MyPhoneInput';
import { useRef, useState } from 'react';
import TextField from '../../../../components/form/TextField';
import { useCheckMailMutation } from '../../../../../services/authService';
import useOutsideAlerter from '../../../../utils/useOutsideAlerter';
import { useAppSelector } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { setStepTwo } from '../../../../../slices/signUpSlice';

interface StepTwoValues {
  email: string;
  phoneNumber: string;
}

type StepTwoProps ={
  nextStep:() => void
};

export const SignupSecondStep = ({ nextStep }:StepTwoProps) => {

  const dispatch = useDispatch();
  const state = useAppSelector((state) => state.signUp);
  const {email, phoneNumber} = state;
  const rangeSetterRef = useRef<HTMLDivElement>(null);
  const [checkMail] = useCheckMailMutation();

  const initialValues: StepTwoValues = {
    email: email,
    phoneNumber: phoneNumber,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmitStepTwo(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL'))
        .test('checkEmailExistence', t('REGISTER.FORM.EMAIL_CONFLICT'), async (value) => {
          if (!value) return true;

          const emailExists = await checkMail({ email: value }).unwrap();
          return !emailExists;
        })
        .required(t('FORM_VALIDATION.REQUIRED')),
      phoneNumber: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/gm,
          t('FORM_VALIDATION.PHONE_NUMBER')
        ),
    }),
  });

  const handleEnterKeyOne = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formik.handleSubmit();
    }
  };

  function handleSubmitStepTwo(values: StepTwoValues) {
   dispatch(
     setStepTwo(
       {
         email: values.email,
         phoneNumber: values.phoneNumber,
         countryId: 'da98ad50-5138-4f0d-b297-62c5cb101247' //TODO: figure out country id somehow, for now its HC to Croatia
       }
     )
   );

   nextStep();
  }

  return (
    <>
      <div className='sign-up-form-wrapper'>
        <FormikProvider value={formik}>
          <Form onKeyPress={handleEnterKeyOne}>

            {/*email*/}
            <div className="align--center mb-5">
              <TextField
                style={{background:'white'}}
                onBlur={(e: any) => {
                  formik.handleBlur(e);
                }}
                name="email"
                id="email"
                placeholder={t('REGISTER.FORM.EMAIL_PLACEHOLDER')}
              />
            </div>

            {/*phone number*/}
            <div className="align--center mb-5" ref={rangeSetterRef}>
              <MyPhoneInput
                form={formik}
                name="phoneNumber"
                field={formik.getFieldProps('phoneNumber')}
                meta={formik.getFieldMeta('phoneNumber')}
              />
              <div className="password-tooltip font__sm text-align--center">{t('REGISTER.FORM.PHONE_INFO')}</div>

            </div>

            <button
              type="button"
              className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup"
              // style={{borderRadius:"10px", fontWeight:'bolder'}}
              onClick={() => formik.handleSubmit()}>{t('REGISTER.NEXT_BUTTON')}</button>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
};
