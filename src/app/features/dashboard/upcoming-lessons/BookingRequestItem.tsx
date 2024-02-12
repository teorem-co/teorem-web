import { t } from 'i18next';
import moment from 'moment/moment';
import React, { useState } from 'react';
import IBooking from '../../my-bookings/interfaces/IBooking';
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
    const [showDateSelectModal, setShowDateSelectModal] = useState(false);
    const isMobile = window.innerWidth < 1200;

    function handleReschedule() {
        setShowDateSelectModal(true);
    }

    return (
        <>
            {isMobile ? (
                <div className=" dashboard__requests__item flex flex--col flex--jc--center flex--ai--center" key={booking.id}>
                    <div
                        data-tooltip-id={`accept-reschedule-${booking.id}`}
                        data-tooltip-content={'Druga strana je zatrazila izmjenu. Imate još XXXX sati da prihvatite.'}
                        data-tooltip-float
                        className={'dashboard-booking-request-parent-mobile'}
                    >
                        <span className="tag tag--success mb-2">{t('DASHBOARD.REQUESTS.STATUS.NEW_BOOKING_DO_ACTION')}</span>

                        <div className="flex flex--row flex--jc--center"></div>
                        <span className={'mb-1'}>
                            {booking.User.firstName}&nbsp;{booking.User.lastName}
                        </span>
                        <div className={''}>
                            <span className=" tag tag--primary">{t(`SUBJECTS.${booking.Subject.abrv.replaceAll('-', '')}`)}</span>
                        </div>
                        <div className={'mb-2'}>{t(`LEVELS.${booking.Level.abrv.toLowerCase().replace('-', '')}`)}</div>

                        <div>
                            {date} @&nbsp;
                            {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).add(1, 'minute').format('HH:mm')}
                        </div>
                    </div>
                    <div className={'flex flex--row flex--jc--center flex-gap-1 mt-2'}>
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
            ) : (
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
            )}

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
