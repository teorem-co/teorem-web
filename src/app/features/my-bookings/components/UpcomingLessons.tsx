import { IUpcomingLessons } from '../../../constants/upcomingLessons';

interface Props {
    upcomingLessons: IUpcomingLessons[];
}

const UpcomingLessons: React.FC<Props> = (props: Props) => {
    const { upcomingLessons } = props;

    return (
        <>
            <p className="upcoming-lessons__title">UPCOMING EVENTS</p>
            {upcomingLessons.map((lesson: IUpcomingLessons) => {
                return (
                    <div key={lesson.id} className="card card--primary mb-2">
                        <div className="flex--primary mb-2">
                            <div className="flex flex--center">
                                <i
                                    className={`status--primary status--primary--${lesson.status} mr-2`}
                                ></i>
                                <span className="type--color--secondary">
                                    {lesson.startTime}
                                </span>
                                &nbsp;{'-'}&nbsp;
                                <span className="type--color--secondary">
                                    {lesson.endTime}
                                </span>
                            </div>
                            <div className="type--color--tertiary">
                                {lesson.date}
                            </div>
                        </div>
                        <div>{lesson.user}</div>
                    </div>
                );
            })}
        </>
    );
};

export default UpcomingLessons;
