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
        let date = description.match(/date=\{(.*?)\}/g)?.toString();
        date = date?.slice(6, date.length - 1);
        date ? 
            history.push({
                pathname: '/my-bookings',
                state: {value: date}
            }) : 
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

                <span className="type--color--secondary">
                    {description.replace(/date=\{(.*?)\}/g, function (match, token) {
                        return moment(new Date(token)).format('HH:mm, DD/MMM/YYYY');
                    })}
                </span>
            </div>
        </div>
    );
};

export default NotificationItem;
