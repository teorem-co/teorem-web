import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { useCheckMailMutation } from '../../../../../services/authService';
import { setStepTwo } from '../../../../../slices/signUpSlice';
import MyPhoneInput from '../../../../components/form/MyPhoneInput';
import MyTextField from '../../../../components/form/MyTextField';
import { useAppSelector } from '../../../../hooks';

type StepTwoProps ={
  nextStep:() => void
};

export const SignupSecondStep = ({ nextStep }:StepTwoProps) => {

  const dispatch = useDispatch();
  const state = useAppSelector((state) => state.signUp);
  const {email, phoneNumber} = state;
  const rangeSetterRef = useRef<HTMLDivElement>(null);
  const [checkMail] = useCheckMailMutation();
  const selectedRole = useAppSelector((state) => state.role.selectedRole);

  const initialValues1: any = {
    email: email,
  };

  const initialValues2: any = {
    phoneNumber: phoneNumber,
  };

  const formik = useFormik({
    initialValues: initialValues1,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount:true,
    enableReinitialize: false,
    validationSchema: Yup.object().shape({
      email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL'))
        .test('checkEmailExistence', t('REGISTER.FORM.EMAIL_CONFLICT'), async (value) => {
          if (!value) return true;  // If value is not present, return true to skip further validation

          const emailExists = await checkMail({ email: value }).unwrap();
          return !emailExists;
        })
        .required(t('FORM_VALIDATION.REQUIRED')),
    }),
  });

  const formik2 = useFormik({
    initialValues: initialValues2,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount:true,
    enableReinitialize: false,
    validationSchema: Yup.object().shape({
      phoneNumber: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .min(11)
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

  function handleSubmitStepTwo() {
    if (formik.values.email && formik2.values.phoneNumber) {
      dispatch(
        setStepTwo({
          email: formik.values.email,
          phoneNumber: formik2.values.phoneNumber,
          countryId: 'da98ad50-5138-4f0d-b297-62c5cb101247'
        })
      );
      nextStep();
    }
  }

  return (
    <>
      <div className='sign-up-form-wrapper'>
        <FormikProvider value={formik}>
          <Form onKeyPress={handleEnterKeyOne}>

            {/*email*/}
            <div className="align--center mb-5">
              <MyTextField
                id="email"
                name="email"
                style={{background:'white'}}
                onBlur={(e: any) => {
                  formik.handleBlur(e);
                }}
                placeholder={t('REGISTER.FORM.EMAIL_PLACEHOLDER')}
              />
            </div>

          </Form>
        </FormikProvider>

        <FormikProvider value={formik2}>
          <Form onKeyPress={handleEnterKeyOne}>

            {/*phone number*/}
            <div className="align--center mb-5" ref={rangeSetterRef}>
              <MyPhoneInput
                form={formik2}
                name="phoneNumber"
                field={formik2.getFieldProps('phoneNumber')}
                meta={formik2.getFieldMeta('phoneNumber')}
              />
              <div className="password-tooltip text-align--center info-text">{t('REGISTER.FORM.PHONE_INFO')}</div>

            </div>
          </Form>
        </FormikProvider>

        <button
          disabled={!formik.isValid || !formik2.isValid}
          id={`next-button-second-step-${selectedRole}`}
          type="button"
          className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup"
          onClick={() => handleSubmitStepTwo()}
        >
          {t('REGISTER.NEXT_BUTTON')}
        </button>

      </div>
    </>
  );
};
