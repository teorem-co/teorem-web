import { t } from 'i18next';
import moment from 'moment';

import toastService from '../../../services/toastService';
import {
  useDeleteTutorUnavailabilityMutation,
} from '../services/unavailabilityService';

interface Props {
    handleClose?: (close: boolean) => void;
    positionClass: string;
    event: { startTime: Date; endTime: Date; id: string } | null;
}

const UnavailabilityEditModal: React.FC<Props> = (props) => {
    const { handleClose, positionClass, event } = props;

    const [deleteUnavailability] = useDeleteTutorUnavailabilityMutation();

    const handleDelete = async () => {
        if (event) {
            await deleteUnavailability(event.id).unwrap();
            toastService.success('Selected unavailability is deleted');
        }
    };

    return (
        <>
            {event ? (
                <div className={`modal--parent modal--parent--${positionClass}`}>
                    <div className="modal--parent__header">
                        <div className="flex flex--primary">
                            <div>
                                <div className="type--wgt--bold type--md mb-1">
                                    {/* {event.Subject.name} */}
                                    {t('MY_BOOKINGS.UNAVAILABILITY')}
                                </div>
                                <div className="type--color--secondary">
                                    {moment(event.startTime).format('DD MMM YYYY, HH:mm')} - {moment(event.endTime).add(1, 'minutes').format('HH:mm')}
                                </div>
                            </div>
                            <div className="mb-6">
                                {!moment(event.startTime).isBefore(moment()) && (
                                    <i className="icon icon--base icon--grey icon--delete d--ib mr-2" onClick={() => handleDelete()}></i>
                                )}

                                <i
                                    className="icon icon--base icon--grey icon--close"
                                    onClick={() => {
                                        handleClose ? handleClose(false) : false;
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default UnavailabilityEditModal;
