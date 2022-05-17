import { InteractionMode } from 'chart.js';
import i18n, { t } from 'i18next';

import { baseService } from '../app/baseService';
import IProgressProfile from '../app/features/my-profile/interfaces/IProgressProfile';
import IUpdateAdditionalInfo from '../app/features/my-profile/interfaces/IUpdateAdditionalInfo';
import { HttpMethods } from '../app/lookups/httpMethods';
import { getAppState } from '../app/utils/getAppState';
import IParams from '../interfaces/IParams';
import ITutor from '../interfaces/ITutor';
import { RoleOptions } from '../slices/roleSlice';

interface ITutorAvailable {
    count: number;
    rows: ITutor[];
}

interface IBookingsByIdPayload {
    dateFrom: string;
    dateTo: string;
    tutorId: string;
}

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    userId?: string;
    isAccepted?: boolean;
}

// interface ICreateTutorSubject {}

const URL = 'tutors';

export const tutorService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getTutors: builder.query({
            query: (params: any) => {
                const queryData = {
                    url: `${URL}/?page=${
                        params.page
                    }&rpp=${
                        params.rpp
                    }&unproccessed=${
                        params.unprocessed? "true" : "false"
                    }${params.verified? params.verified == 1 ? "&verified=true" : "&verified=false" : ""}
                    `,
                    method: HttpMethods.GET,
                };

                return queryData;
            },
        }),
        searchTutors: builder.query({
            query: (params: any) => {
                const queryData = {
                    url: `${URL}/search-tutors/?page=${
                        params.page
                    }&rpp=${
                        params.rpp
                    }&unproccessed=${
                        params.unprocessed? "true" : "false"
                    }${params.verified? params.verified == 1 ? "&verified=true" : "&verified=false" : ""
                    }&search=${
                        params.search
                    }`,
                    method: HttpMethods.POST,
                };

                return queryData;
            },
        }),
        getAvailableTutors: builder.query<ITutorAvailable, IParams>({
            query: (params) => {
                const queryData = {
                    url: `${URL}/available-tutors?rpp=${params.rpp}&page=${params.page}${params.subject ? '&subjectId=' + params.subject : ''}${
                        params.level ? '&levelId=' + params.level : ''
                    }${params.dayOfWeek ? '&dayOfWeek=' + params.dayOfWeek : ''}${params.timeOfDay ? '&timeOfDay=' + params.timeOfDay : ''}${
                        params.sort ? '&sort=' + params.sort : ''
                    }`,
                    method: HttpMethods.GET,
                };

                return queryData;
            },
        }),
        getProfileProgress: builder.query<IProgressProfile, void>({
            query: () => ({
                url: `${URL}/profile-progress`,
                method: HttpMethods.GET,
            }),
        }),
        updateAditionalInfo: builder.mutation<void, IUpdateAdditionalInfo>({
            query(body) {
                return {
                    url: `${URL}`,
                    method: 'PUT',
                    body,
                };
            },
        }),
        // updateMyTeachings: builder.mutation<void, IUpdateMyTeachings>({
        //     query(body) {
        //         return {
        //             url: `${URL}/my-teachings`,
        //             method: 'PUT',
        //             body,
        //         };
        //     },
        // }),
        getTutorProfileData: builder.query<ITutor, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        getTutorBookings: builder.query<IBookingTransformed[], IBookingsByIdPayload>({
            query: (data) => ({
                url: `${URL}/${data.tutorId}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutor) => {
                const userRole = getUserRoleAbbrv();
                const bookings: IBookingTransformed[] = response.Bookings.map((x) => {
                    if (userRole === RoleOptions.Parent) {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replace('-', '').replace(' ', '')}`) : 'No title',
                            userId: x.User ? x.User.parentId : '',
                            start: new Date(x.startTime),
                            end: new Date(x.endTime),
                            isAccepted: x.isAccepted,
                            allDay: false,
                        };
                    } else {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replace('-', '').replace(' ', '')}`) : 'No title',
                            userId: x.studentId ? x.studentId : '',
                            start: new Date(x.startTime),
                            end: new Date(x.endTime),
                            isAccepted: x.isAccepted,
                            allDay: false,
                        };
                    }
                });

                return bookings;
            },
            providesTags: ['tutorBookings'],
        }),
        approveTutor: builder.mutation({
            query(tutorID) {
                return {
                    url: `${URL}/verify-tutor/?tutorId=${tutorID}`,
                    method: 'PUT',
                };
            },
        }),
        denyTutor: builder.mutation({
            query(data) {
                return {
                    url: `${URL}/unverify-tutor/?tutorId=${data.tutorId}&message=${data.message}`,
                    method: 'PUT',
                };
            },
        }),
        deleteTutor: builder.mutation({
            query(tutorId) {
                return {
                    url: `${URL}/${tutorId}`,
                    method: 'DELETE',
                };
            },
        }),
        // postTutorsubject: builder.mutation<void, >
    }),
});

export const {
    useLazyGetTutorsQuery,
    useLazySearchTutorsQuery,
    useLazyGetAvailableTutorsQuery,
    useGetAvailableTutorsQuery,
    useGetProfileProgressQuery,
    useLazyGetProfileProgressQuery,
    useLazyGetTutorProfileDataQuery,
    useUpdateAditionalInfoMutation,
    useGetTutorProfileDataQuery,
    useLazyGetTutorBookingsQuery,
    useApproveTutorMutation,
    useDenyTutorMutation,
    useDeleteTutorMutation,
} = tutorService;

export function getUserRoleAbbrv() {
    const { auth } = getAppState();
    return auth.user?.Role.abrv;
}
