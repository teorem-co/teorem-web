import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

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
interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleAbrv: string;
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
        register: builder.mutation<void, IRegister>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authService;
