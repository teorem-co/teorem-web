import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import heroImg from '../../../assets/images/hero-img.png';
import TextField from '../../components/form/TextField';
import { PATHS } from '../../routes';
import { useResetPasswordMutation } from '../../services/authService';
import logo from './../../../assets/images/logo.svg';

interface Values {
    email: string;
}

const ResetPassword = () => {
    const { t } = useTranslation();

    const history = useHistory();

    const initialValues: Values = {
        email: '',
    };

    const [resetPassword, { isLoading, isSuccess }] =
        useResetPasswordMutation();

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email(t('FORM_VALIDATION.INVALID_EMAIL'))
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const handleSubmit = (values: Values) => {
        resetPassword(values);
    };

    useEffect(() => {
        if (isSuccess) {
            history.push(PATHS.LOGIN);
        }
    }, [isSuccess]);

    const handleGoBack = () => {
        history.push(PATHS.LOGIN);
    };

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
                            {t('RESET_PASSWORD.TITLE')}
                        </div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label
                                        htmlFor="email"
                                        className="field__label"
                                    >
                                        {t('RESET_PASSWORD.FORM.EMAIL')}
                                    </label>
                                    <TextField
                                        name="email"
                                        id="email"
                                        placeholder={t(
                                            'RESET_PASSWORD.FORM.ENTER_MAIL'
                                        )}
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    className="btn btn--base btn--primary w--100 mb-2 mt-6"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {t('RESET_PASSWORD.FORM.SUBMIT_BTN')}
                                </button>
                                <div
                                    onClick={() => handleGoBack()}
                                    className="btn btn--clear btn--base w--100 type--color--brand type--wgt--bold type--center"
                                >
                                    <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i>{' '}
                                    {t('RESET_PASSWORD.BACK_BTN')}
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

export default ResetPassword;
