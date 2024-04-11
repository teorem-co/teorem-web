import { RiVerifiedBadgeFill } from 'react-icons/ri';
import CustomSubjectList from './CustomSubjectList';
import { t } from 'i18next';
import React from 'react';
import ITutorItem from '../../../../interfaces/ITutorItem';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes';

interface Props {
    tutor: ITutorItem;
}

export const TutorItemMobileNew = (props: Props) => {
    const { tutor } = props;

    return (
        <div className={'card--primary flex flex--col mt-2'}>
            <div className={'flex'}>
                <div className="flex flex--row font__sm flex--ai--center flex--grow">
                    {/*profile image*/}
                    <img
                        className="mr-3 lessons-list__item__img lessons-list__item__img__search-tutor"
                        style={{ width: '120px', height: '120px', border: 'none' }}
                        src={tutor.profileImage}
                        alt=""
                    />
                    <div className="flex flex--col flex--ai--start">
                        {/*name*/}
                        <div className={'flex flex--row flex--center'}>
                            <span className="d--b type--wgt--extra-bold type--normal type--capitalize mr-1">
                                {tutor.firstName} {tutor.lastName.charAt(0)}.
                            </span>
                            {tutor.idVerified && <RiVerifiedBadgeFill size={15} />}
                        </div>

                        {/*grade and price*/}
                        <div className={'flex flex--row flex--center flex--jc--space-between flex--grow'}>
                            {tutor.averageGrade > 0 && (
                                <div className="flex flex--row flex--ai--center mr-4">
                                    <i className="icon icon--sm icon--star"></i>
                                    <span className={'type--base type--wgt--extra-bold'}>{tutor.averageGrade.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex flex--center flex--col type--center">
                                {tutor.minPrice ? (
                                    <span className="d--ib type--base type--wgt--extra-bold">
                                        &euro;{tutor.minPrice}{' '}
                                        {tutor.minPrice !== tutor.maxPrice && (
                                            <>
                                                -&nbsp;&euro;
                                                {tutor.maxPrice}{' '}
                                            </>
                                        )}
                                    </span>
                                ) : (
                                    <span className="d--ib">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                                )}
                            </div>
                        </div>

                        {/*occupation*/}
                        <span className="d--b font__11">{tutor.currentOccupation}</span>

                        {/*completed lessons*/}
                        <div className="flex flex--row flex--ai--center flex--jc--space-between font__12 type--wgt--bold">
                            {tutor.completedLessons > 0 ? (
                                <span className="d--b type--color--brand">
                                    {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                                </span>
                            ) : (
                                <span className="d--b">
                                    <span className={'type--wgt--extra-bold type--sm'}>{t('SEARCH_TUTORS.NEW_TUTOR.PART_1')}</span>
                                    &nbsp;{t('SEARCH_TUTORS.NEW_TUTOR.PART_2')}
                                </span>
                            )}
                        </div>

                        {/*subjects*/}
                        <div className="subject-containers flex flex--col flex--wrap mt-2 font__11 mb-1" style={{ fontSize: '12px' }}>
                            {tutor.subjects && <CustomSubjectList numOfSubjectsShown={2} subjects={tutor.subjects} />}
                        </div>
                    </div>
                </div>
            </div>

            {/*about tutor*/}
            <span className={`type--color--secondary type--3--lines type--sm mt-2`}>
                {tutor.aboutTutor ? tutor.aboutTutor : t('SEARCH_TUTORS.NOT_FILLED')}
            </span>

            {/*buttons*/}
            <div className={'flex flex--row mt-2 flex-gap-2'}>
                <Link
                    className="btn btn--normal btn--ghost type--center type--wgt--extra-bold flex--grow"
                    to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', tutor.slug)}`}
                >
                    <span>{t('SEARCH_TUTORS.VIEW_PROFILE')}</span>
                </Link>
                <Link
                    className="btn btn--normal btn--primary type--center type--wgt--extra-bold flex--grow"
                    to={`${PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(':tutorSlug', tutor.slug)}`}
                >
                    {t('TUTOR_PROFILE.BOOK')}
                </Link>
            </div>
        </div>
    );
};
