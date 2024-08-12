import { t } from 'i18next';
import { baseService } from '../baseService';
import { HttpMethods } from '../../types/httpMethods';

//bookings/week/:tutorSlug

const URL = '/api/v1/languages';

export interface ILanguage {
    id: string;
    abrv: string;
    name: string;
}

export const languageService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getLanguages: builder.query<ILanguage[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ILanguage[]) => {
                const transformedCountries: ILanguage[] = response.map((lang) => ({
                    ...lang,
                    name: t('LANGUAGE.' + lang.abrv.toUpperCase()),
                }));
                return transformedCountries;
            },
        }),
    }),
});

export const { useLazyGetLanguagesQuery } = languageService;
