import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select from 'react-select';
import * as Yup from 'yup';

import TextField from '../../../components/form/TextField';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

interface IProps {
    handleGoBack: () => void;
    handleNextStep: () => void;
    step: number;
}

const StepTwoTutor: React.FC<IProps> = ({
    handleGoBack,
    handleNextStep,
    step,
}) => {
    const [value, onChange] = useState(new Date());
    const history = useHistory();
    const { t } = useTranslation();
    const options = [
        {
            value: 1,
            label: 'Poland',
        },
    ];

    const phoneOptions = [
        {
            value: 1,
            label: '+385',
        },
        {
            value: 2,
            label: '+98',
        },
        {
            value: 3,
            label: '+355',
        },
        {
            value: 4,
            label: '+54',
        },
    ];

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: '',
    };

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            country: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            dateOfBirth: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            profileImage: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(100, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });
    return (
        <>
            <FormikProvider value={formik}>
                <Form>
                    <div className="field">
                        <label htmlFor="country" className="field__label">
                            Your current occupation*
                        </label>
                        <TextField
                            name="country"
                            id="country"
                            placeholder="What's your current occupation"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber" className="field__label">
                            Years of professional experience (optional)
                        </label>
                        <TextField
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="How many years of professional experience you have"
                            // disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="dateOfBirth">
                            Select level that you're able to teach*
                        </label>
                        <Select
                            classNamePrefix="onboarding-select"
                            options={phoneOptions}
                            isSearchable={true}
                            placeholder="Select"
                        />
                    </div>
                    <div className="field field__file">
                        <label className="field__label" htmlFor="profileImage">
                            Select subjects you teach*
                        </label>

                        <Select
                            classNamePrefix="onboarding-select"
                            options={phoneOptions}
                            isSearchable={true}
                            placeholder="Select"
                        />
                    </div>
                    <button
                        className="btn btn--base btn--primary w--100 mb-2 mt-6"
                        type="submit"
                        // disabled={isLoading}
                        onClick={() => handleNextStep()}
                    >
                        Next
                    </button>
                    <div
                        onClick={() => handleGoBack()}
                        className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                    >
                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                        {step === 1
                            ? 'Back to register'
                            : step === 2
                            ? 'Back to step 1'
                            : 'Back to step 2'}
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
};

export default StepTwoTutor;
