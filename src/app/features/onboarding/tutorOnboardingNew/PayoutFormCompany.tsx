import { Form, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScaleLoader } from 'react-spinners';
import * as yup from 'yup';

import { connectStripe } from '../../../../slices/authSlice';
import TextField from '../../../components/form/TextField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import {
  useConnectAccountMutation, useConnectCompanyAccountMutation,
} from '../../my-profile/services/stripeService';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';

interface Props{
  nextStep: () => void;
}

export const PayoutFormCompany = (props: Props) => {
  const {nextStep} = props;
  const [connectCompanyAccount, { isSuccess, isLoading, data }] = useConnectCompanyAccountMutation();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const removeWhitespaces = (value: string) => value.replace(/\s+/g, '');


  const {t} = useTranslation();
  const tutorId = getUserId();
  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);

  const formik = useFormik({
    validateOnChange:true,
    validateOnMount:true,
    onSubmit:handleSubmit,
    initialValues: {
      addressLine1: '',
      postalCode: '',
      city: '',
      IBAN: '',
      IBANConfirm: '',
      companyName:'',
      companyPIN:'' //PIN?
    },
    validationSchema: yup.object({
      addressLine1: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      // addressLine2: yup.string().trim(),
      postalCode: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      city: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      companyName: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      companyPIN: yup.number().required(t('FORM_VALIDATION.REQUIRED')),
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
    })
  });


  async function handleSubmit(values: any){
    if(!tutorId) return;

    setLoading(true);
    await connectCompanyAccount({
      addressLine1:values.addressLine1,
      postalCode: values.postalCode,
      city: values.city,
      IBAN: removeWhitespaces(values.IBAN),
      IBANConfirm: removeWhitespaces(values.IBANConfirm),
      userId:  tutorId, //if userId is passed as prop, use it, else use state.auth.user
      accountType: 'company',
      PIN: values.companyPIN,
      name: values.companyName,
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
            percentage: profileProgressState.percentage + 20,
          })
        );
        // toastService.success(t('STRIPE_CONNECT.SUCCESS'));
        formik.resetForm();
        setLoading(false);
        nextStep();
      })
      .catch(() =>{
        setLoading(false);
      });
  }

  return (
    <>
      <FormikProvider value={formik}>
        <Form className="mt-5">
          <div className="w--80 align--center">
            <div className="field">
              <label htmlFor="addressLine1Field" className="field__label">
                {t('STRIPE_CONNECT.ADDRESS')}*
              </label>
              <TextField name="addressLine1" id="addressLine1Field" />
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
                name="companyPIN"
                id="companyPIN"
                placeholder={t('MY_PROFILE.PROFILE_SETTINGS.COMPANY_OIB_PLACEHOLDER')}
                disabled={isLoading}
              />
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
              <button
                id="tutor-onboarding-step-5"
                type='submit'
                disabled={!formik.isValid} className="btn btn--lg btn--primary mt-4">
                {t('REGISTER.NEXT_BUTTON')}
              </button>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </>
  );


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

};
