import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';
import INotification from '../interfaces/notification/INotification';

const URL = 'notifications';

export const notificationService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query<INotification[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['notifications'],
        }),
        markAsRead: builder.mutation<void, string>({
            query: (id) => ({
                url: `${URL}/${id}`,
                method: HttpMethods.PUT,
            }),
            invalidatesTags: ['notifications'],
        }),
    }),
});

export const { useLazyGetAllNotificationsQuery, useMarkAsReadMutation } = notificationService;
