import { Form, FormikProvider, useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { IChild } from '../../../../interfaces/IChild';
import {
  useCheckUsernameMutation,
  useGenerateChildUsernameMutation,
  useRegisterParentMutation,
} from '../../../../services/authService';
import {
  resetParentRegister,
  setChildList,
  setStepOne,
} from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../../slices/tutorRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import { OptionType } from '../../../components/form/MySelectField';
import TextField from '../../../components/form/TextField';
import ImageCircle from '../../../components/ImageCircle';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';
import TooltipPassword from '../../register/TooltipPassword';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';

interface StepOneValues {
  firstName: string;
  lastName: string;
  countryId: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface DetailsValues {
  childFirstName: string;
  childDateOfBirth: string;
  username: string;
  childPassword: string;
}

interface IProps {
  handleGoBack: () => void;
  handleNextStep: () => void;
  step: number;
  showDesc: (data: boolean) => void;
}

const ParentOnboarding: React.FC<IProps> = ({ handleGoBack, handleNextStep, step, showDesc }) => {
  const { t } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [childUsername, setChildUsername] = useState<string>('');
  const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [passTooltip, setPassTooltip] = useState<boolean>(false);
  const [phoneTooltip, setPhoneTooltip] = useState<boolean>(false);
  const [registerParent, { isSuccess, isLoading }] = useRegisterParentMutation();
  const [checkUsernameValidation, setCheckUsernameValidation] = useState<string>('');
  const [checkUsername] = useCheckUsernameMutation();
  const parentCreds = useAppSelector((state) => state.parentRegister);
  const { firstName, lastName, password, passwordRepeat, email, dateOfBirth, phoneNumber, countryId, child, skip } = parentCreds;
  //const [addUserQuery] = useAddUserMutation();

  const [generateChildUsernamePost] = useGenerateChildUsernameMutation();

  const roleAbrv = useAppSelector((state) => state.role.selectedRole);

  const [initialValuesTwo, setInitialValuesTwo] = useState<DetailsValues>({
    childFirstName: '',
    childDateOfBirth: '',
    username: '',
    childPassword: '',
  });

  const handlePasswordFocus = () => {
    setPassTooltip(true);
  };

  const handlePasswordBlur = () => {
    setPassTooltip(false);
  };

  const myInput = document.getElementById('childPassword') as HTMLInputElement;
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

  const rangeSetterRef = useRef<HTMLDivElement>(null);

  const hideTooltip = () => {
    setPhoneTooltip(false);
  };

  useOutsideAlerter(rangeSetterRef, hideTooltip);

  // Step one

  const initialValuesOne: StepOneValues = {
    firstName: '',
    lastName: '',
    countryId: countryOptions?.find((option) => option.label === 'Croatia')?.value || '',
    phoneNumber: '',
    dateOfBirth: '',
  };

  const formikStepOne = useFormik({
    initialValues: initialValuesOne,
    onSubmit: (values) => submitStepOne(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      lastName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      //countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      phoneNumber: Yup.string().min(6, t('FORM_VALIDATION.TOO_SHORT')).required(t('FORM_VALIDATION.REQUIRED')),
      dateOfBirth: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
          const dateDiff = moment(value).diff(moment(), 'days');

          if (dateDiff < 0) {
            return true;
          } else {
            return false;
          }
        }),
    }),
  });

  const submitStepOne = (values: StepOneValues) => {
    dispatch(
      setStepOne({
        firstName: values.firstName,
        lastName: values.lastName,
        countryId: values.countryId,
        phoneNumber: values.phoneNumber,
        dateOfBirth: values.dateOfBirth,
      })
    );
    handleNextStep();
  };

  const stepOne = () => {
    return (
      <FormikProvider value={formikStepOne}>
        <Form>
          <div className="field">
            <label htmlFor="firstName" className="field__label">
              {t('REGISTER.FORM.FIRST_NAME')}
            </label>
            <TextField
              name="firstName"
              id="firstName"
              placeholder={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}
              // disabled={isLoading}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName" className="field__label">
              {t('REGISTER.FORM.LAST_NAME')}
            </label>
            <TextField
              name="lastName"
              id="lastName"
              placeholder={t('REGISTER.FORM.LAST_NAME_PLACEHOLDER')}
              // disabled={isLoading}
            />
          </div>
          {/*<div className="field">*/}
          {/*  <label htmlFor="countryId" className="field__label">*/}
          {/*    {t('REGISTER.FORM.COUNTRY')}*/}
          {/*  </label>*/}
          {/*  <MySelect*/}
          {/*    form={formikStepOne}*/}
          {/*    field={formikStepOne.getFieldProps('countryId')}*/}
          {/*    meta={formikStepOne.getFieldMeta('countryId')}*/}
          {/*    isMulti={false}*/}
          {/*    classNamePrefix="onboarding-select"*/}
          {/*    options={countryOptions}*/}
          {/*    placeholder={t('REGISTER.FORM.COUNTRY_PLACEHOLDER')}*/}
          {/*    customInputField={countryInput}*/}
          {/*    customOption={countryOption}*/}
          {/*  />*/}
          {/*</div>*/}
          <div className="field" ref={rangeSetterRef}>
            <label htmlFor="phoneNumber" className="field__label">
              {t('REGISTER.FORM.PHONE_NUMBER')}
            </label>
            <MyPhoneInput
              form={formikStepOne}
              name="phoneNumber"
              field={formikStepOne.getFieldProps('phoneNumber')}
              meta={formikStepOne.getFieldMeta('phoneNumber')}
              openTooltip={() => setPhoneTooltip(true)}
            />
            <div className={`tooltip--phone ${phoneTooltip ? 'active' : ''}`}>
              <div className="">Your phone number will not be visible to the public, we use it in case of support.</div>
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="dateOfBirth">
              {t('REGISTER.FORM.DATE_OF_BIRTH')}
            </label>
            <MyDatePicker form={formikStepOne} field={formikStepOne.getFieldProps('dateOfBirth')} meta={formikStepOne.getFieldMeta('dateOfBirth')} />
          </div>
          <div
            className="btn btn--base btn--primary type--center w--100 mb-2 type--wgt--extra-bold mt-6"
            // type="submit"
            onClick={() => formikStepOne.handleSubmit()}
            // disabled={isLoading}
          >
            {t('REGISTER.NEXT_BUTTON')}
          </div>
          <div className="flex flex--jc--center">
            <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
              <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>
              {t('REGISTER.BACK_TO_REGISTER')}
            </div>
          </div>
        </Form>
      </FormikProvider>
    );
  };

  // Step two

  const formikStepTwo = useFormik({
    initialValues: initialValuesTwo,
    onSubmit: () => submitStepTwo(),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({}),
  });

  const submitStepTwo = async () => {
    /*
        const toSend: IChatEnginePost = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            secret: 'Teorem1!',
            username: email.split('@')[0],
        };
        */
    if (skip) {
      //addUserQuery(toSend).unwrap();

      await registerParent({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: passwordRepeat,
        dateOfBirth: moment(dateOfBirth).toISOString(),
        phoneNumber: phoneNumber,
        countryId: countryId,
        roleAbrv: roleAbrv ? roleAbrv : '',
      }).unwrap();
    } else {
      //addUserQuery(toSend).unwrap();
      await registerParent({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: passwordRepeat,
        dateOfBirth: moment(dateOfBirth).toISOString().substring(0,10),
        phoneNumber: phoneNumber,
        countryId: countryId,
        children: child,
        roleAbrv: roleAbrv ? roleAbrv : '',
      }).unwrap();
    }
  };

  const stepTwo = () => {
    return (
      <>
        <FormikProvider value={formikStepTwo}>
          <Form id="formSubmit">
            <div className="role-selection__form">
              <div
                className="role-selection__item"
                onClick={() => {
                  handleAddNewchild();
                }}
              >
                <div className="flex--grow ml-4">
                  <div className="mb-1">{t('ADD_CHILD.TITLE')}</div>
                  <div className="type--color--secondary">{t('ADD_CHILD.DESCRIPTION')}</div>
                </div>
                <i className="icon icon--base icon--plus icon--primary"></i>
              </div>
              {child.length > 0 &&
                child.map((x: IChild) => {
                  return (
                    <div className="role-selection__item" key={x.username} onClick={() => handleEditChild(x)}>
                      <ImageCircle initials={`${x.firstName.charAt(0)}`} />
                      <div className="flex--grow ml-4">
                        <div className="mb-1">{x.firstName}</div>
                        <div className="type--color--secondary">{moment(x.dateOfBirth).format('MM/DD/YYYY')}</div>
                      </div>
                      <i className="icon icon--base icon--edit icon--primary"></i>
                    </div>
                  );
                })}
            </div>
            <div
              className={`btn btn--base btn--${isLoading ? 'disabled' : 'primary'} type--center w--100 mb-2 mt-6 type--wgt--extra-bold`}
              onClick={() => formikStepTwo.handleSubmit()}
              // disabled={isLoading}
              // onClick={() => handleNextStep()}
            >
              {t('REGISTER.FINISH')}
            </div>
            <div className="flex flex--jc--center">
              <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
                <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('REGISTER.BACK_TO_STEP_ONE')}
              </div>
            </div>
          </Form>
        </FormikProvider>
      </>
    );
  };

  // Step three

  const formikStepThree = useFormik({
    initialValues: initialValuesTwo,
    onSubmit: (values) => submitStepThree(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
     validationSchema: Yup.object().shape({
       childFirstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
       childDateOfBirth: Yup.string()
         .required(t('FORM_VALIDATION.REQUIRED'))
         .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
           const currentDate = moment(value).diff(moment(), 'days');

           if (currentDate < 0) {
             return true;
           } else {
             return false;
           }
         }),
       username: Yup.string()
         .test('username', 'Username already exists', async (value: any) => {
           if (value) {
             //filter all without selected child(on edit)
             const filteredArray = child.filter((x) => x.username !== childUsername);

             //check backend usernames
             const isValid = await checkUsername({
               username: value,
             }).unwrap();

             //check local usernames
             const checkCurrent = filteredArray.find((x) => x.username === value);
             //set validation boolean
             const finalValid = isValid || checkCurrent ? true : false;

             return !finalValid;
           }
           return true;
         })
         .required(t('FORM_VALIDATION.REQUIRED')),
       childPassword: Yup.string()
         .min(8, t('FORM_VALIDATION.TOO_SHORT'))
         .max(128, t('FORM_VALIDATION.TOO_LONG'))
         .matches(
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
           t('FORM_VALIDATION.PASSWORD_STRENGTH')
         )
         .required(t('FORM_VALIDATION.REQUIRED')),
     }),
  });

  const checkUsernameExistance = async () => {
    const isValid = await checkUsername({
      username: formikStepThree.values.username,
    }).unwrap();

    if (isValid) {
      setCheckUsernameValidation('This username already exists');
    } else {
      setCheckUsernameValidation('');
    }
  };

  const submitStepThree = (values: DetailsValues) => {
    let newArr: IChild[] = [];
    newArr = cloneDeep(child);

    const currentChild = {
      firstName: values.childFirstName,
      dateOfBirth: moment(values.childDateOfBirth).toISOString(),
      username: values.username,
      password: values.childPassword,
    };

    if (childUsername) {
      const currentItem = newArr.findIndex((x) => {
        return x.username === childUsername;
      });

      newArr.splice(currentItem, 1, currentChild);
      //newArr.push(currentChild);

      setChildUsername('');
      dispatch(setChildList(newArr));
      setDetailsOpen(false);
      showDesc(detailsOpen);
    } else {
      newArr.push(currentChild);
      dispatch(setChildList(newArr));
      setDetailsOpen(false);
      showDesc(detailsOpen);
    }
  };

  const handleDeleteChild = () => {
    let newArr: IChild[] = [];
    newArr = cloneDeep(child);
    const currentItem = newArr.findIndex((x) => {
      return x.username === childUsername;
    });
    newArr.splice(currentItem, 1);
    dispatch(setChildList(newArr));
    setChildUsername('');
    setDetailsOpen(false);
    showDesc(detailsOpen);
  };

  const stepThree = () => {
    return (
      <FormikProvider value={formikStepThree}>
        <Form>
          <div className="field">
            <label htmlFor="childFirstName" className="field__label">
              {t('REGISTER.FORM.CHILD_NAME')}
            </label>
            <TextField
              name="childFirstName"
              id="childFirstName"
              placeholder={t('REGISTER.FORM.CHILD_NAME_PLACEHOLDER')}
              onBlur={(e: any) => {
                generateChildUsername();
                formikStepThree.handleBlur(e);
              }}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="childDateOfBirth">
              {t('REGISTER.FORM.CHILD_DATE_OF_BIRTH')}
            </label>
            <MyDatePicker
              form={formikStepThree}
              field={formikStepThree.getFieldProps('childDateOfBirth')}
              meta={formikStepThree.getFieldMeta('childDateOfBirth')}
            />
          </div>
          <div className="field">
            <label htmlFor="username" className="field__label">
              {t('REGISTER.FORM.USERNAME')}
            </label>
            <TextField
              onBlur={(e: any) => {
                formikStepThree.handleBlur(e);
                checkUsernameExistance();
              }}
              name="username"
              id="username"
              placeholder={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}
              additionalValidation={checkUsernameValidation}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="childPassword">
              {t('REGISTER.FORM.PASSWORD')}
            </label>
            <TextField
              name="childPassword"
              id="childPassword"
              placeholder={t('REGISTER.FORM.PASSWORD_PLACEHOLDER')}
              className="input input--base input--text input--icon"
              password={true}
              onBlur={(e: any) => {
                handlePasswordBlur();
                formikStepThree.handleBlur(e);
              }}
              onFocus={handlePasswordFocus}
              onKeyUp={handleKeyUp}
            />

            <TooltipPassword passTooltip={passTooltip} />
          </div>
          <div
            className="btn btn--base btn--primary type--center w--100 mb-2 mt-6 type--wgt--extra-bold"
            onClick={() => formikStepThree.handleSubmit()}
            // disabled={isLoading}
          >
            {t('REGISTER.SAVE_BUTTON')}
          </div>
          {childUsername ? (
            <div
              className="btn btn--base btn--ghost btn--ghost--error type--center w--100 type--wgt--extra-bold mb-2 mt-2"
              onClick={() => handleDeleteChild()}
              // disabled={isLoading}
            >
              {t('REGISTER.DELETE_BUTTON')}
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex--jc--center">
            <div
              onClick={() => {
                handleResetForm();
              }}
              className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold"
            >
              <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('REGISTER.BACK_TO_LIST')}
            </div>
          </div>
        </Form>
      </FormikProvider>
    );
  };

  const generateChildUsername = async () => {
    const nameForGenerator = formikStepThree.values.childFirstName;
    if (nameForGenerator) {
      const response= await generateChildUsernamePost({
        username: nameForGenerator,
      }).unwrap();
      formikStepThree.setFieldValue('username', response.username.toLowerCase());
      formikStepThree.validateField('username');
    }
  };

  // end of steps

  const handleEditChild = (currentChild: IChild) => {
    if (currentChild) {
      formikStepThree.setFieldValue('childFirstName', currentChild.firstName);
      formikStepThree.setFieldValue('childDateOfBirth', currentChild.dateOfBirth);
      formikStepThree.setFieldValue('username', currentChild.username);
      formikStepThree.setFieldValue('childPassword', currentChild.password);

      setDetailsOpen(true);
      showDesc(detailsOpen);
      setChildUsername(currentChild.username);
    } else {
      toastService.error(t('ERROR_HANDLING.NO_CHILD_USERNAME'));
    }
  };

  const handleAddNewchild = () => {
    formikStepThree.resetForm();
    setInitialValuesTwo({
      childFirstName: '',
      childDateOfBirth: '',
      username: '',
      childPassword: '',
    });
    setDetailsOpen(true);
    showDesc(detailsOpen);
  };

  const handleResetForm = () => {
    formikStepThree.resetForm();
    setChildUsername('');
    setDetailsOpen(false);
    showDesc(detailsOpen);
  };

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    const currentCountries: OptionType[] = countries
      ? countries.map((x: ICountry) => {
          return {
            label: x.name,
            value: x.id,
            icon: x.flag,
          };
        })
      : [];
    setCountryOptions(currentCountries);
    console.log("GETTING COUNTRIES: ", currentCountries);
  }, [countries]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetTutorRegister());
      dispatch(resetParentRegister());
      dispatch(resetStudentRegister());
      handleNextStep();
      toastService.success(t('ERROR_HANDLING.REGISTERED_SUCCESSFULLY'));
    }
  }, [isSuccess]);

  return <>{step === 1 ? stepOne() : step === 2 && detailsOpen === false ? stepTwo() : detailsOpen && step === 2 ? stepThree() : <></>}</>;
};

export default ParentOnboarding;
