import {baseService} from '../../../baseService';
import {HttpMethods} from '../../../lookups/httpMethods';

//bookings/week/:tutorSlug

const URL = '/api/v1/countries';

export interface ICountry {
    id: string;
    abrv: string;
    name: string;
    phonePrefix: string;
    currencyCode: string;
    currentcyName: string;
    isEuMember: boolean;
    flag: string;
}

export const countryService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getCountries: builder.query<ICountry[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {useLazyGetCountriesQuery} = countryService;
