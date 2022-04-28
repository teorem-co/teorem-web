import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useLazyGetChatRoomsQuery, useLazyGetChildBookingTutorsQuery } from './app/features/chat/services/chatService';
import { addChatRoom, addChatRooms, addMessage, ISendChatMessage, readMessage, setUser } from './app/features/chat/slices/chatSlice';
import { useAppSelector } from './app/hooks';
import { Role } from './app/lookups/role';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import ISocketNotification from './interfaces/notification/ISocketNotification';
import { useLazyGetUserQuery } from './services/userService';

function App() {
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);
    const chat = useAppSelector((state) => state.chat);

    const chatDispatch = useDispatch();
    const userData = useAppSelector((state) => state.user);

    const [getUserById, { data: user2Data }] = useLazyGetUserQuery();
    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const [getChildBookingTutors, { data: childTutors, isSuccess: isSuccessChildTutors }] = useLazyGetChildBookingTutorsQuery();

    const dispatch = useDispatch();

    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log(`Connected with id : ${socket.id}`); // true
        // });

        //getChatRooms();

        chat.socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
                notification.description = notification.description.replace(/date=\{(.*?)\}/g, function (match, token) {
                    return moment(new Date(token)).format('HH:mm, DD/MMM/YYYY');
                });
                toastService.notification(notification.description);
            }
        });

        chat.socket.on('messageReceive', async (sendMessageObject: any) => {

            if (userId) {


                //dispatch(readMessage(sendMessageObject));
                let user: any = null;
                let user2: any = null;


                if (userData.user?.id == sendMessageObject.userId) {
                    user = userData.user;
                    user2 = await getUserById(sendMessageObject.tutorId).unwrap();
                } else {
                    user = await getUserById(sendMessageObject.userId).unwrap();
                    user2 = userData.user;
                }

                dispatch(addChatRoom({
                    user: {
                        userId: user.id + '',
                        userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                        userNickname: user?.firstName + ' ' + user?.lastName,
                    },
                    tutor: {
                        userId: user2.id + '',
                        userImage: user2.profileImage || 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                        userNickname: user2.firstName + ' ' + user2.lastName,
                    },
                    messages: [],
                    unreadMessageCount: 0
                }));

                dispatch(addMessage(sendMessageObject));
            }

        });

        return function disconnectSocket() {
            chat.socket.disconnect();
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

        if (document) {

            if (chat.newMessages > 0) {
                document.title = "Inbox(" + (chat.newMessages > 9 ? "9+" : chat.newMessages) + ") - Teorem";
            } else {
                document.title = "Teorem";
            }
        }

    }, [chat]);

    useEffect(() => {

        if (userId) {

            if (userData.user?.Role.abrv == Role.Child)
                getChildBookingTutors();

            getChatRooms({
                limitMessages: 20,
                rpp: 1000,
                page: 1
            });


            chatDispatch(
                setUser(
                    {
                        userId: userData.user?.id + '',
                        userNickname: (userData.user?.firstName + '') + ' ' + (userData.user?.lastName + ''),
                        userImage: userData.user?.profileImage || 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg'
                    }
                )
            );
        }

    }, [userId]);

    useEffect(() => {

        if (isSuccessChildTutors) {
            console.log(childTutors);
            dispatch(addChatRooms(childTutors || null));
        }
    }, [childTutors]);

    return <RenderRoutes routes={ROUTES} />;
}

export default App;

