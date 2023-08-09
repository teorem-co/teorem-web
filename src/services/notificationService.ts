import { baseService } from '../app/baseService';
import IParams from '../app/features/notifications/interfaces/IParams';
import { HttpMethods } from '../app/lookups/httpMethods';
import IPage from "../interfaces/notification/IPage";

const URL = 'api/v1/notifications';

export const notificationService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query<IPage, IParams>({
            query: (params) => ({
                url: `${URL}?size=${params.size}&page=${params.page}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['notifications'],
        }),
        getAllUnreadNotifications: builder.query<IPage, void>({
            query: () => ({
                url: `${URL}/unread`,
                method: HttpMethods.GET,
            }),
            providesTags: ['notificationsUnread'],
        }),
        markAsRead: builder.mutation<void, string>({
            query: (id) => ({
                url: `${URL}/${id}`,
                method: HttpMethods.PUT,
            }),
            invalidatesTags: ['notifications'],
        }),
        markAllAsRead: builder.mutation<void, void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.PUT,
            }),
            invalidatesTags: ['notificationsUnread'],
        }),
    }),
});

export const { useLazyGetAllNotificationsQuery, useMarkAsReadMutation, useLazyGetAllUnreadNotificationsQuery, useMarkAllAsReadMutation } =
    notificationService;
