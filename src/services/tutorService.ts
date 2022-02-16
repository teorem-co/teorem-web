import { baseService } from '../app/baseService';
import IProgressProfile from '../app/features/my-profile/interfaces/IProgressProfile';
import IUpdateAdditionalInfo from '../app/features/my-profile/interfaces/IUpdateAdditionalInfo';
import { HttpMethods } from '../app/lookups/httpMethods';
import IParams from '../interfaces/IParams';
import ITutor from '../interfaces/ITutor';

interface ITutorAvailable {
    count: number;
    rows: ITutor[];
}

// interface ICreateTutorSubject {}

const URL = 'tutors';

export const tutorService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAvailableTutors: builder.query<ITutorAvailable, IParams>({
            query: (params) => {
                const queryData = {
                    url: `${URL}/available-tutors?rpp=${params.rpp}&page=${params.page}${params.subject
                        ? '&subjectId=' + params.subject
                        : ''
                        }${params.level ? '&levelId=' + params.level : ''}${params.dayOfWeek
                            ? '&dayOfWeek=' + params.dayOfWeek
                            : ''
                        }${params.timeOfDay
                            ? '&timeOfDay=' + params.timeOfDay
                            : ''
                        }${params.sort ? '&sort=' + params.sort : ''}`,
                    method: HttpMethods.GET,
                };

                return queryData;
            },
        }),
        getProfileProgress: builder.query<IProgressProfile, void>({
            query: () => ({
                url: `${URL}/profile-progress`,
                method: HttpMethods.GET,
            }),
        }),
        updateAditionalInfo: builder.mutation<void, IUpdateAdditionalInfo>({
            query(body) {
                return {
                    url: `${URL}`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        // updateMyTeachings: builder.mutation<void, IUpdateMyTeachings>({
        //     query(body) {
        //         return {
        //             url: `${URL}/my-teachings`,
        //             method: 'PUT',
        //             body,
        //         };
        //     },
        // }),
        getTutorProfileData: builder.query<ITutor, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        // postTutorsubject: builder.mutation<void, >
    }),
});

export const {
    useLazyGetAvailableTutorsQuery,
    useGetAvailableTutorsQuery,
    useGetProfileProgressQuery,
    useLazyGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
    useUpdateAditionalInfoMutation,
    useGetTutorProfileDataQuery,
} = tutorService;
