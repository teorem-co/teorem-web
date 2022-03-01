import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import INotification from '../../../interfaces/notification/INotification';
import ISocketNotification from '../../../interfaces/notification/ISocketNotification';
import { useLazyGetAllUnreadNotificationsQuery, useMarkAllAsReadMutation } from '../../../services/notificationService';
import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import NotificationItem from '../notifications/components/NotificationItem';

const Dashboard = () => {
    const [getUnreadNotifications, { data: notificationsData }] = useLazyGetAllUnreadNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const userId = useAppSelector((state) => state.auth.user?.id);
    const socket = io('http://192.168.11.83:8000');

    useEffect(() => {
        getUnreadNotifications();
    }, []);

    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log(`Connected with id : ${socket.id}`); // true
        // });

        socket.on('showNotification', (notification: ISocketNotification) => {
            if (userId && notification.userId === userId) {
                getUnreadNotifications();
            }
        });

        return function disconnectSocket() {
            socket.disconnect();
        };
    }, []);

    return (
        <MainWrapper>
            <div className="layout--primary">
                <div>
                    <div className="card--secondary card--secondary--alt">
                        <div className="card--secondary__head">
                            <h2 className="type--wgt--bold type--lg">Dashboard</h2>
                        </div>
                    </div>
                </div>
                <div className="overflow--auto">
                    <div className="flex--primary mb-2">
                        <div className="type--color--secondary">NOTIFICATIONS</div>
                        {notificationsData && notificationsData.length > 0 && (
                            <div className="type--color--brand type--wgt--bold cur--pointer" onClick={() => markAllAsRead()}>
                                Clear
                            </div>
                        )}
                    </div>
                    {notificationsData && notificationsData.find((x) => x.isRead === false) ? (
                        notificationsData.map((notification: INotification) => {
                            if (!notification.isRead) {
                                return <NotificationItem notificationData={notification} />;
                            }
                        })
                    ) : (
                        <div className="card--primary card--primary--shadow">There is no unread notifications</div>
                    )}
                    <div className="type--center mt-4">
                        <Link to={PATHS.NOTIFICATIONS} className="btn btn--clear">
                            See all
                        </Link>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Dashboard;
