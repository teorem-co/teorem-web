import { t } from 'i18next';
import { groupBy } from 'lodash';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import note from '../../../assets/images/note.png';
import INotification from '../../../interfaces/notification/INotification';
import ISocketNotification from '../../../interfaces/notification/ISocketNotification';
import { useLazyGetAllUnreadNotificationsQuery, useMarkAllAsReadMutation } from '../../../services/notificationService';
import { useLazyGetDashboardQuery, useLazyGetUserQuery } from '../../../services/userService';
import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import { IChatMessage, IChatRoom, ISendChatMessage, setActiveChatRoom } from '../chat/slices/chatSlice';
import IBooking from '../my-bookings/interfaces/IBooking';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import NotificationItem from '../notifications/components/NotificationItem';

interface IGroupedDashboardData {
    [date: string]: IBooking[];
}

const Dashboard = () => {
    const [getUnreadNotifications, { data: notificationsData }] = useLazyGetAllUnreadNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [getDashboardData] = useLazyGetDashboardQuery();
    const [getUserById0, { data: userDataFirst }] = useLazyGetUserQuery();
    const [getUserById1, { data: userDataSecond }] = useLazyGetUserQuery();

    const [groupedUpcomming, setGroupedUpcomming] = useState<IGroupedDashboardData>({});
    const [todayScheduled, setTodayScheduled] = useState<IBooking[]>([]);
    const [unreadChatrooms, setUnreadChatrooms] = useState<any[]>([]);
    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurentlyActiveBooking] = useState<string>('');
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeMsgIndex, setActiveMsgIndex] = useState<number>(0);

    const userData = useAppSelector((state) => state.user);

    const userId = useAppSelector((state) => state.auth.user?.id);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const chatrooms = useAppSelector((state) => state.chat.chatRooms);
    const socket = useAppSelector((state) => state.chat.socket);
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchData = async () => {
        await getUnreadNotifications().unwrap();
        const res = await getDashboardData().unwrap();
        const groupedDashboardData: IGroupedDashboardData = groupBy(res.upcoming, (e) => moment(e.startTime).format('DD/MM/YYYY'));
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

    const handleNextMsgIndex = () => {
        if (activeMsgIndex < unreadChatrooms.length - 1) {
            setActiveMsgIndex(activeMsgIndex + 1);
        }
    };

    const handlePrevMsgIndex = () => {
        if (activeMsgIndex > 0) {
            setActiveMsgIndex(activeMsgIndex - 1);
        }
    };

    const handleJoinBooking = (event: IBooking) => {
        setCurentlyActiveBooking(event.id);
        setLearnCubeModal(true);
    };

    const handleGoToChat = (activeChatRoom: any) => {
        dispatch(setActiveChatRoom(activeChatRoom));
        history.push(t('PATHS.CHAT'));
    };

    useEffect(() => {
        const tmpCr: any = [];
        chatrooms.forEach(cr => {

            const message = cr.messages[cr.messages.length - 1] || null;

            if (message && !message.message.isRead) {
                const messageText = message.message.message || null;

                if (messageText) {

                    const match = messageText.match(/userInsert=\{(.*?)\}/g);
                    const match2 = messageText.match(/stringTranslate=\{(.*?)\}/g);
                    let hasUserInsert: any = false;

                    if (match)
                        hasUserInsert = messageText.indexOf(match[0]) > - 1;
                    if (match2)
                        hasUserInsert = messageText.indexOf(match2[0]) > - 1;


                    if (hasUserInsert) {
                        getUserById0(message.tutorId);
                        getUserById1(message.userId);
                    }
                }

                tmpCr.push(cr);
            }
        });
        setUnreadChatrooms(tmpCr);
    }, [chatrooms]);

    useEffect(() => {

        if (userDataFirst && userDataSecond) {
            const tmpCr: any = [];
            chatrooms.forEach(cr => {

                let messageText = cr.messages[cr.messages.length - 1].message.message || t('DASHBOARD.MESSAGES.EMPTY');


                let user: any = null;
                let user2: any = null;

                if (userData.user?.id == cr.messages[cr.messages.length - 1].userId) {
                    user = userData;
                    user2 = userDataSecond;
                } else {
                    user = userDataFirst;
                    user2 = userData;
                }

                messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                    return t(token);
                });
                messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {

                    return userData.user?.id == cr.messages[cr.messages.length - 1].userId ? `${user.user.firstName + " " + user.user.lastName}` : `${user2.user.firstName + " " + user2.user.lastName}`;
                });

                const msgList: ISendChatMessage[] = [...cr.messages];

                const chatRoomTem: IChatRoom = {
                    tutor: cr.tutor,
                    user: cr.user,
                    messages: msgList,
                    unreadMessageCount: cr.unreadMessageCount,
                };

                if (cr.messages.length) {

                    const popped = msgList.pop();

                    if (popped)
                        msgList.push({
                            userId: popped.userId,
                            tutorId: popped.tutorId,
                            senderId: popped.senderId,
                            message: {
                                messageId: popped.message.messageId,
                                messageNew: popped.message.messageNew,
                                message: messageText,
                                createdAt: popped.message.createdAt,
                                isRead: popped.message.isRead,
                                isFile: popped.message.isFile,
                            }
                        });

                }


                cr.unreadMessageCount && tmpCr.push(chatRoomTem);
            }
            );
            setUnreadChatrooms(tmpCr);
        }
    },
        [chatrooms, userDataFirst, userDataSecond]);

    useEffect(() => {
        fetchData();

        socket.on('showNotification', (notification: ISocketNotification) => {
            if (userId && notification.userId === userId) {
                getUnreadNotifications();
            }
        });
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
                                <div className="col col-12 col-xl-5">
                                    <div className="type--color--tertiary mb-2">{t('DASHBOARD.SCHEDULE.TITLE')}</div>
                                    {todayScheduled.length > 0 ? (
                                        <div className="card--dashboard card--dashboard--brand mb-xl-0 mb-4 h--200--min">
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    {todayScheduled[activeIndex].User.firstName}&nbsp;{todayScheduled[activeIndex].User.lastName}
                                                </div>
                                                <div className="flex--shrink">
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
                                                {t(`LEVELS.${todayScheduled[activeIndex].Level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                                                &nbsp;
                                                {t(`SUBJECTS.${todayScheduled[activeIndex].Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                                            </div>
                                            <div className="flex--primary">
                                                <div>
                                                    {moment(todayScheduled[activeIndex].startTime).format('HH:mm')} -{' '}
                                                    {moment(todayScheduled[activeIndex].endTime).add(1, 'minute').format('HH:mm')}
                                                </div>
                                                {todayScheduled[activeIndex].isAccepted &&
                                                    moment(todayScheduled[activeIndex].startTime).subtract(10, 'minutes').isBefore(moment()) &&
                                                    moment(todayScheduled[activeIndex].startTime).add(60, 'minutes').isAfter(moment()) ? (
                                                    <button
                                                        className="btn btn--base card--dashboard__btn"
                                                        onClick={() => handleJoinBooking(todayScheduled[activeIndex])}
                                                    >
                                                        {t('DASHBOARD.SCHEDULE.BUTTON')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn--base card--dashboard__btn"
                                                        style={{ visibility: 'hidden' }}
                                                    >
                                                        {t('DASHBOARD.SCHEDULE.BUTTON')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card--dashboard card--dashboard--brand mb-xl-0 mb-4 h--200--min">
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    <div>{t('DASHBOARD.SCHEDULE.EMPTY')}</div>
                                                </div>
                                                <div className="flex--shrink">
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
                                        </div>
                                    )}
                                </div>
                                <div className="col col-12 col-xl-7">
                                    <div className="type--color--tertiary mb-2">{t('DASHBOARD.MESSAGES.TITLE')}</div>

                                    {unreadChatrooms[activeMsgIndex] != undefined ? (
                                        <div className="card--dashboard h--200--min">
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    {userRole === RoleOptions.Tutor ?
                                                        unreadChatrooms[activeMsgIndex].user.userNickname :
                                                        unreadChatrooms[activeMsgIndex].tutor.userNickname
                                                    }
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn card--dashboard__btn mr-2"
                                                        onClick={() => handlePrevMsgIndex()}
                                                        disabled={activeMsgIndex === 0}
                                                    >
                                                        <i className="icon icon--base icon--chevron-left icon--primary"></i>
                                                    </button>
                                                    <button
                                                        className="btn card--dashboard__btn"
                                                        onClick={() => handleNextMsgIndex()}
                                                        disabled={activeMsgIndex === unreadChatrooms.length - 1}
                                                    >
                                                        <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="card--dashboard__text card--dashboard__text--ellipsis"
                                                dangerouslySetInnerHTML={{
                                                    __html: (unreadChatrooms[activeMsgIndex].messages[unreadChatrooms[activeMsgIndex].messages.length - 1]?.isFile ?
                                                        '<i class="icon--attachment chat-file-icon"></i>' : '') + unreadChatrooms[activeMsgIndex].messages[unreadChatrooms[activeMsgIndex].messages.length - 1]?.message?.message
                                                }}
                                            >
                                            </div>
                                            <div className="flex--primary">
                                                <div className="type--color--secondary">
                                                    {moment(unreadChatrooms[activeMsgIndex].messages[unreadChatrooms[activeMsgIndex].messages.length - 1]?.message?.createdAt).format('DD/MMM/yyy')}
                                                </div>
                                                <Link 
                                                    to={PATHS.CHAT}
                                                    className="btn btn--base card--dashboard__btn"
                                                    //onClick={() => handleGoToChat(unreadChatrooms[activeMsgIndex])}
                                                >
                                                    {t('DASHBOARD.MESSAGES.BUTTON')}
                                                </Link>
                                            </div>

                                            {/* <div className="flex--primary mb-2">
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
                                            </div> */}
                                        </div>
                                    ) : (
                                        <div className="card--dashboard h--200--min">
                                            <div className="flex--primary mb-2">
                                                <div>
                                                    {t('DASHBOARD.MESSAGES.EMPTY')}
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn card--dashboard__btn mr-2"
                                                        onClick={() => handlePrevMsgIndex()}
                                                        disabled={activeMsgIndex === 0}
                                                    >
                                                        <i className="icon icon--base icon--chevron-left icon--primary"></i>
                                                    </button>
                                                    <button
                                                        className="btn card--dashboard__btn"
                                                        onClick={() => handleNextMsgIndex()}
                                                        disabled={activeMsgIndex === unreadChatrooms.length - 1}
                                                    >
                                                        <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="dashboard__list">
                                {groupedUpcomming && Object.keys(groupedUpcomming).length > 0 ? (
                                    Object.keys(groupedUpcomming).map((key: string) => {
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
                                                            <div>{t(`ROLES.${item.User.Role.abrv}`)}</div>
                                                            <div>
                                                                <span className="tag tag--primary">{t(`SUBJECTS.${item.Subject.abrv.replace('-', '')}`)}</span>
                                                            </div>
                                                            <div>
                                                                {moment(item.startTime).format('HH:mm')} -{' '}
                                                                {moment(item.endTime).add(1, 'minute').format('HH:mm')}
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    // history.push(PATHS.MY_BOOKINGS)

                                                                    history.push({
                                                                        pathname: t(PATHS.MY_BOOKINGS),
                                                                        state: { value: new Date(item.startTime).toString() }
                                                                    });
                                                                }
                                                                }>
                                                                <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <div className="tutor-list__no-results mt-30">
                                        <h1 className="tutor-list__no-results__title">
                                            <div>{t('DASHBOARD.BOOKINGS.EMPTY')}</div>
                                        </h1>
                                        <p className="tutor-list__no-results__subtitle">{t('DASHBOARD.BOOKINGS.EMPTY_SUBTITLE')}</p>
                                    </div>
                                )}
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
                        <Link to={t(PATHS.NOTIFICATIONS)} className="btn btn--clear">
                            {t('DASHBOARD.NOTIFICATIONS.ALL')}
                        </Link>
                    </div>
                    {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() => setLearnCubeModal(false)} />}
                </div>
            </div>
        </MainWrapper>
    );
};

export default Dashboard;
