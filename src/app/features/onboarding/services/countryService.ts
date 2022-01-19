import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';

//bookings/week/:tutorId

const URL = '/countries';

interface ICountry {
    id: string;
    abrv: string;
    name: string;
    phonePrefix: string;
    currencyCode: string;
    currentcyName: string;
    isEuMember: boolean;
}

interface ICountryTransformed {
    id: string;
    name: string;
    phonePrefix: string;
}

export const countryService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getCountries: builder.query<ICountryTransformed[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ICountry[]) => {
                const countries: ICountryTransformed[] = response.map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        phonePrefix: x.phonePrefix,
                    };
                });

                return countries;
            },
        }),
    }),
});

export const { useLazyGetCountriesQuery } = countryService;
