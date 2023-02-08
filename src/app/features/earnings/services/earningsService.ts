import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IEarnings from '../interfaces/IEarnings';

const URL = 'tutors';

export const earningsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getEarnings: builder.query<IEarnings, string>({
            query: (date) => ({
                url: `${URL}/general-information?dateTo=${date}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetEarningsQuery } = earningsService;
