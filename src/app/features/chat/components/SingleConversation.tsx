import { t } from 'i18next';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { useLazyGetUserQuery } from '../../../../services/userService';
import { useAppSelector } from '../../../hooks';
import { Role } from '../../../lookups/role';
import { PATHS } from '../../../routes';
import { useLazyGetFreeConsultationLinkQuery } from '../../../services/learnCubeService';
import { IChatMessagesQuery, useLazyGetChatMessagesQuery } from '../services/chatService';
import {
    addChatRoom,
    getMessagesById,
    IChatRoom,
    ISendChatMessage,
    readMessages,
    setConsultationInitialized,
    setFreeConsultation,
    setLink,
} from '../slices/chatSlice';
import SendMessageForm from './SendMessageForm';
import ImageCircle from '../../../components/ImageCircle';
import { useLazyGetTutorProfileDataQuery } from '../../../../services/tutorService';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { saveAs } from 'file-saver';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { POSITION } from 'react-toastify/dist/utils';
import { IoCheckmarkCircleOutline, IoCheckmarkDone, IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { BsCheck, BsCheckAll, BsDownload, BsFillFileEarmarkFill } from 'react-icons/bs';
import { FaFileDownload } from 'react-icons/fa';
import { BiCheckCircle } from 'react-icons/bi';


interface Props {
    data: IChatRoom | null;
}

const SingleConversation = (props: Props) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const connectionRef = useRef<any>(null);
    const userActive = useAppSelector((state) => state.auth.user);
    const [getTutorById] = useLazyGetTutorProfileDataQuery();

    const chat = useAppSelector((state) => state.chat);

    const [page, setPage] = useState<number>(0);

    const [getUserById, { data: user2Data }] = useLazyGetUserQuery();
    const [getUserById2, { data: user2Data2 }] = useLazyGetUserQuery();

    const [freeConsultationClicked, setFreeConsultationClicked] = useState<boolean>(false);
    const [freeCallExpired, setFreeCallExpired] = useState<boolean>(false);
    const [freeCallCancelled, setFreeCallCancelled] = useState<boolean | null>(null);
    const [freeCallCancel, setFreeCallCancel] = useState<boolean>(false);

    const [myStream, setMyStream] = useState<any>(null);
    const [guestStream, setGuestStream] = useState<any>(null);

    const [getChatMessages, { data: chatMessages }] = useLazyGetChatMessagesQuery();

    const [getFreeConsultationLink, { data: freeConsultationLink, isSuccess: freeConsultationIsSuccess }] = useLazyGetFreeConsultationLinkQuery();

    const dispatch = useDispatch();

    const scrollToBottomSmooth = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    let lastMessageUserId: string = '';


    useEffect(() => {
        scrollToBottomSmooth();
    }, []);

    /*useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            setMyStream(stream);
        }).catch((err) => {
            console.log("error: " + err);
        });
    }, []);*/

    /*useEffect(() => {

        if (chat.buffer && chat.consultationInitialized) {

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: myStream,
                config: {
                    iceServers: [
                        {
                            urls: "stun:stun.teorem.rerootdev.xyz",
                            username: "teorem",
                            credential: "dev"
                        }
                    ]
                }
            });
            peer.on("signal", (data) => {

                const buff = {
                    userId: chat.buffer?.userId,
                    tutorId: chat.buffer?.tutorId,
                    senderId: chat.buffer?.senderId,
                    link: chat.buffer?.link,
                    signalData: data,
                };

                chat.socket.emit("acceptedFreeConsultation", buff);
            });
            peer.on("stream", (stream) => {
                console.log(stream);
                setGuestStream(stream);
            });

            if (chat.buffer.signalData)
                peer.signal(chat.buffer.signalData ? chat.buffer.signalData : '');
            connectionRef.current = peer;
        }

    }, [chat.buffer, chat.consultationInitialized]);*/

    /*useEffect(() => {
        chat.socket.on('onAcceptedFreeConsultation', (buffer: any) => {
            dispatch(setConsultationInitialized(true));
            setFreeConsultationClicked(false);
            dispatch(setFreeConsultation(true));
            dispatch(setLink(buffer.link + userActive?.id));
            dispatch(setBuffer(buffer));

            if (connectionRef.current) {
                connectionRef.current.signal(buffer.signalData);
            }
        });

        chat.socket.on('onDeniedFreeConsultation', (buffer: any) => {
            setFreeCallCancelled(true);
            handleChatInit();
        });

        chat.socket.on('onCloseActiveFreeConsultation', (buffer: any) => {
            handleChatInit();
            connectionRef.current.destroy();
        });
    }, []);*/

    useEffect(() => {
        if (props.data && chatRef.current && props.data.messages.length <= chat.rpp) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    });

    useEffect(() => {
        if (chatMessages && props.data){
            dispatch(
                getMessagesById({
                    userId: props.data.user?.userId + '',
                    tutorId: props.data?.tutor?.userId + '',
                    messages: chatMessages,
                })
            );
        }

    }, [chatMessages]);

    useEffect(() => {
        if (props.data) {
            dispatch(readMessages({
                userId: props.data.user?.userId + '',
                tutorId: props.data?.tutor?.userId + '',
            }));
        }
    }, [props.data]);

    useEffect(() => {
        if (userActive && props.data && page > 0) {
            const getMessagesObject: IChatMessagesQuery = {
                userId: (userActive.id == props.data?.user?.userId ? props.data.tutor?.userId : props.data?.user?.userId) || '',
                page: page,
                rpp: chat.rpp,
            };
            getChatMessages(getMessagesObject);
        }
    }, [page]);

    /*useEffect(() => {
        if (freeConsultationIsSuccess) {
            chat.socket.emit('joinFreeConsultation', {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink,
            });
        }
    }, [freeConsultationLink]);*/

    useEffect(() => {
        if (user2Data && user2Data2 && freeCallCancel) {
            let messageText = 'userInsert={username} stringTranslate={NOTIFICATIONS.CHAT_HAS_MISSED_CALL}';
            messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                return t(token);
            });
            messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                return userActive?.id !== user2Data.id
                    ? user2Data.firstName + ' ' + user2Data?.lastName
                    : user2Data2.firstName + ' ' + user2Data2?.lastName;
            });

            const message = {
                userId: user2Data.id + '',
                tutorId: user2Data2.id + '',
                message: {
                    message: messageText,
                    createdAt: new Date(),
                    isRead: true,
                    messageId: '',
                    isFile: false,
                    messageNew: true,
                    messageMissedCall: true,
                },
                senderId: (userActive?.id || chat.buffer?.senderId) == user2Data.id ? user2Data2.id : user2Data.id,
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
                    userNickname: user2Data2.firstName + ' ' + user2Data2?.lastName,
                },
                messages: [message],
                unreadMessageCount: 0,
            };
            
            dispatch(addChatRoom(chatRoom));

            /*chat.socket.emit('onMissedFreeConsultation', {
                userId: user2Data.id + '',
                tutorId: user2Data2.id + '',
                message: {
                    message: 'userInsert={username} stringTranslate={NOTIFICATIONS.CHAT_HAS_MISSED_CALL}',
                    createdAt: new Date(),
                    isRead: true,
                    messageId: '',
                    isFile: false,
                    messageNew: true,
                    messageMissedCall: true,
                },
                senderId: (userActive?.id || chat.buffer?.senderId) == user2Data.id ? user2Data.id : user2Data2.id,
            });*/

            //setFreeCallCancel(false);
        }
    }, [user2Data, user2Data2, freeCallCancel]);

    /*useEffect(() => {
        if (freeCallExpired && !freeCallCancelled && !chat.freeConsultation) {
            if (props.data) {
                chat.socket.emit('cancelFreeConsultation', {
                    userId: props.data?.user?.userId,
                    tutorId: props.data?.tutor?.userId,
                    senderId: userActive?.id,
                    link: freeConsultationLink,
                    expired: true,
                });
            } else if (chat.buffer) {
                chat.socket.emit('cancelFreeConsultation', {
                    userId: chat.buffer.userId,
                    tutorId: chat.buffer.tutorId,
                    senderId: chat.buffer.senderId,
                    link: chat.buffer.link,
                    expired: true,
                });
            }

            handleChatInit();
            setFreeCallCancelled(false);
        }
    }, [freeCallExpired]);

    useEffect(() => {
        if (freeConsultationClicked) {
            setTimeout(() => {
                setFreeCallExpired(true);
                dispatch(setConsultationInitialized(false));
            }, 10000);
        }
    }, [freeConsultationClicked]);*/

    const handleChatInit = (freeConsultation: boolean = false) => {
        dispatch(setConsultationInitialized(false));
        setFreeConsultationClicked(false);
        dispatch(setFreeConsultation(freeConsultation));
        dispatch(setLink(null));
    };

    const handleLoadMore = () => {
        console.log("handling more. Page: ", page);
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
            dispatch(setFreeConsultation(true));
            //getFreeConsultationLink(props.data?.tutor?.userId + '');
            setFreeConsultationClicked(true);
            dispatch(setConsultationInitialized(true));
            setFreeCallExpired(false);
        }
    };
    /*
    const onFreeConsultationClose = () => {
        if (props.data)
            chat.socket.emit('closeActiveFreeConsultation', {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink,
                expired: true,
            });
        else if (chat.buffer)
            chat.socket.emit('closeActiveFreeConsultation', {
                userId: chat.buffer.userId,
                tutorId: chat.buffer.tutorId,
                senderId: userActive?.id,
                link: chat.buffer.link,
            });

        handleChatInit(true);
        setFreeCallCancelled(false);
    };

    const onCancelFreeConsultation = () => {
        if (freeConsultationIsSuccess) {
            chat.socket.emit('cancelFreeConsultation', {
                userId: props.data?.user?.userId,
                tutorId: props.data?.tutor?.userId,
                senderId: userActive?.id,
                link: freeConsultationLink,
            });

            handleChatInit();
            setFreeCallCancelled(true);
            setFreeCallCancel(true);

            getUserById(props.data?.user?.userId + '');
            getUserById2(props.data?.tutor?.userId + '');
        }
    };*/

    const debouncedScrollHandler = debounce((e) => handleScroll(e), 500);

    let lastDate = '';
    let lastMessageTime: Date;
    let groupTimestamp = '';

    const [tutorSlug, setTutorSlug] = useState('');
    async function getTutorSlug() {
        if (props.data && props.data.tutor) {
            const tutorData = await getTutorById(props.data.tutor.userId).unwrap();
            setTutorSlug(tutorData.slug);
        }
    }
    useEffect(() => {
        getTutorSlug();
    }, [props?.data?.tutor?.userId]);

    function formatTime(hours:number, minutes:number) {
        // Pad single-digit hours and minutes with leading zeros
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        // Combine the formatted hours and minutes with a colon separator
        return `${formattedHours}:${formattedMinutes}`;
    }
    const downloadFile = (documentId: string | undefined)  => {
        //console.log('Dohvacam dokument s idjem: ', documentId);
        fetch(`http://localhost:8080/api/v1/chat/download/${documentId}`)
            .then(response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const fileName = contentDisposition?.split('=')[1];

                response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName + '';
                    a.click();
                });
            });
    };

    function downloadFile2(documentId: string | undefined) {
        fetch(`http://localhost:8080/api/v1/chat/chat-file/${documentId}`)
            .then(response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const fileName = contentDisposition?.split('=')[1];

                response.blob().then(blob => {
                    saveAs(blob, fileName);
                });
            });
    }


    return (
        <div className="content">
            <div className="content__header content__header--chat">
                <div className="flex flex--center">
                    {props.data && userActive?.Role.abrv != Role.Tutor && (
                        <Link
                            className="chat-single-conversation-link flex flex--center"
                            to={`${PATHS.SEARCH_TUTORS_TUTOR_PROFILE.replace(':tutorSlug', `${tutorSlug}`)}`}
                        >
                            {props.data && (
                                <img
                                    className="chat__conversation__avatar"
                                    src={
                                        props.data
                                            ? 'https://' +
                                            (userActive?.id != props.data.tutor?.userId
                                                ? props.data.tutor?.userImage
                                                : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')
                                            : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg'
                                    }
                                    alt="chat avatar"
                                />
                            )}

                            <div className="ml-3 type--wgt--bold">
                                {props.data
                                    ? userActive?.id != props.data.tutor?.userId
                                        ? props.data.tutor?.userNickname
                                        : props.data.user?.userNickname
                                    : 'Odaberite osobu za razgovor'}
                            </div>
                        </Link>
                    )}

                    {
                        props.data && userActive?.Role.abrv == Role.Tutor && (
                            <ImageCircle initials={`${props.data.user?.userNickname.charAt(0)}${props.data.user?.userNickname?.split(" ")[1]?.charAt(0)}`} />
                        )
                    }

                    {/*{props.data && userActive?.Role.abrv == Role.Tutor && (*/}
                    {/*    <img*/}
                    {/*        className="chat__conversation__avatar"*/}
                    {/*        src={*/}
                    {/*            props.data*/}
                    {/*                ? 'https://' +*/}
                    {/*                (userActive?.id != props.data.tutor?.userId*/}
                    {/*                    ? props.data.tutor?.userImage*/}
                    {/*                    : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')*/}
                    {/*                : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg'*/}
                    {/*        }*/}
                    {/*        alt="chat avatar"*/}
                    {/*    />*/}
                    {/*)}*/}

                    {props.data && userActive?.Role.abrv == Role.Tutor && (
                        <div className="ml-3 type--wgt--bold">
                            {props.data
                                ? userActive?.id != props.data.tutor?.userId
                                    ? props.data.tutor?.userNickname
                                    : props.data.user?.userNickname
                                : 'Odaberite osobu za razgovor'}
                        </div>
                    )}
                </div>

                {/*<div className="button-group-chat-header">*/}
                    {/*{!chat.consultationInitialized && chat.activeChatRoom && <button*/}
                    {/*    className={`btn btn--primary btn--base free-consultation-btn ${freeConsultationClicked && "free-consultation-btn-pressed"}`}*/}
                    {/*    onClick={onFreeConsultation}>*/}
                    {/*    {t('CHAT.FREE_CONSULTATION')}*/}
                    {/*</button>}*/}

                    {/*
                        freeConsultationClicked &&
                        <div className={`btn btn--primary btn--base free-consultation-btn ${freeConsultationClicked && "free-consultation-btn-pressed"}`}>
                            <i className={`icon--loader chat-load-more-small`}></i>
                        </div>
                    */}
                    {/*chat.activeChatRoom && freeConsultationClicked && (
                        <button
                            className={`btn btn--error btn--base free-consultation-btn ${freeConsultationClicked && 'free-consultation-btn-pressed'}`}
                            onClick={onCancelFreeConsultation}
                        >
                            {t('CHAT.DENY_FREE_CONSULTATION')}
                        </button>
                    )*/}
                    {/*{props.data && userActive?.id == props.data.user?.userId && (*/}
                    {/*    <Link*/}
                    {/*        className="btn btn--primary btn--base"*/}
                    {/*        to={t(PATHS.SEARCH_TUTORS_TUTOR_BOOKINGS.replace(`:tutorSlug`, `${props.data.tutor?.userId}`))}*/}
                    {/*    >*/}
                    {/*        {t('CHAT.BOOK_SESSION')}*/}
                    {/*    </Link>*/}
                    {/*)}*/}
                {/*</div>*/}
            </div>

            <div ref={chatRef} onScroll={(e: any) => debouncedScrollHandler(e.target)} className="content__main">
                {props.data && props.data.messages.length >= 20 && !hideLoadMore() && (
                    <div>
                        <i className={`icon--loader chat-load-more`}></i>
                    </div>
                )}
                {props.data && props.data.messages.length == 0 && (
                    <div className={`chat_message_init_new`}>
                        <div className={`message-full-width flex flex--col flex--center`}>
                            <div className="type--right w--80--max">
                                <div className={`chat__message__item__center chat__message__item chat__message__item__init`}>
                                    <i>{t('CHAT.PLACEHOLDER')}</i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {props.data &&
                    props.data.messages.length > 0 &&
                    props.data.messages.map((message: ISendChatMessage, index: number) => {
                        let img = false;

                        const temDat = new Date(message.message.createdAt);

                        if(lastMessageTime == undefined){
                          lastMessageTime = temDat;
                        }

                        if(groupTimestamp == ''){
                            groupTimestamp = formatTime(temDat.getHours(),temDat.getMinutes());
                        }

                        const difference = temDat.getTime() - lastMessageTime.getTime();
                        if (difference >= (30 * 60 * 1000)) {
                            groupTimestamp = formatTime(temDat.getHours(),temDat.getMinutes());
                        }

                        lastMessageTime = temDat;

                        const messageTime = formatTime(temDat.getHours(),temDat.getMinutes());

                        const tempDate = temDat.getDate() + '-' + temDat.getMonth() + '-' + temDat.getUTCFullYear() + ',' + groupTimestamp;

                        let sameDate = true;


                        if (lastDate != tempDate) {
                            sameDate = false;

                            lastDate = tempDate;
                        }

                        if (message.senderId !== lastMessageUserId) {
                            img = true;
                            lastMessageUserId = message.senderId + '';
                        }

                        if (props.data && index == props.data.messages.length - 1) {
                            //scrollToBottomSmooth();
                        }

                        if (message.message.messageMissedCall && userActive?.id == message.senderId) return <></>;

                        let messageText = message.message.message || '';
                        messageText = messageText.replace(/stringTranslate=\{(.*?)\}/g, function (match: any, token: any) {
                            return t(token);
                        });
                        messageText = messageText.replace(/userInsert=\{(.*?)\}/g, function (match: any, token: any) {
                            return message.senderId == message.tutorId ? `${props.data?.tutor?.userNickname}` : `${props.data?.user?.userNickname}`;
                        });

                        if (userActive && userActive.id == message.senderId)
                            return (
                                <>
                                    <Tooltip
                                        id="my-tooltip"
                                        place={'top-start'}
                                        positionStrategy={'absolute'}
                                        float={true}
                                        delayShow={1000}
                                        style={{ backgroundColor: "rgba(70,70,70, 0.9)", color: 'white', fontSize:'smaller' }}
                                    />
                                    {!sameDate && (
                                        <div className={`message-full-width flex flex--col flex--center`}>
                                            <span>{moment(message.message.createdAt).format('DD MMM YYYY')}, {messageTime}</span>
                                        </div>
                                    )}
                                    <div
                                        key={index}
                                        className={`chat__message chat__message--logged${img ? ' chat__message__margin-top' : ''}${img ? '' : ' chat__message__margin-right'
                                            }`}
                                    >
                                        {img && (
                                            props.data && (
                                                message.senderId == props.data.tutor?.userId ? (
                                                    <img
                                                        className="chat__conversation__avatar chat__conversation__avatar--small"
                                                        src={'https://' + props.data.tutor?.userImage}
                                                        alt={'profile avatar'}
                                                    />
                                                ) : (
                                                    <div style={{width: 40, height: 40}}>
                                                        <ImageCircle initials={`${userActive?.firstName.charAt(0)}${userActive?.lastName.charAt(0)}`} style={{width: 40, height: 40 }} fontSize={20} />
                                                    </div>
                                                )
                                            )
                                        )}
                                        {/*{img && (*/}
                                        {/*    <img*/}
                                        {/*        className="chat__conversation__avatar chat__conversation__avatar--small"*/}
                                        {/*        src={*/}
                                        {/*            props.data*/}
                                        {/*                ? 'https://' +*/}
                                        {/*                (message.senderId == props.data.tutor?.userId*/}
                                        {/*                    ? props.data.tutor?.userImage*/}
                                        {/*                    : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg')*/}
                                        {/*                : 'teorem.co:3000/teorem/profile/images/profilePictureDefault.jpg'*/}
                                        {/*        }*/}
                                        {/*        alt={'profile avatar'}*/}
                                        {/*    />*/}
                                        {/*)}*/}

                                        <div key={`sub-${index}`} className={`message-full-width flex flex--col flex--end`}>
                                            <div key={`sub-sub-${index}`} className="type--right w--80--max">
                                                <div
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-html={`Sent: ${messageTime} <br/>${message.message.isFile ? `File name: ${message.message.message}` : '' }`}
                                                    key={`sub-sub-sub-${index}`}
                                                    className={`d-inline-flex  chat__message__item__end chat__message__item chat__message__item--logged${message.message.isFile ? ' chat-file-outline' : ''}`}
                                                >{
                                                    (message.message.isFile ?
                                                            <div className='d-flex flex-row justify-content-between align-items-end'>
                                                                <BsFillFileEarmarkFill className='text-primary align-self-center'/>

                                                                <div className='d-flex flex-row justify-content-between'>
                                                                    <div className='text-break text-black align-self-center ml-2'>
                                                                        {message.message.message.length > 30 ?
                                                                                `${message.message.message.slice(0, 30)}...`
                                                                                :
                                                                                message.message.message}
                                                                    </div>

                                                                    <div role='button'
                                                                         className='d-inline-block h-auto shadow-sm align-self-center mx-2'
                                                                         onClick={()=>downloadFile(message.message.messageId)}
                                                                    >
                                                                        <BsDownload className='border-hover text-black'/>
                                                                    </div>

                                                                    {
                                                                        message.message.isRead ?
                                                                            <BsCheckAll className='align-self-end text-black'/>
                                                                            :
                                                                            <BsCheck className='align-self-end text-black'/>

                                                                    }
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='d-flex flex--start'>
                                                                <div className='mx-1'>
                                                                    {message.message.message}
                                                                </div>
                                                                {
                                                                    message.message.isRead ?
                                                                        <BsCheckAll className='align-self-end'/>
                                                                        :
                                                                        <BsCheck className='align-self-end'/>
                                                                }
                                                            </div>
                                                    )
                                                }
                                                    {/*dangerouslySetInnerHTML={{*/}
                                                    {/*    __html:*/}
                                                    {/*        (message.message.isFile ? '<i class="icon--attachment chat-file-icon" ></i>' : '') +*/}
                                                    {/*        messageText,*/}
                                                    {/*}}*/}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        return (
                            <>
                                {!sameDate && (
                                    <div className={`message-full-width flex flex--col flex--center`}>
                                        <span>{moment(message.message.createdAt).format('DD MMM YYYY')}, {messageTime}</span>
                                    </div>
                                )}
                                <div
                                    key={index}
                                    className={`chat__message chat__message--other${img ? ' chat__message__margin-top' : ''}${img ? '' : ' chat__message__margin-left'
                                        }`}
                                >
                                    {img && (
                                        props.data && (
                                            message.senderId == props.data.tutor?.userId ? (
                                                <img
                                                    className="chat__conversation__avatar chat__conversation__avatar--small"
                                                    src={'https://' + props.data.tutor?.userImage}
                                                    alt={'profile avatar'}
                                                />
                                            ) : (
                                                <div style={{width: 40, height: 40}}>
                                                    <ImageCircle initials={`${props.data.user?.userNickname.split(" ")[0].charAt(0)}${props.data.user?.userNickname.split(" ")[1].charAt(0)}`} style={{width: 40, height: 40 }} fontSize={20} />
                                                </div>
                                            )
                                        )
                                    )}

                                    <div key={`sub-${index}`} className={`message-full-width flex flex--col`}>
                                        <div key={`sub-sub-${index}`} className="w--80--max">
                                            <div
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-html={`Sent: ${messageTime} <br/>${message.message.isFile ? `File name: ${message.message.message}` : '' }`}
                                                key={`sub-sub-sub-${index}`}
                                                className={`chat__message__item chat__message__item--other${message.message.isFile ? ' chat-file-outline' : ''}`}
                                            >
                                               {
                                                   (message.message.isFile ?
                                                       <div className='d-flex flex-row justify-content-between align-items-end'>
                                                           <div className='d-inline-block'>
                                                               <i className="bi bi-file-earmark-fill text-primary"></i>
                                                           </div>
                                                           <div className='col d-inline-block text-truncate'>
                                                               {message.message.message.length > 30 ?
                                                                       `${message.message.message.slice(0, 30)}...`
                                                                           :
                                                                       message.message.message}
                                                           </div>
                                                           <div role='button'
                                                                className='d-inline-block h-auto shadow-sm'
                                                                onClick={()=>downloadFile(message.message.messageId)}
                                                           >
                                                               <i className="bi border-hover bi-download"></i>
                                                           </div>
                                                       </div>
                                                       :
                                                        <div>
                                                            <i className="icon--attachment chat-file-icon"/>
                                                            {message.message.message}
                                                        </div>
                                                   )
                                               }

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                <div style={{ marginTop: 80 }} ref={messagesEndRef} />
            </div>
            {props.data && <SendMessageForm data={props.data} scrollOnSend={scrollToBottomSmooth} />}

            {/*<div*/}
            {/*    className={`chat__overlay__free__consultation ${freeConsultationClicked ? '' : 'chat-overlay-disabled'}`}*/}
            {/*    onClick={(event: any) => {*/}
            {/*        event.preventDefault();*/}
            {/*        event.stopPropagation();*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <VideoPlayerModal videoChatActivated={freeConsultationClicked} callId={props.data?.user?.userId + "-" + props.data?.tutor?.userId} />*/}
            {/*</div>*/}

        </div>
    );
};

export default SingleConversation;
