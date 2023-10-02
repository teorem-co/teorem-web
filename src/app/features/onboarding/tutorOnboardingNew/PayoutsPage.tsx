import {Form, FormikProvider, useFormik} from 'formik';
import {isEqual} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  useLazyGetProfileProgressQuery,
  useLazyGetTutorByIdQuery,
  useUpdateAditionalInfoMutation,
} from '../../../../services/tutorService';
import TextField from '../../../components/form/TextField';
import RouterPrompt from '../../../components/RouterPrompt';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import toastService from '../../../services/toastService';
import {getUserId} from '../../../utils/getUserId';
import IUpdateAdditionalInfo
  from "../../my-profile/interfaces/IUpdateAdditionalInfo";
import {setMyProfileProgress} from "../../my-profile/slices/myProfileSlice";
import {AiOutlineLeft} from "react-icons/ai";
import CircularProgress from "../../my-profile/components/CircularProgress";
import {setStepTwo} from "../../../../slices/onboardingSlice";
import TestTutorProfile from "./TestTutorProfile";
import MySelect from "../../../components/form/MySelectField";
import {countryInput} from "../../../constants/countryInput";
import {countryOption} from "../../../constants/countryOption";

//TODO: add saving to database

interface AdditionalValues {
  currentOccupation: string;
  yearsOfExperience: string;
  aboutYou: string;
  aboutYourLessons: string;
}

type AdditionalProps = {
  nextStep: () => void,
  backStep: () => void
};

const PayoutsPage = ({nextStep, backStep}: AdditionalProps) => {
  const [getProfileProgress] = useLazyGetProfileProgressQuery();
  const [getProfileData, {
    isLoading: isLoadingGetInfo,
    isLoading: dataLoading,
    isUninitialized: dataUninitialized
  }] =
    useLazyGetTutorByIdQuery();
  const [updateAditionalInfo, {
    isLoading: isUpdatingInfo,
    isSuccess: isSuccessUpdateInfo
  }] = useUpdateAditionalInfoMutation();

  const isLoading = isLoadingGetInfo || isUpdatingInfo;
  const pageLoading = dataLoading || dataUninitialized;
  const {t} = useTranslation();
  const tutorId = getUserId();
  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);

  const [saveBtnActive, setSaveBtnActive] = useState(false);
  const [initialValues, setInitialValues] = useState<IUpdateAdditionalInfo>({
    aboutTutor: '',
    aboutLessons: '',
    yearsOfExperience: null,
    currentOccupation: '',
  });

  const [individual, setIndividual] = useState(false);
  const [business, setBusiness] = useState(false);

  const handleSubmit = async (values: IUpdateAdditionalInfo) => {
    const toSend: IUpdateAdditionalInfo = {
      aboutLessons: values.aboutLessons,
      aboutTutor: values.aboutTutor,
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : null,
    };
    await updateAditionalInfo(toSend);
    const progressResponse = await getProfileProgress().unwrap();
    dispatch(setMyProfileProgress(progressResponse));
    setSaveBtnActive(false);
    toastService.success(t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS'));
    dispatch(setStepTwo({
      currentOccupation: values.currentOccupation,
      yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : "",
      aboutYou: values.aboutTutor,
      aboutYourLessons: values.aboutLessons,
    }));
    if (values.currentOccupation.length === 0 || values.aboutTutor.length === 0 || values.aboutLessons.length === 0) {
      setSaveBtnActive(false);
    }
    nextStep();
  };

  const handleChangeForSave = () => {
    if (!isEqual(initialValues, formik.values)) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  };

  const handleUpdateOnRouteChange = () => {
    if (Object.keys(formik.errors).length > 0) {
      toastService.error(t('FORM_VALIDATION.WRONG_REQUIREMENTS'));
      return false;
    } else {
      handleSubmit(formik.values);
      return true;
    }
  };

  const fetchData = async () => {
    if (tutorId) {
      const profileDataResponse = await getProfileData(tutorId).unwrap();

      if (profileDataResponse) {
        const values = {
          aboutTutor: profileDataResponse.aboutTutor ?? '',
          aboutLessons: profileDataResponse.aboutLessons ?? '',
          yearsOfExperience: profileDataResponse.yearsOfExperience,
          currentOccupation: profileDataResponse.currentOccupation ?? '',
        };
        setInitialValues(values);
      }

      //If there is no state in redux for profileProgress fetch data and save result to redux
      if (profileProgressState.percentage === 0) {
        const progressResponse = await getProfileProgress().unwrap();
        dispatch(setMyProfileProgress(progressResponse));
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      aboutTutor: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      aboutLessons: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
      currentOccupation: Yup.string()
        .min(2, t('FORM_VALIDATION.TOO_SHORT'))
        .max(50, t('FORM_VALIDATION.TOO_LONG'))
        .required(t('FORM_VALIDATION.REQUIRED')),
      yearsOfExperience: Yup.number().min(0, t('FORM_VALIDATION.NEGATIVE')).max(100, t('FORM_VALIDATION.TOO_BIG')).nullable(),
    }),
  });

  const countryOptions = [
    { label: 'Argentina', value: 'AR' },
    { label: 'Australia', value: 'AU' },
    { label: 'Austria', value: 'AT' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Bolivia', value: 'BO' },
    { label: 'Brazil', value: 'BR' },
    { label: 'Bulgaria', value: 'BG' },
    { label: 'Canada', value: 'CA' },
    { label: 'Chile', value: 'CL' },
    { label: 'Colombia', value: 'CO' },
    { label: 'Costa Rica', value: 'CR' },
    { label: 'Croatia', value: 'HR' },
    { label: 'Cyprus', value: 'CY' },
    { label: 'Czech Republic', value: 'CZ' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Dominican Republic', value: 'DO' },
    { label: 'Estonia', value: 'EE' },
    { label: 'Finland', value: 'FI' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' },
    { label: 'Greece', value: 'GR' },
    { label: 'Hong Kong SAR China', value: 'HK' },
    { label: 'Hungary', value: 'HU' },
    { label: 'Iceland', value: 'IS' },
    { label: 'India', value: 'IN' },
    { label: 'Indonesia', value: 'ID' },
    { label: 'Ireland', value: 'IE' },
    { label: 'Israel', value: 'IL' },
    { label: 'Italy', value: 'IT' },
    { label: 'Japan', value: 'JP' },
    { label: 'Latvia', value: 'LV' },
    { label: 'Liechtenstein', value: 'LI' },
    { label: 'Lithuania', value: 'LT' },
    { label: 'Luxembourg', value: 'LU' },
    { label: 'Malta', value: 'MT' },
    { label: 'Mexico ', value: 'MX' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'New Zealand', value: 'NZ' },
    { label: 'Norway', value: 'NO' },
    { label: 'Paraguay', value: 'PY' },
    { label: 'Peru', value: 'PE' },
    { label: 'Poland', value: 'PL' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Romania', value: 'RO' },
    { label: 'Singapore', value: 'SG' },
    { label: 'Slovakia', value: 'SK' },
    { label: 'Slovenia', value: 'SI' },
    { label: 'Spain', value: 'ES' },
    { label: 'Sweden', value: 'SE' },
    { label: 'Switzerland', value: 'CH' },
    { label: 'Thailand', value: 'TH' },
    { label: 'Trinidad & Tobago', value: 'TT' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United States', value: 'US' },
    { label: 'Uruguay', value: 'UY' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  //check for displaying save button
  useEffect(() => {
    if (isSuccessUpdateInfo) {
      if (tutorId) {
        getProfileData(tutorId);
      }
    }
  }, [isSuccessUpdateInfo]);

  useEffect(() => {
    handleChangeForSave();
  }, [formik.values]);

  useEffect(() => {
    if (formik.values.aboutLessons.length !== 0 && formik.values.aboutTutor.length !== 0 && formik.values.currentOccupation.length !== 0) {
      setSaveBtnActive(true);
    } else {
      setSaveBtnActive(false);
    }
  }, [formik.values]);

  return (
    <>
      <RouterPrompt
        when={saveBtnActive}
        onOK={handleUpdateOnRouteChange}
        onCancel={() => {
          //if you pass "false" router will be blocked and you will stay on the current page
          return true;
        }}
      />
      <div style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "start",
        gridTemplateColumns: "repeat(3, 1fr)"
      }}>
        <div style={{gridColumn: "1/3", top: "0", justifyContent: "center",
          alignItems: "center"}} className="align--center">
          <div className='flex field__w-fit-content align--center'>
            <div className="flex flex--col flex--jc--center ml-6">
              <div style={{margin: "40px"}} className="flex flex--center">
                <AiOutlineLeft
                  className={`ml-2 mr-6 cur--pointer signup-icon`}
                  color='grey'
                  onClick={backStep}
                />
                <div className="flex flex--center flex--shrink w--105">
                  <CircularProgress
                    progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0}
                    size={80}/>
                </div>
                <div className="flex flex--col flex--jc--center ml-6">
                  <h4
                    className='signup-title ml-6 text-align--center'>{t('MY_PROFILE.PAYOUTS')}</h4>
                </div>
              </div>
            </div>
          </div>
          <div>
          <div style={{display: "flex", justifyContent: "center", gap:'10px'}}>
            <div
              className={`font-family__poppins fw-300 level-card flex card--primary cur--pointer scale-hover--scale-110`}
              style={{
                borderRadius: '10px',
                height:'60px',
                width:'100px',
                alignContent:'center',
                justifyContent:'center',
                alignItems:'center',
                backgroundColor: individual ? '#7e6cf2' : 'white',
                color: individual ? 'white' : 'black',}}
                onClick={() => {setIndividual(true); setBusiness(false);}}
            >
              <span className="font__lgr">Private</span>
            </div>
            <div
              className={`font-family__poppins fw-300 level-card flex card--primary cur--pointer scale-hover--scale-110`}
              style={{
                borderRadius: '10px',
                height:'60px',
                width:'100px',
                alignContent:'center',
                justifyContent:'center',
                alignItems:'center',
                backgroundColor: business ? '#7e6cf2' : 'white',
                color: business ? 'white' : 'black',}}
              onClick={() => {setIndividual(false); setBusiness(true);}}
            >
              <span className="font__lgr">Business</span>
            </div>
          </div>
            {individual ? (
                <>
              <FormikProvider value={formik}>
                <Form>
                  <div className="field">
                    <label htmlFor="line1" className="field__label">
                      {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                    </label>
                    <TextField
                      name="line1"
                      id="line1"
                      placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}
                      // withoutErr={formik.errors.line1 && formik.touched.line1 ? false : true}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="line2" className="field__label">
                      {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                    </label>
                    <TextField name="line2" id="line2" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
                  </div>
                  <div className="field">
                    <label htmlFor="zipCode" className="field__label">
                      {t('ACCOUNT.NEW_CARD.ZIP')}
                    </label>
                    <TextField name="zipCode" id="zipCode" placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')} />
                  </div>
                  <div className="field">
                    <label htmlFor="city" className="field__label">
                      {t('ACCOUNT.NEW_CARD.CITY')}
                    </label>
                    <TextField name="city" id="city" placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')} />
                  </div>
                  <div className="field">
                    <label htmlFor="country" className="field__label">
                      {t('ACCOUNT.NEW_CARD.COUNTRY')}*
                    </label>
                    <MySelect
                      form={formik}
                      field={formik.getFieldProps('country')}
                      meta={formik.getFieldMeta('country')}
                      isMulti={false}
                      classNamePrefix="onboarding-select"
                      options={countryOptions}
                      placeholder={t('ACCOUNT.NEW_CARD.COUNTRY_PLACEHOLDER')}
                      customInputField={countryInput}
                      customOption={countryOption}
                      isDisabled={countryOptions.length < 1}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="iban" className="field__label">
                      IBAN*
                    </label>
                    <TextField
                      name="iban"
                      id="iban"
                      placeholder={t('MY_PROFILE.PROFILE_SETTINGS.IBAN_PLACEHOLDER')}
                      disabled={isLoading}
                    />
                  </div>
                </Form>
              </FormikProvider>
              </>
            ) : null }
            {business ? (
              <>
                <FormikProvider value={formik}>
                  <Form>
                    <div className="field">
                      <label htmlFor="line1" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                      </label>
                      <TextField
                        name="line1"
                        id="line1"
                        placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}
                        // withoutErr={formik.errors.line1 && formik.touched.line1 ? false : true}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="line2" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                      </label>
                      <TextField name="line2" id="line2" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="zipCode" className="field__label">
                        {t('ACCOUNT.NEW_CARD.ZIP')}
                      </label>
                      <TextField name="zipCode" id="zipCode" placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="city" className="field__label">
                        {t('ACCOUNT.NEW_CARD.CITY')}
                      </label>
                      <TextField name="city" id="city" placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')} />
                    </div>
                    <div className="field">
                      <label htmlFor="country" className="field__label">
                        {t('MY_PROFILE.PROFILE_SETTINGS.COUNTRY')}
                      </label>
                      <MySelect
                        form={formik}
                        field={formik.getFieldProps('country')}
                        meta={formik.getFieldMeta('country')}
                        isMulti={false}
                        classNamePrefix="onboarding-select"
                        options={countryOptions}
                        placeholder={t('ACCOUNT.NEW_CARD.COUNTRY_PLACEHOLDER')}
                        customInputField={countryInput}
                        customOption={countryOption}
                        isDisabled={countryOptions.length < 1}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="iban" className="field__label">
                        IBAN*
                      </label>
                      <TextField
                        name="iban"
                        id="iban"
                        placeholder={t('MY_PROFILE.PROFILE_SETTINGS.IBAN_PLACEHOLDER')}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="iban" className="field__label">
                        {t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_NAME')}
                      </label>
                      <TextField
                        name="iban"
                        id="iban"
                        placeholder={t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_NAME_PLACEHOLDER')}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="iban" className="field__label">
                        {t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_OIB')}
                      </label>
                      <TextField
                        name="iban"
                        id="iban"
                        placeholder={t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_OIB_PLACEHOLDER')}
                        disabled={isLoading}
                      />
                    </div>
                  </Form>
                </FormikProvider>
              </>
            ): null}
            <div className="flex--center" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}>
              <button onClick={() => handleSubmit(formik.values)}
                      disabled={!saveBtnActive}
                      className="btn btn--base btn--primary mt-4">
                {t('REGISTER.NEXT_BUTTON')}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div>Profile Preview</div>
          <TestTutorProfile occupation={formik.values.currentOccupation}
                            aboutTutor={formik.values.aboutTutor}
                            aboutLessons={formik.values.aboutLessons}
                            yearsOfExperience={formik.values.yearsOfExperience}
          ></TestTutorProfile>
        </div>
      </div>
    </>
  );
};

export default PayoutsPage;
