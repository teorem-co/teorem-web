import { groupBy, orderBy, sortBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import INotification from '../../../interfaces/notification/INotification';
import { useLazyGetAllNotificationsQuery } from '../../../services/notificationService';
import MainWrapper from '../../components/MainWrapper';
import NotificationItem from './components/NotificationItem';
import IGroupedNotifications from './interfaces/IGroupedNotifications';

const Notifications = () => {
    const [getNotifications, { data: notificationsData }] = useLazyGetAllNotificationsQuery();

    const [groupedNotifications, setGroupedNotifications] = useState<IGroupedNotifications>({});

    const history = useHistory();

    const fetchData = async () => {
        const res = await getNotifications().unwrap();
        const sortedRes = orderBy(res, ['createdAt'], ['desc']);
        const groupedRes = groupBy(sortedRes, (notification: INotification) => moment(notification['createdAt']).format('DD/MMM/YYYY'));
        setGroupedNotifications(groupedRes);
    };

    useEffect(() => {
        fetchData();
    }, [notificationsData]);

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <div className="flex flex--center">
                        <i className="icon icon--md icon--chevron-left" onClick={() => history.goBack()}></i>
                        <h2 className="type--wgt--bold type--lg ml-4">Notifications</h2>
                    </div>
                    <div></div>
                </div>
                <div className="card--secondary__body">
                    <div className="notifications">
                        {(Object.keys(groupedNotifications).length === 0 && (
                            <div className="type--center type--md type--wgt--bold">There are no notifications</div>
                        )) ||
                            Object.keys(groupedNotifications).map((date: string) => {
                                return (
                                    <div className="notifications__group">
                                        <div className="notifications__group__date">
                                            <div className="flex flex--center">
                                                <div className="mr-4 type--color--secondary">{date}</div>
                                                <div className="notifications__group__mark"></div>
                                            </div>
                                            <div className="notifications__group__timeline"></div>
                                        </div>
                                        <div className="notifications__group__items">
                                            {groupedNotifications[date].map((notification: INotification) => {
                                                return <NotificationItem notificationData={notification} />;
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Notifications;
