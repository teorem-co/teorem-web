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
import { useLazyGetCreditCardsQuery } from '../../store/services/stripeService';
import { GoDotFill } from 'react-icons/go';
import LoaderPrimary from '../skeleton-loaders/LoaderPrimary';
import toastService from '../../store/services/toastService';
import { useHistory } from 'react-router';
import { PATHS } from '../../routes';
import Select, { components } from 'react-select';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

interface Props {
    className?: string;
    startTime: string;
    tutorId: string;
}

const NEW_PAYMENT_METHOD_VALUE = 'NEW_PAYMENT_METHOD';

export function CheckoutInfoCard({ className, startTime, tutorId }: Props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const timeZoneState = useAppSelector((state) => state.timeZone);

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

    const [tutorLevelOptions, setTutorLevelOptions] = useState<OptionType[]>();
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<OptionType[]>([]);
    const [tutorSubjectOptions, setTutorSubjectOptions] = useState<OptionType[]>();
    const [isCreateBookingLoading, setIsCreateBookingLoading] = useState<boolean>(false); // isLoading from Mutation is too slow;
    const [userCredits, setUserCredits] = useState<number>(0);
    const [cost, setCost] = useState<number | undefined>(undefined);
    const [reserveResponse, setReserveResponse] = useState<BookingReserveResponse | undefined>();
    const [loading, setLoading] = useState(false);
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
        console.log('submit');
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

    useEffect(() => {
        const res = getCredits().unwrap();

        res.then((res) => {
            dispatch(setCredits(res.credits));
            setUserCredits(res.credits);
        });
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
    }, [formik.values.level]);

    useEffect(() => {
        console.log('CREDIT cards: ', creditCards);
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
                label: 'Koristite novi nacin placanja',
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
            setLoading(false);
            setReserveResponse(data);
            console.log('created new Payment intent');
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

    useEffect(() => {
        console.log('PAYMENT METHOD: ', formik2.values.paymentMethod);
    }, [formik2.values.paymentMethod]);

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

            setLoading(true);
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
            if (data.success) {
                toastService.success('Uspjesno napravljena rezervacija');
                history.push(PATHS.DASHBOARD);
            }
            // setLoading(false);
            // setReserveResponse(data);
            // console.log('created new Payment intent');
        }
    }

    useEffect(() => {
        console.log('Payment method options: ', paymentMethodOptions);
    }, [paymentMethodOptions]);

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

    return tutorData ? (
        <div className="flex flex--gap-10">
            <div className={`${className} flex flex--col font-lato checkout-info-card flex--gap-10`}>
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
                            initials={tutorData.User.firstName.charAt(0) + tutorData.User.lastName.charAt(0)}
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
                                        <span className="type--md type--wgt--extra-bold">{tutorData.averageGrade}</span>
                                    </>
                                ) : (
                                    <span className="type--md type--wgt--extra-bold">{t('CHECKOUT.NEW_TUTOR')}</span>
                                )}
                            </span>
                        </div>
                        <div className="flex flex--jc--space-between type--sm">
                            {tutorData.TutorSubjects.length > 0 ? (
                                <CustomSubjectList
                                    subjects={uniq(tutorData.TutorSubjects.map((subject) => subject.Subject.abrv))}
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

                <div className="flex flex--col bg__green pr-4 pl-4 pt-2 pb-2 flex--gap-5">
                    <span className="flex flex--ai--center flex--gap-10 type--wgt--extra-bold">
                        <FaCalendarAlt />
                        {t('CHECKOUT.RESCHEDULE_TIP.TITLE')}
                    </span>
                    <p>{t('CHECKOUT.RESCHEDULE_TIP.DETAILS')}</p>
                </div>
            </div>

            {userId &&
                cost &&
                formik.values.subject &&
                formik.values.level &&
                ((paymentMethodOptions && paymentMethodOptions?.length !== 0) || calculateTotalCost(cost) === 0) &&
                (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                    <div className="w--550 font-lato">
                        <div className="flex flex--row">
                            <div className="type--wgt--extra-bold font__xlg text-align--center mb-3">
                                Choose how to pay
                            </div>
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
                                                placeholder={'Odaberite nacin placanja'}
                                                isDisabled={isCreateBookingLoading}
                                            />
                                        </div>
                                    </Form>
                                </FormikProvider>
                            )}

                        {userId &&
                            cost &&
                            calculateTotalCost(cost) === 0 &&
                            formik.values.subject &&
                            formik.values.level &&
                            (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                                <Select
                                    className={'form__type mb-4'}
                                    classNamePrefix="onboarding-select"
                                    components={{
                                        SingleValue: customSingleValue,
                                        // Option: customOptions,
                                    }}
                                    name={'Platite sve koristeci kredite'}
                                    value={{ label: 'Platite sve koristeci kredite', icon: 'dw' }}
                                    placeholder={'Platite sve koristeci kredite'}
                                    isDisabled={true}
                                />
                            )}

                        {(userRole === RoleOptions.Parent ? formik.values.child : true) &&
                            (formik2.values.paymentMethod !== NEW_PAYMENT_METHOD_VALUE ||
                                calculateTotalCost(cost) === 0) && (
                                <div className="flex flex--col">
                                    <button
                                        disabled={
                                            !(
                                                (!!formik2.values.paymentMethod &&
                                                    formik2.values.paymentMethod !== NEW_PAYMENT_METHOD_VALUE) ||
                                                calculateTotalCost(cost) === 0
                                            )
                                        }
                                        className="mt-10 w--100 text-align--center font__lg flex--ai--center flex flex--grow flex--jc--center btn pt-3 pb-3 btn--primary type--wgt--bold"
                                        onClick={() => {
                                            makeBooking();
                                        }}
                                    >
                                        <span>Confirm payment</span>
                                        <GoDotFill />
                                        <CurrencySymbol />
                                        <span>{calculateTotalCost(cost)}</span>
                                    </button>
                                    <div className="flex flex--col flex--gap-10 mt-3">
                                        <span className="type--color--secondary type--sm">
                                            By clicking "Confirm payment" button, you agree to Teorem's Refund and
                                            Payment Policy
                                        </span>
                                        <span className="type--color--secondary type--sm">
                                            It's safe to pay on Teorem. All transactions are protected by SSL encryption
                                        </span>
                                    </div>
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
                                <>
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
                                    />

                                    {loading && <LoaderPrimary />}
                                </>
                            )}

                        {loading && <LoaderPrimary />}
                    </div>
                )}

            {reserveResponse &&
                reserveResponse.clientSecret &&
                userId &&
                cost &&
                formik.values.subject &&
                formik.values.level &&
                paymentMethodOptions &&
                !loading &&
                paymentMethodOptions?.length === 0 &&
                (userRole === RoleOptions.Parent ? formik.values.child : true) && (
                    <div className="flex flex--col w-100">
                        <div className="type--wgt--extra-bold font__xlg text-align--center mb-3">Choose how to pay</div>

                        <Select
                            className={'form__type mb-4'}
                            classNamePrefix="onboarding-select"
                            components={{
                                SingleValue: customSingleValue,
                            }}
                            name={'Novi nacin placanja'}
                            value={'Novi nacin placanja'}
                            placeholder={'Novi nacin placanja'}
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
                        />
                    </div>
                )}
            {loading && (
                <div className="flex flex--col w-100 flex--jc--center flex--grow">
                    <LoaderPrimary />
                </div>
            )}
        </div>
    ) : (
        <div>Loading...</div>
    );
}
