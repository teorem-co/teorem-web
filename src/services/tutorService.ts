import { baseService } from '../app/baseService';
import IProgressProfile from '../app/features/my-profile/interfaces/IProgressProfile';
import { HttpMethods } from '../app/lookups/httpMethods';
import IParams from '../interfaces/IParams';
import ITutor from '../interfaces/ITutor';

interface ITutorAvailable {
    count: number;
    rows: ITutor[];
}

const URL = 'tutors';

export const tutorService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAvailableTutors: builder.query<ITutorAvailable, IParams>({
            query: (params) => {
                const queryData = {
                    url: `${URL}/available-tutors?${
                        params.subject
                            ? 'subjectId=' + params.subject + '&'
                            : ''
                    }${params.level ? 'levelId=' + params.level + '&' : ''}${
                        params.dayOfWeek
                            ? 'dayOfWeek=' + params.dayOfWeek + '&'
                            : ''
                    }${
                        params.timeOfDay
                            ? 'timeOfDay=' + params.timeOfDay + '&'
                            : ''
                    }`,
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
        getTutorProfileData: builder.query<any, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetAvailableTutorsQuery,
    useGetAvailableTutorsQuery,
    useGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
} = tutorService;
