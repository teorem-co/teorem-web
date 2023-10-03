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
import {
  FormControlLabel,
  Stack,
  styled,
  Switch,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import {
  useConnectAccountMutation, useConnectCompanyAccountMutation,
} from '../../my-profile/services/stripeService';
import { connectStripe } from '../../../../slices/authSlice';
import { ScaleLoader } from 'react-spinners';

//TODO: add saving to database


type AdditionalProps = {
  nextStep: () => void,
  backStep: () => void
};

const PayoutsPage = ({nextStep, backStep}: AdditionalProps) => {
  const state = useAppSelector((state) => state.onboarding);
  const { yearsOfExperience, currentOccupation, aboutYou,aboutYourLessons } = state;


  const [connectAccount, { isSuccess, isLoading, data }] = useConnectAccountMutation();
  const [connectCompanyAccount] = useConnectCompanyAccountMutation();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const removeWhitespaces = (value: string) => value.replace(/\s+/g, '');

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

  // const isLoading = isLoadingGetInfo || isUpdatingInfo;
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

  // const handleSubmit = async (values: IUpdateAdditionalInfo) => {
  //   const toSend: IUpdateAdditionalInfo = {
  //     aboutLessons: values.aboutLessons,
  //     aboutTutor: values.aboutTutor,
  //     currentOccupation: values.currentOccupation,
  //     yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : null,
  //   };
  //   await updateAditionalInfo(toSend);
  //   const progressResponse = await getProfileProgress().unwrap();
  //   dispatch(setMyProfileProgress(progressResponse));
  //   setSaveBtnActive(false);
  //   toastService.success(t('SEARCH_TUTORS.TUTOR_PROFILE.UPDATE_ADDITIONAL_INFO_SUCCESS'));
  //   dispatch(setStepTwo({
  //     currentOccupation: values.currentOccupation,
  //     yearsOfExperience: values.yearsOfExperience ? values.yearsOfExperience : "",
  //     aboutYou: values.aboutTutor,
  //     aboutYourLessons: values.aboutLessons,
  //   }));
  //   if (values.currentOccupation.length === 0 || values.aboutTutor.length === 0 || values.aboutLessons.length === 0) {
  //     setSaveBtnActive(false);
  //   }
  //   nextStep();
  // };

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
      // handleSubmit(formik.values);
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
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      IBAN: '',
      IBANConfirm: '',
      companyName:'',
      companyOIB:'' //PIN?
    },
    validationSchema: yup.object({
      addressLine1: yup.string().required('Address is required').trim(),
      addressLine2: yup.string().trim(),
      postalCode: yup.string().required('Postal code is required').trim(),
      city: yup.string().required('City is required').trim(),
      IBAN: yup
        .string()
        .test('valid-iban', 'IBAN is invalid', function (value) {
          if (!value) {
            return true;
          }
          return isValidIBANNumber(value);
        })
        .test('valid-iban', 'IBAN must not contain whitespaces', function(value){
          if(!value){
            return false;
          }
          return !value?.includes(' ');
        })
        .required('IBAN is required'),
      IBANConfirm: yup
        .string()
        .test('valid-iban', 'IBAN is invalid', function (value) {
          if (!value) {
            return true;
          }
          return isValidIBANNumber(value);
        })
        .test('iban-match', 'IBANs must match', function (value) {
          return this.parent.IBAN === value;
        })
        .required('IBAN confirmation is required'),
    }),
    onSubmit:handleSubmit
  });

  async function handleSubmit(values: any){
      if(!tutorId) return;

      if(individual){
        setLoading(true);
        await connectAccount({
          addressLine1:values.addressLine1,
          addressLine2: values.addressLine2,
          postalCode: values.postalCode,
          city: values.city,
          IBAN: removeWhitespaces(values.IBAN),
          IBANConfirm: removeWhitespaces(values.IBANConfirm),
          userId:  tutorId, //if userId is passed as prop, use it, else use state.auth.user
        }).unwrap()
          .then((res) => {
            dispatch(
              connectStripe({
                stripeConnected: true,
                stripeAccountId: res,
              })
            );
            dispatch(
              setMyProfileProgress({
                ...profileProgressState,
                payment: true,
                percentage: profileProgressState.percentage + 25,
              })
            );
           // toastService.success(t('STRIPE_CONNECT.SUCCESS'));
            formik.resetForm();
            setLoading(false);
            nextStep();
          })
          .catch((error) =>{
            setLoading(false);
          });
      }else{
        console.log('connecting company account');
        await connectCompanyAccount({
          addressLine1:values.addressLine1,
          addressLine2: values.addressLine2,
          postalCode: values.zipCode,
          city: values.city,
          IBAN: removeWhitespaces(values.IBAN),
          userId:  tutorId, //if userId is passed as prop, use it, else use state.auth.user
          companyName: values.companyName,
          companyOIB: values.companyOIB
        }).unwrap()
          .then((res) => {
            dispatch(
              connectStripe({
                stripeConnected: true,
                stripeAccountId: res,
              })
            );
            dispatch(
              setMyProfileProgress({
                ...profileProgressState,
                payment: true,
              })
            );
            // toastService.success(t('STRIPE_CONNECT.SUCCESS'));
            formik.resetForm();
            setLoading(false);
            nextStep();
          });
      }
  }

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


  return (
    <>
      {/*<RouterPrompt*/}
      {/*  when={saveBtnActive}*/}
      {/*  onOK={handleUpdateOnRouteChange}*/}
      {/*  onCancel={() => {*/}
      {/*    //if you pass "false" router will be blocked and you will stay on the current page*/}
      {/*    return true;*/}
      {/*  }}*/}
      {/*/>*/}
      <div
        className="flex flex--row flex--jc--space-between"
        //   style={{
        //   display: "grid",
        //   justifyContent: "center",
        //   alignItems: "start",
        //   gridTemplateColumns: "repeat(3, 1fr)"
        // }}
        >
        <div
          style={{gridColumn: "1/3", top: "0", justifyContent: "center",
          alignItems: "center"}}
          className="align--center w--50">
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
          <div className="pl-8">

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
            <div>
              {individual ? (
                <>
                  <FormikProvider value={formik}>
                    <Form>
                     <div className="w--80 align--center">
                       <div className="field">
                         <label htmlFor="addressLine1Field" className="field__label">
                           {t('STRIPE_CONNECT.LINE_1')}*
                         </label>
                         <TextField name="addressLine1" id="addressLine1Field" />
                       </div>
                       <div className="field">
                         <label htmlFor="addressLine2Field" className="field__label">
                           {t('STRIPE_CONNECT.LINE_2')}
                         </label>
                         <TextField name="addressLine2" id="addressLine2Field" />
                       </div>
                       <div className="field">
                         <label htmlFor="postalCodeField" className="field__label">
                           {t('STRIPE_CONNECT.POST_CODE')}*
                         </label>
                         <TextField name="postalCode" id="postalCodeField" />
                       </div>
                       <div className="field">
                         <label htmlFor="cityField" className="field__label">
                           {t('STRIPE_CONNECT.CITY')}*
                         </label>
                         <TextField name="city" id="cityField" />
                       </div>
                       <div className="field">
                         <label htmlFor="IBANField" className="field__label">
                           {t('STRIPE_CONNECT.IBAN')}*
                         </label>
                         <TextField name="IBAN" id="IBANField" />
                       </div>
                       <div className="field">
                         <label htmlFor="IBANConfirmField" className="field__label">
                           {t('STRIPE_CONNECT.IBAN_CONFIRM')}*
                         </label>
                         <TextField name="IBANConfirm" id="IBANConfirmField" />
                       </div>
                       <div dangerouslySetInnerHTML={{ __html: t('STRIPE_CONNECT.TERMS') }} />
                       <div className="flex flex--center align-self-center mt-3">
                         <ScaleLoader color={'#7e6cf2'} loading={loading} style={{margin: '0 auto'}}/>
                       </div>
                       <div className="flex--center" style={{
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         flexDirection: "column"
                       }}>
                         <button type='submit' disabled={!saveBtnActive} className="btn btn--base btn--primary mt-4">
                           {t('REGISTER.NEXT_BUTTON')}
                         </button>
                       </div>
                     </div>
                    </Form>
                  </FormikProvider>
                </>
              ) : null }
              {business ? (
                <>
                  <FormikProvider value={formik}>
                    <Form>
                      <div className="w--80 align--center">
                        <div className="field">
                          <label htmlFor="line1" className="field__label">
                            {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                          </label>
                          <TextField name="addressLine1" id="addressLine1Field" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}/>
                        </div>
                        <div className="field">
                          <label htmlFor="line2" className="field__label">
                            {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                          </label>
                          <TextField name="addressLine2" id="addressLine2Field" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
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
                          name="IBAN"
                          id="IBAN"
                          placeholder={t('MY_PROFILE.PROFILE_SETTINGS.IBAN_PLACEHOLDER')}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="iban" className="field__label">
                          {t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_NAME')}
                        </label>
                        <TextField
                          name="companyName"
                          id="companyName"
                          placeholder={t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_NAME_PLACEHOLDER')}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="iban" className="field__label">
                          {t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_OIB')}
                        </label>
                        <TextField
                          name="companyOIB"
                          id="companyOIB"
                          placeholder={t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_OIB_PLACEHOLDER')}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex--center" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                      }}>
                        <button type={'submit'} onClick={() => {
                          console.log('submitting', formik.values);
                          handleSubmit(formik.values);

                        }
                        }
                                disabled={!saveBtnActive}
                                className="btn btn--base btn--primary mt-4">
                          {t('REGISTER.NEXT_BUTTON')}
                        </button>
                      </div>
                      </div>
                    </Form>
                  </FormikProvider>
                </>
              ): null}
            </div>

          </div>
        </div>


        <div className="w--50">
          <div className="text-align--center">Profile Preview</div>
          <TestTutorProfile
            occupation={currentOccupation}
            aboutTutor={aboutYou}
            aboutLessons={aboutYourLessons}
            yearsOfExperience={yearsOfExperience}
          ></TestTutorProfile>
        </div>
      </div>
    </>
  );
};

function isValidIBANNumber(input: string) {
  const CODE_LENGTHS: { [key: string]: number } = {
    AD: 24,
    AE: 23,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    CH: 21,
    CR: 21,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    TN: 24,
    TR: 26,
    AL: 28,
    BY: 28,
    EG: 29,
    GE: 22,
    IQ: 23,
    LC: 32,
    SC: 31,
    ST: 25,
    SV: 28,
    TL: 23,
    UA: 29,
    VA: 22,
    VG: 24,
    XK: 20,
  };
  const iban = String(input)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
    code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter: string): any => {
    return letter.charCodeAt(0) - 55;
  });
  // final check
  return !!mod97(digits);
}

function mod97(string: string) {
  let checksum: string | number = string.slice(0, 2),
    fragment;
  for (let offset = 2; offset < string.length; offset += 7) {
    fragment = String(checksum) + string.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
}

export default PayoutsPage;
