import { t } from 'i18next';

import { baseService } from '../baseService';
import { OptionType } from '../../components/form/MySelectField';
import { HttpMethods } from '../../types/httpMethods';
import ISubject from '../../types/ISubject';

const URL_TUTORS = 'api/v1/tutors';
const URL_SUBJECTS = 'api/v1/subjects';

interface ICreateSubjectsOnboarding {
    tutorId: string;
    subjects: ICreateSubjectOnboarding[];
}

export interface ICreateSubjectOnboarding {
    id?: string;
    levelId: string;
    subjectId: string;
    price: string;
}

interface ICreateSubject {
    id?: string;
    subjectId: string;
    levelId: string;
    tutorId?: string;
    price: number;
    objectId?: string;
}

export interface ITutorSubjectLevelPair {
    subjectId: string;
    subjectAbrv: string;
    levelId: string;
    levelAbrv: string;
    cost: number;
}

export interface ITutorSubjectLevelOption {
    subject: OptionType;
    level: OptionType;
    cost: number;
}

export const subjectService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query<OptionType[], void>({
            query: () => ({
                url: `${URL_SUBJECTS}`,
                method: HttpMethods.GET,
            }),

            transformResponse: (response: ISubject[]) => {
                const sortedResponse = response.sort((a, b) => {
                    a.name = t(`SUBJECTS.${a.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`);
                    b.name = t(`SUBJECTS.${b.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`);

                    if (a.priority && b.priority && a.priority !== b.priority) {
                        return a.priority - b.priority; // Sort by priority ascending
                    } else {
                        return a.name.localeCompare(b.name); // Sort alphabetically by name
                    }
                });

                const subjectOptions: OptionType[] = sortedResponse.map((subject) => ({
                    value: subject.id,
                    label: t(`SUBJECTS.${subject.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`),
                }));

                return subjectOptions;
            },
        }),
        updateSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${URL_TUTORS}/${body.tutorId}/subjects`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        createSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${URL_TUTORS}/${body.tutorId}/subjects`,
                    method: 'POST',
                    body,
                };
            },
        }),
        createSubjectsOnboarding: builder.mutation<void, ICreateSubjectsOnboarding>({
            query(body) {
                return {
                    url: `${URL_TUTORS}/${body.tutorId}/subjects/onboarding`,
                    method: 'POST',
                    body: body.subjects,
                };
            },
        }),

        deleteSubject: builder.mutation<void, any>({
            query({ tutorId, objectId }) {
                return {
                    url: `${URL_TUTORS}/${tutorId}/subjects/${objectId}`,
                    method: HttpMethods.DELETE,
                };
            },
        }),

        getTutorSubjectLevelPairs: builder.query<ITutorSubjectLevelOption[], string>({
            query: (tutorId) => ({
                url: `${URL_TUTORS}/${tutorId}/subjects`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutorSubjectLevelPair[]) => {
                const subjectLevelPairs: ITutorSubjectLevelOption[] = response.map((subjectLevelPair) => ({
                    subject: {
                        value: subjectLevelPair.subjectId,
                        label: t(
                            `SUBJECTS.${subjectLevelPair.subjectAbrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`
                        ),
                    },
                    level: {
                        value: subjectLevelPair.levelId,
                        label: t(
                            `LEVELS.${subjectLevelPair.levelAbrv.replaceAll(' ', '').replaceAll('-', '').toLowerCase()}`
                        ),
                    },
                    cost: subjectLevelPair.cost,
                }));
                return subjectLevelPairs;
            },
        }),
    }),
});

export const {
    useCreateSubjectsOnboardingMutation,
    useGetSubjectsQuery,
    useLazyGetSubjectsQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetTutorSubjectLevelPairsQuery,
} = subjectService;
