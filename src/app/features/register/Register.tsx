import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import heroImg from '../../../assets/images/hero-img.png';
import TextField from '../../components/form/TextField';
import { useAppSelector } from '../../hooks';
import logo from './../../../assets/images/logo.svg';

interface Values {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const roleSelection = useAppSelector((state) => state.role.selectedRole);

    const initialValues: Values = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validationSchema: Yup.object().shape({
            firstName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            lastName: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            email: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            password: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            passwordRepeat: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: Values) => {
        alert(JSON.stringify(values, null, 2));
    };

    const handleGoBack = () => {
        history.push('/role-selection');
    };

    useEffect(() => {
        //if role selection is empty, redirect to role selection screen
        if (!roleSelection) {
            history.push('/role-selection');
        }
    }, []);

    return (
        <>
            <div className="login">
                <div className="login__aside">
                    <img src={heroImg} alt="Hero Img" />
                </div>
                <div className="login__content">
                    <div className="flex--grow w--448--max">
                        <div className="mb-22">
                            <img className="w--128" src={logo} alt="Theorem" />
                        </div>
                        <div className="type--lg type--wgt--bold mb-4">
                            {t('REGISTER.TITLE', { role: roleSelection })}
                        </div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        htmlFor="firstName"
                                        className="field__label"
                                    >
                                        {t('REGISTER.FORM.FIRST_NAME')}
                                    </label>
                                    <TextField
                                        name="firstName"
                                        id="firstName"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        htmlFor="lastName"
                                        className="field__label"
                                    >
                                        {t('REGISTER.FORM.LAST_NAME')}
                                    </label>
                                    <TextField
                                        name="lastName"
                                        id="lastName"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="email"
                                    >
                                        {t('REGISTER.FORM.EMAIL')}
                                    </label>
                                    <TextField
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="password"
                                    >
                                        {t('REGISTER.FORM.PASSWORD')}
                                    </label>
                                    <TextField
                                        name="password"
                                        id="password"
                                        placeholder="Type your password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="passwordRepeat"
                                    >
                                        {t('REGISTER.FORM.CONFIRM_PASSWORD')}
                                    </label>
                                    <TextField
                                        name="passwordRepeat"
                                        id="passwordRepeat"
                                        placeholder="Type your password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                    />
                                </div>
                                <button
                                    className="btn btn--base btn--primary w--100 mb-2 mt-6"
                                    type="submit"
                                >
                                    {t('REGISTER.FORM.SUBMIT_BUTTON')}
                                </button>
                                <div
                                    onClick={() => handleGoBack()}
                                    className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                                >
                                    <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                                    {t('REGISTER.BACK_BUTTON')}
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

export default Register;
