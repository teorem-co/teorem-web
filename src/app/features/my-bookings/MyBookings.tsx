import 'moment/locale/en-gb';

import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { merge, union } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
    Calendar as BigCalendar,
    momentLocalizer,
    SlotInfo,
} from 'react-big-calendar';
import Calendar from 'react-calendar';
import * as Yup from 'yup';

import ExpDateField from '../../components/form/ExpDateField';
import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import { useAppSelector } from '../../hooks';
import ParentCalendarSlots from './components/ParentCalendarSlots';
import ParentEventModal from './components/ParentEventModal';
import UpcomingLessons from './components/UpcomingLessons';
import {
    useLazyGetBookingsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetUpcomingLessonsQuery,
} from './services/bookingService';

interface IBookingTransformed {
    id?: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface IEvent {
    id?: string;
    label: string;
    start: string;
    end: string;
    allDay: boolean;
}

const MyBookings: React.FC = () => {
    const localizer = momentLocalizer(moment);
    const [value, onChange] = useState(new Date());
    const [calChange, setCalChange] = useState<boolean>(false);
    const [openSlot, setOpenSlot] = useState<boolean>(false);
    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [emptyBookings, setEmptybookings] = useState<IBookingTransformed[]>(
        []
    );
    const [eventDetails, setEventDetails] = useState<IEvent>();
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);

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
                    {moment(date.date).format('DD.MM')}
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
    const slotSelect = (e: SlotInfo) => {
        setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
        setSelectedEnd(moment(e.end).format('HH:mm'));
        setOpenSlot(true);
        setOpenEventDetails(false);

        setEmptybookings([
            {
                start: moment(e.start).toDate(),
                end: moment(e.end).toDate(),
                label: 'Book event',
                allDay: false,
            },
        ]);
        return CustomEvent(e.slots);
    };
    const positionClass = moment(selectedStart).format('dddd');

    const initialValues = {
        test: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => handleSubmit(values),
        validateOnBlur: true,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object(),
    });

    const handleSubmit = (values: any) => {
        setSidebarOpen(false);
    };

    const handleSelectedEvent = (e: IBookingTransformed) => {
        setOpenSlot(false);
        setOpenEventDetails(true);
        setEventDetails({
            start: moment(e.start).format('DD/MMMM/YYYY, HH:mm'),
            end: moment(e.end).format('HH:mm'),
            allDay: e.allDay,
            label: e.label,
        });
        setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
        setSelectedEnd(moment(e.end).format('HH:mm'));
    };

    const newBookings = union(bookings, emptyBookings);

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
                            events={bookings ? newBookings : []}
                            toolbar={false}
                            date={value}
                            view="week"
                            style={{ height: 'calc(100% - 84px)' }}
                            startAccessor="start"
                            endAccessor="end"
                            selectable={true}
                            components={{
                                week: {
                                    header: (date) => CustomHeader(date),
                                },
                                event: (event) => CustomEvent(event),
                            }}
                            scrollToTime={defaultScrollTime}
                            showMultiDayTimes={true}
                            onSelectSlot={(e) => slotSelect(e)}
                            step={60}
                            timeslots={1}
                            longPressThreshold={10}
                            onSelectEvent={(e) => handleSelectedEvent(e)}
                        />
                    </div>
                    {openSlot ? (
                        <ParentCalendarSlots
                            setSidebarOpen={(e) => setSidebarOpen(e)}
                            start={`${selectedStart}`}
                            end={`${selectedEnd}`}
                            handleClose={(e) => setOpenSlot(e)}
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
                    ) : openEventDetails ? (
                        <ParentEventModal
                            event={eventDetails ? eventDetails : null}
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
                </div>
                <div>
                    <div className="card card--primary mb-4">
                        <Calendar
                            onChange={(e: Date) => {
                                onChange(e);
                                setCalChange(!calChange);
                            }}
                            value={value}
                            prevLabel={<PrevIcon />}
                            nextLabel={<NextIcon />}
                        />
                    </div>
                    <div className="upcoming-lessons">
                        <UpcomingLessons
                            upcomingLessons={
                                upcomingLessons ? upcomingLessons : []
                            }
                        />
                    </div>
                </div>
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
                                    {/* <div>{JSON.stringify(formikStepTwo.values, null, 2)}</div> */}
                                    <div className="field">
                                        <label
                                            htmlFor="cardFirstName"
                                            className="field__label"
                                        >
                                            {t(
                                                'REGISTER.CARD_DETAILS.FIRST_NAME'
                                            )}
                                        </label>
                                        <TextField
                                            name="cardFirstName"
                                            id="cardFirstName"
                                            placeholder="Enter First Name"
                                            // disabled={isLoading}
                                        />
                                    </div>
                                    <div className="field">
                                        <label
                                            htmlFor="cardLastName"
                                            className="field__label"
                                        >
                                            {t(
                                                'REGISTER.CARD_DETAILS.LAST_NAME'
                                            )}
                                        </label>
                                        <TextField
                                            name="cardLastName"
                                            id="cardLastName"
                                            placeholder="Enter Last Name"
                                            // disabled={isLoading}
                                        />
                                    </div>
                                    <div className="field">
                                        <label
                                            htmlFor="cardNumber"
                                            className="field__label"
                                        >
                                            {t(
                                                'REGISTER.CARD_DETAILS.CARD_NUMBER'
                                            )}
                                        </label>
                                        <TextField
                                            type="number"
                                            name="cardNumber"
                                            id="cardNumber"
                                            placeholder="**** **** **** ****"
                                            // disabled={isLoading}
                                        />
                                    </div>
                                    <div className="field field__file">
                                        <div className="flex">
                                            <div className="field w--100 mr-6">
                                                <label
                                                    htmlFor="expiryDate"
                                                    className="field__label"
                                                >
                                                    {t(
                                                        'REGISTER.CARD_DETAILS.EXPIRY_DATE'
                                                    )}
                                                </label>
                                                <ExpDateField
                                                    name="expiryDate"
                                                    id="expiryDate"
                                                    placeholder="MM / YY"
                                                    // disabled={isLoading}
                                                />
                                            </div>

                                            <div className="field w--100">
                                                <label
                                                    htmlFor="cvv"
                                                    className="field__label"
                                                >
                                                    {t(
                                                        'REGISTER.CARD_DETAILS.CVV'
                                                    )}
                                                </label>
                                                <TextField
                                                    max={3}
                                                    maxLength={3}
                                                    type="number"
                                                    name="cvv"
                                                    id="cvv"
                                                    placeholder="***"
                                                    // disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label
                                            htmlFor="zipCode"
                                            className="field__label"
                                        >
                                            {t(
                                                'REGISTER.CARD_DETAILS.ZIP_CODE'
                                            )}
                                        </label>
                                        <TextField
                                            type="number"
                                            name="zipCode"
                                            id="zipCode"
                                            placeholder="Enter ZIP / Postal Code"
                                            // disabled={isLoading}
                                        />
                                    </div>
                                </Form>
                            </FormikProvider>
                        }
                    />
                ) : (
                    <></>
                )}
            </div>
        </MainWrapper>
    );
};

export default MyBookings;
