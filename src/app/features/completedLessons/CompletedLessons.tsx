import { t } from 'i18next';
import { cloneDeep, debounce, groupBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import note from '../../../assets/images/note.png';
import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderAvailableLessons
  from '../../components/skeleton-loaders/LoaderAvailableLessons';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import { useLazyGetRecordedRoomsQuery } from '../../services/learnCubeService';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import {
  IBookingInfo, IGetBookingInfo,
  useLazyGetCompletedLessonsBookingInfoQuery,
  useLazyGetCompletedLessonsQuery,
} from '../my-bookings/services/completedLessonsService';
import CompletedLessonsItem from './components/CompletedLessonsItem';
import GroupedLessons from './components/GroupedLessons';
import ReviewModal from './components/ReviewModal';
import StudentBookingInfoItem from './StudentBookingInfoItem';
import IParams from '../notifications/interfaces/IParams';
import { IChatMessagesQuery } from '../chat/services/chatService';
import moment from 'moment';
import React from 'react';
import ImageCircle from '../../components/ImageCircle';

const CompletedLessons = () => {
  const [studentCompletedBookings, setStudentCompletedBookings] = useState<IBookingInfo[]>([]);
  const [page, setPage] = useState<number>(0);
  const lessonsRpp = 10;
  const [activeLesson, setActiveLesson] = useState<ICompletedLesson | null>(null);
  const studentBookingsRef = useRef<HTMLDivElement>(null);
  const asideContainerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<IParams>({ size: lessonsRpp, page: 0 });
  const [scrollTopOffset, setScrollTopOffset] = useState<number | null>(null);
  const bookingDebouncedScrollHandler = debounce((e) => handleBookingsScroll(e), 500);
  const asideDebouncedScrollHandler = debounce((e) => handleAsideScroll(e), 500);

  const [getCompletedLessons, { isLoading: listLoading, isUninitialized: listUninitialized }] = useLazyGetCompletedLessonsQuery();
  const [getRecordedRooms] = useLazyGetRecordedRoomsQuery();
  const [getCompletedLessonsBookingInfo] = useLazyGetCompletedLessonsBookingInfoQuery();
  const [completedLessonsState, setCompletedLessonsState] = useState<ICompletedLesson[]>([]);
  const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);

  const userRole = useAppSelector((state) => state.auth.user!.Role.abrv);
  const loadingList = listLoading || listUninitialized;

  const handleBookingsScroll = async (e: HTMLDivElement) => {

    if (studentCompletedBookings.length !== activeLesson?.count && activeLesson) {
      const innerHeight = e.scrollHeight;
      const scrollPosition = e.scrollTop + e.clientHeight;

      if (innerHeight === scrollPosition ) {
        //action to do on scroll to bottom
        const newParams = { ...params };
        newParams.page++;

        const currentScrollTop = e.scrollTop;
        setScrollTopOffset(currentScrollTop);

        const toSend: IGetBookingInfo = {
          subjectId: activeLesson?.subjectId,
          tutorId: activeLesson?.tutorId,
          studentId: activeLesson?.studentId,
          page: newParams.page,
          rpp: newParams.size
        };

        const completedLessonsResponse = await getCompletedLessonsBookingInfo(toSend).unwrap();
        setStudentCompletedBookings(studentCompletedBookings.concat(completedLessonsResponse));
      }
    }
  };

  const handleAsideScroll = async (e: HTMLDivElement) => {
    //TODO: do pagination in form of scroll
  };

  useEffect(() => {
    if (activeLesson && page > 0) {
      const toSend: IGetBookingInfo = {
        subjectId: activeLesson?.subjectId,
        tutorId: activeLesson?.tutorId,
        studentId: activeLesson?.studentId,
        page: page,
        rpp: lessonsRpp
      };

      getCompletedLessonsBookingInfo(toSend).unwrap().then(res =>{
        setStudentCompletedBookings(res);
      });

    }
  }, [page]);

  const handleActiveLessons = async (lessonId: string) => {

    if (completedLessonsState) {
      const currentlyActiveLesson = completedLessonsState.find((currentLessonId: ICompletedLesson) => currentLessonId.id === lessonId);
      setActiveLesson(currentlyActiveLesson ? currentlyActiveLesson : null);

      //get recorded lessons:
      if (currentlyActiveLesson) {
        const toSend: IGetBookingInfo = {
          subjectId: currentlyActiveLesson?.subjectId,
          tutorId: currentlyActiveLesson?.tutorId,
          studentId: currentlyActiveLesson?.studentId,
          page: 0,
          rpp: lessonsRpp
        };

        const res = await  getCompletedLessonsBookingInfo(toSend).unwrap();
        setStudentCompletedBookings(res);
      }
    }
  };

  const renderGroupedLessons = () => {
    const groupedList = groupBy(completedLessonsState, 'studentId');

    return Object.keys(groupedList).map((studentId: string, index: number) => (
      <GroupedLessons
        index={index}
        studentId={studentId}
        activeLesson={activeLesson}
        handleActiveLessons={handleActiveLessons}
        groupedList={groupedList}
      />
    ));
  };

  const fetchData = async () => {
     const completedLessonsResponse = await getCompletedLessons().unwrap();
     setCompletedLessonsState(completedLessonsResponse);
    const currentlyActiveLesson = completedLessonsResponse[0];
    setActiveLesson(completedLessonsResponse[0]);

    if (currentlyActiveLesson) {
      const toSend: IGetBookingInfo = {
        subjectId: currentlyActiveLesson?.subjectId,
        tutorId: currentlyActiveLesson?.tutorId,
        studentId: currentlyActiveLesson?.studentId,
        page: 0,
        rpp: lessonsRpp
      };

      const res = await  getCompletedLessonsBookingInfo(toSend).unwrap();
      setStudentCompletedBookings(res);
    }

  };

  const onReviewSubmit = async (lessonId: string) => {
    //change state of completed lessons
    const completedLessonsCloned = cloneDeep(completedLessonsState);
    const reviewedLessonIndex = completedLessonsCloned.findIndex((x) => x.id === lessonId)!;
    completedLessonsCloned[reviewedLessonIndex].isReview = true;
    //chamge state of active lesson
    const activeLessonCloned = cloneDeep(activeLesson);
    activeLessonCloned!.isReview = true;
    //set new states;
    setActiveLesson(activeLessonCloned);
    setCompletedLessonsState(completedLessonsCloned);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMonthFromStartTime = (startTime: string) => {

    return moment(startTime).format('MMMM').charAt(0).toUpperCase() + moment(startTime).format('MMMM').slice(1);
  };

  return (
    <>
      <MainWrapper>
        <div className="card--lessons">
          <div className="card--lessons__head">
            <div>{t('COMPLETED_LESSONS.TITLE')}</div>
          </div>
          <div className="card--lessons__body">
            <div className="card--lessons__body__aside" ref={asideContainerRef} onScroll={(e: any) => asideDebouncedScrollHandler(e.target)}>
              {/*hide lesson counter if parent is logged in*/}
              {userRole !== RoleOptions.Parent && (
                <div className="mt-10 mb-10 ml-6 mr-6">
                  <span className="type--uppercase type--color--tertiary">{t('COMPLETED_LESSONS.LESSONS_AVAILABLE')}</span>
                  <span className="tag--primary d--ib ml-2">{completedLessonsState.length ? completedLessonsState.length : '0'}</span>
                </div>
              )}
              <div className="lessons-list">
                {loadingList ? (
                  <LoaderAvailableLessons />
                ) : completedLessonsState.length > 0 ? (
                  userRole === RoleOptions.Parent ? (
                    renderGroupedLessons()
                  ) : (
                    completedLessonsState.map((lesson: ICompletedLesson) => {
                      return (
                        <CompletedLessonsItem
                          key={lesson.id}
                          lesson={lesson}
                          activeLesson={activeLesson ? activeLesson.id : ''}
                          handleActiveLessons={handleActiveLessons}
                        />
                      );
                    })
                  )
                ) : (
                  <>
                    <div className={`lessons-list__item mt-6`}>
                      <div className="lessons-list__item__info">
                        <div className="type--wgt--bold">{t('COMPLETED_LESSONS.EMPTY_LESSONS_TITLE')}</div>
                        <div className="type--color--brand">{t('COMPLETED_LESSONS.EMPTY_LESSONS_LIST')}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card--lessons__body__main"  ref={studentBookingsRef} onScroll={(e: any) => bookingDebouncedScrollHandler(e.target)}>
              {activeLesson  && studentCompletedBookings.length > 0 ? (
                <>
                  <div>
                    <div>
                    </div>
                    <div className="flex--primary">
                      <div className="flex flex--center">
                        {activeLesson.Tutor.User?.profileImage ? (
                          <img
                            className="image__profile image__profile--md mr-4"
                            src={activeLesson.Tutor.User.profileImage}
                            alt="tutor profile picture"
                          />
                        ) : (
                          <ImageCircle
                            style={{border: '11px solid $color-primary-lighter'}}
                            className="image__profile--md mr-4"
                            imageBig={true}
                            fontSize={30}
                            initials={`${activeLesson.Tutor.User?.firstName.charAt(0)}${activeLesson.Tutor.User?.lastName.charAt(0)}`}
                          />
                        )}
                        <div>
                          <div className="type--md mb-1">
                            {activeLesson.Tutor.User.firstName}&nbsp;{activeLesson.Tutor.User.lastName}
                          </div>
                          <div className="type--color--brand">
                            {t(`SUBJECTS.${activeLesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                          </div>
                          <div className="type--color--brand">
                            {t(`LEVELS.${activeLesson.level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                          </div>
                        </div>
                      </div>
                      <div>
                        {!activeLesson.isReview && userRole !== 'child' && (
                          <button onClick={() => setActiveReviewModal(true)} className="btn btn--base btn--clear mr-4">
                            {t('COMPLETED_LESSONS.LEAVE_REVIEW')}
                          </button>
                        )}

                        <Link className="btn btn--primary btn--base" to={`${PATHS.SEARCH_TUTORS}/bookings/${activeLesson.Tutor.slug}`}>
                          {t('COMPLETED_LESSONS.VIEW_CALENDAR')}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    {/*play/download lessons*/}
                    <div className="mb-2 text-align--center">{t('COMPLETED_LESSONS.VIDEOS_TITLE')}</div>
                    {/*
                          //add completed lessons from learncube

                          <div className="dash-wrapper">
                              {completedLessonsList[0].lessons.map((videoLesson: IVideoLesson) => {
                                  return <VideoLessonItem key={videoLesson.id} videoLesson={videoLesson} />;
                              })}
                          </div>
                      */}
                    {/*<div className="card card--primary w--100 pl-6">*/}
                    {/*  <div className="flex--primary">*/}
                    {/*    <div>*/}
                    {/*      <div className="mb-2 type--lg type--wgt--bold">{t('DASHBOARD.COMING_SOON.TITLE')}</div>*/}
                    {/*      <div className="type--color--secondary">{t('DASHBOARD.COMING_SOON.SUBTITLE')}</div>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*      <img className="w--170" src={note} alt="coming soon" />*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</div>*/}

                    <div>
                      {/*{studentCompletedBookings.map((booking, index) => (*/}
                      {/*  <StudentBookingInfoItem key={index} bookingInfo={booking} activeLesson={activeLesson}/>*/}
                      {/*))}*/}

                      {studentCompletedBookings.map((booking, index) => {
                        const currentMonth = getMonthFromStartTime(booking.startTime);
                        const previousBooking = studentCompletedBookings[index - 1];
                        const previousMonth = previousBooking ? getMonthFromStartTime(previousBooking.startTime) : null;

                        return (
                          <React.Fragment key={index}>
                            {(index === 0 || currentMonth !== previousMonth) && (
                              <div className="separation-line">
                                {currentMonth} {moment(booking.startTime).year()}
                              </div>
                            )}
                            <StudentBookingInfoItem bookingInfo={booking} activeLesson={activeLesson} />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="tutor-list__no-results">
                    <h1 className="tutor-list__no-results__title">{t('COMPLETED_LESSONS.EMPTY_LESSONS_TITLE')}</h1>
                    <p className="tutor-list__no-results__subtitle">{t('COMPLETED_LESSONS.EMPTY_VIDEOS')}</p>
                    <Link className="btn btn--clear ml-6 type--wgt--bold" to={t('PATHS.MY_BOOKINGS')}>
                      {t('COMPLETED_LESSONS.LINK')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {activeReviewModal ? (
          <ReviewModal activeLesson={activeLesson} handleClose={() => setActiveReviewModal(false)} onCompletedReview={onReviewSubmit} />
        ) : (
          <></>
        )}
      </MainWrapper>
    </>
  );
};

export default CompletedLessons;
