import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import INotification, {
  NotificationType,
} from '../../../../interfaces/notification/INotification';
import {
  useMarkAsReadMutation,
} from '../../../../services/notificationService';
import { PATHS } from '../../../routes';

interface Props {
    notificationData: INotification;
}

const NotificationItem = (props: Props) => {

    const { t } = useTranslation();
    const { createdAt, title, description, read, id, type } = props.notificationData;
    const [descriptionData, setDescriptData] = useState<string>(description);
    const [titleData, setTitleData] = useState<string>(title);

    const [markAsRead] = useMarkAsReadMutation();

    const history = useHistory();

    const handleClick = async () => {
        await markAsRead(id).unwrap();

        switch (type) {
            case NotificationType.BOOKING: {
                let date = description.match(/date=\{(.*?)\}/g)?.toString();
                date = date?.slice(6, date.length - 1);
                date ?
                    history.push({
                        pathname: t(PATHS.MY_BOOKINGS),
                        state: { value: date }
                    }) :
                    history.push(t(PATHS.MY_BOOKINGS));
                break;
            }
            case NotificationType.CHAT_MISSED_CALL:
                history.push(t(PATHS.CHAT));
                break;
        };
    };
    useEffect(() => {

        let dat = description.replace(/date=\{(.*?)\}/g, function (match: any, token: any) {
            return moment(new Date(token)).format('HH:mm, '+ t('DATE_FORMAT'));
        });
        dat = dat.replace(/stringTranslate=\{(.*?)\}/g, function (match, token) {
            return t(token);
        });

        const tit = title.replace(/stringTranslate=\{(.*?)\}/g, function (match, token) {
            return t(token);
        });

        setDescriptData(dat);
        setTitleData(tit);
    }, [description]);

    return (
        <div className="card--primary card--primary--shadow mb-4 cur--pointer" onClick={() => handleClick()}>
            <div className="flex--primary mb-2">
                <div className="type--wgt--bold">
                    {read ? '' : <span className="status--primary status--primary--purple d--ib mr-1" style={{ marginBottom: '1px' }}></span>}
                    {titleData}
                </div>
                <div className="type--color--tertiary type--sm">{moment(createdAt).format('HH:mm')}</div>
            </div>
            <div>
                {/* <span className="type--color--secondary">Made a booking for</span>
                <span className="type--color--brand">Mathematics @ 13:00, 14/jan/2022.</span> */}

                <span className="type--color--secondary">
                    {descriptionData}
                </span>
            </div>
        </div>
    );
};

export default NotificationItem;
