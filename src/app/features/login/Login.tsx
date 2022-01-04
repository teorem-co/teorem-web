import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import heroImg from '../../../assets/images/hero-img.png';
import { useLoginMutation } from '../../../services/authService';
import { useLazyGetUserIdQuery } from '../../../services/userService';
import TextField from '../../components/form/TextField';
import { PATHS } from '../../routes';
import logo from './../../../assets/images/logo.svg';

interface Values {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { t } = useTranslation();
    const initialValues: Values = {
        email: '',
        password: '',
    };

    const [
        getUserId,
        { isSuccess: isSuccessUserId, isLoading: isLoadingUserId },
    ] = useLazyGetUserIdQuery();
    const [
        login,
        {
            data: loginData,
            isSuccess: isSuccessLogin,
            isLoading: isLoadingLogin,
        },
    ] = useLoginMutation();

    const isLoading = isLoadingLogin || isLoadingUserId;

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            const data = {
                email: values.email,
                password: values.password,
            };
            login(data);
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
            password: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED'))
                .matches(/^(?=.*[a-z])/, t('FORM_VALIDATION.LOWERCASE'))
                .matches(/^(?=.*[A-Z])/, t('FORM_VALIDATION_UPPERCASE'))
                .matches(/^(?=.*[0-9])/, t('FORM_VALIDATION.NUMBER'))
                .matches(/^(?=.*[!@#%&])/, t('FORM_VALIDATION.SPECIAL_CHAR')),
        }),
    });

    useEffect(() => {
        if (isSuccessLogin && loginData) {
            getUserId(loginData.user.id);
        }
    }, [isSuccessLogin]);

    useEffect(() => {
        if (isSuccessUserId) {
            //navigate to other screen
        }
    }, [isSuccessUserId]);

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
                            {t('LOGIN.TITLE')}
                        </div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        htmlFor="email"
                                        className="field__label"
                                    >
                                        {t('LOGIN.FORM.EMAIL')}
                                    </label>
                                    <TextField
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="field">
                                    <label
                                        className="field__label"
                                        htmlFor="password"
                                    >
                                        {t('LOGIN.FORM.PASSWORD')}
                                    </label>
                                    <TextField
                                        name="password"
                                        id="password"
                                        placeholder="Type your password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    className="btn btn--base btn--primary w--100 mb-2 mt-6"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {t('LOGIN.FORM.SUBMIT_BTN')}
                                </button>
                                <button
                                    onClick={() => alert('goBack')}
                                    className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                                    disabled={isLoading}
                                >
                                    {t('LOGIN.FORGOT_PASSWORD')}
                                </button>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="flex--primary mt-8 w--448--max">
                        <div className="type--color--tertiary">
                            {t('WATERMARK')}
                        </div>
                        <div>
                            {t('LOGIN.ACCOUNT')}{' '}
                            <Link to={!isLoading ? PATHS.REGISTER : '#'}>
                                {t('LOGIN.REGISTER')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
