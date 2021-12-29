import { createApi } from '@reduxjs/toolkit/dist/query';

import { axiosBaseQuery } from './axiosBaseQuery';

export const baseService = createApi({
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.REACT_APP_SCHEMA}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API}/`,
    }),
    tagTypes: [],
    endpoints: () => ({}),
});
