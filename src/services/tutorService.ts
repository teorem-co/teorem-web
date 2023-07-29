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
import typeToFormData from '../app/utils/typeToFormData';
import IBooking from '../app/features/my-bookings/interfaces/IBooking';

interface ITutorId {
    userId: string;
}

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

const URL = 'api/v1/tutors';
const BOOKING_URL = 'api/v1/bookings';
const TUTOR_MANAGEMENT_URL = 'api/v1/tutor-management';

export const tutorService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        // TODO: this one sends request for Admin page
        getTutors: builder.query({
            query: (params: any) => {
                const queryData = {
                    url: `${URL}/?page=${params.page
                        }&rpp=${params.rpp
                        }&unprocessed=${params.unprocessed ? "true" : "false"
                        }${params.verified ? params.verified == 1 ? "&verified=true" : "&verified=false" : ""}
                    `,
                    method: HttpMethods.GET,
                };

                return queryData;
            },
        }),
        searchTutors: builder.query({
            query: (params: any) => {
                const queryData = {
                    url: `${URL}/search-tutors/?page=${params.page
                        }&rpp=${params.rpp
                        }&unprocessed=${params.unprocessed ? "true" : "false"
                        }${params.verified ? params.verified == 1 ? "&verified=true" : "&verified=false" : ""
                        }&search=${params.search
                        }`,
                    method: HttpMethods.POST,
                };

                return queryData;
            },
        }),
        getAvailableTutors: builder.query<ITutorAvailable, IParams>({
            query: (params) => {
                const queryData = {
                    url: `${URL}/available-tutors?rpp=${params.rpp}&page=${params.page}${params.subject ? '&subjectId=' + params.subject : ''}${params.level ? '&levelId=' + params.level : ''
                        }${params.dayOfWeek ? '&dayOfWeek=' + params.dayOfWeek : ''}${params.timeOfDay ? '&timeOfDay=' + params.timeOfDay : ''}${params.sort ? '&sort=' + params.sort : ''
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
        getTutorIdByTutorSlug: builder.query<ITutorId, string>({
            query: (userId) => ({
                url: `${URL}/get-tutor-id-by-slug/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        //TODO: extract this to booking service
        getTutorBookings: builder.query<IBookingTransformed[], IBookingsByIdPayload>({
            query: (data) => ({
                url: `${BOOKING_URL}/${data.tutorId}/?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IBooking[]) => {
                console.log("UNUTAR TRANSFORM", response);
                const userRole = getUserRoleAbbrv();
                const bookings: IBookingTransformed[] = response.map((x) => {
                    const startTwoHoursBefore = new Date(x.startTime);
                    startTwoHoursBefore.setHours(startTwoHoursBefore.getHours() - 2);

                    const endTwoHoursBefore = new Date(x.endTime);
                    endTwoHoursBefore.setHours(endTwoHoursBefore.getHours() - 2);

                    if (userRole === RoleOptions.Parent) {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replace('-', '').replace(' ', '')}`) : 'No title',
                            userId: x.User ? x.User.parentId : '',
                            start: startTwoHoursBefore,
                            end: endTwoHoursBefore,
                            isAccepted: x.isAccepted,
                            allDay: false,
                        };
                    } else {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replace('-', '').replace(' ', '')}`) : 'No title',
                            userId: x.studentId ? x.studentId : '',
                            start: startTwoHoursBefore,
                            end: endTwoHoursBefore,
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
                    url: `${URL}/verify?tutorId=${tutorID}`,
                    method: 'PUT',
                };
            },
        }),
        denyTutor: builder.mutation({
            query(data) {
                return {
                    url: `${URL}/decline?tutorId=${data.tutorId}&message=${data.message}`,
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
        disableTutor: builder.query<void, void>({
            query: () => ({
                url: `${URL}/disable-tutor`,
                method: HttpMethods.PUT,
            }),
        }),
        enableTutor: builder.query<void, void>({
            query: () => ({
                url: `${URL}/enable-tutor`,
                method: HttpMethods.PUT,
            }),
        }),
        editTutor: builder.mutation<void, any>({
            query: (body) => ({
                url: `${URL}/edit-tutor`,
                method: HttpMethods.PUT,
                body: typeToFormData(body)
            }),
        }),
        disconnectStripeTutor: builder.mutation<void, any>({
            query: (tutorId) => ({
                url: `${URL}/disconnect-tutor-stripe/?tutorId=${tutorId}`,
                method: HttpMethods.PUT,
            }),
        }),
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
    useLazyDisableTutorQuery,
    useLazyEnableTutorQuery,
    useEditTutorMutation,
    useDisconnectStripeTutorMutation,
    useLazyGetTutorIdByTutorSlugQuery,
} = tutorService;

export function getUserRoleAbbrv() {
    const { auth } = getAppState();
    return auth.user?.Role.abrv;
}
