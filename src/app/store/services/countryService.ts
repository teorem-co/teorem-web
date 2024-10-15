import { t } from 'i18next';
import { HttpMethods } from '../../types/httpMethods';
import { baseService } from '../baseService';
import ICountry from '../../types/ICountry';

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

        getCountryById: builder.query<ICountry, string>({
            query: (countryId) => ({
                url: `${URL}/${countryId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ICountry) => {
                const transformedCountry: ICountry = {
                    ...response,
                    name: t('COUNTRY.' + response.abrv.toUpperCase()),
                };
                return transformedCountry;
            },
        }),
    }),
});

export const { useLazyGetCountriesQuery, useLazyGetCountryByIdQuery } = countryService;
