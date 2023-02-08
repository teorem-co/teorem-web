import 'moment/locale/en-gb';

import i18n, { t } from 'i18next';
import { slice } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderSecondary from '../../components/skeleton-loaders/LoaderSecondary';
import languageOptions from '../../constants/languageOptions';
import { useAppSelector } from '../../hooks';
import { calcModalPosition } from '../../utils/calcModalPosition';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import OpenTutorCalendarModal from './components/OpenTutorCalendarModal';
import TutorEventModal from './components/TutorEventModal';
import UnavailabilityEditModal from './components/UnavailabilityEditModal';
import UnavailabilityModal from './components/UnavailabilityModal';
import UpcomingLessons from './components/UpcomingLessons';
import {
    useLazyGetBookingByIdQuery,
    useLazyGetBookingsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetUpcomingLessonsQuery,
} from './services/bookingService';
import { useLazyGetUnavailableBookingsQuery } from './services/unavailabilityService';


i18n.language !== 'en' && Array.from(languageOptions.map((l) => l.path)).includes(i18n.language) && require(`moment/locale/${i18n.language}.js`);

interface ICoords {
    x: number;
    y: number;
}

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    // tutorId?: string;
}

const MyBookings: React.FC = (props: any) => {
    const [getBookings, { data: bookings, isLoading: bookingsLoading }] = useLazyGetBookingsQuery();
    const [getNotificationForLessons, { data: lessonsCount }] = useLazyGetNotificationForLessonsQuery();
    const [getBookingById, { data: booking }] = useLazyGetBookingByIdQuery();
    const [getUpcomingLessons, { data: upcomingLessons }] = useLazyGetUpcomingLessonsQuery();
    const [getTutorUnavailableBookings, { data: unavailableBookings, isLoading: unavailableBookingsLoading }] = useLazyGetUnavailableBookingsQuery();

    const [openUnavailabilityModal, setOpenUnavailabilityModal] = useState(false);
    const [openUnavailabilityEditModal, setOpenUnavailabilityEditModal] = useState(false);
    const [unavailableCurrentEvent, setUnavailableCurrentEvent] = useState<IBookingTransformed[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedUnavailability, setSelectedUnavailability] = useState<string>('');
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
    const [openTutorCalendarModal, setOpenTutorCalendarModal] = useState<boolean>(false);
    const location = useLocation();
    const [value, onChange] = useState(location.state ? new Date(location.state.value) : new Date());
    const [calChange, setCalChange] = useState<boolean>(false);
    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<string>('');
    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });

    const history = useHistory();
    const localizer = momentLocalizer(moment);
    const positionClass = moment(selectedStart).format('dddd');
    const unavailablePositionClass = moment(selectedSlot).format('dddd');
    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));
    const highlightRef = useRef<HTMLDivElement>(null);
    const tileRef = useRef<HTMLDivElement>(null);
    const tileElement = tileRef.current as HTMLDivElement;
    const userId = useAppSelector((state) => state.auth.user?.id);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const allBookings = bookings?.concat(unavailableBookings ? unavailableBookings : []);
    const isLoading = bookingsLoading || unavailableBookingsLoading;

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="type--capitalize mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary type--capitalize">{moment(date.date).format('DD MMM').replace('.', '')}</div>
            </>
        );
    };

    const CustomEvent = (event: any) => {
        if (userRole === RoleOptions.Tutor) {
            if (event.event.isAccepted === false) {
                return (
                    <div className="event">
                        {/* <div className="mb-2">{moment(event.event.start).format('HH:mm')}</div> */}
                        <div className="type--wgt--bold">{event.event.label}</div>
                    </div>
                );
            } else if (
                event.event.id === 'currentUnavailableItem' ||
                (unavailableBookings && unavailableBookings.find((x) => x.id === event.event.id))
            ) {
                return (
                    <>
                        <div className="event--unavailable">
                            <div className="type--color--primary type--wgt--bold">{t('MY_BOOKINGS.UNAVAILABLE')}</div>
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div className="event event--pending">
                            <div className="type--wgt--bold">{event.event.label}</div>
                        </div>
                    </>
                );
            }
        } else {
            if (event.event.isAccepted === false) {
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

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };

    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    const handleSelectedEvent = (e: IBookingTransformed) => {
        setCurentlyActiveBooking(e.id);
        if (userRole === RoleOptions.Tutor) {
            if (unavailableCurrentEvent.length > 0) {
                //close createNewUnavailability
                setOpenUnavailabilityModal(false);
                setUnavailableCurrentEvent([]);
                if (e.label === 'Unavailable') {
                    //open unavailability modal
                    setOpenUnavailabilityEditModal(true);
                    setSelectedUnavailability(e.id);
                    setSelectedSlot(e.start);
                    setOpenEventDetails(false);
                } else {
                    setOpenUnavailabilityEditModal(false);
                    getBookingById(e.id);
                    setOpenEventDetails(true);
                    setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
                }
                //return;
            } else {
                if (e.label === 'Unavailable') {
                    //close createNewUnavailability
                    setOpenUnavailabilityModal(false);
                    setUnavailableCurrentEvent([]);
                    //open unavailability modal
                    setOpenUnavailabilityEditModal(true);
                    setSelectedUnavailability(e.id);
                    setSelectedSlot(e.start);
                    setOpenEventDetails(false);
                } else {
                    setOpenUnavailabilityEditModal(false);
                    getBookingById(e.id);
                    setOpenEventDetails(true);
                    setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
                }
            }
        } else if (userRole === RoleOptions.Parent || userRole === RoleOptions.Student || userRole === RoleOptions.Child) {
            if (e.label !== 'Unavailable') {
                getBookingById(e.id);
                setOpenTutorCalendarModal(true);
                setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
            }
        }
    };

    const goToTutorCalendar = () => {
        history.push(`${t('PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS').replace(':tutorSlug', booking?.tutorId || '')}`);
    };

    const handleSelectedSlot = (e: SlotInfo) => {
        if (userRole === RoleOptions.Tutor) {
            setOpenEventDetails(false);
            setOpenUnavailabilityEditModal(false);
            setUnavailableCurrentEvent([
                {
                    id: 'currentUnavailableItem',
                    label: 'unavailable',
                    start: moment(e.start).toDate(),
                    end: moment(e.start).add(1, 'hours').toDate(),
                    allDay: false,
                },
            ]);
            setSelectedSlot(moment(e.start).toDate());
            setOpenUnavailabilityModal(true);
        }
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

    const getCurrentUnavailability = () => {
        const currentUnavailability = (allBookings && allBookings.find((x) => x.id === selectedUnavailability)) || null;

        if (currentUnavailability) {
            return {
                startTime: currentUnavailability.start,
                endTime: currentUnavailability.end,
                id: currentUnavailability.id,
            };
        }
        return null;
    };

    const fetchData = async () => {
        if (userId) {
            await getUpcomingLessons(userId).unwrap();
            if (userRole === RoleOptions.Tutor) {
                await getTutorUnavailableBookings({
                    tutorId: userId,
                    dateFrom: moment(value).startOf('isoWeek').toISOString(),
                    dateTo: moment(value).endOf('isoWeek').toISOString(),
                }).unwrap();
            }
        }
    };

    useEffect(() => {
        calcPosition();
        hideShowHighlight(value);
    }, [value]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (userId) {
            getBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
            });
            getNotificationForLessons({
                userId: userId,
                date: moment().set({ hour: 23, minute: 59, second: 59 }).toISOString(),
            });
            if (userRole === RoleOptions.Tutor) {
                getTutorUnavailableBookings({
                    tutorId: userId,
                    dateFrom: moment(value).startOf('isoWeek').toISOString(),
                    dateTo: moment(value).endOf('isoWeek').toISOString(),
                }).unwrap();
            }
        }
    }, [value, userId]);

    useEffect(() => {
        const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
        indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    return (
        <MainWrapper>
            <div className="layout--primary">
                {isLoading ? <LoaderSecondary /> : <></>}
                <div>
                    <div className="card--calendar">
                        <div className="flex--primary p-6">
                            <h2 className="type--lg">{t('MY_BOOKINGS.TITLE')}</h2>
                            <div className="type--wgt--bold type--color--brand">
                                {t('MY_BOOKINGS.NOTIFICATION_PART_1')}&nbsp;
                                {lessonsCount ?? 0}
                                &nbsp;{t('MY_BOOKINGS.NOTIFICATION_PART_2')}
                            </div>
                        </div>
                        <BigCalendar
                            onSelecting={() => false}
                            localizer={localizer}
                            formats={{
                                timeGutterFormat: 'HH:mm',
                            }}
                            events={allBookings ? allBookings.concat(unavailableCurrentEvent) : []}
                            toolbar={false}
                            date={value}
                            view="week"
                            style={{ height: 'calc(100% - 84px)' }}
                            startAccessor="start"
                            endAccessor="end"
                            // selectable={true}
                            components={{
                                week: {
                                    header: (date) => CustomHeader(date),
                                },
                                event: (event) => CustomEvent(event),
                            }}
                            scrollToTime={defaultScrollTime}
                            showMultiDayTimes={true}
                            selectable={true}
                            step={15}
                            timeslots={4}
                            longPressThreshold={10}
                            onSelectSlot={(e) => handleSelectedSlot(e)}
                            onSelectEvent={(e) => handleSelectedEvent(e)}
                        />
                        {openEventDetails ? (
                            <TutorEventModal
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenEventDetails(e)}
                                positionClass={calcModalPosition(positionClass)}
                                openLearnCube={() => setLearnCubeModal(true)}
                            />
                        ) : (
                            <></>
                        )}
                        {openTutorCalendarModal ? (
                            <OpenTutorCalendarModal
                                goToTutorCalendar={() => goToTutorCalendar()}
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenTutorCalendarModal(e)}
                                positionClass={calcModalPosition(positionClass)}
                                openLearnCube={() => setLearnCubeModal(true)}
                            />
                        ) : (
                            <></>
                        )}
                        {openUnavailabilityModal && (
                            <UnavailabilityModal
                                key={selectedSlot ? selectedSlot.toString() : ''}
                                event={selectedSlot}
                                handleClose={() => {
                                    setOpenUnavailabilityModal(false);
                                    setUnavailableCurrentEvent([]);
                                }}
                                positionClass={calcModalPosition(unavailablePositionClass)}
                            />
                        )}
                        {openUnavailabilityEditModal && (
                            <UnavailabilityEditModal
                                event={getCurrentUnavailability()}
                                handleClose={() => {
                                    setOpenUnavailabilityEditModal(false);
                                    setSelectedUnavailability('');
                                }}
                                positionClass={calcModalPosition(unavailablePositionClass)}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <p className="upcoming-lessons__title">{t('MY_BOOKINGS.CALENDAR.TITLE')}</p>
                    <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
                        <Calendar
                            locale={i18n.language}
                            onActiveStartDateChange={(e) => {
                                hideShowHighlight(e.activeStartDate);
                            }}
                            onChange={(e: Date) => {
                                onChange(e);
                                setCalChange(!calChange);
                                setOpenEventDetails(false);
                                setOpenTutorCalendarModal(false);
                            }}
                            value={value}
                            prevLabel={<PrevIcon />}
                            nextLabel={<NextIcon />}
                            formatMonthYear={(locale: any, date: any) => {
                                return moment(date).format('MMM YYYY')[0].toUpperCase() + moment(date).format('MMM YYYY').slice(1).replace('.', '');
                            }}
                            formatDay={(locale: any, date: any) => {
                                return moment(date).format('D');
                            }}
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
                        <UpcomingLessons upcomingLessons={upcomingLessons ? upcomingLessons : []} />
                    </div>
                    {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() => setLearnCubeModal(false)} />}
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
