import { Field, Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment/moment';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { setStepOne } from '../../../../../slices/signUpSlice';
import { useAppSelector } from '../../../../hooks';
import { TextField } from '@mui/material';
import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface StepOneValues {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

type StepOneProps = {
    nextStep: () => void;
};

export const SignupFirstStep = ({ nextStep }: StepOneProps) => {
    const dispatch = useDispatch();
    const state = useAppSelector((state) => state.signUp);
    const { firstName, lastName, dateOfBirth } = state;
    const selectedRole = useAppSelector((state) => state.role.selectedRole);

    const handleSubmitStepOne = async (values: StepOneValues) => {
        dispatch(
            setStepOne({
                firstName: values.firstName,
                lastName: values.lastName,
                dateOfBirth: values.dateOfBirth,
            })
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
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
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

    const validateName = (value: string) => {
        if (value.length === 100) {
            return t('FORM_VALIDATION.MAX_100_CHARS');
        }
        if (value.length < 2 && value.length !== 0) {
            return t('FORM_VALIDATION.TOO_SHORT');
        }
    };

    return (
        <div className="align-self-center sign-up-form-wrapper">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormikProvider value={formik}>
                    <Form onKeyPress={handleEnterKeyOne}>
                        {/*first name*/}
                        <div className="align--center mb-5">
                            <Field
                                as={TextField}
                                name="firstName"
                                type="text"
                                fullWidth
                                required
                                id="firstName"
                                label={t('REGISTER.FORM.FIRST_NAME_PLACEHOLDER')}
                                variant="outlined"
                                error={formik.touched.firstName && !!formik.errors.firstName}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                                color="secondary"
                                InputProps={{
                                    style: {
                                        fontFamily: "'Lato', sans-serif",
                                        backgroundColor: 'white',
                                    },
                                }}
                                InputLabelProps={{
                                    style: { fontFamily: "'Lato', sans-serif" },
                                }}
                                FormHelperTextProps={{
                                    style: { color: 'red' }, // Change the color of the helper text here
                                }}
                                inputProps={{
                                    maxLength: 100,
                                }}
                            />
                        </div>

                        {/*last name*/}
                        <div className="align--center mb-5">
                            <Field
                                as={TextField}
                                name="lastName"
                                type="text"
                                fullWidth
                                required
                                error={formik.touched.lastName && !!formik.errors.lastName}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                                id="lastName"
                                label={t('REGISTER.FORM.LAST_NAME_PLACEHOLDER')}
                                variant="outlined"
                                color="secondary"
                                InputProps={{
                                    style: {
                                        fontFamily: "'Lato', sans-serif",
                                        backgroundColor: 'white',
                                    },
                                }}
                                InputLabelProps={{
                                    style: { fontFamily: "'Lato', sans-serif" },
                                }}
                                FormHelperTextProps={{
                                    style: { color: 'red' }, // Change the color of the helper text here
                                }}
                                inputProps={{
                                    maxLength: 100,
                                }}
                            />
                        </div>

                        {/*date of birth*/}
                        <div className="field align--center field__w-fit-content mb-5">
                            <DatePicker
                                label={t('MY_PROFILE.PROFILE_SETTINGS.BIRTHDAY')}
                                defaultValue={dayjs(dateOfBirth)}
                                value={dayjs(formik.values.dateOfBirth)}
                                format="DD/MM/YYYY"
                                disableFuture
                                sx={{ backgroundColor: 'white' }}
                                onChange={(newValue) => formik.setFieldValue(formik.getFieldProps('dateOfBirth').name, newValue?.toString())}
                            />
                        </div>

                        <button
                            disabled={!formik.isValid}
                            id={`next-button-first-step-${selectedRole}`}
                            type="button"
                            className="btn btn--lg btn--primary cur--pointer mt-5 btn-signup"
                            onClick={() => formik.handleSubmit()}
                        >
                            {t('REGISTER.NEXT_BUTTON')}
                        </button>
                    </Form>
                </FormikProvider>
            </LocalizationProvider>
        </div>
    );
};
