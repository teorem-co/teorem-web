import { t } from 'i18next';
import moment from 'moment';

import { RoleOptions } from '../../../store/slices/roleSlice';
import { useAppSelector } from '../../../store/hooks';
import React, { useState } from 'react';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';
import IBooking from '../../../types/IBooking';

interface IEvent {
    id?: string;
    label: string;
    start: string;
    end: string;
    allDay: boolean;
}

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
    goToTutorCalendar: () => void;
}

const OpenTutorCalendarModal: React.FC<IProps> = (props) => {
    const ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING = 5;
    const { handleClose, positionClass, event, goToTutorCalendar, openLearnCube } = props;

    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const [showInfo, setShowInfo] = useState(false);

    function handleShowInfo() {
        setShowInfo(!showInfo);
    }

    function isJoinButtonDisabled(event: IBooking) {
        // you can't join more than 5 minutes before start OR after meeting has ended
        return !(
            moment(event.startTime).subtract(ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING, 'minutes').isBefore(moment()) &&
            moment(event.endTime).isAfter(moment())
        );
    }

    return (
        <>
            {/*TODO: ovo je komponenta na vlastitom kalendaru*/}

            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {event.Tutor.User.firstName} {event.Tutor.User.lastName}
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
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {t(`SUBJECTS.${event.Subject.abrv}`)} -{' '}
                                {event.Level.name === 'IB (International Baccalaurate)'
                                    ? t('LEVELS.ib')
                                    : t(
                                          `LEVELS.${event.Level.name.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`
                                      )}
                            </div>
                        </div>

                        <div className="flex flex--center">
                            <i className="icon icon--base icon--child icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {event.User.firstName} {event.User.lastName}
                            </div>
                        </div>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        {userRole !== RoleOptions.Child && (
                            <ButtonPrimaryGradient
                                className="btn btn--base type--wgt--extra-bold"
                                onClick={() => goToTutorCalendar()}
                            >
                                {t('MY_BOOKINGS.MODAL.TUTOR_CALENDAR')}
                            </ButtonPrimaryGradient>
                        )}

                        {event.isAccepted && (
                            <ButtonPrimaryGradient
                                disabled={isJoinButtonDisabled(event)}
                                className="btn btn--base mt-4"
                                onClick={() => openLearnCube && openLearnCube()}
                            >
                                {t('BOOK.JOIN')}
                            </ButtonPrimaryGradient>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default OpenTutorCalendarModal;
