import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { loadStripe } from '@stripe/stripe-js';
import { IBookingChatMessageInfo } from '../../features/tutor-bookings/TutorBookings';
import { useDispatch } from 'react-redux';
import { useGetTutorSubjectLevelPairsQuery } from '../../store/services/subjectService';
import { useLazyGetChildQuery, useLazyGetCreditsQuery, useLazyGetUserQuery } from '../../store/services/userService';
import { useLazyGetCustomerByIdQuery } from '../../store/services/stripeService';
import {
    ICreateBookingDTO,
    useCreateBookingMutation,
    useCreatebookingMutation,
} from '../../store/services/bookingService';
import { useAppSelector } from '../../store/hooks';
import { RoleOptions } from '../../store/slices/roleSlice';
import toastService from '../../store/services/toastService';
import { addStripeId } from '../../store/slices/authSlice';
import { setCredits } from '../../store/slices/creditsSlice';
import MySelect from '../form/MySelectField';
import { CurrencySymbol } from '../CurrencySymbol';
import { ButtonPrimaryGradient } from '../ButtonPrimaryGradient';
import LoaderPrimary from '../skeleton-loaders/LoaderPrimary';
import OptionType from '../../types/OptionType';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

interface IProps {
    start?: string;
    end?: string;
    // setClientSecret: (secret: string) => void;
    // positionClass: string;
    // clearEmptyBookings: () => void;
    tutorId: string;
    // tutorDisabled: boolean | undefined;
    // topOffset?: number;
    // setBookingMessageInfo: (value: IBookingChatMessageInfo) => void;
}

interface Values {
    level: string;
    subject: string;
    child: string;
    timeFrom: string;
    useCredits: boolean;
}

const CheckoutPage: React.FC<IProps> = (props) => {
    const { start, end, tutorId } = props;

    const dispatch = useDispatch();
    const { data: subjectLevelPairs, isSuccess: isSuccessSubjectsLevelPairs } =
        useGetTutorSubjectLevelPairsQuery(tutorId);
    const [tutorLevelOptions, setTutorLevelOptions] = useState<OptionType[]>();
    const [tutorSubjectOptions, setTutorSubjectOptions] = useState<OptionType[]>();

    const [getChildOptions, { data: childOptions }] = useLazyGetChildQuery();
    const [getUser] = useLazyGetCustomerByIdQuery();
    const [createBooking, { isSuccess: createBookingSuccess }] = useCreatebookingMutation();
    const [createBookingMutation, { isSuccess: isCreateBookingSuccess }] = useCreateBookingMutation();
    const [isCreateBookingLoading, setIsCreateBookingLoading] = useState<boolean>(false); // isLoading from Mutation is too slow;

    const [selectedTime, setSelectedTime] = useState<string>('');
    const [initialValues, setInitialValues] = useState<Values>({
        level: '',
        subject: '',
        child: '',
        timeFrom: moment(start).format('HH:mm'),
        useCredits: true,
    });

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const [stripeId, setStripeId] = useState('');
    const stripeCustomerId = useAppSelector((state) => state.auth.user?.stripeCustomerId);

    const [stripe, setStripe] = useState<any>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    stripePromise.then((res) => setStripe(res));

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

    const [getUser2, { data: user }] = useLazyGetUserQuery();

    // let isCreateBookingSuccess = false;
    async function createRequest(values: any) {
        const splitString = values.timeFrom.split(':');

        console.log('sending request...');
        console.log('START TIME:', start);
        const request: ICreateBookingDTO =
            userRole === RoleOptions.Parent
                ? {
                      requesterId: userId,
                      startTime: moment(start)
                          .set('hours', Number(splitString[0]))
                          .set('minutes', Number(splitString[1]))
                          .toISOString(),
                      subjectId: values.subject,
                      studentId: values.child,
                      tutorId: tutorId,
                      levelId: values.level,
                      useCredits: values.useCredits,
                  }
                : {
                      requesterId: userId,
                      studentId: userId,
                      startTime: moment(start)
                          .set('hours', Number(splitString[0]))
                          .set('minutes', Number(splitString[1]))
                          .toISOString(),
                      subjectId: values.subject,
                      tutorId: tutorId,
                      levelId: values.level,
                      useCredits: values.useCredits,
                  };

        const response: any = await createBooking(request);
        console.log('SECRET: ', response.data.clientSecret);
        console.log('RESPONSE: ', response.data);
        setClientSecret(response.data.clientSecret);
        setBackgroundJobId(response.data.confirmationJobId);
        setSidebarOpen(true);
        setIsCreateBookingLoading(false);
    }

    const handleSubmit = async (values: any) => {
        setIsCreateBookingLoading(true);
        //if user didn't added credit card before adding a booking, show the message and redirect button
        // if (stripeId) {
        //     console.log('inside first conditioin');
        //     //if user has stripe account but don't have default payment method
        //     const res = await getUser(userId!).unwrap();
        //     const defaultSource = res.paymentMethods[0];
        //     if (!defaultSource) {
        //         setIsCreateBookingLoading(false);
        //         //toastService.creditCard(t('ERROR_HANDLING.DEFAULT_CARD_MISSING'));
        //         return;
        //     }
        // } else {
        console.log('inside second conditioin');
        createRequest(values);
        // setSidebarOpen(true);
        // setIsCreateBookingLoading(false);
        //toastService.creditCard(t('ERROR_HANDLING.CREDIT_CARD_MISSING'));
        return;
        // }

        const splitString = values.timeFrom.split(':');

        function handleResponseSuccess(success: any) {
            if (success) {
                // toastService.success(t('BOOKING.SUCCESS'));
                const bookingInfo: IBookingChatMessageInfo = {
                    tutorId: tutorId,
                    startTime: moment(start)
                        .set('hours', Number(splitString[0]))
                        .set('minutes', Number(splitString[1]))
                        .toISOString(),
                    subjectId: values.subject,
                    levelId: values.level,
                };

                // props.setBookingMessageInfo(bookingInfo);
            } else {
                toastService.error(t('BOOKING.FAILURE'));
            }
        }

        const request: ICreateBookingDTO =
            userRole === RoleOptions.Parent
                ? {
                      requesterId: userId,
                      startTime: moment(start)
                          .set('hours', Number(splitString[0]))
                          .set('minutes', Number(splitString[1]))
                          .toISOString(),
                      subjectId: values.subject,
                      studentId: values.child,
                      tutorId: tutorId,
                      levelId: values.level,
                      useCredits: values.useCredits,
                  }
                : {
                      requesterId: userId,
                      studentId: userId,
                      startTime: moment(start)
                          .set('hours', Number(splitString[0]))
                          .set('minutes', Number(splitString[1]))
                          .toISOString(),
                      subjectId: values.subject,
                      tutorId: tutorId,
                      levelId: values.level,
                      useCredits: values.useCredits,
                  };

        const response: any = await createBooking(request);
        if (response.data.success) {
            handleResponseSuccess(true);
        } else if (response.data.actionNeeded) {
            const res = await stripe.confirmCardPayment(response.data.clientSecret);
            if (res.error != null) {
                const confirmationRes: any = await createBookingMutation({
                    paymentIntentId: res.error.payment_intent.id,
                    confirmationJobId: response.data.confirmationJobId,
                });
                handleResponseSuccess(confirmationRes.data.success);
            } else {
                const confirmationRes: any = await createBookingMutation({
                    paymentIntentId: res.paymentIntent.id,
                    confirmationJobId: response.data.confirmationJobId,
                });
                handleResponseSuccess(confirmationRes.data.success);
            }
        } else {
            handleResponseSuccess(false);
        }

        setIsCreateBookingLoading(false);
    };

    const handleChange = (e: any) => {
        setSelectedTime(e);
        formik.setFieldValue('timeFrom', e);
    };

    const handleSubmitForm = () => {
        formik.handleSubmit();
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape(generateValidationSchema()),
    });

    function filterSubjectsByLevelId(levelId: string) {
        if (subjectLevelPairs) {
            const subjectOptions: OptionType[] = subjectLevelPairs
                .filter((item) => item.level.value === levelId)
                .map((item) => item.subject);

            setTutorSubjectOptions(subjectOptions);
        }
    }

    // set level options
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
    }, [formik.values.level]);

    useEffect(() => {
        if (userRole === RoleOptions.Parent && userId) {
            getChildOptions(userId);
        }
        getUser2(userId!).unwrap();
    }, []);

    useEffect(() => {
        if (user != undefined) {
            setStripeId(user?.stripeCustomerId);
            dispatch(addStripeId(user.stripeCustomerId));
        }
    }, [user]);

    useEffect(() => {
        formik.setFieldValue('timeFrom', moment(start).format('HH:mm'));
    }, [start]);

    const [cost, setCost] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (formik.values.level && formik.values.subject) {
            const cost = subjectLevelPairs?.find(
                (pair) => pair.level.value === formik.values.level && pair.subject.value === formik.values.subject
            )?.cost;

            setCost(cost);
        }
    }, [formik.values.subject]);
    const isMobile = window.innerWidth < 776;

    const [getCredits] = useLazyGetCreditsQuery();
    const [userCredits, setUserCredits] = useState<number | undefined>(undefined);

    useEffect(() => {
        const res = getCredits().unwrap();

        res.then((res) => {
            dispatch(setCredits(res.credits));
            setUserCredits(res.credits);
        });
    }, []);

    function calculateTotalCost(cost: number) {
        if (!formik.values.useCredits) {
            return cost;
        }

        if (userCredits == undefined) return cost;

        const totalCost = cost - userCredits;
        return totalCost < 0 ? 0 : totalCost;
    }

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | undefined>();
    const [backgroundJobId, setBackgroundJobId] = useState<string | undefined>();
    //html
    return (
        <div className="fullscreen-modal">
            <div className="w--50 border-solid-gray">
                <div className="modal--parent__header">
                    <div className="flex flex--primary">
                        <div>
                            <div className="type--wgt--bold type--md mb-1">{t('BOOK.TITLE')}</div>
                            <div className="type--color--secondary">
                                {moment(start).format(t('DATE_FORMAT') + ', HH:mm')} - {end}
                            </div>
                        </div>
                        {/*<i className="icon icon--base icon--grey icon--info mb-6"></i>*/}
                        <i
                            className="icon icon--base icon--grey icon--close mb-6"
                            onClick={() => {
                                // props.clearEmptyBookings();
                                formik.setFieldValue('level', '');
                                formik.setFieldValue('subject', '');
                                formik.setFieldValue('child', '');
                            }}
                        ></i>
                    </div>
                </div>

                <div className="modal--parent__line"></div>

                <div className="modal--parent__body">
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
                                    isDisabled={isCreateBookingLoading}
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
                                    isDisabled={isCreateBookingLoading}
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
                                        isDisabled={isCreateBookingLoading}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}

                            {formik.values.level && formik.values.subject && cost && (
                                <div>
                                    <div className="checkout-component mb-2">
                                        <div className="price-row">
                                            <span>{t('CHECKOUT.PRICE')}</span>
                                            <span>
                                                {cost} <CurrencySymbol />
                                            </span>
                                        </div>
                                        {formik.values.useCredits && cost && userCredits != undefined ? (
                                            <div className="discount-row">
                                                <span>{t('CHECKOUT.DISCOUNT')}</span>
                                                <span>
                                                    &minus;&nbsp;{userCredits > cost ? cost : userCredits}&nbsp;
                                                    <CurrencySymbol />
                                                </span>
                                            </div>
                                        ) : (
                                            <></>
                                        )}

                                        <div className="separator-line"></div>
                                        <div className="total-row">
                                            <span>{t('CHECKOUT.TOTAL')}</span>
                                            {cost && (
                                                <span>
                                                    {calculateTotalCost(cost)}
                                                    <CurrencySymbol />
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="credits-row"
                                            style={{
                                                marginBottom: 0,
                                                marginTop: '20px',
                                            }}
                                        >
                                            <span>{t('CHECKOUT.AVAILABLE_CREDITS')}</span>
                                            <span>
                                                {userCredits} <CurrencySymbol />
                                            </span>
                                        </div>

                                        {formik.values.useCredits && userCredits && cost ? (
                                            <div className="credits-row" style={{ marginBottom: 0 }}>
                                                <span>{t('CHECKOUT.NEW_CREDITS_BALANCE')}</span>
                                                <span>
                                                    {userCredits - cost > 0 ? userCredits - cost : 0}&nbsp;
                                                    <CurrencySymbol />
                                                </span>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        <div
                                            style={{ justifyContent: 'flex-start', marginBottom: 0 }}
                                            className="flex flex--row flex--ai--center mt-4"
                                        >
                                            <input
                                                disabled={isCreateBookingLoading}
                                                className={'mr-2'}
                                                type="checkbox"
                                                id="useCredits"
                                                name="useCredits"
                                                onChange={formik.handleChange}
                                                checked={formik.values.useCredits}
                                            />
                                            <label htmlFor="useCredits" className={'type--color--brand'}>
                                                {t('BOOK.FORM.USE_CREDITS')}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/*)}*/}
                        </Form>
                    </FormikProvider>
                </div>
                {!isCreateBookingLoading ? (
                    <div className="modal--parent__footer">
                        <ButtonPrimaryGradient
                            data-tooltip-id="bookAndPayButton"
                            data-tooltip-html={`${t('BOOK.FORM.TUTOR_DISABLED')}`}
                            // disabled={tutorDisabled}
                            className="btn btn--base type--wgt--extra-bold mb-1 mt-1"
                            onClick={() => handleSubmitForm()}
                        >
                            {/*{tutorDisabled ? t('BOOK.FORM.TUTOR_DISABLED') : 'Nastavite na plaćanje'}*/}
                            'Nastavite na plaćanje'
                        </ButtonPrimaryGradient>
                        <button
                            className="btn btn--base type--wtg--extra-bold btn--clear"
                            onClick={() => {
                                // props.clearEmptyBookings();
                            }}
                        >
                            {t('BOOK.FORM.DISMISS')}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex--jc--center flex--primary--center mb-6">
                        <LoaderPrimary small />
                    </div>
                )}
            </div>
            {clientSecret && sidebarOpen && backgroundJobId ? (
                <div></div>
            ) : (
                // <StripePayment
                //     stripePromise={stripePromise}
                //     // sidebarOpen={sidebarOpen}
                //     // closeAddCardSidebar={() => {
                //     //     console.log('close sidebar');
                //     {/*}}*/}
                //     // clientSecret={clientSecret}
                //     // backgroundJobId={backgroundJobId}
                // />
                // <StripePayment
                //     clientSecret={clientSecret}
                //     stripePromise={stripePromise}
                //     sidebarOpen={sidebarOpen}
                //     closeAddCardSidebar={() => {
                //         console.log('close sidebar');
                //     }}
                // />
                <>aloooooooooo</>
            )}
        </div>
    );
};

export default CheckoutPage;
