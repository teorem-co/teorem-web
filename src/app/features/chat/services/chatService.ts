import 'moment/locale/en-gb';

import { HttpMethods } from '../../../lookups/httpMethods';
import { IChatRoom, ISendChatMessage } from '../slices/chatSlice';
import { baseService } from '../../../store/baseService';

export interface IChatRoomsQuery {
    limitMessages: number;
    rpp: number;
    page: number;
}

export interface IChatMessagesQuery {
    userId: string;
    rpp: number;
    page: number;
}

export interface ISearchChatQuery {
    limitMessages: number;
    search: string;
    rpp: number;
    page: number;
}

export interface BookingChatMessageDTO {
    defaultMessage: boolean;
    tutorId: string;
    subjectId: string;
    levelId: string;
    startTime: string;
    curriculum?: string;
    textbook?: string;
    grade?: string;
    notes?: string;
}

const URL = '/api/v1/chat';

export const chatService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getChatRooms: builder.query<IChatRoom[], IChatRoomsQuery>({
            query: (body) => ({
                url: `${URL}/rooms?rpp=${body.rpp}&page=${body.page}&limitMessages=${body.limitMessages}`,
                method: HttpMethods.GET,
            }),
        }),
        getChatMessages: builder.query<ISendChatMessage[], IChatMessagesQuery>({
            query: (body) => ({
                url: `${URL}/messages?userId=${body.userId}&rpp=${body.rpp}&page=${body.page}`, //`${URL}/get-chat-messages?userId=${body.userId}&rpp=${body.rpp}&page=${body.page}`,
                method: HttpMethods.GET,
            }),
        }),
        postUploadFile: builder.mutation<ISendChatMessage, FormData>({
            query: (body) => ({
                url: `${URL}/chat-file`, //`${URL}/post-file`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
        getOnSearchChatRooms: builder.query<IChatRoom[], ISearchChatQuery>({
            query: (body) => ({
                url: `${URL}/search-rooms?search=${body.search}&rpp=${body.rpp}&page=${body.page}&limitMessages=${body.limitMessages}`,
                method: HttpMethods.GET,
            }),
        }),
        getChildBookingTutors: builder.query<IChatRoom[], void>({
            query: () => ({
                url: `${URL}/get-child-tutors?rpp=10&page=0&limitMessages=10`,
                method: HttpMethods.GET,
            }),
        }),
        getChatFile: builder.query<any, string>({
            query: (documentId) => ({
                url: `${URL}/download/${documentId}`,
                method: HttpMethods.GET,
            }),
        }),
        sendBookingInfoMessage: builder.mutation<void, BookingChatMessageDTO>({
            query: (body) => ({
                url: `${URL}/booking-information-message?defaultMessage=${body.defaultMessage}`,
                method: HttpMethods.POST,
                body: body,
            }),
        }),
    }),
});

export const {
    useLazyGetChatRoomsQuery,
    useLazyGetChatMessagesQuery,
    usePostUploadFileMutation,
    useLazyGetOnSearchChatRoomsQuery,
    useLazyGetChildBookingTutorsQuery,
    useLazyGetChatFileQuery,
    useSendBookingInfoMessageMutation,
} = chatService;
