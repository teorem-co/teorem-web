import { t } from 'i18next';

import ICompletedLesson from '../../my-bookings/interfaces/ICompletedLesson';

interface Props {
    lesson: ICompletedLesson;
    activeLesson: string;
    handleActiveLessons: (lessonId: string) => void;
}

const CompletedLessonsItem = (props: Props) => {
    const { lesson, activeLesson, handleActiveLessons } = props;

    return (
        <div
            key={lesson.id}
            className={`lessons-list__item ${activeLesson === lesson.id ? 'active' : ''}`}
            onClick={() => handleActiveLessons(lesson.id)}
        >
            <img className="lessons-list__item__img" src={'https://' + lesson.Tutor.User.profileImage} alt="tutor profile picture" />
            <div className="lessons-list__item__info">
                <div className="type--wgt--bold">
                    {lesson.Tutor.User.firstName}&nbsp;{lesson.Tutor.User.lastName}
                </div>
                <div className="type--color--brand">{t(`SUBJECTS.${lesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</div>
            </div>
            <div>
                {lesson.count}&nbsp;{t('COMPLETED_LESSONS.COUNT_EXTENSION')}
            </div>
        </div>
    );
};

export default CompletedLessonsItem;
