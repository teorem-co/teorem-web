import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useLazyGetChatRoomsQuery, useLazyGetChildBookingTutorsQuery } from './app/features/chat/services/chatService';
import { addChatRoom, addChatRooms, addMessage, IChatRoom, setBuffer, setConsultationInitialized, setUser } from './app/features/chat/slices/chatSlice';
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

    const [missedCall, setMissedCall] = useState<boolean | null>(null);
    const [missedCallBuffer, setMissedCallBuffer] = useState<any | null>(null);
    const [sendMessageObject, setSendMessageObject] = useState<any | null>(null);
    const chatDispatch = useDispatch();
    const userData = useAppSelector((state) => state.user);

    const [getUserById, { data: user2Data, }] = useLazyGetUserQuery();
    const [getUserById1, { data: user2Data1 }] = useLazyGetUserQuery();
    const [getUserById3, { data: user2Data3 }] = useLazyGetUserQuery();
    const [getUserById2, { data: user2Data2, }] = useLazyGetUserQuery();
    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const [getChildBookingTutors, { data: childTutors, isSuccess: isSuccessChildTutors }] = useLazyGetChildBookingTutorsQuery();

    const dispatch = useDispatch();

    useEffect(() => {


        if (user2Data && user2Data2 && missedCallBuffer) {
            let user0: any;
            let user1: any;

            if (userData.user?.Role.abrv != Role.Tutor) {
                user0 = user2Data.id == userId ? user2Data : user2Data2;
                user1 = user2Data.id != userId ? user2Data : user2Data2;
            } else {
                user0 = user2Data.id != userId ? user2Data : user2Data2;
                user1 = user2Data.id == userId ? user2Data : user2Data2;
            }

            let messageText = missedCallBuffer.message;
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return missedCallBuffer.callerName;
            });

            const message = {
                userId: user0.id + '',
                tutorId: user1.id + '',
                message: {
                    message: messageText,
                    createdAt: missedCallBuffer.createdAt,
                    isRead: missedCallBuffer.isRead,
                    messageId: missedCallBuffer.id,
                    isFile: false,
                    messageNew: true,
                    messageMissedCall: true,
                }
            };

            const chatRoom: IChatRoom = {
                user: {
                    userId: user1?.id + '',
                    userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user1?.firstName + ' ' + user1?.lastName,
                },
                tutor: {
                    userId: user0?.id + '',
                    userImage: user0?.profileImage || 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user0?.firstName + ' ' + user0?.lastName,
                },
                messages: [message],
                unreadMessageCount: 1
            };

            dispatch(addChatRoom(chatRoom));
        }

    }, [user2Data, user2Data2, missedCallBuffer]);

    useEffect(() => {

        if (missedCall && missedCallBuffer) {
            getUserById(missedCallBuffer.tutorId);
            getUserById2(missedCallBuffer.userId);
        }
    }, [missedCall, missedCallBuffer]);


    useEffect(() => {

        console.log(user2Data1, user2Data3, sendMessageObject);
        if (user2Data1 && user2Data3 && sendMessageObject) {

            dispatch(addChatRoom({
                user: {
                    userId: user2Data1.id + '',
                    userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user2Data1?.firstName + ' ' + user2Data1?.lastName,
                },
                tutor: {
                    userId: user2Data3.id + '',
                    userImage: user2Data3.profileImage || 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user2Data3.firstName + ' ' + user2Data3.lastName,
                },
                messages: [sendMessageObject],
                unreadMessageCount: 1
            }));

            //dispatch(addMessage());
        }
    },
        [user2Data1, user2Data3, sendMessageObject]);

    useEffect(() => {

        console.log(sendMessageObject);
        if (sendMessageObject) {
            getUserById1(sendMessageObject.userId);
            getUserById3(sendMessageObject.tutorId);
        }
    }, [sendMessageObject]);

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

        chat.socket.on('messageReceive', (sendMessageObject: any) => {

            setSendMessageObject(sendMessageObject);
        });

        chat.socket.on("onCancelFreeConsultation", async (buffer: any) => {

            if (freeConsultationRef.current) {
                dispatch(setConsultationInitialized(false));
                toast.dismiss(freeConsultationRef.current);
            }

            if (buffer.type == NotificationType.CHAT_MISSED_CALL) {

                setMissedCall(true);
                setMissedCallBuffer(buffer);
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

            if (chat.newMessages != null && chat.newMessages > 0) {
                document.title = "Inbox(" + (chat.newMessages > 9 ? "9+" : chat.newMessages) + ") - Teorem";
            } else if (chat.newMessages == 0) {
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


