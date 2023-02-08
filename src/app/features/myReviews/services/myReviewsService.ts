import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IAddReview from '../interfaces/IAddReview';
import IMyReviews from '../interfaces/IMyReviews';
import ITutorStatistics from '../interfaces/ITutorStatistics';
import { IGetMyReviews } from '../MyReviews';

const URL = 'reviews';

export const myReviewsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getMyReviews: builder.query<IMyReviews, IGetMyReviews>({
            query: (obj) => ({
                url: `${URL}/${obj.tutorId}?${`page=${obj.page}${`&rpp=${obj.rpp}`}`}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IMyReviews) => {
                return response;
            },
        }),
        addReview: builder.mutation<void, IAddReview>({
            query: (body) => ({
                url: `${URL}`,
                method: HttpMethods.POST,
                body: body,
            }),
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

export const { useLazyGetMyReviewsQuery, useLazyGetStatisticsQuery, useAddReviewMutation } = myReviewsService;
