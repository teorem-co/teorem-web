import 'moment/locale/en-gb';

import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router';

import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import OpenTutorCalendarModal from './components/OpenTutorCalendarModal';
import TutorEventModal from './components/TutorEventModal';
import UpcomingLessons from './components/UpcomingLessons';
import {
    useLazyGetBookingByIdQuery,
    useLazyGetBookingsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetUpcomingLessonsQuery,
} from './services/bookingService';

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

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const [value, onChange] = useState(new Date());
    const [calChange, setCalChange] = useState<boolean>(false);
    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });
    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
    const [openTutorCalendarModal, setOpenTutorCalendarModal] = useState<boolean>(false);
    // const [bookingId, setBookingId] = useState<string>('');
    const positionClass = moment(selectedStart).format('dddd');
    const history = useHistory();

    const [getUpcomingLessons, { data: upcomingLessons }] = useLazyGetUpcomingLessonsQuery();

    const [getBookings, { data: bookings }] = useLazyGetBookingsQuery();
    const [getNotificationForLessons, { data: lessonsCount }] = useLazyGetNotificationForLessonsQuery();

    const [getBookingById, { data: booking, isSuccess: getBookingByIdSuccess }] = useLazyGetBookingByIdQuery();

    const userId = useAppSelector((state) => state.auth.user?.id);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

    useEffect(() => {
        if (userId) {
            getUpcomingLessons(userId);
        }
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
        }
    }, [value, userId]);

    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">{moment(date.date).format('DD/MMM')}</div>
            </>
        );
    };
    useEffect(() => {
        const indicator: any = document.getElementsByClassName('rbc-current-time-indicator');
        indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] && indicator[0].setAttribute('data-time', moment().format('HH:mm'));
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    const CustomEvent = (event: any) => {
        if (userRole === RoleOptions.Tutor) {
            return (
                <>
                    <div className="mb-2">{moment(event.event.start).format('HH:mm')}</div>
                    <div className="type--wgt--bold">{event.event.label}</div>
                </>
            );
        } else {
            return (
                <>
                    <div className="mb-2">{moment(event.event.start).format('HH:mm')}</div>
                    <div className="type--wgt--bold">{event.event.tutor}</div>
                </>
            );
        }
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    const handleSelectedEvent = (e: IBookingTransformed) => {
        if (userRole === RoleOptions.Tutor) {
            getBookingById(e.id);
            setOpenEventDetails(true);
            setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
            setSelectedEnd(moment(e.end).format('HH:mm'));
        } else if (userRole === RoleOptions.Parent || userRole === RoleOptions.Student) {
            getBookingById(e.id);
            setOpenTutorCalendarModal(true);
            setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
            setSelectedEnd(moment(e.end).format('HH:mm'));
        }
    };

    const goToTutorCalendar = () => {
        history.push(`/search-tutors/bookings/${booking?.tutorId}`);
    };

    const highlightRef = useRef<HTMLDivElement>(null);
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

    const tileRef = useRef<HTMLDivElement>(null);
    const tileElement = tileRef.current as HTMLDivElement;

    const hideShowHighlight = (date: Date) => {
        if (tileElement) {
            if (moment(date).isSame(value, 'month')) {
                tileElement.style.display = 'block';
            } else {
                tileElement.style.display = 'none';
            }
        }
    };

    useEffect(() => {
        calcPosition();
        hideShowHighlight(value);
    }, [value]);

    return (
        <MainWrapper>
            <div className="layout--primary">
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
                            localizer={localizer}
                            formats={{
                                timeGutterFormat: 'HH:mm',
                            }}
                            events={bookings ? bookings : []}
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
                            step={10}
                            timeslots={6}
                            longPressThreshold={10}
                            onSelectEvent={(e) => handleSelectedEvent(e)}
                        />
                        {openEventDetails ? (
                            <TutorEventModal
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenEventDetails(e)}
                                positionClass={`${
                                    positionClass === 'Monday'
                                        ? 'monday'
                                        : positionClass === 'Tuesday'
                                        ? 'tuesday'
                                        : positionClass === 'Wednesday'
                                        ? 'wednesday'
                                        : positionClass === 'Thursday'
                                        ? 'thursday'
                                        : positionClass === 'Friday'
                                        ? 'friday'
                                        : positionClass === 'Saturday'
                                        ? 'saturday'
                                        : 'sunday'
                                }`}
                            />
                        ) : (
                            <></>
                        )}
                        {openTutorCalendarModal ? (
                            <OpenTutorCalendarModal
                                goToTutorCalendar={() => goToTutorCalendar()}
                                event={booking ? booking : null}
                                handleClose={(e) => setOpenTutorCalendarModal(e)}
                                positionClass={`${
                                    positionClass === 'Monday'
                                        ? 'monday'
                                        : positionClass === 'Tuesday'
                                        ? 'tuesday'
                                        : positionClass === 'Wednesday'
                                        ? 'wednesday'
                                        : positionClass === 'Thursday'
                                        ? 'thursday'
                                        : positionClass === 'Friday'
                                        ? 'friday'
                                        : positionClass === 'Saturday'
                                        ? 'saturday'
                                        : 'sunday'
                                }`}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div>
                    <div ref={highlightRef} className="card card--mini-calendar mb-4 pos--rel">
                        <Calendar
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
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
