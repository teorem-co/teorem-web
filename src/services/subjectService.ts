import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ISubject from '../interfaces/ISubject';

const URL = 'subjects';

const mutationURL = 'tutor-subjects';

interface IGetSubject {
    id: string;
    abrv: string;
    name: string;
    levelId: string;
}
interface IId {
    levelId: string;
    subjectId?: string;
}

interface ICreateSubject {
    subjectId: string;
    price: number;
    objectId?: string;
}

interface ITutorSubject {
    price: number;
    Subject: ISubject;
}

interface ITutorSubjectId {
    tutorId: string;
    levelId: string;
}

export const subjectService = baseService.injectEndpoints({
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
        getSubjectsByLevelAndSubject: builder.query<OptionType[], IId>({
            query: (ids) => ({
                url: `${URL}/filter/${ids.levelId}/?subjectId=${
                    ids.subjectId ? ids.subjectId : ''
                }`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IGetSubject[]) => {
                const subjectOptions: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: level.name,
                }));
                return subjectOptions;
            },
        }),
        updateSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${mutationURL}/${body.objectId}`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        createSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${mutationURL}/`,
                    method: 'POST',
                    body,
                };
            },
        }),
        deleteSubject: builder.mutation<void, string>({
            query(objectId) {
                return {
                    url: `${mutationURL}/${objectId}`,
                    method: HttpMethods.DELETE,
                };
            },
        }),
        getTutorSubjectsByTutorLevel: builder.query<
            OptionType[],
            ITutorSubjectId
        >({
            query: (data) => ({
                url: `${mutationURL}/${URL}/${data.tutorId}?levelId=${data.levelId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutorSubject[]) => {
                const subjectOptions: OptionType[] = response.map(
                    (subject) => ({
                        value: subject.Subject.id,
                        label: subject.Subject.name,
                    })
                );
                return subjectOptions;
            },
        }),
    }),
});

export const {
    useLazyGetSubjectOptionsByLevelQuery,
    useLazyGetSubjectsByLevelAndSubjectQuery,
    useUpdateSubjectMutation,
    useCreateSubjectMutation,
    useDeleteSubjectMutation,
    useLazyGetTutorSubjectsByTutorLevelQuery,
} = subjectService;
