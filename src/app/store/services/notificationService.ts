import { baseService } from '../baseService';
import IParams from '../../features/notifications/interfaces/IParams';
import { HttpMethods } from '../../types/httpMethods';
import IPage from '../../types/notification/IPage';
import INotification from '../../types/notification/INotification';

const URL = 'api/v1/notifications';

export const notificationService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query<IPage<INotification>, IParams>({
            query: (params) => ({
                url: `${URL}?size=${params.size}&page=${params.page - 1}&sort=${params.sort},${params.sortDirection}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['notifications'],
        }),
        getAllUnreadNotifications: builder.query<IPage<INotification>, IParams>({
            query: (params) => ({
                url: `${URL}?size=${params.size}&page=${params.page - 1}&read=${params.read}&sort=${params.sort},${params.sortDirection}`,
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

export const {
    useLazyGetAllNotificationsQuery,
    useMarkAsReadMutation,
    useLazyGetAllUnreadNotificationsQuery,
    useMarkAllAsReadMutation,
} = notificationService;
