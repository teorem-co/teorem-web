import IGetRecordingLinks from '../../interfaces/IGetRecordingLinks';
import IGetRoomLink from '../../interfaces/IGetRoomLink';
import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

const URL = '/api/v1/meeting';

interface IMeetingUrl{
    meetingUrl: string;
}

interface IMeetRecording{
  videoUrl: string,
  meetingTitle: string
  videoTitle: string
}
export const hiLinkService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getRoomLink: builder.query<IMeetingUrl, IGetRoomLink>({
            query: (params) => ({
                url: `${URL}/get-room-link/?userId=${params.userId}&bookingId=${params.bookingId}`,//`${URL}/get-room-link/?userId=${params.userId}&bookingId=${params.bookingId}`,
                method: HttpMethods.GET,
            }),
        }),
        getRecordingLinks: builder.query<IMeetRecording[], IGetRecordingLinks>({
            query: (params) => ({
                url: `${URL}/recordings?meetingId=${params.meetingId}`,
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
    useLazyGetRecordingLinksQuery,
    useLazyGetFreeConsultationLinkQuery
} = hiLinkService;
