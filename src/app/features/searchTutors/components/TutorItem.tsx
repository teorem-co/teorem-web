import { t } from 'i18next';
import { uniqBy } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ISubject from '../../../../interfaces/ISubject';
import ITutor from '../../../../interfaces/ITutor';
import ITutorSubject from '../../../../interfaces/ITutorSubject';
import ImageCircle from '../../../components/ImageCircle';
import { PATHS } from '../../../routes';
import CustomSubjectList from './CustomSubjectList';

interface Props {
    tutor: ITutor;
}

const TutorItem: FC<Props> = (props: Props) => {
    const { tutor } = props;

    const [showMore, setShowMore] = useState<boolean>(false);
    const [uniqueSubjects, setUniqueSubjects] = useState<ISubject[]>([]);

    useEffect(() => {
        if (tutor.TutorSubjects.length > 0) {
            const tutorNames: ISubject[] = tutor.TutorSubjects.map(
                (item: ITutorSubject) => {
                    const test = item.Subject;
                    return test;
                }
            );
            setUniqueSubjects(tutorNames);
        }
    }, [tutor]);

    const handleLongText = (text: string) => {
        let showText: string = '';
        if (showMore) {
            showText = text;
        } else {
            showText = text.slice(0, 300) + '...';
        }

        return (
            <div>
                <div>{showText}</div>
                <p
                    onClick={() => setShowMore(!showMore)}
                    className="type--color--brand mt-2 cur--pointer"
                >
                    show {showMore ? 'less' : 'more'}
                </p>
            </div>
        );
    };

    return (
        <>
            <div className="tutor-list__item">
                <div className="tutor-list__item__img">
                    {tutor.User.File?.path ? (
                        <img
                            src={tutor.User.File && tutor.User.File.path}
                            alt="tutor-list"
                        />
                    ) : (
                        <ImageCircle
                            initials={`${
                                tutor.User.firstName
                                    ? tutor.User.firstName.charAt(0)
                                    : ''
                            }${
                                tutor.User.lastName
                                    ? tutor.User.lastName.charAt(0)
                                    : ''
                            }`}
                            imageBig={true}
                        />
                    )}
                </div>
                <div className="tutor-list__item__info">
                    <div className="type--md mb-1">
                        {tutor.User.firstName && tutor.User.lastName
                            ? `${tutor.User.firstName} ${tutor.User.lastName}`
                            : ''}
                    </div>
                    <div className="type--color--brand mb-4">
                        {tutor.currentOccupation
                            ? tutor.currentOccupation
                            : t('SEARCH_TUTORS.NOT_FILLED')}
                    </div>
                    <div
                        className={`type--color--secondary ${
                            tutor.TutorSubjects.length > 0 ? 'mb-6' : ''
                        } w--632--max`}
                    >
                        {tutor.aboutTutor
                            ? tutor.aboutTutor
                                ? tutor.aboutTutor.length > 300
                                    ? handleLongText(tutor.aboutTutor)
                                    : tutor.aboutTutor
                                : ''
                            : t('SEARCH_TUTORS.NOT_FILLED')}
                    </div>
                    {tutor.TutorSubjects.length > 0 ? (
                        <CustomSubjectList
                            subjects={uniqBy(uniqueSubjects, 'name')}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className="tutor-list__item__details">
                    <div className="flex--grow mb-6">
                        <div className="flex flex--center mb-3">
                            <i className="icon icon--pricing icon--base icon--grey"></i>
                            <span className="d--ib ml-4">
                                {/* Add later */}
                                $44 - $45 /hr
                            </span>
                        </div>
                        <div className="flex flex--center mb-3">
                            <i className="icon icon--star icon--base icon--grey"></i>
                            <span className="d--ib ml-4">
                                {/* Add later */}
                                4.9
                            </span>
                        </div>
                        <div className="flex flex--center">
                            <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                            <span className="d--ib ml-4">
                                {/* Add later */}
                                15 completed lessons
                            </span>
                        </div>
                    </div>
                    <div>
                        <Link
                            className="btn btn--primary btn--base w--100 mb-3"
                            to={`${PATHS.SEARCH_TUTORS}/bookings/${tutor.userId}`}
                        >
                            {t('SEARCH_TUTORS.BOOK_LESSON')}
                        </Link>
                        <Link
                            className="btn btn--primary btn--base w--100"
                            to={`${PATHS.SEARCH_TUTORS}/profile/${tutor.userId}`}
                        >
                            {t('SEARCH_TUTORS.VIEW_PROFILE')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TutorItem;
