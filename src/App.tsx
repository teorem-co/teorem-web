import moment from 'moment';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useLazyGetChatRoomsQuery, useLazyGetChildBookingTutorsQuery } from './app/features/chat/services/chatService';
import { addChatRoom, addChatRooms, addMessage, setBuffer, setConsultationInitialized, setUser } from './app/features/chat/slices/chatSlice';
import { useAppSelector } from './app/hooks';
import { Role } from './app/lookups/role';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/services/toastService';
import { NotificationType } from './interfaces/notification/INotification';
import ISocketNotification from './interfaces/notification/ISocketNotification';
import { useLazyGetUserQuery } from './services/userService';

function App() {

    const { t } = useTranslation();
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);
    const chat = useAppSelector((state) => state.chat);
    const freeConsultationRef = useRef<any>(null);

    const chatDispatch = useDispatch();
    const userData = useAppSelector((state) => state.user);

    const [getUserById, { data: user2Data }] = useLazyGetUserQuery();
    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const [getChildBookingTutors, { data: childTutors, isSuccess: isSuccessChildTutors }] = useLazyGetChildBookingTutorsQuery();

    const dispatch = useDispatch();

    useEffect(() => {

        chat.socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
                notification.description = notification.description.replace(/date=\{(.*?)\}/g, function (match, token) {
                    return moment(new Date(token)).format('HH:mm, DD/MMM/YYYY');
                });
                notification.description = notification.description.replace(/stringTranslate=\{(.*?)\}/g, function (match, token) {
                    return t(token);
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

        chat.socket.on("onCancelFreeConsultation", async (buffer: any) => {

            if (freeConsultationRef.current) {
                dispatch(setConsultationInitialized(false));
                toast.dismiss(freeConsultationRef.current);
            }


            if (buffer.type == NotificationType.CHAT_MISSED_CALL) {

                let user: any = null;
                let user2: any = null;


                if (userId == buffer.studentId) {
                    user = userData.user;
                    user2 = await getUserById(buffer.tutorId).unwrap();
                } else {
                    user = await getUserById(buffer.studentId).unwrap();
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

                let messageText = buffer.message;
                messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                    return t(token);
                });
                messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                    return buffer.callerName;
                });
                dispatch(addMessage({
                    userId: user.Id,
                    tutorId: user2.Id,
                    message: {
                        message: messageText,
                        createdAt: buffer.createdAt,
                        isRead: buffer.isRead,
                        messageId: buffer.id,
                        isFile: false,
                        messageNew: true,
                    }
                }));
            }
        });

        chat.socket.on("acceptFreeConsultation", (buffer: any) => {
            freeConsultationRef.current = toastService.freeConsultation(
                buffer,
                () => { toast.dismiss(freeConsultationRef.current); },
                () => { toast.dismiss(freeConsultationRef.current); }
            );
            dispatch(setConsultationInitialized(true));
            dispatch(setBuffer(buffer));
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

        if (document && userId) {

            if (chat.newMessages > 0) {
                document.title = "Inbox(" + (chat.newMessages > 9 ? "9+" : chat.newMessages) + ") - Teorem";
            } else {
                document.title = "Teorem";
            }
        }

    }, [chat.newMessages]);

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
            dispatch(addChatRooms(childTutors || null));
        }
    }, [childTutors]);

    return <RenderRoutes routes={ROUTES} />;
}

export default App;


