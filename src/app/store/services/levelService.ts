import { t } from 'i18next';

import { baseService } from '../baseService';
import { OptionType } from '../../components/form/MySelectField';
import { HttpMethods } from '../../types/httpMethods';
import ILevel from '../../types/ILevel';

const URL = 'api/v1/levels';

export const levelService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getLevels: builder.query<OptionType[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ILevel[]) => {
                const levelOptions: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: t(`LEVELS.${level.abrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`),
                    countryId: level.countryId,
                }));

                return levelOptions;
            },
        }),
    }),
});

export const { useGetLevelsQuery, useLazyGetLevelsQuery } = levelService;
