import { t } from 'i18next';

import ICompletedLesson from '../../my-bookings/interfaces/ICompletedLesson';
import React from 'react';
import ImageCircle from '../../../components/ImageCircle';

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
            {lesson.Tutor.User?.profileImage ? (
            <img
                className="image__profile image__profile--md mr-4"
                src={lesson.Tutor.User.profileImage}
                alt="tutor profile picture"
              />
            ) : (
              <ImageCircle
                className="lessons-list__item__img image__profile"
                fontSize={20}
                initials={`${lesson.Tutor.User?.firstName.charAt(0)}${lesson.Tutor.User?.lastName.charAt(0)}`}
              />
            )}

            <div className="lessons-list__item__info">
                <div className="type--wgt--bold">
                    {lesson.Tutor.User.firstName}&nbsp;{lesson.Tutor.User.lastName}
                </div>
                <div className="type--color--brand">
                  {t(`SUBJECTS.${lesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                </div>
                <div className="type--color--brand">
                  {t(`LEVELS.${lesson.level.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}
                </div>
            </div>
            <div>
               {t('COMPLETED_LESSONS.COUNT_EXTENSION')  + ': '}{lesson.count}&nbsp;
            </div>
        </div>
    );
};

export default CompletedLessonsItem;
