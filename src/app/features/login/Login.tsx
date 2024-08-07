import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
    useConfirmLoginMutation,
    useLazyGetServerVersionQuery,
    useLoginMutation,
    useResendActivationEmailMutation,
} from '../../store/services/authService';
import MyTextField from '../../components/form/MyTextField';
import { useAppSelector } from '../../store/hooks';
import { Role } from '../../types/role';
import { PATHS } from '../../routes';
import logo from './../../../assets/images/logo.svg';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/authSlice';
import { ButtonPrimaryGradient } from '../../components/ButtonPrimaryGradient';

interface Values {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>();
    const [loginSentAgainMessage, setLoginSentAgainMessage] = useState<boolean>();
    const [loginUserNotActive, setLoginUserNotActive] = useState<boolean>(false);

    const [login, { data: loginData, isSuccess: isSuccessLogin, isLoading: isLoadingLogin, error: errorLogin }] =
        useLoginMutation();
    const [confirmLogin] = useConfirmLoginMutation();
    const [getServerVersion, { data: serverVersion, isSuccess: isSuccessServerVersion }] =
        useLazyGetServerVersionQuery();
    const [resendEmail, setResendEmail] = useState<string>('');

    const [resendActivationEmailPost, { isSuccess: isSuccessResendActivationEmail }] =
        useResendActivationEmailMutation();
    const userRoleAbrv = useAppSelector((state) => state.auth.user?.Role?.abrv);
    const userToken = useAppSelector((state) => state.auth.token);

    const dispatch = useDispatch();

    const initialValues: Values = {
        email: '',
        password: '',
    };

    const handleGoBack = () => {
        history.push(PATHS.FORGOT_PASSWORD);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            const data = {
                email: values.email,
                password: values.password,
            };

            setResendEmail(values.email);

            const resp1 = await login(data).unwrap();

            const resp2 = await confirmLogin(resp1).unwrap();

            dispatch(setToken(resp2));

            getServerVersion();
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            password: Yup.string()
                .min(2, t('FORM_VALIDATION.TOO_SHORT'))
                .max(50, t('FORM_VALIDATION.TOO_LONG'))
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const resendActivationEmail = () => {
        if (resendEmail.length) {
            resendActivationEmailPost({
                email: resendEmail,
            });
            setLoginSentAgainMessage(false);
        }
    };

    useEffect(() => {
        if (isSuccessResendActivationEmail) {
            setLoginSentAgainMessage(true);
        }
    }, [isSuccessResendActivationEmail]);

    useEffect(() => {
        if (userToken && userRoleAbrv) {
            if (userRoleAbrv === Role.Tutor) {
                history.push(PATHS.DASHBOARD);
            } else if (userRoleAbrv === Role.Child) {
                history.push(PATHS.MY_BOOKINGS);
            } else if (userRoleAbrv === Role.SuperAdmin) {
                history.push(PATHS.TUTOR_MANAGMENT);
            } else {
                history.push(PATHS.SEARCH_TUTORS);
            }
        }
    }, []);

    useEffect(() => {
        if (isSuccessLogin && loginData && userRoleAbrv) {
            if (userRoleAbrv === Role.Child) {
                history.push(PATHS.MY_BOOKINGS);
            } else if (userRoleAbrv === Role.SuperAdmin) {
                history.push(PATHS.TUTOR_MANAGMENT);
            } else {
                history.push(PATHS.DASHBOARD);
            }
        }
    }, [userRoleAbrv]);

    useEffect(() => {
        const loginError: any = errorLogin;

        if (loginError) {
            setLoginErrorMessage(loginError.data?.message);

            if (loginError.data && loginError.data.message == 'BACKEND_ERRORS.USER.PROFILE_NOT_ACTIVE.SENT_AGAIN') {
                setLoginUserNotActive(true);
            } else {
                setLoginUserNotActive(false);
            }
        }
    }, [errorLogin]);

    return (
        <>
            <div className="login">
                <div className="login__content">
                    <div className="flex--grow w--448--max">
                        <div className="mb-22">
                            <img className="w--128" src={logo} alt="Teorem" />
                        </div>
                        <div className="type--lg type--wgt--bold mb-4">{t('LOGIN.TITLE')}</div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label htmlFor="email" className="field__label">
                                        {t('LOGIN.FORM.EMAIL')}
                                    </label>
                                    <MyTextField
                                        name="email"
                                        id="email"
                                        placeholder={t('LOGIN.FORM.EMAIL_PLACEHOLDER')}
                                        disabled={isLoadingLogin}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field__label" htmlFor="password">
                                        {t('LOGIN.FORM.PASSWORD')}
                                    </label>
                                    <MyTextField
                                        name="password"
                                        id="password"
                                        placeholder={t('LOGIN.FORM.PASSWORD_PLACEHOLDER')}
                                        className="input input--base input--text input--icon"
                                        password={true}
                                        disabled={isLoadingLogin}
                                    />
                                </div>
                                {loginErrorMessage && !loginSentAgainMessage ? (
                                    <div className="type--color--error">{t(loginErrorMessage)}</div>
                                ) : (
                                    <></>
                                )}
                                {loginSentAgainMessage ? (
                                    <div className="type--color--success">{t('LOGIN.FORM.SEND_AGAIN_SUCCESS')}</div>
                                ) : (
                                    <></>
                                )}
                                {loginUserNotActive && !loginSentAgainMessage && (
                                    <div>
                                        <ButtonPrimaryGradient
                                            className="btn btn--base w--100 mb-2 mt-6 type--wgt--extra-bold"
                                            onClick={resendActivationEmail}
                                        >
                                            {t('LOGIN.FORM.SEND_AGAIN')}
                                        </ButtonPrimaryGradient>
                                    </div>
                                )}
                                <ButtonPrimaryGradient
                                    className="btn btn--base w--100 mb-2 mt-6 type--wgt--extra-bold"
                                    type="submit"
                                    disabled={isLoadingLogin}
                                >
                                    {t('LOGIN.FORM.SUBMIT_BTN')}
                                </ButtonPrimaryGradient>

                                <div className={'flex flex--col flex--center mt-2'}>
                                    <Link
                                        id="zapocni-danas-login-1"
                                        className="type--wgt--extra-bold mt-1"
                                        to={!isLoadingLogin ? PATHS.FORGOT_PASSWORD : '#'}
                                    >
                                        {t('LOGIN.FORGOT_PASSWORD')}
                                    </Link>
                                    <div className={'mt-3'}>
                                        {t('LOGIN.ACCOUNT')}{' '}
                                        <Link id="zapocni-danas-login-1" className="type--wgt--extra-bold" to={'#'}>
                                            {t('LOGIN.REGISTER')}
                                        </Link>
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="flex--primary mt-8 w--448--max">
                        <div className="type--color--tertiary">{t('WATERMARK')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
