
import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IMyReviews from '../interfaces/IMyReviews';
import ITutorStatistics from '../interfaces/ITutorStatistics';

const URL = 'reviews';

export const myReviewsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getMyReviews: builder.query<IMyReviews, string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IMyReviews) => {
                return response;
            },
        }),
        getStatistics: builder.query<ITutorStatistics, string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}/statistic`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutorStatistics) => {
                return response;
            },
        }),
    }),
});

export const { useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery } = myReviewsService;
