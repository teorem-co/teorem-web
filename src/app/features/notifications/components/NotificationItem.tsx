import moment from 'moment';
import { useHistory } from 'react-router';

import INotification from '../../../../interfaces/notification/INotification';
import { useMarkAsReadMutation } from '../../../../services/notificationService';

interface Props {
    notificationData: INotification;
}

const NotificationItem = (props: Props) => {
    const { createdAt, title, description, isRead, id } = props.notificationData;

    const [markAsRead] = useMarkAsReadMutation();

    const history = useHistory();

    const handleClick = async () => {
        await markAsRead(id).unwrap();
        history.push('/my-bookings');
    };

    return (
        <div className="card--primary card--primary--shadow mb-4 cur--pointer" onClick={() => handleClick()}>
            <div className="flex--primary mb-2">
                <div className="type--wgt--bold">
                    {isRead ? '' : <span className="status--primary status--primary--purple d--ib mr-1" style={{ marginBottom: '1px' }}></span>}
                    {title}
                </div>
                <div className="type--color--tertiary type--sm">{moment(createdAt).format('HH:mm')}</div>
            </div>
            <div>
                {/* <span className="type--color--secondary">Made a booking for</span>
                <span className="type--color--brand">Mathematics @ 13:00, 14/jan/2022.</span> */}

                <span className="type--color--secondary">{description}</span>
            </div>
        </div>
    );
};

export default NotificationItem;
