import { t } from 'i18next';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainWrapper from '../../components/MainWrapper';
import LoaderAvailableLessons from '../../components/skeleton-loaders/LoaderAvailableLessons';
import LoaderLessonCard from '../../components/skeleton-loaders/LoaderLessonCard';
import completedLessonsList, { ICompletedLessonMock, IVideoLesson } from '../../constants/completedLessonsList';
import { useAppSelector } from '../../hooks';
import { PATHS } from '../../routes';
import toastService from '../../services/toastService';
import ICompletedLesson from '../my-bookings/interfaces/ICompletedLesson';
import { useLazyGetCompletedLessonsQuery } from '../my-bookings/services/bookingService';
import CompletedLessonsItem from './components/CompletedLessonsItem';
import GroupedLessons from './components/GroupedLessons';
import ReviewModal from './components/ReviewModal';
import VideoLessonItem from './components/VideoLessonItem';

const CompletedLessons = () => {
    const [getCompletedLessons, { data: completedLessons }] = useLazyGetCompletedLessonsQuery();

    const [activeLesson, setActiveLesson] = useState<ICompletedLesson | null>(null);
    const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);

    const userRole = useAppSelector((state) => state.auth.user!.Role.abrv);

    const handleActiveLessons = async (lessonId: string) => {
        if (completedLessons) {
            const currentlyActiveLesson = completedLessons.find((currentLessonId: ICompletedLesson) => currentLessonId.id === lessonId);
            setActiveLesson(currentlyActiveLesson ? currentlyActiveLesson : null);
        }
    };

    const renderGroupedLessons = () => {
        const groupedList = groupBy(completedLessons, 'studentId');

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
        setActiveLesson(completedLessonsResponse[0]);
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
                            {userRole !== 'parent' && (
                                <div className="mt-10 mb-10 ml-6 mr-6">
                                    <span className="type--uppercase type--color--tertiary">Lessons available</span>
                                    <span className="tag--primary d--ib ml-2">{completedLessonsList.length ? completedLessonsList.length : '0'}</span>
                                </div>
                            )}
                            <div className="lessons-list">
                                {completedLessons && completedLessons.length > 0 ? (
                                    userRole === 'parent' ? (
                                        renderGroupedLessons()
                                    ) : (
                                        completedLessons.map((lesson: ICompletedLesson) => {
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
                                    <>{t('COMPLETED_LESSONS.EMPTY_LESSONS_LIST')}</>
                                )}
                                {
                                    //loader for available lessons
                                    //-------------------------------------
                                    //<LoaderAvailableLessons /> - add this when backend is finished
                                    //-------------------------------------
                                }
                            </div>
                            {/* <div className="lessons-list">
                                {completedLessons && completedLessons.length > 0 ? (
                                    renderGroupedLessons()
                                ) : (
                                    <>{t('COMPLETED_LESSONS.EMPTY_LESSONS_LIST')}</>
                                )}
                                {
                                    //loader for available lessons
                                    //-------------------------------------
                                    //<LoaderAvailableLessons /> - add this when backend is finished
                                    //-------------------------------------
                                }
                            </div> */}
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
                                                    <div className="type--md mb-1">{activeLesson.Subject.name}</div>
                                                    <div className="type--color--brand">
                                                        {activeLesson.Tutor.User.firstName}&nbsp;{activeLesson.Tutor.User.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button onClick={() => setActiveReviewModal(true)} className="btn btn--base btn--clear mr-4">
                                                    {t('COMPLETED_LESSONS.LEAVE_REVIEW')}
                                                </button>
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
                                <>{t('COMPLETED_LESSONS.EMPTY_VIDEOS')}</>
                            )}
                            {
                                //loader for selected lesson card
                                //-------------------------------------
                                //<LoaderLessonCard />
                                //-------------------------------------
                            }
                        </div>
                    </div>
                </div>
                {activeReviewModal ? <ReviewModal activeLesson={activeLesson} handleClose={() => setActiveReviewModal(false)} /> : <></>}
            </MainWrapper>
        </>
    );
};

export default CompletedLessons;
