import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useGetTutorSubjectLevelPairsQuery } from '../../../store/services/subjectService';
import { useLazyGetChildQuery, useLazyGetCreditsQuery, useLazyGetUserQuery } from '../../../store/services/userService';
import { RoleOptions } from '../../../store/slices/roleSlice';
import MySelect, { OptionType } from '../../../components/form/MySelectField';
import MyTimePicker from '../../../components/form/MyTimePicker';
import MyTextField from '../../../components/form/MyTextField';
import LoaderPrimary from '../../../components/skeleton-loaders/LoaderPrimary';
import { useAppSelector } from '../../../store/hooks';
import toastService from '../../../store/services/toastService';
import { useLazyGetCustomerByIdQuery } from '../../my-profile/services/stripeService';
import { ICreateBookingDTO, useCreatebookingMutation, useCreateBookingMutation } from '../services/bookingService';
import { loadStripe } from '@stripe/stripe-js';
import { addStripeId } from '../../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { IBookingChatMessageInfo } from '../../tutor-bookings/TutorBookings';
import { setCredits } from '../../../store/slices/creditsSlice';
import { CurrencySymbol } from '../../../components/CurrencySymbol';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

interface IProps {
    start?: string;
    end?: string;
    handleClose?: (close: boolean) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    positionClass: string;
    clearEmptyBookings: () => void;
    tutorId: string;
    tutorDisabled: boolean | undefined;
    topOffset?: number;
    setShowLessonInfoPopup: (value: boolean) => void;
    setBookingMessageInfo: (value: IBookingChatMessageInfo) => void;
}

interface Values {
    level: string;
    subject: string;
    child: string;
    timeFrom: string;
    useCredits: boolean;
}

const ParentCalendarSlots: React.FC<IProps> = (props) => {
    const { topOffset, start, end, handleClose, positionClass, setSidebarOpen, tutorDisabled, setShowLessonInfoPopup } = props;

    const tutorId = props.tutorId;
    const dispatch = useDispatch();
    const { data: subjectLevelPairs, isSuccess: isSuccessSubjectsLevelPairs } = useGetTutorSubjectLevelPairsQuery(tutorId);
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

    const handleSubmit = async (values: any) => {
        setIsCreateBookingLoading(true);
        //if user didn't added credit card before adding a booking, show the message and redirect button
        if (stripeId) {
            //if user has stripe account but don't have default payment method
            const res = await getUser(userId!).unwrap();
            const defaultSource = res.paymentMethods[0];
            if (!defaultSource) {
                setSidebarOpen(true);
                setIsCreateBookingLoading(false);
                //toastService.creditCard(t('ERROR_HANDLING.DEFAULT_CARD_MISSING'));
                return;
            }
        } else {
            setSidebarOpen(true);
            setIsCreateBookingLoading(false);
            //toastService.creditCard(t('ERROR_HANDLING.CREDIT_CARD_MISSING'));
            return;
        }

        const splitString = values.timeFrom.split(':');
        props.setSidebarOpen(false);

        function handleResponseSuccess(success: any) {
            if (success) {
                // toastService.success(t('BOOKING.SUCCESS'));
                const bookingInfo: IBookingChatMessageInfo = {
                    tutorId: tutorId,
                    startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                    subjectId: values.subject,
                    levelId: values.level,
                };

                setShowLessonInfoPopup(true);
                props.setBookingMessageInfo(bookingInfo);
            } else {
                toastService.error(t('BOOKING.FAILURE'));
            }
        }

        const request: ICreateBookingDTO =
            userRole === RoleOptions.Parent
                ? {
                      requesterId: userId,
                      startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
                      subjectId: values.subject,
                      studentId: values.child,
                      tutorId: tutorId,
                      levelId: values.level,
                      useCredits: values.useCredits,
                  }
                : {
                      requesterId: userId,
                      studentId: userId,
                      startTime: moment(start).set('hours', Number(splitString[0])).set('minutes', Number(splitString[1])).toISOString(),
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

    useEffect(() => {
        if (isCreateBookingSuccess) {
            // toastService.success(t('BOOKING.SUCCESS'));
            props.clearEmptyBookings();
            handleClose ? handleClose(false) : false;
        }
    }, [isCreateBookingSuccess]);

    useEffect(() => {
        if (createBookingSuccess) {
            // toastService.success(t('BOOKING.SUCCESS'));
            props.clearEmptyBookings();
            handleClose ? handleClose(false) : false;
        }
    }, [createBookingSuccess]);

    const handleChange = (e: any) => {
        setSelectedTime(e);
        formik.setFieldValue('timeFrom', e);
    };

    const handleSubmitForm = () => {
        formik.handleSubmit();

        props.setSidebarOpen(false);
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
            const subjectOptions: OptionType[] = subjectLevelPairs.filter((item) => item.level.value === levelId).map((item) => item.subject);

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
    const mobileStyles = isMobile ? { top: `${topOffset}px` } : {};

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

    return (
        <div style={mobileStyles} className={`modal--parent modal--parent--${isMobile ? '' : positionClass}`}>
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
                            handleClose ? handleClose(false) : false;
                            props.clearEmptyBookings();
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
                        <div className="field">
                            <label htmlFor="timeFrom" className="field__label">
                                {t('BOOK.FORM.TIME')}
                            </label>
                            <div className="flex">
                                <div className="field w--100 mr-6">
                                    <MyTimePicker
                                        field={formik.getFieldProps('timeFrom')}
                                        form={formik}
                                        meta={formik.getFieldMeta('timeFrom')}
                                        defaultValue={moment(formik.values.timeFrom, 'HH:mm')}
                                        onChangeCustom={(e) => handleChange(moment(e, 'HH:mm').format('HH:mm'))}
                                        key={formik.values.timeFrom}
                                        isDisabled={isCreateBookingLoading}
                                    />
                                </div>
                                <div className="field w--100">
                                    <MyTextField
                                        // isDisabled={levelDisabled}
                                        placeholder={t('BOOK.FORM.TIME_PLACEHOLDER')}
                                        name="time"
                                        id="time"
                                        disabled={true}
                                        value={moment(formik.values.timeFrom, 'HH:mm').add(1, 'hour').format('HH:mm')}
                                    />
                                </div>
                            </div>
                        </div>

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
                                    <div style={{ justifyContent: 'flex-start', marginBottom: 0 }} className="flex flex--row flex--ai--center mt-4">
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
                    {/*{tutorDisabled && <Tooltip*/}
                    {/*  id="bookAndPayButton"*/}
                    {/*  place={'top-end'}*/}
                    {/*  positionStrategy={'absolute'}*/}
                    {/*  float={true}*/}
                    {/*  delayShow={1000}*/}
                    {/*  style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller' }}*/}
                    {/*/>}*/}
                    <ButtonPrimaryGradient
                        data-tooltip-id="bookAndPayButton"
                        data-tooltip-html={`${t('BOOK.FORM.TUTOR_DISABLED')}`}
                        disabled={tutorDisabled}
                        className="btn btn--base type--wgt--extra-bold mb-1 mt-1"
                        onClick={() => handleSubmitForm()}
                    >
                        {tutorDisabled ? t('BOOK.FORM.TUTOR_DISABLED') : stripeCustomerId ? t('BOOK.FORM.SUBMIT') : t('BOOK.FORM.ADD_CARD')}
                    </ButtonPrimaryGradient>
                    <button
                        className="btn btn--base type--wtg--extra-bold btn--clear"
                        onClick={() => {
                            handleClose ? handleClose(false) : false;
                            props.clearEmptyBookings();
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
    );
};

export default ParentCalendarSlots;
