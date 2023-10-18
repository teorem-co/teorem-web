import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IEarnings from '../interfaces/IEarnings';

const URL = '/api/v1/tutors';

export const earningsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getEarnings: builder.query<IEarnings, string>({
            query: (periodOfTime) => ({
                url: `${URL}/general-information?periodOfTime=${periodOfTime}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetEarningsQuery } = earningsService;
