import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { useCheckMailMutation } from '../../../services/authService';
import { setSelectedRole } from '../../../slices/roleSlice';
import { setRegister } from '../../../slices/tutorRegisterSlice';
import TextField from '../../components/form/TextField';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import logo from './../../../assets/images/logo.svg';
import TooltipPassword from './TooltipPassword';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const state = useAppSelector((state) => state.tutorRegister);
  const { firstName, lastName, email, password } = state;
  const roleSelection = useAppSelector((state) => state.role.selectedRole);
  const [passTooltip, setPassTooltip] = useState<boolean>(false);
  const [checkMailValidation, setCheckMailValidation] = useState<string>('');

  const [checkMail] = useCheckMailMutation();

  const initialValues: Values = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
  };
  const editRegister = () => {
    const registerValues = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordRepeat: password,
    };
    const newRegisterValues = firstName ? registerValues : initialValues;
    return newRegisterValues;
  };

  const formik = useFormik({
    initialValues: editRegister(),
    onSubmit: (values) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      // firstName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      // lastName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL')).required(t('FORM_VALIDATION.REQUIRED')),
      // .test('email', 'This email already exists', () => {
      //     if (value && value.includes('@')) {
      //         const isValid = await checkMail({
      //             email: value,
      //         }).unwrap();
      //         return !isValid;
      //     }
      //     return false;
      // }),
      password: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .min(8, t('FORM_VALIDATION.TOO_SHORT'))
        .max(128, t('FORM_VALIDATION.TOO_LONG'))
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
          t('FORM_VALIDATION.PASSWORD_STRENGTH')
        ),
      passwordRepeat: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .oneOf([Yup.ref('password'), null], t('FORM_VALIDATION.PASSWORD_MATCH')),
    }),
  });

  const checkEmailExistence = async () => {
    const isValid = await checkMail({
      email: formik.values.email,
    }).unwrap();
    if (isValid) {
      setCheckMailValidation('This email already exists');
    } else {
      setCheckMailValidation('');
    }
  };

  const handleSubmit = (values: Values) => {
    //no roleSelection is already handleded by redirecting to role selection screen
    //checkMailValidation -> if checkEmailExistence return error, dont submit form
    if (roleSelection && !checkMailValidation) {
      dispatch(
        setRegister({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          passwordRepeat: values.passwordRepeat,
          roleSelection: roleSelection,
        })
      );
      dispatch(setSelectedRole(roleSelection));
      history.push(PATHS.ONBOARDING);
    }
  };

  const handleGoBack = () => {
    history.push(PATHS.ROLE_SELECTION);
  };

  // useEffect(() => {
  //     if (isSuccess) {
  //         history.push('/test');
  //         toastService.success('You are registered successfully.');
  //     }
  // }, [isSuccess]);

  useEffect(() => {
    //if role selection is empty, redirect to role selection screen
    if (!roleSelection) {
      history.push(PATHS.ROLE_SELECTION);
    }
  }, []);

  // useEffect(() => {
  //     if (isSuccess) {
  //         history.push(PATHS.ONBOARDING);
  //     }
  // }, [isSuccess]);

  // useLayoutEffect(() => {
  //     return () => {
  //         dispatch(resetSelectedRole());
  //     };
  // }, []);

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
      <div className="login">
        {/*<div className="login__aside">*/}
        {/*  /!* <img src={heroImg} alt="Hero Img" />*!/*/}
        {/*  <div className="teorem-area">*/}
        {/*    <ul className="teorem-circles">*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*      <li></li>*/}
        {/*    </ul>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="login__content">
          <div className="flex--grow w--448--max">
            <div className="mb-22">
              <img className="w--128" src={logo} alt="Teorem" />
            </div>
            <div className="type--lg type--wgt--bold mb-4">{t('REGISTER.TITLE', { role: roleSelection })}</div>
            <FormikProvider value={formik}>
              <Form>
                {/*<div className="field">*/}
                {/*  <label htmlFor="firstName" className="field__label">*/}
                {/*    {t('REGISTER.FORM.FIRST_NAME')}*/}
                {/*  </label>*/}
                {/*  <TextField*/}
                {/*    name="firstName"*/}
                {/*    id="firstName"*/}
                {/*    placeholder={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}*/}
                {/*    // disabled={isLoading}*/}
                {/*  />*/}
                {/*</div>*/}
                {/*<div className="field">*/}
                {/*  <label htmlFor="lastName" className="field__label">*/}
                {/*    {t('REGISTER.FORM.LAST_NAME')}*/}
                {/*  </label>*/}
                {/*  <TextField*/}
                {/*    name="lastName"*/}
                {/*    id="lastName"*/}
                {/*    placeholder={t('REGISTER.FORM.LAST_NAME_PLACEHOLDER')}*/}
                {/*    // disabled={isLoading}*/}
                {/*  />*/}
                {/*</div>*/}
                <div className="field">
                  <label className="field__label" htmlFor="email">
                    {t('REGISTER.FORM.EMAIL')}
                  </label>
                  <TextField
                    onBlur={(e: any) => {
                      formik.handleBlur(e);
                      //formik.validateForm();
                      checkEmailExistence();
                    }}
                    name="email"
                    id="email"
                    placeholder={t('REGISTER.FORM.EMAIL_PLACEHOLDER')}
                    additionalValidation={checkMailValidation}
                    // disabled={isLoading}
                  />
                </div>
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
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="passwordRepeat">
                    {t('REGISTER.FORM.CONFIRM_PASSWORD')}
                  </label>
                  <TextField
                    name="passwordRepeat"
                    id="passwordRepeat"
                    placeholder={t('REGISTER.FORM.CONFIRM_PASSWORD_PLACEHOLDER')}
                    // disabled={isLoading}
                    className="input input--base input--text input--icon"
                    password={true}
                  />
                </div>
                <div
                  className="btn btn--base btn--primary w--100 type--center type--wgt--extra-bold mb-2 mt-6"
                  // type="submit"
                  onClick={() => formik.handleSubmit()}
                >
                  {t('REGISTER.FORM.SUBMIT_BUTTON')}
                </div>
                <div className="flex flex--jc--center">
                  <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
                    <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('REGISTER.BACK_BUTTON')}
                  </div>
                </div>
              </Form>
            </FormikProvider>
          </div>
          <div className="mt-8">
            <div className="type--color--tertiary"> {t('WATERMARK')}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
