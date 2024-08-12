import { t } from 'i18next';
import { HttpMethods } from '../../../types/httpMethods';
import { baseService } from '../../../store/baseService';
import ICountry from '../../../types/ICountry';

//bookings/week/:tutorSlug

const URL = '/api/v1/countries';

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
