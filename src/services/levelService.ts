import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ILevel from '../interfaces/ILevel';

const URL = 'level';

export const levelService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getLevels: builder.query<OptionType[], void>({
            query: () => ({
                //update url later if needed
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ILevel[]) => {
                const levelOptions: OptionType[] = response.map((level) => ({
                    value: level.abrv,
                    label: level.name,
                }));

                return levelOptions;
            },
        }),
    }),
});

export const { useLazyGetLevelsQuery } = levelService;
