import { Form, FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import TextField from '../../../components/form/TextField';
import { useConnectAccountMutation } from '../services/stripeService';
import { useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';

interface StripeConnectFormProps {
  userId?: string;
  sideBarIsOpen: boolean;
  closeSidebar: () => void;
  onConnect: (accountId: string) => void;
}

/*
 * Returns TRUE if the IBAN is valid
 * Returns FALSE if the IBAN's length is not as should be (for CY the IBAN Should be 28 chars long starting with CY )
 * Returns any other number (checksum) when the IBAN is invalid (check digits do not match)
 */
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

function StripeConnectForm({ sideBarIsOpen, closeSidebar, onConnect, userId }: StripeConnectFormProps) {
  const { t } = useTranslation();
  const [connectAccount, { isSuccess, isLoading, data }] = useConnectAccountMutation();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const removeWhitespaces = (value: string) => value.replace(/\s+/g, '');

  const formik = useFormik({
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      IBAN: '',
      IBANConfirm: '',
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
    onSubmit: async (values) => {
      setLoading(true);
      await connectAccount({
        addressLine1:values.addressLine1,
        addressLine2: values.addressLine2,
        postalCode: values.postalCode,
        city: values.city,
        IBAN: removeWhitespaces(values.IBAN),
        IBANConfirm: removeWhitespaces(values.IBANConfirm),
        userId:  userId ? userId : user!.id, //TODO: check if it works
      })
        .unwrap()
        .then((res) => {
          onConnect(res);
          toastService.success(t('STRIPE_CONNECT.SUCCESS'));
          formik.resetForm();
          setLoading(false);
          closeSidebar();
        });
    },
  });
  return (
    <div>
      <div className={`cur--pointer sidebar__overlay ${!sideBarIsOpen ? 'sidebar__overlay--close' : ''}`} onClick={closeSidebar}></div>
      <div className={`sidebar sidebar--secondary sidebar--secondary ${!sideBarIsOpen ? 'sidebar--secondary--close' : ''}`}>
        <div className="flex--primary flex--shrink">
          <div className="type--color--secondary">{t('STRIPE_CONNECT.TITLE')}</div>
          <div>
            <i className="icon icon--base icon--close icon--grey" onClick={closeSidebar}></i>
          </div>
        </div>
        <div className="flex--grow mt-10">
          <FormikProvider value={formik}>
            <Form>
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
            </Form>
          </FormikProvider>
        </div>
        <div className="flex--shirnk sidebar--secondary__bottom mt-10">
          <div className="flex--primary mt-6">
            <button
              className="btn btn--primary btn--base type--wgt--extra-bold"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              {t('STRIPE_CONNECT.SAVE')}
            </button>
            <button
              className="btn btn--clear type--color--error type--wgt--extra-bold"
              onClick={() => {
                formik.resetForm();
                closeSidebar();
              }}
            >
              {t('STRIPE_CONNECT.CANCEL')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StripeConnectForm;
