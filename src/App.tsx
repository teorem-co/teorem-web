import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useLazyGetChatRoomsQuery, useLazyGetChildBookingTutorsQuery } from './app/features/chat/services/chatService';
import {
    addChatRoom,
    addChatRooms,
    addMessage,
    IChatRoom,
    IReadMessagePair,
    setBuffer,
    setConsultationInitialized,
    setMessagesAsRead,
    setUser,
} from './app/features/chat/slices/chatSlice';
import { useLazyGetCountriesQuery } from './app/store/services/countryService';
import { useAppSelector } from './app/store/hooks';
import { Role } from './app/types/role';
import ROUTES, { RenderRoutes } from './app/routes';
import toastService from './app/store/services/toastService';
import useMount from './app/utils/useMount';
import { NotificationType } from './app/types/notification/INotification';
import ISocketNotification from './app/types/notification/ISocketNotification';
import { useLazyGetServerVersionQuery } from './app/store/services/authService';
import { useLazyGetTutorTimeZoneQuery } from './app/store/services/tutorService';
import { useLazyGetUserQuery } from './app/store/services/userService';
import { setCountries } from './app/store/slices/countryMarketSlice';
import { setTimeZone } from './app/store/slices/timeZoneSlice';
import LoginModal from './app/features/auth/components/LoginModal';
import RegistrationModal from './app/features/auth/components/RegistrationModal';
import ResetPasswordModal from './app/features/auth/components/ResetPasswordModal';
import { useLazyGetTutorialStateQuery } from './app/store/services/tutorialService';
import { setTutorialFinished } from './app/store/slices/tutorialSlice';
import SEO from './app/components/Seo';
import { useLazyGetDegreesQuery } from './app/store/services/degreeService';
import { useLazyGetUniversitiesQuery } from './app/store/services/universityService';
import { setDegrees } from './app/store/slices/degreeSlice';
import { setUniversities } from './app/store/slices/universitySlice';

export default function App() {
    const { t } = useTranslation();

    const version = useAppSelector((state) => state.auth.serverVersion);

    const [versionSame, setVersionSame] = useState<boolean>(true);
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

    const [getServerVersion, { data: serverVersion, isSuccess: isSuccessServerVersion }] =
        useLazyGetServerVersionQuery();

    const [getChatRooms, { data: chatRooms, isSuccess: isSuccessChatRooms }] = useLazyGetChatRoomsQuery();
    const [getChildBookingTutors, { data: childTutors, isSuccess: isSuccessChildTutors }] =
        useLazyGetChildBookingTutorsQuery();
    const timeZoneState = useAppSelector((state) => state.timeZone);
    const [getTutorTimeZone] = useLazyGetTutorTimeZoneQuery();
    const dispatch = useDispatch();

    const [getCountries] = useLazyGetCountriesQuery();
    const [getDegrees] = useLazyGetDegreesQuery();
    const [getUniversities] = useLazyGetUniversitiesQuery();
    const [getTutorialState] = useLazyGetTutorialStateQuery();

    useMount(() => {
        if (!timeZoneState.timeZone) {
            setUserTimeZone();
        }
        getCountries()
            .unwrap()
            .then((res) => dispatch(setCountries(res)))
            .catch((e) => console.log(e));
        getDegrees()
            .unwrap()
            .then((res) => dispatch(setDegrees(res)))
            .catch((e) => console.log(e));
        getUniversities()
            .unwrap()
            .then((res) => dispatch(setUniversities(res)))
            .catch((e) => console.log(e));

        if (userId) {
            getTutorialState(userId)
                .unwrap()
                .then((res) => {
                    dispatch(setTutorialFinished(res.isFinished));
                })
                .catch((e) => console.log(e));
        }
    });

    async function setUserTimeZone() {
        if (!timeZoneState.timeZone) {
            if (userData?.user?.Role.abrv == Role.Tutor) {
                //Send request to get timezone from tutor
                const response = await getTutorTimeZone(userData.user?.id);
                if (response.data) {
                    dispatch(setTimeZone(response.data));
                    moment.tz.setDefault(response.data);
                } else {
                    dispatch(setTimeZone(moment.tz.guess()));
                    moment.tz.setDefault(moment.tz.guess());
                }
            } else {
                dispatch(setTimeZone(moment.tz.guess()));
                moment.tz.setDefault(moment.tz.guess());
            }
        }
    }

    // commenting this out untill we need it, hopefully never

    // useEffect(() => {
    //     if (isSuccessServerVersion) {
    //         if (version != serverVersion) {
    //             if (userId && version?.length) {
    //                 persistor.purge();
    //                 dispatch(logout());
    //                 dispatch(logoutUser());
    //                 dispatch({ type: 'USER_LOGOUT' });
    //                 setVersionSame(false);
    //             }

    //             dispatch(setServerVersion(serverVersion || '0.0.0'));

    //             setVersionSame(true);
    //         } else setVersionSame(true);
    //     }
    // }, [version, isSuccessServerVersion, serverVersion, userId, dispatch]);

    useEffect(() => {
        if (missedCall && missedCallBuffer) {
            getUserById(missedCallBuffer.userId);
            getUserById2(missedCallBuffer.tutorId);
        }
    }, [getUserById, getUserById2, missedCall, missedCallBuffer]);

    useEffect(() => {
        if (user2Data1 && user2Data3 && sendMessageObject) {
            if (sendMessageObject.userId != user2Data1.id) return;

            let messageText = sendMessageObject.message;
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return sendMessageObject.callerName;
            });

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
                    file: sendMessageObject.file,
                },
                senderId: sendMessageObject.senderId,
            };

            const chatRoom: IChatRoom = {
                user: {
                    userId: user2Data1.id + '',
                    userImage: user2Data1.profileImage,
                    userNickname: user2Data1?.firstName + ' ' + user2Data1?.lastName,
                },
                tutor: {
                    userId: user2Data3.id + '',
                    userImage: user2Data3.profileImage,
                    userNickname: user2Data3.firstName + ' ' + user2Data3.lastName,
                },
                messages: [message],
                unreadMessageCount: 1,
                addToList: true,
                setActive: false,
            };

            let exists = false;
            for (let i = 0; i < chat.chatRooms.length; i++) {
                if (
                    chat.chatRooms[i].tutor?.userId == sendMessageObject.tutorId &&
                    chat.chatRooms[i].user?.userId == sendMessageObject.userId
                )
                    exists = true;
            }

            exists ? dispatch(addMessage(message)) : dispatch(addChatRoom(chatRoom));
        }
    }, [user2Data1, user2Data3, sendMessageObject, dispatch, t, chat.chatRooms]);

    useEffect(() => {
        if (sendMessageObject && sendMessageObjectSet) {
            getUserById1(sendMessageObject.userId);
            getUserById3(sendMessageObject.tutorId);
        }
    }, [getUserById1, getUserById3, sendMessageObject, sendMessageObjectSet]);

    useMount(() => {
        getServerVersion();

        chat.socket.on('showNotification', (notification: ISocketNotification) => {
            const ifChildExists = childIds?.find((x) => x === notification.userId);
            if (userId && (notification.userId === userId || ifChildExists)) {
                notification.description = notification.description.replace(/date=\{(.*?)\}/g, function (match, token) {
                    return moment(new Date(token)).format('HH:mm, ' + t('DATE_FORMAT'));
                });
                notification.description = notification.description.replace(
                    /stringTranslate=\{(.*?)\}/g,
                    function (match, token) {
                        return t(token);
                    }
                );

                toastService.notification(notification.description);
            }
        });

        chat.socket.on('messageReceive', (sendMessageObject: any) => {
            setSendMessageObjectSet(true);
            setSendMessageObject(sendMessageObject);
        });

        chat.socket.on('onCancelFreeConsultation', async (buffer: any) => {
            if (freeConsultationRef.current) {
                dispatch(setConsultationInitialized(false));
                toast.dismiss(freeConsultationRef.current);
            }

            if (buffer.type == NotificationType.CHAT_MISSED_CALL) {
                setMissedCall(true);
                setMissedCallBuffer(buffer);
            }
        });

        chat.socket.on('markMessagesRead', (messagePair: IReadMessagePair) => {
            dispatch(setMessagesAsRead(messagePair));
        });

        chat.socket.on('acceptFreeConsultation', (buffer: any) => {
            freeConsultationRef.current = toastService.freeConsultation(
                buffer,
                () => {
                    toast.dismiss(freeConsultationRef.current);
                },
                () => {
                    toast.dismiss(freeConsultationRef.current);
                }
            );
            dispatch(setConsultationInitialized(true));
            dispatch(setBuffer(buffer));
        });

        return function disconnectSocket() {
            chat.socket.disconnect();
        };
    });

    useEffect(() => {
        if (isSuccessChatRooms) {
            dispatch(addChatRooms(chatRooms || null));

            chat.socket.disconnect();
            chat.socket.connect();
            chat.socket.emit('chatEntered', {
                userId: userId,
            });
        }
    }, [chat.socket, chatRooms, dispatch, isSuccessChatRooms, userId]);

    useEffect(() => {
        if (document && userId) {
            document.title = 'Teorem';
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            if (userData.user?.Role.abrv == Role.Child) getChildBookingTutors();

            getChatRooms({
                limitMessages: 20,
                rpp: 1000,
                page: 1,
            });

            chatDispatch(
                setUser({
                    userId: userData.user?.id + '',
                    userNickname: userData.user?.firstName + '' + ' ' + (userData.user?.lastName + ''),
                    userImage: userData.user?.profileImage,
                })
            );
        }
    }, [chatDispatch, getChatRooms, getChildBookingTutors, userData, userId]);

    useEffect(() => {
        if (isSuccessChildTutors) {
            dispatch(addChatRooms(childTutors || null));
        }
    }, [childTutors, dispatch, isSuccessChildTutors]);

    return versionSame ? (
        <>
            <RenderRoutes routes={ROUTES} />
            <SEO />
            <LoginModal />
            <RegistrationModal />
            <ResetPasswordModal />
        </>
    ) : null;
}
