import moment from 'moment';

import IBooking from '../interfaces/IBooking';
import { useAcceptBookingMutation, useDeleteBookingMutation } from '../services/bookingService';

interface IProps {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: IBooking | null;
}

const TutorEventModal: React.FC<IProps> = (props) => {
    const { handleClose, positionClass, event } = props;
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
                                        'Deleted user'}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format('DD/MMM/YYYY, HH:mm')} - {moment(event.endTime).format('HH:mm')}
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
                                {event.Subject.name} - {event.Level.name}
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
                                    'Deleted user'}
                            </div>
                        </div>
                    </div>
                    <div className="modal--tutor__footer mt-6">
                        {!event.isAccepted ? (
                            <button className="btn btn--base btn--clear type--wgt--bold" onClick={() => handleAcceptBooking()}>
                                Accept
                            </button>
                        ) : (
                            <></>
                        )}

                        <button className="btn btn--base btn--clear type--wgt--bold" onClick={() => handleDeleteBooking()}>
                            {event.isAccepted ? 'Delete' : 'Deny'}
                        </button>
                        <button className="btn btn--base btn--clear type--wgt--bold">Propose a new time</button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default TutorEventModal;
