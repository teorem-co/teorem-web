import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ILevel from '../interfaces/ILevel';

const URL = 'levels';
const tutorLevelsUrl = 'tutor-subjects';

interface ITutorLevel {
    Level: ILevel;
    levelId: string;
}

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
        getTutorLevels: builder.query<OptionType[], string>({
            query: (tutorId) => ({
                url: `${tutorLevelsUrl}/${URL}/${tutorId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutorLevel[]) => {
                const tutorLevels: OptionType[] = response.map((level) => ({
                    value: level.levelId,
                    label: level.Level.name,
                }));

                return tutorLevels;
            },
        }),
    }),
});

export const {
    useLazyGetLevelOptionsQuery,
    useGetLevelOptionsQuery,
    useGetTutorLevelsQuery,
} = levelService;
