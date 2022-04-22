import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import { Role } from '../../../lookups/role';
import { PATHS } from '../../../routes';
import { IChatRoom, ISendChatMessage, readMessage } from '../slices/chatSlice';
import SendMessageForm from './SendMessageForm';

interface Props {
    data: IChatRoom | null;
}

const SingleConversation = (props: Props) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userActive = useAppSelector((state) => state.auth.user);

    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    const scrollToBottomFast = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });

    };
    const scrollToBottomSmooth = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    };

    let lastMessageUserId: string = '';

    useEffect(() => {

        if (props.data) {

            console.log(props.data);

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (chat.chatRooms[i].tutor?.userId == props.data.tutor?.userId && chat.chatRooms[i].user?.userId == props.data.user?.userId) {

                    for (let j = 0; j < chat.chatRooms[i].messages.length; j++) {

                        if (userActive?.id !== chat.chatRooms[i].messages[j].senderId) {
                            dispatch(readMessage(chat.chatRooms[i].messages[j]));
                        }
                    }
                }
            }

            scrollToBottomFast();
        }

    }, [props.data]);

    return (
        <div className="content">
            <div className="content__header content__header--chat">
                <div className="flex flex--center">
                    {props.data && userActive?.Role.abrv != Role.Tutor &&

                        <Link
                            className="chat-single-conversation-link"
                            to={`${PATHS.SEARCH_TUTORS}/profile/${props.data.tutor?.userId}`}
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
                {props.data && (userActive?.id == props.data.user?.userId) && <Link
                    className="btn btn--primary btn--base"
                    to={`/search-tutors/bookings/${props.data.tutor?.userId}`} >
                    Book a session
                </Link>}

            </div>

            <div className="content__main">
                {props.data && props.data.messages.length == 0 &&
                    <div className={`chat_message_init_new`}>
                        <div className={`message-full-width flex flex--col flex--center`}>
                            <div className="type--right w--80--max">
                                <div className={`chat__message__item__center chat__message__item chat__message__item__init`}>
                                    <i>Send a message to start a conversation</i>
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

                    if (props.data && index == props.data?.messages.length - 1)
                        scrollToBottomSmooth();

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
                                        <div className={`chat__message__item__end chat__message__item chat__message__item--logged${message.message.isFile ? " chat-file-outline" : ""}`} dangerouslySetInnerHTML={{ __html: (message.message.isFile ? '<i class="icon--attachment chat-file-icon"></i>' : '') + message.message.message }}>
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
                                    <div className={`chat__message__item chat__message__item--other${message.message.isFile ? " chat-file-outline" : ""}`} dangerouslySetInnerHTML={{ __html: (message.message.isFile ? '<i class="icon--attachment chat-file-icon"></i>' : '') + message.message.message }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div style={{ marginTop: 80 }} ref={messagesEndRef} />
            </div>
            {props.data && <SendMessageForm data={props.data} />}

        </div >
    );
};

export default SingleConversation;

