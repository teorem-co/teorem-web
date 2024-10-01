import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

import Modal from '../../../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './RegistrationModal.module.scss';
import TabButton from '../../../../components/TabButton';
import { useCallback, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import parentImg from '../../../../../assets/images/parent.png';
import studentImg from '../../../../../assets/images/student.png';
import logoImg from '../../../../../assets/images/logomark.png';
import tutorImg from '../../../../../assets/images/tutor.png';
import TRIGGER_MAP from './constants/triggerMap';
import CtaButton from '../../../../components/CtaButton';
import { Role } from '../../../../types/role';
import {
    IRegisterRequest,
    useCheckMailMutation,
    useRegisterUserMutation,
    useResendActivationEmailMutation,
} from '../../../../store/services/authService';
import { setConfirmationModalOpen, setRegistrationModalOpen } from '../../../../store/slices/modalsSlice';
import { LOWERCASE_REGEX, NUMBER_REGEX, SPECIAL_REGEX, UPPERCASE_REGEX } from '../../../../constants/regex';
import MyPhoneInput from '../../../../components/form/MyPhoneInput';
import PasswordTooltip from '../../../../components/PasswordTooltip';
import LEVELS from '../../../../constants/levels';
import SUBJECTS from '../../../../constants/subjects';

const RESET_PERIOD = 40;

export default function RegistrationModal() {
    const { t } = useTranslation();
    const { registrationModalOpen, confirmationModalOpen } = useAppSelector((state) => state.modals);
    const dispatch = useAppDispatch();
    const [selectedRole, setSelectedRole] = useState<Role>();
    const [marketingOptOut, setMarketingOptOut] = useState<boolean>(false);
    const [registerUser, { isSuccess, isLoading }] = useRegisterUserMutation();
    const [resendActivationEmail] = useResendActivationEmailMutation();
    const { selectedCountry, countries } = useAppSelector((state) => state.countryMarket);
    const { selectedLanguage, languages } = useAppSelector((state) => state.lang);
    const [resendTimer, setResendTimer] = useState<number>(RESET_PERIOD);
    const [showPassword, setShowPassword] = useState(false);
    const [roleNotSelected, setRoleNotSelected] = useState(false);
    const [checkMail] = useCheckMailMutation();
    const [pwdHas, setPwdHas] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        length: 0,
    });
    const [mailForResend, setMailForResend] = useState<string>('');

    const timer = useCallback(() => {
        setResendTimer((v) => {
            if (v <= 0) return 0;
            setTimeout(timer, 1000);
            return v - 1;
        });
    }, []);

    const handleSubmit = useCallback(
        async (values: Partial<IRegisterRequest>, formik: any) => {
            if (!selectedRole) return setRoleNotSelected(true);

            const isUsed = await checkMail({ email: values.email! }).unwrap();

            if (isUsed) {
                formik.setFieldError('email', t('FORM_VALIDATION.EMAIL_EXISTS'));
                return;
            }

            const resolvedSelectedCountry = countries.find((c) => c.abrv === selectedCountry?.abrv);
            const resolvedSelectedLanguage = languages.find((l) => l.abrv === selectedLanguage?.abrv);

            await registerUser({
                firstName: values.firstName!,
                lastName: values.lastName!,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : '',
                email: values.email!,
                phoneNumber: values.phoneNumber!,
                countryId: resolvedSelectedCountry?.id || '',
                languageId: resolvedSelectedLanguage?.id || '',
                password: values.password!,
                confirmPassword: values.password!,
                roleAbrv: selectedRole,
                levelId: LEVELS[0].id,
                subjectId: SUBJECTS[0].id,
                // TODO: add marketing newsletter
            }).unwrap();

            setMailForResend(values.email!);

            formik.resetForm();

            dispatch(setRegistrationModalOpen(false));
            dispatch(setConfirmationModalOpen(true));
            setResendTimer(40);
            setTimeout(timer, 1000);
        },
        [
            selectedRole,
            checkMail,
            countries,
            languages,
            registerUser,
            dispatch,
            timer,
            t,
            selectedCountry?.abrv,
            selectedLanguage?.abrv,
        ]
    );

    const formik: any = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            password: '',
        },
        onSubmit: (values) => handleSubmit(values, formik),
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
                    const dateDiff = dayjs(value).diff(dayjs(), 'days');
                    return dateDiff < 0;
                })
                .test('dateOfBirth', '', (value) => {
                    if (!value) return false;
                    const isMoreThan100YearsOld: boolean = dayjs(value)?.isBefore(dayjs().subtract(100, 'years'));
                    return !isMoreThan100YearsOld;
                })
                .test('dateOfBirth', t('FORM_VALIDATION.TUTOR_AGE'), (value) => {
                    if (!value) return false;
                    const dateDiff = dayjs(value).diff(dayjs().subtract(18, 'years'), 'days');
                    return dateDiff <= 0;
                }),
            email: Yup.string().email(t('FORM_VALIDATION.INVALID_EMAIL')).required(t('FORM_VALIDATION.REQUIRED')),
            phoneNumber: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .min(7, t('FORM_VALIDATION.PHONE_SHORT')) // 10 characters
                .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/gm,
                    t('FORM_VALIDATION.PHONE_NUMBER')
                ),
            password: Yup.string()
                .required(t('FORM_VALIDATION.REQUIRED'))
                .min(8, t('FORM_VALIDATION.TOO_SHORT'))
                .max(128, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                ),
            // confirmPassword: Yup.string()
            //   .required(t('FORM_VALIDATION.REQUIRED'))
            //   .oneOf([Yup.ref('password'), null], t('FORM_VALIDATION.PASSWORD_MATCH')),
        }),
    });

    const handleResend = useCallback(
        async (e: any) => {
            e.preventDefault();
            try {
                await resendActivationEmail({
                    email: mailForResend,
                }).unwrap();
            } finally {
                setResendTimer(40);
                setTimeout(timer, 1000);
            }
        },
        [mailForResend, resendActivationEmail, timer]
    );

    const handleValidatePassword = (value: string) => {
        setPwdHas(() => ({
            special: SPECIAL_REGEX.test(value),
            length: value.length,
            number: NUMBER_REGEX.test(value),
            lowercase: LOWERCASE_REGEX.test(value),
            uppercase: UPPERCASE_REGEX.test(value),
        }));
    };

    return (
        <>
            <Modal
                open={registrationModalOpen}
                onBackdropClick={() => dispatch(setRegistrationModalOpen(false))}
                onClose={() => dispatch(setRegistrationModalOpen(false))}
                title={t('REGISTER.TITLE')}
            >
                <FormikProvider value={formik}>
                    <Form>
                        <Typography variant="h6" sx={{ marginTop: '-16px' }}>
                            {t('REGISTER.FORM.BUTTONS_SUBTITLE')}
                        </Typography>
                        <div className={styles.tabs}>
                            <TabButton
                                onClick={() => setSelectedRole(Role.Parent)}
                                active={selectedRole === Role.Parent}
                                color="inherit"
                            >
                                {t('REGISTER.FORM.BUTTON_PARENT')}
                                <img className={styles.img} src={parentImg} />
                            </TabButton>
                            <TabButton
                                onClick={() => setSelectedRole(Role.Student)}
                                active={selectedRole === Role.Student}
                                color="inherit"
                            >
                                {t('REGISTER.FORM.BUTTON_STUDENT')}
                                <img className={styles.img} src={studentImg} />
                            </TabButton>
                            <TabButton
                                onClick={() => setSelectedRole(Role.Tutor)}
                                active={selectedRole === Role.Tutor}
                                color="inherit"
                            >
                                {t('REGISTER.FORM.BUTTON_TUTOR')}
                                <img className={styles.img} src={tutorImg} />
                            </TabButton>
                        </div>
                        {roleNotSelected ? <p style={{ color: 'red' }}>{t('REGISTER.FORM.ROLE_ERROR')}</p> : null}
                        <Typography variant="h6">{t('REGISTER.FORM.NAME_SUBTITLE')}</Typography>
                        <Field
                            as={TextField}
                            name="firstName"
                            type="text"
                            fullWidth
                            id="firstName"
                            label={t('REGISTER.FORM.FIRST_NAME')}
                            variant="outlined"
                            error={formik.touched.firstName && !!formik.errors.firstName}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                        />
                        <Field
                            as={TextField}
                            name="lastName"
                            type="text"
                            fullWidth
                            error={formik.touched.lastName && !!formik.errors.lastName}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            id="lastName"
                            label={t('REGISTER.FORM.LAST_NAME')}
                            variant="outlined"
                            FormHelperTextProps={{
                                style: { color: 'red' }, // Change the color of the helper text here
                            }}
                            inputProps={{
                                maxLength: 100,
                            }}
                            sx={{ marginBottom: '0px' }}
                        />
                        <Typography variant="caption">{t('REGISTER.FORM.LAST_NAME_INFO')}</Typography>
                        <Typography variant="h6">{t('REGISTER.FORM.DATE_OF_BIRTH_SUBTITLE')}</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className="w--100"
                                label={t('REGISTER.FORM.DATE_OF_BIRTH')}
                                defaultValue={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                                value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                                format={`${t('BIRTH_DATE_FORMAT')}`}
                                disableFuture
                                minDate={dayjs('1900-01-01')}
                                maxDate={dayjs()}
                                sx={{ marginBottom: '0px' }}
                                onChange={(newValue) => formik.setFieldValue('dateOfBirth', newValue?.toString())}
                            />
                        </LocalizationProvider>
                        <Typography variant="caption">{t('REGISTER.FORM.DATE_OF_BIRTH_INFO')}</Typography>
                        <Typography variant="h6">{t('REGISTER.FORM.CONTACT_INFO_SUBTITLE')}</Typography>
                        <Field
                            as={TextField}
                            name="email"
                            type="text"
                            fullWidth
                            error={formik.touched.email && !!formik.errors.email}
                            helperText={formik.touched.email && formik.errors.email}
                            id="email"
                            label={t('REGISTER.FORM.EMAIL')}
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
                        <MyPhoneInput
                            form={formik}
                            name="phoneNumber"
                            field={formik.getFieldProps('phoneNumber')}
                            meta={formik.getFieldMeta('phoneNumber')}
                        />
                        <Typography variant="caption">{t('REGISTER.FORM.PHONE_INFO')}</Typography>
                        <Typography variant="h6">{t('REGISTER.FORM.PASSWORD_SUBTITLE')}</Typography>

                        <Field
                            as={TextField}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            error={formik.touched.password && !!formik.errors.password}
                            helperText={formik.touched.password && formik.errors.password}
                            id="password"
                            label={t('REGISTER.FORM.PASSWORD')}
                            variant="outlined"
                            validate={handleValidatePassword}
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
                        <PasswordTooltip
                            className="password-tooltip"
                            passTooltip={true}
                            conditions={{
                                ...pwdHas,
                                includesEmail:
                                    !!formik.values.email.length &&
                                    formik.values.password.toLowerCase().includes(formik.values.email.toLowerCase()),
                                includesName:
                                    !!formik.values.firstName.length &&
                                    formik.values.password
                                        .toLowerCase()
                                        .includes(formik.values.firstName.toLowerCase()),
                            }}
                            positionTop={false}
                        />
                        <Typography
                            variant="caption"
                            dangerouslySetInnerHTML={{ __html: t('REGISTER.FORM.TERMS_AND_CONDITIONS') }}
                        />
                        <CtaButton
                            type="button"
                            sx={{ marginTop: '12px' }}
                            id={selectedRole ? TRIGGER_MAP[selectedRole] : undefined}
                            disabled={!formik.isValid || !selectedRole || isLoading}
                            onClick={() => formik.handleSubmit()}
                        >
                            {t('REGISTER.FORM.SUBMIT_BUTTON')}
                        </CtaButton>
                        {/* <Divider />
                            <Typography>{t('REGISTER.FORM.MARKETING_DISCLAIMER')}</Typography>
                            <FormControlLabel
                                value={marketingOptOut}
                                onChange={(e) => setMarketingOptOut((v) => !v)}
                                control={<Checkbox size="small" />}
                                label={t('REGISTER.FORM.MARKETING_DISCLAIMER_CHECKBOX')}
                            /> */}
                    </Form>
                </FormikProvider>
            </Modal>
            <Modal
                title={t('REGISTER.TITLE')}
                onBackdropClick={() => dispatch(setConfirmationModalOpen(false))}
                onClose={() => dispatch(setConfirmationModalOpen(false))}
                open={confirmationModalOpen}
            >
                <form className={styles.content} onSubmit={handleResend}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img className={styles.logo} src={logoImg} />
                    </div>
                    <Typography sx={{ textAlign: 'center' }} variant="h5" component="h2">
                        {t('EMAIL_CONFIRMATION_POPUP.WELCOME')}
                    </Typography>
                    <Typography sx={{ textAlign: 'center' }}>{t('EMAIL_CONFIRMATION_POPUP.DESCRIPTION')}</Typography>
                    <CtaButton style={{ marginTop: '16px' }} type="submit" disabled={resendTimer > 0}>
                        {resendTimer > 0
                            ? `${t('EMAIL_CONFIRMATION_POPUP.RESEND_TIMEOUT')} ${resendTimer}s`
                            : t('EMAIL_CONFIRMATION_POPUP.EXPIRATION')}
                    </CtaButton>
                </form>
            </Modal>
        </>
    );
}
