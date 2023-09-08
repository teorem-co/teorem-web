import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment/moment';
import * as Yup from 'yup';

import MyDatePicker from '../../../components/form/MyDatePicker';
import TextField from '../../../components/form/TextField';
import { useAppSelector } from '../../../hooks';
import { FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setStepOne } from '../../../../slices/tutorSignUpSlice';

interface StepOneValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

type StepOneProps = {
  nextStep:() => void
};

export const TutorSignupFirstStep = ({nextStep}:StepOneProps) => {

  const dispatch = useDispatch();
  const state = useAppSelector((state) => state.tutorSignUp);
  const { firstName, lastName,dateOfBirth } = state;

  const handleSubmitStepOne = async (values: StepOneValues) => {

    dispatch(
      setStepOne({
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth
        }
      )
    );
    nextStep();
  };

  const initialValues: StepOneValues = {
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmitStepOne(values),
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      lastName: Yup.string().min(2, t('FORM_VALIDATION.TOO_SHORT')).max(100, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
      dateOfBirth: Yup.string()
        .required(t('FORM_VALIDATION.REQUIRED'))
        .test('dateOfBirth', t('FORM_VALIDATION.FUTURE_DATE'), (value) => {
          const dateDiff = moment(value).diff(moment(), 'days');
          return dateDiff < 0;
        })
        .test('dateOfBirth', t('FORM_VALIDATION.TUTOR_AGE'), (value) => {
          const dateDiff = moment(value).diff(moment().subtract(18, 'years'), 'days');
          return dateDiff < 0;
        }),
    }),
  });

  const handleEnterKeyOne = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formik.handleSubmit();
    }
  };

  return (
      <div className="align-self-center sign-up-form-wrapper">
        <FormikProvider value={formik}>
          <Form onKeyPress={handleEnterKeyOne}>

            {/*first name*/}
            <div className="field__w-60 align--center">
              <label htmlFor="firstName" className="field__label">
                {t('REGISTER.FORM.FIRST_NAME')}
              </label>
              <TextField
                name="firstName"
                id="firstName"
                placeholder={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}
              />
            </div>

            {/*last name*/}
            <div className="field__w-60 align--center">
              <label htmlFor="lastName" className="field__label">
                {t('REGISTER.FORM.LAST_NAME')}
              </label>
              <TextField
                name="lastName"
                id="lastName"
                placeholder={t('REGISTER.FORM.LAST_NAME_PLACEHOLDER')}
              />
            </div>

            {/*date of birth*/}
            <div
              className="field align--center field__w-fit-content">
              <label className="field__label" htmlFor="dateOfBirth">
                {t('REGISTER.FORM.DATE_OF_BIRTH')}
              </label>
              <MyDatePicker
                form={formik}
                field={formik.getFieldProps('dateOfBirth')}
                meta={formik.getFieldMeta('dateOfBirth')}
              />
            </div>

            <button
              type="button"
              className="btn--lg"
              style={{borderRadius:"25px"}}
              onClick={() => formik.handleSubmit()}>NEXT</button>
          </Form>
        </FormikProvider>
      </div>
  );
};
