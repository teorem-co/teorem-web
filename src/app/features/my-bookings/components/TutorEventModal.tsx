import { t } from 'i18next';
import moment from 'moment';

import IBooking from '../interfaces/IBooking';
import {
  useAcceptBookingMutation,
  useDeleteBookingMutation,
} from '../services/bookingService';

interface IProps {
    handleClose?: (close: boolean) => void;
    openLearnCube?: () => void;
    positionClass: string;
    event: IBooking | null;
}

const TutorEventModal: React.FC<IProps> = (props) => {
    const { handleClose, positionClass, event, openLearnCube } = props;
    const [acceptBooking] = useAcceptBookingMutation();
    const [deleteBooking] = useDeleteBookingMutation();
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
    return (
        <>
            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
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
                                    {moment(event.startTime).format(t('DATE_FORMAT') + ', HH:mm')} - {moment(event.endTime).add(1, 'minutes').format('HH:mm')}
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
                                {t(`SUBJECTS.${event.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)} -
                                {t(`LEVELS.${event.Level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
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
                    <div className="modal--tutor__footer mt-6">
                        {!event.isAccepted ? (
                            <button className="btn btn--base btn--clear type--wgt--extra-bold" onClick={() => handleAcceptBooking()}>
                                {t('MY_BOOKINGS.MODAL.ACCEPT')}
                            </button>
                        ) : (
                            <></>
                        )}
                        {moment(event.startTime).subtract(10, 'minutes').isBefore(moment()) ? (
                            <></>
                        ) : (
                            <>
                                <button className="btn btn--base btn--clear type--wgt--extra-bold" onClick={() => handleDeleteBooking()}>
                                    {event.isAccepted ? t('MY_BOOKINGS.MODAL.DELETE') : t('MY_BOOKINGS.MODAL.DENY')}
                                </button>

                                {/*
                                //COMING SOON
                                <button className="btn btn--base btn--clear type--wgt--extra-bold">{t('MY_BOOKINGS.MODAL.PROPOSE')}</button> */}
                            </>
                        )}
                        {event.isAccepted
                            &&
                           // moment(event.startTime).subtract(10, 'minutes').isBefore(moment()) &&
                           // moment(event.endTime).isAfter(moment()) &&

                            (
                                <button className="btn btn--base btn--primary" onClick={() => openLearnCube && openLearnCube()}>
                                    {t('BOOK.JOIN')}
                                </button>
                            )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default TutorEventModal;
