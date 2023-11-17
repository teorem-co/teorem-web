import { t } from 'i18next';
import { groupBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import INotification from '../../../interfaces/notification/INotification';
import ISocketNotification
  from '../../../interfaces/notification/ISocketNotification';
import {
  useLazyGetAllUnreadNotificationsQuery,
  useMarkAllAsReadMutation,
} from '../../../services/notificationService';
import {
  useLazyGetChildrenQuery,
  useLazyGetUserQuery,
} from '../../../services/userService';
import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import { useAppSelector } from '../../hooks';
import { PATHS, PROFILE_PATHS, ROUTES } from '../../routes';
import {
  IChatRoom,
  ISendChatMessage,
  setActiveChatRoomById,
} from '../chat/slices/chatSlice';
import IBooking from '../my-bookings/interfaces/IBooking';
import LearnCubeModal from '../my-profile/components/LearnCubeModal';
import NotificationItem from '../notifications/components/NotificationItem';
import CircularProgress from '../my-profile/components/CircularProgress';
import { setMyProfileProgress } from '../my-profile/slices/myProfileSlice';
import {
  useLazyGetAvailableTutorsQuery,
  useLazyGetProfileProgressQuery,
} from '../../../services/tutorService';
import IParams from "../notifications/interfaces/IParams";
import {
  useLazyGetRequestsQuery,
  useLazyGetTodayScheduleQuery,
  useLazyGetUpcomingQuery
} from "../../../services/dashboardService";
import {
  useAcceptBookingMutation,
  useDeleteBookingMutation
} from "../my-bookings/services/bookingService";
import { UpcomingLessonItem } from './upcoming-lessons/UpcomingLessonItem';
import logo from "../../../assets/images/teorem_logo_purple.png";
import LoaderPrimary from "../../components/skeleton-loaders/LoaderPrimary";
import {IChild} from "../../../interfaces/IChild";
import ImageCircle from "../../components/ImageCircle";
import AddChildSidebar from "../my-profile/components/AddChildSidebar";
import {
  OnboardingTutor
} from "../onboarding/tutorOnboardingNew/OnboardingTutor";
// import { Steps } from 'intro.js-react';
// import "intro.js/introjs.css";
import { TutorTutorialModal } from '../../components/TutorTutorialModal';
import {
  HiLinkModalForTutorIntro
} from '../my-profile/components/HiLinkModalForTutorIntro';
import toastService from '../../services/toastService';
import {
  useLazyGetTutorTestingLinkQuery,
} from '../../services/hiLinkService';
import NotificationsSidebar from '../../components/NotificationsSidebar';
import { IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import {
  RecommendedTutorCard
} from './recommended-tutors/RecommendedTutorCard';
import ITutorItem from '../../../interfaces/ITutorItem';
import { SortDirection } from '../../lookups/sortDirection';
import { TutorItemMobile } from '../searchTutors/components/TutorItemMobile';
import TutorItem from '../searchTutors/components/TutorItem';

interface IGroupedDashboardData {
    [date: string]: IBooking[];
}

const Dashboard = () => {
    const mockRequest: IBooking ={
      id:"mockRequest",
      userFullName:'Ivan Horvat',
      Tutor: {
        userId: 'tutorid',
        currentOccupation: 'ocupation',
        yearsOfExperience: 'experience',
        aboutTutor: 'about tutor',
        aboutLessons: 'about lessons',
        User: {
          id:'userId',
          roleId: 'roleid',
          dateOfBirth: '1998-06-22',
          phonePrefix: '385',
          profileImage: 'profileImg',
          childIds: [],
          stripeCustomerId: 'stripecustid',
          stripeAccountId: 'stripeaccid',
          stripeConnected: true,
          Country: {
            currencyCode: 'currency code',
            currencyName: 'currency name'
          },
          email:"stela.gasi8@gmail.com",
          firstName:"Stela",
          lastName:"Gasi",
          countryId:"da98ad50-5138-4f0d-b297-62c5cb101247",
          phoneNumber:"38598718823",
          Role:{
            name: 'name',
            id: 'roleid',
            abrv: "student"
          },
        },
        TutorSubjects: [],
        minimumPrice: 10,
        maximumPrice: 15,
        averageGrade: 5,
        completedLessons: 1,
        Bookings: [],
        disabled: false,
        slug: 'slug',
      },
      User:{
        id:'userId',
        roleId: 'roleid',
        dateOfBirth: '1998-06-22',
        phonePrefix: '385',
        profileImage: 'profileImg',
        childIds: [],
        stripeCustomerId: 'stripecustid',
        stripeAccountId: 'stripeaccid',
        stripeConnected: true,
        Country: {
          currencyCode: 'currency code',
          currencyName: 'currency name'
        },
        email:"stela.gasi8@gmail.com",
        firstName:"Ivan",
        lastName:"Horvat",
        countryId:"da98ad50-5138-4f0d-b297-62c5cb101247",
        phoneNumber:"38598718823",
        Role:{
          name: 'name',
          id: 'roleid',
          abrv: "student"
        }
      },
      tutorId:"6ab33036-3204-4ab0-9a4b-a1016c77e63c",
      studentId:"8eb6b506-5fea-4709-9fd3-79d27869ff96",
      subjectId:"2da9dfdb-e9cc-479a-802d-fa2a9b906575",
      levelId:"bb589332-eb38-4455-9259-1773bf88d60a",
      startTime:moment().add(1, 'day').toISOString(),
      endTime:moment().add(1, 'day').add(50, 'minutes').toISOString(),
      isAccepted:false,
      Level:{
        id:"bb589332-eb38-4455-9259-1773bf88d60a",
        abrv:"high-school",
        name:"High School"
      },
      Subject:{
        "id":"2da9dfdb-e9cc-479a-802d-fa2a9b906575",
        "abrv":"maths",
        "name":"Maths"
      }
    };
    const mockSchedule: IBooking ={
      id:"mockSchedule",
      userFullName:'Ana Anić',
      Tutor: {
        userId: 'tutorid',
        currentOccupation: 'ocupation',
        yearsOfExperience: 'experience',
        aboutTutor: 'about tutor',
        aboutLessons: 'about lessons',
        User: {
          id:'userId',
          roleId: 'roleid',
          dateOfBirth: '1998-06-22',
          phonePrefix: '385',
          profileImage: 'profileImg',
          childIds: [],
          stripeCustomerId: 'stripecustid',
          stripeAccountId: 'stripeaccid',
          stripeConnected: true,
          Country: {
            currencyCode: 'currency code',
            currencyName: 'currency name'
          },
          email:"stela.gasi8@gmail.com",
          firstName:"Stela",
          lastName:"Gasi",
          countryId:"da98ad50-5138-4f0d-b297-62c5cb101247",
          phoneNumber:"38598718823",
          Role:{
            name: 'name',
            id: 'roleid',
            abrv: "student"
          },
        },
        TutorSubjects: [],
        minimumPrice: 10,
        maximumPrice: 15,
        averageGrade: 5,
        completedLessons: 1,
        Bookings: [],
        disabled: false,
        slug: 'slug',
      },
      User:{
        id:'userId',
        roleId: 'roleid',
        dateOfBirth: '1998-06-22',
        phonePrefix: '385',
        profileImage: 'profileImg',
        childIds: [],
        stripeCustomerId: 'stripecustid',
        stripeAccountId: 'stripeaccid',
        stripeConnected: true,
        Country: {
          currencyCode: 'currency code',
          currencyName: 'currency name'
        },
        email:"stela.gasi8@gmail.com",
        firstName:"Ana",
        lastName:"Anić",
        countryId:"da98ad50-5138-4f0d-b297-62c5cb101247",
        phoneNumber:"38598718823",
        Role:{
          name: 'name',
          id: 'roleid',
          abrv: "student"
        }
      },
      tutorId:"6ab33036-3204-4ab0-9a4b-a1016c77e63c",
      studentId:"8eb6b506-5fea-4709-9fd3-79d27869ff96",
      subjectId:"2da9dfdb-e9cc-479a-802d-fa2a9b906575",
      levelId:"bb589332-eb38-4455-9259-1773bf88d60a",
      startTime:moment().toISOString(),
      endTime:moment().add(50, 'minutes').toISOString(),
      isAccepted:true,
      Level:{
        id:"bb589332-eb38-4455-9259-1773bf88d60a",
        abrv:"high-school",
        name:"High School"
      },
      Subject:{
        "id":"2da9dfdb-e9cc-479a-802d-fa2a9b906575",
        "abrv":"maths",
        "name":"Maths"
      }
    };

    const [getUnreadNotifications, { data: notificationsData }] = useLazyGetAllUnreadNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [getUserById0, { data: userDataFirst }] = useLazyGetUserQuery();
    const [getUserById1, { data: userDataSecond }] = useLazyGetUserQuery();
    const [getProfileProgress, {isSuccess}] = useLazyGetProfileProgressQuery();
    const [getUpcoming] = useLazyGetUpcomingQuery();
    const [getTodaySchedule] = useLazyGetTodayScheduleQuery();
    const [getRequests] = useLazyGetRequestsQuery();
    const [acceptRequest] = useAcceptBookingMutation();
    const [denyRequest] = useDeleteBookingMutation();
    const [getChildren, { data: childrenData, isLoading: childrenLoading}] = useLazyGetChildrenQuery();
    const [childless, setChildless] = useState(false);

    const [groupedUpcomming, setGroupedUpcoming] = useState<IGroupedDashboardData>({});
    const [groupedRequests, setGroupedRequests] = useState<IGroupedDashboardData>({});
    const [todayScheduled, setTodayScheduled] = useState<IBooking[]>([]);
    const [unreadChatrooms, setUnreadChatrooms] = useState<any[]>([]);
    const [learnCubeModal, setLearnCubeModal] = useState<boolean>(false);
    const [currentlyActiveBooking, setCurrentlyActiveBooking] = useState<string>('');
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeMsgIndex, setActiveMsgIndex] = useState<number>(0);
    const [params, setParams] = useState<IParams>({ page: 1, size: 10, sort:"createdAt", sortDirection:"desc", read: false });
    const [modal, setModal] = useState<boolean>(() => {
      const storedValue = sessionStorage.getItem('myValue');
      return storedValue !== null ? storedValue === 'true' : true;
    });

    const [addSidebarOpen, setAddSidebarOpen] = useState(false);
    const [childForEdit, setChildForEdit] = useState<IChild | null>(null);
    const [childlessButton, setChildlessButton] = useState(true);

    useEffect(() => {
      sessionStorage.setItem('myValue', String(modal));
    }, [modal]);

    const userData = useAppSelector((state) => state.user);

    const userId = useAppSelector((state) => state.auth.user?.id);
    const userRole = useAppSelector((state) => state.auth.user?.Role.abrv);
    const chatrooms = useAppSelector((state) => state.chat.chatRooms);
    const socket = useAppSelector((state) => state.chat.socket);
    const profileProgressState = useAppSelector((state) => state.myProfileProgress);
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchProgress = async () => {
        //If there is no state in redux for profileProgress fetch data and save result to redux
        if (profileProgressState.percentage === 0) {
            const progressResponse = await getProfileProgress().unwrap();
            dispatch(setMyProfileProgress(progressResponse));
        }
    };

    const fetchData = async () => {
        await getUnreadNotifications(params).unwrap();
        const upcoming = await getUpcoming().unwrap();
        const groupedDashboardData: IGroupedDashboardData = groupBy(upcoming, (e) => moment(e.startTime).format(t('DATE_FORMAT')));
        setGroupedUpcoming(groupedDashboardData);
        const todaySchedule = await getTodaySchedule().unwrap();
        setTodayScheduled(todaySchedule);
        const requests = await getRequests().unwrap();
        const groupedRequestData: IGroupedDashboardData = groupBy(requests, (e) => moment(e.startTime).format(t('DATE_FORMAT')));
        setGroupedRequests(groupedRequestData);

        // if(!showIntro){
        //   setGroupedRequests(prevGroupedRequests => {
        //     const { dateKey, ...restOfData } = prevGroupedRequests;
        //     return restOfData;
        //   });
        // }

        let children = [];if(userRole === RoleOptions.Parent && userId !== undefined) {
          children = await getChildren(userId).unwrap().then();
        }
        if(!childrenLoading && (children.length === 0 || children.length === undefined)) {
          setChildless(true);
        }
        if(!childrenLoading && (children.length === 0 || children.length === undefined)) {
          setChildless(true);
        }
    };

    const handleNextIndex = () => {
        if (activeIndex < todayScheduled.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleAccept = async (id: string) => {
      if(id==='mockRequest'){
        handleIntroAcceptBooking();
        return;
      }
      await acceptRequest(id);
      fetchData();
    };

    const handleDeny = async (id: string) => {
      if(id==='mockRequest'){
        handleIntroDenyBooking();
        return;
      }
      await denyRequest(id);
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
      if(event.id === 'mockSchedule'){
        setTutorHiLinkModalActive(true);
        return;
      }
        setCurrentlyActiveBooking(event.id);
        setLearnCubeModal(true);
    };

    const handleGoToChat = (activeChatRoom: IChatRoom) => {
        dispatch(setActiveChatRoomById(
            {
                userId: activeChatRoom.user?.userId + '',
                tutorId: activeChatRoom.tutor?.userId + '',
            }
        ));
    };

    useEffect(() => {
      fetchData();

      socket.on('showNotification', (notification: ISocketNotification) => {
        if (userId && notification.userId === userId) {
          getUnreadNotifications(params);
        }
      });

      if(!childrenLoading && childrenData?.length === 0) {
        setChildless(true);
      }
    }, []);

    useEffect(() => {
        fetchProgress();
    }, []);

    useEffect(() => {
        const tmpCr: any = [];
        chatrooms.forEach(cr => {

            const message = cr.messages[cr.messages.length - 1] || null;

            if (message && !message.message.isRead && userId != message.senderId) {
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

                const message = cr.messages[cr.messages.length - 1];

                if (message && (message.message.isRead || userId != message.senderId))
                    return;

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
      setModal(false);
      //setChildless(false);
    };

    const steps = [
      {
        title: t('TUTOR_INTRO.DASHBOARD.STEP1.TITLE'),
        intro: t('TUTOR_INTRO.DASHBOARD.STEP1.BODY'),
        element: ".tutor-intro-1",
      },
      {
        title: t('TUTOR_INTRO.DASHBOARD.STEP2.TITLE'),
        intro: t('TUTOR_INTRO.DASHBOARD.STEP2.BODY'),
        element: ".tutor-intro-2",
        position: "top"
      },
      {
        title: t('TUTOR_INTRO.DASHBOARD.STEP3.TITLE'),
        intro: t('TUTOR_INTRO.DASHBOARD.STEP3.BODY'),
        element: ".tutor-intro-3",
        position: "right"
      },
      {
        title: t('TUTOR_INTRO.DASHBOARD.STEP4.TITLE'),
        intro: t('TUTOR_INTRO.DASHBOARD.STEP4.BODY'),
        element: ".tutor-intro-4",
      },
      {
        title: t('TUTOR_INTRO.DASHBOARD.STEP5.TITLE'),
        intro: t('TUTOR_INTRO.DASHBOARD.STEP5.BODY'),
        element: ".tutor-intro-5",
      },
    ];

  const [getTestingRoomLink] = useLazyGetTutorTestingLinkQuery();
  const [modalActive, setModalActive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialRoomLink, setTutorialRoomLink] = useState('');
  const [isStepsEnabled, setIsStepsEnabled] = useState(true);
  const [showIntro, setShowIntro] = useState<string | null>('');
  const [tutorHiLinkModalActive, setTutorHiLinkModalActive] = useState(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);

  useEffect(() => {
    if(!localStorage.getItem('hideTutorIntro') && profileProgressState.percentage === 100){
      setModalActive(true);
    }
  }, [profileProgressState.percentage]);

  //zove se uvijek: bilo da si skip
  const onExit = () => {
    localStorage.setItem('hideTutorIntro', 'true');
    setShowIntro(null);
    setIsStepsEnabled(false);
  };

  //kad klikne finish tj zadnji step
  const onComplete = () => {
    handleJoinBooking(mockSchedule);// automatically join meeting
    setIsStepsEnabled(false);
  };

  const skipTutorial = () =>{
    setShowTutorial(false);
    setModalActive(false);
    setShowIntro(null);
    localStorage.setItem('hideTutorIntro', 'true');
  };

  const startTutorial = async () =>{
    // window.scrollTo(0, document.body.scrollHeight);
    document.body.scrollTop = -document.body.scrollHeight;
    getTestingRoomLink().unwrap().then((res)=> {
      setTutorialRoomLink(res.meetingUrl);
    });

    //TODO: send request to backend and get link and save it
    const dateKey = moment(new Date()).add(1, 'day').format(t('DATE_FORMAT'));
    const grupedData: IGroupedDashboardData = {
      [dateKey]: [mockRequest]
    };
    setTodayScheduled([mockSchedule]);
    setGroupedRequests(grupedData);

    setShowTutorial(true);
    setModalActive(false);
  };

  function handleClose() {
    setTutorHiLinkModalActive(false);
  }

  function handleIntroAcceptBooking(){
    toastService.success('Rezervacija prihvacena');
    //TODO:
    // remove booking from requests
    // add booking to upcoming bookings
    return;
  }

  function handleIntroDenyBooking(){
    toastService.success('Rezervacija odbijena');
    //TODO:
    // remove booking from requests
    return;
  }

  // const tutorItem: ITutorItem = {
  //   id: 'id',
  //   firstName: 'Ivan',
  //   lastName:'Horvat',
  //   profileImage: 'https://fakeimg.pl/300',
  //   slug: 'slug',
  //   currentOccupation: 'Profesor matematike',
  //   aboutTutor: 'more more more more more more more re more more more more more more more more more more more more more more more more more more more more ',
  //   minPrice: 12,
  //   maxPrice: 15,
  //   averageGrade: 4.5,
  //   aboutLessons: 'about lessons',
  //   completedLessons: 25,
  //   currencyCode: 'EUR',
  //   yearsOfExperience: 4,
  //   subjects: ['maths', 'croatian'],
  //   numberOfReviews: 23
  // };
  // tutor search

  const [
    getAvailableTutors,
    {
      data: availableTutors,
      isLoading: isLoadingAvailableTutors,
      isUninitialized: availableTutorsUninitialized,
      isFetching: availableTutorsFetching,
    },
  ] = useLazyGetAvailableTutorsQuery();


  const [loadedTutorItems, setLoadedTutorItems] = useState<ITutorItem[]>([]);

  useEffect(() => {
    const params ={
      page: 0,
      rpp: 3,
      sort: 'price,'+SortDirection.Asc
    };

    getAvailableTutors(params).unwrap().then((res)=>{
      setLoadedTutorItems(res.content);
    });
  }, []);

  return (
      <>
        {modalActive && <TutorTutorialModal skip={skipTutorial} start={startTutorial}/>}

        {/*{showTutorial && groupedRequests && Object.keys(groupedRequests).length > 0 &&*/}
        {/*  <Steps*/}
        {/*       enabled={isStepsEnabled}*/}
        {/*       steps={steps}*/}
        {/*       initialStep={0}*/}
        {/*       onExit={onExit}*/}
        {/*       onBeforeExit={onExit}*/}
        {/*       options={{*/}
        {/*         nextLabel: t('TUTOR_INTRO.BUTTON_NEXT'),*/}
        {/*         prevLabel: t('TUTOR_INTRO.BUTTON_PREVIOUS'),*/}
        {/*         doneLabel: t('TUTOR_INTRO.BUTTON_FINISH'),*/}
        {/*         scrollTo: 'element'*/}
        {/*       }}*/}
        {/*       onComplete={onComplete}*/}
        {/*/>*/}
        {/*}*/}

        {userRole === RoleOptions.Tutor && profileProgressState.percentage !== 100 ? (
            <OnboardingTutor/>
          ) :
          (<>
          {userRole === RoleOptions.Parent && childless && modal ? (
              <div>
                <img
                  src={logo}
                  alt='logo'
                  className="mt-5 ml-5 signup-logo"
                />
                <div className='flex field__w-fit-content align--center flex--center'>
                  <>
                    <div>
                      {/* HEADER */}
                      <div style={{margin: "40px"}} className="flex">
                        <div className="flex flex--center flex--shrink w--105">
                          <CircularProgress
                            className='progress-circle ml-1'
                            progressNumber={50}
                          />
                        </div>
                        <div className="flex flex--col flex--jc--center ml-6">
                          <h4 className='signup-title ml-6 text-align--center'>{t('ADD_CHILD.PART_1')} <span className='primary-color'>{t('ADD_CHILD.PART_2')}</span></h4>
                        </div>
                      </div>
                      {(childrenLoading && <LoaderPrimary />) || (
                        <div className="card--profile__section">
                          <div>
                            <div className="dash-wrapper dash-wrapper--adaptive">
                              <div
                                className="dash-wrapper__item"
                                style={{width: "95%"}}
                                onClick={() => {
                                  handleAddNewchild();
                                }}
                              >
                                <div className="dash-wrapper__item__element">
                                  <div className="flex--primary cur--pointer">
                                    <div>
                                      <div className="mb-1">{t('ADD_CHILD.TITLE')}</div>
                                      <div className="type--color--secondary">{t('ADD_CHILD.DESCRIPTION')}</div>
                                    </div>
                                    <i className="icon icon--base icon--plus icon--primary"></i>
                                  </div>
                                </div>
                              </div>
                              {childrenData &&
                                childrenData.map((x: IChild) => {
                                  return (
                                    <div className="dash-wrapper__item" key={x.username} style={{width: "100%"}} onClick={() => handleEditChild(x)}>
                                      <div className="dash-wrapper__item__element">
                                        <div className="flex--primary cur--pointer">
                                          <div className="flex flex--center">
                                            <ImageCircle initials={`${x.firstName.charAt(0)}`} />
                                            <div className="flex--grow ml-4">
                                              <div className="mb-1">{x.firstName}</div>
                                              <div className="type--color--secondary">
                                                {moment(x.dateOfBirth).format('MM/DD/YYYY')}
                                              </div>
                                            </div>
                                          </div>
                                          <i className="icon icon--base icon--edit icon--primary"></i>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      )}
                      <button onClick={closeModal} className="link-button" style={{margin: "0 auto", display: "flex",
                        justifyContent: "left", marginBottom: "10px", marginTop: "-25px"}}>
                        {t('SKIP_FOR_NOW')}
                      </button>
                      <button disabled={childlessButton} onClick={closeModal} className="btn btn--base btn--primary" style={{margin: "0 auto", display: "flex",
                        justifyContent: "center"}}>
                        {t('REGISTER.NEXT_BUTTON')}
                      </button>
                    </div>
                    <AddChildSidebar closeSidebar={closeAddCardSidebar} sideBarIsOpen={addSidebarOpen} childData={childForEdit} />
                  </>
                </div>
              </div>
          ) : (<MainWrapper>
            <div className="layout--primary">
              <div>
                {/*{userRole === RoleOptions.Tutor && profileProgressState && !profileProgressState.verified ? (*/}
                {/*  <div className="flex flex--col flex--jc--center mb-2 p-2" style={{ borderRadius: '0.5em', color: 'white', backgroundColor:'#7e6cf2'}}>*/}
                {/*    <h4 className="type--md mb-2 ml-6 align-self-center">{t(`TUTOR_VERIFIED_NOTE.TITLE`)}</h4>*/}
                {/*    <p className="ml-6 align-self-center">{t(`TUTOR_VERIFIED_NOTE.DESCRIPTION`)}</p>*/}
                {/*  </div>*/}
                {/*) : null}*/}
                {userRole === RoleOptions.Parent && childrenData?.length === 0 ? (
                  <div>
                    <div className="flex flex--col flex--jc--center mb-2 p-2" style={{ borderRadius: '0.5em', color: 'white', background:'#7e6cf2'}}>
                      <h4 className="type--md mb-2 ml-6 align-self-center">{t(`CHILDLESS_PARENT_NOTE.TITLE`)}</h4>
                      <p className="ml-6 align-self-center">{t(`CHILDLESS_PARENT_NOTE.DESCRIPTION`)}</p>
                      <Link
                        className="btn btn--base btn--tertiary mb-4 type--center"
                        to={PROFILE_PATHS.MY_PROFILE_CHILD_INFO}
                      >
                        {t('MY_PROFILE.PROFILE_SETTINGS.DESCRIPTION')}
                      </Link>
                    </div>
                  </div>) : null}
                        {userRole == RoleOptions.Tutor && profileProgressState.percentage && profileProgressState.percentage < 100 ? (
                            <div className="card--dashboard mb-6">
                                <div>
                                    <div className="row">
                                        <div className="col col-12 col-xl-6">
                                            <div className="flex">
                                                <div className="flex flex--center flex--shrink">
                                                    <CircularProgress progressNumber={profileProgressState.percentage ? profileProgressState.percentage : 0} size={80} />
                                                </div>
                                                <div className="flex flex--col flex--jc--center ml-6">
                                                    <h4 className="type--md mb-2">{t(`COMPLETE_TUTOR_PROFILE_CARD.TITLE`)}</h4>
                                                    <p>{t(`COMPLETE_TUTOR_PROFILE_CARD.DESCRIPTION`)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-12 col-xl-6">
                                            <div className="flex flex--center flex--jc--space-between flex--wrap dashboard-complete-profile-btns" style={{height: '100%', gap: 16}}>
                                                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_AVAILABILITY} className="nav-link--profile" activeClassName="active">
                                                    <div className="flex flex--col flex--center">
                                                        <div className="nav-link--profile__wrapper">
                                                            <i className={`icon icon--base icon--${profileProgressState.generalAvailability ? 'check' : 'calendar'} nav-link--profile__icon`}></i>
                                                        </div>
                                                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">
                                                            {t('COMPLETE_PROFILE.GENERAL_AVAILABILITY')}
                                                        </div>
                                                    </div>
                                                </NavLink>
                                                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_TEACHINGS} className="nav-link--profile" activeClassName="active">
                                                    <div className="flex flex--col flex--center">
                                                        <div className="nav-link--profile__wrapper">
                                                            <i className={`icon icon--base icon--${profileProgressState.myTeachings ? 'check' : 'subject'} nav-link--profile__icon`}></i>
                                                        </div>
                                                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.MY_TEACHINGS')}</div>
                                                    </div>
                                                </NavLink>
                                                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_INFO_ADDITIONAL} className="nav-link--profile" activeClassName="active">
                                                    <div className="flex flex--col flex--center">
                                                        <div className="nav-link--profile__wrapper">
                                                            <i className={`icon icon--base icon--${profileProgressState.aboutMe ? 'check' : 'profile'} nav-link--profile__icon`}></i>
                                                        </div>
                                                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2" style={{whiteSpace: "nowrap"}}>{t('COMPLETE_PROFILE.ABOUT_ME')}</div>
                                                    </div>
                                                </NavLink>
                                                <NavLink exact to={PROFILE_PATHS.MY_PROFILE_ACCOUNT} className="nav-link--profile" activeClassName="active">
                                                    <div className="flex flex--col flex--center">
                                                        <div className="nav-link--profile__wrapper">
                                                            <i className={`icon icon--base icon--${profileProgressState.payment ? 'check' : 'pricing'} nav-link--profile__icon`}></i>
                                                        </div>
                                                        <div className="nav-link--profile__label type--center mt-4 pl-2 pr-2">{t('COMPLETE_PROFILE.EARNINGS')}</div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    <div className="card--secondary card--secondary--alt">
                        <div className="card--secondary__head">
                            <h2 className="type--wgt--bold type--lg">{t('DASHBOARD.TITLE')}</h2>
                            {/*<button className={"btn btn--lg btn--primary"} onClick={startTutorial}>Click to start tutorial</button>*/}
                            <IoNotificationsOutline className="cur--pointer primary-color" size={20} onClick={() => setNotificationSidebarOpen(true)}/>
                        </div>
                        <div className="card--secondary__body pl-3 pr-3">
                          {userRole === RoleOptions.Tutor ? (
                            <div className="dashboard__requests tutor-intro-1">
                              <div className="type--color--tertiary mb-2">{t('DASHBOARD.REQUESTS.TITLE')}</div>
                              {groupedRequests && Object.keys(groupedRequests).length > 0 ? (
                                Object.keys(groupedRequests).map((key: string) => {
                                  return (
                                    <React.Fragment key={key} >
                                      {groupedRequests[key].map((item: IBooking) => {
                                        return (

                                          <div className="dashboard__requests__item " key={item.id}>
                                            <div>
                                              {item.User.firstName}&nbsp;{item.User.lastName}
                                            </div>
                                            <div>{t(`LEVELS.${item.Level.abrv.toLowerCase().replace("-", "")}`)}</div>
                                            <div className={""}>
                                              <span className=" tag tag--primary">{t(`SUBJECTS.${item.Subject.abrv.replace('-', '')}`)}</span>
                                            </div>
                                            <div>{key}</div>
                                            <div>
                                              {moment(item.startTime).format('HH:mm')} -{' '}
                                              {moment(item.endTime).add(1, 'minute').format('HH:mm')}
                                            </div>
                                            <div className={"flex flex--row flex--jc--space-between mr-4"}>
                                              <div
                                                // className={"tutor-intro-2"}
                                                onClick={() => {
                                                  handleAccept(item.id);
                                                }
                                                }>
                                                <i className="tutor-intro-2 icon icon--base icon--check icon--primary"></i>
                                              </div>
                                              <div
                                                // className={"tutor-intro-3"}
                                                onClick={() => {
                                                  handleDeny(item.id);
                                                }
                                                }>
                                                <i className="tutor-intro-3 icon icon--base icon--close-request icon--primary tutor-intro-3"></i>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </React.Fragment>
                                  );
                                })
                              ) : (
                                <div className="tutor-list__no-results mt-30">
                                  <p className="dashboard__requests__title">{t('DASHBOARD.REQUESTS.EMPTY')}</p>
                                </div>
                              )}
                            </div>
                          ) : null}
                            <div className="row">
                                <div className="col col-12 col-xl-5  tutor-intro-4">
                                    <div className="type--color--tertiary mb-2">{t('DASHBOARD.SCHEDULE.TITLE')}</div>
                                    {todayScheduled.length > 0 ? (
                                        <div className="card--dashboard card--dashboard--brand mb-xl-0 mb-8 h2 h--150">
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
                                                        disabled={activeIndex === todayScheduled.length - 1 || todayScheduled.length == 0}
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
                                                        className="btn btn--base card--dashboard__btn tutor-intro-5"
                                                        onClick={() => handleJoinBooking(todayScheduled[activeIndex])}
                                                    >
                                                        {t('DASHBOARD.SCHEDULE.BUTTON')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="btn btn--base card--dashboard__btn tutor-intro-5"
                                                        // style={{ visibility: 'hidden' }}
                                                    >
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
                                  disabled={activeIndex === todayScheduled.length - 1 || todayScheduled.length == 0}
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
                          <div className="card--dashboard h--150 intro-2-dashboard">
                                            <div className="flex--primary mb-2 ">
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
                                                        disabled={activeMsgIndex === unreadChatrooms.length - 1 || unreadChatrooms.length == 0}
                                                    >
                                                        <i className="icon icon--base icon--chevron-right icon--primary"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="card--dashboard__text card--dashboard__text--ellipsis text-elipsis h--40--max"
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
                                className="btn btn--sm card--dashboard__btn"
                                                    onClick={() => handleGoToChat(unreadChatrooms[activeMsgIndex])}
                                                >
                                                    {t('DASHBOARD.MESSAGES.BUTTON')}
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card--dashboard h--150">
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
                                                        disabled={activeMsgIndex === unreadChatrooms.length - 1 || unreadChatrooms.length == 0}
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
                                <div className="type--color--tertiary mb-2">{groupedUpcomming && Object.keys(groupedUpcomming).length > 0 ? t('DASHBOARD.BOOKINGS.TITLE') : t('DASHBOARD.BOOKINGS.RECOMMENDED')}</div>

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

                                                      <UpcomingLessonItem
                                                        id={item.id}
                                                        firstName={item.User.firstName}
                                                        lastName={item.User.lastName}
                                                        levelAbrv={item.Level.abrv}
                                                        subjectAbrv={item.Subject.abrv}
                                                        startTime={item.startTime}
                                                        endTime={item.endTime}
                                  />
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      ) : (

                        userRole !== RoleOptions.Tutor && loadedTutorItems.length > 0 &&
                        <div className='flex flex--col flex--ai--center'>

                          <div className="flex flex--row w--100 flex--wrap flex--gap-20 flex--jc--center field__w-fit-content align--center p-4 overflow--y--scroll pb-10">

                            {loadedTutorItems.map((tutor) =>
                            <RecommendedTutorCard className="p-4 h--350" key={tutor.id} tutor={tutor} />
                            )}

                            {/*<RecommendedTutorCard className="p-4 cur--pointer h--350" tutor={tutorItem}/>*/}
                            {/*<RecommendedTutorCard className="p-4 105 cur--pointer" tutor={tutorItem}/>*/}
                          </div>
                          <Link
                            to={PATHS.SEARCH_TUTORS}
                            className="type--center w--100">{t('DASHBOARD.BOOKINGS.SHOW_MORE')}</Link>
                        </div>

                      )}
                    </div>
                  </div>
                </div>
              </div>

              {learnCubeModal && <LearnCubeModal bookingId={currentlyActiveBooking} handleClose={() => {
                setLearnCubeModal(false);
              }} />}
              {tutorHiLinkModalActive && <HiLinkModalForTutorIntro roomLink={tutorialRoomLink} handleClose={handleClose}/>}

              <NotificationsSidebar sideBarIsOpen={notificationSidebarOpen} title={"Notifications"} closeSidebar={()=> setNotificationSidebarOpen(false)} >
                  <div className="flex--primary mb-2 mr-2">
                    <div className="type--color--tertiary">{t('DASHBOARD.NOTIFICATIONS.TITLE')}</div>
                    {notificationsData?.content && notificationsData.content.length > 0 && (
                      <div className="type--color--brand type--wgt--bold cur--pointer" onClick={() => markAllAsRead()}>
                        {t('DASHBOARD.NOTIFICATIONS.CLEAR')}
                      </div>
                    )}
                  </div>
                  <div className="mr-2">
                    {notificationsData?.content && notificationsData.content.find((x) => x.read === false) ? (
                      notificationsData.content.map((notification: INotification) => {
                        if (!notification.read) {
                          return <NotificationItem key={notification.id} notificationData={notification}/>;
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
                  </div>
              </NotificationsSidebar>
            </div>
          </MainWrapper>)}
            </>)}
        </>
    );
};

export default Dashboard;
