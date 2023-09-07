import moment from 'moment';
import { useTranslation } from 'react-i18next';

import IUpcomingLessons from '../interfaces/IUpcomingLessons';

interface Props {
    upcomingLessons: IUpcomingLessons[];
}

const UpcomingLessons: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation();
    const { upcomingLessons } = props;

    return (
        <>
            {/*<p className="upcoming-lessons__title">{t('UPCOMING_LESSONS.TITLE')}</p>*/}
            {/*{upcomingLessons.length > 0 ? (*/}
            {/*    upcomingLessons.map((lesson: IUpcomingLessons) => {*/}
            {/*        return (*/}
            {/*            <div key={lesson.id} className="card card--primary card--primary--shadow mb-2">*/}
            {/*                <div className="flex--primary mb-2">*/}
            {/*                    <div className="flex flex--center">*/}
            {/*                        /!* <i*/}
            {/*                        className={`status--primary status--primary--${lesson.status} mr-2`}*/}
            {/*                    ></i> *!/*/}
            {/*                        <i className={`status--primary status--primary--purple mr-2`}></i>*/}
            {/*                        <span className="type--color--secondary">{moment(lesson.startTime).format('HH:mm')}</span>*/}
            {/*                        &nbsp;{'-'}&nbsp;*/}
            {/*                        <span className="type--color--secondary">{moment(lesson.endTime).add(1, 'minute').format('HH:mm')}</span>*/}
            {/*                    </div>*/}
            {/*                    <div className="type--color--tertiary">{moment(lesson.startTime).format(t('DATE_FORMAT'))}</div>*/}
            {/*                </div>*/}
            {/*                <>*/}
            {/*                    {lesson.User ? (*/}
            {/*                        <div className="flex--primary">*/}
            {/*                            <div className="flex flex--center">*/}
            {/*                                <span className="type--capitalize">{lesson.User.firstName}</span>*/}
            {/*                                &nbsp;*/}
            {/*                                <span className="type--capitalize">{lesson.User.lastName}</span>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex flex--center">*/}
            {/*                                <span className="type--capitalize">{t(`SUBJECTS.${lesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    ) : lesson.Tutor ? (*/}
            {/*                        <div className="flex--primary">*/}
            {/*                            <div className="flex flex--center">*/}
            {/*                                <span className="type--capitalize">{lesson.Tutor.User.firstName}</span>*/}
            {/*                                &nbsp;*/}
            {/*                                <span className="type--capitalize">{lesson.Tutor.User.lastName}</span>*/}
            {/*                            </div>*/}
            {/*                            <div className="flex flex--center">*/}
            {/*                                <span className="type--capitalize">{t(`SUBJECTS.${lesson.Subject.abrv.replace('-', '').replace(' ', '').toLowerCase()}`)}</span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    ) : (*/}
            {/*                        ''*/}
            {/*                    )}*/}
            {/*                </>*/}
            {/*            </div>*/}
            {/*        );*/}
            {/*    })*/}
            {/*) : (*/}
            {/*    <div className="card card--primary card--primary--shadow">*/}
            {/*        <div className="type--color--secondary">{t('UPCOMING_LESSONS.EMPTY')}</div>*/}
            {/*    </div>*/}
            {/*)}*/}

          <p className="upcoming-lessons__title">{t('MY_BOOKINGS.ADDITIONAL_INFORMATION.TITLE')}</p>
          <div className="card card--primary card--primary--shadow">
            <p>info 1</p>
            <p>info 2</p>
            <p>info 3</p>
            <p>info 4</p>
            <p>info 5</p>
            <p>info 6</p>
            <p>info 7</p>
          </div>
        </>
    );
};

export default UpcomingLessons;
