import 'moment/locale/en-gb';

import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import typeToFormData from '../../../utils/typeToFormData';
import { IChatRoom, ISendChatMessage } from '../slices/chatSlice';

const URL = '/chat';
export interface IChatRoomsQuery {
    limitMessages: number;
    rpp: number;
    page: number
}

export interface IChatMessagesQuery {
    userId: string;
    rpp: number;
    page: number
}

export interface ISearchChatQuery {
    search: string;
    rpp: number;
    page: number
}

export const chatService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getChatRooms: builder.query<IChatRoom[], IChatRoomsQuery>({
            query: (body) => ({
                url: `${URL}/get-chat-rooms?rpp=${body.rpp}&page=${body.page}&limitMessages=${body.limitMessages}`,
                method: HttpMethods.GET,
            }),
        }),
        getChatMessages: builder.query<ISendChatMessage[], IChatMessagesQuery>({
            query: (body) => ({
                url: `${URL}/get-chat-messages?userId=${body.userId}&rpp=${body.rpp}&page=${body.page}`,
                method: HttpMethods.GET,
            }),
        }),
        postUploadFile: builder.mutation<ISendChatMessage, FormData>({
            query: (body) => ({
                url: `${URL}/post-file`,
                method: HttpMethods.POST,
                body: body
            }),
        }),
        getOnSearchChatRooms: builder.query<IChatRoom[], ISearchChatQuery>({
            query: (body) => ({
                url: `${URL}/search-chat-rooms?search=${body.search}&rpp=${body.rpp}&page=${body.page}`,
                method: HttpMethods.GET,
            }),
        }),
        getChildBookingTutors: builder.query<IChatRoom[], void>({
            query: () => ({
                url: `${URL}/get-child-tutors`,
                method: HttpMethods.GET,
            }),
        }),

    }),
});

export const {
    useLazyGetChatRoomsQuery,
    useLazyGetChatMessagesQuery,
    usePostUploadFileMutation,
    useLazyGetOnSearchChatRoomsQuery,
    useLazyGetChildBookingTutorsQuery
} = chatService;
