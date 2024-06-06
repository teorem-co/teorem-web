import { baseService } from '../app/baseService';
import { OptionType } from '../app/components/form/MySelectField';
import IChangePassword
  from '../app/features/my-profile/interfaces/IChangePassword';
import { HttpMethods } from '../app/lookups/httpMethods';
import typeToFormData from '../app/utils/typeToFormData';
import { IChild } from '../interfaces/IChild';
import IUser from '../interfaces/IUser';
import IPage from '../interfaces/notification/IPage';
import IParams from '../interfaces/IParams';

const URL = '/api/v1/users';

export interface IUpdateUserInformation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryId: string;
  dateOfBirth: string;
  profileImage: string;
}

export interface IUpdateProfileImage {
  profileImage: string;
}

export interface ICreateChildRequest {
  parentId: string;
  body: IChild;
}

export interface IDeleteChildRequest {
  parentId: string;
  childId: string;
}

export interface ICredits {
  credits: number;
}

export interface ITutorStudentSearch {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  numberOfCompletedLessons: number;
  creditsAmount: number;
}

export const userService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInformation: builder.mutation<IUser, IUpdateUserInformation>({
      query: (body) => ({
        url: `${URL}/profile`,
        method: HttpMethods.PUT,
        body: typeToFormData(body),
      }),
    }),
    setTutorProfileImage: builder.mutation<IUser, IUpdateProfileImage>({
      query: (body) => ({
        url: `${URL}/profile-image`,
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
    getChildren: builder.query<IChild[], string>({
      query: (userId) => ({
        url: `${URL}/${userId}/children`,
        method: HttpMethods.GET,
      }),
      providesTags: ['child'],
    }),
    createChild: builder.mutation<void, ICreateChildRequest>({
      query: (request) => ({
        url: `${URL}/${request.parentId}/children`,
        method: HttpMethods.POST,
        body: request.body,
      }),
      invalidatesTags: ['child'],
    }),
    updateChild: builder.mutation<void, ICreateChildRequest>({
      query: (request) => ({
        url: `${URL}/${request.parentId}/children/${request.body.id}`,
        method: HttpMethods.PUT,
        body: request.body,
      }),
      invalidatesTags: ['child'],
    }),
    deleteChild: builder.mutation<void, IDeleteChildRequest>({
      query: (request) => ({
        url: `${URL}/${request.parentId}/children/${request.childId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: ['child'],
    }),
    getChild: builder.query<OptionType[], string>({
      query: (parentId) => ({
        url: `${URL}/${parentId}/children`,
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
    disconnectStripe: builder.mutation<void, any>({
      query: (tutorId) => ({
        url: `${URL}/${tutorId}/disconnect-stripe`,
        method: HttpMethods.PUT,
      }),
    }),
    getCredits: builder.query<ICredits, void>({
      query: () => ({
        url: `${URL}/credits`,
        method: HttpMethods.GET,
      }),
    }),
    getUserTimeZone: builder.query<string, string>({
      query: (userId) => ({
        url: `${URL}/${userId}/timezone`,
        method: HttpMethods.GET,
      }),
    }),
    getStudentInformation: builder.query<IPage<ITutorStudentSearch>, IParams>({
      query: (params) => ({
        url: `${URL}/student-information?page=${params.page}&size=${params.rpp}&search=${params.search}`,
        method: HttpMethods.GET,
      }),
    }),

    getStudentDetails: builder.query<ITutorStudentSearch, string>({
      query: (userId) => ({
        url: `${URL}/student-information/${userId}`,
        method: HttpMethods.GET,
      }),
    }),
  }),
});

export const {
  useUpdateUserInformationMutation,
  useSetTutorProfileImageMutation,
  useChangePasswordMutation,
  useLazyGetUserQuery,
  useLazyGetChildQuery,
  useGetChildQuery,
  useLazyGetChildrenQuery,
  useUpdateChildMutation,
  useDeleteChildMutation,
  useCreateChildMutation,
  useDisconnectStripeMutation,
  useLazyGetCreditsQuery,
  useLazyGetUserTimeZoneQuery,
  useLazyGetStudentInformationQuery,
  useLazyGetStudentDetailsQuery,
} = userService;
