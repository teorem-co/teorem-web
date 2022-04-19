import React, { useRef } from 'react';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../hooks';
import { IChatRoom, readMessage, ISendChatMessage } from '../slices/chatSlice';
import SendMessageForm from './SendMessageForm';

interface Props {
    data: IChatRoom | null;
}

const SingleConversation = (props: Props) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userActive = useAppSelector((state) => state.auth.user);

    const chat = useAppSelector((state) => state.chat);

    const dispatch = useDispatch();

    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    };

    let lastMessageUserId: string = '';

    useEffect(() => {

        if (props.data) {

            for (let i = 0; i < chat.chatRooms.length; i++) {

                if (chat.chatRooms[i].tutor?.userId == props.data.tutor?.userId && chat.chatRooms[i].user?.userId == props.data.user?.userId) {

                    for (let j = 0; j < chat.chatRooms[i].messages.length; j++) {

                        if (userActive?.id !== chat.chatRooms[i].messages[j].senderId)
                            dispatch(readMessage(chat.chatRooms[i].messages[j]));
                    }
                }
            }
        }

    }, [props.data]);

    return (
        <div className="content">
            <div className="content__header content__header--chat">
                <div className="flex flex--center">
                    <img className="chat__conversation__avatar" src={props.data ? ('https://' + (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userImage : props.data.user?.userImage)) : ""} alt="chat avatar" />

                    <div className="ml-3 type--wgt--bold">{props.data ? (userActive?.id != props.data.tutor?.userId ? props.data.tutor?.userNickname : props.data.user?.userNickname) : ""}</div>
                </div>
                <button className="btn btn--primary btn--base">Book a session</button>
            </div>

            <div className="content__main">
                {props.data && props.data.messages.map((message: ISendChatMessage, index: number) => {

                    let img = false;

                    if (message.senderId !== lastMessageUserId) {
                        img = true;
                        lastMessageUserId = message.senderId + '';
                    }

                    if (props.data && index == props.data?.messages.length - 1)
                        scrollToBottom();

                    if (userActive && userActive.id == message.senderId)
                        return (
                            <div className="chat__message chat__message--logged">
                                {img && <img
                                    className="chat__conversation__avatar chat__conversation__avatar--small"
                                    src={props.data ? ('https://' + (message.senderId == props.data.tutor?.userId ? props.data.tutor?.userImage : props.data.user?.userImage)) : ""}
                                    alt={'profile avatar'} />
                                }
                                <div className="message-full-width flex flex--col flex--end">
                                    <div className="type--right w--80--max">
                                        <div className="chat__message__item__end chat__message__item chat__message__item--logged">
                                            {message.message.message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    return (
                        <div className="chat__message chat__message--other">

                            {img && <img
                                className="chat__conversation__avatar chat__conversation__avatar--small"
                                src={props.data ? ('https://' + (message.senderId == props.data.tutor?.userId ? props.data.tutor?.userImage : props.data.user?.userImage)) : ""}
                                alt={'profile avatar'} />
                            }
                            <div className="message-full-width flex flex--col">
                                <div className="w--80--max">
                                    <div className="chat__message__item chat__message__item--other">
                                        {message.message.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div style={{ marginTop: 80 }} ref={messagesEndRef} />
            </div>
            <div className="content__footer content__footer--chat">
                <SendMessageForm data={props.data} />
            </div>
        </div>
    );
};

export default SingleConversation;

