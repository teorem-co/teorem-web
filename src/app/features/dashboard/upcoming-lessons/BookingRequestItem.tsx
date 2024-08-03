import { t } from 'i18next';
import moment from 'moment/moment';
import React, { useState } from 'react';
import UpdateBooking from '../../my-bookings/components/UpdateBooking';
import { Tooltip } from 'react-tooltip';
import IBooking from '../../../types/IBooking';

interface Props {
    booking: IBooking;
    handleAccept: (id: string) => void;
    handleDeny: (id: string) => void;
    fetchData: () => void;
    date: string;
}

export const BookingRequestItem = (props: Props) => {
    const { booking, handleAccept, handleDeny, date, fetchData } = props;
    const [showDateSelectModal, setShowDateSelectModal] = useState(false);
    const isMobile = window.innerWidth < 1200;

    function handleReschedule() {
        setShowDateSelectModal(true);
    }

    const tooltipMessage = `${t('DASHBOARD.REQUESTS.TOOLTIP.PART_1')} ${getTimeLeft()} ${t('DASHBOARD.REQUESTS.TOOLTIP.PART_2')}`;

    function getTimeLeft(): string {
        const time = moment.duration(moment(booking.createdAt).add(1, 'day').diff(moment())).hours();
        return '<' + (time + 1);
    }

    return (
        <>
            {isMobile ? (
                <div
                    className=" dashboard__requests__item flex flex--col flex--jc--center flex--ai--center"
                    key={booking.id}
                >
                    <div
                        data-tooltip-id={`new-booking-${booking.id}`}
                        data-tooltip-content={tooltipMessage}
                        data-tooltip-float
                        className={'dashboard-booking-request-parent-mobile'}
                    >
                        <span className="tag tag--success mb-2">
                            {t('DASHBOARD.REQUESTS.STATUS.NEW_BOOKING_DO_ACTION')}
                        </span>
                        <div className="flex flex--row flex--jc--center"></div>
                        <span className={'mb-1'}>
                            {booking.User.firstName}&nbsp;{booking.User.lastName}
                        </span>
                        <div className={''}>
                            <span className=" tag tag--primary">
                                {t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}
                            </span>
                        </div>
                        <div className={'mb-2'}>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
                        <div>
                            {date}&nbsp;@&nbsp;
                            {moment(booking.startTime).format('HH:mm')} -{' '}
                            {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                        </div>
                    </div>
                    <div className={'flex flex--row flex--jc--center flex-gap-1 mt-2'}>
                        <div
                            onClick={() => {
                                handleAccept(booking.id);
                            }}
                        >
                            <i className="icon icon--base icon--check icon--primary"></i>
                        </div>
                        <div
                            onClick={() => {
                                handleDeny(booking.id);
                            }}
                        >
                            <i className="icon icon--base icon--close icon--secondary"></i>
                        </div>
                        <div
                            onClick={() => {
                                handleReschedule();
                            }}
                        >
                            <i className="icon icon--sm icon--reschedule icon--secondary"></i>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dashboard__requests__item tutor-intro-1">
                    <div
                        className={'dashboard-booking-request-parent'}
                        key={booking.id}
                        data-tooltip-id={`new-booking-${booking.id}`}
                        data-tooltip-content={tooltipMessage}
                        data-tooltip-float
                    >
                        <div>
                            <span className="tag tag--success">
                                {t('DASHBOARD.REQUESTS.STATUS.NEW_BOOKING_DO_ACTION')}
                            </span>
                        </div>
                        <div>
                            {booking.User.firstName}&nbsp;{booking.User.lastName}
                        </div>
                        <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
                        <div className={''}>
                            <span className=" tag tag--primary">
                                {t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}
                            </span>
                        </div>
                        <div>
                            {date} @&nbsp;
                            {moment(booking.startTime).format('HH:mm')} -{' '}
                            {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                        </div>
                    </div>
                    <div className={'flex flex--row flex--jc--end flex-gap-1'}>
                        <div
                            onClick={() => {
                                handleAccept(booking.id);
                            }}
                        >
                            <i className="icon icon--base icon--check icon--primary"></i>
                        </div>
                        <div
                            onClick={() => {
                                handleDeny(booking.id);
                            }}
                        >
                            <i className="icon icon--base icon--close icon--secondary"></i>
                        </div>
                        <div
                            onClick={() => {
                                handleReschedule();
                            }}
                        >
                            <i className="icon icon--sm icon--reschedule icon--secondary"></i>
                        </div>
                    </div>
                </div>
            )}
            <Tooltip id={`new-booking-${booking.id}`} place="right-end" />

            {showDateSelectModal && booking && (
                <div className="modal__overlay">
                    <UpdateBooking
                        booking={booking}
                        tutorId={booking.tutorId}
                        start={moment(booking.startTime).format(t('DATE_FORMAT') + ', HH:mm')}
                        end={moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                        handleClose={() => {
                            setShowDateSelectModal(false);
                            fetchData();
                        }}
                        clearEmptyBookings={() => {
                            console.log('clearEmptyBookings');
                        }}
                        positionClass={'modal--center'}
                        setSidebarOpen={() => {
                            console.log('setSidebarOpen');
                        }}
                    />
                </div>
            )}
        </>
    );
};
