import { Field, Form, FormikProvider, useFormik } from 'formik';
import Modal from '../../../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './LoginModal.module.scss';
import { useTranslation } from 'react-i18next';
import CtaButton from '../../../../components/CtaButton';
import * as Yup from 'yup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Divider from '../../../../components/Divider';
import {
    setLoginModalOpen,
    setRegistrationModalOpen,
    setResetPasswordModalOpen,
} from '../../../../store/slices/modalsSlice';
import { ILoginRequest, useConfirmLoginMutation, useLoginMutation } from '../../../../store/services/authService';
import { setToken } from '../../../../store/slices/authSlice';

export default function LoginModal() {
    const { loginModalOpen } = useAppSelector((state) => state.modals);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [login, { isError, isLoading }] = useLoginMutation();
    const [confirmLogin] = useConfirmLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (values: ILoginRequest) => {
        try {
            const resp1 = await login({
                email: values.email,
                password: values.password,
            })
                .unwrap()
                .catch((e) => {
                    setErrorMessage(e.data.message);
                    throw e;
                });

            const resp2 = await confirmLogin(resp1).unwrap();

            dispatch(setToken(resp2));

            dispatch(setLoginModalOpen(false));
        } catch (e) {
            console.log(e);
        }
    };

    const handleForgotClick = () => {
        dispatch(setLoginModalOpen(false));
        formik.resetForm();
        dispatch(setResetPasswordModalOpen(true));
    };

    const handleRegisterClick = () => {
        dispatch(setLoginModalOpen(false));
        formik.resetForm();
        dispatch(setRegistrationModalOpen(true));
    };

    const formik = useFormik({
        onSubmit: handleSubmit,
        initialValues: {
            email: '',
            password: '',
        },
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL')).required(t('FORM_VALIDATION.REQUIRED')),
            password: Yup.string().min(8).required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    return (
        <Modal
            title={t('LOGIN.TITLE')}
            open={loginModalOpen}
            onClose={() => dispatch(setLoginModalOpen(false))}
            onBackdropClick={() => dispatch(setLoginModalOpen(false))}
        >
            <FormikProvider value={formik}>
                <Form>
                    {isError ? (
                        <Alert severity="error" style={{ marginBottom: '12px' }}>
                            <AlertTitle>{t(errorMessage + '.TITLE')}</AlertTitle>
                            {t(errorMessage + '.BODY')}
                        </Alert>
                    ) : null}
                    <Field
                        as={TextField}
                        name="email"
                        type="text"
                        fullWidth
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                        id="email"
                        label={t('LOGIN.FORM.EMAIL')}
                        variant="outlined"
                        FormHelperTextProps={{
                            style: { color: 'red' }, // Change the color of the helper text here
                        }}
                        inputProps={{
                            maxLength: 100,
                        }}
                        onBlur={(e: any) => {
                            formik.handleBlur(e);
                        }}
                    />
                    <Field
                        as={TextField}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        error={formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                        id="password"
                        label={t('LOGIN.FORM.PASSWORD')}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((v) => !v)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        FormHelperTextProps={{
                            style: { color: 'red' }, // Change the color of the helper text here
                        }}
                        inputProps={{
                            maxLength: 100,
                        }}
                        onBlur={(e: any) => {
                            formik.handleBlur(e);
                        }}
                        sx={{ marginBottom: '0px' }}
                        // onKeyUp={handleKeyUp}
                    />
                    <CtaButton type="submit" style={{ marginTop: '16px' }} disabled={!formik.isValid || isLoading}>
                        {t('LOGIN.FORM.SUBMIT_BTN')}
                    </CtaButton>
                    <div className="flex flex--col flex--center m-3">
                        <a href="#" onClick={handleForgotClick}>
                            {t('LOGIN.FORGOT_PASSWORD')}
                        </a>
                    </div>
                    <Divider />
                    <div className="flex flex--col flex--center m-3">
                        <Typography variant="body2">
                            {t('LOGIN.ACCOUNT')}{' '}
                            <a href="#" onClick={handleRegisterClick}>
                                {t('LOGIN.REGISTER')}
                            </a>
                            .
                        </Typography>
                    </div>
                </Form>
            </FormikProvider>
        </Modal>
    );
}
