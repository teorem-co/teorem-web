import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import ITutorSubject from '../../../interfaces/ITutorSubject';
import { useLazyGetTutorProfileDataQuery } from '../../../services/tutorService';
import MainWrapper from '../../components/MainWrapper';
import { PATHS } from '../../routes';
import getAvgRating from '../../utils/getAvgRating';
import { useLazyGetTutorAvailabilityQuery } from '../my-profile/services/tutorAvailabilityService';
import Ratings from '../myReviews/components/Ratings';
import ReviewItem from '../myReviews/components/ReviewItem';
import IMyReview from '../myReviews/interfaces/IMyReview';
import {
    useLazyGetMyReviewsQuery,
    useLazyGetStatisticsQuery,
} from '../myReviews/services/myReviewsService';

const TutorProfile = () => {
    const { t } = useTranslation();

    const { tutorId } = useParams();

    // const { tutorData } = useGetTutorProfileDataQuery(
    //     (tutorId),
    //     {
    //         selectFromResult: ({ data }) => ({
    //             tutorData: data?.rows.find((tutor) => tutor.userId === tutorId),
    //         }),
    //     }
    // );
    const [
        getTutorProfileData,
        { data: tutorData, isLoading: tutorDataLoading },
    ] = useLazyGetTutorProfileDataQuery();

    const [getMyReviews, { data: myReviews, isLoading: myReviewsLoading }] =
        useLazyGetMyReviewsQuery();

    const [
        getStatistics,
        { data: tutorStatistics, isLoading: statisticsLoading },
    ] = useLazyGetStatisticsQuery();

    const [getTutorAvailability, { data: tutorAvailability }] =
        useLazyGetTutorAvailabilityQuery();

    useEffect(() => {
        getTutorProfileData(tutorId);
        getMyReviews(tutorId);
        getStatistics(tutorId);
        getTutorAvailability(tutorId);
    }, []);

    const renderTableCells = (column: string | boolean) => {
        if (typeof column === 'boolean') {
            return (
                <td
                    className={`${
                        column
                            ? 'table--availability--check'
                            : 'table--availability--close'
                    }`}
                >
                    <i
                        className={`icon icon--base ${
                            column
                                ? 'icon--check icon--primary'
                                : 'icon--close icon--grey'
                        } `}
                    ></i>
                </td>
            );
        } else {
            return <td>{column}</td>;
        }
    };

    return (
        <MainWrapper>
            <div className="layout--primary">
                {tutorData ? (
                    <>
                        <div>
                            <div className="card--secondary card--secondary--alt">
                                <div className="card--secondary__head">
                                    <div className="flex flex--center">
                                        <Link to={PATHS.SEARCH_TUTORS}>
                                            <div>
                                                <i className="icon icon--base icon--chevron-left icon--black"></i>
                                            </div>
                                        </Link>
                                        <div className="type--lg type--wgt--bold ml-4">
                                            {tutorData
                                                ? `${tutorData.User.firstName} ${tutorData.User.lastName}`
                                                : 'Go back'}
                                        </div>
                                    </div>
                                </div>
                                <div className="card--secondary__body">
                                    <div className="mb-10">
                                        <div className="type--wgt--bold mb-2">
                                            {t(
                                                'SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_ME'
                                            )}
                                        </div>
                                        <div className="type--color--secondary">
                                            {tutorData ? (
                                                tutorData.aboutTutor
                                            ) : (
                                                <>
                                                    {t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_ABOUT'
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-10">
                                        <div className="type--wgt--bold mb-2">
                                            {t(
                                                'SEARCH_TUTORS.TUTOR_PROFILE.ABOUT_TEACHINGS'
                                            )}
                                        </div>
                                        <div className="type--color--secondary">
                                            {tutorData &&
                                            tutorData.aboutLessons ? (
                                                tutorData.aboutLessons
                                            ) : (
                                                <>
                                                    {t(
                                                        'SEARCH_TUTORS.TUTOR_PROFILE.EMPTY_STATE_LESSON'
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-10">
                                        <div className="type--wgt--bold mb-2">
                                            General Availability
                                        </div>

                                        {tutorAvailability &&
                                        tutorAvailability[1].length > 1 ? (
                                            <table className="table table--availability">
                                                {tutorAvailability.map(
                                                    (
                                                        row: (
                                                            | string
                                                            | boolean
                                                        )[]
                                                    ) => {
                                                        return (
                                                            <tr>
                                                                {row.map(
                                                                    (
                                                                        column:
                                                                            | string
                                                                            | boolean
                                                                    ) => {
                                                                        return renderTableCells(
                                                                            column
                                                                        );
                                                                    }
                                                                )}
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </table>
                                        ) : (
                                            <>
                                                Tutor did not fill out the
                                                availability table
                                            </>
                                        )}
                                    </div>
                                    <div className="mb-10">
                                        <div className="type--wgt--bold mb-2">
                                            Subjects offered
                                        </div>
                                        <table className="table table--primary">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Qualification</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tutorData.TutorSubjects.map(
                                                    (item: ITutorSubject) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .Subject
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .Level
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    $
                                                                    {item.price}
                                                                    <span className="type--color--tertiary">
                                                                        /hr
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mb-10">
                                        <div className="type--wgt--bold mb-2">
                                            Ratings & reviews
                                        </div>
                                        <div className="flex flex--jc--space-between">
                                            <div>
                                                <div className="type--huge">
                                                    {getAvgRating(myReviews)}
                                                </div>
                                                <div className="rating__stars mb-4">
                                                    <div
                                                        className="rating__stars__fill"
                                                        style={{
                                                            width: `${
                                                                getAvgRating(
                                                                    myReviews
                                                                ) * 20
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="type--color--secondary">
                                                    {myReviews?.count} reviews
                                                    total
                                                </div>
                                            </div>
                                            <div>
                                                <Ratings
                                                    ratings={
                                                        tutorStatistics
                                                            ? tutorStatistics.result
                                                            : []
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divider--primary mb-10"></div>
                                    <div>
                                        {myReviews &&
                                        myReviews.rows.length > 0 ? (
                                            myReviews.rows.map(
                                                (item: IMyReview) => (
                                                    <div className="reviews-list">
                                                        <ReviewItem
                                                            reviewItem={item}
                                                        />
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="reviews-list">
                                                <div className="type--center mt-22">
                                                    <h1 className="type--xxl">
                                                        {t(
                                                            'MY_REVIEWS.NO_RESULT.TITLE'
                                                        )}
                                                    </h1>
                                                    <p className="type--color--secondary">
                                                        {t(
                                                            'MY_REVIEWS.NO_RESULT.DESC'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="card--primary p-4 pt-6">
                                <div className="tutor-list__item__img align--center">
                                    <img
                                        className="align--center d--b mb-4"
                                        src={tutorData.User.profileImage}
                                        alt="tutor-profile-pic"
                                    />
                                </div>
                                <div className="type--md type--center mb-1">
                                    {tutorData.User.firstName}&nbsp;
                                    {tutorData.User.lastName}
                                </div>
                                <div className="type--color--brand type--center">
                                    {tutorData.currentOccupation}
                                </div>
                                <div className="mt-10 mb-10">
                                    <div className="flex--primary mb-3">
                                        <div>
                                            <i className="icon icon--pricing icon--base icon--grey"></i>
                                            <span className="d--ib ml-2 type--color--secondary">
                                                Pricing:
                                            </span>
                                        </div>
                                        <span className="d--ib ml-4">
                                            {/* Add later */}
                                            $44 - $45 /hr
                                        </span>
                                    </div>
                                    <div className="flex--primary mb-3">
                                        <div>
                                            <i className="icon icon--star icon--base icon--grey"></i>
                                            <span className="d--ib ml-2 type--color--secondary">
                                                Rating:
                                            </span>
                                        </div>

                                        <span className="d--ib ml-4">
                                            {/* Add later */}
                                            4.9
                                        </span>
                                    </div>
                                    <div className="flex--primary">
                                        <div>
                                            <i className="icon icon--completed-lessons icon--base icon--grey"></i>
                                            <span className="d--ib ml-2 type--color--secondary">
                                                Completed lessons:
                                            </span>
                                        </div>
                                        <span className="d--ib ml-4">
                                            {/* Add later */}
                                            15
                                        </span>
                                    </div>
                                </div>
                                <button className="btn btn--base btn--primary w--100 mb-4">
                                    Book a Lesson
                                </button>
                                <button className="btn btn--base btn--ghost w--100">
                                    Send a message
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="type--wgt--bold type--lg mt-5 ml-5">
                        User not found
                    </div>
                )}
            </div>
        </MainWrapper>
    );
};

export default TutorProfile;
