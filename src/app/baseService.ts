import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from './store';
import { BaseQueryApi } from '@reduxjs/toolkit/src/query/baseQueryTypes';
import { logout, setToken } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

let refreshInProgress: Promise<void> | null = null;

const baseQueryWithReauth = async (args: any, api: BaseQueryApi, extraOptions: any) => {
    if (refreshInProgress) {
        console.log('Waiting for refresh token to complete.');
        // Wait for the refresh to complete
        await refreshInProgress;
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log('403 detected.');
        if (!refreshInProgress) {
            console.log('Should call refresh.');
            // Declare that a refresh is in progress
            let resolveRefresh: (() => void) | undefined;
            refreshInProgress = new Promise((resolve) => {
                resolveRefresh = resolve;
            });

            const refreshResult = await baseQuery('/api/v1/auth/refresh', api, extraOptions);

            if (refreshResult?.data) {
                console.log('Refresh token successful. Saving it in the store.');
                api.dispatch(
                    setToken({
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        token: refreshResult?.data.token,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        user: refreshResult?.data.user,
                    })
                );
                console.log('Retrying original request.');
                result = await baseQuery(args, api, extraOptions);
            } else {
                console.log('Refresh token failed. Logging out.');
                api.dispatch(logout());
                window.location.href = `${window.location.origin}/en/login`;
            }

            // Declare end of refresh
            if (resolveRefresh) {
                console.log('Refresh token complete.');
                resolveRefresh();
            }

            refreshInProgress = null;
        } else {
            console.log('Refresh in progress. Waiting for it to complete.');
            // If another query is already refreshing the token, wait for it to finish
            await refreshInProgress;
            console.log('Retrying original request.');
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const baseService = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'userAvailability',
        'tutorBookings',
        'bookings',
        'tutor-unavailability',
        'notifications',
        'upcomingLessons',
        'notificationsUnread',
        'lessonCount',
        'child',
    ],
    endpoints: () => ({}),
});
