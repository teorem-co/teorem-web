import { ICompletedLesson } from '../../../constants/completedLessonsList';

interface Props {
    lesson: ICompletedLesson;
    handleActiveLessons: (lessonId: string) => void;
}

const CompletedLessonsItem = (props: Props) => {
    const { lesson, handleActiveLessons } = props;

    return (
        <div
            key={lesson.id}
            className="lessons-list__item"
            onClick={() => handleActiveLessons(lesson.id)}
        >
            <img
                className="lessons-list__item__img"
                src={lesson.tutorImg}
                alt="tutor profile picture"
            />
            <div className="lessons-list__item__info">
                <div className="type--wgt--bold">{lesson.subject}</div>
                <div className="type--color--brand">{lesson.tutorName}</div>
            </div>
            <div>{lesson.lessonsCount} lessons</div>
        </div>
    );
};

export default CompletedLessonsItem;
