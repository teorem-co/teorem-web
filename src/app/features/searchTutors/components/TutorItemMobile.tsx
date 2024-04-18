import { RiVerifiedBadgeFill } from 'react-icons/ri';
import CustomSubjectList from './CustomSubjectList';
import { t } from 'i18next';
import React from 'react';
import ITutorItem from '../../../../interfaces/ITutorItem';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes';
import { CurrencySymbol } from '../../../components/CurrencySymbol';

interface Props {
    tutor: ITutorItem;
}

export const TutorItemMobile = (props: Props) => {
    const { tutor } = props;

    return (
        <div className={'card--primary flex flex--col mt-4'}>
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
                            <span className="d--b type--wgt--extra-bold type--lg type--capitalize mr-1">
                                {tutor.firstName} {tutor.lastName.charAt(0)}.
                            </span>
                            {tutor.idVerified && <RiVerifiedBadgeFill size={15} />}
                        </div>

                        {/*grade and price*/}
                        <div className={'flex flex--row flex--center flex--grow flex-gap-5 type--normal w--100'}>
                            {tutor.averageGrade > 0 ? (
                                <div className="flex flex--col flex--ai--center flex--jc--center">
                                    <div className="flex flex--row flex--ai--center">
                                        <i className="icon icon--sm icon--star"></i>
                                        <span className={'type--wgt--extra-bold'}>{tutor.averageGrade.toFixed(1)}</span>
                                    </div>
                                    <span className={'type--sm'}>
                                        {tutor.numberOfGrades}&nbsp;{t('TUTOR_PROFILE.REVIEWS')}
                                    </span>
                                </div>
                            ) : (
                                <span className="d--b flex flex--col flex--center">
                                    <span className={'type--wgt--extra-bold type--normal'}>{t('SEARCH_TUTORS.NEW_TUTOR.PART_1')}</span>
                                    <span className={'type--sm'}>{t('SEARCH_TUTORS.NEW_TUTOR.PART_2')}</span>
                                </span>
                            )}
                            <div className="flex flex--center flex--col type--center">
                                {tutor.minPrice ? (
                                    <div className="flex flex--col flex--ai--center flex--jc--center">
                                        <span className="d--ib type--wgt--extra-bold">
                                            <CurrencySymbol />
                                            {tutor.minPrice}{' '}
                                            {tutor.minPrice !== tutor.maxPrice && (
                                                <>
                                                    -&nbsp;
                                                    <CurrencySymbol />
                                                    {tutor.maxPrice}{' '}
                                                </>
                                            )}
                                        </span>
                                        <span className={'type--sm'}>50 min</span>
                                    </div>
                                ) : (
                                    <span className="d--ib">{t('SEARCH_TUTORS.TUTOR_PROFILE.NO_PRICE')}</span>
                                )}
                            </div>
                        </div>

                        {/*occupation*/}
                        <span className="d--b font__14 mt-1">{tutor.currentOccupation}</span>

                        {/*completed lessons*/}
                        <div className="flex flex--row flex--ai--center flex--jc--space-between font__14 type--wgt--bold mt-1">
                            {tutor.completedLessons > 0 && (
                                <span className="d--b type--color--brand">
                                    {tutor.completedLessons} {t('SEARCH_TUTORS.COMPLETED_LESSONS')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/*subjects*/}
            <div className="subject-containers flex flex--col flex--wrap mt-2 font__14 mb-1">
                {tutor.subjects && <CustomSubjectList numOfSubjectsShown={2} subjects={tutor.subjects} />}
            </div>
            {/*about tutor*/}
            <span className={`type--color--secondary type--3--lines type--sm mt-2 type--base`}>
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
