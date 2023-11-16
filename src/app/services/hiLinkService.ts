import IGetRecordingLinks from '../../interfaces/IGetRecordingLinks';
import IGetRoomLink from '../../interfaces/IGetRoomLink';
import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

const URL = '/api/v1/meetings';

interface IMeetingUrl{
  meetingUrl: string;
}

export interface IMeetRecording{
  videoUrl: string,
  meetingTitle: string
  videoTitle: string
}
export const hiLinkService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getRoomLink: builder.query<IMeetingUrl, IGetRoomLink>({
      query: (params) => ({
        url: `${URL}/room-link?userId=${params.userId}&bookingId=${params.bookingId}`,
        method: HttpMethods.GET,
      }),
    }),
    getLessonRecordings: builder.query<IMeetRecording[], IGetRecordingLinks>({
      query: (params) => ({
        url: `${URL}/${params.meetingId}/recordings`,
        method: HttpMethods.GET,
      }),
    }),
    getFreeConsultationLink: builder.query<string, string>({
      query: (tutorId) => ({
        url: `${URL}/free-consultation/${tutorId}`,
        method: HttpMethods.GET,
      }),
    }),
    getTutorTestingLink: builder.query<IMeetingUrl, void>({
      query: () => ({
        url: `${URL}/tutor-testing-link`,
        method: HttpMethods.GET,
      }),
    }),
  }),
});

export const {
  useLazyGetRoomLinkQuery,
  useLazyGetLessonRecordingsQuery,
  useLazyGetFreeConsultationLinkQuery,
  useLazyGetTutorTestingLinkQuery
} = hiLinkService;
