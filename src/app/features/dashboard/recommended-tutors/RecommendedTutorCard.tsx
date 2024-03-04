import { t } from 'i18next';
import React from 'react';

import ITutorItem from '../../../../interfaces/ITutorItem';
import ImageCircle from '../../../components/ImageCircle';
import { StarRating } from '../../myReviews/components/StarRating';
import { LuBookOpenCheck } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes';
import CustomSubjectList from '../../searchTutors/components/CustomSubjectList';

interface Props {
    tutor: ITutorItem;
    onClick?: () => void;
    className?: string;
}

export const RecommendedTutorCard = (props: Props) => {
    const { tutor, onClick, className } = props;

    return (
        <>
            <div style={{ width: '450px' }} className={`${className ? className : ''} flex flex--col  mt-2 tutor-card`} onClick={onClick}>
                <div className=" flex flex--row flex--ai--start ">
                    <div className="tutor-list__item__img w--unset mr-2">
                        {tutor.profileImage ? (
                            <img
                                style={{
                                    width: '150px',
                                    height: '150px',
                                }}
                                className="align--center d--b"
                                src={`${tutor.profileImage}`}
                                alt="tutor-profile-pic"
                            />
                        ) : (
                            <ImageCircle
                                className="align--center d--b mb-4"
                                imageBig={true}
                                initials={`${tutor.firstName.charAt(0)}${tutor.lastName.charAt(0)}`}
                            />
                        )}
                    </div>

                    <div className="flex flex--col flex--grow">
                        <div className="flex flex--row flex--jc--space-between type--md">
                            <h3 className="">{tutor.firstName.split(' ')[0] + ' ' + tutor.lastName.charAt(0) + '.'}</h3>
                            <h3>{tutor.minPrice + ' ' + tutor.currencyCode + ' / h'}</h3>
                        </div>

                        <div className="flex flex--row flex--jc--space-between mb-2">
                            <span>
                                {tutor.currentOccupation.length > 30 ? tutor.currentOccupation.substring(0, 30) + '...' : tutor.currentOccupation}
                            </span>
                            <span></span>
                        </div>

                        {tutor.averageGrade !== 0 && tutor.numberOfGrades > 0 ? (
                            <>
                                <div className="flex flex--row flex--jc--start flex--ai--center">
                                    <span>{tutor.averageGrade}&nbsp;</span>
                                    <StarRating mark={tutor.averageGrade} size={'small'} />
                                    <p className="ml-2 type--color--secondary">({tutor.numberOfGrades})</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="mb-3 type--italic type--color--secondary">{t('SEARCH_TUTORS.NO_REVIEWS')}</span>
                            </>
                        )}

                        {tutor.completedLessons > 0 ? (
                            <div className="flex flex--row flex--ai--center mb-3 mt-1">
                                <LuBookOpenCheck size={20} color={'#7e6cf2'} />
                                {/*<i className="icon icon--completed-lessons icon--base icon--grey"></i>*/}
                                <span className="d--ib ml-1">
                                    {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                                </span>
                            </div>
                        ) : (
                            <>
                                <span className="mb-3 type--italic type--color--secondary">{t('SEARCH_TUTORS.NO_COMPLETED_LESSONS')}</span>
                            </>
                        )}

                        <div className="subjects-container mb-3">
                            <CustomSubjectList subjects={tutor.subjects} numOfSubjectsShown={1}></CustomSubjectList>
                        </div>
                    </div>
                </div>

                <div className="mt-2 recommended-card-truncate">
                    <p>{tutor.aboutTutor}</p>
                </div>

                <div className="flex flex--row flex--jc--space-evenly mt-3">
                    <Link
                        className="btn btn--primary btn--base pl-8 pr-8 pt-3 pb-3"
                        to={`${PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutor.slug)}`}
                    >
                        {t('SEARCH_TUTORS.BOOK_LESSON')}
                    </Link>
                    <Link
                        className="btn btn--base btn--ghost--bordered type--wgt--extra-bold pl-8 pr-8 pt-3 pb-3"
                        to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
                    >
                        {t('SEARCH_TUTORS.VIEW_PROFILE')}
                    </Link>
                </div>
            </div>
        </>
    );
};
