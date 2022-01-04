import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';

interface ILogin {
    email: string;
    password: string;
}

interface ILoginResponse {
    token: string;
    user: {
        id: string;
    };
}

const URL = '/membership';

export const authService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILogin>({
            query: (body) => ({
                url: `${URL}/login`,
                method: HttpMethods.POST,
                body,
            }),
        }),
    }),
});

export const { useLoginMutation } = authService;
