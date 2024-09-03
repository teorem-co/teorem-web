import { baseService } from '../baseService';
import { HttpMethods } from '../../types/httpMethods';
import IUniversity from '../../types/IUniversity';

const URL = 'api/v1/universities';

export const universityService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getUniversities: builder.query<IUniversity[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useGetUniversitiesQuery, useLazyGetUniversitiesQuery } = universityService;
