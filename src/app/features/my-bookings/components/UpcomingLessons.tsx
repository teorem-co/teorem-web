import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { IUpcomingLessons } from '../../../constants/upcomingLessons';

interface Props {
    upcomingLessons: IUpcomingLessons[];
}

const UpcomingLessons: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation();
    const { upcomingLessons } = props;

    return (
        <>
            <p className="upcoming-lessons__title">
                {t('UPCOMING_LESSONS.TITLE')}
            </p>
            {upcomingLessons.map((lesson: IUpcomingLessons) => {
                return (
                    <div key={lesson.id} className="card card--primary mb-2">
                        <div className="flex--primary mb-2">
                            <div className="flex flex--center">
                                {/* <i
                                    className={`status--primary status--primary--${lesson.status} mr-2`}
                                ></i> */}
                                <i
                                    className={`status--primary status--primary--blue mr-2`}
                                ></i>
                                <span className="type--color--secondary">
                                    {moment(lesson.startTime).format('HH:mm')}
                                </span>
                                &nbsp;{'-'}&nbsp;
                                <span className="type--color--secondary">
                                    {moment(lesson.endTime).format('HH:mm')}
                                </span>
                            </div>
                            <div className="type--color--tertiary">
                                {moment(lesson.startTime).format('DD/MM/YYYY')}
                            </div>
                        </div>
                        <div>
                            {lesson.User.firstName} {lesson.User.lastName}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default UpcomingLessons;
