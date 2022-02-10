import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IPartOfDayOption from '../interfaces/IPartOfDayOption';
import ITutorAvailability from '../interfaces/ITutorAvailability';

const URL = '/tutor-availabilities';

export interface ITutorAvailabilityToSend {
    tutorAvailability: ITutorAvailability[];
}

export const tutorAvailabilityService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getTutorAvailability: builder.query<(string | boolean)[][], string>({
            query: (tutorId) => ({
                url: `${URL}/${tutorId}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['userAvailability'],
            transformResponse: (response: ITutorAvailability[]) => {
                const partsOfDay = [
                    { value: 'beforeNoon', label: 'Pre 12 pm' },
                    { value: 'noonToFive', label: '12 - 5 pm' },
                    { value: 'afterFive', label: 'After 5 pm' },
                ];
                const firstRow: string[] = [
                    '',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun',
                ];

                const availabilityTableData: (string | boolean)[][] = [];

                partsOfDay.forEach((partOfDay: IPartOfDayOption) => {
                    const row: (string | boolean)[] = response.map(
                        (item: any) => {
                            return item[partOfDay.value];
                        }
                    );
                    row.unshift(partOfDay.label);

                    availabilityTableData.push(row);
                });

                availabilityTableData.unshift(firstRow);

                return availabilityTableData;
            },
        }),
        updateTutorAvailability: builder.mutation<
            void,
            ITutorAvailabilityToSend
        >({
            query: (body) => ({
                url: `${URL}`,
                method: HttpMethods.PUT,
                body: body,
            }),
            invalidatesTags: ['userAvailability'],
        }),
        createTutorAvailability: builder.mutation<
            void,
            ITutorAvailabilityToSend
        >({
            query: (body) => ({
                url: `${URL}`,
                method: HttpMethods.POST,
                body: body,
            }),
            invalidatesTags: ['userAvailability'],
        }),
    }),
});

export const {
    useLazyGetTutorAvailabilityQuery,
    useUpdateTutorAvailabilityMutation,
    useCreateTutorAvailabilityMutation,
} = tutorAvailabilityService;
