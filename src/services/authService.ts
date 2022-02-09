import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';
import typeToFormData from '../app/utils/typeToFormData';

interface ILogin {
    email: string;
    password: string;
}

interface ILoginResponse {
    token: string;
    user: {
        id: string;
        role: string;
    };
}
interface IRegisterTutor {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleAbrv: string;
    countryId: string;
    phoneNumber: string;
    dateOfBirth: string;
    profileImage: string;
}

interface IRegisterParent {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleAbrv: string;
    countryId: string;
    phoneNumber: string;
    dateOfBirth: string;
    children?: string;
}

interface IRegisterStudent {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleAbrv: string;
    countryId: string;
    phoneNumber: string;
    dateOfBirth: string;
}

interface IResetPassword {
    email: string;
}

interface ICheckMail {
    email: string;
}

interface ICheckUsername {
    username: string;
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
        resetPassword: builder.mutation<void, IResetPassword>({
            query: (body) => ({
                url: `${URL}/reset-password`,
                method: HttpMethods.POST,
                body,
            }),
        }),
        registerTutor: builder.mutation<void, IRegisterTutor>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: typeToFormData(body),
            }),
        }),
        registerParent: builder.mutation<void, IRegisterParent>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: typeToFormData(body),
            }),
        }),
        registerStudent: builder.mutation<void, IRegisterStudent>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: typeToFormData(body),
            }),
        }),
        checkMail: builder.mutation<boolean, ICheckMail>({
            query: (body) => ({
                url: `${URL}/check-email`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        checkUsername: builder.mutation<boolean, ICheckUsername>({
            query: (body) => ({
                url: `${URL}/check-username`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterTutorMutation,
    useRegisterParentMutation,
    useRegisterStudentMutation,
    useResetPasswordMutation,
    useCheckMailMutation,
    useCheckUsernameMutation,
} = authService;
