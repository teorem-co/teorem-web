import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from './store';

export const baseService = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API}/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
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
