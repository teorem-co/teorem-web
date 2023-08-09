import { t } from 'i18next';
import { debounce, groupBy, orderBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import INotification from '../../../interfaces/notification/INotification';
import {
  useLazyGetAllNotificationsQuery,
} from '../../../services/notificationService';
import MainWrapper from '../../components/MainWrapper';
import LoaderPrimary from '../../components/skeleton-loaders/LoaderPrimary';
import NotificationItem from './components/NotificationItem';
import IGroupedNotifications from './interfaces/IGroupedNotifications';
import IParams from './interfaces/IParams';

const Notifications = () => {
    const [getNotifications, { data: notificationsData, isFetching: notificationsFetching }] = useLazyGetAllNotificationsQuery();

    const [groupedNotifications, setGroupedNotifications] = useState<IGroupedNotifications>({});
    const [loadedNotifications, setLoadedNotifications] = useState<INotification[]>([]);
    const [params, setParams] = useState<IParams>({ page: 1, size: 10, sort:"createdAt", sortDirection:"desc" });

    const history = useHistory();
    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);

    const handleLoadMore = () => {
        let newParams = { ...params };
        newParams = {
            page: params.page + 1,
            size: params.size,
          sort: params.sort,
          sortDirection: params.sortDirection
        };

        setParams(newParams);
    };

    const hideLoadMore = () => {
        let returnValue: boolean = false;
        if (notificationsData) {
            //const totalPages = Math.ceil(notificationsData.count / params.size);
            if (notificationsData.last) returnValue = true;
        }
        return returnValue;
    };

    const handleScroll = (e: HTMLDivElement) => {
        const innerHeight = e.scrollHeight;
        const scrollPosition = e.scrollTop + e.clientHeight;

        if (!hideLoadMore() && innerHeight === scrollPosition) {
            handleLoadMore();
        }
    };

    const fetchData = async (params: IParams) => {
      const res = await getNotifications(params).unwrap();
      setLoadedNotifications(res.content.concat(loadedNotifications));
    };

    const groupNotifications = (notifications: INotification[]) => {
        const sortedRes = orderBy(notifications, ['createdAt'], ['desc']);
        const groupedRes = groupBy(sortedRes, (notification: INotification) => moment(notification['createdAt']).format('DD/MMM/YYYY'));
        setGroupedNotifications(groupedRes);
    };

    useEffect(() => {
        if (loadedNotifications.length > 0) {
            groupNotifications(loadedNotifications);
        }
    }, [loadedNotifications]);

    useEffect(() => {
        fetchData(params);
    }, [params]);

    return (
        <MainWrapper>
            <div className="card--secondary" onScroll={(e: any) => debouncedScrollHandler(e.target)}>
                <div className="card--secondary__head">
                    <div className="flex flex--center">
                        <i className="icon icon--md icon--chevron-left" onClick={() => history.goBack()}></i>
                        <h2 className="type--wgt--bold type--lg ml-4">{t('NOTIFICATIONS.TITLE')}</h2>
                    </div>
                    <div></div>
                </div>
                <div className="card--secondary__body">
                    <div className="notifications">
                        {(Object.keys(groupedNotifications).length === 0 && (
                            <div className="type--center type--md type--wgt--bold">{t('NOTIFICATIONS.EMPTY')}</div>
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
                        <div>{notificationsFetching && <LoaderPrimary />}</div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Notifications;
