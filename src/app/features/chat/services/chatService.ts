import 'moment/locale/en-gb';
import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import { IChatRoom, ISendChatMessage } from '../slices/chatSlice';

const URL = '/chat';
interface IChatMessagesQuery {
    userId: string;
    rpp: number;
    page: number
}
export const chatService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getChatRooms: builder.query<IChatRoom[], void>({
            query: () => ({
                url: `${URL}/get-chat-rooms`,
                method: HttpMethods.GET,
            }),
        }),
        getChatMessages: builder.query<ISendChatMessage[], IChatMessagesQuery>({
            query: () => ({
                url: `${URL}/get-chat-rooms`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetChatRoomsQuery,
    useLazyGetChatMessagesQuery
} = chatService;