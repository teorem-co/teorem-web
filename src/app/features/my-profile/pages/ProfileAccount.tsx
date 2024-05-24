import { Field, Form, FormikProvider, useFormik } from 'formik';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useChangeCurrentPasswordMutation } from '../../../../services/authService';
import {
    useLazyDisableTutorQuery,
    useLazyEnableTutorQuery,
    useLazyGetIsTutorDisabledQuery,
    useLazyGetProfileProgressQuery,
} from '../../../../services/tutorService';
import { addStripeId, connectStripe } from '../../../../slices/authSlice';
import { RoleOptions } from '../../../../slices/roleSlice';
import MainWrapper from '../../../components/MainWrapper';
import LoaderSecondary from '../../../components/skeleton-loaders/LoaderSecondary';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import toastService from '../../../services/toastService';
import TooltipPassword from '../../register/TooltipPassword';
import ProfileCompletion from '../components/ProfileCompletion';
import ProfileHeader from '../components/ProfileHeader';
import IChangePassword from '../interfaces/IChangePassword';
import ICreditCard from '../interfaces/ICreditCard';
import {
    useAddCustomerMutation,
    useLazyGetCreditCardsQuery,
    useLazyGetCustomerByIdQuery,
    useRemoveCreditCardMutation,
    useSetDefaultCreditCardMutation,
} from '../services/stripeService';
import { setMyProfileProgress } from '../slices/myProfileSlice';
import StripeConnectForm from '../components/StripeConnectForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import AddCreditCard from '../components/AddCreditCard';
import { InputAdornment, TextField } from '@mui/material';
import LanguageSelector from '../../../components/LanguageSelector';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

interface Values {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

const ProfileAccount = () => {
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getIsTutorDisabled, { isSuccess: isSuccessGettingProfileVisibility }] = useLazyGetIsTutorDisabledQuery();
    const [addStripeCustomer, { data: dataStripeCustomer, isSuccess: isSuccessDataStripeCustomer, isError: isErrorDataStripeCustomer }] =
        useAddCustomerMutation();
    const [setDefaultCreditCard, { isSuccess: isSuccessSetDefaultCreditCard }] = useSetDefaultCreditCardMutation();
    const [getCustomerById] = useLazyGetCustomerByIdQuery();
    const [getCreditCards, { data: creditCards, isLoading: creditCardLoading, isUninitialized: creditCardUninitialized }] =
        useLazyGetCreditCardsQuery();
    const [changeCurrentPassword] = useChangeCurrentPasswordMutation();

    const [deleteCreditCard] = useRemoveCreditCardMutation();

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [saveBtnActive, setSaveBtnActive] = useState(false);
    const [passTooltip, setPassTooltip] = useState<boolean>(false);
    const [stripeModalOpen, setStripeModalOpen] = useState<boolean>(false);
    const [activeDefaultPaymentMethod, setActiveDefaultPaymentMethod] = useState<string>('');
    const creditCardIsLoading = creditCardLoading || creditCardUninitialized;
    const [currPass, setCurrPass] = useState('password');
    const [newPass, setNewPass] = useState('password');
    const [confirmPass, setConfirmPass] = useState('password');

    const { t } = useTranslation();
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const stripeCustomerId = useAppSelector((state) => state.auth.user?.stripeCustomerId);
    const userInfo = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const initialValues: Values = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const myInput = document.getElementById('newPassword') as HTMLInputElement;
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');
    const special = document.getElementById('special');

    const handleChangeForSave = () => {
        if (!isEqual(initialValues, formik.values)) {
            setSaveBtnActive(true);
        } else {
            setSaveBtnActive(false);
        }
    };

    useEffect(() => {
        if (userRole === RoleOptions.Tutor && userInfo) {
            getIsTutorDisabled(userInfo.id).then((res) => {
                if (res.data) setTutorDisabledValue(res.data);
                else setTutorDisabledValue(false);
            });
        }
    }, [userInfo]);

    const handlePasswordFocus = () => {
        setPassTooltip(true);
    };

    const handlePasswordBlur = () => {
        setPassTooltip(false);
    };

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

    const closeAddCardSidebar = () => {
        setAddSidebarOpen(false);
    };

    const handleDeleteCreditCard = async (cardId: string) => {
        const toSend = {
            userId: userInfo!.id,
            sourceId: cardId,
        };

        await deleteCreditCard(toSend)
            .unwrap()
            .then(() => {
                fetchData();
            });
    };

    const handleDefaultCreditCard = async (cardId: string) => {
        return; //TODO: remove this line once default payment method is implemented

        const toSend = {
            userId: userInfo!.id,
            sourceId: cardId,
        };
        await setDefaultCreditCard(toSend)
            .unwrap()
            .then(() => {
                toastService.success(t('MY_PROFILE.PROFILE_ACCOUNT.STRIPE_DEFAULT_PAYMENT_METHOD_UPDATED'));
                setActiveDefaultPaymentMethod(cardId);
            });
    };

    const handleSubmit = async (values: Values) => {
        const toSend: IChangePassword = {
            oldPassword: values.currentPassword,
            password: values.newPassword,
            confirmPassword: values.confirmPassword,
        };
        await changeCurrentPassword(toSend);
        toastService.success(t('MY_PROFILE.PROFILE_ACCOUNT.SUCCESS_PASSWORD'));
        formik.resetForm();
        setSaveBtnActive(false);
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            currentPassword: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            newPassword: Yup.string()
                .min(8, t('FORM_VALIDATION.TOO_SHORT'))
                .max(128, t('FORM_VALIDATION.TOO_LONG'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_/+\-=[\]{};':"\\|,.<>?]{8,128}$/gm,
                    t('FORM_VALIDATION.PASSWORD_STRENGTH')
                )
                .required(t('FORM_VALIDATION.REQUIRED')),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], t('FORM_VALIDATION.PASSWORD_MATCH'))
                .required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    const fetchProgress = async () => {
        //If there is no state in redux for profileProgress fetch data and save result to redux
        if (profileProgressState.percentage === 0) {
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
        }
    };

    const fetchData = async () => {
        let cards;
        if (userInfo) {
            cards = await getCreditCards(userInfo.id).unwrap();
        }

        if (userInfo && userRole !== RoleOptions.Tutor && stripeCustomerId && cards && Array.isArray(cards) && cards.length > 0) {
            const res = await getCustomerById(userInfo.id).unwrap();
            setActiveDefaultPaymentMethod(res.paymentMethods[0]);
        }
    };

    useEffect(() => {
        if (isSuccessDataStripeCustomer) {
            dispatch(addStripeId(dataStripeCustomer.id));
            const waitForCreditCard = async () => {
                setTimeout(() => {
                    getCreditCards(dataStripeCustomer.id)
                        .unwrap()
                        .then(() => {
                            setDefaultCreditCard({
                                userId: userInfo!.id,
                                sourceId: dataStripeCustomer.id,
                            });
                        });
                }, 1000);
            };
        } else if (isErrorDataStripeCustomer) {
            toastService.error(t('PROFILE_ACCOUNT.STRIPE_CARD_DECLINED'));
        }
    }, [isSuccessDataStripeCustomer, isErrorDataStripeCustomer]);

    useEffect(() => {
        fetchProgress();
        fetchData();
    }, []);

    useEffect(() => {
        handleChangeForSave();
    }, [formik.values]);

    const options: StripeElementsOptions = {
        mode: 'setup',
        currency: 'eur',
        appearance: {
            theme: 'stripe',
            variables: {
                fontFamily: '"Lato", sans-serif',
                fontLineHeight: '1.5',
                borderRadius: '10px',
                colorBackground: '#F6F8FA',
                colorPrimaryText: '#262626',
            },
            rules: {
                '.Tab': {
                    border: '1px solid #E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
                },

                '.Tab:hover': {
                    color: 'var(--colorText)',
                },

                '.Tab--selected': {
                    borderColor: '#E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
                },

                '.Input--invalid': {
                    boxShadow: '0 1px 1px 0 rgba(231, 76, 60, 1), 0 0 0 2px var(--colorDanger)',
                },
            },
        },
    };

    const visibleCurrPassToggle = (e: any) => {
        if (currPass === 'password') {
            setCurrPass('text');
        } else {
            setCurrPass('password');
        }
    };

    const visibleNewPassToggle = (e: any) => {
        if (newPass === 'password') {
            setNewPass('text');
        } else {
            setNewPass('password');
        }
    };

    const visibleConfirmPassToggle = (e: any) => {
        if (confirmPass === 'password') {
            setConfirmPass('text');
        } else {
            setConfirmPass('password');
        }
    };

    const [tutorDisabled, setTutorDisabledValue] = useState<boolean>(true);
    const [updateTutorDisabled] = useLazyDisableTutorQuery();
    const [updateTutorEnabled] = useLazyEnableTutorQuery();

    const setTutorDisabled = (disabled: boolean) => {
        if (disabled) {
            updateTutorDisabled();
        } else {
            updateTutorEnabled();
        }

        setTutorDisabledValue(disabled);
    };

    return (
        <MainWrapper>
            <div className="card--profile">
                {/* HEADER */}
                <ProfileHeader className="mb-1" />

                {/* PROGRESS */}
                <ProfileCompletion
                    generalAvailability={profileProgressState.generalAvailability}
                    additionalInformation={profileProgressState.aboutMe}
                    myTeachings={profileProgressState.myTeachings}
                    percentage={profileProgressState.percentage}
                    payment={profileProgressState.payment}
                />

                {/* PERSONAL INFO */}
                <FormikProvider value={formik}>
                    <Form>
                        <div className="card--profile__section">
                            <div>
                                <div className="mb-2 type--wgt--bold">{t('ACCOUNT.CHANGE_PASSWORD.TITLE')}</div>
                                <div className="type--color--tertiary w--200--max">{t('ACCOUNT.CHANGE_PASSWORD.DESCRIPTION')}</div>
                                {saveBtnActive ? (
                                    <ButtonPrimaryGradient className="btn btn--lg mt-6" type="submit">
                                        {t('ACCOUNT.SUBMIT')}
                                    </ButtonPrimaryGradient>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="w--800--max">
                                <div className="row">
                                    <div className="col col-12 col-xl-6">
                                        <div className="field align--center mb-5">
                                            <Field
                                                as={TextField}
                                                name="currentPassword"
                                                type={currPass}
                                                fullWidth
                                                error={formik.touched.currentPassword && !!formik.errors.currentPassword}
                                                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                                                id="currentPassword"
                                                label={t('ACCOUNT.CHANGE_PASSWORD.CURRENT_PASSWORD_PLACEHOLDER')}
                                                variant="outlined"
                                                color="secondary"
                                                InputProps={{
                                                    style: {
                                                        fontFamily: "'Lato', sans-serif",
                                                        backgroundColor: 'white',
                                                    },
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <i
                                                                className="icon icon--sm icon--visible input--text--password"
                                                                onClick={(e: any) => visibleCurrPassToggle(e)}
                                                            ></i>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    style: { fontFamily: "'Lato', sans-serif" },
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
                                                onKeyUp={handleKeyUp}
                                            />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field align--center mb-5">
                                            <Field
                                                as={TextField}
                                                name="newPassword"
                                                type={newPass}
                                                fullWidth
                                                error={formik.touched.newPassword && !!formik.errors.newPassword}
                                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                                id="newPassword"
                                                label={t('ACCOUNT.CHANGE_PASSWORD.NEW_PASSWORD_PLACEHOLDER')}
                                                variant="outlined"
                                                color="secondary"
                                                InputProps={{
                                                    style: {
                                                        fontFamily: "'Lato', sans-serif",
                                                        backgroundColor: 'white',
                                                    },
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <i
                                                                className="icon icon--sm icon--visible input--text--password"
                                                                onClick={(e: any) => visibleNewPassToggle(e)}
                                                            ></i>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    style: { fontFamily: "'Lato', sans-serif" },
                                                }}
                                                FormHelperTextProps={{
                                                    style: { color: 'red' }, // Change the color of the helper text here
                                                }}
                                                onBlur={(e: any) => {
                                                    handlePasswordBlur();
                                                    formik.handleBlur(e);
                                                }}
                                                onKeyUp={handleKeyUp}
                                            />
                                            <TooltipPassword positionTop={true} passTooltip={passTooltip} />
                                        </div>
                                    </div>
                                    <div className="col col-12 col-xl-6">
                                        <div className="field align--center mb-5">
                                            <Field
                                                as={TextField}
                                                name="confirmPassword"
                                                type={confirmPass}
                                                fullWidth
                                                error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                                id="confirmPassword"
                                                label={t('ACCOUNT.CHANGE_PASSWORD.CONFIRM_PASSWORD')}
                                                variant="outlined"
                                                color="secondary"
                                                InputProps={{
                                                    style: {
                                                        fontFamily: "'Lato', sans-serif",
                                                        backgroundColor: 'white',
                                                    },
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <i
                                                                className="icon icon--sm icon--visible input--text--password"
                                                                onClick={(e: any) => visibleConfirmPassToggle(e)}
                                                            ></i>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    style: { fontFamily: "'Lato', sans-serif" },
                                                }}
                                                FormHelperTextProps={{
                                                    style: { color: 'red' }, // Change the color of the helper text here
                                                }}
                                                onBlur={(e: any) => {
                                                    formik.handleBlur(e);
                                                }}
                                                onKeyUp={handleKeyUp}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {userRole != RoleOptions.SuperAdmin && (
                            <div className="card--profile__section">
                                <div>
                                    <div className="mb-2 type--wgt--bold">
                                        {userRole == RoleOptions.Tutor ? t('ACCOUNT.CARD_DETAILS.TITLE_TUTOR') : t('ACCOUNT.CARD_DETAILS.TITLE')}
                                    </div>
                                    <div className="type--color--tertiary w--200--max">
                                        {userRole == RoleOptions.Tutor
                                            ? t('ACCOUNT.CARD_DETAILS.DESCRIPTION_TUTOR')
                                            : t('ACCOUNT.CARD_DETAILS.DESCRIPTION')}
                                    </div>
                                </div>
                                <div>
                                    {userRole === RoleOptions.Tutor ? (
                                        <>
                                            <div className="flex">
                                                <div className="flex--inline flex--jc--cente mr-4">
                                                    <div style={{ lineHeight: '40px' }} className="type--wgt--bold type--center">
                                                        {userInfo?.stripeConnected
                                                            ? t('MY_PROFILE.PROFILE_ACCOUNT.STRIPE_CONNECTED')
                                                            : t('MY_PROFILE.PROFILE_ACCOUNT.STRIPE_DISCONNECTED')}
                                                    </div>
                                                    <span
                                                        className={`stripe-dot ${
                                                            userInfo?.stripeConnected ? 'stripe-dot-connected' : 'stripe-dot-disconnected'
                                                        }`}
                                                    ></span>
                                                </div>
                                                {!userInfo?.stripeConnected && (
                                                    <ButtonPrimaryGradient
                                                        id={`connectToStripeTutor`}
                                                        onClick={() => setStripeModalOpen(true)}
                                                        className="btn btn--base"
                                                    >
                                                        {t('STRIPE_CONNECT.TITLE')}
                                                    </ButtonPrimaryGradient>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="dash-wrapper">
                                            <div className="dash-wrapper__item">
                                                <div className="dash-wrapper__item__element" onClick={() => setAddSidebarOpen(true)}>
                                                    <div className="flex--primary cur--pointer">
                                                        <div>
                                                            <div className="type--wgt--bold">{t('ACCOUNT.CARD_DETAILS.ADD_NEW')}</div>
                                                            <div>{t('ACCOUNT.CARD_DETAILS.ADD_NEW_DESC')}</div>
                                                        </div>
                                                        <div>
                                                            <i className="icon icon--base icon--plus icon--primary"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {creditCardIsLoading ? (
                                                <LoaderSecondary full={false} />
                                            ) : (
                                                creditCards &&
                                                Array.isArray(creditCards) &&
                                                creditCards.map((item: ICreditCard) => {
                                                    return (
                                                        <div className="dash-wrapper__item" onClick={() => handleDefaultCreditCard(item.id)}>
                                                            <div
                                                                className={`dash-wrapper__item__element ${
                                                                    item.id === activeDefaultPaymentMethod && 'active'
                                                                }`}
                                                            >
                                                                <div className="flex--primary">
                                                                    {' '}
                                                                    {/*TODO: add class later: cur--pointer*/}
                                                                    <div>
                                                                        <div className="type--wgt--bold">**** **** **** {item.card.last4}</div>
                                                                        <div>{item.card.brand}</div>
                                                                    </div>
                                                                    <div>
                                                                        <i
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteCreditCard(item.id);
                                                                            }}
                                                                            className="icon icon--base icon--delete icon--primary"
                                                                        ></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Form>
                </FormikProvider>

                {/*TODO: this is language selection*/}
                <div className="card--profile__section" />
                <div className="card--profile__section">
                    <div>
                        <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.TRANSLATION.TITLE')}</div>
                        <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.TRANSLATION.SUBTITLE')}</div>
                    </div>
                    <div className="d--b landing__navigation__item">
                        <LanguageSelector className={'type--base'} color="#5c3ee8" onTop={false} />
                    </div>
                </div>

                {/*TODO: this is profile visibility*/}
                {userRole === RoleOptions.Tutor && isSuccessGettingProfileVisibility ? (
                    <div className="card--profile__section">
                        <div>
                            <div className="mb-2 type--wgt--bold">{t('MY_PROFILE.TUTOR_DISABLE.TITLE')}</div>
                            <div className="type--color--tertiary w--200--max">{t('MY_PROFILE.TUTOR_DISABLE.SUBTITLE')}</div>
                        </div>
                        <div className="w--800--max">
                            {tutorDisabled ? (
                                <ButtonPrimaryGradient
                                    className={`btn btn--base mr-2`}
                                    onClick={() => {
                                        setTutorDisabled(true);
                                    }}
                                >
                                    {t('MY_PROFILE.TUTOR_DISABLE.NO')}
                                </ButtonPrimaryGradient>
                            ) : (
                                <button
                                    className={`btn btn--base btn--disabled mr-2`}
                                    onClick={() => {
                                        setTutorDisabled(true);
                                    }}
                                >
                                    {t('MY_PROFILE.TUTOR_DISABLE.NO')}
                                </button>
                            )}

                            {!tutorDisabled ? (
                                <ButtonPrimaryGradient
                                    className={`btn btn--base mr-2`}
                                    onClick={() => {
                                        setTutorDisabled(false);
                                    }}
                                >
                                    {t('MY_PROFILE.TUTOR_DISABLE.YES')}
                                </ButtonPrimaryGradient>
                            ) : (
                                <button
                                    className={`btn btn--base btn--disabled mr-2`}
                                    onClick={() => {
                                        setTutorDisabled(false);
                                    }}
                                >
                                    {t('MY_PROFILE.TUTOR_DISABLE.YES')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <LoaderSecondary />
                )}
                <StripeConnectForm
                    onConnect={(accountId: string) => {
                        dispatch(
                            connectStripe({
                                stripeConnected: true,
                                stripeAccountId: accountId,
                            })
                        );
                        dispatch(
                            setMyProfileProgress({
                                ...profileProgressState,
                                payment: true,
                            })
                        );
                    }}
                    sideBarIsOpen={stripeModalOpen}
                    closeSidebar={() => setStripeModalOpen(false)}
                />
            </div>
            <Elements stripe={stripePromise} options={options}>
                <AddCreditCard closeSidebar={closeAddCardSidebar} sideBarIsOpen={addSidebarOpen} onSuccess={fetchData} />
            </Elements>
        </MainWrapper>
    );
};

export default ProfileAccount;
