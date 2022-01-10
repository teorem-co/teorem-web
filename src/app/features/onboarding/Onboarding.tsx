import { Form, FormikProvider, useFormik } from 'formik';
import { forwardRef, LegacyRef, useState } from 'react';
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Select from 'react-select';
import * as Yup from 'yup';

import TextField from '../../components/form/TextField';
import { PATHS } from '../../routes';
import logo from './../../../assets/images/logo.svg';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

const Onboarding = () => {
    // const [passTooltip, setPassTooltip] = useState<boolean>(false);
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

    const handleGoBack = () => {
        history.push(PATHS.REGISTER);
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
            <div className="onboarding">
                <div className="onboarding__aside">
                    <div className="onboarding__steps">
                        <div className="type--lg type--wgt--bold mb-2">
                            Welcome to Theorem!
                        </div>
                        <div className="w--350--max mb-10 type--wgt--regular type--color--secondary">
                            Please follow the onboarding process to finish up
                            your profile. It'll take only few minutes.
                        </div>
                        <div className="steps">
                            <div className="steps__item mb-10">
                                <div className="steps__item--left active mr-2">
                                    1
                                </div>
                                <div className="steps__item--right">
                                    <div className="steps__title steps__title--primary">
                                        Personal information
                                    </div>
                                    <div className="steps__title steps__title--secondary">
                                        Let us get to know you a little bit
                                        better
                                    </div>
                                </div>
                            </div>

                            <div className="steps__item mb-10">
                                <div className="steps__item--left mr-2">2</div>
                                <div className="steps__item--right">
                                    <div className="steps__title steps__title--primary">
                                        My Teachings
                                    </div>
                                    <div className="steps__title steps__title--secondary">
                                        Share your professional background
                                    </div>
                                </div>
                            </div>

                            <div className="steps__item">
                                <div className="steps__item--left mr-2">3</div>
                                <div className="steps__item--right">
                                    <div className="steps__title steps__title--primary">
                                        Additional information
                                    </div>
                                    <div className="steps__title steps__title--secondary">
                                        It’s never too much informations
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="onboarding__content">
                    <div className="flex--grow">
                        <div className="mb-22">
                            <img className="w--128" src={logo} alt="Teorem" />
                        </div>
                        <div className="type--lg type--wgt--bold mb-4">
                            Personal Information
                        </div>

                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        htmlFor="country"
                                        className="field__label"
                                    >
                                        Country*
                                    </label>
                                    {/* <TextField
                                        name="country"
                                        id="country"
                                        placeholder="Choose your country"
                                        // disabled={isLoading}
                                    /> */}

                                    <Select
                                        classNamePrefix="onboarding-select"
                                        options={options}
                                        isSearchable={true}
                                        placeholder="Choose your country"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        htmlFor="phoneNumber"
                                        className="field__label"
                                    >
                                        Phone Number*
                                    </label>
                                    {/* <TextField
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        placeholder="Enter your phone number"
                                        // disabled={isLoading}
                                    /> */}

                                    <Select
                                        classNamePrefix="onboarding-select"
                                        options={phoneOptions}
                                        isSearchable={true}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="dateOfBirth"
                                    >
                                        Date of Birth*
                                    </label>
                                    <DatePicker
                                        onChange={onChange}
                                        value={value}
                                        dayPlaceholder="DD"
                                        monthPlaceholder="MM"
                                        yearPlaceholder="YYYY"
                                    />
                                </div>
                                <div className="field field__file">
                                    <label
                                        className="field__label"
                                        htmlFor="profileImage"
                                    >
                                        Profile Image*
                                    </label>
                                    {/* <TextField
                                        name="profileImage"
                                        id="profileImage"
                                        placeholder="Drag and drop to upload"
                                        // disabled={isLoading}
                                    /> */}

                                    <div className="field__file__wrap">
                                        <input
                                            type="file"
                                            className="input__file"
                                        />
                                        <i className="icon icon--upload icon--base icon--grey"></i>
                                        <div className="type--color--tertiary type--wgt--regular">
                                            Drag and drop to upload
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn--base btn--primary w--100 mb-2 mt-6"
                                    type="submit"
                                    // disabled={isLoading}
                                >
                                    Next
                                </button>
                                <div
                                    onClick={() => handleGoBack()}
                                    className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                                >
                                    <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                                    Back to register
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="mt-8">
                        <div className="type--color--tertiary">
                            {' '}
                            {t('WATERMARK')}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Onboarding;
