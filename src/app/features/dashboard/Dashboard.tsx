import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import INotification from '../../../interfaces/notification/INotification';
import { useLazyGetAllNotificationsQuery } from '../../../services/notificationService';
import MainWrapper from '../../components/MainWrapper';
import { PATHS } from '../../routes';
import NotificationItem from '../notifications/components/NotificationItem';

const Dashboard = () => {
    const [getNotifications, { data: notificationsData }] = useLazyGetAllNotificationsQuery();

    useEffect(() => {
        getNotifications();
    }, []);
    useEffect(() => {
        console.log(notificationsData?.length);
    }, [notificationsData]);
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
                        {/* <div className="type--color--brand type--wgt--bold cur--pointer">Clear</div> */}
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
