import { t } from 'i18next';

import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import { HttpMethods } from '../app/lookups/httpMethods';
import ISubject from '../interfaces/ISubject';
import INotification from '../interfaces/notification/INotification';
import ITutorItem from '../interfaces/ITutorItem';
import { ITutorSubject } from '../slices/onboardingSlice';

const URL_TUTORS = 'api/v1/tutors';
const URL_SUBJECTS = 'api/v1/subjects';

interface ICreateSubjectsOnboarding{
  tutorId:string;
  subjects: ICreateSubjectOnboarding[];
}

export interface ICreateSubjectOnboarding{
  id?:string,
  levelId:string,
  subjectId:string,
  price:string
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
  levelAbrv:string;
}

export interface ITutorSubjectLevelOption {
  subject: OptionType;
  level: OptionType;
}


export const subjectService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query<OptionType[], void>({
          query: () => ({
            url: `${URL_SUBJECTS}`,
            method: HttpMethods.GET,
          }),
          transformResponse: (response: ISubject[]) => {
            const subjectOptions: OptionType[] = response.map((level) => ({
              value: level.id,
              label: t(`SUBJECTS.${level.abrv.replace(' ', '').replaceAll('-', '').toLowerCase()}`),
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
            query({tutorId, objectId } ) {
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
  useCreateSubjectsOnboardingMutation,
    useGetSubjectsQuery,
    useLazyGetSubjectsQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetTutorSubjectLevelPairsQuery
} = subjectService;
