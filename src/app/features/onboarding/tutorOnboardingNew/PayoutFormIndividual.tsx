import { Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScaleLoader } from 'react-spinners';
import * as yup from 'yup';

import { connectStripe } from '../../../../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserId } from '../../../utils/getUserId';
import {
  useConnectAccountMutation,
} from '../../my-profile/services/stripeService';
import { setMyProfileProgress } from '../../my-profile/slices/myProfileSlice';
import { TextField } from '@mui/material';
import {
  ButtonPrimaryGradient,
} from '../../../components/ButtonPrimaryGradient';

interface Props {
  nextStep: () => void;
}

export const PayoutFormIndividual = (props: Props) => {
  const { nextStep } = props;
  const [connectAccount, {
    isSuccess,
    isLoading,
    data,
  }] = useConnectAccountMutation();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const removeWhitespaces = (value: string) => value.replace(/\s+/g, '');

  const { t } = useTranslation();
  const tutorId = getUserId();
  const dispatch = useAppDispatch();
  const profileProgressState = useAppSelector((state) => state.myProfileProgress);

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: handleSubmit,
    initialValues: {
      addressLine1: '',
      postalCode: '',
      state: '',
      city: '',
      IBAN: '',
      routingNumber: '',
      accountNumber: '',
      last4SSN: '',
    },
    validationSchema: yup.object({
      addressLine1: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      addressLine2: yup.string().trim(),
      postalCode: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      city: yup.string().required(t('FORM_VALIDATION.REQUIRED')).trim(),
      state: yup
        .string()
        .trim()
        .test('conditional-state', 'state', function(value) {
          if (user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9') {
            return true;
          }
          if (!value) {
            return this.createError({ message: t('FORM_VALIDATION.REQUIRED') });
          }
          return true;
        }),
      routingNumber: yup
        .string()
        .trim()
        .length(9)
        .test('conditional-routing', 'routing', function(value) {
          if (user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9') {
            return true;
          }
          if (!value) {
            return this.createError({ message: t('FORM_VALIDATION.REQUIRED') });
          }
          return true;
        }),
      accountNumber: yup
        .string()
        .trim()
        .test('conditional-account', 'account', function(value) {
          if (user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9') {
            return true;
          }
          if (!value) {
            return this.createError({ message: t('FORM_VALIDATION.REQUIRED') });
          }
          return true;
        }),
      last4SSN: yup
        .string()
        .length(4)
        .test('conditional-ssn', 'ssn', function(value) {
          if (user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9') {
            return true;
          }
          if (!value) {
            return this.createError({ message: t('FORM_VALIDATION.REQUIRED') });
          }
          return true;
        }),
      IBAN: yup.string().test('conditional-iban', 'IBAN validation', function(value) {
        // Assuming `user` is accessible and holds the countryId
        if (user?.countryId === 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9') {
          return true; // Always return true if the country ID matches
        }
        // Apply standard IBAN checks if countryId does not match
        if (!value) {
          return this.createError({ message: 'IBAN is required' });
        }
        if (!isValidIBANNumber(value)) {
          return this.createError({ message: t('FORM_VALIDATION.INVALID_IBAN') });
        }
        if (value.includes(' ')) {
          return this.createError({ message: t('FORM_VALIDATION.IBAN_WHITESPACES') });
        }
        return true;
      }),
    }),
  });

  async function handleSubmit(values: any) {
    if (!tutorId) return;

    setLoading(true);
    await connectAccount({
      addressLine1: values.addressLine1,
      postalCode: values.postalCode,
      state: values.state,
      last4SSN: values.last4SSN,
      city: values.city,
      IBAN: removeWhitespaces(values.IBAN),
      accountNumber: values.accountNumber,
      routingNumber: values.routingNumber,
      userId: tutorId, //if userId is passed as prop, use it, else use state.auth.user
      accountType: 'private',
    })
      .unwrap()
      .then((res) => {
        dispatch(
          connectStripe({
            stripeConnected: true,
            stripeAccountId: res,
          }),
        );
        dispatch(
          setMyProfileProgress({
            ...profileProgressState,
            payment: true,
            percentage: profileProgressState.percentage + 20,
          }),
        );
        // toastService.success(t('STRIPE_CONNECT.SUCCESS'));
        formik.resetForm();
        setLoading(false);
        nextStep();
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function validateIban() {
    if (formik.values.IBAN.length > 0 && !isValidIBANNumber(formik.values.IBAN)) {
      return t('FORM_VALIDATION.INVALID_IBAN');
    }
  }

  return (
    <>
      <FormikProvider value={formik}>
        <Form className='mt-5'>
          <div className='w--80 align--center'>
            <div className='field' style={{ padding: '10px' }}>
              <Field
                as={TextField}
                name='addressLine1'
                type='text'
                fullWidth
                required
                id='addressLine1Field'
                label={t('STRIPE_CONNECT.ADDRESS')}
                variant='outlined'
                color='secondary'
                placeholder={t('MY_PROFILE.PROFILE_SETTINGS.ADDRESS_PERSONAL_PLACEHOLDER')}
                // helperText={}
                InputProps={{
                  style: {
                    fontFamily: '\'Lato\', sans-serif',
                    backgroundColor: 'white',
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: '\'Lato\', sans-serif' },
                }}
                FormHelperTextProps={{
                  style: { color: 'red' }, // Change the color of the helper text here
                }}
              />
            </div>

            <div className='field' style={{ padding: '10px' }}>
              <Field
                as={TextField}
                name='postalCode'
                type='text'
                fullWidth
                required
                id='postalCodeField'
                label={t('STRIPE_CONNECT.POST_CODE')}
                variant='outlined'
                color='secondary'
                placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')}
                // helperText={}
                InputProps={{
                  style: {
                    fontFamily: '\'Lato\', sans-serif',
                    backgroundColor: 'white',
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: '\'Lato\', sans-serif' },
                }}
                FormHelperTextProps={{
                  style: { color: 'red' }, // Change the color of the helper text here
                }}
              />
            </div>
            {/*TODO: fix this later, no time to do it now*/}
            {user?.countryId === 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
              <div className='field' style={{ padding: '10px' }}>
                <Field
                  as={TextField}
                  name='state'
                  type='text'
                  fullWidth
                  required
                  id='stateField'
                  label={t('STRIPE_CONNECT.STATE')}
                  variant='outlined'
                  color='secondary'
                  InputProps={{
                    style: {
                      fontFamily: '\'Lato\', sans-serif',
                      backgroundColor: 'white',
                    },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: '\'Lato\', sans-serif' },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' }, // Change the color of the helper text here
                  }}
                />
              </div>
            )}
            <div className='field' style={{ padding: '10px' }}>
              <Field
                as={TextField}
                name='city'
                type='text'
                fullWidth
                required
                id='cityField'
                label={t('STRIPE_CONNECT.CITY')}
                variant='outlined'
                color='secondary'
                placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')}
                // helperText={}
                InputProps={{
                  style: {
                    fontFamily: '\'Lato\', sans-serif',
                    backgroundColor: 'white',
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: '\'Lato\', sans-serif' },
                }}
                FormHelperTextProps={{
                  style: { color: 'red' }, // Change the color of the helper text here
                }}
              />
            </div>
            {user?.countryId === 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
              <div className='field' style={{ padding: '10px' }}>
                <Field
                  as={TextField}
                  name='last4SSN'
                  type='text'
                  fullWidth
                  required
                  id='last4SSN'
                  label={t('STRIPE_CONNECT.LAST_4_SSN')}
                  variant='outlined'
                  color='secondary'
                  InputProps={{
                    style: {
                      fontFamily: '\'Lato\', sans-serif',
                      backgroundColor: 'white',
                    },
                    maxLength: 4,
                  }}
                  InputLabelProps={{
                    style: { fontFamily: '\'Lato\', sans-serif' },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' },
                  }}
                />
              </div>
            )}

            {user?.countryId !== 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
              <div className='field' style={{ padding: '10px' }}>
                <Field
                  as={TextField}
                  name='IBAN'
                  type='text'
                  fullWidth
                  required
                  id='IBAN'
                  helperText={validateIban()}
                  label={t('STRIPE_CONNECT.IBAN')}
                  variant='outlined'
                  color='secondary'
                  InputProps={{
                    style: {
                      fontFamily: '\'Lato\', sans-serif',
                      backgroundColor: 'white',
                    },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: '\'Lato\', sans-serif' },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' },
                  }}
                />
              </div>
            )}

            {user?.countryId === 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
              <div className='field' style={{ padding: '10px' }}>
                <Field
                  as={TextField}
                  name='routingNumber'
                  type='text'
                  fullWidth
                  required
                  id='routingNumber'
                  label={t('STRIPE_CONNECT.ROUTING_NUMBER')}
                  variant='outlined'
                  color='secondary'
                  InputProps={{
                    style: {
                      fontFamily: '\'Lato\', sans-serif',
                      backgroundColor: 'white',
                    },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: '\'Lato\', sans-serif' },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' },
                  }}
                />
              </div>
            )}

            {user?.countryId === 'c4c4acdc-57b9-4567-a3ca-a03faa0b58f9' && (
              <div className='field' style={{ padding: '10px' }}>
                <Field
                  as={TextField}
                  name='accountNumber'
                  type='text'
                  fullWidth
                  required
                  id='accountNumber'
                  label={t('STRIPE_CONNECT.ACCOUNT_NUMBER')}
                  variant='outlined'
                  color='secondary'
                  InputProps={{
                    style: {
                      fontFamily: '\'Lato\', sans-serif',
                      backgroundColor: 'white',
                    },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: '\'Lato\', sans-serif' },
                  }}
                  FormHelperTextProps={{
                    style: { color: 'red' },
                  }}
                />
              </div>
            )}

            <div style={{ textAlign: 'center' }}
                 dangerouslySetInnerHTML={{ __html: t('STRIPE_CONNECT.TERMS') }} />
            <div className='flex flex--center align-self-center mt-3'>
              <ScaleLoader color={'#7e6cf2'} loading={loading}
                           style={{ margin: '0 auto' }} />
            </div>
            <div
              className='flex--center'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <ButtonPrimaryGradient id='tutor-onboarding-step-5' type='submit'
                                     disabled={!formik.isValid}
                                     className='btn btn--lg mt-4'>
                {t('REGISTER.NEXT_BUTTON')}
              </ButtonPrimaryGradient>
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
