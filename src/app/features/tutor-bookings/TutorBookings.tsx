import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { useLazyGetTutorProfileDataQuery } from '../../../services/tutorService';
import MainWrapper from '../../components/MainWrapper';
import { PATHS } from '../../routes';
import { useLazyGetBookingsByIdQuery } from '../my-bookings/services/bookingService';

const TutorBookings = () => {
    const localizer = momentLocalizer(moment);

    const [value, onChange] = useState(new Date());

    const [calChange, setCalChange] = useState<boolean>(false);

    const { tutorId } = useParams();

    const [
        getTutorBookings,
        {
            data: tutorBookings,
            isSuccess: isSuccessBookings,
            isLoading: isLoadingBookings,
        },
    ] = useLazyGetBookingsByIdQuery();

    const [
        getTutorData,
        {
            data: tutorData,
            isSuccess: isSuccessTutorData,
            isLoading: isLoadingTutorData,
        },
    ] = useLazyGetTutorProfileDataQuery({
        selectFromResult: ({ data, isSuccess, isLoading }) => ({
            data: {
                firstName: data?.User.firstName,
                lastName: data?.User.lastName,
            },
            isSuccess,
            isLoading,
        }),
    });

    const { t } = useTranslation();

    const defaultScrollTime = new Date(new Date().setHours(7, 45, 0));

    useEffect(() => {
        if (tutorId) {
            getTutorData(tutorId);
        }
    }, []);

    // useEffect(()=>{
    //     if(isSuccessTutorData && tutorData){

    //     }
    //     //if failed redirect to previous route ?
    // },[isSuccessTutorData])

    useEffect(() => {
        if (tutorId) {
            getTutorBookings({
                dateFrom: moment(value).startOf('isoWeek').toISOString(),
                dateTo: moment(value).endOf('isoWeek').toISOString(),
                tutorId,
            });
        }
    }, [value, tutorId]);

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

    const CustomEvent = (event: any) => {
        const { isAvailable } = event.event;
        return !isAvailable ? (
            <div className="my-bookings--unavailable"></div>
        ) : (
            <div>
                <div className="mb-2 ">
                    {moment(event.event.start).format('HH:mm')}
                </div>
                <div className="type--wgt--bold">{event.event.label}</div>
            </div>
        );
    };

    const PrevIcon = () => {
        return <i className="icon icon--base icon--chevron-left"></i>;
    };
    const NextIcon = () => {
        return <i className="icon icon--base icon--chevron-right"></i>;
    };

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
                                {`${t('MY_BOOKINGS.TITLE')} - ${
                                    tutorData.firstName
                                        ? tutorData.firstName
                                        : ''
                                } ${
                                    tutorData.lastName ? tutorData.lastName : ''
                                }`}
                            </h2>
                        </div>
                        <BigCalendar
                            localizer={localizer}
                            formats={{
                                timeGutterFormat: 'HH:mm',
                            }}
                            events={[]}
                            toolbar={false}
                            date={value}
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
                        />
                    </div>
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
                        {/* <UpcomingLessons
                            upcomingLessons={
                                upcomingLessons ? upcomingLessons : []
                            }
                        /> */}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default TutorBookings;
