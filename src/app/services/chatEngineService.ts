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
                    'PRIVATE-KEY': `a4b9d872-7069-41ab-b7b8-73c3739311fa`,
                },
                body,
            }),
        }),
    }),
});

export const { useAddUserMutation } = chatEngineService;
