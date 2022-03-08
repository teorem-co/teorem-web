import { t } from 'i18next';
import { cloneDeep, debounce } from 'lodash';
import { useEffect, useState } from 'react';

import MainWrapper from '../../components/MainWrapper';
import LoaderMyReviews from '../../components/skeleton-loaders/LoaderMyReviews';
import LoaderStatistics from '../../components/skeleton-loaders/LoaderStatistics';
import { useAppSelector } from '../../hooks';
import Ratings from './components/Ratings';
import ReviewItem from './components/ReviewItem';
import IMyReview from './interfaces/IMyReview';
import IMyReviewParams from './interfaces/IMyReviewParams';
import { useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery } from './services/myReviewsService';

export interface IGetMyReviews {
    rpp: number;
    page: number;
    tutorId: string;
}

const MyReviews = () => {
    const [params, setParams] = useState<IMyReviewParams>({ page: 1, rpp: 10 });
    const [loadedReviews, setLoadedReviews] = useState<IMyReview[]>([]);

    const [getMyReviews, { data: myReviews, isLoading: myReviewsLoading, isUninitialized: reviewsUninitialized }] = useLazyGetMyReviewsQuery();
    const [getStatistics, { data: tutorStatistics, isLoading: statisticsLoading, isUninitialized: statisticsUninitialized }] =
        useLazyGetStatisticsQuery();

    const tutorId = useAppSelector((state) => state.auth.user?.id);
    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);
    const isLoading = myReviewsLoading || reviewsUninitialized || statisticsLoading || statisticsUninitialized;

    const handleLoadMore = () => {
        let newParams = { ...params };
        newParams = {
            page: params.page + 1,
            rpp: params.rpp,
        };

        setParams(newParams);
    };

    const hideLoadMore = () => {
        let returnValue: boolean = false;
        if (myReviews) {
            const totalPages = Math.ceil(myReviews.count / params.rpp);

            if (params.page === totalPages) returnValue = true;
        }

        return returnValue;
    };

    const handleScroll = (e: HTMLDivElement) => {
        const innerHeight = e.scrollHeight;
        const scrollPosition = e.scrollTop + e.clientHeight;
        if (!hideLoadMore() && innerHeight === scrollPosition && loadedReviews.length > 0) {
            handleLoadMore();
        }
        // if (innerHeight === scrollPosition) {
        //     //action to do on scroll to bottom
        //
        // }
    };

    const fetchData = async () => {
        if (tutorId) {
            const obj: IGetMyReviews = {
                tutorId: tutorId,
                page: params.page,
                rpp: params.rpp,
            };

            await getMyReviews(obj).unwrap();
            await getStatistics(tutorId).unwrap();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const currentReviews = cloneDeep(loadedReviews);
        if (myReviews) {
            setLoadedReviews(currentReviews.concat(myReviews.rows));
        }
    }, [myReviews]);

    useEffect(() => {
        if (tutorId) {
            const obj: IGetMyReviews = {
                tutorId: tutorId,
                page: params.page,
                rpp: params.rpp,
            };
            getMyReviews(obj);
        }
    }, [params]);

    return (
        <MainWrapper>
            <div onScroll={(e: any) => debouncedScrollHandler(e.target)} className="card--secondary">
                <div className="card--secondary__head">
                    <h2 className="type--wgt--bold type--lg">{t('MY_REVIEWS.TITLE')}</h2>
                </div>
                <div className="card--secondary__body my-reviews__wrapper">
                    <div className="my-reviews__main">
                        <div className="mb-10 flex--primary">
                            <div>
                                <span className="type--uppercase type--color--tertiary">{t('MY_REVIEWS.COUNT_TITLE')}</span>
                                <span className="tag--primary d--ib ml-2">{myReviews ? myReviews.count : 0}</span>
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
                        {isLoading ? (
                            <div>
                                <LoaderMyReviews />
                                <LoaderMyReviews />
                                <LoaderMyReviews />
                            </div>
                        ) : (
                            <>
                                {loadedReviews && loadedReviews.length > 0 ? (
                                    <>
                                        <div className="reviews-list">
                                            {loadedReviews.map((item: IMyReview) => (
                                                <ReviewItem reviewItem={item} />
                                            ))}
                                        </div>
                                        {/* <Pagination
                                            activePageClass={
                                                'pagination--active'
                                            }
                                            currPage={params.page}
                                            itemsPerPage={params.rpp}
                                            totalItems={myReviews.count}
                                            paginate={paginate}
                                        /> */}
                                    </>
                                ) : (
                                    <div className="reviews-list">
                                        <div className="type--center mt-22">
                                            <h1 className="type--xxl">{t('MY_REVIEWS.NO_RESULT.TITLE')}</h1>
                                            <p className="type--color--secondary">{t('MY_REVIEWS.NO_RESULT.DESC')}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="my-reviews__aside">
                        <div className="mb-10">
                            <span className="type--uppercase type--color--tertiary">{t('MY_REVIEWS.AVG_SCORE')}</span>
                            <span className="tag--primary d--ib ml-2">
                                {/* {getAvgRating(myReviews)
                                    ? getAvgRating(myReviews).toFixed(1)
                                    : 0} */}
                                {tutorStatistics?.statistic ? tutorStatistics?.statistic.toFixed(1) : 0}
                            </span>
                        </div>
                        {statisticsLoading ? (
                            <div>
                                <LoaderStatistics />
                            </div>
                        ) : (
                            <Ratings ratings={tutorStatistics ? tutorStatistics.result : []} />
                        )}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default MyReviews;
