import { useState } from 'react';

import MainWrapper from '../../components/MainWrapper';
import completedLessonsList, {
    ICompletedLesson,
    IVideoLesson,
} from '../../constants/completedLessonsList';
import CompletedLessonsItem from './components/CompletedLessonsItem';
import VideoLessonItem from './components/VideoLessonItem';

const CompletedLessons = () => {
    const [activeLesson, setActiveLesson] = useState<ICompletedLesson | null>(
        completedLessonsList[0] ? completedLessonsList[0] : null
    );

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
                        <div>Completed Lessons</div>
                    </div>
                    <div className="card--lessons__body">
                        <div className="card--lessons__body__aside">
                            <div className="mt-10 mb-10 ml-6 mr-6">
                                <span className="type--uppercase type--color--tertiary">
                                    Tutor Available
                                </span>
                                <span className="tag--primary d--ib ml-2">
                                    {completedLessonsList.length
                                        ? completedLessonsList.length
                                        : '0'}
                                </span>
                            </div>
                            <div className="lessons-list">
                                {completedLessonsList.map(
                                    (lesson: ICompletedLesson) => {
                                        return (
                                            <CompletedLessonsItem
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
                                                <button className="btn btn--base btn--clear">
                                                    Leave review
                                                </button>
                                                <button className="btn btn--base btn--primary">
                                                    View Calendar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="mb-2">
                                            Play / Download Lessons
                                        </div>
                                        <div className="dash-wrapper">
                                            {activeLesson.lessons.map(
                                                (videoLesson: IVideoLesson) => {
                                                    return (
                                                        <VideoLessonItem
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
                                <>There is no completed lessons</>
                            )}
                        </div>
                    </div>
                </div>
            </MainWrapper>
        </>
    );
};

export default CompletedLessons;
