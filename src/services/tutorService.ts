import { baseService } from '../app/baseService';
import IProgressProfile from '../app/features/my-profile/interfaces/IProgressProfile';
import { HttpMethods } from '../app/lookups/httpMethods';
import IParams from '../interfaces/IParams';
import ITutor from '../interfaces/ITutor';

interface ITutorAvailable {
    count: number;
    rows: ITutor[];
}

interface ITutorAdditionalInfo {
    aboutTutor: string;
    aboutLessons: string;
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
        updateAditionalInfo: builder.mutation<void, ITutorAdditionalInfo>({
            query(body) {
                return {
                    url: `${URL}/aditional-information`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        getTutorProfileData: builder.query<ITutor, string | undefined>({
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
    useUpdateAditionalInfoMutation,
    useGetTutorProfileDataQuery,
} = tutorService;
