import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from './store';
import { BaseQueryApi } from '@reduxjs/toolkit/src/query/baseQueryTypes';
import { logout, setToken } from '../slices/authSlice';

let isRefreshing = false;
const refreshQueue: (() => Promise<void>)[] = [];


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

const baseQueryWithReauth = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    if (!isRefreshing) {
      // If a refresh is not already in progress, start the refresh
      isRefreshing = true;
      try {
        const refreshResult = await baseQuery('/api/v1/auth/refresh', api, extraOptions);
        if (refreshResult?.data) {
          api.dispatch(setToken({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            token: refreshResult?.data.token,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            user: refreshResult?.data.user,
          }));
          // Retry all enqueued requests after token refresh
          while (refreshQueue.length > 0) {
            const nextRequest = refreshQueue.shift();
            nextRequest && nextRequest();
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        isRefreshing = false;
      }
    } else {
      // If a refresh is already in progress, wait here
      await new Promise<void>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        refreshQueue.push(() => {
          resolve();
        });
      });
      // Retry the original request after refresh
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
