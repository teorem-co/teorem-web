import CustomSubjectList from '../../features/searchTutors/components/CustomSubjectList';
import React, { useEffect, useState } from 'react';
import Divider from '../Divider';
import { t } from 'i18next';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { FaCalendarAlt, FaCoins } from 'react-icons/fa';
import { Form, FormikProvider, useFormik } from 'formik';
import MySelect from '../form/MySelectField';
import { RoleOptions } from '../../store/slices/roleSlice';
import moment from 'moment/moment';
import { CurrencySymbol } from '../CurrencySymbol';
import * as Yup from 'yup';
import { useAppSelector } from '../../store/hooks';
import OptionType from '../../types/OptionType';
import { useGetTutorSubjectLevelPairsQuery } from '../../store/services/subjectService';
import { useLazyGetChildQuery, useLazyGetCreditsQuery, useLazyGetUserQuery } from '../../store/services/userService';
import { setCredits } from '../../store/slices/creditsSlice';
import { useDispatch } from 'react-redux';
import { StripePayment } from './StripePayment';
import { loadStripe } from '@stripe/stripe-js';
import {
    BookingReserveResponse,
    ICreateBookingDTO,
    useCreatebookingMutation,
} from '../../store/services/bookingService';
import { useLazyGetTutorByIdQuery } from '../../store/services/tutorService';
import ITutor from '../../types/ITutor';
import { uniq } from 'lodash';
import ImageCircle from '../ImageCircle';
import { useDeleteAllOngoingPaymentsMutation, useLazyGetCreditCardsQuery } from '../../store/services/stripeService';
import { GoDotFill } from 'react-icons/go';
import { useHistory } from 'react-router';
import Select, { components } from 'react-select';
import { useCheckMailMutation } from '../../store/services/authService';
import { BookingPopupForm } from '../BookingPopupForm';
import { PATHS } from '../../routes';
import { ClipLoader, ScaleLoader } from 'react-spinners';
import { ButtonPrimaryGradient } from '../ButtonPrimaryGradient';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

interface Props {
    className?: string;
    startTime: string;
    tutorId: string;
}

const NEW_PAYMENT_METHOD_VALUE = 'NEW_PAYMENT_METHOD';

export function CheckoutInfoCardMobile({ className, startTime, tutorId }: Props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const timeZoneState = useAppSelector((state) => state.timeZone);

    const [deleteAllOngoingPayments] = useDeleteAllOngoingPaymentsMutation();
    const [checkMail] = useCheckMailMutation();

    const [
        getCreditCards,
        { data: creditCards, isLoading: creditCardLoading, isUninitialized: creditCardUninitialized },
    ] = useLazyGetCreditCardsQuery();
    const [getUser2, { data: user }] = useLazyGetUserQuery();
    const [getTutorProfileData, { data: tutorD }] = useLazyGetTutorByIdQuery();
    const [getCredits] = useLazyGetCreditsQuery();
    const [getChildOptions, { data: childOptions }] = useLazyGetChildQuery();
    const { data: subjectLevelPairs, isSuccess: isSuccessSubjectsLevelPairs } =
        useGetTutorSubjectLevelPairsQuery(tutorId);
    const [createBooking, { isSuccess: createBookingSuccess }] = useCreatebookingMutation();
    const [userCredits, setUserCredits] = useState<number | undefined>();
    const [showPopup, setShowPopup] = useState(false);
    const [tutorLevelOptions, setTutorLevelOptions] = useState<OptionType[]>();
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<OptionType[]>([]);
    const [tutorSubjectOptions, setTutorSubjectOptions] = useState<OptionType[]>();
    const [cost, setCost] = useState<number | undefined>(undefined);
    const [reserveResponse, setReserveResponse] = useState<BookingReserveResponse | undefined>();
    const [loading, setLoading] = useState(false);
    const [showConfirmPaymentLoading, setShowConfirmPaymentLoading] = useState(false);

    const initialValues = {
        level: '',
        subject: '',
        child: '',
        timeFrom: moment(startTime).format('HH:mm'),
        useCredits: true,
    };

    const initialValues2 = {
        paymentMethod: '',
    };

    function wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Show confirmation dialog for navigation away or close
            event.preventDefault();
            event.returnValue = '';
        };

        const handleUnload = async () => {
            // Send request on unload (close or leave)
            console.log('RESPONSE BEFORE SENDING (UNLOAD): ', reserveResponse);
            await deleteAllOngoingPayments().unwrap();
            await wait(1000);
        };

        const handleVisibilityChange = async () => {
            // if (document.visibilityState !== 'hidden' && document.visibilityState !== 'visible') {
            await deleteAllOngoingPayments().unwrap();
            await wait(1000);
            // }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);

            window.removeEventListener('unload', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const generateValidationSchema = () => {
        const validationSchema: any = {
            level: Yup.string().required(t('FORM_VALIDATION.LEVEL_REQUIRED')),
            subject: Yup.string().required(t('FORM_VALIDATION.SUBJECT_REQUIRED')),
        };

        if (userRole === RoleOptions.Parent) {
            validationSchema['child'] = Yup.string().required(t('FORM_VALIDATION.CHILD_REQUIRED'));
            return validationSchema;
        }

        return validationSchema;
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape(generateValidationSchema()),
    });

    const formik2 = useFormik({
        initialValues: initialValues2,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
    });

    function handleSubmit(values: any) {
        console.log('Submitting...');
    }

    function calculateTotalCost(cost: number) {
        if (!formik.values.useCredits) {
            return cost;
        }

        if (userCredits == undefined) return cost;

        const totalCost = cost - userCredits;
        return totalCost < 0 ? 0 : totalCost;
    }

    function filterSubjectsByLevelId(levelId: string) {
        if (subjectLevelPairs) {
            const subjectOptions: OptionType[] = subjectLevelPairs
                .filter((item) => item.level.value === levelId)
                .map((item) => item.subject);

            setTutorSubjectOptions(subjectOptions);
        }
    }

    async function getAndSetUserCredits() {
        await deleteAllOngoingPayments();
        await wait(1000);
        const res = await getCredits().unwrap();

        dispatch(setCredits(res.credits));
        setUserCredits(res.credits);
    }

    useEffect(() => {
        getAndSetUserCredits();
    }, []);

    useEffect(() => {
        if (userRole === RoleOptions.Parent && userId) {
            getChildOptions(userId);
        }
        getUser2(userId!).unwrap();
    }, []);

    const [tutorData, setTutorData] = useState<ITutor>();

    async function getTutorData() {
        const res = await getTutorProfileData(tutorId).unwrap();
        setTutorData(res);
    }

    useEffect(() => {
        getTutorData();
        if (userId) getCreditCards(userId);
    }, [tutorId]);

    useEffect(() => {
        if (subjectLevelPairs && isSuccessSubjectsLevelPairs) {
            const seen = new Set<string>();
            const levelOptions: OptionType[] = [];

            subjectLevelPairs.forEach((pair) => {
                if (!seen.has(pair.level.value)) {
                    seen.add(pair.level.value);
                    levelOptions.push(pair.level);
                }
            });

            setTutorLevelOptions(levelOptions);
        }
    }, [subjectLevelPairs]);

    useEffect(() => {
        if (formik.values.level && formik.values.subject) {
            const cost = subjectLevelPairs?.find(
                (pair) => pair.level.value === formik.values.level && pair.subject.value === formik.values.subject
            )?.cost;

            setCost(cost);
        }
    }, [formik.values.subject]);

    useEffect(() => {
        if (subjectLevelPairs && isSuccessSubjectsLevelPairs) {
            const seen = new Set<string>();
            const levelOptions: OptionType[] = [];

            subjectLevelPairs.forEach((pair) => {
                if (!seen.has(pair.level.value)) {
                    seen.add(pair.level.value);
                    levelOptions.push(pair.level);
                }
            });

            setTutorLevelOptions(levelOptions);
        }
    }, [subjectLevelPairs]);

    useEffect(() => {
        if (formik.values.subject) {
            formik.setFieldValue('subject', '');
        }
        if (formik.values.level !== '') {
            filterSubjectsByLevelId(formik.values.level);
        }
        setCost(undefined);
    }, [formik.values.level]);

    useEffect(() => {
        if (creditCards && creditCards.length > 0) {
            const seen = new Set<string>();
            const paymentOptions: OptionType[] = [];

            creditCards.forEach((paymentMethod) => {
                if (!seen.has(paymentMethod.id)) {
                    seen.add(paymentMethod.id);
                    const option: OptionType = {
                        value: paymentMethod.id,
                        label: '**** **** **** ' + paymentMethod.card.last4,
                        icon: '/images/payment-icons/' + paymentMethod.card.brand + '.svg',
                    };

                    paymentOptions.push(option);
                }
            });

            paymentOptions.push({
                value: NEW_PAYMENT_METHOD_VALUE,
                label: t('CHECKOUT.USE_NEW_PAYMENT_METHOD_LABEL'),
                icon: '',
            });
            setPaymentMethodOptions(paymentOptions);
        }
    }, [creditCards]);

    async function initiateCreateBooking() {
        const values = formik.values;
        if (userRole === RoleOptions.Parent && !formik.values.child) return;
        if (cost && calculateTotalCost(cost) === 0) return;
        if (values.subject && values.level) {
            const request: ICreateBookingDTO =
                userRole === RoleOptions.Parent
                    ? {
                          requesterId: userId,
                          startTime: moment(startTime).toISOString(),
                          subjectId: values.subject,
                          studentId: values.child,
                          tutorId: tutorId,
                          levelId: values.level,
                          useCredits: true,
                      }
                    : {
                          requesterId: userId,
                          studentId: userId,
                          startTime: moment(startTime).toISOString(),
                          subjectId: values.subject,
                          tutorId: tutorId,
                          levelId: values.level,
                          useCredits: true,
                      };

            setLoading(true);
            const res: any = await createBooking(request);
            const data = res.data as BookingReserveResponse;
            // getAndSetUserCredits();
            setLoading(false);
            console.log('PAYMENT RESPONSE: ', data);
            setReserveResponse(data);
        }
    }

    useEffect(() => {
        if (
            !paymentMethodOptions ||
            paymentMethodOptions.length === 0 ||
            formik2.values.paymentMethod === NEW_PAYMENT_METHOD_VALUE
        )
            initiateCreateBooking();
    }, [formik.values.level, formik.values.subject, formik.values.child, formik2.values.paymentMethod]);

    async function makeBooking() {
        const values = formik.values;
        if (userRole === RoleOptions.Parent && !formik.values.child) return;
        if (values.subject && values.level) {
            const request: ICreateBookingDTO =
                userRole === RoleOptions.Parent
                    ? {
                          requesterId: userId,
                          startTime: moment(startTime).toISOString(),
                          subjectId: values.subject,
                          studentId: values.child,
                          tutorId: tutorId,
                          levelId: values.level,
                          useCredits: true,
                      }
                    : {
                          requesterId: userId,
                          studentId: userId,
                          startTime: moment(startTime).toISOString(),
                          subjectId: values.subject,
                          tutorId: tutorId,
                          levelId: values.level,
                          useCredits: true,
                      };

            console.log('Setting show loader to true');
            setShowConfirmPaymentLoading(true);
            let res: any;
            if (formik2.values.paymentMethod && formik2.values.paymentMethod !== NEW_PAYMENT_METHOD_VALUE) {
                res = await createBooking({
                    ...request,
                    paymentMethodId: formik2.values.paymentMethod,
                });
            } else {
                res = await createBooking(request);
            }
            const data = res.data as BookingReserveResponse;
            if (data && data.success) {
                // toastService.success('Uspjesno napravljena rezervacija');
                setShowConfirmPaymentLoading(false);
                setShowPopup(true);
            }
        }
    }

    const customSingleValue = (props: any) => {
        return (
            <components.SingleValue {...props} className="input-select">
                <div className="input-select__option flex flex--gap-10 flex--ai--center">
                    <FaCoins />
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        );
    };

    const [showPaymentComponent, setShowPaymentComponent] = useState(false);

    return tutorData && userCredits !== undefined ? (
        <>
            <img src="/logo.svg" alt="" className="align-self-start mb-4" style={{ height: '25px' }} />

            {!showPopup ? (
                <div className="flex flex--gap-10">
                    {!showPaymentComponent && (
                        <div className={`${className} flex flex--col font-lato  flex--gap-10`}>
                            <div className="flex">
                                {tutorData.User.profileImage ? (
                                    <div className="tutor-list__item__img w--unset mr-2" style={{ padding: 0 }}>
                                        <img
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                border: 0,
                                            }}
                                            className="align--center d--b"
                                            src={tutorData.User.profileImage}
                                            alt="tutor-profile-pic"
                                        />
                                    </div>
                                ) : (
                                    <ImageCircle
                                        className="align--center d--b mb-4"
                                        imageBig={true}
                                        initials={
                                            tutorData.User.firstName.charAt(0) + tutorData.User.lastName.charAt(0)
                                        }
                                    />
                                )}
                                <div className="flex flex--col flex--grow">
                                    <div className="flex flex--jc--space-between">
                                        <div className="flex">
                                            <span className="type--wgt--extra-bold type--lg">{`${tutorData.User.firstName} ${tutorData.User.lastName}`}</span>
                                            {tutorData.idVerified && (
                                                <div
                                                    className={'flex flex--center'}
                                                    data-tooltip-id={'ID-tooltip'}
                                                    data-tooltip-html={t('TUTOR_PROFILE.TOOLTIP.ID_VERIFIED')}
                                                >
                                                    <RiVerifiedBadgeFill size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <span className="flex flex--ai--center">
                                            {tutorData.averageGrade ? (
                                                <>
                                                    <i className="icon icon--base icon--star"></i>
                                                    <span className="type--md type--wgt--extra-bold">
                                                        {tutorData.averageGrade}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="type--md type--wgt--extra-bold">
                                                    {t('CHECKOUT.NEW_TUTOR')}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex flex--jc--space-between type--sm">
                                        {tutorData.TutorSubjects.length > 0 ? (
                                            <CustomSubjectList
                                                subjects={uniq(
                                                    tutorData.TutorSubjects.map((subject) => subject.Subject.abrv)
                                                )}
                                            />
                                        ) : (
                                            <></>
                                        )}

                                        {tutorData.numberOfGrades && tutorData.numberOfGrades > 0 ? (
                                            <div className="type--color--secondary">{tutorData.numberOfGrades}</div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Divider />
                            <span className="type--wgt--extra-bold">
                                {moment(startTime).format('dddd, ' + t('DATE_FORMAT') + ', HH:mm')}
                            </span>
                            <span>{timeZoneState.timeZone}</span>
                            <FormikProvider value={formik}>
                                <Form>
                                    <div className="field">
                                        <label htmlFor="level" className="field__label">
                                            {t('BOOK.FORM.LEVEL')}*
                                        </label>

                                        <MySelect
                                            field={formik.getFieldProps('level')}
                                            form={formik}
                                            meta={formik.getFieldMeta('level')}
                                            classNamePrefix="onboarding-select"
                                            isMulti={false}
                                            options={tutorLevelOptions ? tutorLevelOptions : []}
                                            placeholder={t('BOOK.FORM.LEVEL_PLACEHOLDER')}
                                            isDisabled={showConfirmPaymentLoading || loading}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="subject" className="field__label">
                                            {t('BOOK.FORM.SUBJECT')}*
                                        </label>
                                        <MySelect
                                            key={formik.values.subject}
                                            field={formik.getFieldProps('subject')}
                                            form={formik}
                                            meta={formik.getFieldMeta('subject')}
                                            isMulti={false}
                                            options={tutorSubjectOptions}
                                            classNamePrefix="onboarding-select"
                                            noOptionsMessage={() => t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')}
                                            placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                                            isDisabled={showConfirmPaymentLoading || loading}
                                            //|| !formik.values.level} include it later
                                        />
                                    </div>
                                    {userRole === RoleOptions.Parent ? (
                                        <div className="field">
                                            <label htmlFor="child" className="field__label">
                                                {t('BOOK.FORM.CHILD')}*
                                            </label>

                                            <MySelect
                                                field={formik.getFieldProps('child')}
                                                form={formik}
                                                meta={formik.getFieldMeta('child')}
                                                classNamePrefix="onboarding-select"
                                                isMulti={false}
                                                options={childOptions ? childOptions : []}
                                                noOptionsMessage={() => 'childless'}
                                                placeholder={t('BOOK.FORM.CHILD_PLACEHOLDER')}
                                                isDisabled={showConfirmPaymentLoading || loading}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </Form>
                            </FormikProvider>

                            <Divider />

                            {/*{formik.values.level && formik.values.subject && cost && (*/}
                            <div className="flex flex--col flex--gap-10">
                                <span className="type--lg type--wgt--extra-bold">{t('CHECKOUT.TITLE')}</span>
                                <div className="flex flex--jc--space-between">
                                    <span>{t('CHECKOUT.LESSON_DURATION')}</span>
                                    <span className="type--wgt--extra-bold">
                                        <CurrencySymbol />
                                        {cost}
                                    </span>
                                </div>

                                {cost && (
                                    <div className="flex flex--jc--space-between">
                                        {/*<div className="discount-row">*/}
                                        <span>{t('CHECKOUT.CREDITS_BALANCE')} </span>
                                        <span className="type--wgt--extra-bold">
                                            &minus;&nbsp;
                                            <CurrencySymbol />
                                            {userCredits > cost ? cost : userCredits}
                                        </span>
                                    </div>
                                )}

                                <div className="separator-line"></div>
                                <div className="total-row flex flex--jc--space-between type--wgt--extra-bold type--md">
                                    <span>{t('CHECKOUT.TOTAL')}</span>
                                    {cost && (
                                        <span>
                                            {calculateTotalCost(cost)}
                                            <CurrencySymbol />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ButtonPrimaryGradient
                                disabled={
                                    !(
                                        formik.values.level &&
                                        formik.values.subject &&
                                        (userRole !== RoleOptions.Parent || formik.values.child)
                                    )
                                }
                                className="btn btn--lg w--100 p-4 mt-2 mb-2 type--wgt--extra-bold font__md"
                                onClick={() => setShowPaymentComponent(true)}
                                // type={'submit'}
                            >
                                Proceed to payment
                            </ButtonPrimaryGradient>

                            <div className="flex flex--col bg__green pr-4 pl-4 pt-2 pb-2 flex--gap-5">
                                <span className="flex flex--ai--center flex--gap-10 type--wgt--extra-bold">
                                    <FaCalendarAlt />
                                    {t('CHECKOUT.RESCHEDULE_TIP.TITLE')}
                                </span>
                                <p>{t('CHECKOUT.RESCHEDULE_TIP.DETAILS')}</p>
                            </div>
                        </div>
                    )}
                    {showPaymentComponent &&
                        userId &&
                        cost &&
                        formik.values.subject &&
                        formik.values.level &&
                        ((paymentMethodOptions && paymentMethodOptions?.length !== 0) ||
                            calculateTotalCost(cost) === 0) &&
                        (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                            <div className="w--100 h--100dvh font-lato">
                                <div className="type--wgt--extra-bold font__xlg text-align--start mb-3 flex flex--ai--center flex--jc--start">
                                    <button className="btn btn--clear" onClick={() => setShowPaymentComponent(false)}>
                                        <i className="icon icon--lg icon--arrow-left icon--black"></i>
                                    </button>
                                    <span>{t('CHECKOUT.HOW_TO_PAY')}</span>
                                </div>
                                {userId &&
                                    cost &&
                                    calculateTotalCost(cost) !== 0 &&
                                    formik.values.subject &&
                                    formik.values.level &&
                                    (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                                        <FormikProvider value={formik2}>
                                            <Form>
                                                <div className="field">
                                                    <MySelect
                                                        field={formik2.getFieldProps('paymentMethod')}
                                                        form={formik2}
                                                        meta={formik2.getFieldMeta('paymentMethod')}
                                                        classNamePrefix="onboarding-select"
                                                        isMulti={false}
                                                        options={paymentMethodOptions ? paymentMethodOptions : []}
                                                        placeholder={t('CHECKOUT.HOW_TO_PAY')}
                                                        // isDisabled={showConfirmPaymentLoading || loading}
                                                    />
                                                </div>
                                                <ScaleLoader color={'#7e6cf2'} loading={showConfirmPaymentLoading} />
                                            </Form>
                                        </FormikProvider>
                                    )}

                                {paymentMethodOptions?.length !== 0 && loading && (
                                    <div className="flex flex--jc--center flex--ai--center flex--grow">
                                        <ClipLoader color={'#7e6cf2'} loading={true} size={50} />
                                    </div>
                                )}

                                {userId &&
                                    cost &&
                                    calculateTotalCost(cost) === 0 &&
                                    formik.values.subject &&
                                    formik.values.level &&
                                    (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                                        <div className="flex flex--col">
                                            <Select
                                                className={'form__type mb-4'}
                                                classNamePrefix="onboarding-select"
                                                components={{
                                                    SingleValue: customSingleValue,
                                                    // Option: customOptions,
                                                }}
                                                name={t('CHECKOUT.PAY_ALL_WITH_CREDITS_LABEL')}
                                                value={{
                                                    label: t('CHECKOUT.PAY_ALL_WITH_CREDITS_LABEL'),
                                                    icon: 'i',
                                                }}
                                                placeholder={t('CHECKOUT.PAY_ALL_WITH_CREDITS_LABEL')}
                                                isDisabled={true}
                                            />
                                            <ScaleLoader
                                                className="align-self-start"
                                                color={'#7e6cf2'}
                                                loading={showConfirmPaymentLoading}
                                            />
                                        </div>
                                    )}

                                {reserveResponse &&
                                    reserveResponse.clientSecret &&
                                    userId &&
                                    cost &&
                                    formik.values.subject &&
                                    formik.values.level &&
                                    paymentMethodOptions?.length !== 0 &&
                                    formik2.values.paymentMethod === NEW_PAYMENT_METHOD_VALUE &&
                                    (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                                        <StripePayment
                                            creditCards={creditCards ? creditCards : []}
                                            clientSecret={reserveResponse.clientSecret}
                                            stripePromise={stripePromise}
                                            bookingInfo={{
                                                jobId: reserveResponse.confirmationJobId,
                                                tutorId: tutorId,
                                                requesterId: userId,
                                                studentId:
                                                    userRole === RoleOptions.Student ? userId : formik.values.child,
                                                startTime: startTime,
                                                cost: calculateTotalCost(cost),
                                                subjectId: formik.values.subject,
                                                levelId: formik.values.level,
                                            }}
                                            setShowPopup={setShowPopup}
                                        />
                                    )}

                                {(userRole === RoleOptions.Parent ? formik.values.child : true) &&
                                    (formik2.values.paymentMethod !== NEW_PAYMENT_METHOD_VALUE ||
                                        calculateTotalCost(cost) === 0) && (
                                        <div className="flex flex--col align-self-end">
                                            <button
                                                disabled={
                                                    !(
                                                        (!!formik2.values.paymentMethod &&
                                                            formik2.values.paymentMethod !==
                                                                NEW_PAYMENT_METHOD_VALUE) ||
                                                        calculateTotalCost(cost) === 0
                                                    ) ||
                                                    showConfirmPaymentLoading ||
                                                    loading
                                                }
                                                className="mt-10 w--100 text-align--center font__lg flex--ai--center flex flex--grow flex--jc--center btn pt-3 pb-3 btn--primary type--wgt--bold"
                                                onClick={() => {
                                                    makeBooking();
                                                }}
                                            >
                                                <span>{t('CHECKOUT.CONFIRM_PAYMENT')}</span>
                                                <GoDotFill />
                                                <CurrencySymbol />
                                                <span>{calculateTotalCost(cost)}</span>
                                            </button>
                                            <div className="flex flex--col flex--gap-10 mt-3">
                                                <span className="type--color--secondary">
                                                    {t('CHECKOUT.PAYMENT_POLICY_PART_ONE')}
                                                </span>
                                                <span className="type--color--secondary">
                                                    {t('CHECKOUT.PAYMENT_POLICY_PART_TWO')}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}

                    {showPaymentComponent &&
                        reserveResponse &&
                        reserveResponse.clientSecret &&
                        userId &&
                        cost &&
                        formik.values.subject &&
                        formik.values.level &&
                        paymentMethodOptions &&
                        !loading &&
                        paymentMethodOptions?.length === 0 &&
                        (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                            <div className="flex flex--col w--100">
                                <div className="type--wgt--extra-bold font__xlg text-align--center mb-3">
                                    {t('CHECKOUT.HOW_TO_PAY')}
                                </div>

                                <Select
                                    className={'form__type mb-4'}
                                    classNamePrefix="onboarding-select"
                                    components={{
                                        SingleValue: customSingleValue,
                                    }}
                                    name={t('CHECKOUT.USE_NEW_PAYMENT_METHOD_LABEL')}
                                    value={t('CHECKOUT.USE_NEW_PAYMENT_METHOD_LABEL')}
                                    placeholder={t('CHECKOUT.USE_NEW_PAYMENT_METHOD_LABEL')}
                                    isDisabled={true}
                                />

                                <StripePayment
                                    creditCards={creditCards ? creditCards : []}
                                    clientSecret={reserveResponse.clientSecret}
                                    stripePromise={stripePromise}
                                    bookingInfo={{
                                        jobId: reserveResponse.confirmationJobId,
                                        tutorId: tutorId,
                                        requesterId: userId,
                                        studentId: userRole === RoleOptions.Student ? userId : formik.values.child,
                                        startTime: startTime,
                                        cost: calculateTotalCost(cost),
                                        subjectId: formik.values.subject,
                                        levelId: formik.values.level,
                                    }}
                                    setShowPopup={setShowPopup}
                                />
                            </div>
                        )}

                    {paymentMethodOptions?.length === 0 && loading && (
                        <div className="w--full h--100 ">
                            <ClipLoader loading={true} size={50} color={'#7e6cf2'} />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {showPopup && (
                        <BookingPopupForm
                            tutorId={tutorId}
                            levelId={formik.values.level}
                            subjectId={formik.values.subject}
                            startTime={startTime}
                            setShowPopup={setShowPopup}
                            onClose={() => history.push(PATHS.DASHBOARD)}
                        />
                    )}
                </div>
            )}
        </>
    ) : (
        <div>Loading...</div>
    );
}
