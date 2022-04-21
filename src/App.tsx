import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useLazyGetChatRoomsQuery } from './app/features/chat/services/chatService';
import { addChatRooms, addMessage, ISendChatMessage, readMessage, setUser } from './app/features/chat/slices/chatSlice';
import { useAppSelector } from './app/hooks';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import ISocketNotification from './interfaces/notification/ISocketNotification';

function App() {
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);
    const chat = useAppSelector((state) => state.chat);
    const socket = useAppSelector((state) => state.chat.socket);

    const chatDispatch = useDispatch();
    const userData = useAppSelector((state) => state.user);

    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log(`Connected with id : ${socket.id}`); // true
        // });

        //getChatRooms();

        socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
                notification.description = notification.description.replace(/date=\{(.*?)\}/g, function (match, token) {
                    return moment(new Date(token)).format('HH:mm, DD/MMM/YYYY');
                });
                toastService.notification(notification.description);
            }
        });

        socket.on('messageReceive', (sendMessageObject: any) => {

            if (userId) {
                dispatch(addMessage(sendMessageObject));
                //dispatch(readMessage(sendMessageObject));
            }
        });

        return function disconnectSocket() {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {

        if (isSuccessChatRooms) {
            dispatch(addChatRooms(chatRooms || null));

            chat.socket.emit('chatEntered', {
                userId: userId
            });
        }

    }, [chatRooms]);

    useEffect(() => {

        if (userId) {

            getChatRooms();


            chatDispatch(
                setUser(
                    {
                        userId: userData.user?.id + '',
                        userNickname: (userData.user?.firstName + '') + ' ' + (userData.user?.lastName + ''),
                        userImage: userData.user?.profileImage || process.env.DEFAULT_PROFILE_IMAGE || ''
                    }
                )
            );
        }

    }, [userId]);

    return <RenderRoutes routes={ROUTES} />;
}

export default App;

