import { t } from 'i18next';
import moment from 'moment';
import React from 'react';

import { RoleOptions } from '../../../store/slices/roleSlice';
import { useAppSelector } from '../../../store/hooks';
import { Tooltip } from 'react-tooltip';
import { ButtonPrimaryGradient } from '../../../components/ButtonPrimaryGradient';
import IBooking from '../../../../types/IBooking';

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
    tutorName: string;
    openEditModal: (isOpen: boolean) => void;
    bookingStart: string;
    eventIsAccepted: boolean;
    topOffset?: number;
}

const ParentEventModal: React.FC<IProps> = (props) => {
    const ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING = 5;
    const {
        topOffset,
        handleClose,
        positionClass,
        event,
        tutorName,
        openEditModal,
        bookingStart,
        eventIsAccepted,
        openLearnCube,
    } = props;
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);

    function isJoinButtonDisabled(event: IBooking) {
        // you can't join more than 5 minutes before start OR after meeting has ended
        return !(
            moment(bookingStart).subtract(ALLOWED_MINUTES_TO_JOIN_BEFORE_MEETING, 'minutes').isBefore(moment()) &&
            moment(event.endTime).isAfter(moment())
        );
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
                                    {t(
                                        `SUBJECTS.${event.Subject.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`
                                    )}
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
                                        openEditModal(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--tutor icon--grey mr-4"></i>
                            <div className="type--color--secondary">{tutorName}</div>
                        </div>

                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {t(
                                    `SUBJECTS.${event.Subject.abrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`
                                )}
                                &nbsp;-&nbsp;
                                {t(`LEVELS.${event.Level.name.replaceAll('-', '').replaceAll(' ', '').toLowerCase()}`)}
                            </div>
                        </div>
                        {userRole === RoleOptions.Student ? (
                            <></>
                        ) : (
                            <div className="flex flex--center">
                                <i className="icon icon--base icon--child icon--grey mr-4"></i>
                                <div className="type--color--secondary">{event.userFullName}</div>
                            </div>
                        )}
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
                            <ButtonPrimaryGradient
                                id="join-meeting-button"
                                data-tip="Click to view invoice"
                                data-tooltip-id="join-meeting-button"
                                data-tooltip-html={`<div>${t('BOOK.JOIN_TOOLTIP')}</div>`}
                                disabled={isJoinButtonDisabled(event)}
                                className="btn btn--base type--wgt--extra-bold"
                                onClick={() => openLearnCube && openLearnCube()}
                            >
                                {t('BOOK.JOIN')}
                            </ButtonPrimaryGradient>
                        )}

                        {moment(bookingStart).isAfter(moment()) && (
                            <p
                                className={
                                    'text-align--center mt-2 cur--pointer scale-hover type--color--secondary change-color-hover--primary'
                                }
                                onClick={() => openEditModal(true)}
                            >
                                {t('BOOK.FORM.EDIT_OR_CANCEL_BOOKING')}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default ParentEventModal;
