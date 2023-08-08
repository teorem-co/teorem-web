import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';
import IGenerateUsername from '../interfaces/IGenerateUsername';
import { IChild } from '../interfaces/IChild';
import IUser from '../interfaces/IUser';

interface ILogin {
    email: string;
    password: string;
}

interface ILoginPayload {
  token: string;
  user: IUser;
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
    children?: IChild[];
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

interface IChangePassword {
    token: string;
    password: string;
    repeatPassword: string;
}

interface IChangeCurrentPassword {
    oldPassword: string;
    password: string;
    confirmPassword: string;
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

interface IResendEmail {
    email: string;
}

const URL = '/api/v1/users';
export const authService = baseService.injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<ILoginPayload, ILogin>({
        query: (body) => ({
          url: `/api/v1/auth/login`,
          method: HttpMethods.POST,
          body,
        }),
      }),
      resetPassword: builder.mutation<void, IResetPassword>({
        query: (body) => ({
          url: `/request-reset-password`,
          method: HttpMethods.POST,
          body,
        }),
      }),
      changePassword: builder.mutation<void, IChangePassword>({
        query: (body) => ({
          url: `/reset-password`,
                method: HttpMethods.PUT,
                body: {
                    password: body.password,
                    confirmPassword: body.repeatPassword,
                    token: body.token
                },
            }),
        }),
        changeCurrentPassword: builder.mutation<void, IChangeCurrentPassword>({
            query: (body) => ({
                url: `/users/change-password`,
                method: HttpMethods.PUT,
                body: {
                    oldPassword: body.oldPassword,
                    password: body.password,
                    confirmPassword: body.confirmPassword,
                },
            }),
        }),
        registerTutor: builder.mutation<void, IRegisterTutor>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        registerParent: builder.mutation<void, IRegisterParent>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        registerStudent: builder.mutation<void, IRegisterStudent>({
            query: (body) => ({
                url: `${URL}/register`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        checkMail: builder.mutation<boolean, ICheckMail>({
            query: (body) => ({
                url: `${URL}/check-email?mail=` + body.email,
                method: HttpMethods.GET,
            }),
        }),
        checkUsername: builder.mutation<boolean, ICheckUsername>({
            query: (body) => ({
                url: `${URL}/check-username?username=` + body.username,
                method: HttpMethods.GET,
            }),
        }),
        generateChildUsername: builder.mutation<IGenerateUsername, IGenerateUsername>({
            query: (body) => ({
                url: `${URL}/generate-username?username=` + body.username,
                method: HttpMethods.GET,
            }),
        }),
        getServerVersion: builder.query<string, void>({
            query: () => ({
                url: '/get-server-version',//`/get-server-version`,
                method: HttpMethods.GET,
            }),
        }),
        resendActivationEmail: builder.mutation<string, IResendEmail>({
            query: (body) => ({
                url: `${URL}/resend-activation-email`,
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
    useGenerateChildUsernameMutation,
    useChangePasswordMutation,
    useChangeCurrentPasswordMutation,
    useLazyGetServerVersionQuery,
    useResendActivationEmailMutation,
} = authService;
