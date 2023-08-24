import { t } from 'i18next';

import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ILevel from '../interfaces/ILevel';

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
                    label: t(`LEVELS.${level.abrv.replace(' ', '').replace('-', '').toLowerCase()}`),
                }));

                return levelOptions;
            },
        })
    }),
});

export const {
    useGetLevelsQuery,
} = levelService;
