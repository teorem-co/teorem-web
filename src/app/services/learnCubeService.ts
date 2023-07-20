import IGetRecordedRooms from '../../interfaces/IGetRecordedRooms';
import IGetRoomLink from '../../interfaces/IGetRoomLink';
import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

//const URL = '/learn-cube';
const URL = '/api/v1/meeting';

interface IMeetingUrl{
    meetingUrl: string;
}
export const stripeService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getRoomLink: builder.query<IMeetingUrl, IGetRoomLink>({
            query: (params) => ({
                url: `${URL}/get-room-link/?userId=${params.userId}&bookingId=${params.bookingId}`,//`${URL}/get-room-link/?userId=${params.userId}&bookingId=${params.bookingId}`,
                method: HttpMethods.GET,
            }),
        }),
        getRecordedRooms: builder.query<any, IGetRecordedRooms>({
            query: (params) => ({
                url: `${URL}/get-recorded-room/?subjectId=${params.subjectId}&tutorId=${params.tutorId}&studentId=${params.studentId}`,
                method: HttpMethods.GET,
            }),
        }),
        getFreeConsultationLink: builder.query<string, string>({
            query: (tutorId) => ({
                url: `${URL}/free-consultation/${tutorId}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetRoomLinkQuery,
    useLazyGetRecordedRoomsQuery,
    useLazyGetFreeConsultationLinkQuery
} = stripeService;
