import { baseService } from '../app/baseService';
import IParams from '../app/features/notifications/interfaces/IParams';
import { HttpMethods } from '../app/lookups/httpMethods';
import INotification from '../interfaces/notification/INotification';
import INotifications from '../interfaces/notification/INotifications';

const URL = 'notifications';

export const notificationService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query<INotifications, IParams>({
            query: (params) => ({
                url: `${URL}?rpp=${params.rpp}&page=${params.page}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['notifications'],
        }),
        getAllUnreadNotifications: builder.query<INotification[], void>({
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
