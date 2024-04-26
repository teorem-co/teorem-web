import { t } from 'i18next';

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
import ITutorItem from '../interfaces/ITutorItem';
import IPage from '../interfaces/notification/IPage';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

interface ITutorUnavailablePeriod {
    start: string;
    end: string;
}

export interface ITutorUnavailablePeriodParams {
    tutorId: string;
    startOfWeek: string;
    endOfWeek: string;
    timeZone: string;
}

interface ITutorItemPage {
    totalPages: number;
    totalElements: number;
    last: boolean;
    number: number;
    size: number;
    content: ITutorItem[];
}

interface ITutorAvailable {
    count: number;
    rows: ITutorItem[];
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

export interface ITutorAdminSearch {
    userId: string;
    slug: string;
    firstName: string;
    lastName: string;
    email: string;
    countryFlag: string;
    countryName: string;
    countryAbrv: string;
    phoneNumber: string;
    verified: boolean;
    adminNote: string;
    createdAt: string;
}

export interface ITutorVideoInformation {
    url: string | undefined;
    // videoThumbnail: string;
    approved: boolean | undefined;
    videoTranscoded: boolean;
}

export interface IAdminTutorVideoInformation {
    tutorId: string;
    tutorSlug: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    videoUrl: string;
    videoApproved: boolean;
}

export interface IDeclineTutorVideo {
    tutorId: string;
    message: string;
}

const URL = 'api/v1/tutors';
const BOOKING_URL = 'api/v1/bookings';

export const tutorService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        // this one sends request for Admin page
        searchTutors: builder.query({
            query: (params: any) => {
                const queryData = {
                    url: `${URL}/admin-search?page=${params.page}&size=${params.rpp}&unprocessed=${params.unprocessed ? 'true' : 'false'}${
                        params.verified ? (params.verified == 1 ? '&verified=true' : '&verified=false') : ''
                    }&search=${params.search}&sort=createdAt,desc`, //TODO: fix later
                    method: HttpMethods.GET,
                };

                return queryData;
            },
        }),
        getAvailableTutors: builder.query<ITutorItemPage, IParams>({
            query: (params) => {
                //TODO: fix this -1 page problem
                const queryData = {
                    url: `${URL}/available-tutors?size=${params.rpp}&page=${params.page}${params.subject ? '&subjectId=' + params.subject : ''}${
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
        getTutorByTutorSlug: builder.query<ITutor, string>({
            query: (userSlug) => ({
                url: `${URL}?slug=${userSlug}`,
                method: HttpMethods.GET,
            }),
        }),
        getTutorById: builder.query<ITutor, string>({
            query: (userId) => ({
                url: `${URL}?tutorId=${userId}`,
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
                const userRole = getUserRoleAbbrv();
                const bookings: IBookingTransformed[] = response.map((x) => {
                    if (userRole === RoleOptions.Parent) {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replaceAll('-', '').replaceAll(' ', '')}`) : 'No title',
                            userId: x.User ? x.User.parentId : '',
                            start: new Date(x.startTime),
                            end: new Date(x.endTime),
                            isAccepted: x.isAccepted,
                            inReschedule: x.inReschedule,
                            allDay: false,
                        };
                    } else {
                        return {
                            id: x.id,
                            label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replaceAll('-', '').replaceAll(' ', '')}`) : 'No title',
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
                url: `${URL}/disable`,
                method: HttpMethods.PUT,
            }),
        }),
        enableTutor: builder.query<void, void>({
            query: () => ({
                url: `${URL}/enable`,
                method: HttpMethods.PUT,
            }),
        }),
        editTutor: builder.mutation<void, any>({
            query: (body) => ({
                url: `${URL}/${body.tutorId}/edit-tutor`,
                method: HttpMethods.PUT,
                body: typeToFormData(body),
            }),
        }),
        disconnectStripeTutor: builder.mutation<void, any>({
            query: (tutorId) => ({
                url: `${URL}/disconnect-tutor-stripe/?tutorId=${tutorId}`,
                method: HttpMethods.PUT,
            }),
        }),
        getTutorUnavailableDays: builder.query<string[], string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}/unavailable-days`,
                method: HttpMethods.GET,
            }),
        }),
        getTutorVideoInformation: builder.query<ITutorVideoInformation, void>({
            query: () => ({
                url: `${URL}/video-information`,
                method: HttpMethods.GET,
            }),
        }),
        getAdminTutorVideoInformation: builder.query<IPage<IAdminTutorVideoInformation>, IParams>({
            query: (params) => ({
                url: `${URL}/admin/video-information?page=${params.page}&rpp=${params.rpp}&approved=${params.videoApproved}`,
                method: HttpMethods.GET,
            }),
        }),
        deleteTutorVideo: builder.query<void, string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}/video`,
                method: HttpMethods.DELETE,
            }),
        }),
        approveTutorVideo: builder.query<void, string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}/video/approve`,
                method: HttpMethods.PATCH,
            }),
        }),
        declineTutorVideo: builder.query<void, IDeclineTutorVideo>({
            query: (params) => ({
                url: `${URL}/${params.tutorId}/admin/video?message=${params.message}`,
                method: HttpMethods.DELETE,
            }),
        }),
        getTutorUnavalabilitesForCalendar: builder.query<IBookingTransformed[], ITutorUnavailablePeriodParams>({
            query: (params) => ({
                url: `${BOOKING_URL}/tutorAllUnavailablePeriods?tutorId=${params.tutorId}&startOfWeek=${params.startOfWeek}&endOfWeek=${params.endOfWeek}&timeZone=${params.timeZone}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: ITutorUnavailablePeriod[]) => {
                const periods: IBookingTransformed[] = response.map((x, index) => {
                    return {
                        id: uuidv4(),
                        label: 'unavailable',
                        start: new Date(x.start),
                        end: new Date(moment(x.end).subtract(1, 'second').toISOString()), // this is because it will add 1 minute to the end time (if end time is 18:00 it will show as 18:01)
                        allDay: false,
                    };
                });

                return periods;
            },
        }),
        getTutorTimeZone: builder.query<string, string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}/time-zone`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazySearchTutorsQuery,
    useLazyGetAvailableTutorsQuery,
    useGetAvailableTutorsQuery,
    useGetProfileProgressQuery,
    useLazyGetProfileProgressQuery,
    useUpdateAditionalInfoMutation,
    useLazyGetTutorBookingsQuery,
    useLazyGetTutorByIdQuery,
    useApproveTutorMutation,
    useDenyTutorMutation,
    useDeleteTutorMutation,
    useLazyDisableTutorQuery,
    useLazyEnableTutorQuery,
    useEditTutorMutation,
    useDisconnectStripeTutorMutation,
    useLazyGetTutorByTutorSlugQuery,
    useLazyGetTutorUnavailableDaysQuery,
    useLazyGetTutorVideoInformationQuery,
    useLazyDeleteTutorVideoQuery,
    useLazyApproveTutorVideoQuery,
    useLazyGetAdminTutorVideoInformationQuery,
    useLazyDeclineTutorVideoQuery,
    useLazyGetTutorUnavalabilitesForCalendarQuery,
    useLazyGetTutorTimeZoneQuery,
} = tutorService;

export function getUserRoleAbbrv() {
    const { auth } = getAppState();
    return auth.user?.Role.abrv;
}
