import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ILevel from '../interfaces/ILevel';

const URL = 'levels';

export const levelService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        // getLevels: builder.query<ILevel[], void>({
        //     query: () => ({
        //         url: `${URL}`,
        //         method: HttpMethods.GET,
        //     }),
        // }),
        getLevelOptions: builder.query<OptionType[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ILevel[]) => {
                const levelOptions: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: level.name,
                }));

                return levelOptions;
            },
        }),
    }),
});

export const { useLazyGetLevelOptionsQuery } = levelService;
