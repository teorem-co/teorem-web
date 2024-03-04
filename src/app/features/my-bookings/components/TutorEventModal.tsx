import { t } from 'i18next';
import moment from 'moment';

import IBooking from '../interfaces/IBooking';
import { useAcceptBookingMutation, useDeleteBookingMutation } from '../services/bookingService';
import { Tooltip } from 'react-tooltip';
import React, { useState } from 'react';
import { ConfirmationModal } from '../../../components/ConfirmationModal';

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
    topOffset?: number;
    openEditModal: (isOpen: boolean) => void;
}

const TutorEventModal: React.FC<IProps> = (props) => {
    const ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING = 5;
    const { topOffset, handleClose, positionClass, event, openLearnCube, openEditModal } = props;
    const [acceptBooking] = useAcceptBookingMutation();
    const [deleteBooking] = useDeleteBookingMutation();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDeleteBooking = () => {
        if (event) {
            deleteBooking(event.id);
            handleClose ? handleClose(false) : false;
        }
    };

    const handleAcceptBooking = () => {
        acceptBooking(event ? event.id : '');
        handleClose ? handleClose(false) : false;
    };

    function isJoinButtonDisabled(event: IBooking) {
        // you can't join more than 5 minutes before start OR after meeting has ended
        return !(
            moment(event.startTime).subtract(ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING, 'minutes').isBefore(moment()) &&
            moment(event.endTime).isAfter(moment())
        );
    }

    function dismissCancelBooking() {
        setShowConfirmModal(false);
    }

    const isMobile = window.innerWidth < 776;
    const mobileStyles = isMobile ? { top: `${topOffset}px` } : {};

    return (
        <>
            {event ? (
                <div style={mobileStyles} className={`modal--parent  modal--parent--${isMobile ? '' : positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {(event.User && (
                                        <>
                                            {event.User.firstName} {event.User.lastName}
                                        </>
                                    )) ||
                                        t('MY_BOOKINGS.MODAL.DELETED_USER')}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format(t('DATE_FORMAT') + ', HH:mm')} -{' '}
                                    {moment(event.endTime).add(1, 'minutes').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {t(`SUBJECTS.${event.Subject.abrv.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
                                &nbsp;-&nbsp;
                                {t(`LEVELS.${event.Level.abrv.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
                            </div>
                        </div>

                        <div className="flex flex--center">
                            <i className={`icon icon--base icon--${event.User?.parentId ? 'child' : 'profile'} icon--grey mr-4`}></i>
                            <div className="type--color--secondary">
                                {(event.studentId && (
                                    <>
                                        {event.User?.firstName} {event.User?.lastName}
                                    </>
                                )) ||
                                    t('MY_BOOKINGS.MODAL.DELETED_USER')}
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__footer mt-6">
                        <Tooltip
                            id="join-meeting-button"
                            place={'top-end'}
                            float={true}
                            positionStrategy={'absolute'}
                            closeOnEsc={true}
                            delayShow={500}
                            // style={{ zIndex: 9, fontSize:'14px'}}
                            style={{ color: 'white', fontSize: 'smaller' }}
                        />

                        {event.isAccepted && (
                            <button
                                id="join-meeting-button"
                                data-tip="Click to view invoice"
                                data-tooltip-id="join-meeting-button"
                                data-tooltip-html={`<div>${t('BOOK.JOIN_TOOLTIP')}</div>`}
                                disabled={isJoinButtonDisabled(event)}
                                className="btn btn--base type--wgt--extra-bold btn--primary"
                                onClick={() => openLearnCube && openLearnCube()}
                            >
                                {t('BOOK.JOIN')}
                            </button>
                        )}

                        {!event.isAccepted ? (
                            <button className="btn btn--base btn--primary type--wgt--extra-bold" onClick={() => handleAcceptBooking()}>
                                {t('MY_BOOKINGS.MODAL.ACCEPT')}
                            </button>
                        ) : (
                            <></>
                        )}

                        {moment(event.startTime).isAfter(moment()) && (
                            <p
                                className={'text-align--center mt-2 cur--pointer scale-hover type--color--secondary change-color-hover--primary'}
                                onClick={() => openEditModal(true)}
                            >
                                {event.isAccepted ? t('BOOK.FORM.EDIT_OR_CANCEL_BOOKING') : t('BOOK.FORM.EDIT_OR_DENY_BOOKING')}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
            {showConfirmModal && (
                <ConfirmationModal
                    title={t('MY_BOOKINGS.MODAL.CONFIRM_CANCEL_TITLE')}
                    confirmButtonTitle={t('BOOK.FORM.CANCEL_BOOKING')}
                    cancelButtonTitle={t('BOOK.FORM.DISMISS')}
                    onConfirm={handleDeleteBooking}
                    onCancel={dismissCancelBooking}
                />
            )}
        </>
    );
};

export default TutorEventModal;
