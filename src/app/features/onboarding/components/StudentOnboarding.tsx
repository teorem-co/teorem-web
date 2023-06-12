import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import IChatEnginePost from '../../../../interfaces/IChatEnginePost';
import { useRegisterStudentMutation } from '../../../../services/authService';
import { resetParentRegister } from '../../../../slices/parentRegisterSlice';
import { resetStudentRegister } from '../../../../slices/studentRegisterSlice';
import { resetTutorRegister } from '../../../../slices/tutorRegisterSlice';
import MyDatePicker from '../../../components/form/MyDatePicker';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import { countryInput } from '../../../constants/countryInput';
import { countryOption } from '../../../constants/countryOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useAddUserMutation } from '../../../services/chatEngineService';
import toastService from '../../../services/toastService';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';
import { ICountry, useLazyGetCountriesQuery } from '../services/countryService';
import TextField from '../../../components/form/TextField';
import { values } from 'lodash';

interface StepOneValues {
  firstName: string;
  lastName: string;
  countryId: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface IProps {
  handleGoBack: () => void;
  handleNextStep: () => void;
  step: number;
}

const StudentOnboarding: React.FC<IProps> = ({ handleGoBack, handleNextStep }) => {
  const [registerStudent, { isSuccess, isLoading }] = useRegisterStudentMutation();
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [phoneTooltip, setPhoneTooltip] = useState<boolean>(false);
  const state = useAppSelector((state) => state.studentRegister);
  const roleAbrv = useAppSelector((state) => state.role.selectedRole);
  const { firstName, lastName, password, passwordRepeat, email } = state;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [getCountries, { data: countries }] = useLazyGetCountriesQuery();
  //const [addUserQuery] = useAddUserMutation();

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
  }, [countries]);

  const initialValuesOne: StepOneValues = {
    firstName: '',
    lastName: '',
    countryId: countryOptions?.find((option) => option.label === 'Croatia')?.value || 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    phoneNumber: '',
    dateOfBirth: '',
  };

  const handleSubmit = async (values: StepOneValues) => {
    /*
        const toSend: IChatEnginePost = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            secret: 'Teorem1!',
            username: email.split('@')[0],
        };

        addUserQuery(toSend).unwrap();
        */
    console.log("Handling");
    await registerStudent({
      firstName: values.firstName,
      lastName: values.lastName,
      password: password,
      confirmPassword: passwordRepeat,
      roleAbrv: roleAbrv ? roleAbrv : '',
      countryId: values.countryId,
      phoneNumber: values.phoneNumber,
      dateOfBirth: moment(values.dateOfBirth).toISOString(),
      email: email,
    }).unwrap();
  };

  const formik = useFormik({
    initialValues: initialValuesOne,
    onSubmit: (values ) => handleSubmit(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      countryId: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      phoneNumber: Yup.string().min(6, t('FORM_VALIDATION.TOO_SHORT')).required(t('FORM_VALIDATION.REQUIRED')),
      dateOfBirth: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
          const test = moment(value).diff(moment(), 'days');

          if (test < 0) {
            return true;
          } else {
            return false;
          }
        }),
    })
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetTutorRegister());
      dispatch(resetParentRegister());
      dispatch(resetStudentRegister());
      handleNextStep();
      toastService.success(t('ERROR_HANDLING.REGISTERED_SUCCESSFULLY'));
    }
  });

  const rangeSetterRef = useRef<HTMLDivElement>(null);

  const hideTooltip = () => {
    setPhoneTooltip(false);
  };

  useOutsideAlerter(rangeSetterRef, hideTooltip);

  return (
    <>
      <FormikProvider value={formik}>
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
          {/*    <label htmlFor="countryId" className="field__label">*/}
          {/*        {t('REGISTER.FORM.COUNTRY')}*/}
          {/*    </label>*/}

          {/*    <MySelect*/}
          {/*        form={formik}*/}
          {/*        field={formik.getFieldProps('countryId')}*/}
          {/*        meta={formik.getFieldMeta('countryId')}*/}
          {/*        isMulti={false}*/}
          {/*        classNamePrefix="onboarding-select"*/}
          {/*        options={countryOptions}*/}
          {/*        placeholder={t('REGISTER.FORM.COUNTRY_PLACEHOLDER')}*/}
          {/*        customInputField={countryInput}*/}
          {/*        customOption={countryOption}*/}
          {/*    />*/}
          {/*</div>*/}
          <div className="field" ref={rangeSetterRef}>
            <label htmlFor="phoneNumber" className="field__label">
              {t('REGISTER.FORM.PHONE_NUMBER')}
            </label>
            <MyPhoneInput
              form={formik}
              name="phoneNumber"
              field={formik.getFieldProps('phoneNumber')}
              meta={formik.getFieldMeta('phoneNumber')}
              openTooltip={() => setPhoneTooltip(true)}
            />
            <div className={`tooltip--phone ${phoneTooltip ? 'active' : ''}`}>
              <div className="">{t('REGISTER.FORM.PHONE_INFO')}</div>
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="dateOfBirth">
              {t('REGISTER.FORM.DATE_OF_BIRTH')}
            </label>
            <MyDatePicker form={formik} field={formik.getFieldProps('dateOfBirth')} meta={formik.getFieldMeta('dateOfBirth')} />
          </div>
          <button
            className={`btn btn--base btn--${isLoading ? 'disabled' : 'primary'} type--center w--100 mb-2 mt-6 type--wgt--extra-bold`}
            onClick={() => formik.handleSubmit}
            onSubmit={() =>formik.handleSubmit}
          >
            {t('REGISTER.FINISH')}
          </button>

          <div className="flex flex--jc--center">
            <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
              <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>
              {t('REGISTER.BACK_TO_REGISTER')}
            </div>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default StudentOnboarding;
