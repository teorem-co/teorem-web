import { t } from 'i18next';

import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ILevel from '../interfaces/ILevel';

const URL = 'api/v1/levels';
const TUTOR_SUBJECT_URL = 'api/v1/tutor-subjects';

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
                    label: t(`LEVELS.${level.abrv.replace(' ', '').replace('-', '').toLowerCase()}`),
                }));

                return levelOptions;
            },
        }),
        getTutorLevels: builder.query<OptionType[], string>({
            query: (tutorId) => ({
                url: `${TUTOR_SUBJECT_URL}/levels/${tutorId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ILevel[]) => {
                console.log("RESPONSE:", response);
                const tutorLevels: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: t(`LEVELS.${level.abrv.replace('-', '').toLowerCase()}`),
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
