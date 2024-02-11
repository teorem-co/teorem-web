import { t } from 'i18next';
import moment from 'moment/moment';
import React, { useState } from 'react';
import IBooking from '../../my-bookings/interfaces/IBooking';
import { useDeleteBookingMutation } from '../../my-bookings/services/bookingService';
import UpdateBooking from '../../my-bookings/components/UpdateBooking';

interface Props {
    booking: IBooking;
    handleAccept: (id: string) => void;
    handleDeny: (id: string) => void;
    fetchData: () => void;
    date: string;
}

export const BookingRequestItem = (props: Props) => {
    const { booking, handleAccept, handleDeny, date, fetchData } = props;

    const [showModal, setShowModal] = useState(false);
    const [showDateSelectModal, setShowDateSelectModal] = useState(false);
    const [deleteBooking] = useDeleteBookingMutation();

    function handleReschedule() {
        // alert('Reschedule for booking: ' + booking.id);
        setShowDateSelectModal(true);
    }

    return (
        <>
            <div className="dashboard__requests__item tutor-intro-1" key={booking.id}>
                <div className={'dashboard-booking-request-parent'}>
                    <div>
                        <span className="tag tag--success">{t('DASHBOARD.REQUESTS.STATUS.NEW_BOOKING_DO_ACTION')}</span>
                    </div>
                    <div>
                        {booking.User.firstName}&nbsp;{booking.User.lastName}
                    </div>
                    <div>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>
                    <div className={''}>
                        <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
                    </div>
                    <div>
                        {date} @&nbsp;
                        {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                    </div>
                </div>
                <div className={'flex flex--row flex--jc--end flex-gap-1'}>
                    <div
                        onClick={() => {
                            console.log('handleAccept');
                            handleAccept(booking.id);
                        }}
                    >
                        <i className="icon icon--base icon--check icon--primary"></i>
                    </div>
                    <div
                        onClick={() => {
                            console.log('handleDeny');
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
