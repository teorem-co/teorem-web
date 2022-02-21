import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import IChangePassword from '../app/features/my-profile/interfaces/IChangePassword';
import { HttpMethods } from '../app/lookups/httpMethods';
import typeToFormData from '../app/utils/typeToFormData';
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
} = userService;
