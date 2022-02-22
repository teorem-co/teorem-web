import { Form, FormikProvider, useFormik } from 'formik';
import { uniqBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useLazyGetTutorBookingsQuery, useLazyGetTutorProfileDataQuery } from '../../../services/tutorService';
import { RoleOptions } from '../../../slices/roleSlice';
import ExpDateField from '../../components/form/ExpDateField';
import TextField from '../../components/form/TextField';
import MainWrapper from '../../components/MainWrapper';
import Sidebar from '../../components/Sidebar';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import toastService from '../../services/toastService';
import ParentCalendarSlots from '../my-bookings/components/ParentCalendarSlots';
import ParentEventModal from '../my-bookings/components/ParentEventModal';
import UpdateBooking from '../my-bookings/components/UpdateBooking';
import { useLazyGetBookingByIdQuery, useLazyGetBookingsQuery } from '../my-bookings/services/bookingService';

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    userId?: string;
}

interface IEvent {
    id?: string;
    label: string;
    start: string;
    end: string;
    allDay: boolean;
}

interface ICoords {
    x: number;
    y: number;
}

const TutorBookings = () => {
    const localizer = momentLocalizer(moment);

    const [value, onChange] = useState(new Date());
    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [emptyBookings, setEmptybookings] = useState<IBookingTransformed[]>([]);
    const [openSlot, setOpenSlot] = useState<boolean>(false);
    const [eventDetails, setEventDetails] = useState<IEvent>();
    const [openEventDetails, setOpenEventDetails] = useState<boolean>(false);
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);

    const [calChange, setCalChange] = useState<boolean>(false);
    const positionClass = moment(selectedStart).format('dddd');
    const [highlightCoords, setHighlightCoords] = useState<ICoords>({
        x: 0,
        y: 0,
    });

    const userRole = useAppSelector((state) => state.auth.user?.Role?.abrv);
    const userId = useAppSelector((state) => state.auth.user?.id);

    const { tutorId } = useParams();

    const [getTutorBookings, { data: tutorBookings, isSuccess: isSuccessBookings, isLoading: isLoadingBookings }] = useLazyGetTutorBookingsQuery();
    const [getBookings, { data: bookings, isSuccess: isSuccessAllBookings }] = useLazyGetBookingsQuery();

    const [getTutorData, { data: tutorData, isSuccess: isSuccessTutorData, isLoading: isLoadingTutorData }] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                firstName: data?.User.firstName,
                lastName: data?.User.lastName,
            },
            isSuccess,
            isLoading,
        }),
    });
    const [getBookingById, { data: booking, isSuccess: isSuccessGetBookingById }] = useLazyGetBookingByIdQuery();

    const { t } = useTranslation();

    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));

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
            getTutorData(tutorId);
        }
    }, []);

    // useEffect(() => {
    //     if (isSuccessTutorData && tutorData) {
    //     }
    //     //if failed redirect to previous route ?
    // }, [isSuccessTutorData]);

    useEffect(() => {
        if (tutorId) {
            getTutorBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
                tutorId: tutorId,
            });
        }
    }, [value, tutorId]);

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
        if (event.event.userId !== userId) {
            return <div className="my-bookings--unavailable"></div>;
        } else {
            return (
                <div>
                    <div className="mb-2 ">{moment(event.event.start).format('HH:mm')}</div>
                    <div className="type--wgt--bold">{event.event.label}</div>
                </div>
            );
        }
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

    const slotSelect = (e: SlotInfo) => {
        debugger;
        const existingBooking =
            tutorBookings && tutorBookings.filter((date) => moment(date.start).format('YYYY/MM/DD') === moment(e.start).format('YYYY/MM/DD'));

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
        if (flagArr.length === existingBooking?.length) {
            setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
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
        // check whole date not only hours this is a bug
        if (moment(e.start).isBefore(moment()) || emptyBookings.length > 0) {
            return;
        } else {
            setOpenSlot(false);
            setOpenEventDetails(true);
            getBookingById(e.id);
            setEventDetails({
                start: moment(e.start).format('DD/MMMM/YYYY, HH:mm'),
                end: moment(e.end).format('HH:mm'),
                allDay: e.allDay,
                label: e.label,
            });
            setSelectedStart(moment(e.start).format('DD/MMMM/YYYY, HH:mm'));
            setSelectedEnd(moment(e.end).format('HH:mm'));
            // if (booking && booking.id) {
            //     setOpenSlot(true);
            // }
        }
    };

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

    const handleUpdateModal = (isOpen: boolean) => {
        setOpenUpdateModal(isOpen);
        setOpenEventDetails(false);
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

    const allBookings = tutorBookings && tutorBookings.concat(emptyBookings);

    const totalBookings = allBookings && allBookings.concat(bookings ? bookings : []);
    const filteredBookings = uniqBy(totalBookings, 'id');

    return (
        <MainWrapper>
            <div className="layout--primary">
                <div>
                    <div className="card--calendar">
                        <div className="flex flex--center p-6">
                            <Link to={PATHS.SEARCH_TUTORS}>
                                <div>
                                    <i className="icon icon--base icon--arrow-left icon--black"></i>
                                </div>
                            </Link>
                            <h2 className="type--lg  ml-6">
                                {`${t('MY_BOOKINGS.TITLE')} - ${tutorData.firstName ? tutorData.firstName : ''} ${
                                    tutorData.lastName ? tutorData.lastName : ''
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
                            }}
                            scrollToTime={defaultScrollTime}
                            showMultiDayTimes={true}
                            step={10}
                            timeslots={6}
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
                                bookingStart={booking ? booking.startTime : ''}
                                openEditModal={(isOpen) => handleUpdateModal(isOpen)}
                                tutorName={tutorData.firstName && tutorData.lastName ? tutorData.firstName + ' ' + tutorData.lastName : ''}
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
                        ) : openUpdateModal ? (
                            <UpdateBooking
                                booking={booking ? booking : null}
                                clearEmptyBookings={() => setEmptybookings([])}
                                setSidebarOpen={(e: any) => setSidebarOpen(e)}
                                start={`${selectedStart}`}
                                end={`${selectedEnd}`}
                                handleClose={(e: any) => setOpenUpdateModal(e)}
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
                        {/* <UpcomingLessons
                            upcomingLessons={
                                upcomingLessons ? upcomingLessons : []
                            }
                        /> */}
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
                                        {/* <div>{JSON.stringify(formikStepTwo.values, null, 2)}</div> */}
                                        <div className="field">
                                            <label htmlFor="cardFirstName" className="field__label">
                                                {t('REGISTER.CARD_DETAILS.FIRST_NAME')}
                                            </label>
                                            <TextField
                                                name="cardFirstName"
                                                id="cardFirstName"
                                                placeholder="Enter First Name"
                                                // disabled={isLoading}
                                            />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardLastName" className="field__label">
                                                {t('REGISTER.CARD_DETAILS.LAST_NAME')}
                                            </label>
                                            <TextField
                                                name="cardLastName"
                                                id="cardLastName"
                                                placeholder="Enter Last Name"
                                                // disabled={isLoading}
                                            />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardNumber" className="field__label">
                                                {t('REGISTER.CARD_DETAILS.CARD_NUMBER')}
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
                                                    <label htmlFor="expiryDate" className="field__label">
                                                        {t('REGISTER.CARD_DETAILS.EXPIRY_DATE')}
                                                    </label>
                                                    <ExpDateField
                                                        name="expiryDate"
                                                        id="expiryDate"
                                                        placeholder="MM / YY"
                                                        // disabled={isLoading}
                                                    />
                                                </div>

                                                <div className="field w--100">
                                                    <label htmlFor="cvv" className="field__label">
                                                        {t('REGISTER.CARD_DETAILS.CVV')}
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
                                            <label htmlFor="zipCode" className="field__label">
                                                {t('REGISTER.CARD_DETAILS.ZIP_CODE')}
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
            </div>
        </MainWrapper>
    );
};

export default TutorBookings;
