import { t } from 'i18next';
import { cloneDeep, groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { RoleOptions } from '../../../slices/roleSlice';
import MainWrapper from '../../components/MainWrapper';
import LoaderAvailableLessons from '../../components/skeleton-loaders/LoaderAvailableLessons';
import completedLessonsList, { IVideoLesson } from '../../constants/completedLessonsList';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { useLazyGetCompletedLessonsQuery } from '../my-bookings/services/bookingService';
import CompletedLessonsItem from './components/CompletedLessonsItem';
import GroupedLessons from './components/GroupedLessons';
import ReviewModal from './components/ReviewModal';
import VideoLessonItem from './components/VideoLessonItem';

const CompletedLessons = () => {
    const [getCompletedLessons, { isLoading: listLoading, isUninitialized: listUninitialized }] = useLazyGetCompletedLessonsQuery();

    const [activeLesson, setActiveLesson] = useState<ICompletedLesson | null>(null);
    const [completedLessonsState, setCompletedLessonsState] = useState<ICompletedLesson[]>([]);
    const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);

    const userRole = useAppSelector((state) => state.auth.user!.Role.abrv);
    const loadingList = listLoading || listUninitialized;

    const handleActiveLessons = async (lessonId: string) => {
        if (completedLessonsState) {
            const currentlyActiveLesson = completedLessonsState.find((currentLessonId: ICompletedLesson) => currentLessonId.id === lessonId);
            setActiveLesson(currentlyActiveLesson ? currentlyActiveLesson : null);
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
        setActiveLesson(completedLessonsResponse[0]);
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

    return (
        <>
            <MainWrapper>
                <div className="card--lessons">
                    <div className="card--lessons__head">
                        <div>{t('COMPLETED_LESSONS.TITLE')}</div>
                    </div>
                    <div className="card--lessons__body">
                        <div className="card--lessons__body__aside">
                            {/*hide lesson counter if parent is logged in*/}
                            {userRole !== RoleOptions.Parent && (
                                <div className="mt-10 mb-10 ml-6 mr-6">
                                    <span className="type--uppercase type--color--tertiary">{t('COMPLETED_LESSONS.LESSONS_AVAILABLE')}</span>
                                    <span className="tag--primary d--ib ml-2">
                                        {completedLessonsState.length ? completedLessonsState.length : '0'}
                                    </span>
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
                        <div className="card--lessons__body__main">
                            {activeLesson ? (
                                <>
                                    <div>
                                        <div className="flex--primary">
                                            <div className="flex flex--center">
                                                <img
                                                    className="image__profile image__profile--md mr-4"
                                                    src={activeLesson.Tutor.User.profileImage}
                                                    alt="tutor profile picture"
                                                />
                                                <div>
                                                    <div className="type--md mb-1">
                                                        {activeLesson.Tutor.User.firstName}&nbsp;{activeLesson.Tutor.User.lastName}
                                                    </div>
                                                    <div className="type--color--brand">{activeLesson.Subject.name}</div>
                                                </div>
                                            </div>
                                            <div>
                                                {!activeLesson.isReview && (
                                                    <button onClick={() => setActiveReviewModal(true)} className="btn btn--base btn--clear mr-4">
                                                        {t('COMPLETED_LESSONS.LEAVE_REVIEW')}
                                                    </button>
                                                )}

                                                <Link
                                                    className="btn btn--primary btn--base"
                                                    to={`${PATHS.SEARCH_TUTORS}/bookings/${activeLesson.Tutor.userId}`}
                                                >
                                                    {t('COMPLETED_LESSONS.VIEW_CALENDAR')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="mb-2">{t('COMPLETED_LESSONS.VIDEOS_TITLE')}</div>
                                        <div className="dash-wrapper">
                                            {completedLessonsList[0].lessons.map((videoLesson: IVideoLesson) => {
                                                return <VideoLessonItem key={videoLesson.id} videoLesson={videoLesson} />;
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="tutor-list__no-results">
                                        <h1 className="tutor-list__no-results__title">{t('COMPLETED_LESSONS.EMPTY_LESSONS_TITLE')}</h1>
                                        <p className="tutor-list__no-results__subtitle">{t('COMPLETED_LESSONS.EMPTY_VIDEOS')}</p>
                                        <Link className="btn btn--clear ml-6 type--wgt--bold" to={'/my-bookings'}>
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
