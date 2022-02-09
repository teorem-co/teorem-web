import { t } from 'i18next';
import { useState } from 'react';

import MainWrapper from '../../components/MainWrapper';
import LoaderAvailableLessons from '../../components/skeleton-loaders/LoaderAvailableLessons';
import LoaderLessonCard from '../../components/skeleton-loaders/LoaderLessonCard';
import completedLessonsList, {
    ICompletedLesson,
    IVideoLesson,
} from '../../constants/completedLessonsList';
import CompletedLessonsItem from './components/CompletedLessonsItem';
import ReviewModal from './components/ReviewModal';
import VideoLessonItem from './components/VideoLessonItem';

const CompletedLessons = () => {
    const [activeLesson, setActiveLesson] = useState<ICompletedLesson | null>(
        completedLessonsList[0] ? completedLessonsList[0] : null
    );
    const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);

    const handleActiveLessons = (lessonId: string) => {
        const currentlyActiveLesson = completedLessonsList.find(
            (currentLessonId: ICompletedLesson) =>
                currentLessonId.id === lessonId
        );
        setActiveLesson(currentlyActiveLesson ? currentlyActiveLesson : null);
    };

    return (
        <>
            <MainWrapper>
                <div className="card--lessons">
                    <div className="card--lessons__head">
                        <div>{t('COMPLETED_LESSONS.TITLE')}</div>
                    </div>
                    <div className="card--lessons__body">
                        <div className="card--lessons__body__aside">
                            <div className="mt-10 mb-10 ml-6 mr-6">
                                <span className="type--uppercase type--color--tertiary">
                                    {t('COMPLETED_LESSONS.TUTORS_AVAILABLE')}
                                </span>
                                <span className="tag--primary d--ib ml-2">
                                    {completedLessonsList.length
                                        ? completedLessonsList.length
                                        : '0'}
                                </span>
                            </div>
                            <div className="lessons-list">
                                {completedLessonsList.length > 0 ? (
                                    completedLessonsList.map(
                                        (lesson: ICompletedLesson) => {
                                            return (
                                                <CompletedLessonsItem
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    activeLesson={
                                                        activeLesson
                                                            ? activeLesson.id
                                                            : ''
                                                    }
                                                    handleActiveLessons={
                                                        handleActiveLessons
                                                    }
                                                />
                                            );
                                        }
                                    )
                                ) : (
                                    <>
                                        {t(
                                            'COMPLETED_LESSONS.EMPTY_LESSONS_LIST'
                                        )}
                                    </>
                                )}
                                {
                                    //loader for available lessons
                                    //-------------------------------------
                                    //<LoaderAvailableLessons /> - add this when backend is finished
                                    //-------------------------------------
                                }
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
                                                    src={activeLesson.tutorImg}
                                                    alt="tutor profile picture"
                                                />
                                                <div>
                                                    <div className="type--md mb-1">
                                                        {activeLesson.subject}
                                                    </div>
                                                    <div className="type--color--brand">
                                                        {activeLesson.tutorName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        setActiveReviewModal(
                                                            true
                                                        )
                                                    }
                                                    className="btn btn--base btn--clear mr-4"
                                                >
                                                    {t(
                                                        'COMPLETED_LESSONS.LEAVE_REVIEW'
                                                    )}
                                                </button>
                                                <button className="btn btn--base btn--primary">
                                                    {t(
                                                        'COMPLETED_LESSONS.VIEW_CALENDAR'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="mb-2">
                                            {t(
                                                'COMPLETED_LESSONS.VIDEOS_TITLE'
                                            )}
                                        </div>
                                        <div className="dash-wrapper">
                                            {activeLesson.lessons.map(
                                                (videoLesson: IVideoLesson) => {
                                                    return (
                                                        <VideoLessonItem
                                                            key={videoLesson.id}
                                                            videoLesson={
                                                                videoLesson
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
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
                {activeReviewModal ? (
                    <ReviewModal
                        tutorId="asd"
                        handleClose={() => setActiveReviewModal(false)}
                    />
                ) : (
                    <></>
                )}
            </MainWrapper>
        </>
    );
};

export default CompletedLessons;
