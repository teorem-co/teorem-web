import {baseService} from '../../../baseService';
import {HttpMethods} from '../../../lookups/httpMethods';

//bookings/week/:tutorSlug

const URL = '/countries';

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
                url: `http://localhost:8080/api/v1${URL}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {useLazyGetCountriesQuery} = countryService;
