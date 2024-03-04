import { t } from 'i18next';
import { uniq } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCircle from '../../../components/ImageCircle';
import { PATHS } from '../../../routes';
import ITutorItem from '../../../../interfaces/ITutorItem';
import CustomSubjectList from './CustomSubjectList';

interface Props {
    tutor: ITutorItem;
}

const TutorItem: FC<Props> = (props: Props) => {
    const { tutor } = props;
    const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);

    useEffect(() => {
        if (tutor.subjects.length > 0) {
            setUniqueSubjects(tutor.subjects);
        }
    }, [tutor]);

    const handleLongText = (text: string) => {
        let showText: string = '';
        showText = text.slice(0, 300) + '...';
        return <div className="type--break">{showText}</div>;
    };

    // const cacheBuster = Date.now();
    return (
        <>
            <div className="tutor-list__item">
                <div className="tutor-list__item__img">
                    {tutor.profileImage ? (
                        <img src={`${tutor.profileImage}`} alt="tutor-list" />
                    ) : (
                        <ImageCircle
                            initials={`${tutor.firstName ? tutor.firstName.charAt(0) : ''}${tutor.lastName ? tutor.lastName.charAt(0) : ''}`}
                            imageBig={true}
                        />
                    )}
                </div>
                <div className="tutor-list__item__info">
                    <div className="type--md mb-1">{tutor.firstName && tutor.lastName ? `${tutor.firstName} ${tutor.lastName}` : ''}</div>
                    <div className="type--color--brand mb-4">
                        {tutor.currentOccupation ? tutor.currentOccupation : t('SEARCH_TUTORS.NOT_FILLED')}{' '}
                    </div>
                    <div className={`type--color--secondary w--632--max`}>
                        {tutor.aboutTutor
                            ? tutor.aboutTutor
                                ? tutor.aboutTutor.length > 300
                                    ? handleLongText(tutor.aboutTutor)
                                    : tutor.aboutTutor
                                : ''
                            : t('SEARCH_TUTORS.NOT_FILLED')}
                    </div>
                    <div className={`type--color--secondary mb-4 mt-2 ${tutor.subjects.length > 0 ? 'mb-6' : ''}`}>
                        {t('SEARCH_TUTORS.YEARS_OF_EXPERIENCE')} {tutor.yearsOfExperience}
                    </div>

                    {tutor.subjects.length > 0 ? <CustomSubjectList subjects={uniq(uniqueSubjects)} /> : <></>}
                </div>
                <div className="tutor-list__item__details">
                    <div className="flex--grow mb-6">
                        <div className="flex flex--center mb-3">
                            <i className="icon icon--pricing icon--base icon--grey"></i>
                            {tutor.minPrice ? (
                                <span className="d--ib ml-4">
                                    {tutor.minPrice} {tutor.currencyCode}
                                    {tutor.minPrice !== tutor.maxPrice && (
                                        <>
                                            &nbsp;-&nbsp;
                                            {tutor.maxPrice} {tutor.currencyCode}
                                        </>
                                    )}
                                    &nbsp;/h
                                </span>
                            ) : (
                                <span className="d--ib ml-4">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                            )}
                        </div>

                        <div className="flex flex--center mb-3">
                            <i className="icon icon--star icon--base icon--grey"></i>
                            <span className="d--ib ml-4">
                                {/* Add later */}
                                {tutor.averageGrade ? tutor.averageGrade.toFixed(1) : 0}
                            </span>
                        </div>
                        <div className="flex flex--center">
                            <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                            <span className="d--ib ml-4">
                                {/* Add later */}
                                {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                            </span>
                        </div>
                    </div>
                    <div className="type--center">
                        <Link
                            className="btn btn--primary btn--base w--100 mb-3"
                            to={`${PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutor.slug)}`}
                        >
                            {t('SEARCH_TUTORS.BOOK_LESSON')}
                        </Link>
                        <Link
                            className="btn btn--base btn--ghost--bordered w--100 type--wgt--extra-bold"
                            to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
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
