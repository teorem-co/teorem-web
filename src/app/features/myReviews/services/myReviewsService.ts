import { HttpMethods } from '../../../lookups/httpMethods';
import IAddReview from '../interfaces/IAddReview';
import IMyReviews from '../interfaces/IMyReviews';
import ITutorStatistics from '../interfaces/ITutorStatistics';
import { IGetMyReviews } from '../MyReviews';
import ISubject from '../../../../interfaces/ISubject';
import ILevel from '../../../../interfaces/ILevel';
import { baseService } from '../../../store/baseService';

const URL = 'api/v1/reviews';

export interface IReviewInfo {
    bookingId: string;
    tutorId: string;
    tutorName: string;
    tutorOccupation: string;
    subject: ISubject;
    level: ILevel;
    totalNumberOfLessons: number;
    studentId: string;

    averageGrade: number;
    totalNumberOfReviews: number;
    profileImage: string;
    listOfSubjects: string[];
}

export const myReviewsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getMyReviews: builder.query<IMyReviews, IGetMyReviews>({
            query: (obj) => ({
                url: `${URL}/${obj.tutorId}?page=${obj.page - 1}&size=${obj.rpp}`, //TODO: this -1 will be fixed later, will fix it when we fix all paginations
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

        getReviewInfo: builder.query<IReviewInfo, string>({
            query: (bookingId) => ({
                url: `${URL}/info?bookingId=${bookingId}`,
                method: HttpMethods.GET,
            }),
        }),
        checkIfCanLeaveReview: builder.query<boolean, string>({
            query: (bookingId) => ({
                url: `${URL}/check?bookingId=${bookingId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetMyReviewsQuery,
    useLazyGetStatisticsQuery,
    useAddReviewMutation,
    useLazyGetReviewInfoQuery,
    useLazyCheckIfCanLeaveReviewQuery,
} = myReviewsService;
