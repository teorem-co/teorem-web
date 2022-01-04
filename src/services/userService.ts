import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';

const URL = 'users';

export const userService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getUserId: builder.query<any, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetUserIdQuery } = userService;
