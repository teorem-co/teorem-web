import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';
import moment from 'moment';
import MyPhoneInput from '../../../components/form/MyPhoneInput';
import { useRef, useState } from 'react';
import TextField from '../../../components/form/TextField';
import { useCheckMailMutation } from '../../../../services/authService';
import useOutsideAlerter from '../../../utils/useOutsideAlerter';

interface StepTwoValues {
  email: string;
  phoneNumber: string;
}

export const TutorSignupSecondStep = () => {
  const rangeSetterRef = useRef<HTMLDivElement>(null);
  const [phoneTooltip, setPhoneTooltip] = useState<boolean>(false);
  const [checkMailValidation, setCheckMailValidation] = useState<string>('');
  const [checkMail] = useCheckMailMutation();

  const hideTooltip = () => {
    setPhoneTooltip(false);
  };

  useOutsideAlerter(rangeSetterRef, hideTooltip);

  const initialValues: StepTwoValues = {
    email: '',
    phoneNumber: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmitStepTwo(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL')).required(t('FORM_VALIDATION.REQUIRED')),
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

  const checkEmailExistence = async () => {
    const isValid = await checkMail({
      email: formik.values.email,
    }).unwrap();
    if (isValid) {
      setCheckMailValidation(t('REGISTER.EMAIL_CONFLICT'));
    } else {
      setCheckMailValidation('');
    }
  };

  function handleSubmitStepTwo(values: StepTwoValues) {
    return undefined;
  }

  return (
    <>
      <div
        style={{width:"50%", margin:"3em auto"}}
      >
        <FormikProvider value={formik}>
          <Form onKeyPress={handleEnterKeyOne}>

            {/*phone number*/}
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

            {/*email*/}
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
              />
            </div>

          </Form>
        </FormikProvider>
      </div>

    </>
  );
};
