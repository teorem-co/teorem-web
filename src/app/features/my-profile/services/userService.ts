import IUser from '../../../../interfaces/IUser';
import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import typeToFormData from '../../../utils/typeToFormData';
import IPartOfDayOption from '../interfaces/IPartOfDayOption';
import ITutorAvailability from '../interfaces/ITutorAvailability';

const URL = '/users';

export interface IUpdateUserInformation {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryId: string;
    dateOfBirth: string;
    profileImage: string;
}

export const updateUserInformation = baseService.injectEndpoints({
    endpoints: (builder) => ({
        updateUserInformation: builder.mutation<void, IUpdateUserInformation>({
            query: (body) => ({
                url: `${URL}`,
                method: HttpMethods.PUT,
                body: typeToFormData(body),
            }),
        }),
        getUser: builder.query<IUser, string>({
            query: (userId) => ({
                url: `${URL}/${userId}`,
                method: HttpMethods.GET,
            }),
            // providesTags: ['User'],
        }),
    }),
});

export const { useUpdateUserInformationMutation, useLazyGetUserQuery } =
    updateUserInformation;
