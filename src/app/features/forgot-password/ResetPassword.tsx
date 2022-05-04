import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import heroImg from '../../../assets/images/hero-img.png';
import { useChangePasswordMutation } from '../../../services/authService';
import TextField from '../../components/form/TextField';
import { PATHS } from '../../routes';
import getUrlParams from '../../utils/getUrlParams';
import TooltipPassword from '../register/TooltipPassword';
import logo from './../../../assets/images/logo.svg';

interface Values {
    password: string;
    repeatPassword: string;
}

interface IUrlQuery {
    token: string;
}

const ResetPassword = () => {
    const [changePassword] = useChangePasswordMutation();

    const [token, setToken] = useState<string>('');
    const [passTooltip, setPassTooltip] = useState<boolean>(false);

    const { t } = useTranslation();
    const history = useHistory();
    const initialValues: Values = {
        password: '',
        repeatPassword: '',
    };
    const myInput = document.getElementById('password') as HTMLInputElement;
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');
    const special = document.getElementById('special');

    const handleKeyUp = () => {
        const lowerCaseLetters = /[a-z]/g;
        if (letter && myInput?.value.match(lowerCaseLetters)) {
            letter.classList.remove('icon--grey');
            letter.classList.add('icon--success');
        } else {
            letter?.classList.remove('icon--success');
            letter?.classList.add('icon--grey');
        }

        // Validate capital letters
        const upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital?.classList.remove('icon--grey');
            capital?.classList.add('icon--success');
        } else {
            capital?.classList.remove('icon--success');
            capital?.classList.add('icon--grey');
        }

        // Validate numbers
        const numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number?.classList.remove('icon--grey');
            number?.classList.add('icon--success');
        } else {
            number?.classList.remove('icon--success');
            number?.classList.add('icon--grey');
        }

        // Validate length
        if (myInput.value.length >= 8) {
            length?.classList.remove('icon--grey');
            length?.classList.add('icon--success');
        } else {
            length?.classList.remove('icon--success');
            length?.classList.add('icon--grey');
        }

        // Validate special characters
        const specialCharacters = /[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]/;
        if (myInput.value.match(specialCharacters)) {
            special?.classList.remove('icon--grey');
            special?.classList.add('icon--success');
        } else {
            special?.classList.remove('icon--success');
            special?.classList.add('icon--grey');
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .min(8, t('FORM_VALIDATION.TOO_SHORT'))
                .max(128, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                ),
            repeatPassword: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .oneOf([Yup.ref('password'), null], t('FORM_VALIDATION.PASSWORD_MATCH')),
        }),
    });

    const handleSubmit = async (values: Values) => {
        const toSend = {
            token: token ? token : '',
            password: values.password,
            repeatPassword: values.repeatPassword,
        };
        await changePassword(toSend).unwrap();
        history.push(t(PATHS.LOGIN));
    };

    const handleGoBack = () => {
        history.push(t(PATHS.LOGIN));
    };

    const handlePasswordBlur = () => {
        setPassTooltip(false);
    };

    const handlePasswordFocus = () => {
        setPassTooltip(true);
    };

    useEffect(() => {
        const urlQueries: IUrlQuery = getUrlParams(history.location.search.replace('?', ''));
        setToken(urlQueries.token);
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
                        <div className="type--lg type--wgt--bold mb-4">{t('RESET_PASSWORD.TITLE')}</div>
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="field">
                                    <label htmlFor="password" className="field__label">
                                        {t('RESET_PASSWORD.FORM.PASSWORD')}
                                    </label>
                                    <TextField
                                        name="password"
                                        id="password"
                                        placeholder="Type your password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                        onFocus={handlePasswordFocus}
                                        onBlur={(e: any) => {
                                            handlePasswordBlur();
                                            formik.handleBlur(e);
                                        }}
                                        onKeyUp={handleKeyUp}
                                    />
                                    <TooltipPassword passTooltip={passTooltip} />
                                </div>
                                <div className="field">
                                    <label htmlFor="repeatPassword" className="field__label">
                                        {t('RESET_PASSWORD.FORM.REPEAT_PASSWORD')}
                                    </label>
                                    <TextField
                                        name="repeatPassword"
                                        id="repeatPassword"
                                        placeholder="Repeat password"
                                        className="input input--base input--text input--icon"
                                        password={true}
                                    />
                                </div>

                                <button className="btn btn--base btn--primary w--100 mb-2 mt-6 type--wgt--extra-bold" type="submit">
                                    {t('RESET_PASSWORD.FORM.SUBMIT_BTN')}
                                </button>
                                <div className="flex flex--jc--center">
                                    <div onClick={() => handleGoBack()} className="btn btn--clear btn--base type--color--brand type--wgt--extra-bold">
                                        <i className="icon icon--arrow-left icon--base icon--primary d--ib mr-2"></i> {t('RESET_PASSWORD.BACK_BTN')}
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                    <div className="mt-8">
                        <div className="type--color--tertiary"> {t('WATERMARK')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
