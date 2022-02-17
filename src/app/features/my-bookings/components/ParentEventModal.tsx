import moment from 'moment';

import IBooking from '../interfaces/IBooking';

interface IEvent {
    id?: string;
    label: string;
    start: string;
    end: string;
    allDay: boolean;
}

interface IProps {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: IBooking | null;
    tutorName: string;
    openEditModal: () => void;
}

const ParentEventModal: React.FC<IProps> = (props) => {
    const { handleClose, positionClass, event, tutorName, openEditModal } =
        props;

    return (
        <>
            {event ? (
                <div
                    className={`modal--parent modal--parent--${positionClass}`}
                >
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {event.Subject.name}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format(
                                        'DD/MMM/YYYY, HH:mm'
                                    )}{' '}
                                    - {moment(event.endTime).format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                                <i
                                    className="icon icon--base icon--grey icon--edit mr-4"
                                    onClick={openEditModal}
                                ></i>
                                <i className="icon icon--base icon--grey icon--delete mr-4"></i>
                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose
                                            ? handleClose(false)
                                            : false;
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className="modal--parent__line"></div>

                    <div className="modal--parent__body">
                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--tutor icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {tutorName}
                            </div>
                        </div>

                        <div className="flex flex--center mb-4">
                            <i className="icon icon--base icon--subject icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {event.Subject.name} - {event.Level.name}
                            </div>
                        </div>

                        <div className="flex flex--center">
                            <i className="icon icon--base icon--child icon--grey mr-4"></i>
                            <div className="type--color--secondary">
                                {event.User.firstName}
                            </div>
                        </div>
                    </div>
                    <div className="modal--parent__footer mt-6">
                        <button className="btn btn--base btn--primary">
                            Join
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default ParentEventModal;
