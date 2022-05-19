import { t } from 'i18next';
import { is } from 'immer/dist/internal';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSourceMapRange } from 'typescript';

import { useAppSelector } from '../../../hooks';
import { Role } from '../../../lookups/role';
import { PATHS } from '../../../routes';
import { useLazyGetFreeConsultationLinkQuery } from '../../../services/learnCubeService';
import { IChatMessagesQuery, useLazyGetChatMessagesQuery } from '../services/chatService';
import { addChatRoom, getMessages, IChatRoom, ISendChatMessage, readMessage, setBuffer, setConsultationInitialized, setFreeConsultation, setLink } from '../slices/chatSlice';
import FreeConsultationModal from './FreeConsultationModal';
import SendMessageForm from './SendMessageForm';

interface Props {
    data: IChatRoom | null;
}

const SingleConversation = (props: Props) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const userActive = useAppSelector((state) => state.auth.user);

    const chat = useAppSelector((state) => state.chat);

    const [page, setPage] = useState<number>(1);

    const [freeConsultationClicked, setFreeConsultationClicked] = useState<boolean>(false);
    const [freeCallExpired, setFreeCallExpired] = useState<boolean>(false);
    const [freeCallCancelled, setFreeCallCancelled] = useState<boolean | null>(null);

    const [getChatMessages, { data: chatMessages }] = useLazyGetChatMessagesQuery();

    const [getFreeConsultationLink, { data: freeConsultationLink, isSuccess: freeConsultationIsSuccess }] = useLazyGetFreeConsultationLinkQuery();

    const dispatch = useDispatch();

    const scrollToBottomSmooth = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    };

    let lastMessageUserId: string = '';

    useEffect(() => {

        chat.socket.on("onAcceptedFreeConsultation", (buffer: any) => {
            dispatch(setConsultationInitialized(true));
            setFreeConsultationClicked(false);
            dispatch(setFreeConsultation(true));
            dispatch(setLink(buffer.link + userActive?.id));
            dispatch(setBuffer(buffer));
        });

        chat.socket.on("onDeniedFreeConsultation", (buffer: any) => {
            setFreeCallCancelled(true);
            handleChatInit();
        });

        chat.socket.on("onCloseActiveFreeConsultation", (buffer: any) => {
            handleChatInit();
        });

    }, []);

    useEffect(() => {
        if (props.data && chatRef.current && props.data.messages.length <= chat.rpp) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    });

    useEffect(() => {
        if (chatMessages)
            dispatch(getMessages(chatMessages));
    }, [chatMessages]);

    useEffect(() => {

        if (props.data) {

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (chat.chatRooms[i].tutor?.userId == props.data.tutor?.userId && chat.chatRooms[i].user?.userId == props.data.user?.userId) {

                    for (let j = 0; j < chat.chatRooms[i].messages.length; j++) {

                        if (userActive?.id !== chat.chatRooms[i].messages[j].senderId) {
                            dispatch(readMessage(chat.chatRooms[i].messages[j]));
                        }
                    }
                }
            }
        }

    }, [props.data]);

    useEffect(() => {
        if (userActive && props.data) {

            const getMessagesObject: IChatMessagesQuery = {
                userId: (userActive.id == props.data?.user?.userId ? props.data.tutor?.userId : props.data?.user?.userId) || '',
                page: page,
                rpp: chat.rpp,
            };
            getChatMessages(getMessagesObject);
        }
    }, [page]);

    useEffect(() => {

        if (freeConsultationIsSuccess) {

            chat.socket.emit("joinFreeConsultation", {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink
            });
        }

    }, [freeConsultationLink]);

    useEffect(() => {

        if (freeCallExpired && !freeCallCancelled && !chat.freeConsultation) {

            let user0: any;
            let user1: any;

            if (props.data) {
                chat.socket.emit("cancelFreeConsultation", {
                    userId: props.data?.user?.userId,
                    tutorId: props.data?.tutor?.userId,
                    senderId: userActive?.id,
                    link: freeConsultationLink,
                    expired: true
                });

                user0 = props.data?.user?.userId;
                user1 = props.data?.tutor?.userId;
            }
            else if (chat.buffer) {
                chat.socket.emit("cancelFreeConsultation", {
                    userId: chat.buffer.userId,
                    tutorId: chat.buffer.tutorId,
                    senderId: chat.buffer.senderId,
                    link: chat.buffer.link,
                    expired: true
                });

                user0 = chat.buffer.userId;
                user1 = chat.buffer.tutorId;
            }

            handleChatInit();
            setFreeCallCancelled(false);


            let messageText = "stringTranslate={NOTIFICATIONS.CHAT_MISSED_CALL.DESCRIPTION} " + chat.user?.userNickname;
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return chat.user?.userNickname + '';
            });

            const message = {
                userId: user0.id + '',
                tutorId: user1.id + '',
                message: {
                    message: messageText,
                    createdAt: new Date(),
                    isRead: false,
                    messageId: '',
                    isFile: false,
                    messageNew: true,
                    messageMissedCall: true,
                },
                senderId: userActive?.id || chat.buffer?.senderId,
            };

            const chatRoom: IChatRoom = {
                user: {
                    userId: user0?.id + '',
                    userImage: 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user0?.firstName + ' ' + user0?.lastName,
                },
                tutor: {
                    userId: user1?.id + '',
                    userImage: user1?.profileImage || 'teorem.co:3000/profile/images/profilePictureDefault.jpg',
                    userNickname: user1.firstName + ' ' + user1?.lastName,
                },
                messages: [message],
                unreadMessageCount: 1
            };

            dispatch(addChatRoom(chatRoom));

        }
    },
        [freeCallExpired]);

    useEffect(() => {

        if (freeConsultationClicked) {
            setTimeout(() => {
                setFreeCallExpired(true);
            }, 10000);
        }

    }, [freeConsultationClicked]);

    const handleChatInit = (freeConsultation: boolean = false) => {
        dispatch(setConsultationInitialized(false));
        setFreeConsultationClicked(false);
        dispatch(setFreeConsultation(freeConsultation));
        dispatch(setLink(null));
    };

    const handleLoadMore = () => {
        setPage(page + 1);
    };

    const hideLoadMore = () => {
        let returnValue: boolean = false;
        if (props.data && chatMessages) {
            const totalPages = Math.ceil(chatMessages.length / chat.rpp);

            if (totalPages < 1) returnValue = true;
        }

        return returnValue;
    };

    //scroll to bottom alerter
    const handleScroll = (e: HTMLDivElement) => {

        const scrollPosition = 0;

        if (props.data && !hideLoadMore() && e.scrollTop === scrollPosition && props.data?.messages.length > 0) {
            handleLoadMore();
        }
        // if (innerHeight === scrollPosition) {
        //     //action to do on scroll to bottom
        //
        // }
    };

    const onFreeConsultation = () => {

        if (freeConsultationClicked == false) {
            getFreeConsultationLink(props.data?.tutor?.userId + '');
            setFreeConsultationClicked(true);
            dispatch(setConsultationInitialized(true));
            setFreeCallExpired(false);
        }
    };

    const onFreeConsultationClose = () => {

        if (props.data)
            chat.socket.emit("closeActiveFreeConsultation", {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink,
                expired: true
            });
        else if (chat.buffer)
            chat.socket.emit("closeActiveFreeConsultation", {
                userId: chat.buffer.userId,
                tutorId: chat.buffer.tutorId,
                senderId: userActive?.id,
                link: chat.buffer.link
            });

        handleChatInit(true);
        setFreeCallCancelled(false);

    };

    const onCancelFreeConsultation = () => {

        if (freeConsultationIsSuccess) {
            chat.socket.emit("cancelFreeConsultation", {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink
            });

            handleChatInit();
            setFreeCallCancelled(true);
        }
    };

    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);

    return (
        <div className="content">
            <div className="content__header content__header--chat">
                <div className="flex flex--center">
                    {props.data && userActive?.Role.abrv != Role.Tutor &&

                        <Link
                            className="chat-single-conversation-link"
                            to={`${t(PATHS.SEARCH_TUTORS_TUTOR_PROFILE).replace(":tutorId", `${props.data.tutor?.userId}`)}`}
                        >
                            {props.data &&
                                <img className="chat__conversation__avatar" src={props.data ? ('https://' + (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userImage : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')) : "teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg"} alt="chat avatar" />
                            }

                            <div className="ml-3 type--wgt--bold">{props.data ? (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userNickname : props.data.user?.userNickname) : "Odaberite osobu za razgovor"}</div>
                        </Link>
                    }

                    {props.data && userActive?.Role.abrv == Role.Tutor &&
                        <img className="chat__conversation__avatar" src={props.data ? ('https://' + (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userImage : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')) : "teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg"} alt="chat avatar" />
                    }

                    {props.data && userActive?.Role.abrv == Role.Tutor && <div className="ml-3 type--wgt--bold">{props.data ? (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userNickname : props.data.user?.userNickname) : "Odaberite osobu za razgovor"}</div>}
                </div>

                <div className='button-group-chat-header'>

                    {!chat.consultationInitialized && chat.activeChatRoom && <button
                        className={`btn btn--primary btn--base free-consultation-btn ${freeConsultationClicked && "free-consultation-btn-pressed"}`}
                        onClick={onFreeConsultation}>
                        {t('CHAT.FREE_CONSULTATION')}
                    </button>}

                    {freeConsultationClicked &&
                        <div className={`btn btn--primary btn--base free-consultation-btn ${freeConsultationClicked && "free-consultation-btn-pressed"}`}>
                            <i className={`icon--loader chat-load-more-small`}></i>
                        </div>
                    }
                    {chat.activeChatRoom && freeConsultationClicked && <button
                        className={`btn btn--error btn--base free-consultation-btn ${freeConsultationClicked && "free-consultation-btn-pressed"}`}
                        onClick={onCancelFreeConsultation}>
                        {t('CHAT.DENY_FREE_CONSULTATION')}
                    </button>
                    }
                    {props.data && (userActive?.id == props.data.user?.userId) && <Link
                        className="btn btn--primary btn--base"
                        to={t(PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(`:tutorId`, `${props.data.tutor?.userId}`))} >
                        {t('CHAT.BOOK_SESSION')}
                    </Link>}
                </div>
            </div>

            <div ref={chatRef} onScroll={(e: any) => debouncedScrollHandler(e.target)} className="content__main">

                {props.data && props.data.messages.length >= 20 && !hideLoadMore() && <div><i className={`icon--loader chat-load-more`}></i></div>}
                {props.data && props.data.messages.length == 0 &&
                    <div className={`chat_message_init_new`}>
                        <div className={`message-full-width flex flex--col flex--center`}>
                            <div className="type--right w--80--max">
                                <div className={`chat__message__item__center chat__message__item chat__message__item__init`}>
                                    <i>{t('CHAT.PLACEHOLDER')}</i>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {props.data && props.data.messages.length > 0 && props.data.messages.map((message: ISendChatMessage, index: number) => {

                    let img = false;

                    if (message.senderId !== lastMessageUserId) {
                        img = true;
                        lastMessageUserId = message.senderId + '';
                    }

                    if (props.data && index == props.data.messages.length - 1) {
                        //scrollToBottomSmooth();
                    }

                    let messageText = message.message.message || '';
                    messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                        return t(token);
                    });
                    messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                        return message.senderId == message.tutorId ? `${props.data?.tutor?.userNickname}` : `${props.data?.tutor?.userNickname}`;
                    });

                    if (userActive && userActive.id == message.senderId)
                        return (
                            <div key={index} className={`chat__message chat__message--logged${img ? " chat__message__margin-top" : ""}${img ? "" : " chat__message__margin-right"}`}>
                                {img && <img
                                    className="chat__conversation__avatar chat__conversation__avatar--small"
                                    src={props.data ? ('https://' + (message.senderId == props.data.tutor?.userId ? props.data.tutor?.userImage : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')) : "teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg"}
                                    alt={'profile avatar'} />
                                }
                                <div className={`message-full-width flex flex--col flex--end`}>
                                    <div className="type--right w--80--max">
                                        <div className={`chat__message__item__end chat__message__item chat__message__item--logged${message.message.isFile ? " chat-file-outline" : ""}`} dangerouslySetInnerHTML={{ __html: (message.message.isFile ? '<i class="icon--attachment chat-file-icon"></i>' : '') + messageText }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    return (
                        <div key={index} className={`chat__message chat__message--other${img ? " chat__message__margin-top" : ""}${img ? "" : " chat__message__margin-left"}`}>

                            {img && <img
                                className="chat__conversation__avatar chat__conversation__avatar--small"
                                src={props.data ? ('https://' + (message.senderId == props.data.tutor?.userId ? props.data.tutor?.userImage : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')) : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg'}
                                alt={'profile avatar'} />
                            }
                            <div className={`message-full-width flex flex--col`}>
                                <div className="w--80--max">
                                    <div className={`chat__message__item chat__message__item--other${message.message.isFile ? " chat-file-outline" : ""}`} dangerouslySetInnerHTML={{ __html: (message.message.isFile ? '<i class="icon--attachment chat-file-icon"></i>' : '') + messageText }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );

                })}
                <div style={{ marginTop: 80 }} ref={messagesEndRef} />
            </div>
            {props.data && <SendMessageForm data={props.data} scrollOnSend={scrollToBottomSmooth} />}
            {freeConsultationClicked && <div className='chat__overlay__free__consultation' onClick={(event: any) => { event.preventDefault(); event.stopPropagation(); }}></div>}

            {chat.freeConsultation && chat.link && <FreeConsultationModal link={chat.link} handleClose={onFreeConsultationClose} />}
        </div >
    );
};

export default SingleConversation;

