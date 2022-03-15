import { t } from 'i18next';
import { groupBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import INotification from '../../../interfaces/notification/INotification';
import ISocketNotification from '../../../interfaces/notification/ISocketNotification';
import { useLazyGetAllUnreadNotificationsQuery, useMarkAllAsReadMutation } from '../../../services/notificationService';
import { useLazyGetDashboardQuery } from '../../../services/userService';
import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import IBooking from '../my-bookings/interfaces/IBooking';
import NotificationItem from '../notifications/components/NotificationItem';

interface IGroupedDashboardData {
    [date: string]: IBooking[];
}

const Dashboard = () => {
    const [getUnreadNotifications, { data: notificationsData }] = useLazyGetAllUnreadNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [getDashboardData] = useLazyGetDashboardQuery();

    const [groupedUpcomming, setGroupedUpcomming] = useState<IGroupedDashboardData>({});
    const [todayScheduled, setTodayScheduled] = useState<IBooking[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const userId = useAppSelector((state) => state.auth.user?.id);
    const serverUrl = `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`;
    const socket = io(serverUrl);
    const history = useHistory();

    const fetchData = async () => {
        await getUnreadNotifications().unwrap();
        const res = await getDashboardData().unwrap();
        const groupedDashboardData: IGroupedDashboardData = groupBy(res.upcoming, (e) => moment(e.startTime).format('DD/MMM/YYYY'));
        setGroupedUpcomming(groupedDashboardData);
        setTodayScheduled(res.todaySchedule);
    };

    const handleNextIndex = () => {
        if (activeIndex < todayScheduled.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrevIndex = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    useEffect(() => {
        fetchData();
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
                            <h2 className="type--wgt--bold type--lg">{t('DASHBOARD.TITLE')}</h2>
                        </div>
                        <div className="card--secondary__body">
                            <div className="row">
                                <div className="col col-12 col-xl-4">
                                    <div className="type--color--tertiary mb-2">{t('DASHBOARD.SCHEDULE.TITLE')}</div>
                                    {todayScheduled.length > 0 ? (
                                        <div className="card--dashboard card--dashboard--brand">
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    {todayScheduled[activeIndex].User.firstName}&nbsp;{todayScheduled[activeIndex].User.lastName}
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn card--dashboard__btn mr-2"
                                                        onClick={() => handlePrevIndex()}
                                                        disabled={activeIndex === 0}
                                                    >
                                                        <i className="icon icon--base icon--chevron-left icon--white"></i>
                                                    </button>
                                                    <button
                                                        className="btn card--dashboard__btn"
                                                        onClick={() => handleNextIndex()}
                                                        disabled={activeIndex === todayScheduled.length - 1}
                                                    >
                                                        <i className="icon icon--base icon--chevron-right icon--white"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card--dashboard__text">
                                                {todayScheduled[activeIndex].Level.name}&nbsp;{todayScheduled[activeIndex].Subject.name}
                                            </div>
                                            <div className="flex--primary">
                                                <div>
                                                    {moment(todayScheduled[activeIndex].startTime).format('HH:mm')} -{' '}
                                                    {moment(todayScheduled[activeIndex].endTime).add(1, 'minute').format('HH:mm')}
                                                </div>
                                                <button className="btn btn--base card--dashboard__btn">{t('DASHBOARD.SCHEDULE.BUTTON')}</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card--dashboard">
                                            <div>{t('DASHBOARD.SCHEDULE.EMPTY')}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="col col-12 col-xl-8">
                                    <div className="type--color--tertiary mb-2">{t('DASHBOARD.MESSAGES.TITLE')}</div>
                                    <div className="card--dashboard">
                                        <div className="flex--primary mb-2">
                                            <div>Elizabeth Betty</div>
                                            <div>
                                                <button className="btn card--dashboard__btn mr-2">
                                                    <i className="icon icon--base icon--chevron-left icon--primary"></i>
                                                </button>
                                                <button className="btn card--dashboard__btn">
                                                    <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card--dashboard__text">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                            industry's stan.
                                        </div>
                                        <div className="flex--primary">
                                            <div className="type--color--secondary">9/Mar/2022</div>
                                            <button className="btn btn--base card--dashboard__btn">{t('DASHBOARD.MESSAGES.BUTTON')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard__list">
                                {Object.keys(groupedUpcomming).map((key: string) => {
                                    return (
                                        <React.Fragment key={key}>
                                            <div className="flex--primary">
                                                <div className="mb-4 mt-6 type--wgt--bold">{key}</div>
                                                <div className="type--color--secondary">
                                                    {t('DASHBOARD.BOOKINGS.TOTAL')}: {groupedUpcomming[key].length}:00h
                                                </div>
                                            </div>
                                            {groupedUpcomming[key].map((item: IBooking) => {
                                                return (
                                                    <div className="dashboard__list__item" key={item.id}>
                                                        <div>
                                                            {item.User.firstName}&nbsp;{item.User.lastName}
                                                        </div>
                                                        <div>{item.User.Role.name}</div>
                                                        <div>
                                                            <span className="tag tag--primary">{item.Subject.name}</span>
                                                        </div>
                                                        <div>
                                                            {moment(item.startTime).format('HH:mm')} - {moment(item.endTime).format('HH:mm')}
                                                        </div>
                                                        <div onClick={() => history.push(PATHS.MY_BOOKINGS)}>
                                                            <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow--auto">
                    <div className="flex--primary mb-2">
                        <div className="type--color--tertiary">{t('DASHBOARD.NOTIFICATIONS.TITLE')}</div>
                        {notificationsData && notificationsData.length > 0 && (
                            <div className="type--color--brand type--wgt--bold cur--pointer" onClick={() => markAllAsRead()}>
                                {t('DASHBOARD.NOTIFICATIONS.CLEAR')}
                            </div>
                        )}
                    </div>
                    {notificationsData && notificationsData.find((x) => x.isRead === false) ? (
                        notificationsData.map((notification: INotification) => {
                            if (!notification.isRead) {
                                return <NotificationItem key={notification.id} notificationData={notification} />;
                            }
                        })
                    ) : (
                        <div className="card--primary card--primary--shadow">{t('DASHBOARD.NOTIFICATIONS.EMPTY')}</div>
                    )}
                    <div className="type--center mt-4">
                        <Link to={PATHS.NOTIFICATIONS} className="btn btn--clear">
                            {t('DASHBOARD.NOTIFICATIONS.ALL')}
                        </Link>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Dashboard;
