import IChatEnginePost from '../../interfaces/IChatEnginePost';
import { baseService } from '../baseService';
import { HttpMethods } from '../lookups/httpMethods';

interface IGetOrCreateChat {
    username: string;
    tutorUsername: string;
}

export const chatEngineService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        addUser: builder.mutation<void, IChatEnginePost>({
            query: (body) => ({
                url: `https://api.chatengine.io/users/`,
                method: HttpMethods.POST,
                headers: {
                    'PRIVATE-KEY': `ef005d25-a699-4533-980c-8541bfe946e5`,
                },
                body,
            }),
        }),
        getOrCreateChat: builder.mutation<any, IGetOrCreateChat>({
            query: (body) => ({
                url: `https://api.chatengine.io/chats/`,
                method: HttpMethods.PUT,
                headers: {
                    'Project-Id': '18898bd1-08c8-40ea-aed1-fb1a1cf1e413',
                    'User-Name': body.username,
                    'User-Secret': 'Teorem1!',
                },
                body: {
                    usernames: [body.tutorUsername],
                    title: 'Direct Message',
                    is_direct_chat: true,
                },
            }),
        }),
    }),
});

export const { useAddUserMutation, useGetOrCreateChatMutation } = chatEngineService;
