import { t } from 'i18next';
import { HttpMethods } from '../../../lookups/httpMethods';
import { baseService } from '../../../store/baseService';

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
            transformResponse: (response: ICountry[]) => {
                const transformedCountries: ICountry[] = response.map((country) => ({
                    ...country,
                    name: t('COUNTRY.' + country.abrv.toUpperCase()),
                }));
                return transformedCountries;
            },
        }),
    }),
});

export const { useLazyGetCountriesQuery } = countryService;
