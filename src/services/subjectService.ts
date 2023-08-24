import { t } from 'i18next';

import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ISubject from '../interfaces/ISubject';

const NEW_URL = 'api/v1/tutors/subjects';
const URL_TUTORS = 'api/v1/tutors';

const URL = 'api/v1/subjects';
const mutationURL = 'api/v1/tutor-subjects';
const TUTOR_SUBJECT_URL = 'api/v1/tutor-subjects';


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
    levelId?: string;     //TODO remove ? to make it mandatory
    tutorId?: string;
    objectId?: string;
    price: number;
}

interface ITutorSubjectId {
    tutorId: string;
    levelId: string;
}

export interface ITutorSubjectLevelPair {
  subjectId: string;
  subjectAbrv: string;
  levelId: string;
  levelAbrv:string;
}

export interface ITutorSubjectLevelPair2 {
  subject: OptionType;
  level: OptionType;
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
                    label: t(`SUBJECTS.${level.abrv.replace(' ', '').replace('-', '').toLowerCase()}`),
                }));
                return subjectOptions;
            },
        }),
        getSubjectsByLevelAndSubject: builder.query<OptionType[], IId>({
            query: (ids) => ({
                url: `${URL}/filter/${ids.levelId}/?subjectId=${ids.subjectId ? ids.subjectId : ''
                    }`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IGetSubject[]) => {
                const subjectOptions: OptionType[] = response.map((level) => ({
                    value: level.id,
                    label: t(`SUBJECTS.${level.abrv.replace(' ', '').replace('-', '').toLowerCase()}`),
                }));
                return subjectOptions;
            },
        }),
        updateSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${NEW_URL}/${body.objectId}`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        createSubject: builder.mutation<void, ICreateSubject>({
            query(body) {
                return {
                    url: `${NEW_URL}/`,
                    method: 'POST',
                    body,
                };
            },
        }),
        deleteSubject: builder.mutation<void, string>({
            query(objectId) {
                return {
                    url: `${NEW_URL}/${objectId}`,
                    method: HttpMethods.DELETE,
                };
            },
        }),
        getTutorSubjectsByTutorLevel: builder.query<
            OptionType[],
            ITutorSubjectId
        >({
            query: (data) => ({
                url: `${TUTOR_SUBJECT_URL}/subjects/${data.tutorId}?levelId=${data.levelId}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ISubject[]) => {
                const subjectOptions: OptionType[] = response.map(
                    (subject) => ({
                        value: subject.id,
                        label: t(`SUBJECTS.${subject.abrv.replace('-', '').toLowerCase()}`),
                    })
                );
                return subjectOptions;
            },
        }),
        getTutorSubjectLevelPairs: builder.query<ITutorSubjectLevelPair2[], string>({
          query: (tutorId) => ({
            url: `${URL_TUTORS}/${tutorId}/subjects`,
            method: HttpMethods.GET,
          }),
          transformResponse: (response: ITutorSubjectLevelPair[]) => {
            const subjectLevelPairs: ITutorSubjectLevelPair2[] = response.map((subjectLevelPair) => ({
              subject: {
                value: subjectLevelPair.subjectId,
                label: t(`SUBJECTS.${subjectLevelPair.subjectAbrv.replace(' ', '').replace('-', '').toLowerCase()}`),
              },
              level: {
                value: subjectLevelPair.levelId,
                label: t(`LEVELS.${subjectLevelPair.levelAbrv.replace(' ', '').replace('-', '').toLowerCase()}`),
              }
            }));
            return subjectLevelPairs;
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
    useGetTutorSubjectLevelPairsQuery
} = subjectService;
