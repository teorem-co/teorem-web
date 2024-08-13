import 'intro.js/introjs.css';

import { Form, FormikProvider, useFormik } from 'formik';
import { t } from 'i18next';
import { Steps } from 'intro.js-react';
import { groupBy, isEqual } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import Select, { components, MenuProps } from 'react-select';

import logo from '../../../assets/images/teorem_logo_purple.png';
import { IChild } from '../../types/IChild';
import ISearchParams from '../../types/IParams';
import ITutorItem from '../../types/ITutorItem';
import INotification from '../../types/notification/INotification';
import { useLazyGetTodayScheduleQuery, useLazyGetUpcomingQuery } from '../../store/services/dashboardService';
import { useLazyGetLevelsQuery } from '../../store/services/levelService';
import {
    useLazyGetAllUnreadNotificationsQuery,
    useMarkAllAsReadMutation,
} from '../../store/services/notificationService';
import { useLazyGetSubjectLevelsQuery, useLazyGetSubjectsQuery } from '../../store/services/subjectService';
import { useLazyGetAvailableTutorsQuery, useLazyGetProfileProgressQuery } from '../../store/services/tutorService';
import { useLazyGetChildrenQuery, useLazyGetUserQuery } from '../../store/services/userService';
import { RoleOptions } from '../../store/slices/roleSlice';
import { ISearchFiltersState, resetSearchFilters, setSearchFilters } from '../../store/slices/searchFiltesSlice';
import { ButtonPrimaryGradient } from '../../components/ButtonPrimaryGradient';
import CustomCheckbox from '../../components/form/CustomCheckbox';
import MySelect from '../../components/form/MySelectField';
import ImageCircle from '../../components/ImageCircle';
import MainWrapper from '../../components/MainWrapper';
import NotificationsSidebar from '../../components/NotificationsSidebar';
import LoaderPrimary from '../../components/skeleton-loaders/LoaderPrimary';
import { TutorialModal } from '../../components/TutorialModal';
import { useAppSelector } from '../../store/hooks';
import { ONBOARDING_PATHS, PATHS, PROFILE_PATHS } from '../../routes';
import { useLazyGetTutorTestingLinkQuery } from '../../store/services/hiLinkService';
import toastService from '../../store/services/toastService';
import { IChatRoom, ISendChatMessage, setActiveChatRoomById } from '../chat/slices/chatSlice';
import {
    useAcceptBookingMutation,
    useAcceptRescheduleRequestMutation,
    useDeleteBookingMutation,
    useDenyRescheduleRequestMutation,
    useLazyGetPendingBookingsQuery,
} from '../../store/services/bookingService';
import AddChildSidebar from '../my-profile/components/AddChildSidebar';
import CircularProgress from '../my-profile/components/CircularProgress';
import { HiLinkModalForTutorIntro } from '../my-profile/components/HiLinkModalForTutorIntro';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import { setMyProfileProgress } from '../../store/slices/myProfileSlice';
import NotificationItem from '../notifications/components/NotificationItem';
import { IBookingModalInfo } from '../tutor-bookings/TutorBookings';
import { RecommendedTutorCard } from './components/RecommendedTutorCard';
import { RecommendedTutorCardMobile } from './components/RecommendedTutorCardMobile';
import { BookingRequestItem } from './upcoming-lessons/BookingRequestItem';
import { LessonRescheduleRequestItem } from './upcoming-lessons/LessonRescheduleRequestItem';
import { NotAcceptedLesson } from './upcoming-lessons/NotAcceptedLesson';
import { PendingRescheduleRequestItem } from './upcoming-lessons/PendingRescheduleRequestItem';
import { UpcomingLessonItem } from './upcoming-lessons/UpcomingLessonItem';
import IBooking from '../../types/IBooking';
import ISocketNotification from '../../types/notification/ISocketNotification';
import { useFinishTutorialMutation } from '../../store/services/tutorialService';
import { setTutorialFinished } from '../../store/slices/tutorialSlice';
import useMount from '../../utils/useMount';
import TUTORIAL_REQUEST from '../tutorial/constants/tutorialRequest';
import TUTORIAL_SCHEDULE from '../tutorial/constants/tutorialSchedule';
import OptionType from '../../types/OptionType';
import { Redirect } from 'react-router';

export default function Dashboard() {
    const { subject, level, dayOfWeek, timeOfDay } = useAppSelector((state) => state.searchFilters);
    const [getUnreadNotifications, { data: notificationsData }] = useLazyGetAllUnreadNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [getUserById0, { data: userDataFirst }] = useLazyGetUserQuery();
    const [getUserById1, { data: userDataSecond }] = useLazyGetUserQuery();
    const [getProfileProgress] = useLazyGetProfileProgressQuery();
    const [getUpcoming, { isLoading: upcomingLoading }] = useLazyGetUpcomingQuery();
    const [getTodaySchedule] = useLazyGetTodayScheduleQuery();
    const [acceptRequest] = useAcceptBookingMutation();
    const [denyRequest] = useDeleteBookingMutation();
    const [acceptReschedule] = useAcceptRescheduleRequestMutation();
    const [denyReschedule] = useDenyRescheduleRequestMutation();
    const [getPendingBookings] = useLazyGetPendingBookingsQuery();

    const [getChildren, { data: childrenData, isLoading: childrenLoading, isSuccess: childrenSuccess }] =
        useLazyGetChildrenQuery();
    const [childless, setChildless] = useState(false);

    const [groupedUpcomming, setGroupedUpcoming] = useState<{
        [date: string]: IBooking[];
    }>({});
    // const [groupedRequests, setGroupedRequests] = useState<IGroupedDashboardData>({});
    // const [groupedInRescheduleRequests, setGroupedInRescheduleRequests] = useState<IGroupedDashboardData>({});
    const [groupedPendingBookingsRequests, setGroupedPendingBookingsRequests] = useState<{
        [date: string]: IBooking[];
    }>({});
    const [todayScheduled, setTodayScheduled] = useState<IBooking[]>([]);
    const [unreadChatrooms, setUnreadChatrooms] = useState<any[]>([]);
    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurrentlyActiveBooking] = useState<IBookingModalInfo>();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeMsgIndex, setActiveMsgIndex] = useState<number>(0);
    const { isFinished: isTutorialFinished } = useAppSelector((state) => state.tutorial);
    const [postFinishTutorial] = useFinishTutorialMutation();

    const [childlessModalOpen, setChildlessModalOpen] = useState<boolean>(() => {
        const storedValue = sessionStorage.getItem('myValue');
        return storedValue !== null ? storedValue === 'true' : true;
    });

    useEffect(() => {
        sessionStorage.setItem('myValue', String(childlessModalOpen));
    }, [childlessModalOpen]);

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [childForEdit, setChildForEdit] = useState<IChild | null>(null);
    const [childlessButton, setChildlessButton] = useState(true);

    const userData = useAppSelector((state) => state.user);

    const { user } = useAppSelector((state) => state.auth);
    const {
        id: userId,
        Role: { abrv: userRole },
    } = user || { Role: {} };
    const chatrooms = useAppSelector((state) => state.chat.chatRooms);
    const socket = useAppSelector((state) => state.chat.socket);
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const [getTestingRoomLink] = useLazyGetTutorTestingLinkQuery();
    const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
    const [tutorialStepsOpen, setTutorialStepsOpen] = useState(false);
    const [tutorialRoomLink, setTutorialRoomLink] = useState('');

    const [tutorHiLinkModalActive, setTutorHiLinkModalActive] = useState(false);
    const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
    const [paramsSearch, setParamsSearch] = useState<ISearchParams>({
        rpp: 3,
        page: 0,
    });
    const [resetKey, setResetKey] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState<OptionType[]>([]);
    const [levelOptions, setLevelOptions] = useState<OptionType[]>([]);
    const [getSubjects, { data: subjects, isLoading: isLoadingSubjects }] = useLazyGetSubjectsQuery();
    const [getLevels, { data: levels, isLoading: isLoadingLevels }] = useLazyGetLevelsQuery();

    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            await getUnreadNotifications({
                page: 1,
                size: 10,
                sort: 'createdAt',
                sortDirection: 'desc',
                read: false,
            }).unwrap();
            const upcoming = await getUpcoming().unwrap();
            const groupedDashboardData = groupBy(upcoming, (e) => moment(e.startTime).format(t('DATE_FORMAT')));
            setGroupedUpcoming(groupedDashboardData);

            const todaySchedule = await getTodaySchedule().unwrap();
            setTodayScheduled(todaySchedule);
            const requestedBookings = await getPendingBookings().unwrap();
            const groupedRequestedBookingsRequestData = groupBy(requestedBookings, (e) =>
                moment(e.startTime).format(t('DATE_FORMAT'))
            );
            setGroupedPendingBookingsRequests(groupedRequestedBookingsRequestData);

            let children = [];
            if (userRole === RoleOptions.Parent && userId !== undefined) {
                children = await getChildren(userId).unwrap().then();
            }
            if (!childrenLoading && (children.length === 0 || children.length === undefined)) {
                setChildless(true);
            }
            if (!childrenLoading && (children.length === 0 || children.length === undefined)) {
                setChildless(true);
            }
        } catch (error) {
            console.log(error);
        }
        //TODO: uncomment later when we have picker for timezone
        //const allTimeZones = await getAllTimeZones().then((res) => console.log(res));
    };

    const handleNextIndex = () => {
        if (activeIndex < todayScheduled.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleAccept = async (id: string) => {
        if (id === 'mockRequest') {
            handleIntroAcceptBooking();
            return;
        }
        await acceptRequest(id);
        fetchData();
    };

    const handleDeny = async (id: string) => {
        if (id === 'mockRequest') {
            handleIntroDenyBooking();
            return;
        }
        await denyRequest(id);
        fetchData();
    };

    const handleAcceptReschedule = async (id: string) => {
        await acceptReschedule(id);
        toastService.success(t('RESCHEDULE.ACCEPT'));
        fetchData();
    };

    const handleDenyReschedule = async (id: string) => {
        await denyReschedule(id);

        toastService.success(t('RESCHEDULE.DENIED'));
        fetchData();
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
        if (event.id === 'mockSchedule') {
            setTutorHiLinkModalActive(true);
            return;
        }
        setCurrentlyActiveBooking({
            bookingId: event.id,
            endTime: moment(event.endTime).toISOString(),
        });
        setLearnCubeModal(true);
    };

    const handleGoToChat = (activeChatRoom: IChatRoom) => {
        dispatch(
            setActiveChatRoomById({
                userId: activeChatRoom.user?.userId + '',
                tutorId: activeChatRoom.tutor?.userId + '',
            })
        );
    };

    useMount(() => {
        fetchData();
        getLevels();
        getSubjects();
        getSubjectLevels();
        getProfileProgress()
            .unwrap()
            .then((res) => dispatch(setMyProfileProgress(res)));

        socket.on('showNotification', (notification: ISocketNotification) => {
            if (userId && notification.userId === userId) {
                getUnreadNotifications({
                    page: 1,
                    size: 10,
                    sort: 'createdAt',
                    sortDirection: 'desc',
                    read: false,
                });
            }
        });

        if (!childrenLoading && childrenData?.length === 0) {
            setChildless(true);
        }
    });

    useEffect(() => {
        const tmpCr: any = [];
        chatrooms.forEach((cr) => {
            const message = cr.messages[cr.messages.length - 1] || null;

            if (message && !message.message.isRead && userId != message.senderId) {
                const messageText = message.message.message || null;

                if (messageText) {
                    const match = messageText.match(/userInsert=\{(.*?)\}/g);
                    const match2 = messageText.match(/stringTranslate=\{(.*?)\}/g);
                    let hasUserInsert: any = false;

                    if (match) hasUserInsert = messageText.indexOf(match[0]) > -1;
                    if (match2) hasUserInsert = messageText.indexOf(match2[0]) > -1;

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
            chatrooms.forEach((cr) => {
                const message = cr.messages[cr.messages.length - 1];

                if (message && (message.message.isRead || userId != message.senderId)) return;

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
                    return userData.user?.id == cr.messages[cr.messages.length - 1].userId
                        ? `${user.user.firstName + ' ' + user.user.lastName}`
                        : `${user2.user.firstName + ' ' + user2.user.lastName}`;
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
                            },
                        });
                }

                cr.unreadMessageCount && tmpCr.push(chatRoomTem);
            });
            setUnreadChatrooms(tmpCr);
        }
    }, [chatrooms, userDataFirst, userDataSecond]);

    const closeAddCardSidebar = () => {
        setAddSidebarOpen(false);
    };

    const handleAddNewchild = () => {
        setChildForEdit(null);
        setAddSidebarOpen(true);
        setChildlessButton(false);
    };

    const handleEditChild = (x: IChild) => {
        const childObj: IChild = {
            firstName: x.firstName,
            username: x.username,
            dateOfBirth: x.dateOfBirth,
            password: x.password,
            lastName: x.lastName,
            id: x.id,
        };
        setChildForEdit(childObj);
        setAddSidebarOpen(true);
    };

    const closeModal = () => {
        setChildlessModalOpen(false);
    };

    const tutorSteps = [
        {
            title: t('TUTOR_INTRO.DASHBOARD.STEP1.TITLE'),
            intro: t('TUTOR_INTRO.DASHBOARD.STEP1.BODY'),
            element: '.tutor-intro-1',
        },
        {
            title: t('TUTOR_INTRO.DASHBOARD.STEP2.TITLE'),
            intro: t('TUTOR_INTRO.DASHBOARD.STEP2.BODY'),
            element: '.tutor-intro-4',
        },
    ];

    const studentSteps = [
        {
            title: t('STUDENT_INTRO.DASHBOARD.STEP1.TITLE'),
            intro: t('STUDENT_INTRO.DASHBOARD.STEP1.BODY'),
            element: '.student-intro-1',
        },
        {
            title: t('STUDENT_INTRO.DASHBOARD.STEP2.TITLE'),
            intro: t('STUDENT_INTRO.DASHBOARD.STEP2.BODY'),
            element: '.student-intro-2',
        },
        {
            title: t('STUDENT_INTRO.DASHBOARD.STEP3.TITLE'),
            intro: t('STUDENT_INTRO.DASHBOARD.STEP3.BODY'),
            element: '.student-intro-3',
        },
    ];

    const studentStepsPartial = [
        {
            title: t('STUDENT_INTRO.DASHBOARD.STEP1.TITLE'),
            intro: t('STUDENT_INTRO.DASHBOARD.STEP1.BODY'),
            element: '.student-intro-1',
        },
        {
            title: t('STUDENT_INTRO.DASHBOARD.STEP2.TITLE'),
            intro: t('STUDENT_INTRO.DASHBOARD.STEP2.BODY'),
            element: '.student-intro-2',
        },
    ];

    useEffect(() => {
        if (userRole === RoleOptions.Tutor && profileProgressState.percentage === 100) {
            setTutorialModalOpen(true);
        }
    }, [profileProgressState.percentage, userRole]);

    useEffect(() => {
        if (userRole === RoleOptions.Parent) {
            if (!childrenData) return;
            if (!childrenSuccess) return;

            const sessionValue = sessionStorage.getItem('myValue');
            if (sessionValue === 'false') setTutorialModalOpen(true);
            else if (childrenData && sessionValue === 'true' && childrenData.length > 0) setTutorialModalOpen(true);
        } else if (userRole === RoleOptions.Student) {
            setTutorialModalOpen(true);
        }
    }, [childrenData, userRole, childrenSuccess]);

    const finishTutorial = useCallback(() => {
        if (!user) return;
        postFinishTutorial(user?.id)
            .unwrap()
            .then((res) => dispatch(setTutorialFinished(res.isFinished)));
        setTutorialModalOpen(false);
    }, [dispatch, postFinishTutorial, user]);

    const onTutorialComplete = useCallback(() => {
        if (userRole === RoleOptions.Tutor) handleJoinBooking(TUTORIAL_SCHEDULE); // automatically join meeting
        setTutorialStepsOpen(false);
        finishTutorial();
    }, [finishTutorial, userRole]);

    //always triggers, even on skip
    const onTutorialExit = useCallback(() => {
        setTutorialStepsOpen(false);
        finishTutorial();
    }, [finishTutorial]);

    //initialize data for tutorial
    const startTutorial = async () => {
        document.body.scrollTop = -document.body.scrollHeight;

        if (userRole === RoleOptions.Tutor) {
            getTestingRoomLink()
                .unwrap()
                .then((res: any) => {
                    setTutorialRoomLink(res.meetingUrl);
                });

            const dateKey = moment(new Date()).add(1, 'day').format(t('DATE_FORMAT'));
            const grupedData = {
                [dateKey]: [TUTORIAL_REQUEST],
            };
            setTodayScheduled([TUTORIAL_SCHEDULE]);
            setGroupedPendingBookingsRequests(grupedData);
        }

        setTutorialStepsOpen(true);
        setTutorialModalOpen(false);
    };

    function handleHiLinkModalClose() {
        setTutorHiLinkModalActive(false);
    }

    function handleIntroAcceptBooking() {
        toastService.success('Rezervacija prihvacena');
        //TODO:
        // remove booking from requests
        // add booking to upcoming bookings
        return;
    }

    function handleIntroDenyBooking() {
        toastService.success('Rezervacija odbijena');
        //TODO:
        // remove booking from requests
        return;
    }

    const [getAvailableTutors, { isLoading: isLoadingAvailableTutors, isUninitialized: availableTutorsUninitialized }] =
        useLazyGetAvailableTutorsQuery();

    const [loadedTutorItems, setLoadedTutorItems] = useState<ITutorItem[]>([]);

    useEffect(() => {
        if (userRole !== RoleOptions.Tutor && Object.keys(groupedUpcomming).length <= 0) {
            const params = {
                ...paramsSearch,
            };

            const filters: ISearchFiltersState = {
                subject: formik.values.subject,
                level: formik.values.level,
                dayOfWeek: formik.values.dayOfWeek,
                timeOfDay: formik.values.timeOfDay,
            };

            params.subject = filters.subject;
            params.level = filters.level;
            params.timeOfDay = filters.timeOfDay.join(',');
            params.dayOfWeek = filters.dayOfWeek.join(',');

            dispatch(setSearchFilters(filters));

            getAvailableTutors(params)
                .unwrap()
                .then((res) => {
                    setLoadedTutorItems(res.content);
                });
        }
    }, [paramsSearch]);

    const [dayOfWeekArray, setDayOfWeekArray] = useState<string[]>(dayOfWeek);
    const [timeOfDayArray, setTimeOfDayArray] = useState<string[]>(timeOfDay);

    const handleCustomDayOfWeek = (id: string) => {
        const ifExist = dayOfWeekArray.find((item) => item === id);

        if (ifExist) {
            const filteredList = dayOfWeekArray.filter((item) => item !== id);
            setDayOfWeekArray(filteredList);
        } else {
            setDayOfWeekArray([...dayOfWeekArray, id]);
        }
    };

    const handleCustomTimeOfDay = (id: string) => {
        const ifExist = timeOfDayArray.find((item) => item === id);

        if (ifExist) {
            const filteredList = timeOfDayArray.filter((item) => item !== id);
            setTimeOfDayArray(filteredList);
        } else {
            setTimeOfDayArray([...timeOfDayArray, id]);
        }
    };

    useEffect(() => {
        formik.setFieldValue('dayOfWeek', dayOfWeekArray);
    }, [dayOfWeekArray]);

    useEffect(() => {
        formik.setFieldValue('timeOfDay', timeOfDayArray);
    }, [timeOfDayArray]);

    const CustomMenu = (props: MenuProps) => {
        return (
            <components.Menu className="react-select--availability availability-filter-width" {...props}>
                <div className="align--center">
                    <div className="type--uppercase type--color--tertiary mb-4 ">
                        {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                    </div>

                    <div className="availability-container-time">
                        <CustomCheckbox
                            id="beforeNoon"
                            customChecks={timeOfDayArray}
                            label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.BEFORE_NOON')}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                        <CustomCheckbox
                            customChecks={timeOfDayArray}
                            id="noonToFive"
                            label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.NOON_TO_FIVE')}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                        <CustomCheckbox
                            customChecks={timeOfDayArray}
                            id="afterFive"
                            label={t('SEARCH_TUTORS.AVAILABILITY.TIME_OF_DAY.AFTER_FIVE')}
                            handleCustomCheck={handleCustomTimeOfDay}
                        />
                    </div>
                    <div className="mt-6">
                        <div className="type--uppercase type--color--tertiary mb-4">
                            {t('SEARCH_TUTORS.TUTOR_AVAILABLE')}
                        </div>
                        <div className="availability-container">
                            <CustomCheckbox
                                id="mon"
                                customChecks={dayOfWeekArray}
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.MON')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="tue"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.TUE')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="wed"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.WED')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="thu"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.THU')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="fri"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.FRI')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="sat"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SAT')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                            <CustomCheckbox
                                customChecks={dayOfWeekArray}
                                id="sun"
                                label={t('SEARCH_TUTORS.AVAILABILITY.DAY_OF_WEEK.SUN')}
                                handleCustomCheck={(id: string) => {
                                    handleCustomDayOfWeek(id);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </components.Menu>
        );
    };

    const initialValues = {
        subject: subject,
        level: level,
        dayOfWeek: dayOfWeek,
        timeOfDay: timeOfDay,
    };

    const emptyValues: typeof initialValues = {
        subject: '',
        level: '',
        dayOfWeek: [],
        timeOfDay: [],
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: () => {
            //no submit
        },
    });


     const [getSubjectLevels, { data: subjectLevels, isLoading: isLoadingSubjectLevels }] =
        useLazyGetSubjectLevelsQuery();
    const resetFilterDisabled =
        formik.values.level == '' &&
        formik.values.subject == '' &&
        formik.values.dayOfWeek.length == 0 &&
        formik.values.timeOfDay.length == 0;

    const levelDisabled = !levels || isLoadingLevels || isLoadingSubjectLevels;

    useEffect(() => {
        if (levels) {
            setLevelOptions(levels.filter((l) => l.countryId === user?.countryId));
        }
    }, [levels, user?.countryId]);

    useEffect(() => {
        if (subjects) {
            const selectedLevel = formik.values.level;
            const availableSubjects = subjectLevels
                ?.filter((sl) => (selectedLevel ? sl.levelId === selectedLevel : true))
                .map((sl) => sl.subjectId);
            setSubjectOptions(
                subjects
                    .filter((s) => s.countryId === user?.countryId)
                    .filter((s) => {
                        if (!selectedLevel?.length) return true;
                        return availableSubjects?.includes(s.value);
                    })
                    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
            );
        }
    }, [formik.values.level, subjectLevels, subjects, user?.countryId]);

    useEffect(() => {
        if (formik.values.subject) {
            setParamsSearch({ ...paramsSearch, subject: formik.values.subject });
        }
    }, [formik.values.subject]);

    useEffect(() => {
        if (formik.values.level) {
            setParamsSearch({ ...paramsSearch, level: formik.values.level });
        }
    }, [formik.values.level]);

    useEffect(() => {
        formik.setFieldValue('dayOfWeek', dayOfWeekArray);
    }, [dayOfWeekArray]);

    useEffect(() => {
        formik.setFieldValue('timeOfDay', timeOfDayArray);
    }, [timeOfDayArray]);

    useEffect(() => {
        handleAvailabilityChange();
    }, [formik.values.dayOfWeek, formik.values.timeOfDay]);

    const handleResetFilter = () => {
        //can't delete all params because reset button couldn't affect price sort
        const paramsObj = { ...paramsSearch };
        delete paramsObj.dayOfWeek;
        delete paramsObj.level;
        delete paramsObj.subject;
        delete paramsObj.timeOfDay;
        setParamsSearch(paramsObj);

        setResetKey((prevKey) => !prevKey); // this is used to reset select subject and select lvl components
        setDayOfWeekArray([]);
        setTimeOfDayArray([]);

        dispatch(resetSearchFilters());
        formik.setValues(emptyValues);
    };

    const isMobile = window.innerWidth < 766;

    const handleAvailabilityChange = () => {
        const initialParamsObj: ISearchParams = { ...paramsSearch };
        const paramsObj: ISearchParams = { ...paramsSearch };

        if (formik.values.dayOfWeek.length !== 0) {
            paramsObj.dayOfWeek = formik.values.dayOfWeek.toString();
        } else {
            delete paramsObj.dayOfWeek;
        }
        if (formik.values.timeOfDay.length !== 0) {
            paramsObj.timeOfDay = formik.values.timeOfDay.toString();
        } else {
            delete paramsObj.timeOfDay;
        }

        if (!isEqual(initialParamsObj, paramsObj)) {
            setParamsSearch(paramsObj);
        }
    };

    if (userRole === RoleOptions.Tutor && profileProgressState.percentage !== 100) {
        return <Redirect to={ONBOARDING_PATHS.TUTOR_ONBOARDING} />;
    }

    return (
        <>
            {!isMobile && tutorialModalOpen && userRole !== RoleOptions.Child && !isTutorialFinished ? (
                <TutorialModal
                    title={t('TUTOR_INTRO.MODAL.TITLE')}
                    body={t('TUTOR_INTRO.MODAL.BODY')}
                    skip={finishTutorial}
                    start={startTutorial}
                />
            ) : null}

            {!isMobile && tutorialStepsOpen && !isTutorialFinished ? (
                <Steps
                    enabled
                    steps={
                        userRole === RoleOptions.Tutor
                            ? tutorSteps
                            : Object.keys(groupedUpcomming).length > 0
                              ? studentStepsPartial
                              : studentSteps
                    }
                    initialStep={0}
                    onExit={onTutorialExit}
                    onBeforeExit={onTutorialExit}
                    options={{
                        hidePrev: true,
                        nextLabel: t('TUTOR_INTRO.BUTTON_NEXT'),
                        prevLabel: t('TUTOR_INTRO.BUTTON_PREVIOUS'),
                        doneLabel: t('TUTOR_INTRO.BUTTON_FINISH'),
                        scrollTo: 'element',
                    }}
                    onComplete={onTutorialComplete}
                />
            ) : null}

            {userRole === RoleOptions.Parent && childless && childlessModalOpen ? (
                <div>
                    <img src={logo} alt="logo" className="mt-5 ml-5 signup-logo" />
                    <div className="flex field__w-fit-content align--center flex--center">
                        <div>
                            {/* HEADER */}
                            <div style={{ margin: '40px' }} className="flex">
                                <div className="flex flex--center flex--shrink w--105">
                                    <CircularProgress className="progress-circle ml-1" progressNumber={50} />
                                </div>
                                <div className="flex flex--col flex--jc--center ml-6">
                                    <h4 className="signup-title ml-6 text-align--center">
                                        {t('ADD_CHILD.PART_1')}
                                        <span className="primary-color">{t('ADD_CHILD.PART_2')}</span>
                                    </h4>
                                </div>
                            </div>
                            {(childrenLoading && <LoaderPrimary />) || (
                                <div className="card--profile__section">
                                    <div>
                                        <div className="dash-wrapper dash-wrapper--adaptive">
                                            <div
                                                className="dash-wrapper__item"
                                                style={{ width: '95%' }}
                                                onClick={() => {
                                                    handleAddNewchild();
                                                }}
                                            >
                                                <div className="dash-wrapper__item__element">
                                                    <div className="flex--primary cur--pointer">
                                                        <div>
                                                            <div className="mb-1">{t('ADD_CHILD.TITLE')}</div>
                                                            <div className="type--color--secondary">
                                                                {t('ADD_CHILD.DESCRIPTION')}
                                                            </div>
                                                        </div>
                                                        <i className="icon icon--base icon--plus icon--primary"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            {childrenData
                                                ? childrenData.map((x: IChild) => {
                                                      return (
                                                          <div
                                                              className="dash-wrapper__item"
                                                              key={x.username}
                                                              style={{ width: '100%' }}
                                                              onClick={() => handleEditChild(x)}
                                                          >
                                                              <div className="dash-wrapper__item__element">
                                                                  <div className="flex--primary cur--pointer">
                                                                      <div className="flex flex--center">
                                                                          <ImageCircle
                                                                              initials={`${x.firstName.charAt(0)}`}
                                                                          />
                                                                          <div className="flex--grow ml-4">
                                                                              <div className="mb-1">{x.firstName}</div>
                                                                              <div className="type--color--secondary">
                                                                                  {moment(x.dateOfBirth).format(
                                                                                      t('BIRTH_DATE_FORMAT')
                                                                                  )}
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                      <i className="icon icon--base icon--edit icon--primary"></i>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      );
                                                  })
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={closeModal}
                                className="link-button"
                                style={{
                                    margin: '0 auto',
                                    display: 'flex',
                                    justifyContent: 'left',
                                    marginBottom: '10px',
                                    marginTop: '-25px',
                                }}
                            >
                                {t('SKIP_FOR_NOW')}
                            </button>
                            <ButtonPrimaryGradient
                                disabled={childlessButton}
                                onClick={closeModal}
                                className="btn btn--base flex align--center justify--center"
                            >
                                {t('REGISTER.NEXT_BUTTON')}
                            </ButtonPrimaryGradient>
                        </div>
                        <AddChildSidebar
                            closeSidebar={closeAddCardSidebar}
                            sideBarIsOpen={addSidebarOpen}
                            childData={childForEdit}
                        />
                    </div>
                </div>
            ) : (
                <MainWrapper>
                    <div className="layout--primary">
                        <div>
                            {userRole == RoleOptions.Tutor &&
                            profileProgressState.percentage &&
                            profileProgressState.percentage < 100 ? (
                                <div className="card--dashboard mb-6">
                                    <div>
                                        <div className="row">
                                            <div className="col col-12 col-xl-6">
                                                <div className="flex">
                                                    <div className="flex flex--center flex--shrink">
                                                        <CircularProgress
                                                            progressNumber={
                                                                profileProgressState.percentage
                                                                    ? profileProgressState.percentage
                                                                    : 0
                                                            }
                                                            size={80}
                                                        />
                                                    </div>
                                                    <div className="flex flex--col flex--jc--center ml-6">
                                                        <h4 className="type--md mb-2">
                                                            {t(`COMPLETE_TUTOR_PROFILE_CARD.TITLE`)}
                                                        </h4>
                                                        <p>{t(`COMPLETE_TUTOR_PROFILE_CARD.DESCRIPTION`)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-xl-6">
                                                <div
                                                    className="flex flex--center flex--jc--space-between flex--wrap dashboard-complete-profile-btns"
                                                    style={{ height: '100%', gap: 16 }}
                                                >
                                                    <NavLink
                                                        exact
                                                        to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY}
                                                        className="nav-link--profile"
                                                        activeClassName="active"
                                                    >
                                                        <div className="flex flex--col flex--center">
                                                            <div className="nav-link--profile__wrapper">
                                                                <i
                                                                    className={`icon icon--base icon--${
                                                                        profileProgressState.generalAvailability
                                                                            ? 'check'
                                                                            : 'calendar'
                                                                    } nav-link--profile__icon`}
                                                                ></i>
                                                            </div>
                                                            <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                                                {t('COMPLETE_PROFILE.GENERAL_AVAILABILITY')}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                    <NavLink
                                                        exact
                                                        to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS}
                                                        className="nav-link--profile"
                                                        activeClassName="active"
                                                    >
                                                        <div className="flex flex--col flex--center">
                                                            <div className="nav-link--profile__wrapper">
                                                                <i
                                                                    className={`icon icon--base icon--${
                                                                        profileProgressState.myTeachings
                                                                            ? 'check'
                                                                            : 'subject'
                                                                    } nav-link--profile__icon`}
                                                                ></i>
                                                            </div>
                                                            <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                                                {t('COMPLETE_PROFILE.MY_TEACHINGS')}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                    <NavLink
                                                        exact
                                                        to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL}
                                                        className="nav-link--profile"
                                                        activeClassName="active"
                                                    >
                                                        <div className="flex flex--col flex--center">
                                                            <div className="nav-link--profile__wrapper">
                                                                <i
                                                                    className={`icon icon--base icon--${
                                                                        profileProgressState.aboutMe
                                                                            ? 'check'
                                                                            : 'profile'
                                                                    } nav-link--profile__icon`}
                                                                ></i>
                                                            </div>
                                                            <div
                                                                className="nav-link--profile__label type--center mt-4 pl-2 pr-2"
                                                                style={{ whiteSpace: 'nowrap' }}
                                                            >
                                                                {t('COMPLETE_PROFILE.ABOUT_ME')}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                    <NavLink
                                                        exact
                                                        to={PROFILE_PATHS.MY_PROFILE_ACCOUNT}
                                                        className="nav-link--profile"
                                                        activeClassName="active"
                                                    >
                                                        <div className="flex flex--col flex--center">
                                                            <div className="nav-link--profile__wrapper">
                                                                <i
                                                                    className={`icon icon--base icon--${
                                                                        profileProgressState.payment
                                                                            ? 'check'
                                                                            : 'pricing'
                                                                    } nav-link--profile__icon`}
                                                                ></i>
                                                            </div>
                                                            <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                                                {t('COMPLETE_PROFILE.EARNINGS')}
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="card--secondary card--secondary--alt">
                                <div className={`card--secondary__head flex--jc--space-between`}>
                                    <h2 className="type--wgt--bold type--lg">{t('DASHBOARD.TITLE')}</h2>
                                    <IoNotificationsOutline
                                        className="cur--pointer primary-color scale-hover--scale-110"
                                        size={25}
                                        onClick={() => setNotificationSidebarOpen(true)}
                                    />
                                </div>
                                <div className="card--secondary__body pl-3 pr-3">
                                    {userRole === RoleOptions.Tutor ? (
                                        <div className="dashboard__requests tutor-intro-1">
                                            <div className="type--color--tertiary mb-2">
                                                {t('DASHBOARD.REQUESTS.TITLE')}
                                            </div>
                                            {Object.keys(groupedPendingBookingsRequests).map((key: string) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        {groupedPendingBookingsRequests[key].map((item: IBooking) => {
                                                            if (
                                                                item.inReschedule &&
                                                                item.lastSuggestedUpdateUserId !== userId
                                                            ) {
                                                                return (
                                                                    <LessonRescheduleRequestItem
                                                                        acceptReschedule={handleAcceptReschedule}
                                                                        denyReschedule={handleDenyReschedule}
                                                                        key={item.id}
                                                                        booking={item}
                                                                    />
                                                                );
                                                            } else if (
                                                                item.inReschedule &&
                                                                item.lastSuggestedUpdateUserId === userId
                                                            ) {
                                                                return <PendingRescheduleRequestItem booking={item} />;
                                                            } else if (!item.inReschedule && !item.isAccepted) {
                                                                return (
                                                                    <BookingRequestItem
                                                                        booking={item}
                                                                        date={moment(item.startTime)
                                                                            .format(t('DATE_FORMAT'))
                                                                            .toString()}
                                                                        fetchData={fetchData}
                                                                        handleAccept={handleAccept}
                                                                        handleDeny={handleDeny}
                                                                    />
                                                                );
                                                            }
                                                        })}
                                                    </React.Fragment>
                                                );
                                            })}

                                            {groupedPendingBookingsRequests &&
                                            Object.keys(groupedPendingBookingsRequests).length > 0 ? null : (
                                                <div className="tutor-list__no-results mt-20">
                                                    <h1 className="tutor-list__no-results__title">
                                                        <div>{t('DASHBOARD.REQUESTS.EMPTY')}</div>
                                                    </h1>
                                                </div>
                                            )}
                                        </div>
                                    ) : userRole === RoleOptions.Student || userRole == RoleOptions.Parent ? (
                                        <div>
                                            <div className="dashboard__requests tutor-intro-1">
                                                <div className="type--color--tertiary mb-2">
                                                    {t('DASHBOARD.REQUESTS.TITLE')}
                                                </div>
                                                <div>
                                                    {Object.keys(groupedPendingBookingsRequests).map((key: string) => {
                                                        return (
                                                            <React.Fragment key={key}>
                                                                {groupedPendingBookingsRequests[key].map(
                                                                    (item: IBooking) => {
                                                                        if (
                                                                            item.inReschedule &&
                                                                            item.lastSuggestedUpdateUserId !== userId
                                                                        ) {
                                                                            return (
                                                                                <LessonRescheduleRequestItem
                                                                                    acceptReschedule={
                                                                                        handleAcceptReschedule
                                                                                    }
                                                                                    denyReschedule={
                                                                                        handleDenyReschedule
                                                                                    }
                                                                                    key={item.id}
                                                                                    booking={item}
                                                                                />
                                                                            );
                                                                        } else if (
                                                                            item.inReschedule &&
                                                                            item.lastSuggestedUpdateUserId === userId
                                                                        ) {
                                                                            return (
                                                                                <PendingRescheduleRequestItem
                                                                                    booking={item}
                                                                                />
                                                                            );
                                                                        } else if (
                                                                            !item.inReschedule &&
                                                                            !item.isAccepted
                                                                        ) {
                                                                            return <NotAcceptedLesson booking={item} />;
                                                                        }
                                                                    }
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="row">
                                        <div className="col col-12 col-xl-5  tutor-intro-4 student-intro-1">
                                            <div className="type--color--tertiary mb-2">
                                                {t('DASHBOARD.SCHEDULE.TITLE')}
                                            </div>
                                            {todayScheduled.length > 0 ? (
                                                <div className="card--dashboard card--dashboard--brand mb-xl-0 mb-8 h2 h--150">
                                                    <div className="flex--primary mb-2">
                                                        <div>
                                                            {todayScheduled[activeIndex].User.firstName}&nbsp;
                                                            {todayScheduled[activeIndex].User.lastName}
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
                                                                disabled={
                                                                    activeIndex === todayScheduled.length - 1 ||
                                                                    todayScheduled.length == 0
                                                                }
                                                            >
                                                                <i className="icon icon--base icon--chevron-right icon--white"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card--dashboard__text">
                                                        {t(
                                                            `LEVELS.${todayScheduled[activeIndex].Level.abrv
                                                                .replaceAll('-', '')
                                                                .replaceAll(' ', '')
                                                                .toLowerCase()}`
                                                        )}
                                                        &nbsp;
                                                        {t(
                                                            `SUBJECTS.${todayScheduled[activeIndex].Subject.abrv
                                                                .replaceAll('-', '')
                                                                .replaceAll(' ', '')
                                                                .toLowerCase()}`
                                                        )}
                                                    </div>
                                                    <div className="flex--primary">
                                                        <div>
                                                            {moment(todayScheduled[activeIndex].startTime).format(
                                                                'HH:mm'
                                                            )}{' '}
                                                            -{' '}
                                                            {moment(todayScheduled[activeIndex].endTime)
                                                                .add(1, 'minute')
                                                                .format('HH:mm')}
                                                        </div>
                                                        {todayScheduled[activeIndex].isAccepted &&
                                                        moment(todayScheduled[activeIndex].startTime)
                                                            .subtract(5, 'minutes')
                                                            .isBefore(moment()) ? (
                                                            <button
                                                                className="btn btn--base btn--secondary"
                                                                onClick={() =>
                                                                    handleJoinBooking(todayScheduled[activeIndex])
                                                                }
                                                            >
                                                                {t('DASHBOARD.SCHEDULE.BUTTON')}
                                                            </button>
                                                        ) : (
                                                            <button disabled className="btn btn--base btn--secondary">
                                                                {t('DASHBOARD.SCHEDULE.BUTTON')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="card--dashboard card--dashboard--brand mb-xl-0 mb-8 h--150 flex flex--ai--start">
                                                    <div className="flex--primary mb-2 w--100">
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
                                                                disabled={
                                                                    activeIndex === todayScheduled.length - 1 ||
                                                                    todayScheduled.length == 0
                                                                }
                                                            >
                                                                <i className="icon icon--base icon--chevron-right icon--white"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col col-12 col-xl-7 student-intro-2">
                                            <div className="type--color--tertiary mb-2">
                                                {t('DASHBOARD.MESSAGES.TITLE')}
                                            </div>

                                            {unreadChatrooms[activeMsgIndex] != undefined ? (
                                                <div className="card--dashboard h--150 ">
                                                    <div className="flex--primary mb-2 ">
                                                        <div>
                                                            {userRole === RoleOptions.Tutor
                                                                ? unreadChatrooms[activeMsgIndex].user.userNickname
                                                                : unreadChatrooms[activeMsgIndex].tutor.userNickname}
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
                                                                disabled={
                                                                    activeMsgIndex === unreadChatrooms.length - 1 ||
                                                                    unreadChatrooms.length == 0
                                                                }
                                                            >
                                                                <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="card--dashboard__text card--dashboard__text--ellipsis text-elipsis h--40--max"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                (unreadChatrooms[activeMsgIndex].messages[
                                                                    unreadChatrooms[activeMsgIndex].messages.length - 1
                                                                ]?.isFile
                                                                    ? '<i class="icon--attachment chat-file-icon"></i>'
                                                                    : '') +
                                                                unreadChatrooms[activeMsgIndex].messages[
                                                                    unreadChatrooms[activeMsgIndex].messages.length - 1
                                                                ]?.message?.message,
                                                        }}
                                                    ></div>
                                                    <div className="flex--primary">
                                                        <div className="type--color--secondary">
                                                            {moment(
                                                                unreadChatrooms[activeMsgIndex].messages[
                                                                    unreadChatrooms[activeMsgIndex].messages.length - 1
                                                                ]?.message?.createdAt
                                                            ).format('DD/MMM/yyy')}
                                                        </div>
                                                        <Link
                                                            to={PATHS.CHAT}
                                                            className="btn btn--sm card--dashboard__btn"
                                                            onClick={() =>
                                                                handleGoToChat(unreadChatrooms[activeMsgIndex])
                                                            }
                                                        >
                                                            {t('DASHBOARD.MESSAGES.BUTTON')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="card--dashboard h--150">
                                                    <div className="flex--primary mb-2">
                                                        <div>{t('DASHBOARD.MESSAGES.EMPTY')}</div>
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
                                                                disabled={
                                                                    activeMsgIndex === unreadChatrooms.length - 1 ||
                                                                    unreadChatrooms.length == 0
                                                                }
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
                                                        <div className="type--color--tertiary mb-2">
                                                            {t('DASHBOARD.BOOKINGS.TITLE')}
                                                        </div>
                                                        <div className="flex--primary">
                                                            <div className="mb-4 mt-6 type--wgt--bold">{key}</div>
                                                            <div className="type--color--secondary">
                                                                {t('DASHBOARD.BOOKINGS.TOTAL')}:{' '}
                                                                {groupedUpcomming[key].length}:00h
                                                            </div>
                                                        </div>
                                                        {groupedUpcomming[key].map((item: IBooking) => {
                                                            return (
                                                                <UpcomingLessonItem
                                                                    id={item.id}
                                                                    isInReschedule={item.inReschedule}
                                                                    firstName={item.User.firstName}
                                                                    lastName={item.User.lastName}
                                                                    levelAbrv={item.Level.abrv}
                                                                    subjectAbrv={item.Subject.abrv}
                                                                    startTime={item.startTime}
                                                                    endTime={item.endTime}
                                                                    booking={item}
                                                                    fetchData={fetchData}
                                                                />
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                );
                                            })
                                        ) : userRole !== RoleOptions.Tutor ? (
                                            <>
                                                <div className="type--color--tertiary mb-2">
                                                    {t('DASHBOARD.BOOKINGS.RECOMMENDED')}
                                                </div>
                                                <div className="filter flex flex--col flex--ai--center student-intro-3">
                                                    <div className="flex flex--wrap flex--center mb-3">
                                                        <FormikProvider value={formik}>
                                                            <Form
                                                                className="flex flex--wrap flex--jc--center filters-container"
                                                                noValidate
                                                            >
                                                                <MySelect
                                                                    key={`level-select-${resetKey}`}
                                                                    field={formik.getFieldProps('level')}
                                                                    form={formik}
                                                                    meta={formik.getFieldMeta('level')}
                                                                    classNamePrefix="react-select--search-tutor"
                                                                    isMulti={false}
                                                                    options={levelOptions}
                                                                    isDisabled={levelDisabled}
                                                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.LEVEL')}
                                                                ></MySelect>
                                                                <MySelect
                                                                    key={`subject-select-${resetKey}`}
                                                                    field={formik.getFieldProps('subject')}
                                                                    form={formik}
                                                                    meta={formik.getFieldMeta('subject')}
                                                                    isMulti={false}
                                                                    className=""
                                                                    classNamePrefix="pos--r--0-mobile react-select--search-tutor"
                                                                    options={subjectOptions}
                                                                    isDisabled={levelDisabled || isLoadingSubjects}
                                                                    noOptionsMessage={() =>
                                                                        t('SEARCH_TUTORS.NO_OPTIONS_MESSAGE')
                                                                    }
                                                                    placeholder={t('SEARCH_TUTORS.PLACEHOLDER.SUBJECT')}
                                                                ></MySelect>
                                                                <Select
                                                                    placeholder={t(
                                                                        'SEARCH_TUTORS.PLACEHOLDER.AVAILABILITY'
                                                                    )}
                                                                    components={{
                                                                        Menu: CustomMenu,
                                                                    }}
                                                                    className=" react-select--search-tutor--menu"
                                                                    classNamePrefix="react-select--search-tutor"
                                                                    //onMenuClose={handleMenuClose}
                                                                    isSearchable={false}
                                                                ></Select>
                                                            </Form>
                                                        </FormikProvider>
                                                        <button
                                                            className="btn btn--clear align--center mt-2"
                                                            onClick={handleResetFilter}
                                                            disabled={resetFilterDisabled}
                                                        >
                                                            {t('SEARCH_TUTORS.RESET_FILTER')}
                                                        </button>
                                                    </div>
                                                    {isLoadingAvailableTutors || availableTutorsUninitialized ? (
                                                        <LoaderPrimary />
                                                    ) : loadedTutorItems.length > 0 ? (
                                                        <>
                                                            <div
                                                                className={
                                                                    'flex flex--row w--100 flex--wrap flex--gap-20 flex--jc--center field__w-fit-content align--center pb-3 pr-3 pl-3 overflow--y--scroll student-intro-3'
                                                                }
                                                            >
                                                                {loadedTutorItems.map((tutor) =>
                                                                    isMobile ? (
                                                                        <RecommendedTutorCardMobile
                                                                            className={`p-4 h--350`}
                                                                            key={tutor.id}
                                                                            tutor={tutor}
                                                                        />
                                                                    ) : (
                                                                        <RecommendedTutorCard
                                                                            className={`p-4 h--350`}
                                                                            key={tutor.id}
                                                                            tutor={tutor}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                            <Link
                                                                to={PATHS.SEARCH_TUTORS}
                                                                className="type--center underline-hover field__w-fit-content"
                                                            >
                                                                {t('DASHBOARD.BOOKINGS.SHOW_MORE')}
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <div className="tutor-list__no-results mt-30">
                                                            <h1 className="tutor-list__no-results__title">
                                                                <p>{t('SEARCH_TUTORS.NO_RESULT.TITLE')}</p>
                                                            </h1>
                                                            <p className="tutor-list__no-results__subtitle">
                                                                {t('SEARCH_TUTORS.NO_RESULT.DESC')}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : upcomingLoading ? (
                                            <LoaderPrimary />
                                        ) : (
                                            <>
                                                <div className="type--color--tertiary mb-2">
                                                    {t('DASHBOARD.BOOKINGS.TITLE')}
                                                </div>
                                                <div className="tutor-list__no-results mt-30">
                                                    <h1 className="tutor-list__no-results__title">
                                                        <p>{t('DASHBOARD.BOOKINGS.EMPTY')}</p>
                                                    </h1>
                                                    <p className="tutor-list__no-results__subtitle">
                                                        {t('DASHBOARD.BOOKINGS.EMPTY_SUBTITLE')}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {learnCubeModal && currentlyActiveBooking && (
                            <LearnCubeModal
                                bookingInfo={currentlyActiveBooking}
                                handleClose={() => {
                                    setLearnCubeModal(false);
                                }}
                            />
                        )}
                        {tutorHiLinkModalActive && (
                            <HiLinkModalForTutorIntro
                                roomLink={tutorialRoomLink}
                                handleClose={handleHiLinkModalClose}
                            />
                        )}

                        <NotificationsSidebar
                            sideBarIsOpen={notificationSidebarOpen}
                            title={'Notifications'}
                            closeSidebar={() => setNotificationSidebarOpen(false)}
                        >
                            <div className="flex--primary mb-2 mr-2">
                                <div className="type--color--tertiary">{t('DASHBOARD.NOTIFICATIONS.TITLE')}</div>
                                {notificationsData?.content && notificationsData.content.length > 0 && (
                                    <div
                                        className="type--color--brand type--wgt--bold cur--pointer"
                                        onClick={() => markAllAsRead()}
                                    >
                                        {t('DASHBOARD.NOTIFICATIONS.CLEAR')}
                                    </div>
                                )}
                            </div>
                            <div className="mr-2">
                                {notificationsData?.content &&
                                notificationsData.content.find((x) => x.read === false) ? (
                                    notificationsData.content.map((notification: INotification) => {
                                        if (!notification.read) {
                                            return (
                                                <NotificationItem
                                                    key={notification.id}
                                                    notificationData={notification}
                                                />
                                            );
                                        }
                                    })
                                ) : (
                                    <div className="card--primary card--primary--shadow">
                                        {t('DASHBOARD.NOTIFICATIONS.EMPTY')}
                                    </div>
                                )}
                                <div className="type--center mt-4">
                                    <Link to={t(PATHS.NOTIFICATIONS)} className="btn btn--clear">
                                        {t('DASHBOARD.NOTIFICATIONS.ALL')}
                                    </Link>
                                </div>
                            </div>
                        </NotificationsSidebar>
                    </div>
                </MainWrapper>
            )}
        </>
    );
}
