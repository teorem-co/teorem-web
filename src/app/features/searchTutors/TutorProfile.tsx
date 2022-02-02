import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
    useGetAvailableTutorsQuery,
    useLazyGetTutorProfileDataQuery,
} from '../../../services/tutorService';
import ImageCircle from '../../components/ImageCircle';
import MainWrapper from '../../components/MainWrapper';
import availabilityTable from '../../constants/availabilityTable';
import { PATHS } from '../../routes';
import IAvailabilityIndex from '../my-profile/interfaces/IAvailabilityIndex';
import IAvailabilityItem from '../my-profile/interfaces/IAvailabilityItem';
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

    useEffect(() => {
        getTutorProfileData(tutorId);
        getMyReviews(tutorId);
        getStatistics(tutorId);
    }, []);

    const handleAvgRatings = () => {
        let totalRatings: number = 0;
        let myReviewsLength: number = 1;

        if (myReviews && myReviews.count > 0) {
            myReviews.rows.forEach((item) => (totalRatings += item.mark));
            myReviewsLength = totalRatings / myReviews.count;
        }

        return myReviewsLength;
    };

    const renderTableCells = (column: string | IAvailabilityItem) => {
        if (typeof column === 'object') {
            return (
                <td
                    className={`${
                        column.check
                            ? 'table--availability--check'
                            : 'table--availability--close'
                    }`}
                >
                    {column.check ? (
                        <i className="icon icon--base icon--check icon--primary"></i>
                    ) : (
                        <i className="icon icon--base icon--close icon--grey"></i>
                    )}
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
                                                <i className="icon icon--base icon--arrow-left icon--black"></i>
                                            </div>
                                        </Link>
                                        <div className="type--lg type--wgt--bold ml-6">
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
                                        <table className="table table--availability">
                                            {availabilityTable.map(
                                                (
                                                    row: (
                                                        | string
                                                        | IAvailabilityItem
                                                    )[]
                                                ) => {
                                                    return (
                                                        <tr>
                                                            {row.map(
                                                                (
                                                                    column:
                                                                        | string
                                                                        | IAvailabilityItem
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
                                                <tr>
                                                    <td>Biology</td>
                                                    <td>A Level</td>
                                                    <td>
                                                        $33
                                                        <span className="type--color--tertiary">
                                                            /hr
                                                        </span>
                                                    </td>
                                                </tr>
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
                                                    {handleAvgRatings()}
                                                </div>
                                                <div className="rating__stars mb-4">
                                                    <div
                                                        className="rating__stars__fill"
                                                        style={{
                                                            width: `${
                                                                handleAvgRatings() *
                                                                20
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
                                        src={
                                            tutorData.User.File &&
                                            tutorData.User.File.path
                                        }
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
