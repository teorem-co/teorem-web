import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ISubject from '../interfaces/ISubject';

const URL = 'subjects';

export const levelService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectOptionsByLevel: builder.query<OptionType[], string>({
            query: (levelId) => ({
                url: `${URL}/${levelId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ISubject[]) => {
                const subjectOptions: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: level.name,
                }));

                return subjectOptions;
            },
        }),
    }),
});

export const { useLazyGetSubjectOptionsByLevelQuery } = levelService;
