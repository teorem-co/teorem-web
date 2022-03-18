import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import IChatEnginePost from '../../interfaces/IChatEnginePost';
import { HttpMethods } from '../lookups/httpMethods';

export const chatEngineService = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.chatengine.io`,
    }),
    tagTypes: [],
    endpoints: (builder) => ({
        addUser: builder.mutation<void, IChatEnginePost>({
            query: (body) => ({
                url: `/users/`,
                method: HttpMethods.POST,
                headers: {
                    'PRIVATE-KEY': '8c45e93f-3d50-4a31-9cff-dddf970ff170',
                },
                body,
            }),
        }),
    }),
});

export const { useAddUserMutation } = chatEngineService;
