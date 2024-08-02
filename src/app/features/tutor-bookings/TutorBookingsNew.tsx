import i18n from 'i18next';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {
    useLazyGetTutorBookingsQuery,
    useLazyGetTutorByTutorSlugQuery,
    useLazyGetTutorUnavalabilitesForCalendarQuery,
} from '../../store/services/tutorService';
import { addStripeId } from '../../store/slices/authSlice';
import { RoleOptions } from '../../store/slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderSecondary from '../../components/skeleton-loaders/LoaderSecondary';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import toastService from '../../services/toastService';
import { calcModalPosition } from '../../utils/calcModalPosition';
import ParentCalendarSlots from '../my-bookings/components/ParentCalendarSlots';
import ParentEventModal from '../my-bookings/components/ParentEventModal';
import UpdateBooking from '../my-bookings/components/UpdateBooking';
import { useLazyGetBookingByIdQuery, useLazyGetBookingsWithTutorQuery } from '../my-bookings/services/bookingService';
import { useLazyGetUnavailableBookingsQuery } from '../my-bookings/services/unavailabilityService';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import { useAddCustomerMutation, useLazyGetCreditCardsQuery, useSetDefaultCreditCardMutation } from '../my-profile/services/stripeService';
import { useLazyGetTutorAvailabilityQuery } from '../my-profile/services/tutorAvailabilityService';
import { InformationCard } from '../../components/InformationCard';
import { CustomToolbar } from '../my-bookings/CustomToolbar';
import AddCreditCard from '../my-profile/components/AddCreditCard';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { BookingPopupForm } from '../../components/BookingPopupForm';
import { TimeZoneSelect } from '../../components/TimeZoneSelect';
import { IBookingModalInfo } from './TutorBookings';

export interface IBookingChatMessageInfo {
    tutorId: string;
    startTime: string;
    subjectId: string;
    levelId: string;
}

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    userId?: string;
}

interface ICoords {
    x: number;
    y: number;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

const TutorBookingsNew = () => {
    const [getAllTutorUnavailabilites, { data: allTutorUnavailabilites }] = useLazyGetTutorUnavalabilitesForCalendarQuery();
    const [tutorId, setTutorId] = useState('');
    const [value, onChange] = useState(new Date());
    const [getBookingsWithTutor, { data: bookingsWithTutor }] = useLazyGetBookingsWithTutorQuery();
    const [mergedPeriods, setMergedPeriods] = useState<IBookingTransformed[] | undefined>([]);
    const [emptyBookings, setEmptyBookings] = useState<IBookingTransformed[]>([]);
    const timeZoneState = useAppSelector((state) => state.timeZone);
    const [selectedZone, setSelectedZone] = useState(timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess());

    useEffect(() => {
        fetchD();
    }, [tutorId, value]);

    useEffect(() => {
        if (timeZoneState.timeZone) setSelectedZone(timeZoneState.timeZone);
    }, [timeZoneState]);

    useEffect(() => {
        fetchD();
        if (selectedZone) moment.tz.setDefault(selectedZone);
    }, [selectedZone]);

    function fetchD() {
        if (tutorId) {
            getAllTutorUnavailabilites({
                tutorId: tutorId,
                startOfWeek: moment(value).startOf('isoWeek').format('YYYY-MM-DD'),
                endOfWeek: moment(value).endOf('isoWeek').format('YYYY-MM-DD'),
                timeZone: selectedZone ? selectedZone : moment.tz.guess(),
            });

            getBookingsWithTutor({
                tutorId: tutorId,
                dateFrom: moment().toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
            });
        }
    }

    useEffect(() => {
        if (allTutorUnavailabilites && bookingsWithTutor) setMergedPeriods([...allTutorUnavailabilites, ...bookingsWithTutor, ...emptyBookings]);
    }, [allTutorUnavailabilites, bookingsWithTutor, emptyBookings]);

    const [unavailablePeriods, setUnavailablePeriods] = useState<IBookingTransformed[] | undefined>();

    useEffect(() => {
        setUnavailablePeriods(allTutorUnavailabilites);
    }, [allTutorUnavailabilites]);

    const [bookingMessageInfo, setBookingMessageInfo] = useState<IBookingChatMessageInfo>();
    const [scrollTopOffset, setScrollTopOffset] = useState<number>(0);
    const [getTutorBookings, { data: tutorBookings, isLoading: isLoadingTutorBookings }] = useLazyGetTutorBookingsQuery();
    const [getTutorUnavailableBookings, { data: unavailableBookings, isLoading: isLoadingUnavailableBookings }] =
        useLazyGetUnavailableBookingsQuery();
    const [getTutorData, { data: tutorData }] = useLazyGetTutorByTutorSlugQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                firstName: data?.User.firstName,
                lastName: data?.User.lastName,
                disabled: data?.disabled,
            },
            isSuccess,
            isLoading,
        }),
    });
    const [getTutorAvailability, { data: tutorAvailability, isLoading: tutorAvailabilityLoading }] = useLazyGetTutorAvailabilityQuery();

    const [getBookingById, { data: booking, isLoading: bookingIsLoading, isFetching: bookingIsFetching }] = useLazyGetBookingByIdQuery();
    const [addStripeCustomer, { data: dataStripeCustomer, isSuccess: isSuccessDataStripeCustomer, isError: isErrorDataStripeCustomer }] =
        useAddCustomerMutation();
    const [getCreditCards, { data: creditCards, isLoading: creditCardLoading, isUninitialized: creditCardUninitialized }] =
        useLazyGetCreditCardsQuery();
    const [setDefaultCreditCard, { isSuccess: isSuccessSetDefaultCreditCard }] = useSetDefaultCreditCardMutation();
    const dispatch = useAppDispatch();

    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [openSlot, setOpenSlot] = useState<boolean>(false);
    //const [eventDetails, setEventDetails] = useState<IEvent>();
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
    const [showBookingSuccessfulModal, setShowBookingSuccessfulModal] = useState<boolean>(false); //todo change
    const [calChange, setCalChange] = useState<boolean>(false);

    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<IBookingModalInfo>();

    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });

    const localizer = momentLocalizer(moment);
    const history = useHistory();
    const positionClass = moment(selectedStart).format('dddd');
    const userRole = useAppSelector((state) => state.auth.user?.Role?.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const userInfo = useAppSelector((state) => state.auth.user);

    const { tutorSlug } = useParams();
    const [minimumUnavailability, setminimumUnavailability] = useState<IBookingTransformed>();
    const [pastUnavailability, setPastUnavailability] = useState<IBookingTransformed>();

    useEffect(() => {
        getTutorData(tutorSlug)
            .unwrap()
            .then((tutorIdObj: any) => {
                setTutorId(tutorIdObj.userId);
            });
    }, []);

    useEffect(() => {
        if (tutorId) {
            fetchData();
        }
    }, [tutorId]);

    const arrayDataToUnavailabilityObjects = (arrayData: any, startMonday: Date): IBookingTransformed[] => {
        startMonday = moment(startMonday).startOf('week').toDate();
        const unavailabilityObjects: IBookingTransformed[] = [];

        // for each day of the week
        for (let col = 1; col < arrayData[0].length; col++) {
            let previousObj: IBookingTransformed | null = null;

            // skip the first row (header) of arrayData
            for (let row = 1; row < arrayData.length; row++) {
                const timeslot = arrayData[row];
                const isAvailable = timeslot[col] as boolean;

                // we only need objects where the value is false (unavailable)
                if (!isAvailable) {
                    const dayOfWeek = timeslot[0] as string; // e.g. 'Pre 12 pm', '12 - 5 pm', 'After 5 pm'
                    let start: Date;
                    let end: Date;

                    // calculate start and end based on the dayOfWeek
                    if (dayOfWeek === 'Pre 12 pm') {
                        start = new Date(startMonday);
                        end = new Date(startMonday);
                        start.setDate(start.getDate() + (col - 1));
                        end.setDate(end.getDate() + (col - 1));
                        start.setHours(0, 0, 0, 0);
                        end.setHours(11, 59, 59, 999);
                    } else if (dayOfWeek === '12 - 5 pm') {
                        start = new Date(startMonday);
                        end = new Date(startMonday);
                        start.setDate(start.getDate() + (col - 1));
                        end.setDate(end.getDate() + (col - 1));
                        start.setHours(12, 0, 0, 0);
                        end.setHours(16, 59, 59, 999);
                    } else {
                        // 'After 5 pm'
                        start = new Date(startMonday);
                        end = new Date(startMonday);
                        start.setDate(start.getDate() + (col - 1));
                        end.setDate(end.getDate() + (col - 1));
                        start.setHours(17, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                    }

                    if (previousObj) {
                        // If current unavailability is continuous with the previous one, update the end of the previous unavailability
                        previousObj.end = end;
                    } else {
                        // create the unavailability object and add it to the array
                        const obj: IBookingTransformed = {
                            start: start,
                            end: end,
                            id: uuidv4(),
                            label: 'unavailable',
                            allDay: false,
                        };
                        unavailabilityObjects.push(obj);
                        previousObj = obj;
                    }
                } else {
                    previousObj = null; // Reset for non-continuous unavailability
                }
            }
        }

        return unavailabilityObjects;
    };

    const [firstDayOfSelectedWeek, setFirstDayOfSelectedWeek] = useState<Date>(new Date());
    const { t } = useTranslation();
    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));
    const highlightRef = useRef<HTMLDivElement>(null);

    const existingBookings =
        tutorBookings &&
        tutorBookings
            .concat(unavailableBookings ? unavailableBookings : [])
            .concat(tutorAvailability ? arrayDataToUnavailabilityObjects(tutorAvailability, firstDayOfSelectedWeek) : []);
    const tileRef = useRef<HTMLDivElement>(null);
    const tileElement = tileRef.current as HTMLDivElement;

    const isLoading = isLoadingTutorBookings || isLoadingUnavailableBookings || tutorAvailabilityLoading;

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">{moment(date.date).format('DD MMM')}</div>
            </>
        );
    };

    const CustomEvent = (event: any) => {
        if (event.event?.userId !== userId) {
            return (
                <>
                    {event.event.label !== 'unavailableHoursBefore' ? (
                        <div className="event--unavailable">
                            <div className="type--color--primary type--wgt--extra-bold" style={{ fontSize: 'small', textAlign: 'center' }}>
                                {event.event.label === 'unavailableHoursBefore' ? t('BOOKING.CANT_BOOK_MESSAGE') : null}
                            </div>
                        </div>
                    ) : (
                        <div className="event--unavailable-min-time">
                            <div className="type--color--primary type--wgt--extra-bold" style={{ fontSize: 'small', textAlign: 'center' }}>
                                {event.event.label === 'unavailableHoursBefore' ? t('BOOKING.CANT_BOOK_MESSAGE') : null}
                            </div>
                        </div>
                    )}
                </>
            );
        } else {
            if (event.event?.isAccepted === false) {
                return (
                    <div className={`event ${event.event.inReschedule ? 'event-in-reschedule' : ''} `}>
                        <div className="type--wgt--bold">{event.event.label}</div>
                    </div>
                );
            } else {
                return (
                    <div className={`event event--pending ${event.event.inReschedule ? 'event-in-reschedule' : ''} `}>
                        <div className="type--wgt--bold">{event.event.label}</div>
                    </div>
                );
            }
        }
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };

    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    const slotSelect = (e: SlotInfo) => {
        const rootElement = document.getElementById('main_layout');
        //calculating offset for modal
        if (e.bounds?.bottom && rootElement?.scrollTop) {
            const boundsTop = e.bounds?.top <= 300 ? e.bounds?.top + 500 : e.bounds?.top + 200;
            setScrollTopOffset(rootElement?.scrollTop + boundsTop - 350);
        }

        const existingBooking =
            existingBookings && existingBookings.filter((date) => moment(date.start).format('YYYY/MM/DD') === moment(e.start).format('YYYY/MM/DD'));

        let isAvailableBooking = false;

        const endDat = moment(e.end).toDate();

        tutorAvailability &&
            tutorAvailability.forEach((index, item) => {
                if (item > 0) {
                    index.forEach((day, dayOfWeek) => {
                        if (dayOfWeek >= 0 && endDat.getDay() == dayOfWeek && day) {
                            switch (index[0]) {
                                case 'Pre 12 pm':
                                    if (endDat.getHours() <= 12) {
                                        isAvailableBooking = true;
                                    }
                                    break;
                                case '12 - 5 pm':
                                    if (endDat.getHours() >= 12 && endDat.getHours() <= 17) isAvailableBooking = true;
                                    break;
                                case 'After 5 pm':
                                    if (endDat.getHours() >= 17) isAvailableBooking = true;
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

        console.log('FIRST: ', flagArr.length === existingBooking?.length);
        console.log('SECOND: ', !moment(e.start).isBefore(moment().add(3, 'hours')));
        console.log('THIRD: ', isAvailableBooking);

        const firstCheck = flagArr.length === existingBooking?.length;

        if (firstCheck && !moment(e.start).isBefore(moment().add(3, 'hours')) && isAvailableBooking) {
            // setSelectedStart(moment(e.start).format('t('DATE_FORMAT'), HH:mm'));     MMMM format doesn't work with different languages!
            setSelectedStart(moment(e.start).format());
            setSelectedEnd(moment(e.start).add(1, 'hours').format('HH:mm'));
            setOpenSlot(true);
            setOpenUpdateModal(false);
            setOpenEventDetails(false);

            setEmptyBookings([
                {
                    id: '',
                    start: moment(e.start).toDate(),
                    end: moment(e.start).add(1, 'hours').toDate(),
                    label: 'Book event',
                    allDay: false,
                    userId: userId ? userId : '',
                },
            ]);
            // return CustomEvent(e.slots);
        } else {
            setOpenSlot(false);
            setEmptyBookings([]);

            toastService.info(`${t('BOOKING.TOAST_CANT_BOOK')}`);
        }
    };

    const handleSelectedEvent = (e: IBookingTransformed) => {
        setCurentlyActiveBooking({
            bookingId: e.id,
            endTime: moment(e.end).toISOString(),
        });
        // check whole date not only hours this is a bug

        if (e.userId === userId) {
            if (moment(e.start).isBefore(moment()) || emptyBookings.length > 0) {
                return;
            } else {
                setOpenSlot(false);
                setOpenEventDetails(true);
                getBookingById(e.id);
                // setEventDetails({
                //     start: moment(e.start).format('t('DATE_FORMAT'), HH:mm'),
                //     end: moment(e.end).format('HH:mm'),
                //     allDay: e.allDay,
                //     label: e.label,
                // });
                setSelectedStart(moment(e.start).format(t('DATE_FORMAT') + ', HH:mm'));
                setSelectedEnd(moment(e.end).add(1, 'minute').format('HH:mm')); // one minute is added because in DATABASE we have like e.q HH:59:59
                // if (booking && booking.id) {
                //     setOpenSlot(true);
                // }
            }
        } else {
            return;
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
            await getTutorUnavailableBookings({
                tutorId: tutorId,
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
            }).unwrap();

            await getTutorAvailability(tutorId).unwrap();
        }
    };

    let unavailability: IBookingTransformed | null = null;
    let pastUnava: IBookingTransformed | null = null;
    const [hasRunThisMinute, setHasRunThisMinute] = useState(false);

    function calculateAndSetMinimumUnavailability() {
        if (!hasRunThisMinute) {
            const currentDate = new Date();

            if (unavailability) {
                // Update start time to the current time
                unavailability.start = new Date(currentDate);
                // Update end time to 3 hours after the start time
                unavailability.end = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

                // Call the function to set the time (I'm assuming you have this function defined elsewhere)
                setminimumUnavailability(unavailability);
            } else {
                // Create the initial unavailability object if it doesn't exist

                unavailability = {
                    start: new Date(currentDate),
                    end: new Date(currentDate.getTime() + 3 * 60 * 60 * 1000),
                    id: uuidv4(),
                    label: 'unavailableHoursBefore',
                    allDay: false,
                };

                setminimumUnavailability(unavailability);
            }

            // FOR GRAYING OUT PAST TIME
            const start = moment(currentDate).startOf('week').toDate();
            if (pastUnava) {
                // Update start time to the current time
                pastUnava.start = new Date(start);

                // Update end time to 3 hours after the start time
                pastUnava.end = new Date(currentDate.getTime());

                // Call the function to set the time (I'm assuming you have this function defined elsewhere)
                setPastUnavailability(pastUnava);
            } else {
                // Create the initial unavailability object if it doesn't exist
                pastUnava = {
                    start: new Date(start),
                    end: currentDate,
                    id: uuidv4(),
                    label: 'unavailablePrevious',
                    allDay: false,
                };

                setPastUnavailability(pastUnava);
            }

            setHasRunThisMinute(true);

            setTimeout(() => {
                setHasRunThisMinute(false);
            }, 60000);
        }
    }

    useEffect(() => {
        if (!hasRunThisMinute) {
            calculateAndSetMinimumUnavailability();
        }
    });

    useEffect(() => {
        calcPosition();
        hideShowHighlight(value);
        setSelectedDateFirstDayOfWeek(value);
    }, [value]);

    const closeAddCardSidebar = () => {
        setSidebarOpen(false);
    };

    useEffect(() => {
        const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
        indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    useEffect(() => {
        if (tutorId) {
            getTutorBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
                tutorId: tutorId,
            });
        }
    }, [value, tutorId]);

    const setSelectedDateFirstDayOfWeek = (date: Date) => {
        if (calculateFirstDayOfWeek(firstDayOfSelectedWeek) != calculateFirstDayOfWeek(date)) setFirstDayOfSelectedWeek(date);
    };

    const calculateFirstDayOfWeek = (date: Date): number => {
        return moment(date).startOf('week').date();
    };

    const isMobile = window.innerWidth < 767;

    function onChangeDate(date: Date) {
        onChange(date);
        setCalChange(!calChange);
    }

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

    const [key, setKey] = useState(Math.random);
    useEffect(() => {
        setKey(Math.random());
    }, []);

    return (
        <MainWrapper key={key}>
            <div className="layout--primary">
                {isLoading ? <LoaderSecondary /> : <></>}
                <ConditionalWrapper condition={!isMobile}>
                    {/* {(isLoading && <LoaderPrimary />) || ( */}

                    <div className={`flex ${isMobile ? 'flex--col' : 'flex--row'} flex--jc--space-between flex--center p-6`}>
                        {/* <Link to={PATHS.SEARCH_TUTORS}>
                            <div>
                                <i className="icon icon--base icon--arrow-left icon--black"></i>
                            </div>
                        </Link> */}
                        <div className={'flex flex--center'}>
                            <div onClick={() => history.goBack()}>
                                <div>
                                    <i className="icon icon--base icon--arrow-left icon--black"></i>
                                </div>
                            </div>
                            <h2 className="type--lg  ml-6">
                                {`${t('MY_BOOKINGS.TITLE')} - ${tutorData.firstName ? tutorData.firstName : ''} ${
                                    tutorData.lastName ? tutorData.lastName : ''
                                }`}
                            </h2>
                        </div>
                        <div className={`flex ${isMobile ? 'flex--col' : 'flex--row'} flex--jc--center flex--center`}>
                            <h1 className={'font__md mr-2'}>{t('MY_PROFILE.GENERAL_AVAILABILITY.TIME_ZONE')}</h1>
                            <TimeZoneSelect
                                className={'z-index-5'}
                                defaultUserZone={timeZoneState.timeZone ? timeZoneState.timeZone : moment.tz.guess()}
                                selectedZone={selectedZone}
                                setSelectedZone={setSelectedZone}
                            />
                        </div>
                    </div>
                    <BigCalendar
                        key={key}
                        className={`${isMobile ? 'card--calendar' : ''}`}
                        localizer={localizer}
                        formats={{
                            timeGutterFormat: 'HH:mm',
                        }}
                        events={mergedPeriods}
                        toolbar={true}
                        date={value}
                        onSelecting={() => true}
                        view={isMobile ? 'day' : 'week'}
                        style={isMobile ? { height: 'unset' } : { height: 'calc(100% - 84px)' }}
                        startAccessor="start"
                        endAccessor="end"
                        components={{
                            week: {
                                header: (date) => CustomHeader(date),
                            },
                            event: (event) => CustomEvent(event),
                            toolbar: () => (isMobile ? <CustomToolbar value={value} onChangeDate={onChangeDate} /> : null),
                        }}
                        //scrollToTime={defaultScrollTime}
                        showMultiDayTimes={true}
                        step={15}
                        timeslots={4}
                        selectable={true}
                        longPressThreshold={50}
                        onSelectSlot={(e) => (userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? slotSelect(e) : null)}
                        onSelectEvent={(e) => (userRole === RoleOptions.Parent || userRole === RoleOptions.Student ? handleSelectedEvent(e) : null)}
                    />
                    {openSlot ? (
                        //creating new booking
                        <ParentCalendarSlots
                            setBookingMessageInfo={setBookingMessageInfo}
                            setShowLessonInfoPopup={setShowBookingSuccessfulModal}
                            clearEmptyBookings={() => setEmptyBookings([])}
                            setSidebarOpen={(e) => setSidebarOpen(e)}
                            start={`${selectedStart}`}
                            end={`${selectedEnd}`}
                            handleClose={(e) => {
                                setOpenSlot(e);
                                getBookingsWithTutor({
                                    tutorId: tutorId,
                                    dateFrom: moment().toISOString(),
                                    dateTo: moment(value).endOf('isoWeek').toISOString(),
                                });
                            }}
                            positionClass={calcModalPosition(positionClass)}
                            tutorId={tutorId}
                            tutorDisabled={tutorData.disabled}
                            topOffset={scrollTopOffset}
                        />
                    ) : openEventDetails ? (
                        //opening booking details
                        !bookingIsLoading &&
                        !bookingIsFetching && (
                            <ParentEventModal
                                eventIsAccepted={booking ? booking.isAccepted : false}
                                bookingStart={booking ? booking.startTime : ''}
                                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
                                tutorName={tutorData.firstName && tutorData.lastName ? tutorData.firstName + ' ' + tutorData.lastName : ''}
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenEventDetails(e)}
                                positionClass={calcModalPosition(positionClass)}
                                openLearnCube={() => setLearnCubeModal(true)}
                                topOffset={scrollTopOffset}
                            />
                        )
                    ) : openUpdateModal ? (
                        <UpdateBooking
                            booking={booking ? booking : null}
                            clearEmptyBookings={() => setEmptyBookings([])}
                            setSidebarOpen={(e: any) => setSidebarOpen(e)}
                            start={`${selectedStart}`}
                            end={`${selectedEnd}`}
                            handleClose={(e: any) => setOpenUpdateModal(e)}
                            positionClass={calcModalPosition(positionClass)}
                            tutorId={tutorId}
                            topOffset={scrollTopOffset}
                        />
                    ) : showBookingSuccessfulModal && bookingMessageInfo ? (
                        <BookingPopupForm
                            setShowPopup={setShowBookingSuccessfulModal}
                            levelId={bookingMessageInfo.levelId}
                            subjectId={bookingMessageInfo.subjectId}
                            tutorId={tutorId}
                            startTime={bookingMessageInfo.startTime}
                        />
                    ) : (
                        <></>
                    )}
                    {/*</div>*/}
                </ConditionalWrapper>

                <div>
                    <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
                        <Calendar
                            locale={i18n.language}
                            onActiveStartDateChange={(e) => {
                                hideShowHighlight(e.activeStartDate);
                            }}
                            onChange={(e: Date) => {
                                // const momentDate = moment(e.getTime()).tz('UTC');
                                // const newDate = momentDate.toDate();

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
                        <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD1.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD1.DESC')} />
                        <InformationCard title={t('MY_BOOKINGS.INFORMATION.CARD2.TITLE')} desc={t('MY_BOOKINGS.INFORMATION.CARD2.DESC')} />
                    </div>

                    {/* needs to be in this place because layout have nth-child selector */}
                    {sidebarOpen ? (
                        <Elements stripe={stripePromise} options={options}>
                            <AddCreditCard sideBarIsOpen={sidebarOpen} closeSidebar={closeAddCardSidebar} />
                        </Elements>
                    ) : (
                        <></>
                    )}
                    {learnCubeModal && currentlyActiveBooking && (
                        <LearnCubeModal bookingInfo={currentlyActiveBooking} handleClose={() => setLearnCubeModal(false)} />
                    )}
                </div>
            </div>
        </MainWrapper>
    );
};

export default TutorBookingsNew;

interface ConditionalWrapperProps {
    condition: boolean;
    children: React.ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({ condition, children }) => {
    if (condition) {
        return <div className={`card--calendar ${condition ? ' card--calendar--height' : ''}`}>{children}</div>;
    }
    return <>{children}</>;
};
