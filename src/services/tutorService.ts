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
        //change return type later
        getAvailableTutors: builder.query<ITutorAvailable, IParams>({
            query: (params) => {
                const test = {
                    url: `${URL}/available-tutors?${
                        params.subject
                            ? 'subjectId=' + params.subject + '&'
                            : ''
                    }${params.level ? 'levelId=' + params.level + '&' : ''}${
                        params.availability
                            ? 'availability=' + params.availability + '&'
                            : ''
                    }`,
                    method: HttpMethods.GET,
                };

                return test;
            },
        }),
    }),
});

export const { useLazyGetAvailableTutorsQuery } = tutorService;
