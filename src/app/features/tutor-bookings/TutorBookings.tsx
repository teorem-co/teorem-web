import { defaultMaxListeners } from "events";
import { Form, FormikProvider, useFormik } from 'formik';
import i18n from 'i18next';
import { uniqBy } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useLazyGetTutorBookingsQuery, useLazyGetTutorIdByTutorSlugQuery, useLazyGetTutorProfileDataQuery } from '../../../services/tutorService';
import { addStripeId } from '../../../slices/authSlice';
import { RoleOptions } from '../../../slices/roleSlice';
import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import LoaderSecondary from '../../components/skeleton-loaders/LoaderSecondary';
import { useAppDispatch, useAppSelector } from '../../hooks';
import toastService from '../../services/toastService';
import { calcModalPosition } from '../../utils/calcModalPosition';
import ParentCalendarSlots from '../my-bookings/components/ParentCalendarSlots';
import ParentEventModal from '../my-bookings/components/ParentEventModal';
import UpdateBooking from '../my-bookings/components/UpdateBooking';
import { useLazyGetBookingByIdQuery, useLazyGetBookingsQuery } from '../my-bookings/services/bookingService';
import { useLazyGetUnavailableBookingsQuery } from '../my-bookings/services/unavailabilityService';
import AddCreditCard, { Values as CreditCardValues } from '../my-profile/components/AddCreditCard';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import IAddCustomerPost from '../my-profile/interfaces/IAddCustomerPost';
import ICardPost from '../my-profile/interfaces/ICardPost';
import {
    useAddCustomerMutation,
    useAddCustomerSourceMutation,
    useLazyGetCreditCardsQuery,
    useSetDefaultCreditCardMutation,
} from '../my-profile/services/stripeService';
import { useLazyGetTutorAvailableDaysQuery } from "../my-profile/services/tutorAvailabilityService";

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    userId?: string;
}

// interface IEvent {
//     id?: string;
//     label: string;
//     start: string;
//     end: string;
//     allDay: boolean;
// }

interface ICoords {
    x: number;
    y: number;
}

const TutorBookings = () => {
    const [getTutorBookings, { data: tutorBookings, isLoading: isLoadingTutorBookings }] = useLazyGetTutorBookingsQuery();
    const [getBookings, { data: bookings, isLoading: isLoadingBookings }] = useLazyGetBookingsQuery();
    const [getTutorUnavailableBookings, { data: unavailableBookings, isLoading: isLoadingUnavailableBookings }] =
        useLazyGetUnavailableBookingsQuery();
    const [getTutorData, { data: tutorData }] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                firstName: data?.User.firstName,
                lastName: data?.User.lastName,
            },
            isSuccess,
            isLoading,
        }),
    });
    const [getTutorAvability, { data: tutorAvability, isLoading: tutorAvabilityLoading }] = useLazyGetTutorAvailableDaysQuery();

    const [getBookingById, { data: booking }] = useLazyGetBookingByIdQuery();
    const [addCustomerSource] = useAddCustomerSourceMutation();
    const [addStripeCustomer, { data: dataStripeCustomer, isSuccess: isSuccessDataStripeCustomer, isError: isErrorDataStripeCustomer }] =
        useAddCustomerMutation();
    const [getCreditCards, { data: creditCards, isLoading: creditCardLoading, isUninitialized: creditCardUninitialized }] =
        useLazyGetCreditCardsQuery();
    const [setDefaultCreditCard, { isSuccess: isSuccessSetDefaultCreditCard }] = useSetDefaultCreditCardMutation();
    const dispatch = useAppDispatch();

    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [emptyBookings, setEmptybookings] = useState<IBookingTransformed[]>([]);
    const [openSlot, setOpenSlot] = useState<boolean>(false);
    //const [eventDetails, setEventDetails] = useState<IEvent>();
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [calChange, setCalChange] = useState<boolean>(false);
    const [value, onChange] = useState(new Date());
    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<string>('');
    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });

    const localizer = momentLocalizer(moment);
    const history = useHistory();
    const positionClass = moment(selectedStart).format('dddd');
    const userRole = useAppSelector((state) => state.auth.user?.Role?.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const stripeCustomerId = useAppSelector((state) => state.auth.user?.stripeCustomerId);
    const userInfo = useAppSelector((state) => state.auth.user);


    const [getTutorIdByTutorSlug] = useLazyGetTutorIdByTutorSlugQuery();
    const [tutorId, setTutorId] = useState('');
    const { tutorSlug } = useParams();
    useEffect(() => {
        getTutorIdByTutorSlug(tutorSlug).unwrap().then((tutorIdObj: any) => {
            setTutorId(tutorIdObj.userId);

        });
    }, []);

    useEffect(() => {
        if (tutorId) {
            fetchData();
        }
    }, [tutorId]);

    const { t } = useTranslation();
    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));
    const highlightRef = useRef<HTMLDivElement>(null);
    const allBookings = tutorBookings && tutorBookings.concat(emptyBookings, unavailableBookings ? unavailableBookings : []);
    const existingBookings = tutorBookings && tutorBookings.concat(unavailableBookings ? unavailableBookings : []);
    const totalBookings = allBookings && allBookings.concat(bookings ? bookings : []);
    const filteredBookings = uniqBy(totalBookings, 'id');
    const tileRef = useRef<HTMLDivElement>(null);
    const tileElement = tileRef.current as HTMLDivElement;

    interface Values {
        cardFirstName: string;
        cardLastName: string;
        city: string;
        country: string;
        line1: string;
        line2: string;
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        zipCode: string;
    }
    const initialValues: Values = {
        cardFirstName: '',
        cardLastName: '',
        city: '',
        country: '',
        line1: '',
        line2: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: '',
    };

    const isLoading = isLoadingTutorBookings || isLoadingBookings || isLoadingUnavailableBookings || tutorAvabilityLoading;

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">{moment(date.date).format('DD/MMM')}</div>
            </>
        );
    };

    const CustomEvent = (event: any) => {
        if (event.event?.userId !== userId) {
            return <div className="my-bookings--unavailable"></div>;
        } else {
            if (event.event?.isAccepted === false) {
                return (
                    <div className="event">
                        <div className="type--wgt--bold">{event.event.label}</div>
                    </div>
                );
            } else {
                return (
                    <div className="event event--pending">
                        <div className="type--wgt--bold">{event.event.label}</div>
                    </div>
                );
            }
        }
    };

    // const CustomSlot = (e: any) => {
    //     if (moment(e.value).isBefore(moment())) {
    //     return <div style={{ backgroundColor: '#fcfcfc', width: '100%', height: '25px' }}></div>;
    //     } else {
    //         return e.children;
    //     }
    // };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };

    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    const slotSelect = (e: SlotInfo) => {
        const existingBooking =
            existingBookings && existingBookings.filter((date) => moment(date.start).format('YYYY/MM/DD') === moment(e.start).format('YYYY/MM/DD'));

        let isAvailableBooking = false;

        const endDat = moment(e.end).toDate();

        tutorAvability && tutorAvability.forEach((index, item) => {

            if (item > 0) {
                index.forEach((day, dayOfWeek) => {

                    if (dayOfWeek > 0 && endDat.getDay() == dayOfWeek - 1 && day) {
                        switch (index[0]) {
                            case "Pre 12 pm":
                                if (endDat.getHours() < 12)
                                    isAvailableBooking = true;
                                break;
                            case "12 - 5 pm":
                                if (endDat.getHours() > 12 && endDat.getHours() < 17)
                                    isAvailableBooking = true;
                                break;
                            case "After 5 pm":
                                if (endDat.getHours() > 17)
                                    isAvailableBooking = true;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        });

        const flagArr = [];
        if (existingBooking) {
            const checkHours = !moment(e.start).isBefore(moment().add(3, 'hours'));
            existingBooking.forEach((booking) => {
                const isBetweenStart = moment(e.start).isBetween(moment(booking.start), moment(booking.end));
                const isBetweenEnd = moment(e.start).add(1, 'hours').isBetween(moment(booking.start), moment(booking.end));

                const currentFlag = checkHours && isBetweenStart === false && isBetweenEnd === false;
                if (currentFlag) {
                    flagArr.push(true);
                }
            });
        }
        if (flagArr.length === existingBooking?.length && !moment(e.start).isBefore(moment().add(3, 'hours')) && isAvailableBooking) {
            // setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));     MMMM format doesn't work with different languages!
            setSelectedStart(moment(e.start).format());
            setSelectedEnd(moment(e.start).add(1, 'hours').format('HH:mm'));
            setOpenSlot(true);
            setOpenUpdateModal(false);
            setOpenEventDetails(false);

            setEmptybookings([
                {
                    id: '',
                    start: moment(e.start).toDate(),
                    end: moment(e.start).add(1, 'hours').toDate(),
                    label: 'Book event',
                    allDay: false,
                    userId: userId ? userId : '',
                },
            ]);
            return CustomEvent(e.slots);
        } else {
            setOpenSlot(false);
            setEmptybookings([]);
            toastService.info("You can't book a lesson at selected time");
        }
    };

    const handleSelectedEvent = (e: IBookingTransformed) => {
        setCurentlyActiveBooking(e.id);
        // check whole date not only hours this is a bug
        if (e.userId === userId) {
            if (moment(e.start).isBefore(moment()) || emptyBookings.length > 0) {
                return;
            } else {
                setOpenSlot(false);
                setOpenEventDetails(true);
                getBookingById(e.id);
                // setEventDetails({
                //     start: moment(e.start).format('DD/MMMM/YYYY, HH:mm'),
                //     end: moment(e.end).format('HH:mm'),
                //     allDay: e.allDay,
                //     label: e.label,
                // });
                setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
                setSelectedEnd(moment(e.end).format('HH:mm'));
                // if (booking && booking.id) {
                //     setOpenSlot(true);
                // }
            }
        } else {
            return;
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            cardFirstName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cardLastName: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            city: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            country: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            line1: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            line2: Yup.string(),
            cardNumber: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            expiryDate: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
            cvv: Yup.string().max(3, t('FORM_VALIDATION.TOO_LONG')).required(t('FORM_VALIDATION.REQUIRED')),
            zipCode: Yup.string().required(t('FORM_VALIDATION.REQUIRED')),
        }),
    });

    //use for creadit card information sidebar
    const handleSubmit = async (values: any) => {
        setSidebarOpen(false);
        if (!stripeCustomerId) {
            //If user has not added any card to the stripe yet
            //    - add user to stripe
            //    - add stripeID to redux
            //    - set Added credit card to be default
            const toSend: IAddCustomerPost = {
                userId: userInfo!.id,
                customer: {
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.line1,
                        line2: values.line2,
                        postal_code: Number(values.zipCode),
                        state: values.city,
                    },
                    description: ' ',
                    email: userInfo!.email,
                    name: values.cardFirstName + ' ' + values.cardLastName,
                    phone: userInfo!.phoneNumber,
                },
            };
            await addStripeCustomer(toSend).unwrap();
        }

        const toSend: ICardPost = {
            object: 'card',
            number: values.cardNumber.toString(),
            exp_month: Number(values.expiryDate.split('/')[0]),
            exp_year: Number('20' + values.expiryDate.split('/')[1]),
            cvc: Number(values.cvv),
            name: 'creditCard',
            address_line1: values.line1,
            address_city: values.city,
            address_zip: values.zipCode,
            address_country: values.country,
        };

        const toSendCustomerSource = {
            userId: userInfo!.id,
            card: toSend,
        };

        addCustomerSource(toSendCustomerSource)
            .unwrap()
            .then(() => {
                fetchData();
                setSidebarOpen(false);
            });
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
            toastService.success(t('PROFILE_ACCOUNT.STRIPE_DEFAULT_PAYMENT_METHOD_UPDATED'));
        }
    }, [isSuccessDataStripeCustomer, isErrorDataStripeCustomer]);

    const handleUpdateModal = (isOpen: boolean) => {
        setOpenUpdateModal(isOpen);
        setOpenEventDetails(false);
    };

    const calcPosition = () => {
        const childElement = document.querySelector('.react-calendar__tile--active');
        const rectParent = highlightRef.current && highlightRef.current.getBoundingClientRect();
        const rectChild = childElement && childElement.getBoundingClientRect();

        if (rectParent && rectChild) {
            const finalX = rectParent.x - rectChild.x;
            const finalY = rectChild.y - rectParent.y;
            setHighlightCoords({ x: finalX, y: finalY });
        }
    };

    const hideShowHighlight = (date: Date) => {
        if (tileElement) {
            if (moment(date).isSame(value, 'month')) {
                tileElement.style.display = 'block';
            } else {
                tileElement.style.display = 'none';
            }
        }
    };

    const fetchData = async () => {
        if (tutorId) {
            await getTutorData(tutorId).unwrap();
            await getTutorUnavailableBookings({
                tutorId: tutorId,
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
            }).unwrap();

            await getTutorAvability(tutorId).unwrap();
        }
    };

    /*useEffect(() => {
        fetchData();
    }, []);*/

    useEffect(() => {
        calcPosition();
        hideShowHighlight(value);
    }, [value]);

    useEffect(() => {
        const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
        indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    useEffect(() => {
        if (userId) {
            getBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
            });
        }
    }, [value, userId]);

    useEffect(() => {
        if (tutorId) {
            getTutorBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
                tutorId: tutorId,
            });
        }
    }, [value, tutorId]);

    return (
        <MainWrapper>
            <div className="layout--primary">
                {isLoading ? <LoaderSecondary /> : <></>}
                <div>
                    {/* {(isLoading && <LoaderPrimary />) || ( */}
                    <div className="card--calendar">
                        <div className="flex flex--center p-6">
                            {/* <Link to={PATHS.SEARCH_TUTORS}>
                            <div>
                                <i className="icon icon--base icon--arrow-left icon--black"></i>
                            </div>
                        </Link> */}
                            <div onClick={() => history.goBack()}>
                                <div>
                                    <i className="icon icon--base icon--arrow-left icon--black"></i>
                                </div>
                            </div>
                            <h2 className="type--lg  ml-6">
                                {`${t('MY_BOOKINGS.TITLE')} - ${tutorData.firstName ? tutorData.firstName : ''} ${tutorData.lastName ? tutorData.lastName : ''
                                    }`}
                            </h2>
                        </div>
                        <BigCalendar
                            localizer={localizer}
                            formats={{
                                timeGutterFormat: 'HH:mm',
                            }}
                            events={filteredBookings ? filteredBookings : []}
                            toolbar={false}
                            date={value}
                            selectable={true}
                            onSelecting={() => false}
                            view="week"
                            style={{ height: 'calc(100% - 84px)' }}
                            startAccessor="start"
                            endAccessor="end"
                            components={{
                                week: {
                                    header: (date) => CustomHeader(date),
                                },
                                event: (event) => CustomEvent(event),
                                // timeSlotWrapper: (e) => CustomSlot(e),
                            }}
                            scrollToTime={defaultScrollTime}
                            showMultiDayTimes={true}
                            step={15}
                            timeslots={4}
                            longPressThreshold={10}
                            onSelectSlot={(e) => (userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? slotSelect(e) : null)}
                            onSelectEvent={(e) =>
                                userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? handleSelectedEvent(e) : null
                            }
                        // onSelecting={(range: { start: ; end: 'test'; }) => false}
                        />
                        {openSlot ? (
                            <ParentCalendarSlots
                                clearEmptyBookings={() => setEmptybookings([])}
                                setSidebarOpen={(e) => setSidebarOpen(e)}
                                start={`${selectedStart}`}
                                end={`${selectedEnd}`}
                                handleClose={(e) => setOpenSlot(e)}
                                positionClass={calcModalPosition(positionClass)}
                                tutorId={tutorId}
                            />
                        ) : openEventDetails ? (
                            <ParentEventModal
                                eventIsAccepted={booking ? booking.isAccepted : false}
                                bookingStart={booking ? booking.startTime : ''}
                                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
                                tutorName={tutorData.firstName && tutorData.lastName ? tutorData.firstName + ' ' + tutorData.lastName : ''}
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenEventDetails(e)}
                                positionClass={calcModalPosition(positionClass)}
                                openLearnCube={() => setLearnCubeModal(true)}
                            />
                        ) : openUpdateModal ? (
                            <UpdateBooking
                                booking={booking ? booking : null}
                                clearEmptyBookings={() => setEmptybookings([])}
                                setSidebarOpen={(e: any) => setSidebarOpen(e)}
                                start={`${selectedStart}`}
                                end={`${selectedEnd}`}
                                handleClose={(e: any) => setOpenUpdateModal(e)}
                                positionClass={calcModalPosition(positionClass)}
                                tutorId={tutorId}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    {/* )} */}
                </div>
                <div>
                    <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
                        <Calendar
                            locale={i18n.language}
                            onActiveStartDateChange={(e) => {
                                hideShowHighlight(e.activeStartDate);
                            }}
                            onChange={(e: Date) => {
                                onChange(e);
                                setCalChange(!calChange);
                            }}
                            value={value}
                            prevLabel={<PrevIcon />}
                            nextLabel={<NextIcon />}
                        />
                        <div
                            ref={tileRef}
                            style={{
                                top: `${highlightCoords.y}px`,
                                left: `${highlightCoords.x}px`,
                            }}
                            className="tile--row"
                        ></div>
                    </div>
                    <div className="upcoming-lessons">
                        <p className="upcoming-lessons__title">{t('MY_BOOKINGS.INFORMATION.TITLE')}</p>
                        <div className="card card--primary mb-2">
                            <div className="flex--primary mb-2">
                                <div className="flex--center">
                                    <span>{t('MY_BOOKINGS.INFORMATION.CARD1.TITLE')}</span>
                                    <div className="type--color--secondary mt-2">{t('MY_BOOKINGS.INFORMATION.CARD1.DESC')}</div>
                                </div>
                                <div className="type--color--tertiary"></div>
                            </div>
                        </div>
                        <div className="card card--primary mb-2">
                            <div className="flex--primary mb-2">
                                <div className="flex--center">
                                    <span>{t('MY_BOOKINGS.INFORMATION.CARD2.TITLE')}</span>
                                    <div className="type--color--secondary mt-2">{t('MY_BOOKINGS.INFORMATION.CARD2.DESC')}</div>
                                </div>
                                <div className="type--color--tertiary"></div>
                            </div>
                        </div>
                    </div>
                    {/* needs to be in this place because layout have nth-child selector */}
                    {sidebarOpen ? (
                        <Sidebar
                            sideBarIsOpen={sidebarOpen}
                            title="ADD NEW CARD"
                            onSubmit={formik.handleSubmit}
                            closeSidebar={() => setSidebarOpen(false)}
                            cancelLabel="Cancel"
                            submitLabel="Add New Card"
                            children={
                                <FormikProvider value={formik}>
                                    <Form>
                                        <div className="field">
                                            <label htmlFor="cardFirstName" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.NAME')}
                                            </label>
                                            <TextField name="cardFirstName" id="cardFirstName" placeholder={t('ACCOUNT.NEW_CARD.NAME_PLACEHOLDER')} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardLastName" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.SURNAME')}
                                            </label>
                                            <TextField
                                                name="cardLastName"
                                                id="cardLastName"
                                                placeholder={t('ACCOUNT.NEW_CARD.SURNAME_PLACEHOLDER')}
                                            />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="city" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.CITY')}
                                            </label>
                                            <TextField name="city" id="city" placeholder={t('ACCOUNT.NEW_CARD.CITY_PLACEHOLDER')} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="country" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.COUNTRY')}
                                            </label>
                                            <TextField name="country" id="country" placeholder={t('ACCOUNT.NEW_CARD.COUNTRY_PLACEHOLDER')} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="line1" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.ADDRESS1')}
                                            </label>
                                            <TextField
                                                name="line1"
                                                id="line1"
                                                placeholder={t('ACCOUNT.NEW_CARD.ADDRESS1_PLACEHOLDER')}
                                                withoutErr={formik.errors.line1 && formik.touched.line1 ? false : true}
                                            />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="line2" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.ADDRESS2')}
                                            </label>
                                            <TextField name="line2" id="line2" placeholder={t('ACCOUNT.NEW_CARD.ADDRESS2_PLACEHOLDER')} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardNumber" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.CARD_NUMBER')}
                                            </label>
                                            <TextField
                                                type="number"
                                                name="cardNumber"
                                                id="cardNumber"
                                                placeholder={t('ACCOUNT.NEW_CARD.CARD_NUMBER_PLACEHOLDER')}
                                            />
                                        </div>
                                        <div className="field field__file">
                                            <div className="flex">
                                                <div className="field w--100 mr-6">
                                                    <label htmlFor="expiryDate" className="field__label">
                                                        {t('ACCOUNT.NEW_CARD.EXPIRY')}
                                                    </label>
                                                    <TextField
                                                        type="text"
                                                        name="expiryDate"
                                                        id="expiryDate"
                                                        placeholder={t('ACCOUNT.NEW_CARD.EXPIRY_PLACEHOLDER')}
                                                        mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                                                    />
                                                </div>

                                                <div className="field w--100">
                                                    <label htmlFor="cvv" className="field__label">
                                                        {t('ACCOUNT.NEW_CARD.CVV')}
                                                    </label>
                                                    <TextField
                                                        max={3}
                                                        maxLength={3}
                                                        type="number"
                                                        name="cvv"
                                                        id="cvv"
                                                        placeholder={t('ACCOUNT.NEW_CARD.CVV_PLACEHOLDER')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="field">
                                            <label htmlFor="zipCode" className="field__label">
                                                {t('ACCOUNT.NEW_CARD.ZIP')}
                                            </label>
                                            <TextField
                                                type="number"
                                                name="zipCode"
                                                id="zipCode"
                                                placeholder={t('ACCOUNT.NEW_CARD.ZIP_PLACEHOLDER')}
                                            />
                                        </div>
                                    </Form>
                                </FormikProvider>
                            }
                        />
                    ) : (
                        <></>
                    )}
                    {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() => setLearnCubeModal(false)} />}
                </div>
            </div>
        </MainWrapper>
    );
};

export default TutorBookings;
