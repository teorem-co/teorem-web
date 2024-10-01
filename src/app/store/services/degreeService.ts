import { baseService } from '../baseService';
import { HttpMethods } from '../../types/httpMethods';
import IDegree from '../../types/IDegree';

const URL = 'api/v1/degrees';

export const degreeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getDegrees: builder.query<IDegree[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useGetDegreesQuery, useLazyGetDegreesQuery } = degreeService;
