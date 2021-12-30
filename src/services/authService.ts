import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';

interface ILogin {
    email: string;
    password: string;
}

const URL = '/membership';

export const authService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILogin, ILogin>({
            query: (body) => ({
                url: `${URL}/login`,
                method: HttpMethods.POST,
                body,
            }),
        }),
    }),
});

export const { useLoginMutation } = authService;
