import { t } from 'i18next';

import { baseService } from '../baseService';
import { HttpMethods } from '../../types/httpMethods';
import ILevel from '../../types/ILevel';
import OptionType from '../../types/OptionType';

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
                    id: level.id,
                    value: level.id,
                    label: t(`LEVELS.${level.abrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`),
                    countryId: level.countryId,
                }));

                return levelOptions;
            },
        }),
        getLevelsPure: builder.query<ILevel[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useGetLevelsQuery, useLazyGetLevelsQuery, useLazyGetLevelsPureQuery, useGetLevelsPureQuery } =
    levelService;
