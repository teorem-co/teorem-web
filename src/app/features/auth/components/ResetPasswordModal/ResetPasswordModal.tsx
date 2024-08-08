import { Field, Form, FormikProvider, useFormik } from 'formik';
import Modal from '../../../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './ResetPasswordModal.module.scss';
import { useTranslation } from 'react-i18next';
import CtaButton from '../../../../components/CtaButton';
import * as Yup from 'yup';
import { TextField, Typography } from '@mui/material';
import { IResetPasswordRequest, useResetPasswordMutation } from '../../../../store/services/authService';
import { setResetPasswordModalOpen } from '../../../../store/slices/modalsSlice';
import { useEffect } from 'react';

export default function ResetPasswordModal() {
    const dispatch = useAppDispatch();
    const { resetPasswordModalOpen } = useAppSelector((state) => state.modals);
    const { t } = useTranslation();
    const [resetPassword, { isError, isLoading, isSuccess, reset }] = useResetPasswordMutation();

    const handleSubmit = async (values: IResetPasswordRequest) => {
        try {
            await resetPassword({
                email: values.email,
            }).unwrap();
        } catch (e) {
            console.log(e);
        }
    };

    const formik = useFormik({
        onSubmit: handleSubmit,
        initialValues: {
            email: '',
        },
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL')).required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    useEffect(() => {
        if (!resetPasswordModalOpen) {
            formik.resetForm();
            reset();
        }
    }, [resetPasswordModalOpen]);

    return (
        <Modal
            open={resetPasswordModalOpen}
            onClose={() => dispatch(setResetPasswordModalOpen(false))}
            onBackdropClick={() => dispatch(setResetPasswordModalOpen(false))}
            title={t('RESET_PASSWORD.TITLE')}
        >
            {isSuccess ? (
                <div className="flex flex--col flex--center m-3">
                    <Typography variant="body1">{t('RESET_PASSWORD.SUCCESS')}</Typography>
                </div>
            ) : (
                <FormikProvider value={formik}>
                    <Form>
                        <Field
                            as={TextField}
                            name="email"
                            type="text"
                            fullWidth
                            error={formik.touched.email && !!formik.errors.email}
                            helperText={formik.touched.email && formik.errors.email}
                            id="email"
                            label={t('RESET_PASSWORD.FORM.EMAIL')}
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
                        <CtaButton type="submit" disabled={!formik.isValid || isLoading} style={{ marginTop: '16px' }}>
                            {t('RESET_PASSWORD.FORM.SUBMIT_BTN')}
                        </CtaButton>
                    </Form>
                </FormikProvider>
            )}
        </Modal>
    );
}
