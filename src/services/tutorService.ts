import { baseService } from '../app/baseService';
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
    }),
});

export const { useLazyGetAvailableTutorsQuery, useGetAvailableTutorsQuery } =
    tutorService;
