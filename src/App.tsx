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
import { persistor } from "./app/store";
import { NotificationType } from './interfaces/notification/INotification';
import ISocketNotification from './interfaces/notification/ISocketNotification';
import { useLazyGetServerVersionQuery } from "./services/authService";
import { useLazyGetUserQuery } from './services/userService';
import { logout, setServerVersion } from "./slices/authSlice";
import { logoutUser } from "./slices/userSlice";

function App() {

    const { t } = useTranslation();

    const version = useAppSelector((state) => state.auth.serverVersion);

    const [versionSame, setVersionSame] = useState<boolean>(false);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const childIds = useAppSelector((state) => state.auth.user?.childIds);
    const chat = useAppSelector((state) => state.chat);
    const freeConsultationRef = useRef<any>(null);

    const [missedCall, setMissedCall] = useState<boolean | null>(null);
    const [missedCallBuffer, setMissedCallBuffer] = useState<any | null>(null);
    const [sendMessageObjectSet, setSendMessageObjectSet] = useState<boolean | null>(null);
    const [sendMessageObject, setSendMessageObject] = useState<any | null>(null);
    const chatDispatch = useDispatch();
    const userData = useAppSelector((state) => state.user);

    const [getUserById, { data: user2Data }] = useLazyGetUserQuery();
    const [getUserById2, { data: user2Data2 }] = useLazyGetUserQuery();
    const [getUserById1, { data: user2Data1 }] = useLazyGetUserQuery();
    const [getUserById3, { data: user2Data3 }] = useLazyGetUserQuery();

    const [getServerVersion, { data: serverVersion, isSuccess: isSuccessServerVersion }] = useLazyGetServerVersionQuery();

    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const [getChildBookingTutors, { data: childTutors, isSuccess: isSuccessChildTutors }] = useLazyGetChildBookingTutorsQuery();

    const dispatch = useDispatch();

    useEffect(() => {

        if (isSuccessServerVersion) {
            if (version != serverVersion) {


                if (userId) {
                    persistor.purge();
                    dispatch(logout());
                    dispatch(logoutUser());
                    dispatch({ type: 'USER_LOGOUT' });
                    setVersionSame(false);
                }

                dispatch(setServerVersion(serverVersion || '0.0.0'));

                setVersionSame(true);
            } else
                setVersionSame(true);
        }
    }, [version, isSuccessServerVersion]);

    useEffect(() => {

        if (user2Data && user2Data2 && missedCallBuffer) {

            let messageText = missedCallBuffer.message;
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return missedCallBuffer.callerName;
            });

            const message = {
                userId: user2Data.id + '',
                tutorId: user2Data2.id + '',
                message: {
                    message: messageText,
                    createdAt: missedCallBuffer.createdAt,
                    isRead: missedCallBuffer.isRead,
                    messageId: missedCallBuffer.id,
                    isFile: false,
                    messageNew: true,
                    messageMissedCall: true,
                },
                senderId: missedCallBuffer.senderId,
            };

            const chatRoom: IChatRoom = {
                user: {
                    userId: user2Data?.id + '',
                    userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user2Data?.firstName + ' ' + user2Data?.lastName,
                },
                tutor: {
                    userId: user2Data2?.id + '',
                    userImage: user2Data2?.profileImage || 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user2Data2?.firstName + ' ' + user2Data2?.lastName,
                },
                messages: [message],
                unreadMessageCount: 1
            };

            dispatch(addChatRoom(chatRoom));
        }

    }, [user2Data, user2Data2, missedCallBuffer]);

    useEffect(() => {

        if (missedCall && missedCallBuffer) {
            getUserById(missedCallBuffer.userId);
            getUserById2(missedCallBuffer.tutorId);
        }
    }, [missedCall, missedCallBuffer]);


    useEffect(() => {

        if (user2Data1 && user2Data3 && sendMessageObject) {

            let messageText = sendMessageObject.message;
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return sendMessageObject.callerName;
            });

            console.log(sendMessageObject);

            const message = {
                userId: user2Data1.id + '',
                tutorId: user2Data3.id + '',
                message: {
                    message: messageText,
                    createdAt: sendMessageObject.createdAt,
                    isRead: sendMessageObject.isRead,
                    messageId: sendMessageObject.id,
                    isFile: sendMessageObject.isFile,
                    messageNew: sendMessageObject.messageNew,
                    messageMissedCall: sendMessageObject.missedCall,
                },
                senderId: sendMessageObject.senderId,
            };

            const chatRoom: IChatRoom = {
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
                messages: [message],
                unreadMessageCount: 1
            };
            dispatch(addChatRoom(chatRoom));

            //dispatch(addMessage(message));
        }
    },
        [user2Data1, user2Data3, sendMessageObject]);

    useEffect(() => {

        if (sendMessageObject && sendMessageObjectSet) {
            getUserById1(sendMessageObject.userId);
            getUserById3(sendMessageObject.tutorId);
        }
    }, [sendMessageObject, sendMessageObjectSet]);

    useEffect(() => {

        getServerVersion();


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
            setSendMessageObjectSet(true);
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

        //TODO: set listener on message read ==> when both users are online

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

    return versionSame ? <RenderRoutes routes={ROUTES} /> : <></>;
}

export default App;