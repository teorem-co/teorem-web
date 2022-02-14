import 'moment/locale/en-gb';

import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';
import ReactDOM from 'react-dom';

import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import UpcomingLessons from './components/UpcomingLessons';
import {
    useLazyGetBookingsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetUpcomingLessonsQuery,
} from './services/bookingService';

interface ICoords {
    x: number;
    y: number;
}

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const [value, onChange] = useState(new Date());
    const [calChange, setCalChange] = useState<boolean>(false);
    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });

    const [getUpcomingLessons, { data: upcomingLessons }] =
        useLazyGetUpcomingLessonsQuery();

    const [getBookings, { data: bookings }] = useLazyGetBookingsQuery();
    const [getNotificationForLessons, { data: lessonsCount }] =
        useLazyGetNotificationForLessonsQuery();

    const userId = useAppSelector((state) => state.auth.user?.id);

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
                date: moment()
                    .set({ hour: 23, minute: 59, second: 59 })
                    .toISOString(),
            });
        }
    }, [value, userId]);

    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));

    const CustomHeader = (date: any) => {
        setCalChange(true);
        return (
            <>
                <div className="mb-2">{moment(date.date).format('dddd')}</div>
                <div className="type--color--tertiary">
                    {moment(date.date).format('DD/MMM')}
                </div>
            </>
        );
    };
    useEffect(() => {
        const indicator: any = document.getElementsByClassName(
            'rbc-current-time-indicator'
        );
        indicator[0] &&
            indicator[0].setAttribute('data-time', moment().format('HH:mm'));

        const interval = setInterval(() => {
            indicator[0] &&
                indicator[0].setAttribute(
                    'data-time',
                    moment().format('HH:mm')
                );
        }, 60000);
        return () => clearInterval(interval);
    }, [calChange]);

    const CustomEvent = (event: any) => {
        return (
            <>
                <div className="mb-2">
                    {moment(event.event.start).format('HH:mm')}
                </div>
                <div className="type--wgt--bold">{event.event.label}</div>
            </>
        );
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    // const newBookings = union(bookings, emptyBookings);

    // const rect = ReactDOM.findDOMNode(test) as Element;
    // console.log(rect);

    const highlightRef = useRef<HTMLDivElement>(null);
    const calcPosition = () => {
        const childElement = document.querySelector(
            '.react-calendar__tile--active'
        );
        const rectParent =
            highlightRef.current &&
            highlightRef.current.getBoundingClientRect();
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
                            <h2 className="type--lg">
                                {t('MY_BOOKINGS.TITLE')}
                            </h2>
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
                        />
                    </div>
                </div>
                <div>
                    <div
                        ref={highlightRef}
                        className="card card--mini-calendar mb-4 pos--rel"
                    >
                        <Calendar
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
                        <UpcomingLessons
                            upcomingLessons={
                                upcomingLessons ? upcomingLessons : []
                            }
                        />
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
