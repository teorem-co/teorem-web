import { t } from 'i18next';
import { useEffect, useState } from 'react';

import LoaderMyReviews from '../../components/Loaders/LoaderMyReviews';
import LoaderStatistics from '../../components/Loaders/LoaderStatistics';
import MainWrapper from '../../components/MainWrapper';
import Pagination from '../../components/Pagination';
import { useAppSelector } from '../../hooks';
import getAvgRating from '../../utils/getAvgRating';
import Ratings from './components/Ratings';
import ReviewItem from './components/ReviewItem';
import IMyReview from './interfaces/IMyReview';
import IMyReviewParams from './interfaces/IMyReviewParams';
import IMyReviews from './interfaces/IMyReviews';
import {
    useLazyGetMyReviewsQuery,
    useLazyGetStatisticsQuery,
} from './services/myReviewsService';

export interface IGetMyReviews {
    rpp: number;
    page: number;
    tutorId: string;
}

const MyReviews = () => {
    const [params, setParams] = useState<IMyReviewParams>({ page: 0, rpp: 10 });

    const [getMyReviews, { data: myReviews, isLoading: myReviewsLoading }] =
        useLazyGetMyReviewsQuery();

    const [
        getStatistics,
        { data: tutorStatistics, isLoading: statisticsLoading },
    ] = useLazyGetStatisticsQuery();

    const tutorId = useAppSelector((state) => state.auth.user?.id);

    useEffect(() => {
        if (tutorId) {
            const obj: IGetMyReviews = {
                tutorId: tutorId,
                page: params.page,
                rpp: params.rpp,
            };

            getMyReviews(obj);
            getStatistics(tutorId);
        }
    }, []);

    // change paginated number
    const paginate = (pageNumber: number) => {
        setParams({ page: pageNumber, rpp: params.rpp });
    };

    return (
        <MainWrapper>
            <div className="card--secondary">
                <div className="card--secondary__head">
                    <h2 className="type--wgt--bold type--lg">
                        {t('MY_REVIEWS.TITLE')}
                    </h2>
                </div>
                <div className="card--secondary__body my-reviews__wrapper">
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
                        {myReviewsLoading ? (
                            <div>
                                <LoaderMyReviews />
                                <LoaderMyReviews />
                                <LoaderMyReviews />
                            </div>
                        ) : (
                            <>
                                {myReviews && myReviews.rows.length > 0 ? (
                                    myReviews.rows.map((item: IMyReview) => (
                                        <div className="reviews-list">
                                            <ReviewItem reviewItem={item} />
                                            <Pagination
                                                activePageClass={
                                                    'pagination--active'
                                                }
                                                currPage={params.page}
                                                itemsPerPage={params.rpp}
                                                totalItems={1000}
                                                paginate={paginate}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="reviews-list">
                                        <div className="type--center mt-22">
                                            <h1 className="type--xxl">
                                                {t(
                                                    'MY_REVIEWS.NO_RESULT.TITLE'
                                                )}
                                            </h1>
                                            <p className="type--color--secondary">
                                                {t('MY_REVIEWS.NO_RESULT.DESC')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="my-reviews__aside">
                        <div className="mb-10">
                            <span className="type--uppercase type--color--tertiary">
                                {t('MY_REVIEWS.AVG_SCORE')}
                            </span>
                            <span className="tag--primary d--ib ml-2">
                                {getAvgRating(myReviews)}
                            </span>
                        </div>
                        {statisticsLoading ? (
                            <div>
                                <LoaderStatistics />
                            </div>
                        ) : (
                            <Ratings
                                ratings={
                                    tutorStatistics
                                        ? tutorStatistics.result
                                        : []
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyReviews;
