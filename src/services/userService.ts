import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import IChangePassword from '../app/features/my-profile/interfaces/IChangePassword';
import { HttpMethods } from '../app/lookups/httpMethods';
import typeToFormData from '../app/utils/typeToFormData';
import { IChild } from '../interfaces/IChild';
import IChildUpdate from '../interfaces/IChildUpdate';
import IUser from '../interfaces/IUser';

const URL = '/users';

export interface IUpdateUserInformation {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryId: string;
    dateOfBirth: string;
    profileImage: string;
}

export const userService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        updateUserInformation: builder.mutation<IUser, IUpdateUserInformation>({
            query: (body) => ({
                url: `${URL}`,
                method: HttpMethods.PUT,
                body: typeToFormData(body),
            }),
        }),
        changePassword: builder.mutation<void, IChangePassword>({
            query: (body) => ({
                url: `${URL}/change-password`,
                method: HttpMethods.PUT,
                body: body,
            }),
        }),
        getUser: builder.query<IUser, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
        }),
        getChildren: builder.query<IChild[], void>({
            query: () => ({
                url: `${URL}/children`,
                method: HttpMethods.GET,
            }),
            providesTags: ['child'],
        }),
        createChild: builder.mutation<void, IChild>({
            query: (body) => ({
                url: `${URL}/children`,
                method: HttpMethods.POST,
                body: body,
            }),
            invalidatesTags: ['child'],
        }),
        updateChild: builder.mutation<void, IChildUpdate>({
            query: (body) => ({
                url: `${URL}/children/${body.childId}`,
                method: HttpMethods.PUT,
                body: body,
            }),
            invalidatesTags: ['child'],
        }),
        deleteChild: builder.mutation<void, string>({
            query: (childId) => ({
                url: `${URL}/children/${childId}`,
                method: HttpMethods.DELETE,
            }),
            invalidatesTags: ['child'],
        }),
        getChild: builder.query<OptionType[], void>({
            query: () => ({
                url: `${URL}/children`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IUser[]) => {
                const childOptions: OptionType[] = response.map((child) => ({
                    value: child.id,
                    label: child.firstName + ' ' + child.lastName,
                }));

                return childOptions;
            },
        }),
    }),
});

export const {
    useUpdateUserInformationMutation,
    useChangePasswordMutation,
    useLazyGetUserQuery,
    useLazyGetChildQuery,
    useGetChildQuery,
    useLazyGetChildrenQuery,
    useUpdateChildMutation,
    useDeleteChildMutation,
    useCreateChildMutation,
} = userService;
