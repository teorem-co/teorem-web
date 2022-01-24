import { t } from 'i18next';
import { useEffect } from 'react';

import LoaderMyReviews from '../../components/Loaders/LoaderMyReviews';
import LoaderStatistics from '../../components/Loaders/LoaderStatistics';
import MainWrapper from '../../components/MainWrapper';
import ratingsMock from '../../constants/ratings';
import { useAppSelector } from '../../hooks';
import Ratings from './components/Ratings';
import IMyReview from './interfaces/IMyReview';
import { useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery } from './services/myReviewsService';

const MyReviews = () => {

    const [getMyReviews, { data: myReviews, isLoading: myReviewsLoading }] = useLazyGetMyReviewsQuery();
    const [getStatistics, { data: tutorStatistics, isLoading: statisticsLoading }] = useLazyGetStatisticsQuery();

    const tutorId = useAppSelector((state) => state.user.user?.id);

    const handleAvgRatings = () => {
        let totalRatings: number = 0;
        myReviews && myReviews.rows.forEach((item) => (totalRatings += item.mark));

        return totalRatings / ratingsMock.length;
    };

    useEffect(() => {
        if (tutorId) {
            getMyReviews(tutorId);
            getStatistics(tutorId);
        }
    }, []);

    return (
        <MainWrapper>
            <div className="card--search">
                <div className="card--search__head">
                    <h2 className="type--wgt--bold type--lg">{t('MY_REVIEWS.TITLE')}</h2>
                </div>
                <div className="card--search__body my-reviews__wrapper">
                    <div className="my-reviews__main">
                        <div className="mb-10 flex--primary">
                            <div>
                                <span className="type--uppercase type--color--tertiary">
                                    {t('MY_REVIEWS.COUNT_TITLE')}
                                </span>
                                <span className="tag--primary d--ib ml-2">
                                    {myReviews ? myReviews.count : 0}
                                </span>
                            </div>
                            <div>
                                {/* <span>Sort by</span>
                                &nbsp;
                                <span className="type--color--brand">
                                    Most relevant
                                </span>
                                <i className="icon icon--base icon--chevron-down icon--primary"></i> */}
                            </div>
                        </div>
                        {
                            myReviewsLoading
                                ? <div>
                                    <LoaderMyReviews />
                                    <LoaderMyReviews />
                                    <LoaderMyReviews />
                                </div>
                                : <div className="reviews-list">
                                    {myReviews && myReviews.rows.length > 0
                                        ? myReviews.rows.map((item: IMyReview) => (
                                            <div
                                                key={item.id}
                                                className="reviews-list__item"
                                            >
                                                <div>
                                                    <h4 className="type--md type--wgt--normal mb-1">
                                                        {item.Booking.User.firstName}&nbsp;
                                                        {item.Booking.User.lastName}
                                                    </h4>
                                                    <p className="type--color--brand-light">
                                                        {item.Booking.User.Role.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="flex--primary mb-2">
                                                        <div>
                                                            <div className="rating__stars">
                                                                <div
                                                                    className="rating__stars__fill"
                                                                    style={{
                                                                        width: `${item.mark *
                                                                            20
                                                                            }%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="tag--primary">
                                                            {item.Booking.Subject.name}
                                                        </div>
                                                    </div>
                                                    <p className="type--md mb-4">
                                                        {item.title}
                                                    </p>
                                                    <p className="mb-2">{item.comment}</p>
                                                    <p className="type--color--tertiary">
                                                        {t('MY_REVIEWS.PUBLISHED')}&nbsp; {item.createdAt}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                        : <div className="type--center mt-22">
                                            <h1 className="type--xxl">
                                                {t('MY_REVIEWS.NO_RESULT.TITLE')}
                                            </h1>
                                            <p className="type--color--secondary">
                                                {t('MY_REVIEWS.NO_RESULT.DESC')}
                                            </p>
                                        </div>
                                    }
                                </div>
                        }

                    </div>
                    <div className="my-reviews__aside">
                        <div className="mb-10">
                            <span className="type--uppercase type--color--tertiary">
                                {t('MY_REVIEWS.AVG_SCORE')}
                            </span>
                            <span className="tag--primary d--ib ml-2">
                                {handleAvgRatings()}
                            </span>
                        </div>
                        {
                            statisticsLoading
                                ? <div>
                                    <LoaderStatistics />
                                </div>
                                : <Ratings ratings={tutorStatistics ? tutorStatistics.result : []} />
                        }

                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyReviews;
